import mongoose from "mongoose";

/**
 * AccountantAuth — authentication credentials for accountants.
 * Linked to the accountants collection via accountantId.
 */
const accountantAuthSchema = new mongoose.Schema(
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
    accountantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Accountant",
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

const AccountantAuth = mongoose.model("AccountantAuth", accountantAuthSchema);
export default AccountantAuth;
