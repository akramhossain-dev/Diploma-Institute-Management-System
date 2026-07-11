import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const courseResultSchema = new mongoose.Schema(
  {
    courseId:            { type: ObjectId, ref: "Course" },
    examCourseMappingId: { type: ObjectId, ref: "ExamCourseMapping" },
    obtainedMarks:  { type: Number },
    fullMarks:      { type: Number },
    passMarks:      { type: Number },
    percentage:     { type: Number },
    gradePoint:     { type: Number },
    letterGrade:    { type: String },
    passFailStatus: { type: String, enum: ["pass", "fail"] },
  },
  { _id: false }
);

const resultSchema = new mongoose.Schema(
  {
    
    examId:            { type: ObjectId, ref: "Exam",            required: [true] },
    studentId:         { type: ObjectId, ref: "Student",         required: [true] },
    departmentId:      { type: ObjectId, ref: "Department",      required: [true] },
    semesterId:        { type: ObjectId, ref: "Semester",        required: [true] },
    academicSessionId: { type: ObjectId, ref: "AcademicSession", required: [true] },

    totalFullMarks:      { type: Number, default: 0 },
    totalMarksObtained:  { type: Number, default: 0 },
    overallPercentage:   { type: Number, default: 0 },
    gpa:                 { type: Number, default: 0 },
    totalPassedCourses:  { type: Number, default: 0 },
    totalFailedCourses:  { type: Number, default: 0 },
    overallPassFailStatus: { type: String, enum: ["pass", "fail"], default: "fail" },
    resultLetterGrade:   { type: String, default: "F" },

    rank: { type: Number, default: null },

    courseResults: [courseResultSchema],

    resultStatus: {
      type:    String,
      enum:    ["draft", "generated", "published", "revised"],
      default: "draft",
    },
    generatedAt:      { type: Date, default: null },
    publishedAt:      { type: Date, default: null },
    generatedByAdminId: { type: ObjectId, ref: "Admin", default: null },
    remarks:          { type: String, trim: true, default: null },
  },
  { timestamps: true }
);

resultSchema.index(
  { studentId: 1, examId: 1 },
  { unique: true, name: "unique_student_result_per_exam" }
);
resultSchema.index({ examId:            1 });
resultSchema.index({ studentId:        1, academicSessionId: 1 });
resultSchema.index({ resultStatus:     1 });
resultSchema.index({ departmentId:     1, semesterId: 1, academicSessionId: 1 });
resultSchema.index({ gpa:              -1 });   

const Result = mongoose.model("Result", resultSchema);
export default Result;
