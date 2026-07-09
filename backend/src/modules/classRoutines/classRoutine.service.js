import ClassRoutine from "./classRoutine.model.js";
import TeacherAssignment from "../teacherAssignments/teacherAssignment.model.js";
import Teacher from "../teachers/teacher.model.js";
import Course from "../courses/course.model.js";
import Department from "../departments/department.model.js";
import Semester from "../semesters/semester.model.js";
import AcademicSession from "../academicSessions/academicSession.model.js";
import ApiError from "../../utils/ApiError.js";
import { getPaginationParams, buildPaginationMeta } from "../../utils/pagination.js";

/**
 * Detect time overlap between two HH:MM slots.
 * Two slots overlap when slot1.start < slot2.end AND slot1.end > slot2.start
 * String lexicographic comparison works for HH:MM 24-hour format.
 */
const buildOverlapFilter = (dayOfWeek, startTime, endTime, excludeId = null) => {
  const filter = {
    dayOfWeek,
    routineStatus: "active",
    startTime: { $lt: endTime },   // existing slot starts before new slot ends
    endTime:   { $gt: startTime }, // existing slot ends after new slot starts
  };
  if (excludeId) filter._id = { $ne: excludeId };
  return filter;
};

const classRoutineService = {

  async createRoutine(data, adminId) {
    const {
      teacherId, courseId, departmentId, semesterId, academicSessionId,
      teacherAssignmentId, dayOfWeek, startTime, endTime, room, section,
    } = data;

    // 1. Validate referenced entities exist
    const [teacher, course, dept, semester, session] = await Promise.all([
      Teacher.findById(teacherId).lean(),
      Course.findById(courseId).lean(),
      Department.findById(departmentId).lean(),
      Semester.findById(semesterId).lean(),
      AcademicSession.findById(academicSessionId).lean(),
    ]);

    if (!teacher)  throw new ApiError(404, "Teacher not found",          "NOT_FOUND");
    if (!course)   throw new ApiError(404, "Course not found",           "NOT_FOUND");
    if (!dept)     throw new ApiError(404, "Department not found",       "NOT_FOUND");
    if (!semester) throw new ApiError(404, "Semester not found",         "NOT_FOUND");
    if (!session)  throw new ApiError(404, "Academic session not found", "NOT_FOUND");

    // 2. If assignment provided, validate its context matches
    if (teacherAssignmentId) {
      const assignment = await TeacherAssignment.findById(teacherAssignmentId).lean();
      if (!assignment) throw new ApiError(404, "Teacher assignment not found", "NOT_FOUND");

      if (
        String(assignment.teacherId)         !== String(teacherId)         ||
        String(assignment.courseId)          !== String(courseId)          ||
        String(assignment.academicSessionId) !== String(academicSessionId)
      ) {
        throw new ApiError(
          400,
          "Routine context (teacher/course/session) does not match the referenced assignment",
          "CONTEXT_MISMATCH"
        );
      }
    }

    // 3. Time conflict detection — run 3 checks in parallel
    const baseConflict = buildOverlapFilter(dayOfWeek, startTime, endTime);

    const [teacherConflict, roomConflict, sectionConflict] = await Promise.all([
      // Same teacher, same day, overlapping time
      ClassRoutine.findOne({ ...baseConflict, teacherId }),

      // Same room, same day, overlapping time (only if room provided)
      room
        ? ClassRoutine.findOne({ ...baseConflict, room })
        : Promise.resolve(null),

      // Same dept+sem+section, same day, overlapping time (student timetable conflict)
      section
        ? ClassRoutine.findOne({ ...baseConflict, departmentId, semesterId, section })
        : Promise.resolve(null),
    ]);

    if (teacherConflict) {
      throw new ApiError(
        409,
        `Teacher already has a class on ${dayOfWeek} from ${teacherConflict.startTime} to ${teacherConflict.endTime}`,
        "SCHEDULE_CONFLICT"
      );
    }
    if (roomConflict) {
      throw new ApiError(
        409,
        `Room '${room}' is already occupied on ${dayOfWeek} from ${roomConflict.startTime} to ${roomConflict.endTime}`,
        "SCHEDULE_CONFLICT"
      );
    }
    if (sectionConflict) {
      throw new ApiError(
        409,
        `Section '${section}' already has a class on ${dayOfWeek} during this time slot`,
        "SCHEDULE_CONFLICT"
      );
    }

    const routine = await ClassRoutine.create({ ...data, createdByAdminId: adminId });
    return routine;
  },

  async getAllRoutines(query) {
    const { page, limit, skip } = getPaginationParams(query);
    const { teacherId, courseId, departmentId, semesterId, academicSessionId, dayOfWeek, routineStatus, section } = query;

    const filter = {};
    if (teacherId)         filter.teacherId         = teacherId;
    if (courseId)          filter.courseId          = courseId;
    if (departmentId)      filter.departmentId      = departmentId;
    if (semesterId)        filter.semesterId        = semesterId;
    if (academicSessionId) filter.academicSessionId = academicSessionId;
    if (dayOfWeek)         filter.dayOfWeek         = dayOfWeek;
    if (routineStatus)     filter.routineStatus     = routineStatus;
    if (section)           filter.section           = section;

    // Default: active only
    if (!routineStatus) filter.routineStatus = "active";

    const [routines, total] = await Promise.all([
      ClassRoutine.find(filter)
        .populate("teacherId",             "fullName employeeId")
        .populate("courseId",              "title code")
        .populate("departmentId",          "name code")
        .populate("semesterId",            "name number")
        .populate("academicSessionId",     "name")
        .populate("teacherAssignmentId",   "assignmentStatus")
        .sort({ dayOfWeek: 1, startTime: 1 })
        .skip(skip).limit(limit).lean(),
      ClassRoutine.countDocuments(filter),
    ]);

    return { routines, pagination: buildPaginationMeta(total, page, limit) };
  },

  async getRoutineById(id) {
    const routine = await ClassRoutine.findById(id)
      .populate("teacherId",           "fullName employeeId email")
      .populate("courseId",            "title code type creditHours")
      .populate("departmentId",        "name code")
      .populate("semesterId",          "name number")
      .populate("academicSessionId",   "name")
      .populate("teacherAssignmentId", "assignmentStatus section")
      .lean();

    if (!routine) throw new ApiError(404, "Class routine not found", "NOT_FOUND");
    return routine;
  },

  async updateRoutine(id, data) {
    const existing = await ClassRoutine.findById(id);
    if (!existing) throw new ApiError(404, "Class routine not found", "NOT_FOUND");

    if (existing.routineStatus === "cancelled") {
      throw new ApiError(400, "Cancelled routines cannot be edited", "BUSINESS_RULE_VIOLATION");
    }

    // Re-check time conflicts if time/day fields are changing
    const dayOfWeek = data.dayOfWeek  || existing.dayOfWeek;
    const startTime = data.startTime  || existing.startTime;
    const endTime   = data.endTime    || existing.endTime;
    const room      = data.room       !== undefined ? data.room       : existing.room;
    const section   = data.section    !== undefined ? data.section    : existing.section;
    const teacherId = data.teacherId || existing.teacherId;
    const departmentId = data.departmentId || existing.departmentId;
    const semesterId   = data.semesterId || existing.semesterId;


    if (endTime <= startTime) {
      throw new ApiError(400, "endTime must be after startTime", "VALIDATION_ERROR");
    }

    const baseConflict = buildOverlapFilter(dayOfWeek, startTime, endTime, id);

    const [teacherConflict, roomConflict, sectionConflict] = await Promise.all([
      ClassRoutine.findOne({ ...baseConflict, teacherId }),
      room  ? ClassRoutine.findOne({ ...baseConflict, room })                              : null,
      section ? ClassRoutine.findOne({ ...baseConflict, departmentId, semesterId, section }) : null,
    ]);

    if (teacherConflict) throw new ApiError(409, `Teacher schedule conflict on ${dayOfWeek}`, "SCHEDULE_CONFLICT");
    if (roomConflict)    throw new ApiError(409, `Room '${room}' occupied at this time`, "SCHEDULE_CONFLICT");
    if (sectionConflict) throw new ApiError(409, `Section '${section}' schedule conflict`, "SCHEDULE_CONFLICT");

    const { routineStatus, createdByAdminId, ...allowedUpdates } = data;

    const updated = await ClassRoutine.findByIdAndUpdate(
      id,
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    ).lean();

    return updated;
  },

  async updateStatus(id, status) {
    const routine = await ClassRoutine.findByIdAndUpdate(
      id,
      { $set: { routineStatus: status } },
      { new: true }
    ).lean();

    if (!routine) throw new ApiError(404, "Class routine not found", "NOT_FOUND");
    return routine;
  },
};

export default classRoutineService;
