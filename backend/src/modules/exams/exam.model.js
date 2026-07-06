import mongoose from "mongoose";

/**
 * Exam Model
 * TODO: Define Mongoose schema in Phase 2
 */
const examSchema = new mongoose.Schema({}, { timestamps: true });

const Exam = mongoose.model("Exam", examSchema);

export default Exam;
