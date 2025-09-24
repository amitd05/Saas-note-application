const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const noteRoutes = require("./routes/notes");
const tenantRoutes = require("./routes/tenants");

const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB (serverless-friendly)
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Connect DB immediately
dbConnect().then(() => console.log("MongoDB connected"));

// Health check
app.get("/api/health", (_, res) => res.json({ status: "ok" }));

// API routes
app.use("/api", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/tenants", tenantRoutes);

module.exports = app;
