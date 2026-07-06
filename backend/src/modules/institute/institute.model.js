import mongoose from "mongoose";

/**
 * InstituteSettings Model
 * TODO: Define schema in Phase 2
 */
const instituteSchema = new mongoose.Schema({}, { timestamps: true });
const InstituteSettings = mongoose.model("InstituteSettings", instituteSchema);
export default InstituteSettings;
