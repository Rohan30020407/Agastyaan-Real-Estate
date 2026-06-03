const router = require("express").Router();
const { verifyToken, requireRole } = require("../middleware/auth");
const { createReview, listReviews, updateReview, updateReviewStatus, deleteReview } = require("../controllers/reviewController");

router.get("/", listReviews);
router.post("/", createReview);
router.put("/:id/status", verifyToken, requireRole(["admin", "sub-admin"]), updateReviewStatus);
router.put("/:id", verifyToken, requireRole(["admin", "sub-admin"]), updateReview);
router.delete("/:id", verifyToken, requireRole(["admin", "sub-admin"]), deleteReview);

module.exports = router;
