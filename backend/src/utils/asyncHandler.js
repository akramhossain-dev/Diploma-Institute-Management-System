/**
 * asyncHandler — wraps async route handlers to eliminate try/catch boilerplate.
 * Automatically forwards errors to Express global error handler.
 *
 * Usage:
 *   router.get('/students', asyncHandler(studentController.getAll));
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
