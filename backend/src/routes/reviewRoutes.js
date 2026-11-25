const express = require("express");

const {
  getProviderReviews,
  createReview,
  deleteReview,
} = require("../controllers/reviewController");

const { protect } = require("../middleware/auth");

const router = express.Router();

// Get provider reviews (Public)
router.get("/providers/:id/reviews", getProviderReviews);

// Add review (Protected)
router.post("/providers/:id/reviews", protect, createReview);

// Delete review (Protected)
router.delete("/reviews/:id", protect, deleteReview);

module.exports = router;