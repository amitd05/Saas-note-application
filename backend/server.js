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
app.use("/api/tenants", tenantRoutes);

// Routes
app.get("/health", (_, res) => res.json({ status: "ok" }));
app.use("/api", authRoutes);
app.use("/api/notes", noteRoutes);

mongoose.connect(process.env.MONGODB_URI).then(() => {
  app.listen(4000, () => console.log("Backend running on port 4000"));
});
