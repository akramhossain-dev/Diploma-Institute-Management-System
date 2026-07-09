import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    // ── Who did it ────────────────────────────────────────────────────────────
    actorType: {
      type: String,
      enum: ["admin", "teacher", "accountant", "student", "system"],
      required: true,
      index: true,
    },
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    actorName: {
      type: String,
      required: true,
      trim: true,
    },
    actorIdentifier: {
      type: String,     // email or ID string
      required: true,
      trim: true,
    },

    // ── What was done ─────────────────────────────────────────────────────────
    action: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      index: true,
      // Examples: CREATE_STUDENT, UPDATE_FEES, PUBLISH_NOTICE, DELETE_EXAM, LOGIN, LOGOUT
    },

    // ── What was affected ─────────────────────────────────────────────────────
    targetModule: {
      type: String,
      required: true,
      trim: true,
      index: true,
      // Examples: "Students", "Finance", "Exams", "Notices", "Auth"
    },
    targetEntity: {
      type: String,
      required: true,
      trim: true,
      // Examples: "Student (CST-2026-001)", "Invoice #INV-0029", "Exam (Midterm 2026)"
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    // ── Request context ───────────────────────────────────────────────────────
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
      // { ip, userAgent, before: {}, after: {}, details: '' }
    },

    // ── Severity ──────────────────────────────────────────────────────────────
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "low",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes for reporting and filtering
auditLogSchema.index({ actorType: 1, createdAt: -1 });
auditLogSchema.index({ targetModule: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ createdAt: -1 });

const AuditLog = mongoose.model("AuditLog", auditLogSchema);
export default AuditLog;
