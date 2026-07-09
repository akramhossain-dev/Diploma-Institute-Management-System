import Batch from "./batch.model.js";
import ApiError from "../../utils/ApiError.js";
import { getPaginationParams, buildPaginationMeta } from "../../utils/pagination.js";

export const batchService = {
  async getBatches(query = {}) {
    const { page, limit, skip } = getPaginationParams(query);
    const { departmentId, academicSessionId, status } = query;

    const filter = {};
    if (departmentId)      filter.departmentId = departmentId;
    if (academicSessionId) filter.academicSessionId = academicSessionId;
    if (status)            filter.status = status;

    const [batches, total] = await Promise.all([
      Batch.find(filter)
        .populate("departmentId", "name code")
        .populate("academicSessionId", "name isCurrent")
        .skip(skip)
        .limit(limit)
        .lean(),
      Batch.countDocuments(filter),
    ]);

    return { batches, pagination: buildPaginationMeta(total, page, limit) };
  },

  async createBatch(data) {
    const existing = await Batch.findOne({ code: data.code.toUpperCase() });
    if (existing) {
      throw new ApiError(409, "Batch with this code already exists", "DUPLICATE_ENTRY");
    }
    return Batch.create(data);
  },

  async updateBatch(id, data) {
    const batch = await Batch.findByIdAndUpdate(id, { $set: data }, { new: true });
    if (!batch) throw new ApiError(404, "Batch not found", "NOT_FOUND");
    return batch;
  },

  async deleteBatch(id) {
    const batch = await Batch.findByIdAndDelete(id);
    if (!batch) throw new ApiError(404, "Batch not found", "NOT_FOUND");
    return batch;
  },
};

export default batchService;
