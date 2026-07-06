import mongoose from "mongoose";

/**
 * AdminAuth Model
 * TODO: Define auth schema in Phase 2
 */
const adminAuthSchema = new mongoose.Schema({
  email:       { type: String },
  passwordHash:{ type: String, select: false },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  isActive:    { type: Boolean, default: true },
  refreshToken:{ type: String, select: false },
}, { timestamps: true });

const AdminAuth = mongoose.model("AdminAuth", adminAuthSchema);
export default AdminAuth;
