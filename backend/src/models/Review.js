const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// One review per user for each provider
reviewSchema.index(
  { user: 1, provider: 1 },
  { unique: true }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;