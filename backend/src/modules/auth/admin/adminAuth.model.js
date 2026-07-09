import mongoose from "mongoose";

/**
 * AdminAuth — authentication credentials for admins.
 * Linked to the admins collection via adminId.
 */
const adminAuthSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
      unique: true,
    },
    isActive:           { type: Boolean, default: true },
    mustChangePassword: { type: Boolean, default: false },
    refreshToken:       { type: String, default: null, select: false },
    lastLoginAt:        { type: Date, default: null },
    passwordChangedAt:  { type: Date, default: null },
  },
  { timestamps: true }
);

const AdminAuth = mongoose.model("AdminAuth", adminAuthSchema);
export default AdminAuth;
