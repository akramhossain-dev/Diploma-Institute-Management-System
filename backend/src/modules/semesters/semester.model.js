import mongoose from "mongoose";

const semesterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Semester name is required"],
      trim: true,
      unique: true,
    },
    number: {
      type: Number,
      required: [true, "Semester number is required"],
      unique: true,
      min: [1, "Semester number must be at least 1"],
      max: [12, "Semester number cannot exceed 12"],
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Semester = mongoose.model("Semester", semesterSchema);
export default Semester;
