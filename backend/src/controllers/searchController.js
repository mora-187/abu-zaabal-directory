const Provider = require("../models/Provider.js");
const {normalizeArabic}= require('../utils/searchText.js')

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}


const searchProvider = async (req, res, next) => {
  try {
    const { search, group, category, page, limit } = req.query;

    // ---- Pagination params ----
    const _page = Math.max(parseInt(page, 10) || 1, 1);
    const _limit = Math.max(parseInt(limit, 10) || 15, 1);
    const skip = (_page - 1) * _limit;

    // ---- Build filter dynamically (skip undefined/empty params) ----
    const andConditions = [];

    if (search && search.trim()) {
      const normalizedSearch = normalizeArabic(search.trim());
      const safeSearch = escapeRegex(normalizedSearch);

      andConditions.push({
        searchText: { $regex: safeSearch, $options: "i" },
      });
    }

    if (group && group.trim()) {
      andConditions.push({ groups: group.trim() });
    }

    if (category && category.trim()) {
      andConditions.push({ categories: category.trim() });
    }

    // If nothing was provided, filter = {} (returns everything)
    // If filters were provided, combine them with AND
    // (e.g. search=coffee&group=food -> must match search AND be in that group)
    const filter = andConditions.length > 0 ? { $and: andConditions } : {};

    // ---- Query + count using the SAME filter ----
    const [results, totalDoc] = await Promise.all([
      Provider.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(_limit),
      Provider.countDocuments(filter),
    ]);

    const pages = Math.ceil(totalDoc / _limit);

    return res.status(200).json({
      results,
      total: totalDoc,
      page: _page,
      pages,
      limit: _limit,
    });
  } catch (err) {
    console.error("searchProvider error:", err);
    return res.status(500).json({ message: err.message });
  }
};

module.exports = searchProvider;