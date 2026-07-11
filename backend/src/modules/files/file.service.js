import FileModel from "./file.model.js";
import { uploadBuffer, deleteAsset } from "../../utils/cloudinary.js";
import ApiError from "../../utils/ApiError.js";
import { getPaginationParams, buildPaginationMeta } from "../../utils/pagination.js";

export const fileService = {
  async getFiles(query = {}) {
    const { page, limit, skip } = getPaginationParams(query);
    const { search, type, moduleRef } = query;

    const filter = {};
    if (type)      filter.type = new RegExp(type, "i");
    if (moduleRef) filter.moduleRef = moduleRef;
    if (search) {
      filter.$or = [
        { name: new RegExp(search, "i") },
        { moduleRef: new RegExp(search, "i") },
      ];
    }

    const [files, total] = await Promise.all([
      FileModel.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      FileModel.countDocuments(filter),
    ]);

    return { files, pagination: buildPaginationMeta(total, page, limit) };
  },

  async uploadFile(file, moduleRef, actorName) {
    if (!file) throw new ApiError(400, "No file provided for upload", "VALIDATION_ERROR");

    const { url, publicId } = await uploadBuffer(file.buffer, "dims_uploads");

    const fileRecord = await FileModel.create({
      name: file.originalname,
      type: file.mimetype,
      size: file.size,
      uploadedBy: actorName || "System",
      url,
      moduleRef: moduleRef || "General",
      cloudinaryPublicId: publicId,
    });

    return fileRecord;
  },

  async deleteFile(id) {
    const fileRecord = await FileModel.findById(id);
    if (!fileRecord) throw new ApiError(404, "File not found", "NOT_FOUND");

    await deleteAsset(fileRecord.cloudinaryPublicId);

    await fileRecord.deleteOne();
    return true;
  },
};

export default fileService;
