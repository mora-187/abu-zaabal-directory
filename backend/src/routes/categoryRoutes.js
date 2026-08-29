const express = require('express');
const { getGroups, getCategories } = require('../controllers/categoryController');

const router = express.Router();

router.get('/groups', getGroups);
router.get('/categories', getCategories);

module.exports = router;
