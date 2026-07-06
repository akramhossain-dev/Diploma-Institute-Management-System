import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

// ── Slug generator helper ────────────────────────────────────────────────────
const toSlug = (text) =>
  text.toLowerCase().trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

/**
 * Notice — institute announcement / communication record.
 *
 * Publish status machine:
 *   draft → published → archived
 *   draft → archived  (skipping publish — admin decision)
 *
 * Target audience controls who can see this notice when listed:
 *   - 'all'         → everyone
 *   - 'students'    → students only
 *   - 'teachers'    → teachers only
 *   - 'accountants' → accountants only
 *   - 'admins'      → admins only
 *   - combinations: ['students', 'teachers']
 *
 * Optional departmentIds / semesterIds narrow the audience further.
 */
const noticeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Notice title is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Notice content is required"],
      trim: true,
    },
    summary: {
      type: String, trim: true, default: null,
    },

    // ── Categorization ────────────────────────────────────────────────────
    noticeType: {
      type: String,
      enum: ["general", "academic", "exam", "finance", "urgent", "holiday", "other"],
      default: "general",
    },
    priority: {
      type: String,
      enum: ["normal", "high", "urgent"],
      default: "normal",
    },

    // ── Audience targeting ────────────────────────────────────────────────
    targetAudience: {
      type: [String],
      enum:    ["all", "students", "teachers", "accountants", "admins"],
      default: ["all"],
      validate: {
        validator: (arr) => arr.length > 0,
        message:   "At least one target audience must be specified",
      },
    },
    targetDepartmentIds:      [{ type: ObjectId, ref: "Department" }],
    targetSemesterIds:        [{ type: ObjectId, ref: "Semester"   }],
    targetAcademicSessionIds: [{ type: ObjectId, ref: "AcademicSession" }],

    // ── Publish lifecycle ─────────────────────────────────────────────────
    publishStatus: {
      type: String,
      enum:    ["draft", "published", "archived"],
      default: "draft",
    },
    publishedAt: { type: Date, default: null },
    expiresAt:   { type: Date, default: null },

    // ── Attachment metadata (file uploads handled in Phase 6) ─────────────
    attachments: [
      {
        fileName:    { type: String, trim: true },
        url:         { type: String, trim: true },
        mimeType:    { type: String, trim: true },
        _id: false,
      },
    ],

    // ── Authorship ────────────────────────────────────────────────────────
    createdByAdminId: {
      type: ObjectId, ref: "Admin",
      required: [true, "Creator admin is required"],
    },
    lastEditedByAdminId: {
      type: ObjectId, ref: "Admin", default: null,
    },
  },
  { timestamps: true }
);

// Auto-generate slug from title before save
noticeSchema.pre("save", function (next) {
  if (this.isNew || this.isModified("title")) {
    const base = toSlug(this.title);
    // Append short timestamp suffix to ensure uniqueness
    this.slug = `${base}-${Date.now().toString(36)}`;
  }
  next();
});

noticeSchema.index({ slug:           1 }, { unique: true });
noticeSchema.index({ publishStatus:  1 });
noticeSchema.index({ noticeType:     1 });
noticeSchema.index({ targetAudience: 1 });
noticeSchema.index({ publishedAt:    -1 });
noticeSchema.index({ expiresAt:      1 }, { sparse: true });

const Notice = mongoose.model("Notice", noticeSchema);
export default Notice;
