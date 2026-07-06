import mongoose from "mongoose";

/**
 * Student entity profile collection.
 * Auth data lives in student_auth — this collection holds domain data only.
 */
const studentSchema = new mongoose.Schema(
  {
    studentId:       { type: String, unique: true, trim: true },      // e.g. CST-2024-001
    fullName:        { type: String, required: true, trim: true },
    email:           { type: String, required: true, lowercase: true, trim: true },
    phone:           { type: String, trim: true },
    photo:           { type: String, default: null },                  // Cloudinary URL
    gender:          { type: String, enum: ["Male", "Female", "Other"] },
    dateOfBirth:     { type: Date },
    address: {
      village:       { type: String },
      district:      { type: String },
      division:      { type: String },
      postCode:      { type: String },
    },
    fatherName:      { type: String, trim: true },
    motherName:      { type: String, trim: true },
    guardianPhone:   { type: String, trim: true },
    religion:        { type: String },
    bloodGroup:      { type: String },
    nidOrBirthReg:   { type: String },
    departmentId:    { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    batchId:         { type: mongoose.Schema.Types.ObjectId, ref: "Batch" },
    currentSemester: { type: Number, min: 1, max: 8, default: 1 },
    session:         { type: String },                                 // e.g. "2024-25"
    sscBoard:        { type: String },
    sscYear:         { type: Number },
    sscGpa:          { type: Number },
    sscRoll:         { type: String },
    enrollmentDate:  { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["active", "suspended", "graduated", "dropped"],
      default: "active",
    },
  },
  { timestamps: true }
);

studentSchema.index({ studentId: 1 }, { unique: true, sparse: true });
studentSchema.index({ departmentId: 1, batchId: 1 });
studentSchema.index({ status: 1 });

const Student = mongoose.model("Student", studentSchema);
export default Student;
