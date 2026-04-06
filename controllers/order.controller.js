const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const stripe = require('stripe')(process.env.STRIPE_API_KEY || 'sk_test_placeholder');

// @desc    Create order from cart
// @route   POST /api/orders
exports.createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod = 'stripe' } = req.body;

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street) {
      return res.status(400).json({ success: false, message: 'Shipping address is required' });
    }

    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // Validate stock and build order items
    const orderItems = [];
    for (const item of cart.items) {
      if (!item.product || !item.product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product "${item.product?.title || 'Unknown'}" is no longer available`,
        });
      }
      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${item.product.title}"`,
        });
      }
      orderItems.push({
        product: item.product._id,
        title: item.product.title,
        price: item.price,
        quantity: item.quantity,
        image: item.product.images?.[0]?.url || '',
      });
    }

    const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shippingCost = subtotal >= 50 ? 0 : 5.99; // Free shipping over $50
    const tax = Math.round(subtotal * 0.08 * 100) / 100; // 8% tax
    const discount = cart.couponDiscount
      ? Math.round(subtotal * (cart.couponDiscount / 100) * 100) / 100
      : 0;
    const total = Math.round((subtotal + shippingCost + tax - discount) * 100) / 100;

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // cents
      currency: 'usd',
      metadata: { userId: req.user.id },
    });

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingCost,
      tax,
      discount,
      total,
      couponCode: cart.couponCode,
      stripePaymentIntentId: paymentIntent.id,
    });

    res.status(201).json({
      success: true,
      data: {
        order,
        clientSecret: paymentIntent.client_secret,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's orders
// @route   GET /api/orders
exports.getMyOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const filter = { user: req.user.id };
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter).sort('-createdAt').skip(skip).limit(Number(limit)).lean(),
      Order.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'slug images');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Users can only see their own orders; admins can see all
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Confirm order payment (after Stripe confirmation)
// @route   PATCH /api/orders/:id/confirm-payment
exports.confirmPayment = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (!order.stripePaymentIntentId) {
      return res.status(400).json({ success: false, message: 'Missing payment intent for this order' });
    }

    if (order.paymentStatus === 'paid') {
      return res.json({ success: true, data: order });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(order.stripePaymentIntentId);
    if (!paymentIntent || paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: 'Payment has not been completed successfully',
      });
    }

    // Validate stock right before committing the order.
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (!product || !product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product \"${item.title}\" is no longer available`,
        });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for \"${item.title}\"`,
        });
      }
    }

    for (const item of order.items) {
      await Product.updateOne({ _id: item.product }, { $inc: { stock: -item.quantity } });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (cart) {
      cart.items = [];
      cart.couponCode = null;
      cart.couponDiscount = 0;
      await cart.save();
    }

    order.paymentStatus = 'paid';
    order.stripeChargeId = paymentIntent.latest_charge || order.stripeChargeId;
    order.status = 'processing';
    order.statusHistory.push({ status: 'processing', note: 'Payment confirmed' });
    await order.save();

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PATCH /api/orders/:id/cancel
exports.cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (['delivered', 'shipped', 'canceled'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order in "${order.status}" status`,
      });
    }

    // Restore stock
    for (const item of order.items) {
      await Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } });
    }

    // Refund via Stripe if paid
    if (order.paymentStatus === 'paid' && order.stripePaymentIntentId) {
      await stripe.refunds.create({ payment_intent: order.stripePaymentIntentId });
      order.paymentStatus = 'refunded';
    }

    order.status = 'canceled';
    order.cancelReason = req.body.reason || 'Canceled by user';
    order.statusHistory.push({ status: 'canceled', note: order.cancelReason });
    await order.save();

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// ============= ADMIN ENDPOINTS =============

// @desc    Get all orders (admin)
// @route   GET /api/orders/admin/all
exports.getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'shippingAddress.fullName': { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('user', 'firstName lastName email')
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Order.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (admin)
// @route   PATCH /api/orders/admin/:id/status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, trackingNumber, trackingUrl, estimatedDelivery, note } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'canceled', 'returned'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (trackingUrl) order.trackingUrl = trackingUrl;
    if (estimatedDelivery) order.estimatedDelivery = estimatedDelivery;
    order.statusHistory.push({ status, note: note || `Status changed to ${status}` });

    if (status === 'delivered') {
      order.paymentStatus = 'paid';
    }

    await order.save();

    // Emit real-time notification if socket available
    if (req.io) {
      req.io.to(`user_${order.user}`).emit('notification:new', {
        type: 'order_update',
        title: 'Order Update',
        message: `Your order ${order.orderNumber} is now ${status}`,
      });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin order analytics
// @route   GET /api/orders/admin/analytics
exports.getOrderAnalytics = async (req, res, next) => {
  try {
    const [
      totalOrders,
      totalRevenue,
      statusCounts,
      recentOrders,
      dailyRevenue,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Order.find().sort('-createdAt').limit(5).populate('user', 'firstName lastName').lean(),
      Order.aggregate([
        { $match: { paymentStatus: 'paid', createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            revenue: { $sum: '$total' },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        statusCounts: statusCounts.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {}),
        recentOrders,
        dailyRevenue,
      },
    });
  } catch (error) {
    next(error);
  }
};
