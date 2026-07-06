import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

/**
 * Exam — an academic examination event.
 *
 * Status machine:
 *   draft → scheduled → ongoing → completed → published
 *   Any non-terminal state → cancelled
 */
const examSchema = new mongoose.Schema(
  {
    name: {
      type: String, required: [true, "Exam name is required"], trim: true,
    },
    examType: {
      type:     String,
      enum:     ["midterm", "final", "class_test", "practical", "viva", "quiz", "custom"],
      required: [true, "Exam type is required"],
    },
    description: { type: String, trim: true, default: null },

    // ── Academic context ──────────────────────────────────────────────────
    departmentId:      { type: ObjectId, ref: "Department",      required: [true, "Department is required"] },
    semesterId:        { type: ObjectId, ref: "Semester",        required: [true, "Semester is required"] },
    academicSessionId: { type: ObjectId, ref: "AcademicSession", required: [true, "Academic session is required"] },

    // ── Scheduling window (overall) ───────────────────────────────────────
    startDate: { type: Date, default: null },
    endDate:   { type: Date, default: null },

    // ── Status ────────────────────────────────────────────────────────────
    examStatus: {
      type:    String,
      enum:    ["draft", "scheduled", "ongoing", "completed", "published", "cancelled"],
      default: "draft",
    },
    publishedAt: { type: Date, default: null },

    // ── Authorship ────────────────────────────────────────────────────────
    createdByAdminId: { type: ObjectId, ref: "Admin", default: null },
    notes:            { type: String, trim: true, default: null },
  },
  { timestamps: true }
);

examSchema.index({ departmentId:      1, semesterId: 1, academicSessionId: 1 });
examSchema.index({ examType:          1 });
examSchema.index({ examStatus:        1 });
examSchema.index({ academicSessionId: 1 });

const Exam = mongoose.model("Exam", examSchema);
export default Exam;
