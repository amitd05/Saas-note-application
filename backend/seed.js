const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");
const Tenant = require("./models/Tenant");

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await User.deleteMany();
  await Tenant.deleteMany();

  const acme = await Tenant.create({ name: "Acme", slug: "acme", plan: "free" });
  const globex = await Tenant.create({ name: "Globex", slug: "globex", plan: "free" });

  const passwordHash = await bcrypt.hash("password", 10);

  await User.create([
    { email: "admin@acme.test", passwordHash, role: "admin", tenantId: acme._id },
    { email: "user@acme.test", passwordHash, role: "member", tenantId: acme._id },
    { email: "admin@globex.test", passwordHash, role: "admin", tenantId: globex._id },
    { email: "user@globex.test", passwordHash, role: "member", tenantId: globex._id }
  ]);

  console.log("Seed complete");
  process.exit();
}

seed();
