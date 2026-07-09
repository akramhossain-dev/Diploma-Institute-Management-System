import mongoose from "mongoose";

/**
 * AcademicSession — an academic year/batch (e.g. 2024-2025).
 * One session is flagged as current at any given time.
 *
 * Referenced by: students (admission session), future exam/result modules
 */
const academicSessionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Session name is required"],
      trim: true,
      unique: true,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    status: {
      type: String,
      enum: ["planned", "active", "completed"],
      default: "planned",
    },
    isCurrent: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      trim: true,
      default: null,
    },
    createdByAdminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

academicSessionSchema.virtual("startYear").get(function() {
  return this.startDate ? this.startDate.getUTCFullYear() : null;
});

academicSessionSchema.virtual("endYear").get(function() {
  return this.endDate ? this.endDate.getUTCFullYear() : null;
});

academicSessionSchema.index({ status:    1 });

// Enforce at DB level: at most one document where isCurrent = true
// Application-level enforcement also applied in the service layer
academicSessionSchema.index(
  { isCurrent: 1 },
  { unique: true, partialFilterExpression: { isCurrent: true } }
);

const AcademicSession = mongoose.model("AcademicSession", academicSessionSchema);
export default AcademicSession;
