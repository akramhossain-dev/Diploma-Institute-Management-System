import mongoose from "mongoose";

/**
 * Result Model
 * TODO: Define Mongoose schema in Phase 2
 */
const resultSchema = new mongoose.Schema({}, { timestamps: true });

const Result = mongoose.model("Result", resultSchema);

export default Result;
