const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const productController = require('../controllers/product.controller');
const { verifyToken } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

// Public routes (must come before parameterized routes)
router.get('/categories', productController.getCategories);
router.get('/brands', productController.getBrands);
router.get('/autocomplete', productController.autocomplete);
router.get('/trending', productController.getTrending);
router.get('/featured', productController.getFeatured);
router.get('/recently-viewed', verifyToken, productController.getRecentlyViewed);

// Admin routes
router.get('/admin/all', verifyToken, authorize('admin', 'super_admin'), productController.getAdminProducts);

// Public product list & detail
router.get('/', productController.getProducts);
router.get('/:slug', productController.getProductBySlug);
router.get('/:slug/related', productController.getRelated);

// Admin CRUD
router.post(
  '/',
  verifyToken,
  authorize('admin', 'super_admin'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('category').notEmpty().withMessage('Category is required'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  ],
  productController.createProduct
);

router.patch(
  '/:id',
  verifyToken,
  authorize('admin', 'super_admin'),
  productController.updateProduct
);

router.delete(
  '/:id',
  verifyToken,
  authorize('admin', 'super_admin'),
  productController.deleteProduct
);

module.exports = router;
