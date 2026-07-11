import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const classRoutineSchema = new mongoose.Schema(
  {
    
    teacherAssignmentId: { type: ObjectId, ref: "TeacherAssignment", default: null },
    teacherId:           { type: ObjectId, ref: "Teacher",           required: [true, "Teacher is required"] },
    courseId:            { type: ObjectId, ref: "Course",            required: [true, "Course is required"] },
    departmentId:        { type: ObjectId, ref: "Department",        required: [true, "Department is required"] },
    semesterId:          { type: ObjectId, ref: "Semester",          required: [true, "Semester is required"] },
    academicSessionId:   { type: ObjectId, ref: "AcademicSession",   required: [true, "Academic session is required"] },
    section:             { type: String, trim: true, default: null },
    shift:               { type: String, enum: ["Morning", "Day", "Evening"], default: null },

    dayOfWeek: {
      type:     String,
      enum:     ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      required: [true, "Day of week is required"],
    },
    startTime: { type: String, required: [true, "Start time is required"] },  
    endTime:   { type: String, required: [true, "End time is required"] },    
    room:      { type: String, trim: true, default: null },                   

    effectiveFrom: { type: Date, default: null },
    effectiveTo:   { type: Date, default: null },

    routineStatus: {
      type:    String,
      enum:    ["active", "inactive", "cancelled"],
      default: "active",
    },

    createdByAdminId: { type: ObjectId, ref: "Admin", default: null },
    notes:            { type: String, trim: true, default: null },
  },
  { timestamps: true }
);

classRoutineSchema.index({ teacherId: 1, dayOfWeek: 1, routineStatus: 1 });
classRoutineSchema.index({ departmentId: 1, semesterId: 1, section: 1, dayOfWeek: 1, routineStatus: 1 });
classRoutineSchema.index({ room: 1, dayOfWeek: 1, routineStatus: 1 }, { sparse: true });
classRoutineSchema.index({ academicSessionId: 1 });
classRoutineSchema.index({ courseId: 1 });

const ClassRoutine = mongoose.model("ClassRoutine", classRoutineSchema);
export default ClassRoutine;
