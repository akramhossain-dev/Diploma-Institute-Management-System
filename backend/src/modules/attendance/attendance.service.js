import mongoose from "mongoose";
import AttendanceSession from "./attendanceSession.model.js";
import AttendanceRecord from "./attendanceRecord.model.js";
import Student from "../students/student.model.js";
import ApiError from "../../utils/ApiError.js";
import { getPaginationParams, buildPaginationMeta } from "../../utils/pagination.js";

const attendanceService = {

  // ──────────────────────────────────────────────────────────────────────────
  // CREATE SESSION + BULK MARK ATTENDANCE
  // Uses bulkWrite for O(1) DB round trips regardless of student count
  // ──────────────────────────────────────────────────────────────────────────
  async createSessionWithAttendance(data, markerId, markerType = "teacher") {
    const {
      courseId, teacherId, departmentId, semesterId, academicSessionId,
      section = null, attendanceDate, topic,
      teacherAssignmentId = null, classRoutineId = null,
      records = [],
    } = data;

    // 1. Normalize date to midnight UTC to avoid time-zone collisions
    const normalizedDate = new Date(attendanceDate);
    normalizedDate.setUTCHours(0, 0, 0, 0);

    // 2. Check for duplicate session
    const existing = await AttendanceSession.findOne({
      courseId,
      attendanceDate:    normalizedDate,
      academicSessionId,
      section:           section || null,
    });
    if (existing) {
      throw new ApiError(
        409,
        "An attendance session already exists for this course / date / section",
        "DUPLICATE_ENTRY"
      );
    }

    // 3. Validate all student IDs belong to the correct context
    const studentIds = records.map((r) => r.studentId);
    const validStudents = await Student.find({
      _id:               { $in: studentIds },
      departmentId,
      semesterId,
      academicSessionId,
      status:            "active",
    }).select("_id").lean();

    const validStudentSet = new Set(validStudents.map((s) => String(s._id)));
    const invalidStudents = studentIds.filter((id) => !validStudentSet.has(String(id)));

    if (invalidStudents.length > 0) {
      throw new ApiError(
        400,
        `${invalidStudents.length} student(s) do not belong to this class context or are inactive`,
        "INVALID_STUDENT_CONTEXT"
      );
    }

    // 4. Create session document
    const session = await AttendanceSession.create({
      courseId,
      teacherId,
      departmentId,
      semesterId,
      academicSessionId,
      section:           section || null,
      teacherAssignmentId: teacherAssignmentId || null,
      classRoutineId:      classRoutineId      || null,
      attendanceDate:    normalizedDate,
      topic:             topic || null,
      sessionStatus:     "open",
      markedByTeacherId: markerType === "teacher" ? markerId : null,
      markedByAdminId:   markerType === "admin"   ? markerId : null,
      totalStudents:     records.length,
    });

    // 5. Bulk-insert attendance records using bulkWrite (upsert-safe)
    const bulkOps = records.map((record) => ({
      insertOne: {
        document: {
          attendanceSessionId: session._id,
          studentId:           record.studentId,
          courseId,
          departmentId,
          semesterId,
          academicSessionId,
          attendanceDate:      normalizedDate,
          status:              record.status   || "absent",
          remarks:             record.remarks  || null,
          createdAt:           new Date(),
          updatedAt:           new Date(),
        },
      },
    }));

    await AttendanceRecord.bulkWrite(bulkOps, { ordered: false });

    // 6. Compute and patch aggregate counters on session
    await this._refreshSessionCounters(session._id);

    return session;
  },

  // ──────────────────────────────────────────────────────────────────────────
  // LIST SESSIONS
  // ──────────────────────────────────────────────────────────────────────────
  async getAllSessions(query) {
    const { page, limit, skip } = getPaginationParams(query);
    const { teacherId, courseId, departmentId, semesterId, academicSessionId, section, sessionStatus, fromDate, toDate } = query;

    const filter = {};
    if (teacherId)         filter.teacherId         = teacherId;
    if (courseId)          filter.courseId          = courseId;
    if (departmentId)      filter.departmentId      = departmentId;
    if (semesterId)        filter.semesterId        = semesterId;
    if (academicSessionId) filter.academicSessionId = academicSessionId;
    if (section)           filter.section           = section;
    if (sessionStatus)     filter.sessionStatus     = sessionStatus;
    if (fromDate || toDate) {
      filter.attendanceDate = {};
      if (fromDate) filter.attendanceDate.$gte = new Date(fromDate);
      if (toDate)   filter.attendanceDate.$lte = new Date(toDate);
    }

    const [sessions, total] = await Promise.all([
      AttendanceSession.find(filter)
        .populate("teacherId",   "fullName employeeId")
        .populate("courseId",    "title code")
        .populate("departmentId", "name code")
        .populate("semesterId",   "name number")
        .sort({ attendanceDate: -1 })
        .skip(skip).limit(limit).lean(),
      AttendanceSession.countDocuments(filter),
    ]);

    return { sessions, pagination: buildPaginationMeta(total, page, limit) };
  },

  // ──────────────────────────────────────────────────────────────────────────
  // GET SESSION WITH ALL RECORDS
  // ──────────────────────────────────────────────────────────────────────────
  async getSessionById(id) {
    const [session, records] = await Promise.all([
      AttendanceSession.findById(id)
        .populate("teacherId",   "fullName employeeId")
        .populate("courseId",    "title code")
        .populate("departmentId", "name code")
        .populate("semesterId",   "name number")
        .lean(),
      AttendanceRecord.find({ attendanceSessionId: id })
        .populate("studentId", "fullName studentId rollNumber")
        .sort({ "studentId.rollNumber": 1 })
        .lean(),
    ]);

    if (!session) throw new ApiError(404, "Attendance session not found", "NOT_FOUND");

    return { session, records };
  },

  // ──────────────────────────────────────────────────────────────────────────
  // UPDATE RECORDS (correction flow — only allowed on open sessions)
  // ──────────────────────────────────────────────────────────────────────────
  async updateSessionRecords(sessionId, records, markerId, markerType) {
    const session = await AttendanceSession.findById(sessionId);
    if (!session) throw new ApiError(404, "Attendance session not found", "NOT_FOUND");

    if (markerType === "teacher" && String(session.teacherId) !== String(markerId)) {
      throw new ApiError(403, "Access denied. You cannot modify another teacher's session.", "FORBIDDEN");
    }

    if (session.sessionStatus === "finalized") {
      throw new ApiError(400, "Finalized sessions cannot be modified", "BUSINESS_RULE_VIOLATION");
    }
    if (session.sessionStatus === "cancelled") {
      throw new ApiError(400, "Cancelled sessions cannot be modified", "BUSINESS_RULE_VIOLATION");
    }

    // Update records using bulkWrite for efficiency
    const bulkOps = records.map((r) => ({
      updateOne: {
        filter: { attendanceSessionId: sessionId, studentId: r.studentId },
        update: {
          $set: {
            status:    r.status,
            remarks:   r.remarks || null,
            updatedAt: new Date(),
          },
        },
        upsert: false,   // do not create — student must already be in session
      },
    }));

    await AttendanceRecord.bulkWrite(bulkOps, { ordered: false });

    // Refresh counters
    await this._refreshSessionCounters(sessionId);

    return AttendanceSession.findById(sessionId).lean();
  },

  // ──────────────────────────────────────────────────────────────────────────
  // FINALIZE SESSION — lock it permanently
  // ──────────────────────────────────────────────────────────────────────────
  async finalizeSession(sessionId, markerId, markerType) {
    const session = await AttendanceSession.findById(sessionId);
    if (!session) throw new ApiError(404, "Attendance session not found", "NOT_FOUND");

    if (markerType === "teacher" && String(session.teacherId) !== String(markerId)) {
      throw new ApiError(403, "Access denied. You cannot finalize another teacher's session.", "FORBIDDEN");
    }

    if (session.sessionStatus === "finalized") {
      throw new ApiError(400, "Session is already finalized", "ALREADY_DONE");
    }

    await this._refreshSessionCounters(sessionId);

    session.sessionStatus = "finalized";
    await session.save();
    return session;
  },

  // ──────────────────────────────────────────────────────────────────────────
  // GET STUDENT'S ATTENDANCE RECORDS
  // ──────────────────────────────────────────────────────────────────────────
  async getStudentAttendance(studentId, query) {
    const { page, limit, skip } = getPaginationParams(query);
    const { courseId, academicSessionId, fromDate, toDate, status } = query;

    const filter = { studentId };
    if (courseId)          filter.courseId          = courseId;
    if (academicSessionId) filter.academicSessionId = academicSessionId;
    if (status)            filter.status            = status;
    if (fromDate || toDate) {
      filter.attendanceDate = {};
      if (fromDate) filter.attendanceDate.$gte = new Date(fromDate);
      if (toDate)   filter.attendanceDate.$lte = new Date(toDate);
    }

    const [records, total] = await Promise.all([
      AttendanceRecord.find(filter)
        .populate("courseId",            "title code")
        .populate("attendanceSessionId", "topic sessionStatus")
        .sort({ attendanceDate: -1 })
        .skip(skip).limit(limit).lean(),
      AttendanceRecord.countDocuments(filter),
    ]);

    return { records, pagination: buildPaginationMeta(total, page, limit) };
  },

  // ──────────────────────────────────────────────────────────────────────────
  // ATTENDANCE SUMMARY PER STUDENT — percentage per course
  // Supports future exam eligibility checks
  // ──────────────────────────────────────────────────────────────────────────
  async getStudentAttendanceSummary(studentId, query) {
    const { academicSessionId } = query;

    const matchFilter = { studentId: new mongoose.Types.ObjectId(studentId) };
    if (academicSessionId) {
      matchFilter.academicSessionId = new mongoose.Types.ObjectId(academicSessionId);
    }

    const summary = await AttendanceRecord.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id:           "$courseId",
          totalClasses:  { $sum: 1 },
          presentCount:  { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } },
          absentCount:   { $sum: { $cond: [{ $eq: ["$status", "absent"]  }, 1, 0] } },
          lateCount:     { $sum: { $cond: [{ $eq: ["$status", "late"]    }, 1, 0] } },
          excusedCount:  { $sum: { $cond: [{ $eq: ["$status", "excused"] }, 1, 0] } },
        },
      },
      {
        $addFields: {
          attendancePercent: {
            $round: [
              {
                $multiply: [
                  { $divide: [{ $add: ["$presentCount", "$lateCount"] }, "$totalClasses"] },
                  100,
                ],
              },
              1,   // 1 decimal place
            ],
          },
          isEligible: {
            // Eligible if attendance % >= 75% (configurable in Phase 5 institute settings)
            $gte: [
              { $divide: [{ $add: ["$presentCount", "$lateCount"] }, "$totalClasses"] },
              0.75,
            ],
          },
        },
      },
      {
        $lookup: {
          from:         "courses",
          localField:   "_id",
          foreignField: "_id",
          as:           "course",
          pipeline:     [{ $project: { title: 1, code: 1, type: 1, creditHours: 1 } }],
        },
      },
      { $unwind: { path: "$course", preserveNullAndEmptyArrays: true } },
      { $sort: { "course.code": 1 } },
    ]);

    return summary;
  },

  // ──────────────────────────────────────────────────────────────────────────
  // INTERNAL: Refresh aggregate counters on AttendanceSession
  // ──────────────────────────────────────────────────────────────────────────
  async _refreshSessionCounters(sessionId) {
    const counts = await AttendanceRecord.aggregate([
      { $match: { attendanceSessionId: new mongoose.Types.ObjectId(sessionId) } },
      {
        $group: {
          _id:          null,
          totalStudents: { $sum: 1 },
          presentCount:  { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } },
          absentCount:   { $sum: { $cond: [{ $eq: ["$status", "absent"]  }, 1, 0] } },
          lateCount:     { $sum: { $cond: [{ $eq: ["$status", "late"]    }, 1, 0] } },
          excusedCount:  { $sum: { $cond: [{ $eq: ["$status", "excused"] }, 1, 0] } },
        },
      },
    ]);

    if (counts.length > 0) {
      const { totalStudents, presentCount, absentCount, lateCount, excusedCount } = counts[0];
      await AttendanceSession.findByIdAndUpdate(sessionId, {
        $set: { totalStudents, presentCount, absentCount, lateCount, excusedCount },
      });
    }
  },
};

export default attendanceService;
