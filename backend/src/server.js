require("dotenv").config();
const bcrypt = require("bcryptjs");
const app = require("./app");
const { connectDb } = require("./config/db");
const User = require("./models/User");

const PORT = process.env.PORT || 4000;

async function seedAdmin() {
  const email = "admin@agastyaan.com";
  const existing = await User.findOne({ email });
  if (existing) return;
  await User.create({
    name: "Rohan Soni",
    email,
    role: "admin",
    bio: "Master User",
    passwordHash: await bcrypt.hash("admin123", 10)
  });
  console.log("Seed admin created: admin@agastyaan.com / admin123");
}

async function start() {
  await connectDb(process.env.MONGO_URI);
  await seedAdmin();
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
}

start().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
