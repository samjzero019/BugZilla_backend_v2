module.exports = (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "*");
  next();
};
