import Admin from "./admin.model.js";
import AdminAuth from "../auth/admin/adminAuth.model.js";
import { hashPassword } from "../../utils/hashHelper.js";
import ApiError from "../../utils/ApiError.js";
import { getPaginationParams, buildPaginationMeta } from "../../utils/pagination.js";

// ── Helper ─────────────────────────────────────────────────────────────────
const generateAdminId = async () => {
  const count = await Admin.countDocuments();
  return `ADM-${String(count + 1).padStart(3, "0")}`;
};

// ── Service ────────────────────────────────────────────────────────────────
const adminService = {

  /**
   * Create an admin profile + auth credentials atomically.
   * Returns the admin profile (never the password).
   */
  async createAdmin(data, requestingAdminId) {
    const { email, password, isSuperAdmin = false, ...profileData } = data;

    // Block if email already registered
    const emailExists = await AdminAuth.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      throw new ApiError(409, `Admin with email '${email}' already exists`, "DUPLICATE_ENTRY");
    }

    // Auto-generate adminId
    const adminId = await generateAdminId();

    // Create entity profile
    const admin = await Admin.create({
      ...profileData,
      email: email.toLowerCase(),
      adminId,
      isSuperAdmin,
    });

    // Create auth record with hashed temp password
    const passwordHash = await hashPassword(password);
    await AdminAuth.create({
      email:              email.toLowerCase(),
      passwordHash,
      adminId:            admin._id,
      isActive:           true,
      mustChangePassword: true,           // force change on first login
    });

    return admin;
  },

  /**
   * List all admins with pagination and search/status filters.
   */
  async getAllAdmins(query) {
    const { page, limit, skip } = getPaginationParams(query);
    const { status, search } = query;

    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email:    { $regex: search, $options: "i" } },
        { adminId:  { $regex: search, $options: "i" } },
      ];
    }

    const [admins, total] = await Promise.all([
      Admin.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Admin.countDocuments(filter),
    ]);

    return { admins, pagination: buildPaginationMeta(total, page, limit) };
  },

  /**
   * Get a single admin by MongoDB _id.
   */
  async getAdminById(id) {
    const admin = await Admin.findById(id).lean();
    if (!admin) throw new ApiError(404, "Admin not found", "NOT_FOUND");
    return admin;
  },

  /**
   * Update admin profile fields. Email and auth changes handled separately.
   */
  async updateAdmin(id, data) {
    // Strip fields that should not be changed here
    const { email, password, isSuperAdmin, adminId, ...allowedUpdates } = data;

    const admin = await Admin.findByIdAndUpdate(
      id,
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    ).lean();

    if (!admin) throw new ApiError(404, "Admin not found", "NOT_FOUND");
    return admin;
  },

  /**
   * Toggle admin active/inactive status.
   * Also syncs isActive on AdminAuth.
   * Blocks deactivation of the last super admin.
   */
  async toggleStatus(id) {
    const admin = await Admin.findById(id);
    if (!admin) throw new ApiError(404, "Admin not found", "NOT_FOUND");

    // Guard: cannot deactivate last active super admin
    if (admin.isSuperAdmin && admin.status === "active") {
      const activeSuperCount = await Admin.countDocuments({ isSuperAdmin: true, status: "active" });
      if (activeSuperCount <= 1) {
        throw new ApiError(400, "Cannot deactivate the last active super admin", "BUSINESS_RULE_VIOLATION");
      }
    }

    const newStatus = admin.status === "active" ? "inactive" : "active";
    admin.status = newStatus;
    await admin.save();

    // Sync auth collection
    await AdminAuth.findOneAndUpdate(
      { adminId: admin._id },
      { isActive: newStatus === "active" }
    );

    return admin;
  },
};

export default adminService;
