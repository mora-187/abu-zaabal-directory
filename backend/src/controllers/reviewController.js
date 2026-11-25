const Review = require("../models/Review");
const Provider = require("../models/Provider");

// GET all reviews for a provider + average rating
const getProviderReviews = async (req, res, next) => {
  try {
    const { id } = req.params;

    const provider = await Provider.findById(id);

    if (!provider) {
      return res.status(404).json({
        message: "Provider not found",
      });
    }

    const reviews = await Review.find({ provider: id })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;

    const averageRating =
      totalReviews === 0
        ? 0
        : Number(
            (
              reviews.reduce((sum, review) => sum + review.rating, 0) /
              totalReviews
            ).toFixed(1)
          );

    return res.status(200).json({
      averageRating,
      totalReviews,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// POST a new review
const createReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body || {};

    if (
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return res.status(400).json({
        message: "Rating must be an integer between 1 and 5",
      });
    }

    if (comment !== undefined && typeof comment !== "string") {
      return res.status(400).json({
        message: "Comment must be a string",
      });
    }

    const provider = await Provider.findById(id);

    if (!provider) {
      return res.status(404).json({
        message: "Provider not found",
      });
    }

    const existingReview = await Review.findOne({
      provider: id,
      user: req.user._id,
    });

    if (existingReview) {
      return res.status(409).json({
        message: "You have already reviewed this provider",
      });
    }

    const review = await Review.create({
      provider: id,
      user: req.user._id,
      rating,
      comment: comment ? comment.trim() : "",
    });

    const populatedReview = await Review.findById(review._id)
      .populate("user", "name");

    return res.status(201).json({
      message: "Review added successfully",
      review: populatedReview,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "You have already reviewed this provider",
      });
    }

    next(error);
  }
};

// DELETE a review
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    const isOwner =
      review.user.toString() === req.user._id.toString();

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "Not authorized to delete this review",
      });
    }

    await review.deleteOne();

    return res.status(200).json({
      message: "Review deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProviderReviews,
  createReview,
  deleteReview,
};