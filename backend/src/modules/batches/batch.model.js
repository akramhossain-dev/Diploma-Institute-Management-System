import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const batchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Batch name is required"],
      trim: true,
      unique: true,
    },
    code: {
      type: String,
      required: [true, "Batch code is required"],
      trim: true,
      unique: true,
      uppercase: true,
    },
    academicSessionId: {
      type: ObjectId,
      ref: "AcademicSession",
      required: [true, "Academic Session reference is required"],
    },
    departmentId: {
      type: ObjectId,
      ref: "Department",
      required: [true, "Department reference is required"],
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Batch = mongoose.model("Batch", batchSchema);

export default Batch;
