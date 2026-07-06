import TeacherAssignment from "./teacherAssignment.model.js";
import Teacher from "../teachers/teacher.model.js";
import Course from "../courses/course.model.js";
import Department from "../departments/department.model.js";
import Semester from "../semesters/semester.model.js";
import AcademicSession from "../academicSessions/academicSession.model.js";
import ApiError from "../../utils/ApiError.js";
import { getPaginationParams, buildPaginationMeta } from "../../utils/pagination.js";

const teacherAssignmentService = {

  async createAssignment(data, adminId) {
    const { teacherId, courseId, departmentId, semesterId, academicSessionId, section = null } = data;

    // 1. Validate all referenced entities
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

    // 2. Consistency: course must belong to the given department + semester
    if (String(course.departmentId) !== String(departmentId)) {
      throw new ApiError(
        400,
        `Course '${course.title}' belongs to a different department`,
        "CONTEXT_MISMATCH"
      );
    }
    if (String(course.semesterId) !== String(semesterId)) {
      throw new ApiError(
        400,
        `Course '${course.title}' belongs to a different semester`,
        "CONTEXT_MISMATCH"
      );
    }

    // 3. Duplicate active assignment check
    const duplicate = await TeacherAssignment.findOne({
      teacherId,
      courseId,
      academicSessionId,
      section: section || null,
      assignmentStatus: "active",
    });

    if (duplicate) {
      throw new ApiError(
        409,
        "An active assignment already exists for this teacher + course + session + section",
        "DUPLICATE_ENTRY"
      );
    }

    const assignment = await TeacherAssignment.create({
      ...data,
      section: section || null,
      assignedByAdminId: adminId,
    });

    return assignment;
  },

  async getAllAssignments(query) {
    const { page, limit, skip } = getPaginationParams(query);
    const { teacherId, courseId, departmentId, semesterId, academicSessionId, assignmentStatus, search } = query;

    const filter = {};
    if (teacherId)         filter.teacherId         = teacherId;
    if (courseId)          filter.courseId          = courseId;
    if (departmentId)      filter.departmentId      = departmentId;
    if (semesterId)        filter.semesterId        = semesterId;
    if (academicSessionId) filter.academicSessionId = academicSessionId;
    if (assignmentStatus)  filter.assignmentStatus  = assignmentStatus;

    const [assignments, total] = await Promise.all([
      TeacherAssignment.find(filter)
        .populate("teacherId",         "fullName employeeId")
        .populate("courseId",          "title code type")
        .populate("departmentId",      "name code")
        .populate("semesterId",        "name number")
        .populate("academicSessionId", "name")
        .populate("assignedByAdminId", "fullName")
        .sort({ createdAt: -1 })
        .skip(skip).limit(limit).lean(),
      TeacherAssignment.countDocuments(filter),
    ]);

    return { assignments, pagination: buildPaginationMeta(total, page, limit) };
  },

  async getAssignmentById(id) {
    const assignment = await TeacherAssignment.findById(id)
      .populate("teacherId",         "fullName employeeId email")
      .populate("courseId",          "title code type creditHours")
      .populate("departmentId",      "name code")
      .populate("semesterId",        "name number")
      .populate("academicSessionId", "name startDate endDate")
      .lean();

    if (!assignment) throw new ApiError(404, "Assignment not found", "NOT_FOUND");
    return assignment;
  },

  async updateAssignment(id, data) {
    // Only allow updating non-core fields
    const { teacherId, courseId, departmentId, semesterId, academicSessionId, assignedByAdminId, ...allowedUpdates } = data;

    const assignment = await TeacherAssignment.findByIdAndUpdate(
      id,
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    ).lean();

    if (!assignment) throw new ApiError(404, "Assignment not found", "NOT_FOUND");
    return assignment;
  },

  async updateStatus(id, status) {
    const assignment = await TeacherAssignment.findByIdAndUpdate(
      id,
      { $set: { assignmentStatus: status } },
      { new: true }
    ).lean();

    if (!assignment) throw new ApiError(404, "Assignment not found", "NOT_FOUND");
    return assignment;
  },
};

export default teacherAssignmentService;
