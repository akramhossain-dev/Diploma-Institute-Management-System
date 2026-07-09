import Student from "../students/student.model.js";
import noticeService from "../notices/notice.service.js";
import ClassRoutine from "../classRoutines/classRoutine.model.js";
import AttendanceRecord from "../attendance/attendanceRecord.model.js";
import Result from "../results/result.model.js";
import StudentFeeAssignment from "../studentFeeAssignments/studentFeeAssignment.model.js";
import Payment from "../payments/payment.model.js";
import ApiError from "../../utils/ApiError.js";
import { getPaginationParams, buildPaginationMeta } from "../../utils/pagination.js";

const studentMeService = {
  async getProfile(studentId) {
    const s = await Student.findById(studentId)
      .populate("departmentId",      "name code")
      .populate("semesterId",        "name number")
      .populate("academicSessionId", "name startDate endDate")
      .lean();
    if (!s) throw new ApiError(404, "Student profile not found", "NOT_FOUND");
    return s;
  },

  async getNotices(studentId, query) {
    const student = await Student.findById(studentId).select("departmentId semesterId academicSessionId").lean();
    if (!student) throw new ApiError(404, "Student not found", "NOT_FOUND");

    return noticeService.getNoticesForEntity(
      "students",
      {
        departmentId:      student.departmentId,
        semesterId:        student.semesterId,
        academicSessionId: student.academicSessionId,
      },
      query
    );
  },

  async getRoutine(studentId, query) {
    const student = await Student.findById(studentId).select("departmentId semesterId academicSessionId").lean();
    if (!student) throw new ApiError(404, "Student not found", "NOT_FOUND");

    const filter = {
      departmentId:      student.departmentId,
      semesterId:        student.semesterId,
      academicSessionId: student.academicSessionId,
      routineStatus:     "active",
    };
    if (query.dayOfWeek) filter.dayOfWeek = query.dayOfWeek;

    const routines = await ClassRoutine.find(filter)
      .populate("courseId",  "title code")
      .populate("teacherId", "fullName")
      .sort({ dayOfWeek: 1, startTime: 1 })
      .lean();
    return routines;
  },

  async getAttendance(studentId, query) {
    const { page, limit, skip } = getPaginationParams(query);
    const filter = { studentId };
    if (query.courseId)          filter.courseId          = query.courseId;
    if (query.academicSessionId) filter.academicSessionId = query.academicSessionId;
    if (query.fromDate || query.toDate) {
      filter.attendanceDate = {};
      if (query.fromDate) filter.attendanceDate.$gte = new Date(query.fromDate);
      if (query.toDate)   filter.attendanceDate.$lte = new Date(query.toDate);
    }

    const [records, total] = await Promise.all([
      AttendanceRecord.find(filter)
        .populate("courseId", "title code")
        .sort({ attendanceDate: -1 })
        .skip(skip).limit(limit).lean(),
      AttendanceRecord.countDocuments(filter),
    ]);
    return { records, pagination: buildPaginationMeta(total, page, limit) };
  },

  async getResults(studentId, query) {
    const { page, limit, skip } = getPaginationParams(query);
    const filter = { studentId, resultStatus: "published" };
    if (query.academicSessionId) filter.academicSessionId = query.academicSessionId;

    const [results, total] = await Promise.all([
      Result.find(filter)
        .populate("examId",    "name examType")
        .populate("semesterId", "name number")
        .sort({ createdAt: -1 })
        .skip(skip).limit(limit).lean(),
      Result.countDocuments(filter),
    ]);
    return { results, pagination: buildPaginationMeta(total, page, limit) };
  },

  async getFees(studentId, query) {
    const filter = { studentId };
    if (query.academicSessionId) filter.academicSessionId = query.academicSessionId;

    const [assignments, payments] = await Promise.all([
      StudentFeeAssignment.find(filter).sort({ createdAt: -1 }).lean(),
      Payment.find({ studentId, paymentStatus: "completed" }).sort({ paymentDate: -1 }).lean(),
    ]);

    const totalBilled = assignments.reduce((s, a) => s + a.finalAmount, 0);
    const totalPaid   = assignments.reduce((s, a) => s + a.amountPaid,  0);
    const totalDue    = assignments.reduce((s, a) => s + a.amountRemaining, 0);

    return {
      summary:     { totalBilled, totalPaid, totalDue },
      assignments,
      payments,
    };
  },
};

export default studentMeService;
