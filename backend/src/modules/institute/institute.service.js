import InstituteSettings from "./institute.model.js";
import AcademicSession from "../academicSessions/academicSession.model.js";
import Semester from "../semesters/semester.model.js";
import ApiError from "../../utils/ApiError.js";

const instituteSettingsService = {

  async getSettings() {
    const settings = await InstituteSettings.findOne()
      .populate("currentAcademicSessionId",   "name status")
      .populate("defaultAdmissionSemesterId", "name number")
      .populate("updatedByAdminId",           "fullName adminId")
      .lean();

    if (!settings) {
      throw new ApiError(
        404,
        "Institute settings have not been initialized yet. POST /api/institute-settings to create.",
        "SETTINGS_NOT_INITIALIZED"
      );
    }

    return settings;
  },

  async createSettings(data, adminId) {
    const existing = await InstituteSettings.findOne().lean();
    if (existing) {
      throw new ApiError(
        409,
        "Institute settings already exist. Use PATCH /api/institute-settings to update.",
        "ALREADY_INITIALIZED"
      );
    }

    await this._validateRefs(data);

    const settings = await InstituteSettings.create({
      ...data,
      updatedByAdminId: adminId,
    });

    return settings;
  },

  async updateSettings(data, adminId) {
    await this._validateRefs(data);

    // Strip singleton guard fields
    const { isSingleton, ...allowedUpdates } = data;

    const settings = await InstituteSettings.findOneAndUpdate(
      {},
      { $set: { ...allowedUpdates, updatedByAdminId: adminId } },
      { new: true, runValidators: true }
    )
      .populate("currentAcademicSessionId",   "name status")
      .populate("defaultAdmissionSemesterId", "name number")
      .lean();

    if (!settings) {
      throw new ApiError(
        404,
        "No institute settings found. Create settings first.",
        "SETTINGS_NOT_INITIALIZED"
      );
    }

    return settings;
  },

  async _validateRefs(data) {
    const { currentAcademicSessionId, defaultAdmissionSemesterId } = data;

    const checks = [];

    if (currentAcademicSessionId) {
      checks.push(
        AcademicSession.findById(currentAcademicSessionId).lean().then((doc) => {
          if (!doc) throw new ApiError(404, "currentAcademicSessionId references a non-existent session", "NOT_FOUND");
        })
      );
    }

    if (defaultAdmissionSemesterId) {
      checks.push(
        Semester.findById(defaultAdmissionSemesterId).lean().then((doc) => {
          if (!doc) throw new ApiError(404, "defaultAdmissionSemesterId references a non-existent semester", "NOT_FOUND");
        })
      );
    }

    await Promise.all(checks);
  },
};

export default instituteSettingsService;
