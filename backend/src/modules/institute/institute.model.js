import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

/**
 * InstituteSettings — singleton configuration record.
 *
 * Only ONE document should ever exist in this collection.
 * Use settingsService.getSettings() / updateSettings() — never create manually.
 *
 * All future modules (fees, attendance policy, ID prefix generation) will
 * read from this collection.
 */
const instituteSettingsSchema = new mongoose.Schema(
  {
    // ── Identity ──────────────────────────────────────────────────────────
    instituteName: {
      type: String, required: [true, "Institute name is required"], trim: true,
    },
    shortName: {
      type: String, trim: true, default: null,
    },
    logo:    { type: String, default: null },          // Cloudinary URL (Phase 6)
    email:   { type: String, lowercase: true, trim: true, default: null },
    phone:   { type: String, trim: true, default: null },
    website: { type: String, trim: true, default: null },

    // ── Address ───────────────────────────────────────────────────────────
    address: {
      street:   { type: String, trim: true },
      city:     { type: String, trim: true },
      district: { type: String, trim: true },
      division: { type: String, trim: true },
      postCode: { type: String, trim: true },
      country:  { type: String, trim: true, default: "Bangladesh" },
    },

    // ── Academic defaults ─────────────────────────────────────────────────
    currentAcademicSessionId: {
      type: ObjectId, ref: "AcademicSession", default: null,
    },
    defaultAdmissionSemesterId: {
      type: ObjectId, ref: "Semester", default: null,
    },
    defaultCurrency: { type: String, trim: true, default: "BDT" },
    timezone:        { type: String, trim: true, default: "Asia/Dhaka" },

    // ── ID prefix configuration ───────────────────────────────────────────
    // Used by Phase 4's generateEntityId utility — can be overridden here
    studentIdPrefix:    { type: String, trim: true, default: "STD" },
    teacherIdPrefix:    { type: String, trim: true, default: "TCH" },
    accountantIdPrefix: { type: String, trim: true, default: "ACC" },

    // ── Receipt / invoice prefixes (Phase finance readiness) ──────────────
    feeReceiptPrefix:   { type: String, trim: true, default: "REC" },
    invoicePrefix:      { type: String, trim: true, default: "INV" },

    // ── Attendance policy summary ─────────────────────────────────────────
    minAttendancePercent: { type: Number, min: 0, max: 100, default: 75 },

    // ── Grading policy summary ────────────────────────────────────────────
    gradingScale: {
      type: String,
      enum:    ["4.0", "5.0", "letter", "percentage"],
      default: "4.0",
    },

    // ── Singleton guard ───────────────────────────────────────────────────
    // Enforce at application level; this field ensures a readable anchor
    isSingleton: { type: Boolean, default: true, immutable: true },

    // ── MRIST / Public content fields ─────────────────────────────────────
    // Used by /api/institute/public to serve public-facing institute info
    established:   { type: String, trim: true, default: null },
    affiliation:   { type: String, trim: true, default: "BTEB" },
    history:       { type: String, trim: true, default: null },
    mission:       { type: String, trim: true, default: null },
    vision:        { type: String, trim: true, default: null },
    admissionOpen: { type: Boolean, default: true },

    // ── Audit ─────────────────────────────────────────────────────────────
    updatedByAdminId: {
      type: ObjectId, ref: "Admin", default: null,
    },
  },
  { timestamps: true }
);

// Singleton enforcement at DB level
instituteSettingsSchema.index(
  { isSingleton: 1 },
  { unique: true, name: "singleton_guard" }
);

const InstituteSettings = mongoose.model("InstituteSettings", instituteSettingsSchema);
export default InstituteSettings;
