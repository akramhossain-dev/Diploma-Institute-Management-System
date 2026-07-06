import Accountant from "../accountants/accountant.model.js";
import Payment from "../payments/payment.model.js";
import Notice from "../notices/notice.model.js";
import ApiError from "../../utils/ApiError.js";
import { getPaginationParams, buildPaginationMeta } from "../../utils/pagination.js";

const accountantMeService = {
  async getProfile(accountantId) {
    const a = await Accountant.findById(accountantId).lean();
    if (!a) throw new ApiError(404, "Accountant profile not found", "NOT_FOUND");
    return a;
  },

  async getPayments(accountantId, query) {
    const { page, limit, skip } = getPaginationParams(query);
    const filter = { collectedByAccountantId: accountantId, paymentStatus: "completed" };
    if (query.paymentMethod) filter.paymentMethod = query.paymentMethod;
    if (query.fromDate || query.toDate) {
      filter.paymentDate = {};
      if (query.fromDate) filter.paymentDate.$gte = new Date(query.fromDate);
      if (query.toDate)   filter.paymentDate.$lte = new Date(query.toDate);
    }

    const [payments, total] = await Promise.all([
      Payment.find(filter)
        .populate("studentId", "fullName studentId")
        .sort({ paymentDate: -1 })
        .skip(skip).limit(limit).lean(),
      Payment.countDocuments(filter),
    ]);
    return { payments, pagination: buildPaginationMeta(total, page, limit) };
  },

  async getSummary(accountantId) {
    const [totals, byMethod] = await Promise.all([
      Payment.aggregate([
        { $match: { collectedByAccountantId: accountantId, paymentStatus: "completed" } },
        { $group: { _id: null, totalCollected: { $sum: "$totalAmount" }, count: { $sum: 1 } } },
      ]),
      Payment.aggregate([
        { $match: { collectedByAccountantId: accountantId, paymentStatus: "completed" } },
        { $group: { _id: "$paymentMethod", total: { $sum: "$totalAmount" }, count: { $sum: 1 } } },
        { $sort: { total: -1 } },
      ]),
    ]);
    return { totals: totals[0] || { totalCollected: 0, count: 0 }, byPaymentMethod: byMethod };
  },

  async getNotices(query) {
    const { page, limit, skip } = getPaginationParams(query);
    const filter = {
      publishStatus: "published",
      audienceType:  { $in: ["all", "accountants"] },
      $or: [{ expiresAt: null }, { expiresAt: { $gte: new Date() } }],
    };
    const [notices, total] = await Promise.all([
      Notice.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Notice.countDocuments(filter),
    ]);
    return { notices, pagination: buildPaginationMeta(total, page, limit) };
  },
};

export default accountantMeService;
