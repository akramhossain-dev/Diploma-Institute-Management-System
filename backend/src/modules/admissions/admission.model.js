import mongoose from "mongoose";

/**
 * Admission Model
 * TODO: Define Mongoose schema in Phase 2
 */
const admissionSchema = new mongoose.Schema({}, { timestamps: true });

const Admission = mongoose.model("Admission", admissionSchema);

export default Admission;
