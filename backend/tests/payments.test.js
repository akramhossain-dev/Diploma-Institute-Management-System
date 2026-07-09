import { test } from "node:test";
import assert from "node:assert";
import {
  computeFinalAmount,
  computeBillingStatus,
  computeAmountRemaining,
  isPaymentBreakdownValid,
} from "../src/utils/finance.js";

test("Finance Utility — Final Amount Calculations", async (t) => {
  await t.test("should compute standard final amount with discount and waiver", () => {
    // 1000 base - 100 discount - 50 waiver + 20 fine = 870
    const finalVal = computeFinalAmount(1000, 100, 50, 20);
    assert.strictEqual(finalVal, 870);
  });

  await t.test("should round final amount to two decimal places", () => {
    // 100.123 -> 100.12
    const finalVal = computeFinalAmount(100.123, 0, 0, 0);
    assert.strictEqual(finalVal, 100.12);
  });

  await t.test("should return zero when discounts/waivers exceed base amount", () => {
    // 100 - 200 discount = -100 -> clamped to 0
    const finalVal = computeFinalAmount(100, 200, 50, 0);
    assert.strictEqual(finalVal, 0);
  });
});

test("Finance Utility — Billing Status Calculations", async (t) => {
  await t.test("should mark as paid if final amount is 0", () => {
    assert.strictEqual(computeBillingStatus(0, 0), "paid");
    assert.strictEqual(computeBillingStatus(-10, 0), "paid");
  });

  await t.test("should mark as unpaid if amount paid is 0", () => {
    assert.strictEqual(computeBillingStatus(100, 0), "unpaid");
    assert.strictEqual(computeBillingStatus(100, -10), "unpaid");
  });

  await t.test("should mark as paid if amount paid equals or exceeds final amount", () => {
    assert.strictEqual(computeBillingStatus(100, 100), "paid");
    assert.strictEqual(computeBillingStatus(100, 120), "paid");
  });

  await t.test("should mark as partial if amount paid is positive but less than final amount", () => {
    assert.strictEqual(computeBillingStatus(100, 50), "partial");
  });
});

test("Finance Utility — Remaining Balance Calculations", async (t) => {
  await t.test("should compute standard remaining balance", () => {
    assert.strictEqual(computeAmountRemaining(100, 30), 70);
    assert.strictEqual(computeAmountRemaining(100.55, 30.22), 70.33);
  });

  await t.test("should return 0 when amount paid exceeds final amount", () => {
    assert.strictEqual(computeAmountRemaining(100, 150), 0);
  });
});

test("Finance Utility — Payment Breakdown Validation", async (t) => {
  await t.test("should validate true when breakdown sums match totalAmount", () => {
    const items = [
      { amountApplied: 50 },
      { amountApplied: 30 },
      { amountApplied: 20 },
    ];
    assert.strictEqual(isPaymentBreakdownValid(100, items), true);
  });

  await t.test("should validate false when sums do not match", () => {
    const items = [
      { amountApplied: 50 },
      { amountApplied: 30 },
    ];
    assert.strictEqual(isPaymentBreakdownValid(100, items), false);
  });

  await t.test("should account for floating-point tolerance", () => {
    const items = [
      { amountApplied: 33.33 },
      { amountApplied: 33.33 },
      { amountApplied: 33.33 },
    ];
    assert.strictEqual(isPaymentBreakdownValid(100, items, 0.02), true);
    assert.strictEqual(isPaymentBreakdownValid(100, items, 0.001), false);
  });
});
