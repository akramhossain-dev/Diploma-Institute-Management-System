import mongoose from "mongoose";

/**
 * Accountant Model
 * TODO: Define Mongoose schema in Phase 2
 */
const accountantSchema = new mongoose.Schema({}, { timestamps: true });

const Accountant = mongoose.model("Accountant", accountantSchema);

export default Accountant;
