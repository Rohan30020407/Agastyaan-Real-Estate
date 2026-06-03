const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    type: { type: String, enum: ["rent", "sale"], required: true },
    images: [{ type: String }],
    description: { type: String, required: true },
    amenities: [{ type: String }],
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Property", PropertySchema);
