const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phones: {
      type: [String],
      default: [],
    },

    groups: {
      type: [String],
      default: [],
    },

    categories: {
      type: [String],
      default: [],
    },

    description: {
      type: String,
      default: "",
    },

    area: {
      type: String,
      default: "أبو زعبل",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    aliases: {
      type: [String],
      default: [],
    },

    searchText: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Provider = mongoose.model("Provider", providerSchema);

module.exports = Provider;
