import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

/**
 * TeacherAssignment — maps a teacher to a course within a specific
 * academic context (department / semester / session / section).
 *
 * This is the BASE mapping record.  ClassRoutines and Attendance
 * may reference this document to anchor their academic context.
 *
 * Status:
 *   active    → currently in use
 *   inactive  → paused / suspended
 *   completed → session ended
 */
const teacherAssignmentSchema = new mongoose.Schema(
  {
    teacherId:         { type: ObjectId, ref: "Teacher",         required: [true, "Teacher is required"] },
    courseId:          { type: ObjectId, ref: "Course",          required: [true, "Course is required"] },
    departmentId:      { type: ObjectId, ref: "Department",      required: [true, "Department is required"] },
    semesterId:        { type: ObjectId, ref: "Semester",        required: [true, "Semester is required"] },
    academicSessionId: { type: ObjectId, ref: "AcademicSession", required: [true, "Academic session is required"] },

    section: { type: String, trim: true, default: null },
    shift:   { type: String, enum: ["Morning", "Day", "Evening"], default: null },
    group:   { type: String, trim: true, default: null },

    assignmentStatus: {
      type: String,
      enum:    ["active", "inactive", "completed"],
      default: "active",
    },

    assignedByAdminId: { type: ObjectId, ref: "Admin", default: null },
    notes:             { type: String, trim: true, default: null },
  },
  { timestamps: true }
);

// Block duplicate active assignments: same teacher + course + session + section
teacherAssignmentSchema.index(
  { teacherId: 1, courseId: 1, academicSessionId: 1, section: 1 },
  {
    unique: true,
    partialFilterExpression: { assignmentStatus: "active" },
    name: "unique_active_teacher_assignment",
  }
);

teacherAssignmentSchema.index({ teacherId:         1 });
teacherAssignmentSchema.index({ courseId:          1 });
teacherAssignmentSchema.index({ departmentId:      1 });
teacherAssignmentSchema.index({ semesterId:        1 });
teacherAssignmentSchema.index({ academicSessionId: 1 });
teacherAssignmentSchema.index({ assignmentStatus:  1 });
teacherAssignmentSchema.index({ teacherId: 1, academicSessionId: 1 });

const TeacherAssignment = mongoose.model("TeacherAssignment", teacherAssignmentSchema);
export default TeacherAssignment;
