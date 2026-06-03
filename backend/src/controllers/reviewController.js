const Review = require("../models/Review");

async function createReview(req, res) {
  const text = String(req.body.comment || "").toLowerCase();
  const suspicious = ["spam", "fake", "http://", "https://"].some((x) => text.includes(x));
  const review = await Review.create({
    customerName: req.body.customerName,
    rating: Number(req.body.rating),
    comment: req.body.comment,
    status: suspicious ? "spam" : "pending"
  });
  res.status(201).json(review);
}

async function listReviews(req, res) {
  const status = req.query.status;
  const filter = status ? { status } : {};
  const items = await Review.find(filter).sort({ createdAt: -1 });
  res.json(items);
}

async function updateReview(req, res) {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!review) return res.status(404).json({ message: "Review not found" });
  res.json(review);
}

async function updateReviewStatus(req, res) {
  const review = await Review.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!review) return res.status(404).json({ message: "Review not found" });
  res.json(review);
}

async function deleteReview(req, res) {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) return res.status(404).json({ message: "Review not found" });
  res.json({ message: "Review deleted" });
}

module.exports = { createReview, listReviews, updateReview, updateReviewStatus, deleteReview };
