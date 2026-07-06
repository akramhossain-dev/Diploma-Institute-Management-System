import Course from "./course.model.js";
import Department from "../departments/department.model.js";
import Semester from "../semesters/semester.model.js";
import ApiError from "../../utils/ApiError.js";
import { getPaginationParams, buildPaginationMeta } from "../../utils/pagination.js";

const courseService = {

  async createCourse(data, adminId) {
    const { departmentId, semesterId, code } = data;

    // Validate department and semester exist and are active
    const [dept, semester, codeExists] = await Promise.all([
      Department.findById(departmentId).lean(),
      Semester.findById(semesterId).lean(),
      Course.findOne({ code: code.toUpperCase() }),
    ]);

    if (!dept)      throw new ApiError(404, "Department not found", "NOT_FOUND");
    if (!semester)  throw new ApiError(404, "Semester not found", "NOT_FOUND");
    if (codeExists) throw new ApiError(409, `Course code '${code.toUpperCase()}' already exists`, "DUPLICATE_ENTRY");

    if (dept.status === "inactive") {
      throw new ApiError(400, "Cannot create a course for an inactive department", "BUSINESS_RULE_VIOLATION");
    }
    if (semester.status === "inactive") {
      throw new ApiError(400, "Cannot create a course for an inactive semester", "BUSINESS_RULE_VIOLATION");
    }

    const course = await Course.create({
      ...data,
      code: code.toUpperCase(),
      createdByAdminId: adminId,
    });

    return course;
  },

  async getAllCourses(query) {
    const { page, limit, skip } = getPaginationParams(query);
    const { departmentId, semesterId, type, status, search } = query;

    const filter = {};
    if (departmentId) filter.departmentId = departmentId;
    if (semesterId)   filter.semesterId   = semesterId;
    if (type)         filter.type         = type;
    if (status)       filter.status       = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { code:  { $regex: search, $options: "i" } },
      ];
    }

    const [courses, total] = await Promise.all([
      Course.find(filter)
        .populate("departmentId", "name code")
        .populate("semesterId",   "name number")
        .populate("createdByAdminId", "fullName")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Course.countDocuments(filter),
    ]);

    return { courses, pagination: buildPaginationMeta(total, page, limit) };
  },

  async getCourseById(id) {
    const course = await Course.findById(id)
      .populate("departmentId", "name code")
      .populate("semesterId",   "name number")
      .lean();
    if (!course) throw new ApiError(404, "Course not found", "NOT_FOUND");
    return course;
  },

  async updateCourse(id, data) {
    const { departmentId, semesterId, code } = data;

    // Validate referenced IDs if changing
    if (departmentId) {
      const dept = await Department.findById(departmentId).lean();
      if (!dept) throw new ApiError(404, "Department not found", "NOT_FOUND");
    }
    if (semesterId) {
      const sem = await Semester.findById(semesterId).lean();
      if (!sem) throw new ApiError(404, "Semester not found", "NOT_FOUND");
    }

    // Code uniqueness if changing
    if (code) {
      const conflict = await Course.findOne({ code: code.toUpperCase(), _id: { $ne: id } });
      if (conflict) throw new ApiError(409, `Course code '${code.toUpperCase()}' already exists`, "DUPLICATE_ENTRY");
      data.code = code.toUpperCase();
    }

    const course = await Course.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    )
      .populate("departmentId", "name code")
      .populate("semesterId",   "name number")
      .lean();

    if (!course) throw new ApiError(404, "Course not found", "NOT_FOUND");
    return course;
  },

  async toggleStatus(id) {
    const course = await Course.findById(id);
    if (!course) throw new ApiError(404, "Course not found", "NOT_FOUND");

    course.status = course.status === "active" ? "inactive" : "active";
    await course.save();
    return course;
  },
};

export default courseService;
