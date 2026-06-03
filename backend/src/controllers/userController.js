const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Property = require("../models/Property");
const Review = require("../models/Review");

async function me(req, res) {
  const user = await User.findById(req.user.id).select("-passwordHash");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
}

async function updateProfile(req, res) {
  const { name, email, bio } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, email: String(email).toLowerCase(), bio },
    { new: true }
  ).select("-passwordHash");
  res.json(user);
}

async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  const ok = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!ok) return res.status(400).json({ message: "Current password is incorrect" });
  user.passwordHash = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ message: "Password changed successfully" });
}

async function uploadAvatar(req, res) {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { avatar: `/uploads/${req.file.filename}` },
    { new: true }
  ).select("-passwordHash");
  res.json({ message: "Avatar uploaded", user });
}

async function listUsers(req, res) {
  const { q = "", role = "", page = 1, limit = 8 } = req.query;
  const filter = {};
  if (q) filter.$or = [{ name: { $regex: q, $options: "i" } }, { email: { $regex: q, $options: "i" } }];
  if (role) filter.role = role;
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    User.find(filter).select("-passwordHash").skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
    User.countDocuments(filter)
  ]);
  res.json({ items, total, page: Number(page), limit: Number(limit) });
}

async function createUser(req, res) {
  const { name, email, role, password } = req.body;
  const existing = await User.findOne({ email: String(email).toLowerCase() });
  if (existing) return res.status(400).json({ message: "Email already exists" });
  await User.create({
    name,
    email: String(email).toLowerCase(),
    role,
    passwordHash: await bcrypt.hash(password, 10)
  });
  res.status(201).json({ message: "User created" });
}

async function updateUser(req, res) {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-passwordHash");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
}

async function deleteUser(req, res) {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ message: "User deleted" });
}

async function analytics(_, res) {
  const [totalUsers, totalProperties, totalReviews, approvedReviews] = await Promise.all([
    User.countDocuments(),
    Property.countDocuments({ status: "active" }),
    Review.countDocuments(),
    Review.countDocuments({ status: "approved" })
  ]);
  res.json({
    cards: {
      totalUsers,
      totalProperties,
      totalReviews,
      approvedRate: totalReviews ? `${Math.round((approvedReviews / totalReviews) * 100)}%` : "0%"
    }
  });
}

module.exports = {
  me,
  updateProfile,
  changePassword,
  uploadAvatar,
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  analytics
};
