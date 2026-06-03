const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function sign(user) {
  return jwt.sign(
    { id: user._id.toString(), email: user.email, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email: String(email || "").toLowerCase(), active: true });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });
  return res.json({
    token: sign(user),
    user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar }
  });
}

function logout(_, res) {
  return res.json({ message: "Logout successful (client should clear token)" });
}

module.exports = { login, logout };
