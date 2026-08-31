const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid provider ID"
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: err.message
    });
  }

  res.status(500).json({
    message: "Internal server error"
  });
};

module.exports = errorHandler;