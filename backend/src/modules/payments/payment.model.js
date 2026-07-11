import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

/**
 * Payment — an auditable financial transaction record.
 *
 * paymentItems[] allows one payment to cover multiple fee assignments.
 * The service ensures:
 *   sum(paymentItems[].amountApplied) === totalAmount
 *   Each amountApplied ≤ remaining balance on that fee assignment
 *
 * paymentStatus:
 *   completed  → money collected, fee assignments updated
 *   reversed   → payment rolled back, fee assignments restored
 *   refunded   → money returned (future; same as reversed but accountant-initiated)
 *   cancelled  → created but never applied
 */
const paymentItemSchema = new mongoose.Schema(
  {
    studentFeeAssignmentId: {
      type:     ObjectId,
      ref:      "StudentFeeAssignment",
      required: [true, "Fee assignment reference is required"],
    },
    amountApplied: {
      type:     Number,
      required: [true, "Amount applied is required"],
      min:      [0.01, "amountApplied must be greater than 0"],
    },
  },
  { _id: false }
);

const paymentSchema = new mongoose.Schema(
  {
    studentId: { type: ObjectId, ref: "Student", required: [true, "Student is required"] },

    collectedByAccountantId: { type: ObjectId, ref: "Accountant", default: null },
    collectedByAdminId:      { type: ObjectId, ref: "Admin",      default: null },

    paymentDate: { type: Date, required: [true, "Payment date is required"] },
    paymentMethod: {
      type: String,
      enum: ["cash", "bank_transfer", "mobile_banking", "card", "online", "cheque", "custom"],
      required: [true, "Payment method is required"],
    },
    transactionReference: { type: String, trim: true, default: null },

    totalAmount: { type: Number, required: [true, "Total amount is required"], min: 0.01 },
    currency:    { type: String, default: "BDT" },

    paymentItems: {
      type:     [paymentItemSchema],
      required: [true],
      validate: {
        validator: (arr) => arr.length > 0,
        message:   "At least one payment item is required",
      },
    },

    paymentStatus: {
      type:    String,
      enum:    ["completed", "reversed", "refunded", "cancelled"],
      default: "completed",
    },

    reversedAt:    { type: Date,   default: null },
    reversalReason: { type: String, trim: true, default: null },
    reversedByAdminId: { type: ObjectId, ref: "Admin", default: null },

    remarks: { type: String, trim: true, default: null },
  },
  { timestamps: true }
);

paymentSchema.index({ studentId:            1 });
paymentSchema.index({ collectedByAccountantId: 1 });
paymentSchema.index({ paymentDate:          -1 });
paymentSchema.index({ paymentStatus:        1 });
paymentSchema.index({ paymentMethod:        1 });
paymentSchema.index({ studentId:            1, paymentDate: -1 });
paymentSchema.index({ transactionReference: 1 }, { sparse: true });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
