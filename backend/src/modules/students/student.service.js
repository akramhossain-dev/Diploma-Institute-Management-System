import Student from "./student.model.js";
import StudentAuth from "../auth/student/studentAuth.model.js";
import Department from "../departments/department.model.js";
import Semester from "../semesters/semester.model.js";
import AcademicSession from "../academicSessions/academicSession.model.js";
import { hashPassword } from "../../utils/hashHelper.js";
import { generateStudentId } from "../../utils/generateEntityId.js";
import ApiError from "../../utils/ApiError.js";
import { getPaginationParams, buildPaginationMeta } from "../../utils/pagination.js";

const studentService = {

  // ──────────────────────────────────────────────────────────────────────────
  // CREATE — profile + auth created atomically
  // ──────────────────────────────────────────────────────────────────────────
  async createStudent(data, adminId) {
    const {
      email, password,
      departmentId, semesterId, academicSessionId,
      rollNumber, registrationNumber,
      ...profileData
    } = data;

    // 1. Validate referenced entities exist
    const [dept, semester, session] = await Promise.all([
      Department.findById(departmentId).lean(),
      Semester.findById(semesterId).lean(),
      AcademicSession.findById(academicSessionId).lean(),
    ]);

    if (!dept)    throw new ApiError(404, "Department not found",        "NOT_FOUND");
    if (!semester) throw new ApiError(404, "Semester not found",         "NOT_FOUND");
    if (!session)  throw new ApiError(404, "Academic session not found", "NOT_FOUND");

    // 2. Email uniqueness — check student_auth collection
    const emailTaken = await StudentAuth.findOne({ email: email.toLowerCase() });
    if (emailTaken) throw new ApiError(409, `Student with email '${email}' already exists`, "DUPLICATE_ENTRY");

    // 3. Roll/registration uniqueness if provided
    if (rollNumber) {
      const rollTaken = await Student.findOne({ rollNumber });
      if (rollTaken) throw new ApiError(409, `Roll number '${rollNumber}' already exists`, "DUPLICATE_ENTRY");
    }
    if (registrationNumber) {
      const regTaken = await Student.findOne({ registrationNumber });
      if (regTaken) throw new ApiError(409, `Registration number '${registrationNumber}' already exists`, "DUPLICATE_ENTRY");
    }

    // 4. Auto-generate studentId using department code
    const studentId = await generateStudentId(Student, dept.code);

    // 5. Create student profile
    const student = await Student.create({
      ...profileData,
      email: email.toLowerCase(),
      studentId,
      rollNumber:         rollNumber || null,
      registrationNumber: registrationNumber || null,
      departmentId,
      semesterId,
      academicSessionId,
      createdByAdminId: adminId,
    });

    // 6. Create student_auth record
    const passwordHash = await hashPassword(password);
    const studentAuth = await StudentAuth.create({
      email:              email.toLowerCase(),
      passwordHash,
      studentId:          student._id,    // ref to students collection
      isActive:           true,
      mustChangePassword: true,
    });

    // 7. Link auth record back to student profile
    await Student.findByIdAndUpdate(student._id, { linkedAuthId: studentAuth._id });
    student.linkedAuthId = studentAuth._id;

    return student;
  },

  // ──────────────────────────────────────────────────────────────────────────
  // LIST with pagination + filters
  // ──────────────────────────────────────────────────────────────────────────
  async getAllStudents(query) {
    const { page, limit, skip } = getPaginationParams(query);
    const { departmentId, semesterId, academicSessionId, status, search } = query;

    const filter = {};
    if (departmentId)      filter.departmentId      = departmentId;
    if (semesterId)        filter.semesterId        = semesterId;
    if (academicSessionId) filter.academicSessionId = academicSessionId;
    if (status)            filter.status            = status;
    if (search) {
      filter.$or = [
        { fullName:           { $regex: search, $options: "i" } },
        { studentId:          { $regex: search, $options: "i" } },
        { email:              { $regex: search, $options: "i" } },
        { rollNumber:         { $regex: search, $options: "i" } },
        { registrationNumber: { $regex: search, $options: "i" } },
      ];
    }

    const [students, total] = await Promise.all([
      Student.find(filter)
        .select("-enrolledCourseIds")
        .populate("departmentId",      "name code")
        .populate("semesterId",         "name number")
        .populate("academicSessionId",  "name")
        .sort({ createdAt: -1 })
        .skip(skip).limit(limit).lean(),
      Student.countDocuments(filter),
    ]);

    return { students, pagination: buildPaginationMeta(total, page, limit) };
  },

  // ──────────────────────────────────────────────────────────────────────────
  // GET BY ID (full profile)
  // ──────────────────────────────────────────────────────────────────────────
  async getStudentById(id) {
    const student = await Student.findById(id)
      .populate("departmentId",     "name code")
      .populate("semesterId",        "name number")
      .populate("academicSessionId", "name")
      .populate("enrolledCourseIds", "title code")
      .lean();

    if (!student) throw new ApiError(404, "Student not found", "NOT_FOUND");
    return student;
  },

  // ──────────────────────────────────────────────────────────────────────────
  // GET OWN PROFILE (called by authenticated student)
  // ──────────────────────────────────────────────────────────────────────────
  async getMyProfile(studentId) {
    return this.getStudentById(studentId);
  },

  // ──────────────────────────────────────────────────────────────────────────
  // UPDATE — only profile fields; academic fields (dept/sem/session) restricted
  // ──────────────────────────────────────────────────────────────────────────
  async updateStudent(id, data) {
    // Strip fields that shouldn't change via update
    const {
      email, password, studentId,
      departmentId, semesterId, academicSessionId,
      linkedAuthId, createdByAdminId, status,
      ...allowedUpdates
    } = data;

    const student = await Student.findByIdAndUpdate(
      id,
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    )
      .populate("departmentId",     "name code")
      .populate("semesterId",        "name number")
      .populate("academicSessionId", "name")
      .lean();

    if (!student) throw new ApiError(404, "Student not found", "NOT_FOUND");
    return student;
  },

  // ──────────────────────────────────────────────────────────────────────────
  // UPDATE STATUS
  // ──────────────────────────────────────────────────────────────────────────
  async updateStatus(id, status) {
    const student = await Student.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    ).lean();

    if (!student) throw new ApiError(404, "Student not found", "NOT_FOUND");

    // Sync auth status if deactivating
    await StudentAuth.findOneAndUpdate(
      { studentId: id },
      { isActive: status === "active" }
    );

    return student;
  },
};

export default studentService;
