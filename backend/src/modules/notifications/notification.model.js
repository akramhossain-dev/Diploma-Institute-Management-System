import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    
    recipientType: {
      type: String,
      enum: ["admin", "teacher", "accountant", "student", "all"],
      required: true,
      index: true,
    },
    recipientId: {
      
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      index: true,
    },

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

    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    targetLink: {
      type: String,
      default: null,
    },

    createdBy: {
      type: String,        
      default: "system",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

notificationSchema.index({ recipientType: 1, recipientId: 1, read: 1 });
notificationSchema.index({ recipientType: 1, read: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
