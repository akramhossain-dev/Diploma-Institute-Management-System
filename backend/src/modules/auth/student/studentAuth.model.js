import mongoose from "mongoose";

/**
 * StudentAuth — authentication credentials for students.
 * Linked to the students collection via studentId.
 *
 * This collection contains ONLY auth data.
 * Profile data lives in the students collection.
 */
const studentAuthSchema = new mongoose.Schema(
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
      select: false,                              // never returned in queries by default
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    mustChangePassword: {
      type: Boolean,
      default: false,                             // true when admin creates account
    },
    refreshToken: {
      type: String,
      default: null,
      select: false,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    passwordChangedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const StudentAuth = mongoose.model("StudentAuth", studentAuthSchema);
export default StudentAuth;
