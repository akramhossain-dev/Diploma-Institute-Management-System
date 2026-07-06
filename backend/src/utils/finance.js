/**
 * Finance Utility — Phase 8
 *
 * Centralized finance calculation helpers.
 * All money values are in the smallest unit (2 decimal places, rounded).
 *
 * Future-readiness:
 *   - currency support can be plugged into InstituteSettings (Phase 5)
 *   - fine/late-fee policy can be made configurable
 */

/**
 * Compute the final payable amount after discounts, waivers, and fines.
 * Result is never negative (waiver cannot exceed amountDue + fines).
 *
 * @param {number} amountDue
 * @param {number} discountAmount  e.g. merit discount
 * @param {number} waiverAmount    e.g. need-based or admin waiver
 * @param {number} fineAmount      e.g. late fee
 * @returns {number} finalAmount (≥ 0)
 */
export function computeFinalAmount(amountDue = 0, discountAmount = 0, waiverAmount = 0, fineAmount = 0) {
  const raw = amountDue - discountAmount - waiverAmount + fineAmount;
  return Math.max(0, Math.round(raw * 100) / 100);
}

/**
 * Determine billing status from amounts.
 *
 * @param {number} finalAmount   Final payable amount
 * @param {number} amountPaid    Amount collected so far
 * @returns {'unpaid'|'partial'|'paid'}
 */
export function computeBillingStatus(finalAmount, amountPaid) {
  if (finalAmount <= 0)         return "paid";      // waived to zero
  if (amountPaid <= 0)          return "unpaid";
  if (amountPaid >= finalAmount) return "paid";
  return "partial";
}

/**
 * Compute remaining balance on a fee assignment.
 * @param {number} finalAmount
 * @param {number} amountPaid
 * @returns {number}
 */
export function computeAmountRemaining(finalAmount, amountPaid) {
  return Math.max(0, Math.round((finalAmount - amountPaid) * 100) / 100);
}

/**
 * Validate that a payment item breakdown sums to the declared total.
 * @param {number} totalAmount
 * @param {Array<{amountApplied: number}>} items
 * @param {number} tolerance   floating point tolerance (default 0.01)
 * @returns {boolean}
 */
export function isPaymentBreakdownValid(totalAmount, items, tolerance = 0.01) {
  const itemsSum = items.reduce((s, i) => s + i.amountApplied, 0);
  return Math.abs(itemsSum - totalAmount) <= tolerance;
}
