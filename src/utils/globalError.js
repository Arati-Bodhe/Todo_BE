import { ApiError } from "./ApiError.js";

const errorHandler = (err, req, res, next) => {
  console.error(err); // Log the error for debugging

  // If the error is an instance of ApiError, send a structured response
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      data: err.data || null,
    });
  }

  // If the error is not an ApiError, it's an unexpected error
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
    data: null,
  });
};

export { errorHandler };
