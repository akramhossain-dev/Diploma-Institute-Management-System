import mongoose from "mongoose";

/**
 * Notice Model
 * TODO: Define Mongoose schema in Phase 2
 */
const noticeSchema = new mongoose.Schema({}, { timestamps: true });

const Notice = mongoose.model("Notice", noticeSchema);

export default Notice;
