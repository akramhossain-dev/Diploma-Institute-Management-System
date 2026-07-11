import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    
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
      type: String,     
      required: true,
      trim: true,
    },

    action: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      index: true,
      
    },

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
      
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
      
    },

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

auditLogSchema.index({ actorType: 1, createdAt: -1 });
auditLogSchema.index({ targetModule: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ createdAt: -1 });

const AuditLog = mongoose.model("AuditLog", auditLogSchema);
export default AuditLog;
