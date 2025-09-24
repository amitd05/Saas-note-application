const express = require("express");
const Note = require("../models/Note");
const auth = require("../middleware/auth");
const Tenant = require("../models/Tenant");
const router = express.Router();

router.use(auth);

// Create note
router.post("/", async (req, res) => {
  const tenant = await Tenant.findById(req.user.tenantId);
  const noteCount = await Note.countDocuments({ tenantId: req.user.tenantId });

  if (tenant.plan === "free" && noteCount >= 3) {
    return res.status(403).json({ error: "Note limit reached. Upgrade to Pro." });
  }

  const note = await Note.create({
    title: req.body.title,
    content: req.body.content,
    tenantId: req.user.tenantId,
    createdBy: req.user.userId
  });
  res.json(note);
});

// Get all notes for tenant
router.get("/", async (req, res) => {
  const notes = await Note.find({ tenantId: req.user.tenantId });
  res.json(notes);
});

// Get one note
router.get("/:id", async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, tenantId: req.user.tenantId });
  if (!note) return res.status(404).json({ error: "Not found" });
  res.json(note);
});

// Update
router.put("/:id", async (req, res) => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, tenantId: req.user.tenantId },
    req.body,
    { new: true }
  );
  res.json(note);
});

// Delete
router.delete("/:id", async (req, res) => {
  await Note.deleteOne({ _id: req.params.id, tenantId: req.user.tenantId });
  res.json({ success: true });
});

module.exports = router;
