import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const instituteSettingsSchema = new mongoose.Schema(
  {
    
    instituteName: {
      type: String, required: [true, "Institute name is required"], trim: true,
    },
    shortName: {
      type: String, trim: true, default: null,
    },
    logo:    { type: String, default: null },          
    email:   { type: String, lowercase: true, trim: true, default: null },
    phone:   { type: String, trim: true, default: null },
    website: { type: String, trim: true, default: null },

    address: {
      street:   { type: String, trim: true },
      city:     { type: String, trim: true },
      district: { type: String, trim: true },
      division: { type: String, trim: true },
      postCode: { type: String, trim: true },
      country:  { type: String, trim: true, default: "Bangladesh" },
    },

    currentAcademicSessionId: {
      type: ObjectId, ref: "AcademicSession", default: null,
    },
    defaultAdmissionSemesterId: {
      type: ObjectId, ref: "Semester", default: null,
    },
    defaultCurrency: { type: String, trim: true, default: "BDT" },
    timezone:        { type: String, trim: true, default: "Asia/Dhaka" },

    studentIdPrefix:    { type: String, trim: true, default: "STD" },
    teacherIdPrefix:    { type: String, trim: true, default: "TCH" },
    accountantIdPrefix: { type: String, trim: true, default: "ACC" },

    feeReceiptPrefix:   { type: String, trim: true, default: "REC" },
    invoicePrefix:      { type: String, trim: true, default: "INV" },

    minAttendancePercent: { type: Number, min: 0, max: 100, default: 75 },

    gradingScale: {
      type: String,
      enum:    ["4.0", "5.0", "letter", "percentage"],
      default: "4.0",
    },

    isSingleton: { type: Boolean, default: true, immutable: true },

    established:   { type: String, trim: true, default: null },
    affiliation:   { type: String, trim: true, default: "BTEB" },
    history:       { type: String, trim: true, default: null },
    mission:       { type: String, trim: true, default: null },
    vision:        { type: String, trim: true, default: null },
    admissionOpen: { type: Boolean, default: true },

    updatedByAdminId: {
      type: ObjectId, ref: "Admin", default: null,
    },
  },
  { timestamps: true }
);

instituteSettingsSchema.index(
  { isSingleton: 1 },
  { unique: true, name: "singleton_guard" }
);

const InstituteSettings = mongoose.model("InstituteSettings", instituteSettingsSchema);
export default InstituteSettings;
