import AcademicSession from "./academicSession.model.js";
import ApiError from "../../utils/ApiError.js";
import { getPaginationParams, buildPaginationMeta } from "../../utils/pagination.js";

const academicSessionService = {

  async createSession(data, adminId) {
    const { name, startDate, endDate, notes } = data;

    // Name uniqueness
    const exists = await AcademicSession.findOne({ name: { $regex: `^${name}$`, $options: "i" } });
    if (exists) throw new ApiError(409, `Academic session '${name}' already exists`, "DUPLICATE_ENTRY");

    // Date logic
    if (new Date(endDate) <= new Date(startDate)) {
      throw new ApiError(400, "End date must be after start date", "VALIDATION_ERROR");
    }

    const session = await AcademicSession.create({
      name,
      startDate,
      endDate,
      notes,
      status: "planned",
      isCurrent: false,
      createdByAdminId: adminId,
    });

    return session;
  },

  async getAllSessions(query) {
    const { page, limit, skip } = getPaginationParams(query);
    const { status } = query;

    const filter = {};
    if (status) filter.status = status;

    const [sessions, total] = await Promise.all([
      AcademicSession.find(filter)
        .populate("createdByAdminId", "fullName adminId")
        .sort({ startDate: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AcademicSession.countDocuments(filter),
    ]);

    return { sessions, pagination: buildPaginationMeta(total, page, limit) };
  },

  async getCurrentSession() {
    const session = await AcademicSession.findOne({ isCurrent: true }).lean();
    if (!session) throw new ApiError(404, "No current academic session is set", "NOT_FOUND");
    return session;
  },

  async getSessionById(id) {
    const session = await AcademicSession.findById(id)
      .populate("createdByAdminId", "fullName adminId")
      .lean();
    if (!session) throw new ApiError(404, "Academic session not found", "NOT_FOUND");
    return session;
  },

  async updateSession(id, data) {
    // Prevent editing a completed session
    const existing = await AcademicSession.findById(id);
    if (!existing) throw new ApiError(404, "Academic session not found", "NOT_FOUND");

    if (existing.status === "completed") {
      throw new ApiError(400, "Completed sessions cannot be edited", "BUSINESS_RULE_VIOLATION");
    }

    // Validate dates if both provided
    const startDate = data.startDate ? new Date(data.startDate) : existing.startDate;
    const endDate   = data.endDate   ? new Date(data.endDate)   : existing.endDate;

    if (endDate <= startDate) {
      throw new ApiError(400, "End date must be after start date", "VALIDATION_ERROR");
    }

    const session = await AcademicSession.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).lean();

    return session;
  },

  /**
   * Set a session as the current active one.
   * Clears isCurrent on any previously marked session first.
   */
  async setCurrentSession(id) {
    const session = await AcademicSession.findById(id);
    if (!session) throw new ApiError(404, "Academic session not found", "NOT_FOUND");

    if (session.status === "completed") {
      throw new ApiError(400, "A completed session cannot be set as current", "BUSINESS_RULE_VIOLATION");
    }

    // Unset current flag on all other sessions
    await AcademicSession.updateMany(
      { _id: { $ne: id }, isCurrent: true },
      { $set: { isCurrent: false } }
    );

    session.isCurrent = true;
    session.status    = "active";
    await session.save();

    return session;
  },
};

export default academicSessionService;
