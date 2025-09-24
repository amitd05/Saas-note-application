const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, enum: ["admin", "member"] },
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant" }
});

module.exports = mongoose.model("User", UserSchema);
