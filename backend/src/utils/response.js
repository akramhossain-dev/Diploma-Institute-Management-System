/**
 * Standard API Response builder.
 * All controllers must use these helpers — never send raw res.json().
 */

export const successResponse = (res, { statusCode = 200, message = "Success", data = null, pagination = null }) => {
  const payload = {
    success: true,
    message,
    data,
  };

  if (pagination) {
    payload.pagination = pagination;
  }

  return res.status(statusCode).json(payload);
};

export const errorResponse = (res, { statusCode = 500, message = "Something went wrong", errorCode = "INTERNAL_SERVER_ERROR", errors = [] }) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errorCode,
    errors,
  });
};

/**
 * Pagination helper — use in list endpoints.
 *
 * @param {number} page   - Current page (from req.query)
 * @param {number} limit  - Items per page (from req.query)
 * @param {number} total  - Total matching documents from DB
 */
export const buildPagination = (page, limit, total) => ({
  page: Number(page),
  limit: Number(limit),
  total,
  totalPages: Math.ceil(total / limit),
});
