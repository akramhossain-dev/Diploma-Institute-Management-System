import { createAuthService } from "../shared/createAuthService.js";
import AccountantAuth from "./accountantAuth.model.js";
import Accountant from "../../accountants/accountant.model.js";

const accountantAuthService = createAuthService({
  AuthModel: AccountantAuth,
  EntityModel: Accountant,
  entityIdField: "accountantId",
  entityType: "accountant",
});

export default accountantAuthService;
