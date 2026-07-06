import mongoose from "mongoose";

/**
 * Course — a diploma subject/course that belongs to a department and semester.
 * Referenced by: attendance, results, exams, teacher assignments
 */
const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
    },
    code: {
      type: String,
      required: [true, "Course code is required"],
      trim: true,
      uppercase: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },
    credit: {
      type: Number,
      required: [true, "Credit hours are required"],
      min: [0.5, "Credit must be at least 0.5"],
      max: [10,  "Credit cannot exceed 10"],
    },
    type: {
      type: String,
      enum: ["theory", "practical", "lab", "project", "viva"],
      default: "theory",
    },
    departmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: [true, "Department is required"],
    },
    semesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
      required: [true, "Semester is required"],
    },
    assignedTeacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      default: null,                          // assigned in Phase 4
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    createdByAdminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true }
);

courseSchema.index({ code:         1 }, { unique: true });
courseSchema.index({ departmentId: 1 });
courseSchema.index({ semesterId:   1 });
courseSchema.index({ status:       1 });
courseSchema.index({ departmentId: 1, semesterId: 1 });

const Course = mongoose.model("Course", courseSchema);
export default Course;
