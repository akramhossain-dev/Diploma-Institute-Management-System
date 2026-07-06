import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

/**
 * ExamCourseMapping — maps a course into an exam with its marks config.
 *
 * One document per exam+course combination.
 * Prevents duplicate mappings via compound unique index.
 *
 * marksEntryStatus controls whether teachers/admins can still submit marks:
 *   open      → marks can be entered/edited
 *   finalized → marks are done, result generation can proceed
 *   locked    → no further changes allowed
 */
const examCourseMappingSchema = new mongoose.Schema(
  {
    // ── Core link ─────────────────────────────────────────────────────────
    examId:   { type: ObjectId, ref: "Exam",   required: [true, "Exam is required"] },
    courseId: { type: ObjectId, ref: "Course", required: [true, "Course is required"] },

    // ── Optional teacher context ───────────────────────────────────────────
    teacherId:              { type: ObjectId, ref: "Teacher",          default: null },
    teacherAssignmentId:    { type: ObjectId, ref: "TeacherAssignment", default: null },

    // ── Denormalized context (aligned with exam context) ──────────────────
    departmentId:      { type: ObjectId, ref: "Department",      required: [true] },
    semesterId:        { type: ObjectId, ref: "Semester",        required: [true] },
    academicSessionId: { type: ObjectId, ref: "AcademicSession", required: [true] },

    // ── Per-course exam scheduling ─────────────────────────────────────────
    examDate:  { type: Date,   default: null },
    startTime: { type: String, default: null },   // "HH:MM"
    endTime:   { type: String, default: null },   // "HH:MM"
    room:      { type: String, trim: true, default: null },

    // ── Marks configuration ───────────────────────────────────────────────
    fullMarks: {
      type: Number, required: [true, "Full marks is required"], min: 1,
    },
    passMarks: {
      type: Number, required: [true, "Pass marks is required"], min: 0,
    },
    // Optional breakdown: theory/practical/viva/attendance
    marksComponents: [
      {
        component: { type: String, trim: true },   // "theory", "practical", "viva"
        fullMarks:  { type: Number, min: 0 },
        passMarks:  { type: Number, min: 0 },
        _id:        false,
      },
    ],

    // ── Lifecycle ─────────────────────────────────────────────────────────
    status: {
      type:    String,
      enum:    ["active", "inactive", "cancelled"],
      default: "active",
    },
    marksEntryStatus: {
      type:    String,
      enum:    ["open", "finalized", "locked"],
      default: "open",
    },

    createdByAdminId: { type: ObjectId, ref: "Admin", default: null },
    notes:            { type: String, trim: true, default: null },
  },
  { timestamps: true }
);

// One course per exam — no duplicates
examCourseMappingSchema.index(
  { examId: 1, courseId: 1 },
  { unique: true, name: "unique_exam_course_mapping" }
);
examCourseMappingSchema.index({ examId:     1, status: 1 });
examCourseMappingSchema.index({ courseId:   1 });
examCourseMappingSchema.index({ teacherId:  1 });
examCourseMappingSchema.index({ academicSessionId: 1 });

const ExamCourseMapping = mongoose.model("ExamCourseMapping", examCourseMappingSchema);
export default ExamCourseMapping;
