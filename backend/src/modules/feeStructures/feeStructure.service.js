import FeeStructure from "./feeStructure.model.js";
import Department from "../departments/department.model.js";
import Semester from "../semesters/semester.model.js";
import AcademicSession from "../academicSessions/academicSession.model.js";
import ApiError from "../../utils/ApiError.js";
import { getPaginationParams, buildPaginationMeta } from "../../utils/pagination.js";

const feeStructureService = {

  async createFeeStructure(data, adminId) {
    const { departmentId, semesterId, academicSessionId } = data;

    const checks = [];
    if (departmentId)      checks.push(Department.findById(departmentId).lean().then((d) => { if (!d) throw new ApiError(404, "Department not found", "NOT_FOUND"); }));
    if (semesterId)        checks.push(Semester.findById(semesterId).lean().then((s) => { if (!s) throw new ApiError(404, "Semester not found", "NOT_FOUND"); }));
    if (academicSessionId) checks.push(AcademicSession.findById(academicSessionId).lean().then((s) => { if (!s) throw new ApiError(404, "Academic session not found", "NOT_FOUND"); }));
    await Promise.all(checks);

    const feeStructure = await FeeStructure.create({ ...data, createdByAdminId: adminId });
    return feeStructure;
  },

  async getAllFeeStructures(query) {
    const { page, limit, skip } = getPaginationParams(query);
    const { feeType, departmentId, semesterId, academicSessionId, status, search } = query;

    const filter = {};
    if (feeType)           filter.feeType           = feeType;
    if (departmentId)      filter.departmentId      = departmentId;
    if (semesterId)        filter.semesterId        = semesterId;
    if (academicSessionId) filter.academicSessionId = academicSessionId;
    if (status)            filter.status            = status;
    else                   filter.status            = { $ne: "archived" };  // default: exclude archived
    if (search)            filter.title             = { $regex: search, $options: "i" };

    const [feeStructures, total] = await Promise.all([
      FeeStructure.find(filter)
        .populate("departmentId",      "name code")
        .populate("semesterId",        "name number")
        .populate("academicSessionId", "name")
        .sort({ createdAt: -1 })
        .skip(skip).limit(limit).lean(),
      FeeStructure.countDocuments(filter),
    ]);

    return { feeStructures, pagination: buildPaginationMeta(total, page, limit) };
  },

  async getFeeStructureById(id) {
    const fs = await FeeStructure.findById(id)
      .populate("departmentId",      "name code")
      .populate("semesterId",        "name number")
      .populate("academicSessionId", "name")
      .populate("createdByAdminId",  "fullName")
      .lean();
    if (!fs) throw new ApiError(404, "Fee structure not found", "NOT_FOUND");
    return fs;
  },

  async updateFeeStructure(id, data) {
    const fs = await FeeStructure.findById(id);
    if (!fs) throw new ApiError(404, "Fee structure not found", "NOT_FOUND");
    if (fs.status === "archived") throw new ApiError(400, "Archived fee structures cannot be edited", "BUSINESS_RULE_VIOLATION");

    const { status, createdByAdminId, ...allowedUpdates } = data;
    return FeeStructure.findByIdAndUpdate(id, { $set: allowedUpdates }, { new: true, runValidators: true }).lean();
  },

  async updateStatus(id, status) {
    const fs = await FeeStructure.findByIdAndUpdate(id, { $set: { status } }, { new: true }).lean();
    if (!fs) throw new ApiError(404, "Fee structure not found", "NOT_FOUND");
    return fs;
  },
};

export default feeStructureService;
