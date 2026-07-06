import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

/**
 * FeeStructure — reusable fee template/catalog entry.
 *
 * May be globally scoped (no dept/sem/session) or narrowly scoped.
 * Assigned to students via StudentFeeAssignment documents.
 *
 * Status:
 *   active   → can be assigned to students
 *   inactive → disabled, existing assignments unaffected
 *   archived → retired, kept for historical reference
 */
const feeStructureSchema = new mongoose.Schema(
  {
    title:   { type: String, required: [true, "Fee title is required"], trim: true },
    feeCode: { type: String, trim: true, default: null, uppercase: true },

    feeType: {
      type:     String,
      enum:     ["admission", "semester", "exam", "lab", "library", "transport", "hostel", "misc", "custom"],
      required: [true, "Fee type is required"],
    },
    description: { type: String, trim: true, default: null },

    // ── Academic scope (all nullable = global fee) ────────────────────────
    departmentId:      { type: ObjectId, ref: "Department",      default: null },
    semesterId:        { type: ObjectId, ref: "Semester",        default: null },
    academicSessionId: { type: ObjectId, ref: "AcademicSession", default: null },

    // ── Amount config ─────────────────────────────────────────────────────
    amount:   { type: Number, required: [true, "Amount is required"], min: 0 },
    currency: { type: String, trim: true, default: "BDT" },
    frequency: {
      type:    String,
      enum:    ["one_time", "monthly", "semesterly", "yearly", "custom"],
      default: "one_time",
    },
    allowPartialPayment: { type: Boolean, default: true },

    // ── Validity window ───────────────────────────────────────────────────
    effectiveFrom: { type: Date, default: null },
    effectiveTo:   { type: Date, default: null },

    // ── Lifecycle ─────────────────────────────────────────────────────────
    status: {
      type:    String,
      enum:    ["active", "inactive", "archived"],
      default: "active",
    },
    createdByAdminId: { type: ObjectId, ref: "Admin", default: null },
  },
  { timestamps: true }
);

feeStructureSchema.index({ feeType:          1 });
feeStructureSchema.index({ departmentId:     1, semesterId: 1, academicSessionId: 1 });
feeStructureSchema.index({ academicSessionId: 1 });
feeStructureSchema.index({ status:           1 });
feeStructureSchema.index({ feeCode:          1 }, { sparse: true });

const FeeStructure = mongoose.model("FeeStructure", feeStructureSchema);
export default FeeStructure;
