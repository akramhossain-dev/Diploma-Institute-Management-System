import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

/**
 * StudentFeeAssignment — the actual billing obligation for a student.
 *
 * One document per fee item per student.
 * Created either from a FeeStructure template or manually.
 *
 * Finance invariants maintained by the service layer:
 *   finalAmount  = amountDue - discountAmount - waiverAmount + fineAmount  (≥ 0)
 *   amountRemaining = finalAmount - amountPaid                             (≥ 0)
 *   billingStatus computed from amountPaid vs finalAmount
 *
 * billingStatus machine:
 *   unpaid → partial → paid
 *   unpaid/partial → waived   (admin decision)
 *   unpaid/partial → cancelled
 *   unpaid/partial → overdue  (schedule-based, not implemented here)
 */
const studentFeeAssignmentSchema = new mongoose.Schema(
  {
    // ── Student ──────────────────────────────────────────────────────────
    studentId: { type: ObjectId, ref: "Student", required: [true, "Student is required"] },

    // ── Source ────────────────────────────────────────────────────────────
    feeStructureId:    { type: ObjectId, ref: "FeeStructure", default: null },
    titleSnapshot:     { type: String, required: [true, "Fee title is required"], trim: true },
    feeTypeSnapshot:   { type: String, required: [true, "Fee type is required"] },
    sourceType: {
      type:    String,
      enum:    ["fee_structure", "manual", "admission", "semester_promotion", "exam_fee", "other"],
      default: "fee_structure",
    },
    sourceReferenceId: { type: ObjectId, default: null },   // optional examId / admissionId etc.

    // ── Finance amounts ───────────────────────────────────────────────────
    amountDue:       { type: Number, required: [true], min: 0 },
    discountAmount:  { type: Number, default: 0, min: 0 },
    waiverAmount:    { type: Number, default: 0, min: 0 },
    fineAmount:      { type: Number, default: 0, min: 0 },
    finalAmount:     { type: Number, required: [true], min: 0 },   // computed by service
    amountPaid:      { type: Number, default: 0, min: 0 },
    amountRemaining: { type: Number, required: [true], min: 0 },   // computed by service
    currency:        { type: String, default: "BDT" },

    // ── Billing status ────────────────────────────────────────────────────
    billingStatus: {
      type:    String,
      enum:    ["unpaid", "partial", "paid", "waived", "cancelled", "overdue"],
      default: "unpaid",
    },

    // ── Academic context ──────────────────────────────────────────────────
    departmentId:      { type: ObjectId, ref: "Department",      required: [true] },
    semesterId:        { type: ObjectId, ref: "Semester",        required: [true] },
    academicSessionId: { type: ObjectId, ref: "AcademicSession", required: [true] },

    // ── Billing context ───────────────────────────────────────────────────
    dueDate:          { type: Date, default: null },
    assignedByAdminId: { type: ObjectId, ref: "Admin", default: null },
    notes:            { type: String, trim: true, default: null },
  },
  { timestamps: true }
);

// Prevent duplicate assignment of same fee structure to same student in same session
studentFeeAssignmentSchema.index(
  { studentId: 1, feeStructureId: 1, academicSessionId: 1 },
  {
    unique:  true,
    sparse:  true,                    // sparse: feeStructureId may be null (manual bills)
    name:    "unique_student_fee_structure_per_session",
  }
);

studentFeeAssignmentSchema.index({ studentId:         1 });
studentFeeAssignmentSchema.index({ billingStatus:     1 });
studentFeeAssignmentSchema.index({ departmentId:      1, semesterId: 1, academicSessionId: 1 });
studentFeeAssignmentSchema.index({ academicSessionId: 1 });
studentFeeAssignmentSchema.index({ dueDate:           1 }, { sparse: true });
studentFeeAssignmentSchema.index({ studentId:         1, academicSessionId: 1, billingStatus: 1 });

const StudentFeeAssignment = mongoose.model("StudentFeeAssignment", studentFeeAssignmentSchema);
export default StudentFeeAssignment;
