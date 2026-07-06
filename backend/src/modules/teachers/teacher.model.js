import mongoose from "mongoose";

/**
 * Teacher entity profile collection.
 */
const teacherSchema = new mongoose.Schema(
  {
    employeeId:     { type: String, unique: true, trim: true },        // e.g. TCH-2024-001
    fullName:       { type: String, required: true, trim: true },
    email:          { type: String, required: true, lowercase: true, trim: true },
    phone:          { type: String, trim: true },
    photo:          { type: String, default: null },
    designation:    { type: String, trim: true },                      // Lecturer, HOD, etc.
    qualification:  { type: String, trim: true },
    specialization: { type: String, trim: true },
    departmentId:   { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    assignedCourses:[{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
    joiningDate:    { type: Date },
    status: {
      type: String,
      enum: ["active", "on_leave", "resigned"],
      default: "active",
    },
  },
  { timestamps: true }
);

teacherSchema.index({ employeeId: 1 }, { unique: true, sparse: true });
teacherSchema.index({ departmentId: 1 });

const Teacher = mongoose.model("Teacher", teacherSchema);
export default Teacher;
