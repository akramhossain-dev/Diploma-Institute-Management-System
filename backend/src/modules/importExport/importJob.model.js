import mongoose from "mongoose";

const importJobSchema = new mongoose.Schema(
  {
    module: {
      type: String,
      enum: ["students", "teachers", "accountants", "fees"],
      required: true,
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    totalRecords: {
      type: Number,
      default: 0,
    },
    processedRecords: {
      type: Number,
      default: 0,
    },
    failedRecords: {
      type: Number,
      default: 0,
    },
    errorLog: {
      type: String,
      default: null,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const ImportJob = mongoose.model("ImportJob", importJobSchema);

export default ImportJob;
