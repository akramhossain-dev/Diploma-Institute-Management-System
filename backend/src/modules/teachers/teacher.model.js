import mongoose from "mongoose";

/**
 * Teacher Model
 * TODO: Define Mongoose schema in Phase 2
 */
const teacherSchema = new mongoose.Schema({}, { timestamps: true });

const Teacher = mongoose.model("Teacher", teacherSchema);

export default Teacher;
