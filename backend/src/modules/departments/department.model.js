import mongoose from "mongoose";

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
      default: null,                       
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

departmentSchema.index({ status: 1 });

const Department = mongoose.model("Department", departmentSchema);
export default Department;
