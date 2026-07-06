import mongoose from "mongoose";

/**
 * Student Model
 * TODO: Define Mongoose schema in Phase 2
 */
const studentSchema = new mongoose.Schema({}, { timestamps: true });

const Student = mongoose.model("Student", studentSchema);

export default Student;
