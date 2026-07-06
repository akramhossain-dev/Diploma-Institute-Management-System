import mongoose from "mongoose";

/**
 * AccountantAuth Model
 * TODO: Define auth schema in Phase 2
 */
const accountantAuthSchema = new mongoose.Schema({
  email:       { type: String },
  passwordHash:{ type: String, select: false },
  accountantId: { type: mongoose.Schema.Types.ObjectId, ref: "Accountant" },
  isActive:    { type: Boolean, default: true },
  refreshToken:{ type: String, select: false },
}, { timestamps: true });

const AccountantAuth = mongoose.model("AccountantAuth", accountantAuthSchema);
export default AccountantAuth;
