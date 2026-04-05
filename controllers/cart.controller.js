const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get current user's cart
// @route   GET /api/cart
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate(
      'items.product',
      'title slug price discount images stock isActive'
    );

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    // Remove items where product no longer exists or is inactive
    cart.items = cart.items.filter((item) => item.product && item.product.isActive);

    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/items
exports.addItem = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock' });
    }

    // Calculate price with discount
    const price =
      product.discount > 0
        ? Math.round(product.price * (1 - product.discount / 100) * 100) / 100
        : product.price;

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      if (newQty > product.stock) {
        return res.status(400).json({ success: false, message: 'Insufficient stock' });
      }
      existingItem.quantity = newQty;
      existingItem.price = price;
    } else {
      cart.items.push({ product: productId, quantity, price });
    }

    await cart.save();

    cart = await Cart.findOne({ user: req.user.id }).populate(
      'items.product',
      'title slug price discount images stock isActive'
    );

    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PATCH /api/cart/items/:productId
exports.updateItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (quantity > product.stock) {
      return res.status(400).json({ success: false, message: 'Insufficient stock' });
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not in cart' });
    }

    item.quantity = quantity;
    // Recalculate price
    item.price =
      product.discount > 0
        ? Math.round(product.price * (1 - product.discount / 100) * 100) / 100
        : product.price;

    await cart.save();

    const populated = await Cart.findOne({ user: req.user.id }).populate(
      'items.product',
      'title slug price discount images stock isActive'
    );

    res.json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:productId
exports.removeItem = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== req.params.productId
    );

    await cart.save();

    const populated = await Cart.findOne({ user: req.user.id }).populate(
      'items.product',
      'title slug price discount images stock isActive'
    );

    res.json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
exports.clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndUpdate(
      { user: req.user.id },
      { items: [], couponCode: null, couponDiscount: 0 }
    );

    res.json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    next(error);
  }
};

// @desc    Apply coupon code
// @route   POST /api/cart/coupon
exports.applyCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Coupon code is required' });
    }

    // Predefined coupons (in production, store in DB)
    const coupons = {
      WELCOME10: { discount: 10, minOrder: 0, description: '10% off your order' },
      FIT20: { discount: 20, minOrder: 50, description: '20% off orders over $50' },
      SAVE15: { discount: 15, minOrder: 30, description: '15% off orders over $30' },
      SUMMER25: { discount: 25, minOrder: 100, description: '25% off orders over $100' },
    };

    const coupon = coupons[code.toUpperCase()];
    if (!coupon) {
      return res.status(400).json({ success: false, message: 'Invalid coupon code' });
    }

    const cart = await Cart.findOne({ user: req.user.id }).populate(
      'items.product',
      'title slug price discount images stock isActive'
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (subtotal < coupon.minOrder) {
      return res.status(400).json({
        success: false,
        message: `Minimum order of $${coupon.minOrder} required for this coupon`,
      });
    }

    cart.couponCode = code.toUpperCase();
    cart.couponDiscount = coupon.discount;
    await cart.save();

    const populated = await Cart.findOne({ user: req.user.id }).populate(
      'items.product',
      'title slug price discount images stock isActive'
    );

    res.json({
      success: true,
      message: `Coupon applied: ${coupon.description}`,
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove coupon
// @route   DELETE /api/cart/coupon
exports.removeCoupon = async (req, res, next) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user.id },
      { couponCode: null, couponDiscount: 0 },
      { new: true }
    ).populate('items.product', 'title slug price discount images stock isActive');

    res.json({ success: true, message: 'Coupon removed', data: cart });
  } catch (error) {
    next(error);
  }
};
