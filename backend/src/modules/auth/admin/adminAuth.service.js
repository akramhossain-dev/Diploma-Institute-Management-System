import { createAuthService } from "../shared/createAuthService.js";
import AdminAuth from "./adminAuth.model.js";
import Admin from "../../admins/admin.model.js";

const adminAuthService = createAuthService({
  AuthModel: AdminAuth,
  EntityModel: Admin,
  entityIdField: "adminId",
  entityType: "admin",
});

export default adminAuthService;
