import mongoose from "mongoose";
import Student from "../students/student.model.js";
import Admission from "../admissions/admission.model.js";
import AttendanceRecord from "../attendance/attendanceRecord.model.js";
import AttendanceSession from "../attendance/attendanceSession.model.js";
import Result from "../results/result.model.js";
import Mark from "../marks/mark.model.js";
import StudentFeeAssignment from "../studentFeeAssignments/studentFeeAssignment.model.js";
import Payment from "../payments/payment.model.js";
import { getPaginationParams, buildPaginationMeta } from "../../utils/pagination.js";

function dateFilter(fromDate, toDate, field = "createdAt") {
  const f = {};
  if (fromDate || toDate) {
    f[field] = {};
    if (fromDate) f[field].$gte = new Date(fromDate);
    if (toDate)   f[field].$lte = new Date(toDate);
  }
  return f;
}

const reportService = {

  async getStudentReport(query) {
    const { page, limit, skip } = getPaginationParams(query);
    const { departmentId, semesterId, academicSessionId, status, fromDate, toDate, search } = query;

    const filter = {};
    if (departmentId)      filter.departmentId      = departmentId;
    if (semesterId)        filter.semesterId        = semesterId;
    if (academicSessionId) filter.academicSessionId = academicSessionId;
    if (status)            filter.status            = status;
    if (search)            filter.$or = [{ fullName: { $regex: search, $options: "i" } }, { studentId: { $regex: search, $options: "i" } }];
    Object.assign(filter, dateFilter(fromDate, toDate, "createdAt"));

    const [students, total] = await Promise.all([
      Student.find(filter)
        .populate("departmentId",      "name code")
        .populate("semesterId",        "name number")
        .populate("academicSessionId", "name")
        .select("-__v").sort({ createdAt: -1 })
        .skip(skip).limit(limit).lean(),
      Student.countDocuments(filter),
    ]);

    return { students, pagination: buildPaginationMeta(total, page, limit) };
  },

  async getAttendanceReport(query) {
    const { page, limit, skip } = getPaginationParams(query);
    const { studentId, teacherId, courseId, departmentId, semesterId, academicSessionId, fromDate, toDate } = query;

    const filter = {};
    if (studentId)         filter.studentId         = studentId;
    if (teacherId)         filter.teacherId         = teacherId;
    if (courseId)          filter.courseId          = courseId;
    if (departmentId)      filter.departmentId      = departmentId;
    if (semesterId)        filter.semesterId        = semesterId;
    if (academicSessionId) filter.academicSessionId = academicSessionId;
    Object.assign(filter, dateFilter(fromDate, toDate, "attendanceDate"));

    const [records, total] = await Promise.all([
      AttendanceRecord.find(filter)
        .populate("studentId",  "fullName studentId rollNumber")
        .populate("courseId",   "title code")
        .sort({ attendanceDate: -1 })
        .skip(skip).limit(limit).lean(),
      AttendanceRecord.countDocuments(filter),
    ]);

    const matchFilter = {};
    if (studentId)         matchFilter.studentId         = new mongoose.Types.ObjectId(studentId);
    if (teacherId)         matchFilter.teacherId         = new mongoose.Types.ObjectId(teacherId);
    if (courseId)          matchFilter.courseId          = new mongoose.Types.ObjectId(courseId);
    if (departmentId)      matchFilter.departmentId      = new mongoose.Types.ObjectId(departmentId);
    if (semesterId)        matchFilter.semesterId        = new mongoose.Types.ObjectId(semesterId);
    if (academicSessionId) matchFilter.academicSessionId = new mongoose.Types.ObjectId(academicSessionId);
    Object.assign(matchFilter, dateFilter(fromDate, toDate, "attendanceDate"));

    const summary = await AttendanceRecord.aggregate([
      { $match: matchFilter },
      { $group: { _id: null, total: { $sum: 1 }, present: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } }, absent: { $sum: { $cond: [{ $eq: ["$status", "absent"] }, 1, 0] } }, late: { $sum: { $cond: [{ $eq: ["$status", "late"] }, 1, 0] } }, excused: { $sum: { $cond: [{ $eq: ["$status", "excused"] }, 1, 0] } } } },
    ]);

    return { records, summary: summary[0] || {}, pagination: buildPaginationMeta(total, page, limit) };
  },

  async getResultReport(query) {
    const { page, limit, skip } = getPaginationParams(query);
    const { examId, studentId, departmentId, semesterId, academicSessionId, resultStatus } = query;

    const filter = {};
    if (examId)            filter.examId            = examId;
    if (studentId)         filter.studentId         = studentId;
    if (departmentId)      filter.departmentId      = departmentId;
    if (semesterId)        filter.semesterId        = semesterId;
    if (academicSessionId) filter.academicSessionId = academicSessionId;
    if (resultStatus)      filter.resultStatus      = resultStatus;

    const matchFilter = {};
    if (examId)            matchFilter.examId            = new mongoose.Types.ObjectId(examId);
    if (studentId)         matchFilter.studentId         = new mongoose.Types.ObjectId(studentId);
    if (departmentId)      matchFilter.departmentId      = new mongoose.Types.ObjectId(departmentId);
    if (semesterId)        matchFilter.semesterId        = new mongoose.Types.ObjectId(semesterId);
    if (academicSessionId) matchFilter.academicSessionId = new mongoose.Types.ObjectId(academicSessionId);
    if (resultStatus)      matchFilter.resultStatus      = resultStatus;

    const [results, total, summary] = await Promise.all([
      Result.find(filter)
        .populate("studentId", "fullName studentId rollNumber")
        .populate("examId",    "name examType examStatus")
        .sort({ gpa: -1, totalMarksObtained: -1 })
        .skip(skip).limit(limit).lean(),
      Result.countDocuments(filter),
      Result.aggregate([
        { $match: matchFilter },
        { $group: { _id: null, totalResults: { $sum: 1 }, passCount: { $sum: { $cond: [{ $eq: ["$overallPassFailStatus", "pass"] }, 1, 0] } }, failCount: { $sum: { $cond: [{ $eq: ["$overallPassFailStatus", "fail"] }, 1, 0] } }, avgGpa: { $avg: "$gpa" } } },
      ]),
    ]);

    return { results, summary: summary[0] || {}, pagination: buildPaginationMeta(total, page, limit) };
  },

  async getFinanceReport(query) {
    const { page, limit, skip } = getPaginationParams(query);
    const { studentId, departmentId, semesterId, academicSessionId, billingStatus, fromDate, toDate, paymentMethod } = query;

    const assignFilter = {};
    if (studentId)         assignFilter.studentId         = studentId;
    if (departmentId)      assignFilter.departmentId      = departmentId;
    if (semesterId)        assignFilter.semesterId        = semesterId;
    if (academicSessionId) assignFilter.academicSessionId = academicSessionId;
    if (billingStatus)     assignFilter.billingStatus     = billingStatus;

    const payFilter = { paymentStatus: "completed" };
    if (studentId)     payFilter.studentId     = studentId;
    if (paymentMethod) payFilter.paymentMethod = paymentMethod;
    Object.assign(payFilter, dateFilter(fromDate, toDate, "paymentDate"));

    const assignMatch = {};
    if (studentId)         assignMatch.studentId         = new mongoose.Types.ObjectId(studentId);
    if (departmentId)      assignMatch.departmentId      = new mongoose.Types.ObjectId(departmentId);
    if (semesterId)        assignMatch.semesterId        = new mongoose.Types.ObjectId(semesterId);
    if (academicSessionId) assignMatch.academicSessionId = new mongoose.Types.ObjectId(academicSessionId);
    if (billingStatus)     assignMatch.billingStatus     = billingStatus;

    const [assignments, assignTotal, payments, payTotal, totals] = await Promise.all([
      StudentFeeAssignment.find(assignFilter).populate("studentId", "fullName studentId").sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      StudentFeeAssignment.countDocuments(assignFilter),
      Payment.find(payFilter).populate("studentId", "fullName studentId").populate("collectedByAccountantId", "fullName staffId").sort({ paymentDate: -1 }).limit(50).lean(),
      Payment.countDocuments(payFilter),
      StudentFeeAssignment.aggregate([{ $match: assignMatch }, { $group: { _id: null, totalBilled: { $sum: "$finalAmount" }, totalPaid: { $sum: "$amountPaid" }, totalDue: { $sum: "$amountRemaining" } } }]),
    ]);

    return { assignments, payments, summary: totals[0] || {}, assignPagination: buildPaginationMeta(assignTotal, page, limit) };
  },

  async getAdmissionReport(query) {
    const { page, limit, skip } = getPaginationParams(query);
    const { departmentId, semesterId, academicSessionId, admissionStatus, fromDate, toDate } = query;

    const filter = {};
    if (departmentId)      filter.desiredDepartmentId = departmentId;
    if (semesterId)        filter.targetSemesterId    = semesterId;
    if (academicSessionId) filter.academicSessionId   = academicSessionId;
    if (admissionStatus)   filter.admissionStatus     = admissionStatus;
    Object.assign(filter, dateFilter(fromDate, toDate, "createdAt"));

    const admissionMatch = {};
    if (departmentId)      admissionMatch.desiredDepartmentId = new mongoose.Types.ObjectId(departmentId);
    if (semesterId)        admissionMatch.targetSemesterId    = new mongoose.Types.ObjectId(semesterId);
    if (academicSessionId) admissionMatch.academicSessionId   = new mongoose.Types.ObjectId(academicSessionId);
    if (admissionStatus)   admissionMatch.admissionStatus     = admissionStatus;
    Object.assign(admissionMatch, dateFilter(fromDate, toDate, "createdAt"));

    const [admissions, total, funnel] = await Promise.all([
      Admission.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Admission.countDocuments(filter),
      Admission.aggregate([{ $match: admissionMatch }, { $group: { _id: "$admissionStatus", count: { $sum: 1 } } }]),
    ]);

    return { admissions, funnel, pagination: buildPaginationMeta(total, page, limit) };
  },
};

export default reportService;
