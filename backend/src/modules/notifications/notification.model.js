import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    // ── Recipient ─────────────────────────────────────────────────────────────
    recipientType: {
      type: String,
      enum: ["admin", "teacher", "accountant", "student", "all"],
      required: true,
      index: true,
    },
    recipientId: {
      // null = broadcast to all of recipientType
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      index: true,
    },

    // ── Content ───────────────────────────────────────────────────────────────
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    type: {
      type: String,
      enum: ["info", "success", "warning", "error"],
      default: "info",
    },

    // ── Interaction ───────────────────────────────────────────────────────────
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    targetLink: {
      type: String,
      default: null,
    },

    // ── Audit ─────────────────────────────────────────────────────────────────
    createdBy: {
      type: String,        // "system" | admin name
      default: "system",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Compound index for efficient recipient lookups
notificationSchema.index({ recipientType: 1, recipientId: 1, read: 1 });
notificationSchema.index({ recipientType: 1, read: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
