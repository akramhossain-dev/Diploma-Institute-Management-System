import mongoose from "mongoose";

/**
 * TeacherAuth Model
 * TODO: Define auth schema in Phase 2
 */
const teacherAuthSchema = new mongoose.Schema({
  email:       { type: String },
  passwordHash:{ type: String, select: false },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
  isActive:    { type: Boolean, default: true },
  refreshToken:{ type: String, select: false },
}, { timestamps: true });

const TeacherAuth = mongoose.model("TeacherAuth", teacherAuthSchema);
export default TeacherAuth;
