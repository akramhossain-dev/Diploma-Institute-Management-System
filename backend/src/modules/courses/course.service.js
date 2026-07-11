import Course from "./course.model.js";
import Department from "../departments/department.model.js";
import Semester from "../semesters/semester.model.js";
import ApiError from "../../utils/ApiError.js";
import { getPaginationParams, buildPaginationMeta } from "../../utils/pagination.js";

const courseService = {

  async createCourse(data, adminId) {
    const { departmentId, semesterId, code, name, credits, type, description, status } = data;

    // Validate department exists
    const dept = await Department.findById(departmentId).lean();
    if (!dept) throw new ApiError(404, "Department not found", "NOT_FOUND");
    if (dept.status === "inactive") {
      throw new ApiError(400, "Cannot create a course for an inactive department", "BUSINESS_RULE_VIOLATION");
    }

    let activeSemesterId = semesterId;
    if (!activeSemesterId) {
      const firstSem = await Semester.findOne({ status: "active" }).sort({ number: 1 }).lean();
      if (firstSem) {
        activeSemesterId = firstSem._id;
      } else {
        const anySem = await Semester.findOne().lean();
        if (anySem) {
          activeSemesterId = anySem._id;
        } else {
          throw new ApiError(400, "At least one semester must exist in the database before registering a course.", "BUSINESS_RULE_VIOLATION");
        }
      }
    }

    const semester = await Semester.findById(activeSemesterId).lean();
    if (!semester) throw new ApiError(404, "Semester not found", "NOT_FOUND");
    if (semester.status === "inactive") {
      throw new ApiError(400, "Cannot create a course for an inactive semester", "BUSINESS_RULE_VIOLATION");
    }

    const codeExists = await Course.findOne({ code: code.trim().toUpperCase() });
    if (codeExists) throw new ApiError(409, `Course code '${code.trim().toUpperCase()}' already exists`, "DUPLICATE_ENTRY");

    const course = await Course.create({
      title: name,
      code: code.trim().toUpperCase(),
      credit: parseFloat(credits),
      type: type || "theory",
      departmentId,
      semesterId: activeSemesterId,
      description: description || "",
      status: status || "active",
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
    const { departmentId, semesterId, code, name, credits } = data;

    // Validate referenced IDs if changing
    if (departmentId) {
      const dept = await Department.findById(departmentId).lean();
      if (!dept) throw new ApiError(404, "Department not found", "NOT_FOUND");
    }
    if (semesterId) {
      const sem = await Semester.findById(semesterId).lean();
      if (!sem) throw new ApiError(404, "Semester not found", "NOT_FOUND");
    }

    if (code) {
      const conflict = await Course.findOne({ code: code.trim().toUpperCase(), _id: { $ne: id } });
      if (conflict) throw new ApiError(409, `Course code '${code.trim().toUpperCase()}' already exists`, "DUPLICATE_ENTRY");
    }

    const updatePayload = { ...data };
    if (name !== undefined) {
      updatePayload.title = name;
      delete updatePayload.name;
    }
    if (credits !== undefined) {
      updatePayload.credit = parseFloat(credits);
      delete updatePayload.credits;
    }
    if (code !== undefined) {
      updatePayload.code = code.trim().toUpperCase();
    }

    const course = await Course.findByIdAndUpdate(
      id,
      { $set: updatePayload },
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
