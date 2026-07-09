import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const addressSchema = new mongoose.Schema(
  {
    village:  { type: String, trim: true },
    district: { type: String, trim: true },
    division: { type: String, trim: true },
    postCode: { type: String, trim: true },
  },
  { _id: false }
);

const emergencyContactSchema = new mongoose.Schema(
  {
    name:         { type: String, trim: true },
    phone:        { type: String, trim: true },
    relationship: { type: String, trim: true },
  },
  { _id: false }
);

/**
 * Accountant — entity profile collection.
 * Auth credentials live in accountant_auth (Phase 2).
 */
const accountantSchema = new mongoose.Schema(
  {
    // ── Identity ──────────────────────────────────────────────────────────
    staffId: {
      type: String, trim: true,    // e.g. ACC-2024-001
    },
    fullName: {
      type: String, required: [true, "Full name is required"], trim: true,
    },
    email: {
      type: String, required: [true, "Email is required"], lowercase: true, trim: true,
    },
    phone:  { type: String, trim: true, default: null },
    photo:  { type: String, default: null },
    gender: { type: String, enum: ["Male", "Female", "Other"] },

    // ── Professional ──────────────────────────────────────────────────────
    designation:    { type: String, trim: true },           // Head Accountant, Junior Accountant
    joiningDate:    { type: Date, default: null },
    qualification:  { type: String, trim: true, default: null },

    // ── Address / Contact ─────────────────────────────────────────────────
    presentAddress:   { type: addressSchema, default: null },
    permanentAddress: { type: addressSchema, default: null },
    emergencyContact: { type: emergencyContactSchema, default: null },

    // ── System ────────────────────────────────────────────────────────────
    linkedAuthId: {
      type: ObjectId, ref: "AccountantAuth", default: null,
    },
    createdByAdminId: {
      type: ObjectId, ref: "Admin", default: null,
    },
    notes:  { type: String, trim: true, default: null },
    status: {
      type: String,
      enum: ["active", "inactive", "resigned"],
      default: "active",
    },
  },
  { timestamps: true }
);

accountantSchema.index({ staffId: 1 }, { unique: true, sparse: true });
accountantSchema.index({ email:   1 });
accountantSchema.index({ status:  1 });

const Accountant = mongoose.model("Accountant", accountantSchema);
export default Accountant;
