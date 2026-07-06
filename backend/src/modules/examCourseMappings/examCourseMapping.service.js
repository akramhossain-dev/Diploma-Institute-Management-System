import ExamCourseMapping from "./examCourseMapping.model.js";
import Exam from "../exams/exam.model.js";
import Course from "../courses/course.model.js";
import Teacher from "../teachers/teacher.model.js";
import ApiError from "../../utils/ApiError.js";
import { getPaginationParams, buildPaginationMeta } from "../../utils/pagination.js";

const examCourseMappingService = {

  async createMapping(data, adminId) {
    const { examId, courseId, teacherId, passMarks, fullMarks } = data;

    // 1. Validate exam exists + not cancelled
    const exam = await Exam.findById(examId).lean();
    if (!exam) throw new ApiError(404, "Exam not found", "NOT_FOUND");
    if (exam.examStatus === "cancelled") {
      throw new ApiError(400, "Cannot add courses to a cancelled exam", "BUSINESS_RULE_VIOLATION");
    }

    // 2. Validate course
    const course = await Course.findById(courseId).lean();
    if (!course) throw new ApiError(404, "Course not found", "NOT_FOUND");

    // 3. Course context must match exam context
    if (String(course.departmentId) !== String(exam.departmentId)) {
      throw new ApiError(400, "Course belongs to a different department than the exam", "CONTEXT_MISMATCH");
    }
    if (String(course.semesterId) !== String(exam.semesterId)) {
      throw new ApiError(400, "Course belongs to a different semester than the exam", "CONTEXT_MISMATCH");
    }

    // 4. Validate teacher if provided
    if (teacherId) {
      const teacher = await Teacher.findById(teacherId).lean();
      if (!teacher) throw new ApiError(404, "Teacher not found", "NOT_FOUND");
    }

    // 5. Passmarks <= fullmarks
    if (parseFloat(passMarks) > parseFloat(fullMarks)) {
      throw new ApiError(400, "passMarks cannot exceed fullMarks", "VALIDATION_ERROR");
    }

    // 6. Duplicate course check in same exam
    const duplicate = await ExamCourseMapping.findOne({ examId, courseId });
    if (duplicate) {
      throw new ApiError(
        409,
        `Course '${course.title}' is already mapped to this exam`,
        "DUPLICATE_ENTRY"
      );
    }

    // Inherit exam context if not explicitly provided
    const mapping = await ExamCourseMapping.create({
      ...data,
      departmentId:      data.departmentId      || exam.departmentId,
      semesterId:        data.semesterId        || exam.semesterId,
      academicSessionId: data.academicSessionId || exam.academicSessionId,
      createdByAdminId:  adminId,
    });

    return mapping;
  },

  async getAllMappings(query) {
    const { page, limit, skip } = getPaginationParams(query);
    const { examId, courseId, teacherId, departmentId, semesterId, academicSessionId, status, marksEntryStatus } = query;

    const filter = {};
    if (examId)            filter.examId            = examId;
    if (courseId)          filter.courseId          = courseId;
    if (teacherId)         filter.teacherId         = teacherId;
    if (departmentId)      filter.departmentId      = departmentId;
    if (semesterId)        filter.semesterId        = semesterId;
    if (academicSessionId) filter.academicSessionId = academicSessionId;
    if (status)            filter.status            = status;
    if (marksEntryStatus)  filter.marksEntryStatus  = marksEntryStatus;

    const [mappings, total] = await Promise.all([
      ExamCourseMapping.find(filter)
        .populate("examId",    "name examType examStatus")
        .populate("courseId",  "title code type creditHours")
        .populate("teacherId", "fullName employeeId")
        .sort({ createdAt: -1 })
        .skip(skip).limit(limit).lean(),
      ExamCourseMapping.countDocuments(filter),
    ]);

    return { mappings, pagination: buildPaginationMeta(total, page, limit) };
  },

  async getMappingById(id) {
    const mapping = await ExamCourseMapping.findById(id)
      .populate("examId",    "name examType examStatus startDate endDate")
      .populate("courseId",  "title code type creditHours")
      .populate("teacherId", "fullName employeeId email")
      .lean();

    if (!mapping) throw new ApiError(404, "Exam course mapping not found", "NOT_FOUND");
    return mapping;
  },

  async updateMapping(id, data) {
    const mapping = await ExamCourseMapping.findById(id);
    if (!mapping) throw new ApiError(404, "Exam course mapping not found", "NOT_FOUND");

    if (mapping.marksEntryStatus === "locked") {
      throw new ApiError(400, "Locked mappings cannot be edited", "BUSINESS_RULE_VIOLATION");
    }

    // Validate passMarks <= fullMarks if either is updated
    const newFull = data.fullMarks ?? mapping.fullMarks;
    const newPass = data.passMarks ?? mapping.passMarks;
    if (parseFloat(newPass) > parseFloat(newFull)) {
      throw new ApiError(400, "passMarks cannot exceed fullMarks", "VALIDATION_ERROR");
    }

    // Strip immutable fields
    const { examId, courseId, departmentId, semesterId, academicSessionId, ...allowedUpdates } = data;

    const updated = await ExamCourseMapping.findByIdAndUpdate(
      id,
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    ).lean();

    return updated;
  },

  async updateStatus(id, status) {
    const mapping = await ExamCourseMapping.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    ).lean();
    if (!mapping) throw new ApiError(404, "Exam course mapping not found", "NOT_FOUND");
    return mapping;
  },

  async finalizeMarksEntry(id, adminId) {
    const mapping = await ExamCourseMapping.findById(id);
    if (!mapping) throw new ApiError(404, "Exam course mapping not found", "NOT_FOUND");

    if (mapping.marksEntryStatus === "locked") {
      throw new ApiError(400, "Mapping is already locked", "ALREADY_DONE");
    }

    mapping.marksEntryStatus = "finalized";
    await mapping.save();
    return mapping;
  },
};

export default examCourseMappingService;
