import AuditLog from "./auditLog.model.js";
import { getPaginationParams, buildPaginationMeta } from "../../utils/pagination.js";
import logger from "../../utils/logger.js";

const auditLogService = {

  /**
   * Log an action to the audit trail.
   * Safe to call without await — errors are caught and logged, never thrown.
   *
   * @param {object} opts
   * @param {string} opts.actorType       - 'admin' | 'teacher' | 'accountant' | 'student' | 'system'
   * @param {string} [opts.actorId]       - ObjectId of the actor
   * @param {string} opts.actorName       - Display name
   * @param {string} opts.actorIdentifier - Email or user ID string
   * @param {string} opts.action          - Uppercase action slug e.g. 'CREATE_STUDENT'
   * @param {string} opts.targetModule    - Module name e.g. 'Students'
   * @param {string} opts.targetEntity    - Human-readable target e.g. 'Student (CST-2026-001)'
   * @param {string} [opts.targetId]      - ObjectId of the affected document
   * @param {object} [opts.metadata]      - Additional context { ip, userAgent, before, after }
   * @param {string} [opts.severity]      - 'low' | 'medium' | 'high' | 'critical'
   */
  async log(opts) {
    try {
      await AuditLog.create({
        actorType:       opts.actorType,
        actorId:         opts.actorId         || null,
        actorName:       opts.actorName,
        actorIdentifier: opts.actorIdentifier,
        action:          opts.action.toUpperCase(),
        targetModule:    opts.targetModule,
        targetEntity:    opts.targetEntity,
        targetId:        opts.targetId        || null,
        metadata:        opts.metadata        || {},
        severity:        opts.severity        || "low",
      });
    } catch (err) {
      
      logger.error(`[AuditLog] Failed to write audit entry: ${err.message}`);
    }
  },

  async getAuditLogs(query = {}) {
    const { page, limit, skip } = getPaginationParams(query);
    const { actorType, targetModule, action, severity, search, fromDate, toDate } = query;

    const filter = {};
    if (actorType   && actorType   !== "all") filter.actorType   = actorType;
    if (targetModule && targetModule !== "all") filter.targetModule = targetModule;
    if (action      && action      !== "all") filter.action      = action.toUpperCase();
    if (severity    && severity    !== "all") filter.severity    = severity;

    if (fromDate || toDate) {
      filter.createdAt = {};
      if (fromDate) filter.createdAt.$gte = new Date(fromDate);
      if (toDate)   filter.createdAt.$lte = new Date(toDate);
    }

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [
        { actorName:       regex },
        { actorIdentifier: regex },
        { targetEntity:    regex },
        { action:          regex },
      ];
    }

    const [logs, total] = await Promise.all([
      AuditLog.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AuditLog.countDocuments(filter),
    ]);

    return { logs, pagination: buildPaginationMeta(total, page, limit) };
  },

  async getFilterOptions() {
    const [modules, actions] = await Promise.all([
      AuditLog.distinct("targetModule"),
      AuditLog.distinct("action"),
    ]);
    return { modules: modules.sort(), actions: actions.sort() };
  },
};

export default auditLogService;
