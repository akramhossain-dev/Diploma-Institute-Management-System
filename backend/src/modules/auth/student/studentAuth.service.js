import { createAuthService } from "../shared/createAuthService.js";
import StudentAuth from "./studentAuth.model.js";
import Student from "../../students/student.model.js";

/**
 * Student auth service — instantiated with student-specific models.
 * All auth logic lives in the shared factory (createAuthService).
 * Add student-specific overrides here if needed in future phases.
 */
const studentAuthService = createAuthService({
  AuthModel: StudentAuth,
  EntityModel: Student,
  entityIdField: "studentId",   // field on StudentAuth that references Student._id
  entityType: "student",
});

export default studentAuthService;
