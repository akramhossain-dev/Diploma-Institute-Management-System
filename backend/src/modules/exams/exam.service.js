import Exam from "./exam.model.js";
import Department from "../departments/department.model.js";
import Semester from "../semesters/semester.model.js";
import AcademicSession from "../academicSessions/academicSession.model.js";
import ApiError from "../../utils/ApiError.js";
import { getPaginationParams, buildPaginationMeta } from "../../utils/pagination.js";

// ── Status transition map ───────────────────────────────────────────────────
const EXAM_TRANSITIONS = {
  draft:     ["scheduled", "cancelled"],
  scheduled: ["ongoing", "draft", "cancelled"],
  ongoing:   ["completed", "cancelled"],
  completed: ["published"],
  published: [],    // terminal — use revision flow for corrections
  cancelled: [],    // terminal
};

const examService = {

  async createExam(data, adminId) {
    const { departmentId, semesterId, academicSessionId } = data;

    const [dept, semester, session] = await Promise.all([
      Department.findById(departmentId).lean(),
      Semester.findById(semesterId).lean(),
      AcademicSession.findById(academicSessionId).lean(),
    ]);

    if (!dept)     throw new ApiError(404, "Department not found",       "NOT_FOUND");
    if (!semester) throw new ApiError(404, "Semester not found",         "NOT_FOUND");
    if (!session)  throw new ApiError(404, "Academic session not found", "NOT_FOUND");

    const exam = await Exam.create({ ...data, createdByAdminId: adminId, examStatus: "draft" });
    return exam;
  },

  async getAllExams(query) {
    const { page, limit, skip } = getPaginationParams(query);
    const { departmentId, semesterId, academicSessionId, examType, examStatus, search } = query;

    const filter = {};
    if (departmentId)      filter.departmentId      = departmentId;
    if (semesterId)        filter.semesterId        = semesterId;
    if (academicSessionId) filter.academicSessionId = academicSessionId;
    if (examType)          filter.examType          = examType;
    if (examStatus)        filter.examStatus        = examStatus;
    if (search)            filter.name              = { $regex: search, $options: "i" };

    const [exams, total] = await Promise.all([
      Exam.find(filter)
        .populate("departmentId",      "name code")
        .populate("semesterId",        "name number")
        .populate("academicSessionId", "name")
        .populate("createdByAdminId",  "fullName")
        .sort({ createdAt: -1 })
        .skip(skip).limit(limit).lean(),
      Exam.countDocuments(filter),
    ]);

    return { exams, pagination: buildPaginationMeta(total, page, limit) };
  },

  async getExamById(id) {
    const exam = await Exam.findById(id)
      .populate("departmentId",      "name code")
      .populate("semesterId",        "name number")
      .populate("academicSessionId", "name startDate endDate")
      .populate("createdByAdminId",  "fullName adminId")
      .lean();

    if (!exam) throw new ApiError(404, "Exam not found", "NOT_FOUND");
    return exam;
  },

  async updateExam(id, data) {
    const exam = await Exam.findById(id);
    if (!exam) throw new ApiError(404, "Exam not found", "NOT_FOUND");

    if (["published", "cancelled"].includes(exam.examStatus)) {
      throw new ApiError(400, `Cannot edit a ${exam.examStatus} exam`, "BUSINESS_RULE_VIOLATION");
    }

    // Strip status + auth fields
    const { examStatus, createdByAdminId, ...allowedUpdates } = data;

    const updated = await Exam.findByIdAndUpdate(
      id,
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    ).lean();

    return updated;
  },

  async updateStatus(id, targetStatus, adminId) {
    const exam = await Exam.findById(id);
    if (!exam) throw new ApiError(404, "Exam not found", "NOT_FOUND");

    const allowed = EXAM_TRANSITIONS[exam.examStatus] ?? [];
    if (!allowed.includes(targetStatus)) {
      throw new ApiError(
        400,
        `Cannot transition exam from '${exam.examStatus}' to '${targetStatus}'`,
        "INVALID_STATUS_TRANSITION"
      );
    }

    exam.examStatus = targetStatus;
    if (targetStatus === "published") exam.publishedAt = new Date();
    await exam.save();
    return exam;
  },
};

export default examService;
