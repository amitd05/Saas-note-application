const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Tenant = require("../models/Tenant");

const router = express.Router();
router.post("/signup", async (req, res) => {
  try {
    const { tenantName, email, password } = req.body;
const existingTenant = await Tenant.findOne({ slug: tenantName.toLowerCase().replace(/\s+/g, '-') });
    if (existingTenant) {
      return res.status(400).json({ error: "Tenant already exists. Please login." });
    }
    const tenant = await Tenant.create({ name: tenantName,slug: tenantName.toLowerCase().replace(/\s+/g, '-') , plan: "free" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      tenantId: tenant._id,
      email,
      passwordHash,
      role: "admin"
    });

    const token = jwt.sign(
      { userId: user._id, tenantId: user.tenantId._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, tenantId: tenant._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).populate("tenantId");
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { userId: user._id, tenantId: user.tenantId._id, role: user.role },
    process.env.JWT_SECRET
  );

  res.json({ token, tenant: user.tenantId.slug, role: user.role ,plan:user.tenantId.plan});
});

module.exports = router;
