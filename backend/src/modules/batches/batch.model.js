import mongoose from "mongoose";

/**
 * Batch Model
 * TODO: Define Mongoose schema in Phase 2
 */
const batchSchema = new mongoose.Schema({}, { timestamps: true });

const Batch = mongoose.model("Batch", batchSchema);

export default Batch;
