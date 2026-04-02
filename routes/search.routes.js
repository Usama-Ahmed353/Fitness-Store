const express = require('express');
const { query } = require('express-validator');
const { search, advancedSearch } = require('../controllers/search.controller');

const router = express.Router();

// Basic search
router.get('/', query('q').notEmpty().withMessage('Search query is required'), search);

// Advanced search with filters
router.get(
  '/advanced',
  query('type').isIn(['gym', 'class', 'trainer']).withMessage('Invalid search type'),
  advancedSearch
);

module.exports = router;
