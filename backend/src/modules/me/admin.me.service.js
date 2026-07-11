import Admin from "../admins/admin.model.js";
import noticeService from "../notices/notice.service.js";
import dashboardService from "../dashboard/dashboard.service.js";
import ApiError from "../../utils/ApiError.js";
import { getPaginationParams, buildPaginationMeta } from "../../utils/pagination.js";

const adminMeService = {
  async getProfile(adminId) {
    const a = await Admin.findById(adminId).lean();
    if (!a) throw new ApiError(404, "Admin profile not found", "NOT_FOUND");
    return a;
  },

  async getNotices(adminId, query) {
    return noticeService.getNoticesForEntity(
      "admins",
      {},
      query
    );
  },

  async getDashboard() {
    return dashboardService.getAdminDashboard();
  },
};

export default adminMeService;
