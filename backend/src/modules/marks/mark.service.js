import Mark from "./mark.model.js";
import ExamCourseMapping from "../examCourseMappings/examCourseMapping.model.js";
import Student from "../students/student.model.js";
import { computeCourseResult } from "../../utils/grading.js";
import ApiError from "../../utils/ApiError.js";
import { getPaginationParams, buildPaginationMeta } from "../../utils/pagination.js";

const markService = {

  async bulkUpsertMarks(data, markerId, markerType) {
    const { examCourseMappingId, records } = data;

    const mapping = await ExamCourseMapping.findById(examCourseMappingId).lean();
    if (!mapping) throw new ApiError(404, "Exam course mapping not found", "NOT_FOUND");
    if (mapping.marksEntryStatus === "locked") throw new ApiError(400, "Marks entry is locked", "LOCKED");
    if (mapping.status === "cancelled") throw new ApiError(400, "Cannot enter marks for cancelled mapping", "BUSINESS_RULE_VIOLATION");

    const studentIds = records.map((r) => r.studentId);
    const validStudents = await Student.find({
      _id: { $in: studentIds },
      departmentId: mapping.departmentId,
      semesterId: mapping.semesterId,
      academicSessionId: mapping.academicSessionId,
      status: "active",
    }).select("_id").lean();

    const validStudentSet = new Set(validStudents.map((s) => String(s._id)));
    const invalid = studentIds.filter((id) => !validStudentSet.has(String(id)));
    if (invalid.length) {
      throw new ApiError(400, `${invalid.length} student(s) don't belong to this context or are inactive`, "INVALID_STUDENT_CONTEXT");
    }

    for (const r of records) {
      if (r.obtainedMarks > mapping.fullMarks) {
        throw new ApiError(400, `obtainedMarks (${r.obtainedMarks}) exceeds fullMarks (${mapping.fullMarks})`, "MARKS_OVERFLOW");
      }
    }

    const now = new Date();
    const bulkOps = records.map((r) => {
      const { percentage, gradePoint, letterGrade, passFailStatus } = computeCourseResult(r.obtainedMarks, mapping.fullMarks, mapping.passMarks);
      return {
        updateOne: {
          filter: { studentId: r.studentId, examCourseMappingId },
          update: {
            $set: {
              examId: mapping.examId, courseId: mapping.courseId,
              teacherId: mapping.teacherId, departmentId: mapping.departmentId,
              semesterId: mapping.semesterId, academicSessionId: mapping.academicSessionId,
              fullMarks: mapping.fullMarks, passMarks: mapping.passMarks,
              obtainedMarks: r.obtainedMarks, componentMarks: r.componentMarks || [],
              percentage, gradePoint, letterGrade, passFailStatus,
              remarks: r.remarks || null,
              lastUpdatedByType: markerType, lastUpdatedById: markerId, updatedAt: now,
            },
            $setOnInsert: {
              enteredByTeacherId: markerType === "teacher" ? markerId : null,
              enteredByAdminId:   markerType === "admin"   ? markerId : null,
              marksEntryStatus: "draft", createdAt: now,
            },
          },
          upsert: true,
        },
      };
    });

    const result = await Mark.bulkWrite(bulkOps, { ordered: false });
    return { inserted: result.upsertedCount, updated: result.modifiedCount, total: records.length };
  },

  async getAllMarks(query) {
    const { page, limit, skip } = getPaginationParams(query);
    const { examId, examCourseMappingId, studentId, courseId, departmentId, semesterId, academicSessionId, marksEntryStatus } = query;

    const filter = {};
    if (examId)              filter.examId              = examId;
    if (examCourseMappingId) filter.examCourseMappingId = examCourseMappingId;
    if (studentId)           filter.studentId           = studentId;
    if (courseId)            filter.courseId            = courseId;
    if (departmentId)        filter.departmentId        = departmentId;
    if (semesterId)          filter.semesterId          = semesterId;
    if (academicSessionId)   filter.academicSessionId   = academicSessionId;
    if (marksEntryStatus)    filter.marksEntryStatus    = marksEntryStatus;

    const [marks, total] = await Promise.all([
      Mark.find(filter)
        .populate("studentId", "fullName studentId rollNumber")
        .populate("courseId",  "title code")
        .populate("examId",    "name examType")
        .sort({ createdAt: -1 })
        .skip(skip).limit(limit).lean(),
      Mark.countDocuments(filter),
    ]);

    return { marks, pagination: buildPaginationMeta(total, page, limit) };
  },

  async getMarkById(id) {
    const mark = await Mark.findById(id)
      .populate("studentId",           "fullName studentId rollNumber")
      .populate("courseId",            "title code type")
      .populate("examId",              "name examType examStatus")
      .populate("examCourseMappingId", "fullMarks passMarks")
      .lean();
    if (!mark) throw new ApiError(404, "Mark entry not found", "NOT_FOUND");
    return mark;
  },

  async updateMark(id, data, markerId, markerType) {
    const mark = await Mark.findById(id);
    if (!mark) throw new ApiError(404, "Mark entry not found", "NOT_FOUND");
    if (mark.marksEntryStatus === "locked") throw new ApiError(400, "Locked marks cannot be edited", "LOCKED");

    const newObtained = data.obtainedMarks ?? mark.obtainedMarks;
    if (newObtained > mark.fullMarks) {
      throw new ApiError(400, `obtainedMarks (${newObtained}) cannot exceed fullMarks (${mark.fullMarks})`, "MARKS_OVERFLOW");
    }

    const { percentage, gradePoint, letterGrade, passFailStatus } = computeCourseResult(newObtained, mark.fullMarks, mark.passMarks);

    return Mark.findByIdAndUpdate(
      id,
      { $set: { obtainedMarks: newObtained, componentMarks: data.componentMarks || mark.componentMarks, remarks: data.remarks ?? mark.remarks, percentage, gradePoint, letterGrade, passFailStatus, lastUpdatedByType: markerType, lastUpdatedById: markerId } },
      { new: true, runValidators: true }
    ).lean();
  },

  async finalizeMarks(examCourseMappingId) {
    const result = await Mark.updateMany(
      { examCourseMappingId, marksEntryStatus: "draft" },
      { $set: { marksEntryStatus: "finalized" } }
    );
    return { finalizedCount: result.modifiedCount };
  },
};

export default markService;
