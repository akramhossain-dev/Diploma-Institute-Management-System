import mongoose from "mongoose";

/**
 * Admin Model
 * TODO: Define Mongoose schema in Phase 2
 */
const adminSchema = new mongoose.Schema({}, { timestamps: true });

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
