const User = require("../models/User");
const Provider = require("../models/Provider");
const getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "favorites",
      select: "name groups categories description area isActive aliases",
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      favorites: user.favorites,
    });
  } catch (error) {
    next(error);
  }
};
const addFavorite = async (req, res, next) => {
  try {
    const { providerId } = req.params;

    const provider = await Provider.findById(providerId).select("_id");

    if (!provider) {
      return res.status(404).json({
        message: "Provider not found",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: {
          favorites: provider._id,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate({
      path: "favorites",
      select: "name groups categories description area isActive aliases",
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Favorite saved successfully",
      favorites: user.favorites,
    });
  } catch (error) {
    next(error);
  }
};


const removeFavorite = async (req, res, next) => {
  try {
    const { providerId } = req.params;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: {
          favorites: providerId,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate({
      path: "favorites",
      select: "name groups categories description area isActive aliases",
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "Favorite removed successfully",
      favorites: user.favorites,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFavorites,
  addFavorite,
  removeFavorite,
};