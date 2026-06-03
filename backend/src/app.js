const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const { verifyToken, requireRole } = require("./middleware/auth");
const { analytics } = require("./controllers/userController");

const app = express();
app.use(cors());
app.use(express.json({ limit: "3mb" }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/api/health", (_, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/reviews", reviewRoutes);
app.get("/api/analytics", verifyToken, requireRole(["admin", "sub-admin"]), analytics);

app.use((err, _, res, __) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

module.exports = app;
