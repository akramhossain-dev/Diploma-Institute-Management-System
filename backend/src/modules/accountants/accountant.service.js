import Accountant from "./accountant.model.js";
import AccountantAuth from "../auth/accountant/accountantAuth.model.js";
import { hashPassword } from "../../utils/hashHelper.js";
import { generateAccountantId } from "../../utils/generateEntityId.js";
import ApiError from "../../utils/ApiError.js";
import { getPaginationParams, buildPaginationMeta } from "../../utils/pagination.js";

const accountantService = {

  async createAccountant(data, adminId) {
    const { email, password, ...profileData } = data;

    // Email uniqueness in accountant_auth
    const emailTaken = await AccountantAuth.findOne({ email: email.toLowerCase() });
    if (emailTaken) throw new ApiError(409, `Accountant with email '${email}' already exists`, "DUPLICATE_ENTRY");

    const staffId = await generateAccountantId(Accountant);

    const accountant = await Accountant.create({
      ...profileData,
      email: email.toLowerCase(),
      staffId,
      createdByAdminId: adminId,
    });

    // Create accountant_auth
    const passwordHash = await hashPassword(password);
    const accountantAuth = await AccountantAuth.create({
      email:              email.toLowerCase(),
      passwordHash,
      accountantId:       accountant._id,
      isActive:           true,
      mustChangePassword: true,
    });

    // Link auth to profile
    await Accountant.findByIdAndUpdate(accountant._id, { linkedAuthId: accountantAuth._id });
    accountant.linkedAuthId = accountantAuth._id;

    return accountant;
  },

  async getAllAccountants(query) {
    const { page, limit, skip } = getPaginationParams(query);
    const { status, search } = query;

    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { fullName:    { $regex: search, $options: "i" } },
        { staffId:     { $regex: search, $options: "i" } },
        { email:       { $regex: search, $options: "i" } },
        { designation: { $regex: search, $options: "i" } },
      ];
    }

    const [accountants, total] = await Promise.all([
      Accountant.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip).limit(limit).lean(),
      Accountant.countDocuments(filter),
    ]);

    return { accountants, pagination: buildPaginationMeta(total, page, limit) };
  },

  async getAccountantById(id) {
    const accountant = await Accountant.findById(id).lean();
    if (!accountant) throw new ApiError(404, "Accountant not found", "NOT_FOUND");
    return accountant;
  },

  async getMyProfile(accountantId) {
    return this.getAccountantById(accountantId);
  },

  async updateAccountant(id, data) {
    const {
      email, password, staffId,
      linkedAuthId, createdByAdminId, status,
      ...allowedUpdates
    } = data;

    const accountant = await Accountant.findByIdAndUpdate(
      id,
      { $set: allowedUpdates },
      { new: true, runValidators: true }
    ).lean();

    if (!accountant) throw new ApiError(404, "Accountant not found", "NOT_FOUND");
    return accountant;
  },

  async updateStatus(id, status) {
    const accountant = await Accountant.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    ).lean();

    if (!accountant) throw new ApiError(404, "Accountant not found", "NOT_FOUND");

    await AccountantAuth.findOneAndUpdate(
      { accountantId: id },
      { isActive: status === "active" }
    );

    return accountant;
  },
};

export default accountantService;
