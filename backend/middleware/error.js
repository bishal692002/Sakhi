const errorHandler = (err, req, res, next) => {
  // Log to console for dev
  console.error(err.stack.red);

  res.status(500).json({
    success: false,
    error: 'Server Error'
  });
};

module.exports = errorHandler;
