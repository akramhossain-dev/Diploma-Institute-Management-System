import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const addressSchema = new mongoose.Schema(
  {
    village:  { type: String, trim: true },
    district: { type: String, trim: true },
    division: { type: String, trim: true },
    postCode: { type: String, trim: true },
  },
  { _id: false }
);

const studentSchema = new mongoose.Schema(
  {
    
    studentId: {
      type: String, trim: true,    
    },
    rollNumber: {
      type: String, trim: true, default: null,
    },
    registrationNumber: {
      type: String, trim: true, default: null,
    },
    fullName: {
      type: String, required: [true, "Full name is required"], trim: true,
    },
    email: {
      type: String, required: [true, "Email is required"], lowercase: true, trim: true,
    },
    phone: {
      type: String, trim: true, default: null,
    },
    photo: {
      type: String, default: null,               
    },
    gender: {
      type: String, enum: ["Male", "Female", "Other"],
    },
    dateOfBirth: {
      type: Date, default: null,
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", null],
      default: null,
    },
    nidOrBirthReg: { type: String, trim: true, default: null },

    departmentId: {
      type: ObjectId, ref: "Department", required: [true, "Department is required"],
    },
    semesterId: {
      type: ObjectId, ref: "Semester", required: [true, "Semester is required"],
    },
    academicSessionId: {
      type: ObjectId, ref: "AcademicSession", required: [true, "Academic session is required"],
    },
    admissionDate: {
      type: Date, default: Date.now,
    },
    shift: {
      type: String, enum: ["Morning", "Day", "Evening"], default: "Day",
    },
    section: { type: String, trim: true, default: null },
    group:   { type: String, trim: true, default: null },

    enrolledCourseIds: [{ type: ObjectId, ref: "Course" }],

    guardianName:     { type: String, trim: true, default: null },
    guardianPhone:    { type: String, trim: true, default: null },
    guardianRelation: { type: String, trim: true, default: null },
    presentAddress:   { type: addressSchema, default: null },
    permanentAddress: { type: addressSchema, default: null },

    linkedAuthId: {
      type: ObjectId, ref: "StudentAuth", default: null,
    },
    createdByAdminId: {
      type: ObjectId, ref: "Admin", default: null,
    },
    notes: { type: String, trim: true, default: null },
    status: {
      type: String,
      enum: ["active", "inactive", "graduated", "dropped", "suspended"],
      default: "active",
    },
  },
  { timestamps: true }
);

studentSchema.index({ studentId:          1 }, { unique: true, sparse: true });
studentSchema.index({ rollNumber:         1 }, { sparse: true });
studentSchema.index({ registrationNumber: 1 }, { sparse: true });
studentSchema.index({ email:              1 });
studentSchema.index({ departmentId:       1 });
studentSchema.index({ semesterId:         1 });
studentSchema.index({ academicSessionId:  1 });
studentSchema.index({ status:             1 });
studentSchema.index({ departmentId: 1, semesterId: 1, academicSessionId: 1 });

const Student = mongoose.model("Student", studentSchema);
export default Student;
