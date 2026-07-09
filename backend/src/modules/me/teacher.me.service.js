import Teacher from "../teachers/teacher.model.js";
import noticeService from "../notices/notice.service.js";
import TeacherAssignment from "../teacherAssignments/teacherAssignment.model.js";
import ClassRoutine from "../classRoutines/classRoutine.model.js";
import AttendanceSession from "../attendance/attendanceSession.model.js";
import ExamCourseMapping from "../examCourseMappings/examCourseMapping.model.js";
import ApiError from "../../utils/ApiError.js";
import { getPaginationParams, buildPaginationMeta } from "../../utils/pagination.js";

const teacherMeService = {
  async getProfile(teacherId) {
    const t = await Teacher.findById(teacherId)
      .populate("departmentId", "name code")
      .lean();
    if (!t) throw new ApiError(404, "Teacher profile not found", "NOT_FOUND");
    return t;
  },

  async getCourses(teacherId, query) {
    const { page, limit, skip } = getPaginationParams(query);
    const filter = { teacherId, assignmentStatus: "active" };
    if (query.academicSessionId) filter.academicSessionId = query.academicSessionId;

    const [assignments, total] = await Promise.all([
      TeacherAssignment.find(filter)
        .populate("courseId",          "title code type creditHours")
        .populate("departmentId",      "name code")
        .populate("semesterId",        "name number")
        .populate("academicSessionId", "name")
        .sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      TeacherAssignment.countDocuments(filter),
    ]);
    return { assignments, pagination: buildPaginationMeta(total, page, limit) };
  },

  async getRoutine(teacherId, query) {
    const filter = { teacherId, routineStatus: "active" };
    if (query.dayOfWeek) filter.dayOfWeek = query.dayOfWeek;

    return ClassRoutine.find(filter)
      .populate("courseId",    "title code")
      .populate("departmentId", "name code")
      .populate("semesterId",   "name number")
      .sort({ dayOfWeek: 1, startTime: 1 })
      .lean();
  },

  async getNotices(teacherId, query) {
    const teacher = await Teacher.findById(teacherId).select("departmentId").lean();
    const departmentId = teacher?.departmentId || null;

    return noticeService.getNoticesForEntity(
      "teachers",
      { departmentId },
      query
    );
  },

  async getAttendanceSessions(teacherId, query) {
    const { page, limit, skip } = getPaginationParams(query);
    const filter = { teacherId };
    if (query.courseId)          filter.courseId          = query.courseId;
    if (query.academicSessionId) filter.academicSessionId = query.academicSessionId;
    if (query.fromDate || query.toDate) {
      filter.attendanceDate = {};
      if (query.fromDate) filter.attendanceDate.$gte = new Date(query.fromDate);
      if (query.toDate)   filter.attendanceDate.$lte = new Date(query.toDate);
    }

    const [sessions, total] = await Promise.all([
      AttendanceSession.find(filter)
        .populate("courseId",    "title code")
        .populate("departmentId", "name")
        .sort({ attendanceDate: -1 })
        .skip(skip).limit(limit).lean(),
      AttendanceSession.countDocuments(filter),
    ]);
    return { sessions, pagination: buildPaginationMeta(total, page, limit) };
  },

  async getExamResponsibilities(teacherId, query) {
    const filter = { teacherId, status: "active" };
    if (query.academicSessionId) filter.academicSessionId = query.academicSessionId;

    return ExamCourseMapping.find(filter)
      .populate("examId",   "name examType examStatus")
      .populate("courseId", "title code")
      .sort({ createdAt: -1 })
      .lean();
  },
};

export default teacherMeService;
