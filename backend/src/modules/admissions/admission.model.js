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

const previousEducationSchema = new mongoose.Schema(
  {
    board:        { type: String, trim: true },            
    year:         { type: Number },                        
    roll:         { type: String, trim: true },
    registration: { type: String, trim: true },
    gpa:          { type: Number, min: 0, max: 5 },
    institution:  { type: String, trim: true },
    examType:     { type: String, trim: true, default: "SSC" }, 
  },
  { _id: false }
);

const admissionSchema = new mongoose.Schema(
  {
    
    fullName:    { type: String, required: [true, "Full name is required"], trim: true },
    email:       { type: String, required: [true, "Email is required"], lowercase: true, trim: true },
    phone:       { type: String, required: [true, "Phone is required"], trim: true },
    gender:      { type: String, enum: ["Male", "Female", "Other"] },
    dateOfBirth: { type: Date, default: null },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", null],
      default: null,
    },
    applicantPhoto: { type: String, default: null },      

    desiredDepartmentId: {
      type: ObjectId, ref: "Department",
      required: [true, "Desired department is required"],
    },
    targetSemesterId: {
      type: ObjectId, ref: "Semester", default: null,     
    },
    academicSessionId: {
      type: ObjectId, ref: "AcademicSession",
      required: [true, "Academic session is required"],
    },
    previousEducation:  { type: previousEducationSchema, default: null },
    admissionSource: {
      type: String, enum: ["online", "offline", "manual"], default: "online",
    },

    admissionStatus: {
      type: String,
      enum: ["pending", "reviewed", "approved", "rejected", "cancelled"],
      default: "pending",
    },
    reviewedByAdminId: { type: ObjectId, ref: "Admin",   default: null },
    reviewedAt:        { type: Date,                      default: null },
    rejectionReason:   { type: String, trim: true,        default: null },
    notes:             { type: String, trim: true,        default: null },

    convertedStudentId: { type: ObjectId, ref: "Student", default: null },
    convertedAt:        { type: Date,                      default: null },
    convertedByAdminId: { type: ObjectId, ref: "Admin",   default: null },

    guardianName:     { type: String, trim: true, default: null },
    guardianPhone:    { type: String, trim: true, default: null },
    guardianRelation: { type: String, trim: true, default: null },
    presentAddress:   { type: addressSchema, default: null },
    permanentAddress: { type: addressSchema, default: null },
  },
  { timestamps: true }
);

// Prevent duplicate application for same email + session + department
admissionSchema.index(
  { email: 1, academicSessionId: 1, desiredDepartmentId: 1 },
  { unique: true, name: "unique_application_per_session_dept" }
);
admissionSchema.index({ admissionStatus:     1 });
admissionSchema.index({ desiredDepartmentId: 1 });
admissionSchema.index({ academicSessionId:   1 });
admissionSchema.index({ convertedStudentId:  1 }, { sparse: true });

const Admission = mongoose.model("Admission", admissionSchema);
export default Admission;
