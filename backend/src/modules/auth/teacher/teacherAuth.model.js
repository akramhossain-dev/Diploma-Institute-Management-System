import mongoose from "mongoose";

/**
 * TeacherAuth — authentication credentials for teachers.
 * Linked to the teachers collection via teacherId.
 */
const teacherAuthSchema = new mongoose.Schema(
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
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
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

const TeacherAuth = mongoose.model("TeacherAuth", teacherAuthSchema);
export default TeacherAuth;
