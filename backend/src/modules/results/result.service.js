import mongoose from "mongoose";
import Result from "./result.model.js";
import Exam from "../exams/exam.model.js";
import ExamCourseMapping from "../examCourseMappings/examCourseMapping.model.js";
import Mark from "../marks/mark.model.js";
import Student from "../students/student.model.js";
import { computeCourseResult, computeExamSummary } from "../../utils/grading.js";
import ApiError from "../../utils/ApiError.js";
import { getPaginationParams, buildPaginationMeta } from "../../utils/pagination.js";

const resultService = {

  // ── Core generation algorithm ──────────────────────────────────────────────
  async _generateForStudent(exam, mappings, student, adminId) {
    const studentId = student._id;

    // Load all marks for this student under this exam's mappings
    const mappingIds = mappings.map((m) => m._id);
    const markDocs = await Mark.find({
      studentId,
      examCourseMappingId: { $in: mappingIds },
    }).lean();

    const marksByMapping = {};
    for (const m of markDocs) marksByMapping[String(m.examCourseMappingId)] = m;

    // Build per-course result snapshot
    const courseResults = mappings.map((mapping) => {
      const mark = marksByMapping[String(mapping._id)];
      if (!mark) {
        // Missing mark treated as 0 (absent/not submitted)
        const { percentage, gradePoint, letterGrade, passFailStatus } =
          computeCourseResult(0, mapping.fullMarks, mapping.passMarks);
        return {
          courseId:            mapping.courseId,
          examCourseMappingId: mapping._id,
          obtainedMarks:       0,
          fullMarks:           mapping.fullMarks,
          passMarks:           mapping.passMarks,
          percentage, gradePoint, letterGrade, passFailStatus,
        };
      }
      return {
        courseId:            mapping.courseId,
        examCourseMappingId: mapping._id,
        obtainedMarks:       mark.obtainedMarks,
        fullMarks:           mark.fullMarks,
        passMarks:           mark.passMarks,
        percentage:          mark.percentage,
        gradePoint:          mark.gradePoint,
        letterGrade:         mark.letterGrade,
        passFailStatus:      mark.passFailStatus,
      };
    });

    const summary = computeExamSummary(courseResults);

    // Upsert result (idempotent)
    const result = await Result.findOneAndUpdate(
      { studentId, examId: exam._id },
      {
        $set: {
          departmentId:      exam.departmentId,
          semesterId:        exam.semesterId,
          academicSessionId: exam.academicSessionId,
          courseResults,
          ...summary,
          resultStatus:       "generated",
          generatedAt:        new Date(),
          generatedByAdminId: adminId,
        },
      },
      { new: true, upsert: true }
    );

    return result;
  },

  // ── Single student result generation ─────────────────────────────────────
  async generateForStudent(examId, studentId, adminId) {
    const [exam, student] = await Promise.all([
      Exam.findById(examId).lean(),
      Student.findById(studentId).lean(),
    ]);

    if (!exam)    throw new ApiError(404, "Exam not found",    "NOT_FOUND");
    if (!student) throw new ApiError(404, "Student not found", "NOT_FOUND");

    if (exam.examStatus === "cancelled") {
      throw new ApiError(400, "Cannot generate result for a cancelled exam", "BUSINESS_RULE_VIOLATION");
    }

    // Validate student belongs to exam context
    if (
      String(student.departmentId)      !== String(exam.departmentId)      ||
      String(student.semesterId)        !== String(exam.semesterId)        ||
      String(student.academicSessionId) !== String(exam.academicSessionId)
    ) {
      throw new ApiError(400, "Student does not belong to this exam's academic context", "CONTEXT_MISMATCH");
    }

    const mappings = await ExamCourseMapping.find({ examId, status: "active" }).lean();
    if (!mappings.length) throw new ApiError(400, "No active course mappings found for this exam", "NO_MAPPINGS");

    return this._generateForStudent(exam, mappings, student, adminId);
  },

  // ── Bulk: all students in exam context ────────────────────────────────────
  async bulkGenerateForExam(examId, adminId) {
    const exam = await Exam.findById(examId).lean();
    if (!exam) throw new ApiError(404, "Exam not found", "NOT_FOUND");
    if (exam.examStatus === "cancelled") {
      throw new ApiError(400, "Cannot generate results for a cancelled exam", "BUSINESS_RULE_VIOLATION");
    }

    const [mappings, students] = await Promise.all([
      ExamCourseMapping.find({ examId, status: "active" }).lean(),
      Student.find({
        departmentId:      exam.departmentId,
        semesterId:        exam.semesterId,
        academicSessionId: exam.academicSessionId,
        status:            "active",
      }).lean(),
    ]);

    if (!mappings.length) throw new ApiError(400, "No active course mappings for this exam", "NO_MAPPINGS");
    if (!students.length) throw new ApiError(400, "No active students found for this exam context", "NOT_FOUND");

    // Generate results in parallel (batched to avoid overwhelming DB)
    const BATCH_SIZE = 20;
    const results = [];
    for (let i = 0; i < students.length; i += BATCH_SIZE) {
      const batch = students.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(
        batch.map((s) => this._generateForStudent(exam, mappings, s, adminId))
      );
      results.push(...batchResults);
    }

    // Assign ranks based on GPA (desc), marks obtained (desc)
    results.sort((a, b) => b.gpa - a.gpa || b.totalMarksObtained - a.totalMarksObtained);
    const rankOps = results.map((r, i) => ({
      updateOne: {
        filter: { _id: r._id },
        update: { $set: { rank: i + 1 } },
      },
    }));
    await Result.bulkWrite(rankOps, { ordered: false });

    return { generatedCount: results.length };
  },

  async getAllResults(query) {
    const { page, limit, skip } = getPaginationParams(query);
    const { examId, studentId, departmentId, semesterId, academicSessionId, resultStatus } = query;

    const filter = {};
    if (examId)            filter.examId            = examId;
    if (studentId)         filter.studentId         = studentId;
    if (departmentId)      filter.departmentId      = departmentId;
    if (semesterId)        filter.semesterId        = semesterId;
    if (academicSessionId) filter.academicSessionId = academicSessionId;
    if (resultStatus)      filter.resultStatus      = resultStatus;

    const [results, total] = await Promise.all([
      Result.find(filter)
        .populate("studentId",  "fullName studentId rollNumber")
        .populate("examId",     "name examType examStatus")
        .populate("semesterId", "name number")
        .sort({ gpa: -1, totalMarksObtained: -1 })
        .skip(skip).limit(limit).lean(),
      Result.countDocuments(filter),
    ]);

    return { results, pagination: buildPaginationMeta(total, page, limit) };
  },

  async getResultById(id) {
    const result = await Result.findById(id)
      .populate("studentId",         "fullName studentId rollNumber email")
      .populate("examId",            "name examType examStatus startDate endDate")
      .populate("departmentId",      "name code")
      .populate("semesterId",        "name number")
      .populate("academicSessionId", "name")
      .populate("courseResults.courseId",            "title code type creditHours")
      .populate("courseResults.examCourseMappingId", "fullMarks passMarks examDate")
      .lean();
    if (!result) throw new ApiError(404, "Result not found", "NOT_FOUND");
    return result;
  },

  async getResultByExamAndStudent(examId, studentId) {
    const result = await Result.findOne({ examId, studentId })
      .populate("studentId",  "fullName studentId rollNumber")
      .populate("examId",     "name examType examStatus")
      .populate("courseResults.courseId", "title code")
      .lean();
    if (!result) throw new ApiError(404, "No result found for this student and exam", "NOT_FOUND");
    return result;
  },

  async publishResult(id) {
    const result = await Result.findById(id);
    if (!result) throw new ApiError(404, "Result not found", "NOT_FOUND");
    if (result.resultStatus === "published") throw new ApiError(400, "Result is already published", "ALREADY_DONE");
    if (result.resultStatus === "draft") throw new ApiError(400, "Cannot publish a draft result. Generate it first.", "BUSINESS_RULE_VIOLATION");

    result.resultStatus = "published";
    result.publishedAt  = new Date();
    await result.save();
    return result;
  },

  async publishExamResults(examId) {
    const result = await Result.updateMany(
      { examId, resultStatus: "generated" },
      { $set: { resultStatus: "published", publishedAt: new Date() } }
    );
    return { publishedCount: result.modifiedCount };
  },
};

export default resultService;
