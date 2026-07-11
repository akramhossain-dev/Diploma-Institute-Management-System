import mongoose from "mongoose";
import Payment from "./payment.model.js";
import StudentFeeAssignment from "../studentFeeAssignments/studentFeeAssignment.model.js";
import Student from "../students/student.model.js";
import { isPaymentBreakdownValid, computeBillingStatus, computeAmountRemaining } from "../../utils/finance.js";
import ApiError from "../../utils/ApiError.js";
import { getPaginationParams, buildPaginationMeta } from "../../utils/pagination.js";

const paymentService = {

  // CREATE PAYMENT — atomic via MongoDB transaction
  // Creates payment + updates all targeted fee assignments in one transaction
  
  async createPayment(data, collectorId, collectorType) {
    const { studentId, paymentItems, totalAmount } = data;

    // 1. Validate student
    const student = await Student.findById(studentId).lean();
    if (!student) throw new ApiError(404, "Student not found", "NOT_FOUND");

    // 2. Validate breakdown sums to total
    if (!isPaymentBreakdownValid(totalAmount, paymentItems)) {
      throw new ApiError(400, "Sum of paymentItems.amountApplied must equal totalAmount", "VALIDATION_ERROR");
    }

    // 3. Load and validate all fee assignments
    const assignmentIds = paymentItems.map((i) => i.studentFeeAssignmentId);
    const assignments   = await StudentFeeAssignment.find({ _id: { $in: assignmentIds } }).lean();

    const assignmentMap = {};
    for (const a of assignments) assignmentMap[String(a._id)] = a;

    for (const item of paymentItems) {
      const a = assignmentMap[String(item.studentFeeAssignmentId)];
      if (!a) throw new ApiError(404, `Fee assignment ${item.studentFeeAssignmentId} not found`, "NOT_FOUND");
      if (String(a.studentId) !== String(studentId)) {
        throw new ApiError(400, `Fee assignment ${item.studentFeeAssignmentId} belongs to a different student`, "CONTEXT_MISMATCH");
      }
      if (["paid", "cancelled", "waived"].includes(a.billingStatus)) {
        throw new ApiError(400, `Fee assignment '${a.titleSnapshot}' is already ${a.billingStatus}`, "BUSINESS_RULE_VIOLATION");
      }
      if (item.amountApplied > a.amountRemaining + 0.01) {  // 0.01 tolerance
        throw new ApiError(400, `amountApplied (${item.amountApplied}) exceeds remaining balance (${a.amountRemaining}) for '${a.titleSnapshot}'`, "AMOUNT_OVERFLOW");
      }
    }

    // 4. Execute atomically via MongoDB session/transaction
    const session = await mongoose.startSession();
    let payment;

    try {
      session.startTransaction();

      // Create payment document
      const [createdPayment] = await Payment.create(
        [
          {
            ...data,
            collectedByAccountantId: collectorType === "accountant" ? collectorId : null,
            collectedByAdminId:      collectorType === "admin"      ? collectorId : null,
            paymentStatus: "completed",
          },
        ],
        { session }
      );
      payment = createdPayment;

      for (const item of paymentItems) {
        const a           = assignmentMap[String(item.studentFeeAssignmentId)];
        const newPaid      = Math.round((a.amountPaid + item.amountApplied) * 100) / 100;
        const newRemaining = computeAmountRemaining(a.finalAmount, newPaid);
        const newStatus    = computeBillingStatus(a.finalAmount, newPaid);

        await StudentFeeAssignment.findByIdAndUpdate(
          item.studentFeeAssignmentId,
          { $set: { amountPaid: newPaid, amountRemaining: newRemaining, billingStatus: newStatus } },
          { session }
        );
      }

      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }

    return payment;
  },

  async getAllPayments(query) {
    const { page, limit, skip } = getPaginationParams(query);
    const { studentId, collectedByAccountantId, paymentMethod, paymentStatus, fromDate, toDate } = query;

    const filter = {};
    if (studentId)               filter.studentId               = studentId;
    if (collectedByAccountantId) filter.collectedByAccountantId = collectedByAccountantId;
    if (paymentMethod)           filter.paymentMethod           = paymentMethod;
    if (paymentStatus)           filter.paymentStatus           = paymentStatus;
    if (fromDate || toDate) {
      filter.paymentDate = {};
      if (fromDate) filter.paymentDate.$gte = new Date(fromDate);
      if (toDate)   filter.paymentDate.$lte = new Date(toDate);
    }

    const [payments, total] = await Promise.all([
      Payment.find(filter)
        .populate("studentId",                "fullName studentId")
        .populate("collectedByAccountantId",  "fullName staffId")
        .populate("collectedByAdminId",       "fullName adminId")
        .sort({ paymentDate: -1 })
        .skip(skip).limit(limit).lean(),
      Payment.countDocuments(filter),
    ]);

    return { payments, pagination: buildPaginationMeta(total, page, limit) };
  },

  async getPaymentById(id) {
    const p = await Payment.findById(id)
      .populate("studentId",                          "fullName studentId rollNumber")
      .populate("collectedByAccountantId",            "fullName staffId")
      .populate("collectedByAdminId",                 "fullName adminId")
      .populate("paymentItems.studentFeeAssignmentId","titleSnapshot amountDue finalAmount billingStatus")
      .lean();
    if (!p) throw new ApiError(404, "Payment not found", "NOT_FOUND");
    return p;
  },

  async reversePayment(id, reversalReason, adminId) {
    const payment = await Payment.findById(id).lean();
    if (!payment) throw new ApiError(404, "Payment not found", "NOT_FOUND");
    if (payment.paymentStatus !== "completed") {
      throw new ApiError(400, `Cannot reverse a '${payment.paymentStatus}' payment`, "BUSINESS_RULE_VIOLATION");
    }

    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      // Mark payment as reversed
      await Payment.findByIdAndUpdate(
        id,
        { $set: { paymentStatus: "reversed", reversedAt: new Date(), reversalReason, reversedByAdminId: adminId } },
        { session }
      );

      // Restore fee assignment balances
      for (const item of payment.paymentItems) {
        const a = await StudentFeeAssignment.findById(item.studentFeeAssignmentId).session(session).lean();
        if (!a) continue;

        const restoredPaid      = Math.max(0, Math.round((a.amountPaid - item.amountApplied) * 100) / 100);
        const restoredRemaining = computeAmountRemaining(a.finalAmount, restoredPaid);
        const restoredStatus    = computeBillingStatus(a.finalAmount, restoredPaid);

        await StudentFeeAssignment.findByIdAndUpdate(
          item.studentFeeAssignmentId,
          { $set: { amountPaid: restoredPaid, amountRemaining: restoredRemaining, billingStatus: restoredStatus } },
          { session }
        );
      }

      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }

    return Payment.findById(id).lean();
  },
};

export default paymentService;
