import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

/**
 * AttendanceSession — one document per class/date/course/teacher context.
 *
 * Represents a single class occurrence on a specific date.
 * AttendanceRecord documents reference this session (one per student).
 *
 * Status:
 *   open      → teacher can still mark / edit records
 *   finalized → locked, no further edits
 *   cancelled → class was cancelled (no records needed)
 */
const attendanceSessionSchema = new mongoose.Schema(
  {
    
    courseId:            { type: ObjectId, ref: "Course",            required: [true, "Course is required"] },
    teacherId:           { type: ObjectId, ref: "Teacher",           required: [true, "Teacher is required"] },
    departmentId:        { type: ObjectId, ref: "Department",        required: [true, "Department is required"] },
    semesterId:          { type: ObjectId, ref: "Semester",          required: [true, "Semester is required"] },
    academicSessionId:   { type: ObjectId, ref: "AcademicSession",   required: [true, "Academic session is required"] },
    section:             { type: String, trim: true, default: null },

    teacherAssignmentId: { type: ObjectId, ref: "TeacherAssignment", default: null },
    classRoutineId:      { type: ObjectId, ref: "ClassRoutine",      default: null },

    attendanceDate: { type: Date, required: [true, "Attendance date is required"] },
    topic:          { type: String, trim: true, default: null },  

    sessionStatus: {
      type:    String,
      enum:    ["open", "finalized", "cancelled"],
      default: "open",
    },
    markedByTeacherId: { type: ObjectId, ref: "Teacher", default: null },
    markedByAdminId:   { type: ObjectId, ref: "Admin",   default: null },

    totalStudents:  { type: Number, default: 0 },
    presentCount:   { type: Number, default: 0 },
    absentCount:    { type: Number, default: 0 },
    lateCount:      { type: Number, default: 0 },
    excusedCount:   { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Prevent duplicate sessions for same course+date+section+session
attendanceSessionSchema.index(
  { courseId: 1, attendanceDate: 1, academicSessionId: 1, section: 1 },
  { unique: true, name: "unique_attendance_session" }
);
attendanceSessionSchema.index({ teacherId:         1, attendanceDate: 1 });
attendanceSessionSchema.index({ departmentId:      1, semesterId: 1, attendanceDate: 1 });
attendanceSessionSchema.index({ academicSessionId: 1 });
attendanceSessionSchema.index({ attendanceDate:    1 });
attendanceSessionSchema.index({ sessionStatus:     1 });

const AttendanceSession = mongoose.model("AttendanceSession", attendanceSessionSchema);
export default AttendanceSession;
