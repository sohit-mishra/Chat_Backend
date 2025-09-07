const jwt = require("jsonwebtoken");
const env = require("../config/env");

const auth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired token." });
  }
};

module.exports = auth;