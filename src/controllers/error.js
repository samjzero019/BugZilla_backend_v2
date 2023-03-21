exports.NotFound = (req, res, next) => {
  res.status(404).json({
    message: "Something Went Wrong!",
    error: "No Matching Route Found!",
  });
};
