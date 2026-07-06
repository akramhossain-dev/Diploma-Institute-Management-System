import { createAuthService } from "../shared/createAuthService.js";
import TeacherAuth from "./teacherAuth.model.js";
import Teacher from "../../teachers/teacher.model.js";

const teacherAuthService = createAuthService({
  AuthModel: TeacherAuth,
  EntityModel: Teacher,
  entityIdField: "teacherId",
  entityType: "teacher",
});

export default teacherAuthService;
