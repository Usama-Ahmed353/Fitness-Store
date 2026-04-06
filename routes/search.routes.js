const express = require('express');
const { query } = require('express-validator');
const { search, advancedSearch } = require('../controllers/search.controller');

const router = express.Router();

// Basic search
router.get(
  '/',
  query().custom((_, { req }) => {
    const value = (req.query.q || req.query.query || '').toString().trim();
    if (!value) {
      throw new Error('Search query is required');
    }
    return true;
  }),
  search
);

// Advanced search with filters
router.get(
  '/advanced',
  query('type').isIn(['gym', 'class', 'trainer']).withMessage('Invalid search type'),
  advancedSearch
);

module.exports = router;
