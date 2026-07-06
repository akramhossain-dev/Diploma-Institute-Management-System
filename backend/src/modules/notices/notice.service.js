import Notice from "./notice.model.js";
import Department from "../departments/department.model.js";
import Semester from "../semesters/semester.model.js";
import AcademicSession from "../academicSessions/academicSession.model.js";
import ApiError from "../../utils/ApiError.js";
import { getPaginationParams, buildPaginationMeta } from "../../utils/pagination.js";

// ── Status transition map ───────────────────────────────────────────────────
const NOTICE_TRANSITIONS = {
  draft:     ["published", "archived"],
  published: ["archived"],
  archived:  [],                          // terminal
};

const noticeService = {

  // ────────────────────────────────────────────────────────────────────────
  // CREATE (creates in draft by default)
  // ────────────────────────────────────────────────────────────────────────
  async createNotice(data, adminId) {
    const {
      targetDepartmentIds = [],
      targetSemesterIds   = [],
      targetAcademicSessionIds = [],
    } = data;

    // Validate all referenced arrays
    await this._validateTargetRefs(targetDepartmentIds, targetSemesterIds, targetAcademicSessionIds);

    const notice = await Notice.create({
      ...data,
      createdByAdminId: adminId,
      publishStatus:    "draft",
      publishedAt:      null,
    });

    return notice;
  },

  // ────────────────────────────────────────────────────────────────────────
  // LIST with filters
  // ────────────────────────────────────────────────────────────────────────
  async getAllNotices(query) {
    const { page, limit, skip } = getPaginationParams(query);
    const { publishStatus, noticeType, priority, audience, departmentId, semesterId, search } = query;

    const filter = {};
    if (publishStatus) filter.publishStatus   = publishStatus;
    if (noticeType)    filter.noticeType       = noticeType;
    if (priority)      filter.priority         = priority;
    if (audience)      filter.targetAudience   = { $in: [audience, "all"] };
    if (departmentId)  filter.targetDepartmentIds = departmentId;
    if (semesterId)    filter.targetSemesterIds   = semesterId;
    if (search)        filter.$or = [
      { title:   { $regex: search, $options: "i" } },
      { content: { $regex: search, $options: "i" } },
    ];

    // Exclude expired notices unless explicitly requesting archived
    if (publishStatus !== "archived") {
      filter.$or = filter.$or || [];
      filter.$or = [
        ...(filter.$or || []),
      ];
      // Filter out expired notices
      filter.$and = [
        { $or: [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }] },
      ];
    }

    const [notices, total] = await Promise.all([
      Notice.find(filter)
        .populate("createdByAdminId",     "fullName adminId")
        .populate("targetDepartmentIds",  "name code")
        .populate("targetSemesterIds",    "name number")
        .populate("targetAcademicSessionIds", "name")
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip(skip).limit(limit).lean(),
      Notice.countDocuments(filter),
    ]);

    return { notices, pagination: buildPaginationMeta(total, page, limit) };
  },

  async getNoticeById(id) {
    const notice = await Notice.findById(id)
      .populate("createdByAdminId",         "fullName adminId")
      .populate("lastEditedByAdminId",      "fullName adminId")
      .populate("targetDepartmentIds",      "name code")
      .populate("targetSemesterIds",        "name number")
      .populate("targetAcademicSessionIds", "name")
      .lean();

    if (!notice) throw new ApiError(404, "Notice not found", "NOT_FOUND");
    return notice;
  },

  // ────────────────────────────────────────────────────────────────────────
  // UPDATE (only drafts can be freely edited)
  // ────────────────────────────────────────────────────────────────────────
  async updateNotice(id, data, adminId) {
    const notice = await Notice.findById(id);
    if (!notice) throw new ApiError(404, "Notice not found", "NOT_FOUND");

    if (notice.publishStatus === "archived") {
      throw new ApiError(400, "Archived notices cannot be edited", "BUSINESS_RULE_VIOLATION");
    }

    const {
      targetDepartmentIds      = notice.targetDepartmentIds,
      targetSemesterIds        = notice.targetSemesterIds,
      targetAcademicSessionIds = notice.targetAcademicSessionIds,
    } = data;

    await this._validateTargetRefs(targetDepartmentIds, targetSemesterIds, targetAcademicSessionIds);

    // Strip status — handled by dedicated methods
    const { publishStatus, publishedAt, ...allowedUpdates } = data;

    const updated = await Notice.findByIdAndUpdate(
      id,
      { $set: { ...allowedUpdates, lastEditedByAdminId: adminId } },
      { new: true, runValidators: true }
    )
      .populate("createdByAdminId", "fullName")
      .lean();

    return updated;
  },

  // ────────────────────────────────────────────────────────────────────────
  // STATUS TRANSITIONS
  // ────────────────────────────────────────────────────────────────────────
  async _changeStatus(id, targetStatus, adminId) {
    const notice = await Notice.findById(id);
    if (!notice) throw new ApiError(404, "Notice not found", "NOT_FOUND");

    const allowed = NOTICE_TRANSITIONS[notice.publishStatus] || [];
    if (!allowed.includes(targetStatus)) {
      throw new ApiError(
        400,
        `Cannot transition notice from '${notice.publishStatus}' to '${targetStatus}'`,
        "INVALID_STATUS_TRANSITION"
      );
    }

    notice.publishStatus        = targetStatus;
    notice.lastEditedByAdminId  = adminId;
    if (targetStatus === "published") notice.publishedAt = new Date();

    await notice.save();
    return notice;
  },

  async publishNotice(id, adminId) {
    const notice = await Notice.findById(id);
    if (!notice) throw new ApiError(404, "Notice not found", "NOT_FOUND");

    if (!notice.title || !notice.content) {
      throw new ApiError(400, "Notice must have a title and content before publishing", "VALIDATION_ERROR");
    }

    return this._changeStatus(id, "published", adminId);
  },

  async archiveNotice(id, adminId) {
    return this._changeStatus(id, "archived", adminId);
  },

  // ── Internal: validate referenced ID arrays ────────────────────────────
  async _validateTargetRefs(deptIds, semIds, sessionIds) {
    const checks = [];

    if (deptIds.length > 0) {
      checks.push(
        Department.countDocuments({ _id: { $in: deptIds } }).then((count) => {
          if (count !== deptIds.length)
            throw new ApiError(400, "One or more targetDepartmentIds are invalid", "VALIDATION_ERROR");
        })
      );
    }
    if (semIds.length > 0) {
      checks.push(
        Semester.countDocuments({ _id: { $in: semIds } }).then((count) => {
          if (count !== semIds.length)
            throw new ApiError(400, "One or more targetSemesterIds are invalid", "VALIDATION_ERROR");
        })
      );
    }
    if (sessionIds.length > 0) {
      checks.push(
        AcademicSession.countDocuments({ _id: { $in: sessionIds } }).then((count) => {
          if (count !== sessionIds.length)
            throw new ApiError(400, "One or more targetAcademicSessionIds are invalid", "VALIDATION_ERROR");
        })
      );
    }

    await Promise.all(checks);
  },

  // ────────────────────────────────────────────────────────────────────────
  // ENTITY-SPECIFIC NOTICE FEED (used by students/teachers to get their notices)
  // ────────────────────────────────────────────────────────────────────────
  async getNoticesForEntity(entityType, { departmentId, semesterId, academicSessionId } = {}, query = {}) {
    const { page, limit, skip } = getPaginationParams(query);

    const filter = {
      publishStatus: "published",
      $or:           [{ expiresAt: null }, { expiresAt: { $gt: new Date() } }],
      $and: [
        { targetAudience: { $in: [entityType, "all"] } },
      ],
    };

    if (departmentId)      filter.targetDepartmentIds      = { $in: [departmentId,      null] };
    if (semesterId)        filter.targetSemesterIds        = { $in: [semesterId,        null] };
    if (academicSessionId) filter.targetAcademicSessionIds = { $in: [academicSessionId, null] };

    const [notices, total] = await Promise.all([
      Notice.find(filter)
        .select("-lastEditedByAdminId -createdByAdminId")
        .sort({ priority: -1, publishedAt: -1 })
        .skip(skip).limit(limit).lean(),
      Notice.countDocuments(filter),
    ]);

    return { notices, pagination: buildPaginationMeta(total, page, limit) };
  },
};

export default noticeService;
