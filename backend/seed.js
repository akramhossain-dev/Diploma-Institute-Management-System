/**
 * seed.js — Bootstrap script to create the first super admin.
 *
 * Run once after deployment:
 *   node seed.js
 *
 * This creates:
 *   - admins document (profile)
 *   - admin_auth document (credentials)
 *
 * Credentials are printed to console — change password immediately after first login.
 */

import "dotenv/config";
import mongoose from "mongoose";
import env from "./src/config/env.js";
import Admin from "./src/modules/admins/admin.model.js";
import AdminAuth from "./src/modules/auth/admin/adminAuth.model.js";
import { hashPassword } from "./src/utils/hashHelper.js";

const SEED_EMAIL    = process.env.SEED_ADMIN_EMAIL || "admin@gmail.com";
const SEED_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "admin@gmail.com";
const SEED_NAME = process.env.SEED_ADMIN_NAME || "Super Admin";

const seed = async () => {
  await mongoose.connect(env.MONGO_URI);
  console.log("✅ Connected to MongoDB");

  // Check if super admin already exists
  const existing = await AdminAuth.findOne({ email: SEED_EMAIL });
  if (existing) {
    console.log(`⚠️  Admin with email ${SEED_EMAIL} already exists. Skipping seed.`);
    process.exit(0);
  }

  // Create admin profile
  const admin = await Admin.create({
    adminId:      "ADM-001",
    fullName:     SEED_NAME,
    email:        SEED_EMAIL,
    designation:  "Super Admin",
    isSuperAdmin: true,
    status:       "active",
  });

  // Create admin auth record
  const passwordHash = await hashPassword(SEED_PASSWORD);
  await AdminAuth.create({
    email:              SEED_EMAIL,
    passwordHash,
    adminId:            admin._id,
    isActive:           true,
    mustChangePassword: true,           // force password change on first login
  });

  console.log("\n── 🌱 Seed Complete ────────────────────────────────────");
  console.log(`   Email    : ${SEED_EMAIL}`);
  console.log(`   Password : ${SEED_PASSWORD}`);
  console.log(`   ⚠️  Change your password immediately after first login!`);
  console.log("────────────────────────────────────────────────────────\n");

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
