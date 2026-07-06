import Semester from "./semester.model.js";
import ApiError from "../../utils/ApiError.js";

const semesterService = {

  async createSemester(data) {
    // Uniqueness — number and name
    const [numTaken, nameTaken] = await Promise.all([
      Semester.findOne({ number: data.number }),
      Semester.findOne({ name: { $regex: `^${data.name}$`, $options: "i" } }),
    ]);

    if (numTaken)  throw new ApiError(409, `Semester number ${data.number} already exists`, "DUPLICATE_ENTRY");
    if (nameTaken) throw new ApiError(409, `Semester name '${data.name}' already exists`, "DUPLICATE_ENTRY");

    const semester = await Semester.create(data);
    return semester;
  },

  async getAllSemesters() {
    // Return all sorted by number — no pagination needed for a fixed small list
    return Semester.find().sort({ number: 1 }).lean();
  },

  async getSemesterById(id) {
    const semester = await Semester.findById(id).lean();
    if (!semester) throw new ApiError(404, "Semester not found", "NOT_FOUND");
    return semester;
  },

  async updateSemester(id, data) {
    // Prevent changing the semester number (structural integrity)
    const { number, ...allowedUpdates } = data;

    if (number !== undefined) {
      throw new ApiError(400, "Semester number cannot be changed after creation", "BUSINESS_RULE_VIOLATION");
    }

    // Name uniqueness check if name is changing
    if (allowedUpdates.name) {
      const conflict = await Semester.findOne({
        name: { $regex: `^${allowedUpdates.name}$`, $options: "i" },
        _id:  { $ne: id },
      });
      if (conflict) throw new ApiError(409, `Semester name '${allowedUpdates.name}' already exists`, "DUPLICATE_ENTRY");
    }

    const semester = await Semester.findByIdAndUpdate(
      id,
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    ).lean();

    if (!semester) throw new ApiError(404, "Semester not found", "NOT_FOUND");
    return semester;
  },

  async toggleStatus(id) {
    const semester = await Semester.findById(id);
    if (!semester) throw new ApiError(404, "Semester not found", "NOT_FOUND");

    semester.status = semester.status === "active" ? "inactive" : "active";
    await semester.save();
    return semester;
  },
};

export default semesterService;
