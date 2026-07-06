import mongoose from "mongoose";
import Student from "../students/student.model.js";
import Admission from "../admissions/admission.model.js";
import AttendanceRecord from "../attendance/attendanceRecord.model.js";
import Payment from "../payments/payment.model.js";
import StudentFeeAssignment from "../studentFeeAssignments/studentFeeAssignment.model.js";
import Result from "../results/result.model.js";
import Mark from "../marks/mark.model.js";

function last12MonthsBound() {
  const d = new Date();
  d.setMonth(d.getMonth() - 11);
  d.setDate(1); d.setHours(0, 0, 0, 0);
  return d;
}

const analyticsService = {

  async getStudentAnalytics(query = {}) {
    const sessionMatch = query.academicSessionId ? { academicSessionId: new mongoose.Types.ObjectId(query.academicSessionId) } : {};

    const [byDept, bySemester, monthlyAdmissions] = await Promise.all([
      Student.aggregate([
        { $match: { status: "active", ...sessionMatch } },
        { $group: { _id: "$departmentId", count: { $sum: 1 } } },
        { $lookup: { from: "departments", localField: "_id", foreignField: "_id", as: "dept", pipeline: [{ $project: { name: 1, code: 1 } }] } },
        { $unwind: { path: "$dept", preserveNullAndEmptyArrays: true } },
        { $project: { _id: 0, departmentId: "$_id", name: "$dept.name", code: "$dept.code", count: 1 } },
        { $sort: { count: -1 } },
      ]),
      Student.aggregate([
        { $match: { status: "active", ...sessionMatch } },
        { $group: { _id: "$semesterId", count: { $sum: 1 } } },
        { $lookup: { from: "semesters", localField: "_id", foreignField: "_id", as: "sem", pipeline: [{ $project: { name: 1, number: 1 } }] } },
        { $unwind: { path: "$sem", preserveNullAndEmptyArrays: true } },
        { $project: { _id: 0, semesterId: "$_id", name: "$sem.name", number: "$sem.number", count: 1 } },
        { $sort: { "$sem.number": 1 } },
      ]),
      Admission.aggregate([
        { $match: { createdAt: { $gte: last12MonthsBound() } } },
        { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, total: { $sum: 1 }, approved: { $sum: { $cond: [{ $eq: ["$admissionStatus", "approved"] }, 1, 0] } } } },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        { $project: { _id: 0, year: "$_id.year", month: "$_id.month", total: 1, approved: 1 } },
      ]),
    ]);

    return { byDepartment: byDept, bySemester, monthlyAdmissionTrend: monthlyAdmissions };
  },

  async getAttendanceAnalytics(query = {}) {
    const sessionMatch = query.academicSessionId ? { academicSessionId: new mongoose.Types.ObjectId(query.academicSessionId) } : {};

    const [byDept, monthly, lowAttendance] = await Promise.all([
      AttendanceRecord.aggregate([
        { $match: sessionMatch },
        { $group: { _id: "$departmentId", total: { $sum: 1 }, present: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } } } },
        { $lookup: { from: "departments", localField: "_id", foreignField: "_id", as: "dept", pipeline: [{ $project: { name: 1, code: 1 } }] } },
        { $unwind: { path: "$dept", preserveNullAndEmptyArrays: true } },
        { $addFields: { attendancePercent: { $round: [{ $multiply: [{ $divide: ["$present", "$total"] }, 100] }, 1] } } },
        { $project: { _id: 0, departmentId: "$_id", name: "$dept.name", code: "$dept.code", total: 1, present: 1, attendancePercent: 1 } },
        { $sort: { attendancePercent: 1 } },
      ]),
      AttendanceRecord.aggregate([
        { $match: { attendanceDate: { $gte: last12MonthsBound() }, ...sessionMatch } },
        { $group: { _id: { year: { $year: "$attendanceDate" }, month: { $month: "$attendanceDate" } }, total: { $sum: 1 }, present: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } } } },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        { $project: { _id: 0, year: "$_id.year", month: "$_id.month", total: 1, present: 1, attendancePercent: { $round: [{ $multiply: [{ $divide: ["$present", "$total"] }, 100] }, 1] } } },
      ]),
      // Students with < 75% attendance (uses AttendanceRecord aggregate)
      AttendanceRecord.aggregate([
        { $match: sessionMatch },
        { $group: { _id: "$studentId", total: { $sum: 1 }, present: { $sum: { $cond: [{ $in: ["$status", ["present", "late"]] }, 1, 0] } } } },
        { $addFields: { percent: { $round: [{ $multiply: [{ $divide: ["$present", "$total"] }, 100] }, 1] } } },
        { $match: { percent: { $lt: 75 } } },
        { $lookup: { from: "students", localField: "_id", foreignField: "_id", as: "student", pipeline: [{ $project: { fullName: 1, studentId: 1, rollNumber: 1 } }] } },
        { $unwind: { path: "$student", preserveNullAndEmptyArrays: true } },
        { $project: { _id: 0, studentId: "$_id", fullName: "$student.fullName", rollNumber: "$student.rollNumber", total: 1, present: 1, percent: 1 } },
        { $sort: { percent: 1 } },
        { $limit: 50 },
      ]),
    ]);

    return { byDepartment: byDept, monthlyTrend: monthly, lowAttendanceStudents: lowAttendance };
  },

  async getFinanceAnalytics(query = {}) {
    const sessionMatch = query.academicSessionId ? { academicSessionId: new mongoose.Types.ObjectId(query.academicSessionId) } : {};

    const [monthlyCollection, byFeeType, monthlyDue] = await Promise.all([
      Payment.aggregate([
        { $match: { paymentStatus: "completed", paymentDate: { $gte: last12MonthsBound() } } },
        { $group: { _id: { year: { $year: "$paymentDate" }, month: { $month: "$paymentDate" } }, total: { $sum: "$totalAmount" }, count: { $sum: 1 } } },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        { $project: { _id: 0, year: "$_id.year", month: "$_id.month", total: 1, count: 1 } },
      ]),
      StudentFeeAssignment.aggregate([
        { $match: sessionMatch },
        { $group: { _id: "$feeTypeSnapshot", totalBilled: { $sum: "$finalAmount" }, totalPaid: { $sum: "$amountPaid" }, totalDue: { $sum: "$amountRemaining" } } },
        { $sort: { totalBilled: -1 } },
      ]),
      StudentFeeAssignment.aggregate([
        { $match: { billingStatus: { $in: ["unpaid", "partial", "overdue"] }, ...sessionMatch } },
        { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, totalDue: { $sum: "$amountRemaining" } } },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        { $project: { _id: 0, year: "$_id.year", month: "$_id.month", totalDue: 1 } },
      ]),
    ]);

    return { monthlyCollectionTrend: monthlyCollection, feeTypeDistribution: byFeeType, monthlyDueTrend: monthlyDue };
  },

  async getResultAnalytics(query = {}) {
    const examMatch = query.examId ? { examId: new mongoose.Types.ObjectId(query.examId) } : {};
    const sessionMatch = query.academicSessionId ? { academicSessionId: new mongoose.Types.ObjectId(query.academicSessionId) } : {};

    const [passFail, gradeDistribution, gpaDistribution] = await Promise.all([
      Result.aggregate([
        { $match: { ...examMatch, ...sessionMatch } },
        { $group: { _id: "$overallPassFailStatus", count: { $sum: 1 } } },
      ]),
      Mark.aggregate([
        { $match: examMatch },
        { $group: { _id: "$letterGrade", count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Result.aggregate([
        { $match: { ...examMatch, ...sessionMatch } },
        { $bucket: { groupBy: "$gpa", boundaries: [0, 1, 2, 2.5, 3, 3.5, 4.0, 4.01], default: "other", output: { count: { $sum: 1 } } } },
      ]),
    ]);

    return { passFailRatio: passFail, gradeDistribution, gpaDistribution };
  },
};

export default analyticsService;
