import mongoose from "mongoose";
import StudentFeeAssignment from "../studentFeeAssignments/studentFeeAssignment.model.js";
import Payment from "../payments/payment.model.js";
import Student from "../students/student.model.js";

export const feeService = {
  async getStudentFees(studentId) {
    const assignments = await StudentFeeAssignment.find({ studentId })
      .populate("feeStructureId", "title code")
      .lean();

    return assignments.map((a) => ({
      _id: a._id,
      name: a.feeStructureId?.title || "Fee",
      amount: a.totalAmount,
      paidAmount: a.amountPaid,
      dueAmount: a.amountDue,
      dueDate: a.dueDate ? new Date(a.dueDate).toISOString().split("T")[0] : "",
      status: a.billingStatus,
    }));
  },

  async getStudentPaymentHistory(studentId) {
    const payments = await Payment.find({ studentId, paymentStatus: "completed" })
      .sort({ paymentDate: -1 })
      .lean();

    return payments.map((p) => ({
      _id: p._id,
      amount: p.totalAmount,
      paymentDate: p.paymentDate ? new Date(p.paymentDate).toISOString().split("T")[0] : "",
      paymentMethod: p.paymentMethod,
      reference: p.reference || "",
    }));
  },

  async getStudentFeeSummary(studentId) {
    const assignments = await StudentFeeAssignment.find({ studentId }).lean();
    const totalAssigned = assignments.reduce((sum, a) => sum + a.totalAmount, 0);
    const totalPaid = assignments.reduce((sum, a) => sum + a.amountPaid, 0);
    const totalDue = assignments.reduce((sum, a) => sum + a.amountDue, 0);

    return { totalAssigned, totalPaid, totalDue };
  },

  async getFeesOverview() {
    const overview = await StudentFeeAssignment.aggregate([
      {
        $group: {
          _id: "$studentId",
          totalAssigned: { $sum: "$totalAmount" },
          totalPaid: { $sum: "$amountPaid" },
          totalDue: { $sum: "$amountDue" },
        },
      },
      {
        $lookup: {
          from: "students",
          localField: "_id",
          foreignField: "_id",
          as: "studentInfo",
        },
      },
      { $unwind: "$studentInfo" },
      {
        $lookup: {
          from: "departments",
          localField: "studentInfo.departmentId",
          foreignField: "_id",
          as: "dept",
        },
      },
      { $unwind: { path: "$dept", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "semesters",
          localField: "studentInfo.semesterId",
          foreignField: "_id",
          as: "sem",
        },
      },
      { $unwind: { path: "$sem", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "academicsessions",
          localField: "studentInfo.academicSessionId",
          foreignField: "_id",
          as: "session",
        },
      },
      { $unwind: { path: "$session", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          studentId: "$_id",
          studentName: "$studentInfo.fullName",
          studentRoll: "$studentInfo.rollNumber",
          departmentName: "$dept.name",
          semesterName: "$sem.name",
          sessionName: "$session.name",
          totalAssigned: 1,
          totalPaid: 1,
          totalDue: 1,
          paymentStatus: {
            $cond: [
              { $eq: ["$totalDue", 0] },
              "paid",
              {
                $cond: [
                  { $eq: ["$totalPaid", 0] },
                  "unpaid",
                  "partial",
                ],
              },
            ],
          },
        },
      },
    ]);

    return overview;
  },
};

export default feeService;
