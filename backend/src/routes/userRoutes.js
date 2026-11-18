const express = require("express");

const {
  getFavorites,
  addFavorite,
  removeFavorite,
} = require("../controllers/userController");

const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/me/favorites", protect, getFavorites);
router.post("/me/favorites/:providerId", protect, addFavorite);
router.delete("/me/favorites/:providerId", protect, removeFavorite);

module.exports = router;