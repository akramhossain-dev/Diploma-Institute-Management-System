import mongoose from "mongoose";

/**
 * Course Model
 * TODO: Define Mongoose schema in Phase 2
 */
const courseSchema = new mongoose.Schema({}, { timestamps: true });

const Course = mongoose.model("Course", courseSchema);

export default Course;
