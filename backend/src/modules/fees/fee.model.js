import mongoose from "mongoose";

/**
 * Fee Model
 * TODO: Define Mongoose schema in Phase 2
 */
const feeSchema = new mongoose.Schema({}, { timestamps: true });

const Fee = mongoose.model("Fee", feeSchema);

export default Fee;
