import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

/**
 * ClassRoutine — defines the official weekly schedule for a class.
 *
 * Time is stored as "HH:MM" (24-hour string) to allow
 * lexicographic comparison in overlap-detection queries.
 * e.g. "08:00" < "09:30" works correctly as a string comparison.
 *
 * Conflict detection rules (enforced in service, not DB):
 *  1. Same teacher — no overlapping time slot on same day
 *  2. Same room   — no overlapping time slot on same day (if room set)
 *  3. Same dept+semester+section — no overlapping slot on same day
 *
 * Status:
 *   active    → currently scheduled
 *   inactive  → temporarily suspended
 *   cancelled → permanently removed from schedule
 */
const classRoutineSchema = new mongoose.Schema(
  {
    // ── Academic context ─────────────────────────────────────────────────
    teacherAssignmentId: { type: ObjectId, ref: "TeacherAssignment", default: null },
    teacherId:           { type: ObjectId, ref: "Teacher",           required: [true, "Teacher is required"] },
    courseId:            { type: ObjectId, ref: "Course",            required: [true, "Course is required"] },
    departmentId:        { type: ObjectId, ref: "Department",        required: [true, "Department is required"] },
    semesterId:          { type: ObjectId, ref: "Semester",          required: [true, "Semester is required"] },
    academicSessionId:   { type: ObjectId, ref: "AcademicSession",   required: [true, "Academic session is required"] },
    section:             { type: String, trim: true, default: null },
    shift:               { type: String, enum: ["Morning", "Day", "Evening"], default: null },

    // ── Schedule ──────────────────────────────────────────────────────────
    dayOfWeek: {
      type:     String,
      enum:     ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      required: [true, "Day of week is required"],
    },
    startTime: { type: String, required: [true, "Start time is required"] },  // "HH:MM"
    endTime:   { type: String, required: [true, "End time is required"] },    // "HH:MM"
    room:      { type: String, trim: true, default: null },                   // Room / Lab code

    // ── Validity window ───────────────────────────────────────────────────
    effectiveFrom: { type: Date, default: null },
    effectiveTo:   { type: Date, default: null },

    // ── Status ────────────────────────────────────────────────────────────
    routineStatus: {
      type:    String,
      enum:    ["active", "inactive", "cancelled"],
      default: "active",
    },

    createdByAdminId: { type: ObjectId, ref: "Admin", default: null },
    notes:            { type: String, trim: true, default: null },
  },
  { timestamps: true }
);

// Indexes for conflict detection queries
classRoutineSchema.index({ teacherId: 1, dayOfWeek: 1, routineStatus: 1 });
classRoutineSchema.index({ departmentId: 1, semesterId: 1, section: 1, dayOfWeek: 1, routineStatus: 1 });
classRoutineSchema.index({ room: 1, dayOfWeek: 1, routineStatus: 1 }, { sparse: true });
classRoutineSchema.index({ academicSessionId: 1 });
classRoutineSchema.index({ courseId: 1 });

const ClassRoutine = mongoose.model("ClassRoutine", classRoutineSchema);
export default ClassRoutine;
