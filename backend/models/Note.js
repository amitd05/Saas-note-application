const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
  title: String,
  content: String,
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("Note", NoteSchema);
