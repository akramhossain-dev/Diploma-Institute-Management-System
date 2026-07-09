import mongoose from "mongoose";
import Student from "../students/student.model.js";
import Teacher from "../teachers/teacher.model.js";
import Accountant from "../accountants/accountant.model.js";
import Department from "../departments/department.model.js";
import Course from "../courses/course.model.js";
import Admission from "../admissions/admission.model.js";
import Notice from "../notices/notice.model.js";
import ClassRoutine from "../classRoutines/classRoutine.model.js";
import AttendanceSession from "../attendance/attendanceSession.model.js";
import Exam from "../exams/exam.model.js";
import Result from "../results/result.model.js";
import StudentFeeAssignment from "../studentFeeAssignments/studentFeeAssignment.model.js";
import Payment from "../payments/payment.model.js";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function todayBounds() {
  const now = new Date();
  return {
    start: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
    end:   new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
  };
}
function monthBounds() {
  const now = new Date();
  return {
    start: new Date(now.getFullYear(), now.getMonth(), 1),
    end:   new Date(now.getFullYear(), now.getMonth() + 1, 1),
  };
}

const dashboardService = {
  async getAdminDashboard() {
    const todayDay = DAY_NAMES[new Date().getDay()];
    const { start: todayStart, end: todayEnd } = todayBounds();
    const { start: monthStart, end: monthEnd } = monthBounds();

    const [
      totalStudents, activeStudents, totalTeachers, totalAccountants,
      totalDepartments, totalCourses, pendingAdmissions, activeNotices,
      todaysClasses, activeExams, publishedResults,
      financeAgg, todayAgg, monthAgg,
      studentsByDept, todayAttendance,
    ] = await Promise.all([
      Student.countDocuments({}),
      Student.countDocuments({ status: "active" }),
      Teacher.countDocuments({ status: "active" }),
      Accountant.countDocuments({ status: "active" }),
      Department.countDocuments({}),
      Course.countDocuments({}),
      Admission.countDocuments({ admissionStatus: "pending" }),
      Notice.countDocuments({ publishStatus: "published", $or: [{ expiresAt: null }, { expiresAt: { $gte: new Date() } }] }),
      ClassRoutine.countDocuments({ dayOfWeek: todayDay, routineStatus: "active" }),
      Exam.countDocuments({ examStatus: { $in: ["scheduled", "ongoing"] } }),
      Result.countDocuments({ resultStatus: "published" }),
      StudentFeeAssignment.aggregate([{ $group: { _id: null, totalBilled: { $sum: "$finalAmount" }, totalPaid: { $sum: "$amountPaid" }, totalDue: { $sum: "$amountRemaining" } } }]),
      Payment.aggregate([{ $match: { paymentStatus: "completed", paymentDate: { $gte: todayStart, $lt: todayEnd } } }, { $group: { _id: null, total: { $sum: "$totalAmount" } } }]),
      Payment.aggregate([{ $match: { paymentStatus: "completed", paymentDate: { $gte: monthStart, $lt: monthEnd } } }, { $group: { _id: null, total: { $sum: "$totalAmount" } } }]),
      Student.aggregate([
        { $match: { status: "active" } },
        { $group: { _id: "$departmentId", count: { $sum: 1 } } },
        { $lookup: { from: "departments", localField: "_id", foreignField: "_id", as: "dept", pipeline: [{ $project: { name: 1, code: 1 } }] } },
        { $unwind: { path: "$dept", preserveNullAndEmptyArrays: true } },
        { $project: { _id: 0, departmentId: "$_id", name: "$dept.name", code: "$dept.code", count: 1 } },
      ]),
      AttendanceSession.aggregate([
        { $match: { attendanceDate: { $gte: todayStart, $lt: todayEnd } } },
        { $group: { _id: null, sessions: { $sum: 1 }, present: { $sum: "$presentCount" }, absent: { $sum: "$absentCount" }, total: { $sum: "$totalStudents" } } },
      ]),
    ]);

    const finance   = financeAgg[0]      || { totalBilled: 0, totalPaid: 0, totalDue: 0 };
    const todayCol  = todayAgg[0]        || { total: 0 };
    const monthCol  = monthAgg[0]        || { total: 0 };
    const todayAtt  = todayAttendance[0] || { sessions: 0, present: 0, absent: 0, total: 0 };

    return {
      people:   { totalStudents, activeStudents, totalTeachers, totalAccountants, totalDepartments, totalCourses },
      academic: { pendingAdmissions, activeNotices, todaysClasses, activeExams, publishedResults, studentsByDept },
      finance:  { ...finance, todaysCollection: todayCol.total, thisMonthCollection: monthCol.total },
      todayAttendance: todayAtt,
    };
  },

  async getFinanceDashboard(query = {}) {
    const match = {};
    if (query.academicSessionId) {
      match.academicSessionId = new mongoose.Types.ObjectId(query.academicSessionId);
    }
    const { start: monthStart, end: monthEnd } = monthBounds();

    const [overview, byType, recentPayments] = await Promise.all([
      StudentFeeAssignment.aggregate([
        { $match: match },
        { $group: { _id: null, totalBilled: { $sum: "$finalAmount" }, totalPaid: { $sum: "$amountPaid" }, totalDue: { $sum: "$amountRemaining" }, unpaidCount: { $sum: { $cond: [{ $eq: ["$billingStatus", "unpaid"] }, 1, 0] } }, partialCount: { $sum: { $cond: [{ $eq: ["$billingStatus", "partial"] }, 1, 0] } }, paidCount: { $sum: { $cond: [{ $eq: ["$billingStatus", "paid"] }, 1, 0] } } } },
      ]),
      StudentFeeAssignment.aggregate([
        { $match: match },
        { $group: { _id: "$feeTypeSnapshot", totalBilled: { $sum: "$finalAmount" }, totalPaid: { $sum: "$amountPaid" } } },
      ]),
      Payment.find({ paymentStatus: "completed" }).sort({ paymentDate: -1 }).limit(10).populate("studentId", "fullName studentId").lean(),
    ]);

    return { overview: overview[0] || {}, byFeeType: byType, recentPayments };
  },

  async getAcademicDashboard(query = {}) {
    const match = { status: "active" };
    if (query.academicSessionId) {
      match.academicSessionId = new mongoose.Types.ObjectId(query.academicSessionId);
    }

    const [bySemester, recentExams, attSummary] = await Promise.all([
      Student.aggregate([
        { $match: match },
        { $group: { _id: "$semesterId", count: { $sum: 1 } } },
        { $lookup: { from: "semesters", localField: "_id", foreignField: "_id", as: "sem", pipeline: [{ $project: { name: 1, number: 1 } }] } },
        { $unwind: { path: "$sem", preserveNullAndEmptyArrays: true } },
        { $project: { _id: 0, semesterId: "$_id", name: "$sem.name", number: "$sem.number", count: 1 } },
      ]),
      Exam.find().sort({ createdAt: -1 }).limit(5).populate("departmentId", "name").populate("semesterId", "name").lean(),
      AttendanceSession.aggregate([{ $group: { _id: null, totalSessions: { $sum: 1 }, totalPresent: { $sum: "$presentCount" }, totalStudents: { $sum: "$totalStudents" } } }]),
    ]);

    const att = attSummary[0] || {};
    return {
      studentsBySemester: bySemester,
      recentExams,
      attendanceSummary: { ...att, overallAttendancePercent: att.totalStudents > 0 ? Math.round((att.totalPresent / att.totalStudents) * 100 * 100) / 100 : 0 },
    };
  },
};

export default dashboardService;
