import mongoose from "mongoose";

/**
 * Accountant entity profile collection.
 */
const accountantSchema = new mongoose.Schema(
  {
    staffId:      { type: String, unique: true, trim: true },          // e.g. ACC-2024-001
    fullName:     { type: String, required: true, trim: true },
    email:        { type: String, required: true, lowercase: true, trim: true },
    phone:        { type: String, trim: true },
    photo:        { type: String, default: null },
    designation:  { type: String, trim: true },
    joiningDate:  { type: Date },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

accountantSchema.index({ staffId: 1 }, { unique: true, sparse: true });

const Accountant = mongoose.model("Accountant", accountantSchema);
export default Accountant;
