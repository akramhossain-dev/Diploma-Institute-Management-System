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

const emergencyContactSchema = new mongoose.Schema(
  {
    name:         { type: String, trim: true },
    phone:        { type: String, trim: true },
    relationship: { type: String, trim: true },
  },
  { _id: false }
);

const teacherSchema = new mongoose.Schema(
  {
    
    employeeId: {
      type: String, trim: true,    
    },
    fullName: {
      type: String, required: [true, "Full name is required"], trim: true,
    },
    email: {
      type: String, required: [true, "Email is required"], lowercase: true, trim: true,
    },
    phone:       { type: String, trim: true, default: null },
    photo:       { type: String, default: null },
    gender:      { type: String, enum: ["Male", "Female", "Other"] },
    dateOfBirth: { type: Date, default: null },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", null],
      default: null,
    },

    departmentId: {
      type: ObjectId, ref: "Department", required: [true, "Department is required"],
    },
    designation:    { type: String, trim: true },           
    qualification:  { type: String, trim: true },           
    specialization: { type: String, trim: true, default: null },
    joiningDate:    { type: Date, default: null },

    assignedCourses: [{ type: ObjectId, ref: "Course" }],

    presentAddress:   { type: addressSchema, default: null },
    permanentAddress: { type: addressSchema, default: null },
    emergencyContact: { type: emergencyContactSchema, default: null },

    linkedAuthId: {
      type: ObjectId, ref: "TeacherAuth", default: null,
    },
    createdByAdminId: {
      type: ObjectId, ref: "Admin", default: null,
    },
    notes:  { type: String, trim: true, default: null },
    status: {
      type: String,
      enum: ["active", "inactive", "on_leave", "resigned"],
      default: "active",
    },
  },
  { timestamps: true }
);

teacherSchema.index({ employeeId:   1 }, { unique: true, sparse: true });
teacherSchema.index({ email:        1 });
teacherSchema.index({ departmentId: 1 });
teacherSchema.index({ status:       1 });

const Teacher = mongoose.model("Teacher", teacherSchema);
export default Teacher;
