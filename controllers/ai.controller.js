const mongoose = require('mongoose');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');
const { callGeminiChat } = require('../services/gemini.service');

const VALID_CATEGORIES = [
  'supplements',
  'equipment',
  'apparel',
  'accessories',
  'nutrition',
  'recovery',
  'cardio',
  'strength',
  'yoga',
  'other',
];

const COUPONS = {
  WELCOME10: { discount: 10, minOrder: 0, description: '10% off your order' },
  FIT20: { discount: 20, minOrder: 50, description: '20% off orders over $50' },
  SAVE15: { discount: 15, minOrder: 30, description: '15% off orders over $30' },
  SUMMER25: { discount: 25, minOrder: 100, description: '25% off orders over $100' },
};

function buildChatHistory(history = []) {
  if (!Array.isArray(history)) return [];

  return history
    .slice(-8)
    .map((item) => {
      const role = item.role === 'assistant' || item.role === 'bot' ? 'assistant' : 'user';
      return {
        role,
        content: String(item.content || '').slice(0, 1000),
      };
    })
    .filter((item) => item.content);
}

function normalizeFilters(parsed) {
  const filters = parsed && typeof parsed === 'object' ? parsed : {};

  const normalized = {
    category: null,
    brand: null,
    minRating: null,
    price: { min: null, max: null },
  };

  if (typeof filters.category === 'string') {
    const category = filters.category.trim().toLowerCase();
    if (VALID_CATEGORIES.includes(category)) {
      normalized.category = category;
    }
  }

  if (typeof filters.brand === 'string' && filters.brand.trim()) {
    normalized.brand = filters.brand.trim();
  }

  const rating = Number(filters.rating || filters.minRating);
  if (!Number.isNaN(rating) && rating > 0) {
    normalized.minRating = Math.min(5, Math.max(0, rating));
  }

  const min = Number(filters?.price?.min ?? filters.minPrice);
  const max = Number(filters?.price?.max ?? filters.maxPrice);

  if (!Number.isNaN(min) && min >= 0) normalized.price.min = min;
  if (!Number.isNaN(max) && max >= 0) normalized.price.max = max;

  return normalized;
}

function buildProductFilter(aiFilters) {
  const query = { isActive: true };

  if (aiFilters.category) query.category = aiFilters.category;
  if (aiFilters.brand) query.brand = { $regex: aiFilters.brand, $options: 'i' };
  if (aiFilters.minRating) query['ratings.average'] = { $gte: aiFilters.minRating };

  if (aiFilters.price.min !== null || aiFilters.price.max !== null) {
    query.price = {};
    if (aiFilters.price.min !== null) query.price.$gte = aiFilters.price.min;
    if (aiFilters.price.max !== null) query.price.$lte = aiFilters.price.max;
  }

  return query;
}

function serializeProduct(product) {
  return {
    id: product._id,
    title: product.title,
    slug: product.slug,
    category: product.category,
    brand: product.brand,
    price: product.price,
    discount: product.discount,
    finalPrice:
      product.discount > 0
        ? Math.round(product.price * (1 - product.discount / 100) * 100) / 100
        : product.price,
    rating: product?.ratings?.average || 0,
    image: product?.images?.[0]?.url,
  };
}

async function getOrCreateCart(userId) {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
}

async function resolveOrderByIdentifier(orderId, userId, isAdmin) {
  const idText = String(orderId || '').trim();
  if (!idText) return null;

  const userScope = isAdmin ? {} : { user: userId };

  let order = await Order.findOne({ ...userScope, orderNumber: idText })
    .sort('-createdAt')
    .lean();

  if (!order) {
    order = await Order.findOne({
      ...userScope,
      orderNumber: { $regex: `^${idText}$`, $options: 'i' },
    })
      .sort('-createdAt')
      .lean();
  }

  if (!order && mongoose.Types.ObjectId.isValid(idText)) {
    order = await Order.findOne({ ...userScope, _id: idText }).lean();
  }

  return order;
}

exports.searchProductsWithAI = async (req, res, next) => {
  try {
    const userInput = String(req.body?.userInput || '').trim();
    const history = buildChatHistory(req.body?.history);

    if (!userInput) {
      return res.status(400).json({ success: false, message: 'userInput is required' });
    }

    const ai = await callGeminiChat([
      {
        role: 'system',
        content:
          'Convert user query into JSON filters: price, category, brand, rating. Return only JSON.',
      },
      ...history,
      {
        role: 'user',
        content: userInput,
      },
    ]);

    const normalizedFilters = normalizeFilters(ai.parsedJson || {});
    const filter = buildProductFilter(normalizedFilters);

    const products = await Product.find(filter)
      .sort({ 'ratings.average': -1, viewCount: -1, createdAt: -1 })
      .limit(20)
      .lean();

    return res.json({
      success: true,
      data: {
        query: userInput,
        filters: normalizedFilters,
        products: products.map(serializeProduct),
        suggestions: products.slice(0, 5).map((p) => p.title),
      },
    });
  } catch (error) {
    return next(error);
  }
};

exports.recommendProductsWithAI = async (req, res, next) => {
  try {
    const history = buildChatHistory(req.body?.history);
    let userBehaviorData = req.body?.userBehaviorData || {};

    if (req.user?.id) {
      const [user, recentOrders] = await Promise.all([
        User.findById(req.user.id).lean(),
        Order.find({ user: req.user.id }).sort('-createdAt').limit(10).lean(),
      ]);

      const purchasedCategories = recentOrders
        .flatMap((order) => order.items || [])
        .map((item) => item?.title || '')
        .filter(Boolean)
        .slice(0, 20);

      userBehaviorData = {
        ...userBehaviorData,
        role: user?.role || 'member',
        recentOrderCount: recentOrders.length,
        purchasedItems: purchasedCategories,
      };
    }

    const trending = await Product.find({ isActive: true })
      .sort({ viewCount: -1, 'ratings.average': -1 })
      .limit(10)
      .lean();

    const ai = await callGeminiChat([
      {
        role: 'system',
        content:
          'Recommend fitness products based on user data. Return JSON object with optional keys: productIds (array), categories (array).',
      },
      ...history,
      {
        role: 'user',
        content: JSON.stringify(userBehaviorData),
      },
    ]);

    const parsed = ai.parsedJson && typeof ai.parsedJson === 'object' ? ai.parsedJson : {};
    const productIds = Array.isArray(parsed.productIds) ? parsed.productIds : [];
    const categories = Array.isArray(parsed.categories)
      ? parsed.categories.map((c) => String(c).toLowerCase()).filter((c) => VALID_CATEGORIES.includes(c))
      : [];

    let recommendedProducts = [];
    let usedFallback = false;

    if (productIds.length > 0) {
      const validIds = productIds.filter((id) => mongoose.Types.ObjectId.isValid(id));
      if (validIds.length > 0) {
        recommendedProducts = await Product.find({ _id: { $in: validIds }, isActive: true })
          .limit(8)
          .lean();
      }
    }

    if (recommendedProducts.length === 0 && categories.length > 0) {
      recommendedProducts = await Product.find({ isActive: true, category: { $in: categories } })
        .sort({ 'ratings.average': -1, viewCount: -1 })
        .limit(8)
        .lean();
    }

    if (recommendedProducts.length === 0) {
      recommendedProducts = trending.slice(0, 8);
      usedFallback = true;
    }

    return res.json({
      success: true,
      data: {
        source: usedFallback ? 'trending_fallback' : 'ai',
        recommendations: recommendedProducts.map(serializeProduct),
        categories,
      },
    });
  } catch (error) {
    return next(error);
  }
};

exports.getOrderStatusWithAI = async (req, res, next) => {
  try {
    const userMessage = String(req.body?.userMessage || req.body?.message || '').trim();
    const history = buildChatHistory(req.body?.history);

    if (!userMessage) {
      return res.status(400).json({ success: false, message: 'userMessage is required' });
    }

    const [user, ai] = await Promise.all([
      User.findById(req.user.id).lean(),
      callGeminiChat([
        {
          role: 'system',
          content: "Extract order ID from message. Return JSON: {orderId: ''}",
        },
        ...history,
        {
          role: 'user',
          content: userMessage,
        },
      ]),
    ]);

    const parsed = ai.parsedJson && typeof ai.parsedJson === 'object' ? ai.parsedJson : {};
    const extractedOrderId = parsed.orderId || parsed.orderNumber || '';

    const isAdmin = ['admin', 'super_admin'].includes(user?.role);
    let order = await resolveOrderByIdentifier(extractedOrderId, req.user.id, isAdmin);

    if (!order) {
      order = await Order.findOne(isAdmin ? {} : { user: req.user.id }).sort('-createdAt').lean();
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'No order found for this request',
      });
    }

    return res.json({
      success: true,
      data: {
        type: 'order_tracking',
        message: `Order ${order.orderNumber} is currently ${order.status}.`,
        order: {
          id: order._id,
          orderNumber: order.orderNumber,
          status: order.status,
          paymentStatus: order.paymentStatus,
          trackingNumber: order.trackingNumber,
          trackingUrl: order.trackingUrl,
          estimatedDelivery: order.estimatedDelivery,
          timeline: (order.statusHistory || []).map((entry) => ({
            status: entry.status,
            note: entry.note,
            timestamp: entry.timestamp,
          })),
        },
      },
    });
  } catch (error) {
    return next(error);
  }
};

exports.handleCartActionWithAI = async (req, res, next) => {
  try {
    const userMessage = String(req.body?.userMessage || req.body?.message || '').trim();
    const history = buildChatHistory(req.body?.history);

    if (!userMessage) {
      return res.status(400).json({ success: false, message: 'userMessage is required' });
    }

    const ai = await callGeminiChat([
      {
        role: 'system',
        content:
          "Convert message into cart actions. Return JSON: {action, productId, quantity, coupon}",
      },
      ...history,
      {
        role: 'user',
        content: userMessage,
      },
    ]);

    const parsed = ai.parsedJson && typeof ai.parsedJson === 'object' ? ai.parsedJson : {};
    const action = String(parsed.action || '').toLowerCase();
    const quantity = Math.max(1, Number(parsed.quantity) || 1);
    const coupon = parsed.coupon ? String(parsed.coupon).trim().toUpperCase() : null;

    let product = null;
    if (parsed.productId) {
      const productId = String(parsed.productId).trim();
      if (mongoose.Types.ObjectId.isValid(productId)) {
        product = await Product.findById(productId);
      }
      if (!product) {
        product = await Product.findOne({ title: { $regex: productId, $options: 'i' }, isActive: true });
      }
    }

    const cart = await getOrCreateCart(req.user.id);
    let message = 'Action completed.';

    if (['add', 'add_item', 'add_to_cart'].includes(action)) {
      if (!product || !product.isActive) {
        return res.status(404).json({ success: false, message: 'Product not found for add action' });
      }

      const price =
        product.discount > 0
          ? Math.round(product.price * (1 - product.discount / 100) * 100) / 100
          : product.price;

      const existing = cart.items.find((item) => item.product.toString() === product._id.toString());
      if (existing) {
        existing.quantity += quantity;
        existing.price = price;
      } else {
        cart.items.push({ product: product._id, quantity, price });
      }
      message = `Added ${quantity} x ${product.title} to cart.`;
    }

    if (['remove', 'remove_item', 'delete_item'].includes(action)) {
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found for remove action' });
      }
      cart.items = cart.items.filter((item) => item.product.toString() !== product._id.toString());
      message = `Removed ${product.title} from cart.`;
    }

    if (['update', 'set_quantity', 'update_quantity'].includes(action)) {
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found for update action' });
      }
      const existing = cart.items.find((item) => item.product.toString() === product._id.toString());
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Product is not in cart' });
      }
      existing.quantity = quantity;
      message = `Updated ${product.title} quantity to ${quantity}.`;
    }

    if (['apply_coupon', 'coupon', 'apply'].includes(action) && coupon) {
      const couponObj = COUPONS[coupon];
      if (!couponObj) {
        return res.status(400).json({ success: false, message: 'Invalid coupon code' });
      }
      const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      if (subtotal < couponObj.minOrder) {
        return res.status(400).json({
          success: false,
          message: `Minimum order of $${couponObj.minOrder} required for this coupon`,
        });
      }
      cart.couponCode = coupon;
      cart.couponDiscount = couponObj.discount;
      message = `Coupon ${coupon} applied.`;
    }

    await cart.save();

    const populatedCart = await Cart.findOne({ user: req.user.id }).populate(
      'items.product',
      'title slug price discount images stock isActive'
    );

    return res.json({
      success: true,
      data: {
        type: 'cart_update',
        message,
        action,
        cart: populatedCart,
      },
    });
  } catch (error) {
    return next(error);
  }
};

exports.answerFAQWithAI = async (req, res, next) => {
  try {
    const userMessage = String(req.body?.userMessage || req.body?.message || '').trim();
    const history = buildChatHistory(req.body?.history);

    if (!userMessage) {
      return res.status(400).json({ success: false, message: 'userMessage is required' });
    }

    const ai = await callGeminiChat([
      {
        role: 'system',
        content:
          'You are a fitness store support assistant. Answer FAQs clearly and professionally.',
      },
      ...history,
      {
        role: 'user',
        content: userMessage,
      },
    ]);

    return res.json({
      success: true,
      data: {
        type: 'faq',
        message: ai.content || 'Sorry, I could not generate a response right now.',
      },
    });
  } catch (error) {
    return next(error);
  }
};
