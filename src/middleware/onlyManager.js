module.exports = (req, res, next) => {
  if (req.current_user.role !== "manager") {
    return res.status(401).json({
      message: `Role Permission Restriction`,
      error: "Higher Level Role Required!",
    });
  }
  next();
};
