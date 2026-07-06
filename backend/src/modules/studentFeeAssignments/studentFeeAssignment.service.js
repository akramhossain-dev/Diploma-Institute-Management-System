import StudentFeeAssignment from "./studentFeeAssignment.model.js";
import FeeStructure from "../feeStructures/feeStructure.model.js";
import Student from "../students/student.model.js";
import Payment from "../payments/payment.model.js";
import ApiError from "../../utils/ApiError.js";
import { computeFinalAmount, computeBillingStatus, computeAmountRemaining } from "../../utils/finance.js";
import { getPaginationParams, buildPaginationMeta } from "../../utils/pagination.js";

// ── Internal: compute + apply finance fields ────────────────────────────────
function applyFinanceFields(amountDue, discountAmount = 0, waiverAmount = 0, fineAmount = 0, amountPaid = 0) {
  const finalAmount     = computeFinalAmount(amountDue, discountAmount, waiverAmount, fineAmount);
  const amountRemaining = computeAmountRemaining(finalAmount, amountPaid);
  const billingStatus   = computeBillingStatus(finalAmount, amountPaid);
  return { finalAmount, amountRemaining, billingStatus };
}

const studentFeeAssignmentService = {

  // ── Manual assignment (single student, custom or fee-structure-based) ──────
  async createAssignment(data, adminId) {
    const { studentId, feeStructureId, amountDue, discountAmount = 0, waiverAmount = 0, fineAmount = 0 } = data;

    const student = await Student.findById(studentId).lean();
    if (!student) throw new ApiError(404, "Student not found", "NOT_FOUND");

    let titleSnapshot   = data.titleSnapshot;
    let feeTypeSnapshot = data.feeTypeSnapshot;

    if (feeStructureId) {
      const fs = await FeeStructure.findById(feeStructureId).lean();
      if (!fs) throw new ApiError(404, "Fee structure not found", "NOT_FOUND");
      if (fs.status !== "active") throw new ApiError(400, "Only active fee structures can be assigned", "BUSINESS_RULE_VIOLATION");
      titleSnapshot   = titleSnapshot   || fs.title;
      feeTypeSnapshot = feeTypeSnapshot || fs.feeType;
    }

    const { finalAmount, amountRemaining, billingStatus } = applyFinanceFields(amountDue, discountAmount, waiverAmount, fineAmount);

    const assignment = await StudentFeeAssignment.create({
      ...data,
      titleSnapshot, feeTypeSnapshot,
      finalAmount, amountRemaining, billingStatus,
      amountPaid:       0,
      assignedByAdminId: adminId,
    });

    return assignment;
  },

  // ── Bulk assign a fee structure to all matching students ──────────────────
  async bulkAssign(data, adminId) {
    const { feeStructureId, departmentId, semesterId, academicSessionId, dueDate, discountAmount = 0, waiverAmount = 0, fineAmount = 0, notes } = data;

    const fs = await FeeStructure.findById(feeStructureId).lean();
    if (!fs) throw new ApiError(404, "Fee structure not found", "NOT_FOUND");
    if (fs.status !== "active") throw new ApiError(400, "Only active fee structures can be bulk-assigned", "BUSINESS_RULE_VIOLATION");

    const students = await Student.find({
      departmentId, semesterId, academicSessionId, status: "active",
    }).select("_id").lean();

    if (!students.length) throw new ApiError(404, "No active students found for this context", "NOT_FOUND");

    const { finalAmount, amountRemaining, billingStatus } = applyFinanceFields(fs.amount, discountAmount, waiverAmount, fineAmount);

    // bulkWrite with upsert: skip students who already have this assignment
    const bulkOps = students.map((s) => ({
      updateOne: {
        filter: { studentId: s._id, feeStructureId, academicSessionId },
        update: {
          $setOnInsert: {
            studentId:       s._id,
            feeStructureId,
            titleSnapshot:   fs.title,
            feeTypeSnapshot: fs.feeType,
            sourceType:      "fee_structure",
            amountDue:       fs.amount,
            discountAmount, waiverAmount, fineAmount,
            finalAmount, amountRemaining, billingStatus,
            amountPaid:      0,
            currency:        fs.currency || "BDT",
            departmentId, semesterId, academicSessionId,
            dueDate:         dueDate || null,
            assignedByAdminId: adminId,
            notes:           notes  || null,
            createdAt:       new Date(),
            updatedAt:       new Date(),
          },
        },
        upsert: true,
      },
    }));

    const result = await StudentFeeAssignment.bulkWrite(bulkOps, { ordered: false });
    return { assigned: result.upsertedCount, skipped: students.length - result.upsertedCount };
  },

  async getAllAssignments(query) {
    const { page, limit, skip } = getPaginationParams(query);
    const { studentId, billingStatus, departmentId, semesterId, academicSessionId, feeTypeSnapshot, search } = query;

    const filter = {};
    if (studentId)         filter.studentId         = studentId;
    if (billingStatus)     filter.billingStatus     = billingStatus;
    if (departmentId)      filter.departmentId      = departmentId;
    if (semesterId)        filter.semesterId        = semesterId;
    if (academicSessionId) filter.academicSessionId = academicSessionId;
    if (feeTypeSnapshot)   filter.feeTypeSnapshot   = feeTypeSnapshot;
    if (search)            filter.titleSnapshot     = { $regex: search, $options: "i" };

    const [assignments, total] = await Promise.all([
      StudentFeeAssignment.find(filter)
        .populate("studentId",      "fullName studentId rollNumber")
        .populate("feeStructureId", "title feeCode")
        .sort({ createdAt: -1 })
        .skip(skip).limit(limit).lean(),
      StudentFeeAssignment.countDocuments(filter),
    ]);

    return { assignments, pagination: buildPaginationMeta(total, page, limit) };
  },

  async getAssignmentById(id) {
    const a = await StudentFeeAssignment.findById(id)
      .populate("studentId",      "fullName studentId rollNumber email")
      .populate("feeStructureId", "title feeCode amount")
      .populate("departmentId",   "name code")
      .populate("semesterId",     "name number")
      .lean();
    if (!a) throw new ApiError(404, "Fee assignment not found", "NOT_FOUND");
    return a;
  },

  async updateAssignment(id, data) {
    const assignment = await StudentFeeAssignment.findById(id);
    if (!assignment) throw new ApiError(404, "Fee assignment not found", "NOT_FOUND");

    if (["paid", "cancelled", "waived"].includes(assignment.billingStatus)) {
      throw new ApiError(400, `Cannot edit a '${assignment.billingStatus}' assignment`, "BUSINESS_RULE_VIOLATION");
    }

    const newDiscount = data.discountAmount ?? assignment.discountAmount;
    const newWaiver   = data.waiverAmount   ?? assignment.waiverAmount;
    const newFine     = data.fineAmount     ?? assignment.fineAmount;

    const { finalAmount, amountRemaining, billingStatus } = applyFinanceFields(
      assignment.amountDue, newDiscount, newWaiver, newFine, assignment.amountPaid
    );

    const updated = await StudentFeeAssignment.findByIdAndUpdate(
      id,
      {
        $set: {
          discountAmount: newDiscount, waiverAmount: newWaiver, fineAmount: newFine,
          dueDate: data.dueDate ?? assignment.dueDate,
          notes:   data.notes   ?? assignment.notes,
          finalAmount, amountRemaining, billingStatus,
        },
      },
      { new: true }
    ).lean();

    return updated;
  },

  async updateStatus(id, status, notes) {
    const assignment = await StudentFeeAssignment.findById(id);
    if (!assignment) throw new ApiError(404, "Fee assignment not found", "NOT_FOUND");

    if (["paid", "cancelled"].includes(assignment.billingStatus)) {
      throw new ApiError(400, `Cannot change status of a '${assignment.billingStatus}' assignment`, "BUSINESS_RULE_VIOLATION");
    }

    const update = { billingStatus: status };
    if (notes) update.notes = notes;

    // If waived, mark amountRemaining = 0 and waiverAmount covers the rest
    if (status === "waived") {
      update.waiverAmount    = assignment.finalAmount - assignment.amountPaid;
      update.finalAmount     = assignment.amountPaid;
      update.amountRemaining = 0;
    }

    const updated = await StudentFeeAssignment.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();
    return updated;
  },

  // ── LEDGER — aggregated finance summary per student ───────────────────────
  async getStudentLedger(studentId, query = {}) {
    const { academicSessionId } = query;

    const filter = { studentId };
    if (academicSessionId) filter.academicSessionId = academicSessionId;

    const [assignments, payments] = await Promise.all([
      StudentFeeAssignment.find(filter)
        .populate("feeStructureId", "title feeCode")
        .sort({ createdAt: -1 })
        .lean(),
      Payment.find({ studentId, paymentStatus: "completed" })
        .sort({ paymentDate: -1 })
        .lean(),
    ]);

    const totalBilled  = assignments.reduce((s, a) => s + a.finalAmount, 0);
    const totalPaid    = assignments.reduce((s, a) => s + a.amountPaid, 0);
    const totalDue     = assignments.reduce((s, a) => s + a.amountRemaining, 0);

    const unpaidItems   = assignments.filter((a) => ["unpaid", "overdue"].includes(a.billingStatus));
    const partialItems  = assignments.filter((a) => a.billingStatus === "partial");
    const paidItems     = assignments.filter((a) => a.billingStatus === "paid");
    const recentPayments = payments.slice(0, 10);

    return {
      studentId,
      academicSessionId: academicSessionId || null,
      summary: {
        totalBilled:  Math.round(totalBilled  * 100) / 100,
        totalPaid:    Math.round(totalPaid    * 100) / 100,
        totalDue:     Math.round(totalDue     * 100) / 100,
        unpaidCount:  unpaidItems.length,
        partialCount: partialItems.length,
        paidCount:    paidItems.length,
      },
      unpaidItems, partialItems, paidItems,
      recentPayments,
      allAssignments: assignments,
    };
  },
};

export default studentFeeAssignmentService;
