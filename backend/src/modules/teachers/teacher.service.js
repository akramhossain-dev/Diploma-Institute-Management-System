import Teacher from "./teacher.model.js";
import TeacherAuth from "../auth/teacher/teacherAuth.model.js";
import Department from "../departments/department.model.js";
import { hashPassword } from "../../utils/hashHelper.js";
import { generateTeacherId } from "../../utils/generateEntityId.js";
import ApiError from "../../utils/ApiError.js";
import { getPaginationParams, buildPaginationMeta } from "../../utils/pagination.js";

const teacherService = {

  async createTeacher(data, adminId) {
    const { email, password, departmentId, ...profileData } = data;

    // 1. Validate department
    const dept = await Department.findById(departmentId).lean();
    if (!dept) throw new ApiError(404, "Department not found", "NOT_FOUND");

    // 2. Email uniqueness in teacher_auth
    const emailTaken = await TeacherAuth.findOne({ email: email.toLowerCase() });
    if (emailTaken) throw new ApiError(409, `Teacher with email '${email}' already exists`, "DUPLICATE_ENTRY");

    const employeeId = await generateTeacherId(Teacher);

    const teacher = await Teacher.create({
      ...profileData,
      email: email.toLowerCase(),
      employeeId,
      departmentId,
      createdByAdminId: adminId,
    });

    // 5. Create teacher_auth
    const passwordHash = await hashPassword(password);
    const teacherAuth = await TeacherAuth.create({
      email:              email.toLowerCase(),
      passwordHash,
      teacherId:          teacher._id,
      isActive:           true,
      mustChangePassword: true,
    });

    // 6. Link auth to profile
    await Teacher.findByIdAndUpdate(teacher._id, { linkedAuthId: teacherAuth._id });
    teacher.linkedAuthId = teacherAuth._id;

    return teacher;
  },

  async getAllTeachers(query) {
    const { page, limit, skip } = getPaginationParams(query);
    const { departmentId, status, search } = query;

    const filter = {};
    if (departmentId) filter.departmentId = departmentId;
    if (status)       filter.status       = status;
    if (search) {
      filter.$or = [
        { fullName:    { $regex: search, $options: "i" } },
        { employeeId:  { $regex: search, $options: "i" } },
        { email:       { $regex: search, $options: "i" } },
        { designation: { $regex: search, $options: "i" } },
      ];
    }

    const [teachers, total] = await Promise.all([
      Teacher.find(filter)
        .select("-assignedCourses")
        .populate("departmentId", "name code")
        .sort({ createdAt: -1 })
        .skip(skip).limit(limit).lean(),
      Teacher.countDocuments(filter),
    ]);

    return { teachers, pagination: buildPaginationMeta(total, page, limit) };
  },

  async getTeacherById(id) {
    const teacher = await Teacher.findById(id)
      .populate("departmentId",    "name code")
      .populate("assignedCourses", "title code type")
      .lean();

    if (!teacher) throw new ApiError(404, "Teacher not found", "NOT_FOUND");
    return teacher;
  },

  async getMyProfile(teacherId) {
    return this.getTeacherById(teacherId);
  },

  async updateTeacher(id, data) {
    const {
      email, password, employeeId,
      departmentId, linkedAuthId, createdByAdminId, status,
      ...allowedUpdates
    } = data;

    const teacher = await Teacher.findByIdAndUpdate(
      id,
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    )
      .populate("departmentId", "name code")
      .lean();

    if (!teacher) throw new ApiError(404, "Teacher not found", "NOT_FOUND");
    return teacher;
  },

  async updateStatus(id, status) {
    const teacher = await Teacher.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    ).lean();

    if (!teacher) throw new ApiError(404, "Teacher not found", "NOT_FOUND");

    await TeacherAuth.findOneAndUpdate(
      { teacherId: id },
      { isActive: status === "active" }
    );

    return teacher;
  },

  async assignCourses(id, courseIds) {
    const teacher = await Teacher.findByIdAndUpdate(
      id,
      { $addToSet: { assignedCourses: { $each: courseIds } } },
      { new: true }
    )
      .populate("assignedCourses", "title code type")
      .lean();

    if (!teacher) throw new ApiError(404, "Teacher not found", "NOT_FOUND");
    return teacher;
  },

  async removeCourse(id, courseId) {
    const teacher = await Teacher.findByIdAndUpdate(
      id,
      { $pull: { assignedCourses: courseId } },
      { new: true }
    )
      .populate("assignedCourses", "title code type")
      .lean();

    if (!teacher) throw new ApiError(404, "Teacher not found", "NOT_FOUND");
    return teacher;
  },
};

export default teacherService;
