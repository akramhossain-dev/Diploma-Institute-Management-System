/**
 * Pagination utility — used across all list endpoints.
 */

/**
 * Extract and normalize page/limit from query string.
 * Caps limit at 100, defaults to page=1 limit=20.
 */
export const getPaginationParams = (query = {}) => {
  const page  = Math.max(1, parseInt(query.page,  10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 20));
  const skip  = (page - 1) * limit;
  return { page, limit, skip };
};

/**
 * Build the pagination metadata block for API responses.
 */
export const buildPaginationMeta = (total, page, limit) => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit) || 1,
  hasNext:    page < Math.ceil(total / limit),
  hasPrev:    page > 1,
});
