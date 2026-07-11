import { createAuthService } from "../shared/createAuthService.js";
import StudentAuth from "./studentAuth.model.js";
import Student from "../../students/student.model.js";

const studentAuthService = createAuthService({
  AuthModel: StudentAuth,
  EntityModel: Student,
  entityIdField: "studentId",   // field on StudentAuth that references Student._id
  entityType: "student",
});

export default studentAuthService;
