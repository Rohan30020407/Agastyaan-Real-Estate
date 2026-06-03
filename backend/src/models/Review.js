const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "spam"],
      default: "pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", ReviewSchema);
