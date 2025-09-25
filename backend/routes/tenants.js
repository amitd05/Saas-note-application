const express = require("express");
const Tenant = require("../models/Tenant");
const auth = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/User");
router.use(auth);
router.post("/:slug/invite", async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Only admins can invite users" });
  }

  const tenant = await Tenant.findOne({ slug: req.params.slug });
  
  if (!tenant) return res.status(404).json({ error: "Tenant not found" });

  const { email, role } = req.body;
  if (!email || !role) return res.status(400).json({ error: "Missing fields" });
   const existingUser = await User.findOne({ email, tenantId: req.user.tenantId });
    if (existingUser) return res.status(400).json({ error: "User already exists in this tenant" });
const passwordHash = await bcrypt.hash("password", 10);
  // Create user with default password (or send invite email)
  const newUser = await User.create({
    email,
    passwordHash, // or generate and send temp password
    role,
    tenantId: tenant._id,
  });

  res.json({ success: true, user: { email: newUser.email, role: newUser.role } });
});
// Upgrade plan (Admin only)
router.post("/:slug/upgrade", async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Only admins can upgrade" });
  }

  const tenant = await Tenant.findOne({ slug: req.params.slug });
  if (!tenant) return res.status(404).json({ error: "Tenant not found" });

  tenant.plan = "pro";
  await tenant.save();

  res.json({ success: true, plan: tenant.plan });
});

module.exports = router;
