import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    adminId:       { type: String, trim: true },         
    fullName:      { type: String, required: true, trim: true },
    email:         { type: String, required: true, lowercase: true, trim: true },
    phone:         { type: String, trim: true },
    photo:         { type: String, default: null },
    designation:   { type: String, trim: true },                       
    isSuperAdmin:  { type: Boolean, default: false },
    joiningDate:   { type: Date },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

adminSchema.index({ adminId: 1 }, { unique: true, sparse: true });
adminSchema.index({ isSuperAdmin: 1 });

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
