import AcademicSession from "./academicSession.model.js";
import ApiError from "../../utils/ApiError.js";
import { getPaginationParams, buildPaginationMeta } from "../../utils/pagination.js";

const academicSessionService = {

  async createSession(data, adminId) {
    const { name, startYear, endYear, notes } = data;

    // Name uniqueness
    const exists = await AcademicSession.findOne({ name: { $regex: `^${name}$`, $options: "i" } });
    if (exists) throw new ApiError(409, `Academic session '${name}' already exists`, "DUPLICATE_ENTRY");

    // Construct Dates from start/end years
    const startDate = new Date(Date.UTC(parseInt(startYear, 10), 0, 1));
    const endDate = new Date(Date.UTC(parseInt(endYear, 10), 11, 31, 23, 59, 59));

    // Date logic validation
    if (endDate <= startDate) {
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

    let startDate = existing.startDate;
    let endDate = existing.endDate;

    if (data.startYear !== undefined || data.endYear !== undefined) {
      const startYear = data.startYear !== undefined ? parseInt(data.startYear, 10) : existing.startDate.getFullYear();
      const endYear   = data.endYear !== undefined   ? parseInt(data.endYear, 10)   : existing.endDate.getFullYear();

      startDate = new Date(Date.UTC(startYear, 0, 1));
      endDate = new Date(Date.UTC(endYear, 11, 31, 23, 59, 59));
    }

    if (endDate <= startDate) {
      throw new ApiError(400, "End date must be after start date", "VALIDATION_ERROR");
    }

    const updatePayload = { ...data };
    if (data.startYear !== undefined || data.endYear !== undefined) {
      updatePayload.startDate = startDate;
      updatePayload.endDate = endDate;
      delete updatePayload.startYear;
      delete updatePayload.endYear;
    }

    const session = await AcademicSession.findByIdAndUpdate(
      id,
      { $set: updatePayload },
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
