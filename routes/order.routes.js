const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { verifyToken } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

// User routes
router.use(verifyToken);

router.post('/', orderController.createOrder);
router.get('/', orderController.getMyOrders);

// Admin routes (must come before /:id)
router.get('/admin/all', authorize('admin', 'super_admin'), orderController.getAllOrders);
router.get('/admin/analytics', authorize('admin', 'super_admin'), orderController.getOrderAnalytics);
router.patch('/admin/:id/status', authorize('admin', 'super_admin'), orderController.updateOrderStatus);

router.get('/:id', orderController.getOrder);
router.patch('/:id/confirm-payment', orderController.confirmPayment);
router.patch('/:id/cancel', orderController.cancelOrder);

module.exports = router;
