import mongoose from "mongoose";

/**
 * StudentAuth Model
 * TODO: Define auth schema in Phase 2
 */
const studentAuthSchema = new mongoose.Schema({
  email:       { type: String },
  passwordHash:{ type: String, select: false },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  isActive:    { type: Boolean, default: true },
  refreshToken:{ type: String, select: false },
}, { timestamps: true });

const StudentAuth = mongoose.model("StudentAuth", studentAuthSchema);
export default StudentAuth;
