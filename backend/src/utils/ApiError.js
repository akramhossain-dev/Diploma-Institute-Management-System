
class ApiError extends Error {
  constructor(statusCode, message, errorCode = "APP_ERROR", errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.errors = errors;
    this.isOperational = true; 

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
