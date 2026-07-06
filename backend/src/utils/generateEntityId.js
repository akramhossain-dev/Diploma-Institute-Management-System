/**
 * Entity ID generator — auto-generates sequential IDs for each entity type.
 * Format: PREFIX-YEAR-NNN (e.g. CST-2024-001, TCH-2024-007, ACC-2024-002)
 */

/**
 * Generate a student ID using the department code.
 * @param {mongoose.Model} StudentModel
 * @param {string} departmentCode  - e.g. "CST", "EET"
 */
export const generateStudentId = async (StudentModel, departmentCode = "STD") => {
  const year  = new Date().getFullYear();
  const count = await StudentModel.countDocuments();
  const seq   = String(count + 1).padStart(3, "0");
  return `${departmentCode.toUpperCase()}-${year}-${seq}`;
};

/**
 * Generate a teacher employee ID.
 * @param {mongoose.Model} TeacherModel
 */
export const generateTeacherId = async (TeacherModel) => {
  const year  = new Date().getFullYear();
  const count = await TeacherModel.countDocuments();
  const seq   = String(count + 1).padStart(3, "0");
  return `TCH-${year}-${seq}`;
};

/**
 * Generate an accountant employee ID.
 * @param {mongoose.Model} AccountantModel
 */
export const generateAccountantId = async (AccountantModel) => {
  const year  = new Date().getFullYear();
  const count = await AccountantModel.countDocuments();
  const seq   = String(count + 1).padStart(3, "0");
  return `ACC-${year}-${seq}`;
};
