const mongoose = require("mongoose");

const TenantSchema = new mongoose.Schema({
  name: {type:String,unique:true},
  slug: { type: String, unique: true },
  plan: { type: String, enum: ["free", "pro"], default: "free" }
});

module.exports = mongoose.model("Tenant", TenantSchema);
