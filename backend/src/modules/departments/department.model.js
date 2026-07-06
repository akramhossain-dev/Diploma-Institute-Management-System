import mongoose from "mongoose";

/**
 * Department — institute academic department (e.g. CST, EET, Civil)
 * Referenced by: students, teachers, courses, batches, notices
 */
const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Department name is required"],
      trim: true,
      unique: true,
    },
    code: {
      type: String,
      required: [true, "Department code is required"],
      trim: true,
      uppercase: true,
      unique: true,
      match: [/^[A-Z]{2,10}$/, "Code must be 2–10 uppercase letters"],
    },
    shortName: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },
    headTeacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      default: null,                       // assigned in Phase 4 when teachers are built
    },
    createdByAdminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

departmentSchema.index({ code: 1 }, { unique: true });
departmentSchema.index({ name: 1 }, { unique: true });
departmentSchema.index({ status: 1 });

const Department = mongoose.model("Department", departmentSchema);
export default Department;
