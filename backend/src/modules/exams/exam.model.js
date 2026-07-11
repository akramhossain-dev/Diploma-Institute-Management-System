import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const examSchema = new mongoose.Schema(
  {
    name: {
      type: String, required: [true, "Exam name is required"], trim: true,
    },
    examType: {
      type:     String,
      enum:     ["midterm", "final", "class_test", "practical", "viva", "quiz", "custom"],
      required: [true, "Exam type is required"],
    },
    description: { type: String, trim: true, default: null },

    departmentId:      { type: ObjectId, ref: "Department",      required: [true, "Department is required"] },
    semesterId:        { type: ObjectId, ref: "Semester",        required: [true, "Semester is required"] },
    academicSessionId: { type: ObjectId, ref: "AcademicSession", required: [true, "Academic session is required"] },

    startDate: { type: Date, default: null },
    endDate:   { type: Date, default: null },

    examStatus: {
      type:    String,
      enum:    ["draft", "scheduled", "ongoing", "completed", "published", "cancelled"],
      default: "draft",
    },
    publishedAt: { type: Date, default: null },

    createdByAdminId: { type: ObjectId, ref: "Admin", default: null },
    notes:            { type: String, trim: true, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

examSchema.virtual("type").get(function() {
  return this.examType;
}).set(function(val) {
  this.examType = val;
});

examSchema.virtual("sessionId").get(function() {
  return this.academicSessionId;
}).set(function(val) {
  this.academicSessionId = val;
});

examSchema.virtual("status").get(function() {
  return this.examStatus;
}).set(function(val) {
  this.examStatus = val;
});

examSchema.index({ departmentId:      1, semesterId: 1, academicSessionId: 1 });
examSchema.index({ examType:          1 });
examSchema.index({ examStatus:        1 });
examSchema.index({ academicSessionId: 1 });

const Exam = mongoose.model("Exam", examSchema);
export default Exam;
