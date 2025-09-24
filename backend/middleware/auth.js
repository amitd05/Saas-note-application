
const jwt = require("jsonwebtoken");
const User = require("../models/User");


module.exports = async function (req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).populate("tenantId");
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};
