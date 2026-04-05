const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { verifyToken } = require('../middleware/auth');

// All cart routes require authentication
router.use(verifyToken);

router.get('/', cartController.getCart);
router.post('/items', cartController.addItem);
router.patch('/items/:productId', cartController.updateItem);
router.delete('/items/:productId', cartController.removeItem);
router.post('/coupon', cartController.applyCoupon);
router.delete('/coupon', cartController.removeCoupon);
router.delete('/', cartController.clearCart);

module.exports = router;
