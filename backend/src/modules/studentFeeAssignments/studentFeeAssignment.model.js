import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const studentFeeAssignmentSchema = new mongoose.Schema(
  {
    
    studentId: { type: ObjectId, ref: "Student", required: [true, "Student is required"] },

    feeStructureId:    { type: ObjectId, ref: "FeeStructure", default: null },
    titleSnapshot:     { type: String, required: [true, "Fee title is required"], trim: true },
    feeTypeSnapshot:   { type: String, required: [true, "Fee type is required"] },
    sourceType: {
      type:    String,
      enum:    ["fee_structure", "manual", "admission", "semester_promotion", "exam_fee", "other"],
      default: "fee_structure",
    },
    sourceReferenceId: { type: ObjectId, default: null },   

    amountDue:       { type: Number, required: [true], min: 0 },
    discountAmount:  { type: Number, default: 0, min: 0 },
    waiverAmount:    { type: Number, default: 0, min: 0 },
    fineAmount:      { type: Number, default: 0, min: 0 },
    finalAmount:     { type: Number, required: [true], min: 0 },   
    amountPaid:      { type: Number, default: 0, min: 0 },
    amountRemaining: { type: Number, required: [true], min: 0 },   
    currency:        { type: String, default: "BDT" },

    billingStatus: {
      type:    String,
      enum:    ["unpaid", "partial", "paid", "waived", "cancelled", "overdue"],
      default: "unpaid",
    },

    departmentId:      { type: ObjectId, ref: "Department",      required: [true] },
    semesterId:        { type: ObjectId, ref: "Semester",        required: [true] },
    academicSessionId: { type: ObjectId, ref: "AcademicSession", required: [true] },

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
    sparse:  true,                    
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
