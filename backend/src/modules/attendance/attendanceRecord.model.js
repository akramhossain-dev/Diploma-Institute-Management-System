import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

/**
 * AttendanceRecord — one document per student per AttendanceSession.
 *
 * Fields are intentionally denormalized (courseId, date, academicSessionId,
 * departmentId, semesterId) to make reporting queries fast without joins.
 * This is a read-heavy collection — denormalization is justified here.
 *
 * Status values:
 *   present  → attended class
 *   absent   → did not attend
 *   late     → arrived after class started
 *   excused  → approved absence (medical / official)
 */
const attendanceRecordSchema = new mongoose.Schema(
  {
    
    attendanceSessionId: {
      type:     ObjectId,
      ref:      "AttendanceSession",
      required: [true, "Attendance session is required"],
    },

    studentId:         { type: ObjectId, ref: "Student",         required: [true, "Student is required"] },
    courseId:          { type: ObjectId, ref: "Course",          required: [true] },
    departmentId:      { type: ObjectId, ref: "Department",      required: [true] },
    semesterId:        { type: ObjectId, ref: "Semester",        required: [true] },
    academicSessionId: { type: ObjectId, ref: "AcademicSession", required: [true] },
    attendanceDate:    { type: Date,                             required: [true] },  

    status: {
      type:    String,
      enum:    ["present", "absent", "late", "excused"],
      default: "absent",
    },
    remarks: { type: String, trim: true, default: null },
  },
  { timestamps: true }
);

// Uniqueness: one record per student per session
attendanceRecordSchema.index(
  { studentId: 1, attendanceSessionId: 1 },
  { unique: true, name: "unique_student_session_record" }
);

attendanceRecordSchema.index({ studentId: 1, courseId: 1, academicSessionId: 1 });
attendanceRecordSchema.index({ studentId: 1, attendanceDate: 1 });
attendanceRecordSchema.index({ attendanceSessionId: 1 });
attendanceRecordSchema.index({ courseId: 1, attendanceDate: 1 });
attendanceRecordSchema.index({ departmentId: 1, semesterId: 1, attendanceDate: 1 });
attendanceRecordSchema.index({ status: 1 });

const AttendanceRecord = mongoose.model("AttendanceRecord", attendanceRecordSchema);
export default AttendanceRecord;
