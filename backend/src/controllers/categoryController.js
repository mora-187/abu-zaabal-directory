const mongoose = require('mongoose');

function getProvidersCollection() {
  if (mongoose.connection.readyState !== 1) {
    throw new Error('Database connection is not ready');
  }

  return mongoose.connection.collection('providers');
}

async function getGroups(req, res, next) {
  try {
    const providers = getProvidersCollection();
    const groups = await providers.distinct('groups', { isActive: { $ne: false } });

    groups.sort((a, b) => a.localeCompare(b, 'ar'));

    return res.status(200).json({
      results: groups,
      total: groups.length
    });
  } catch (error) {
    return next(error);
  }
}

async function getCategories(req, res, next) {
  try {
    const providers = getProvidersCollection();
    const group = typeof req.query.group === 'string' ? req.query.group.trim() : '';

    const filter = { isActive: { $ne: false } };

    if (group) {
      filter.groups = group;
    }

    const categories = await providers.distinct('categories', filter);
    categories.sort((a, b) => a.localeCompare(b, 'ar'));

    return res.status(200).json({
      group: group || null,
      results: categories,
      total: categories.length
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = { getGroups, getCategories };
