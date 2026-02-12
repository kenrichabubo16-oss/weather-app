const ApiResponse = require('../utils/responses');

// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Global error handler middleware
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Log error for debugging
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return ApiResponse.badRequest(res, `${field} already exists`);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message,
    }));
    return ApiResponse.badRequest(res, 'Validation failed', errors);
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return ApiResponse.badRequest(res, 'Invalid ID format');
  }

  // Default error response
  return ApiResponse.error(res, err.message, err.statusCode);
};

// 404 handler
const notFound = (req, res) => {
  ApiResponse.notFound(res, `Route ${req.originalUrl} not found`);
};

module.exports = { errorHandler, notFound, AppError };
