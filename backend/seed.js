/**
 * seed.js — Bootstrap script
 *
 * Creates super admin credentials and MRIST institute data.
 *
 * Run once after initial deployment:
 *   node seed.js
 *
 * Required .env variables:
 *   SEED_ADMIN_EMAIL      — super admin email address
 *   SEED_ADMIN_PASSWORD   — super admin password
 *   SEED_ADMIN_NAME       — super admin display name (optional, default: "Super Admin")
 */

import "dotenv/config";
import mongoose from "mongoose";
import env from "./src/config/env.js";
import Admin from "./src/modules/admins/admin.model.js";
import AdminAuth from "./src/modules/auth/admin/adminAuth.model.js";
import InstituteSettings from "./src/modules/institute/institute.model.js";
import Department from "./src/modules/departments/department.model.js";
import { hashPassword } from "./src/utils/hashHelper.js";

// ── Read credentials strictly from .env — NO fallbacks ────────────────────
const SEED_EMAIL    = process.env.SEED_ADMIN_EMAIL;
const SEED_PASSWORD = process.env.SEED_ADMIN_PASSWORD;
const SEED_NAME     = process.env.SEED_ADMIN_NAME || "Super Admin";

if (!SEED_EMAIL || !SEED_PASSWORD) {
  console.error("\n❌ Missing required .env variables:");
  if (!SEED_EMAIL)    console.error("   → SEED_ADMIN_EMAIL is not set");
  if (!SEED_PASSWORD) console.error("   → SEED_ADMIN_PASSWORD is not set");
  console.error("\n   Please set them in your .env file and try again.\n");
  process.exit(1);
}

// ── MRIST Institute Data ────────────────────────────────────────────────────
const MRIST_SETTINGS = {
  instituteName: "Dr. Mahbubur Rahman Mollah Institute of Science and Technology",
  shortName:     "MRIST",
  email:         "info@mrist.edu.bd",
  phone:         "+880 1234-567890",
  website:       "https://mrist.edu.bd",
  address: {
    street:   "64 No. Ward, Matuail, Demra Road",
    city:     "Jatrabari",
    district: "Dhaka",
    division: "Dhaka",
    postCode: "1362",
    country:  "Bangladesh",
  },
  established:   "2021",
  affiliation:   "Bangladesh Technical Education Board (BTEB)",
  admissionOpen: true,
  history:       "Dr. Mahbubur Rahman Mollah Institute of Science and Technology (MRIST) was established in 2021 with a visionary mission to provide world-class technical education to the youth of Bangladesh. Affiliated with BTEB under the Ministry of Education, MRIST has rapidly grown into one of the most recognized polytechnic institutes in Dhaka.",
  mission:       "To deliver high-quality technical education through modern curricula, experienced faculty, and state-of-the-art laboratory infrastructure — equipping students with real-world engineering competencies, professional values, and entrepreneurial vision.",
  vision:        "To be the leading polytechnic institute in Bangladesh that transforms aspiring students into skilled, innovative, and self-reliant engineers and entrepreneurs, contributing to national development.",
  defaultCurrency:    "BDT",
  timezone:           "Asia/Dhaka",
  studentIdPrefix:    "MRIST-STD",
  teacherIdPrefix:    "MRIST-TCH",
  accountantIdPrefix: "MRIST-ACC",
  feeReceiptPrefix:   "MRIST-REC",
  invoicePrefix:      "MRIST-INV",
  minAttendancePercent: 75,
  gradingScale:       "5.0",
};

// ── MRIST Departments ─────────────────────────────────────────────────────
const MRIST_DEPARTMENTS = [
  {
    name:        "Computer Science and Technology",
    code:        "CST",
    shortName:   "CST",
    description: "Programming, networking, databases, web & mobile application development. Prepares students for software companies and IT firms.",
    status:      "active",
  },
  {
    name:        "Electrical Technology",
    code:        "ET",
    shortName:   "ET",
    description: "AC/DC circuits, power systems, electrical machines, industrial wiring, and energy-efficient technologies.",
    status:      "active",
  },
  {
    name:        "Civil Technology",
    code:        "CT",
    shortName:   "CT",
    description: "Construction engineering, surveying, structural analysis, building materials, AutoCAD drawing, and project management.",
    status:      "active",
  },
  {
    name:        "Mechanical Technology",
    code:        "MT",
    shortName:   "MT",
    description: "Thermodynamics, fluid mechanics, machine tools, manufacturing processes, and industrial automation.",
    status:      "active",
  },
  {
    name:        "Automobile Technology",
    code:        "AT",
    shortName:   "AT",
    description: "Automotive engineering — engine systems, vehicle diagnostics, transmission, electrical systems, and hybrid/EV technologies.",
    status:      "active",
  },
];

// ── Main Seed Function ────────────────────────────────────────────────────
const seed = async () => {
  await mongoose.connect(env.MONGO_URI);
  console.log("✅ Connected to MongoDB");

  // ── 1. Super Admin ──────────────────────────────────────────────────────
  const existing = await AdminAuth.findOne({ email: SEED_EMAIL });
  if (existing) {
    console.log(`⚠️  Admin with email "${SEED_EMAIL}" already exists. Skipping admin creation.`);
  } else {
    const admin = await Admin.create({
      adminId:      "ADM-001",
      fullName:     SEED_NAME,
      email:        SEED_EMAIL,
      designation:  "Super Admin",
      isSuperAdmin: true,
      status:       "active",
    });

    const passwordHash = await hashPassword(SEED_PASSWORD);
    await AdminAuth.create({
      email:              SEED_EMAIL,
      passwordHash,
      adminId:            admin._id,
      isActive:           true,
      mustChangePassword: false,
    });

    console.log("✅ Super admin created.");
  }

  // Get super admin reference for department/institute creator tracking
  const superAdmin = await Admin.findOne({ isSuperAdmin: true });

  // ── 2. Institute Settings ───────────────────────────────────────────────
  const existingSettings = await InstituteSettings.findOne();
  if (existingSettings) {
    await InstituteSettings.updateOne({}, { ...MRIST_SETTINGS, updatedByAdminId: superAdmin._id });
    console.log("✅ Institute settings updated.");
  } else {
    await InstituteSettings.create({ ...MRIST_SETTINGS, updatedByAdminId: superAdmin._id });
    console.log("✅ Institute settings created.");
  }

  // ── 3. Departments ──────────────────────────────────────────────────────
  let created = 0, updated = 0;
  for (const dept of MRIST_DEPARTMENTS) {
    const exists = await Department.findOne({ code: dept.code });
    if (exists) {
      await Department.updateOne({ code: dept.code }, { ...dept });
      updated++;
    } else {
      await Department.create({ ...dept, createdByAdminId: superAdmin._id });
      created++;
    }
  }

  // ── Summary ─────────────────────────────────────────────────────────────
  console.log("\n── 🌱 Seed Complete ──────────────────────────────────────────");
  console.log(`   Super Admin Email : ${SEED_EMAIL}`);
  console.log(`   Departments       : ${created} created, ${updated} updated`);
  console.log(`   Institute         : MRIST settings applied`);
  console.log("──────────────────────────────────────────────────────────────\n");

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
