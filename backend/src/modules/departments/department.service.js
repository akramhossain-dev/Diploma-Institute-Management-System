import Department from "./department.model.js";
import ApiError from "../../utils/ApiError.js";
import { getPaginationParams, buildPaginationMeta } from "../../utils/pagination.js";

const departmentService = {

  async createDepartment(data, adminId) {
    // Check uniqueness for name and code
    const [nameTaken, codeTaken] = await Promise.all([
      Department.findOne({ name: { $regex: `^${data.name}$`, $options: "i" } }),
      Department.findOne({ code: data.code.toUpperCase() }),
    ]);

    if (nameTaken) throw new ApiError(409, `Department '${data.name}' already exists`, "DUPLICATE_ENTRY");
    if (codeTaken) throw new ApiError(409, `Code '${data.code.toUpperCase()}' is already in use`, "DUPLICATE_ENTRY");

    const department = await Department.create({
      ...data,
      code: data.code.toUpperCase(),
      createdByAdminId: adminId,
    });

    return department;
  },

  async getAllDepartments(query) {
    const { page, limit, skip } = getPaginationParams(query);
    const { status, search } = query;

    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name:      { $regex: search, $options: "i" } },
        { code:      { $regex: search, $options: "i" } },
        { shortName: { $regex: search, $options: "i" } },
      ];
    }

    const [departments, total] = await Promise.all([
      Department.find(filter)
        .populate("createdByAdminId", "fullName adminId")
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Department.countDocuments(filter),
    ]);

    return { departments, pagination: buildPaginationMeta(total, page, limit) };
  },

  async getDepartmentById(id) {
    const dept = await Department.findById(id)
      .populate("createdByAdminId", "fullName adminId")
      .lean();
    if (!dept) throw new ApiError(404, "Department not found", "NOT_FOUND");
    return dept;
  },

  async updateDepartment(id, data) {
    // If name is changing, check uniqueness
    if (data.name) {
      const conflict = await Department.findOne({
        name: { $regex: `^${data.name}$`, $options: "i" },
        _id:  { $ne: id },
      });
      if (conflict) throw new ApiError(409, `Department name '${data.name}' already exists`, "DUPLICATE_ENTRY");
    }

    const dept = await Department.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).lean();

    if (!dept) throw new ApiError(404, "Department not found", "NOT_FOUND");
    return dept;
  },

  async toggleStatus(id) {
    const dept = await Department.findById(id);
    if (!dept) throw new ApiError(404, "Department not found", "NOT_FOUND");

    dept.status = dept.status === "active" ? "inactive" : "active";
    await dept.save();
    return dept;
  },
};

export default departmentService;
