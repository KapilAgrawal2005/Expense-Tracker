const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_SECRET;

const isAuthenticated = (req, res, next) => {
  let token;


  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

module.exports = isAuthenticated;