const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(403).json({ message: "No token provided" });
    return;
  }
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    res
      .status(401)
      .json({ message: "Token missing or not formatted properly." });
    return;
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_KEY);
    req.payload = payload;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = isAuthenticated;
