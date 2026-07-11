import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

/**
 * Mark — one record per student per ExamCourseMapping.
 *
 * All grade fields (percentage, gradePoint, letterGrade, passFailStatus)
 * are computed and stored at write time using grading.js to avoid
 * expensive recomputation on every read.
 *
 * marksEntryStatus mirrors ExamCourseMapping.marksEntryStatus per record,
 * but is controlled via the mapping's finalize flow.
 */
const markSchema = new mongoose.Schema(
  {
    
    examId:              { type: ObjectId, ref: "Exam",              required: [true] },
    examCourseMappingId: { type: ObjectId, ref: "ExamCourseMapping", required: [true] },
    studentId:           { type: ObjectId, ref: "Student",           required: [true] },

    courseId:          { type: ObjectId, ref: "Course",          required: [true] },
    teacherId:         { type: ObjectId, ref: "Teacher",         default: null },
    departmentId:      { type: ObjectId, ref: "Department",      required: [true] },
    semesterId:        { type: ObjectId, ref: "Semester",        required: [true] },
    academicSessionId: { type: ObjectId, ref: "AcademicSession", required: [true] },

    fullMarks:        { type: Number, required: [true] },
    passMarks:        { type: Number, required: [true] },
    obtainedMarks:    { type: Number, required: [true, "Obtained marks required"], min: 0 },

    componentMarks: [
      {
        component: { type: String, trim: true },
        obtained:  { type: Number, min: 0 },
        fullMarks: { type: Number, min: 0 },
        _id:       false,
      },
    ],

    percentage:     { type: Number, default: 0 },
    gradePoint:     { type: Number, default: 0 },
    letterGrade:    { type: String, default: "F" },
    passFailStatus: { type: String, enum: ["pass", "fail"], default: "fail" },

    marksEntryStatus: {
      type:    String,
      enum:    ["draft", "finalized", "locked"],
      default: "draft",
    },

    enteredByTeacherId:  { type: ObjectId, ref: "Teacher", default: null },
    enteredByAdminId:    { type: ObjectId, ref: "Admin",   default: null },
    lastUpdatedByType:   { type: String, enum: ["teacher", "admin"], default: null },
    lastUpdatedById:     { type: ObjectId, default: null },

    remarks: { type: String, trim: true, default: null },
  },
  { timestamps: true }
);

markSchema.index(
  { studentId: 1, examCourseMappingId: 1 },
  { unique: true, name: "unique_student_mark_per_mapping" }
);
markSchema.index({ examId:              1 });
markSchema.index({ examCourseMappingId: 1 });
markSchema.index({ studentId:          1, examId: 1 });
markSchema.index({ studentId:          1, academicSessionId: 1 });
markSchema.index({ marksEntryStatus:   1 });

const Mark = mongoose.model("Mark", markSchema);
export default Mark;
