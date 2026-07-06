import mongoose from "mongoose";

/**
 * Attendance Model
 * TODO: Define Mongoose schema in Phase 2
 */
const attendanceSchema = new mongoose.Schema({}, { timestamps: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
