import Admin from "../admins/admin.model.js";
import Notice from "../notices/notice.model.js";
import dashboardService from "../dashboard/dashboard.service.js";
import ApiError from "../../utils/ApiError.js";
import { getPaginationParams, buildPaginationMeta } from "../../utils/pagination.js";

const adminMeService = {
  async getProfile(adminId) {
    const a = await Admin.findById(adminId).lean();
    if (!a) throw new ApiError(404, "Admin profile not found", "NOT_FOUND");
    return a;
  },

  async getNotices(query) {
    const { page, limit, skip } = getPaginationParams(query);
    const filter = {
      publishStatus: "published",
      audienceType:  { $in: ["all", "admins"] },
      $or: [{ expiresAt: null }, { expiresAt: { $gte: new Date() } }],
    };
    const [notices, total] = await Promise.all([
      Notice.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Notice.countDocuments(filter),
    ]);
    return { notices, pagination: buildPaginationMeta(total, page, limit) };
  },

  // Reuse dashboard service for mini snapshot
  async getDashboard() {
    return dashboardService.getAdminDashboard();
  },
};

export default adminMeService;
