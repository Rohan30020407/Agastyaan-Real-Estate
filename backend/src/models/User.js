const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "sub-admin", "user"], default: "user" },
    avatar: { type: String, default: "/uploads/default-avatar.png" },
    bio: { type: String, default: "" },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
