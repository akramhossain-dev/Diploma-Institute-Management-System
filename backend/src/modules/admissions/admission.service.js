import Admission from "./admission.model.js";
import Department from "../departments/department.model.js";
import Semester from "../semesters/semester.model.js";
import AcademicSession from "../academicSessions/academicSession.model.js";
// Models imported directly — does NOT import studentService (entity isolation rule)
import Student from "../students/student.model.js";
import StudentAuth from "../auth/student/studentAuth.model.js";
import { hashPassword } from "../../utils/hashHelper.js";
import { generateStudentId } from "../../utils/generateEntityId.js";
import ApiError from "../../utils/ApiError.js";
import { getPaginationParams, buildPaginationMeta } from "../../utils/pagination.js";

// ── Allowed status transitions ──────────────────────────────────────────────
const ALLOWED_TRANSITIONS = {
  pending:   ["reviewed", "cancelled"],
  reviewed:  ["approved", "rejected", "cancelled"],
  approved:  ["cancelled"],              // can cancel before conversion
  rejected:  [],                         // terminal
  cancelled: [],                         // terminal
};

const admissionService = {

  // ────────────────────────────────────────────────────────────────────────
  // CREATE APPLICATION (can be public-facing for online admissions)
  // ────────────────────────────────────────────────────────────────────────
  async createAdmission(data) {
    const { desiredDepartmentId, academicSessionId, targetSemesterId } = data;

    // Validate referenced records
    const [dept, session] = await Promise.all([
      Department.findById(desiredDepartmentId).lean(),
      AcademicSession.findById(academicSessionId).lean(),
    ]);

    if (!dept)    throw new ApiError(404, "Department not found", "NOT_FOUND");
    if (!session) throw new ApiError(404, "Academic session not found", "NOT_FOUND");

    if (targetSemesterId) {
      const sem = await Semester.findById(targetSemesterId).lean();
      if (!sem) throw new ApiError(404, "Target semester not found", "NOT_FOUND");
    }

    // Duplicate check: same email + session + department
    const duplicate = await Admission.findOne({
      email:              data.email.toLowerCase(),
      academicSessionId,
      desiredDepartmentId,
    });
    if (duplicate) {
      throw new ApiError(
        409,
        "An application for this department and session already exists for this email",
        "DUPLICATE_ENTRY"
      );
    }

    const admission = await Admission.create({
      ...data,
      email:           data.email.toLowerCase(),
      admissionStatus: "pending",
    });

    return admission;
  },

  // ────────────────────────────────────────────────────────────────────────
  // LIST with pagination + filters
  // ────────────────────────────────────────────────────────────────────────
  async getAllAdmissions(query) {
    const { page, limit, skip } = getPaginationParams(query);
    const { admissionStatus, desiredDepartmentId, academicSessionId, admissionSource, search } = query;

    const filter = {};
    if (admissionStatus)    filter.admissionStatus    = admissionStatus;
    if (desiredDepartmentId) filter.desiredDepartmentId = desiredDepartmentId;
    if (academicSessionId)   filter.academicSessionId   = academicSessionId;
    if (admissionSource)     filter.admissionSource     = admissionSource;
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email:    { $regex: search, $options: "i" } },
        { phone:    { $regex: search, $options: "i" } },
      ];
    }

    const [admissions, total] = await Promise.all([
      Admission.find(filter)
        .populate("desiredDepartmentId",  "name code")
        .populate("targetSemesterId",     "name number")
        .populate("academicSessionId",    "name")
        .populate("reviewedByAdminId",    "fullName adminId")
        .sort({ createdAt: -1 })
        .skip(skip).limit(limit).lean(),
      Admission.countDocuments(filter),
    ]);

    return { admissions, pagination: buildPaginationMeta(total, page, limit) };
  },

  async getAdmissionById(id) {
    const admission = await Admission.findById(id)
      .populate("desiredDepartmentId",  "name code")
      .populate("targetSemesterId",     "name number")
      .populate("academicSessionId",    "name startDate endDate")
      .populate("reviewedByAdminId",    "fullName adminId")
      .populate("convertedStudentId",   "studentId fullName email")
      .populate("convertedByAdminId",   "fullName adminId")
      .lean();

    if (!admission) throw new ApiError(404, "Admission record not found", "NOT_FOUND");
    return admission;
  },

  // ────────────────────────────────────────────────────────────────────────
  // UPDATE (only allowed on pending/reviewed — not terminal states)
  // ────────────────────────────────────────────────────────────────────────
  async updateAdmission(id, data) {
    const admission = await Admission.findById(id);
    if (!admission) throw new ApiError(404, "Admission record not found", "NOT_FOUND");

    if (["approved", "rejected", "cancelled"].includes(admission.admissionStatus)) {
      throw new ApiError(
        400,
        `Cannot update an admission with status '${admission.admissionStatus}'`,
        "BUSINESS_RULE_VIOLATION"
      );
    }

    // Strip status fields — transitions handled by dedicated methods
    const {
      admissionStatus, reviewedByAdminId, reviewedAt, rejectionReason,
      convertedStudentId, convertedAt, convertedByAdminId,
      ...allowedUpdates
    } = data;

    const updated = await Admission.findByIdAndUpdate(
      id,
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    ).lean();

    return updated;
  },

  // ────────────────────────────────────────────────────────────────────────
  // STATUS TRANSITIONS
  // ────────────────────────────────────────────────────────────────────────
  async _transition(id, targetStatus, adminId, extra = {}) {
    const admission = await Admission.findById(id);
    if (!admission) throw new ApiError(404, "Admission record not found", "NOT_FOUND");

    const allowed = ALLOWED_TRANSITIONS[admission.admissionStatus] || [];
    if (!allowed.includes(targetStatus)) {
      throw new ApiError(
        400,
        `Cannot transition from '${admission.admissionStatus}' to '${targetStatus}'`,
        "INVALID_STATUS_TRANSITION"
      );
    }

    Object.assign(admission, {
      admissionStatus:   targetStatus,
      reviewedByAdminId: adminId,
      reviewedAt:        new Date(),
      ...extra,
    });

    await admission.save();
    return admission;
  },

  async markReviewed(id, adminId) {
    return this._transition(id, "reviewed", adminId);
  },

  async approveAdmission(id, adminId) {
    return this._transition(id, "approved", adminId);
  },

  async rejectAdmission(id, adminId, rejectionReason) {
    return this._transition(id, "rejected", adminId, { rejectionReason });
  },

  async cancelAdmission(id, adminId) {
    return this._transition(id, "cancelled", adminId);
  },

  // ────────────────────────────────────────────────────────────────────────
  // CONVERT TO STUDENT
  // Imports Student + StudentAuth models directly — does NOT call studentService
  // to maintain service isolation while reusing model logic.
  // ────────────────────────────────────────────────────────────────────────
  async convertToStudent(id, adminId, password) {
    const admission = await Admission.findById(id)
      .populate("desiredDepartmentId", "name code")
      .populate("targetSemesterId",    "name number")
      .populate("academicSessionId",   "name");

    if (!admission) throw new ApiError(404, "Admission record not found", "NOT_FOUND");

    if (admission.admissionStatus !== "approved") {
      throw new ApiError(400, "Only approved admissions can be converted", "BUSINESS_RULE_VIOLATION");
    }

    if (admission.convertedStudentId) {
      throw new ApiError(400, "This admission has already been converted to a student", "ALREADY_CONVERTED");
    }

    // Check email not already in student_auth
    const emailTaken = await StudentAuth.findOne({ email: admission.email });
    if (emailTaken) {
      throw new ApiError(409, `Student with email '${admission.email}' already exists`, "DUPLICATE_ENTRY");
    }

    // Determine semesterId — use target or default to first semester
    let semesterId = admission.targetSemesterId?._id ?? null;
    if (!semesterId) {
      const firstSem = await Semester.findOne({ number: 1, status: "active" }).lean();
      if (!firstSem) throw new ApiError(400, "No active first semester found to assign", "NOT_FOUND");
      semesterId = firstSem._id;
    }

    // Auto-generate student ID
    const deptCode  = admission.desiredDepartmentId?.code || "STD";
    const studentId = await generateStudentId(Student, deptCode);

    // Create student profile
    const student = await Student.create({
      studentId,
      fullName:          admission.fullName,
      email:             admission.email,
      phone:             admission.phone,
      gender:            admission.gender,
      dateOfBirth:       admission.dateOfBirth,
      bloodGroup:        admission.bloodGroup,
      departmentId:      admission.desiredDepartmentId._id,
      semesterId,
      academicSessionId: admission.academicSessionId._id,
      admissionDate:     admission.createdAt,
      guardianName:      admission.guardianName,
      guardianPhone:     admission.guardianPhone,
      guardianRelation:  admission.guardianRelation,
      presentAddress:    admission.presentAddress,
      permanentAddress:  admission.permanentAddress,
      createdByAdminId:  adminId,
      status:            "active",
    });

    // Create student_auth
    const passwordHash = await hashPassword(password);
    const studentAuth  = await StudentAuth.create({
      email:              admission.email,
      passwordHash,
      studentId:          student._id,
      isActive:           true,
      mustChangePassword: true,
    });

    // Link auth → student
    await Student.findByIdAndUpdate(student._id, { linkedAuthId: studentAuth._id });

    // Mark admission as converted
    admission.convertedStudentId  = student._id;
    admission.convertedAt         = new Date();
    admission.convertedByAdminId  = adminId;
    await admission.save();

    return { admission, student };
  },
};

export default admissionService;
