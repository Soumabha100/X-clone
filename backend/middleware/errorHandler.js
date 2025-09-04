const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log the error for debugging

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    message: message,
  });
};

export default errorHandler;
