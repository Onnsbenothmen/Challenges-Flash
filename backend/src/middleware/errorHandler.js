function errorHandler(err, req, res, next) {
  console.error('Erreur:', err.message);
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.statusCode ? err.message : 'Erreur interne du serveur';

  res.status(statusCode).json({
    error: {
      message,
      status: statusCode,
    },
  });
}

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = { errorHandler, AppError };
