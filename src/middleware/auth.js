const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const token = req.headers.cookie?.split("=")[1];
  if (!token) {
    return res.status(401).json({
      message: "Invalid Token",
    });
  }
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  // set User id
  req.user_id = payload.user.id;
  req.current_user = payload.user;
  next();
};

exports.refreshToken = (req, res, next) => {
  const prevToken = req.headers.cookie?.split("=")[1];
  if (!prevToken) {
    return res.status(401).json({
      message: "Invalid Token",
    });
  }

  const payload = jwt.verify(prevToken, process.env.JWT_SECRET);

  // clear cookie
  res.clearCookie("x-auth-token");
  req.cookies["x-auth-token"] = "";

  const token = jwt.sign({ user: payload.user }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.cookie("x-auth-token", token, {
    maxAge: 1000 * 60 * 60,
    httpOnly: true,
  });

  next();
};
