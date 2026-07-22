/**
 * Global Express Error Handling Middleware for Riyad Store API
 */

const { errorResponse } = require('../utils/responseHandler');

const errorHandler = (err, req, res, next) => {
  console.error('❌ API Error:', err.stack || err);

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  const message = err.message || 'An unexpected server error occurred.';

  return errorResponse(res, statusCode, message, process.env.NODE_ENV === 'development' ? err.stack : null);
};

const notFoundHandler = (req, res, next) => {
  return errorResponse(res, 404, `Route not found: ${req.method} ${req.originalUrl}`);
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
