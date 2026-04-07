const mongoose = require('mongoose');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const User = require('../models/User');

let callGeminiChat;
try {
  callGeminiChat = require('../services/gemini.service').callGeminiChat;
} catch {
  callGeminiChat = null;
}

// Safe wrapper: returns { content, parsedJson } or null if Gemini is unavailable
async function safeGeminiCall(messages) {
  if (!callGeminiChat || !process.env.GEMINI_API_KEY) return null;
  try {
    return await callGeminiChat(messages);
  } catch (err) {
    console.warn('[AI] Gemini call failed, using rule-based fallback:', err.message);
    return null;
  }
}

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

exports.searchProductsWithAI = async (req, res) => {
  try {
    const userInput = String(req.body?.userInput || '').trim();
    const history = buildChatHistory(req.body?.history);

    if (!userInput) {
      return res.status(400).json({ success: false, message: 'userInput is required' });
    }

    // Try AI-powered filter extraction, fall back to rule-based
    const ai = await safeGeminiCall([
      {
        role: 'system',
        content:
          'Convert user query into JSON filters: price, category, brand, rating. Return only JSON.',
      },
      ...history,
      { role: 'user', content: userInput },
    ]);

    let normalizedFilters;
    if (ai?.parsedJson) {
      normalizedFilters = normalizeFilters(ai.parsedJson);
    } else {
      // Rule-based fallback: extract filters from natural language
      const lowerInput = userInput.toLowerCase();
      const priceMatch = lowerInput.match(/under\s*\$?(\d+)/);
      const aboveMatch = lowerInput.match(/(?:above|over)\s*\$?(\d+)/);
      const foundCat = VALID_CATEGORIES.find((c) => lowerInput.includes(c));
      normalizedFilters = normalizeFilters({
        category: foundCat || null,
        price: {
          min: aboveMatch ? Number(aboveMatch[1]) : null,
          max: priceMatch ? Number(priceMatch[1]) : null,
        },
      });
    }

    const filter = buildProductFilter(normalizedFilters);

    // If no specific filters, try text search
    if (Object.keys(filter).length <= 1) {
      const searchWords = userInput.replace(/show|me|find|get|i\s+want|i\s+need|looking\s+for/gi, '').trim();
      if (searchWords) {
        filter.$or = [
          { title: { $regex: searchWords.split(/\s+/).join('|'), $options: 'i' } },
          { tags: { $regex: searchWords.split(/\s+/).join('|'), $options: 'i' } },
        ];
      }
    }

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
    console.error('AI endpoint error:', error.message);
    return res.status(500).json({ success: false, message: error.message || 'AI request failed' });
  }
};

exports.recommendProductsWithAI = async (req, res) => {
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

    const ai = await safeGeminiCall([
      {
        role: 'system',
        content:
          'Recommend fitness products based on user data. Return JSON object with optional keys: productIds (array), categories (array).',
      },
      ...history,
      { role: 'user', content: JSON.stringify(userBehaviorData) },
    ]);

    const parsed = ai?.parsedJson && typeof ai.parsedJson === 'object' ? ai.parsedJson : {};
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
    console.error('AI endpoint error:', error.message);
    return res.status(500).json({ success: false, message: error.message || 'AI request failed' });
  }
};

exports.getOrderStatusWithAI = async (req, res) => {
  try {
    const userMessage = String(req.body?.userMessage || req.body?.message || '').trim();
    const history = buildChatHistory(req.body?.history);

    if (!userMessage) {
      return res.status(400).json({ success: false, message: 'userMessage is required' });
    }

    const user = await User.findById(req.user.id).lean();
    const ai = await safeGeminiCall([
      {
        role: 'system',
        content: "Extract order ID from message. Return JSON: {orderId: ''}",
      },
      ...history,
      { role: 'user', content: userMessage },
    ]);

    let extractedOrderId = '';
    if (ai?.parsedJson) {
      const parsed = ai.parsedJson;
      extractedOrderId = parsed.orderId || parsed.orderNumber || '';
    } else {
      // Rule-based fallback: extract order number from message
      const orderMatch = userMessage.match(/FS-[A-Z0-9]+-\d+/i) || userMessage.match(/#?([A-Z0-9-]{6,})/i);
      extractedOrderId = orderMatch ? orderMatch[0] : '';
    }

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
    console.error('AI endpoint error:', error.message);
    return res.status(500).json({ success: false, message: error.message || 'AI request failed' });
  }
};

exports.handleCartActionWithAI = async (req, res) => {
  try {
    const userMessage = String(req.body?.userMessage || req.body?.message || '').trim();
    const history = buildChatHistory(req.body?.history);

    if (!userMessage) {
      return res.status(400).json({ success: false, message: 'userMessage is required' });
    }

    const ai = await safeGeminiCall([
      {
        role: 'system',
        content:
          "Convert message into cart actions. Return JSON: {action, productId, quantity, coupon}",
      },
      ...history,
      { role: 'user', content: userMessage },
    ]);

    let action, quantity, coupon, productSearch;
    if (ai?.parsedJson) {
      const parsed = ai.parsedJson;
      action = String(parsed.action || '').toLowerCase();
      quantity = Math.max(1, Number(parsed.quantity) || 1);
      coupon = parsed.coupon ? String(parsed.coupon).trim().toUpperCase() : null;
      productSearch = parsed.productId || null;
    } else {
      // Rule-based fallback
      const lower = userMessage.toLowerCase();
      quantity = 1;
      const qtyMatch = lower.match(/(\d+)\s*(?:x|items?|units?|pcs?)/);
      if (qtyMatch) quantity = Math.max(1, Number(qtyMatch[1]));

      if (/add|put|buy/.test(lower)) action = 'add';
      else if (/remove|delete|take out/.test(lower)) action = 'remove';
      else if (/coupon|apply|code/.test(lower)) action = 'apply_coupon';
      else if (/view|show|what/.test(lower)) action = 'view';
      else action = 'view';

      const couponMatch = lower.match(/(?:coupon|code|apply)\s+([A-Z0-9]+)/i);
      coupon = couponMatch ? couponMatch[1].toUpperCase() : null;

      // Extract product name (remove action words)
      productSearch = userMessage.replace(/add\s+(to\s+)?cart|remove\s+from\s+cart|put\s+in\s+cart|buy|apply\s+coupon\s+\w+/gi, '').trim() || null;
    }

    let product = null;
    if (productSearch) {
      const productId = String(productSearch).trim();
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
    console.error('AI endpoint error:', error.message);
    return res.status(500).json({ success: false, message: error.message || 'AI request failed' });
  }
};

exports.answerFAQWithAI = async (req, res) => {
  try {
    const userMessage = String(req.body?.userMessage || req.body?.message || '').trim();
    const history = buildChatHistory(req.body?.history);

    if (!userMessage) {
      return res.status(400).json({ success: false, message: 'userMessage is required' });
    }

    const ai = await safeGeminiCall([
      {
        role: 'system',
        content:
          'You are a fitness store support assistant. Answer FAQs clearly and professionally.',
      },
      ...history,
      { role: 'user', content: userMessage },
    ]);

    let answer;
    if (ai?.content) {
      answer = ai.content;
    } else {
      // Rule-based FAQ fallback
      const lower = userMessage.toLowerCase();
      if (/shipping|delivery|ship/.test(lower)) {
        answer = '🚚 We offer FREE shipping on orders over $50. Standard delivery takes 3-5 business days. Express shipping (1-2 days) is available for $12.99.';
      } else if (/return|refund/.test(lower)) {
        answer = '↩️ Returns are accepted within 30 days of delivery for unused items in original packaging. Refunds are processed within 5-7 business days after we receive the item.';
      } else if (/payment|pay|card|stripe/.test(lower)) {
        answer = '💳 We accept credit/debit cards (Visa, Mastercard, Amex) via Stripe secure checkout. All payments are encrypted and processed securely.';
      } else if (/order|how.*buy|how.*order/.test(lower)) {
        answer = '🛒 To order: Browse products → Add to cart → Go to checkout → Enter shipping info → Pay with card. You\'ll receive an order confirmation email.';
      } else if (/track|where.*order/.test(lower)) {
        answer = '📦 Go to your Orders page to see current status and tracking info. You can also ask me "Where is my order?" and I\'ll look it up for you!';
      } else if (/account|signup|register/.test(lower)) {
        answer = '👤 Click "Register" at the top right. Fill in your details and you\'re ready to shop! You can also use demo accounts for testing.';
      } else if (/coupon|discount|promo/.test(lower)) {
        answer = '🏷️ Available coupons: WELCOME10 (10% off), FIT20 (20% off $50+), SAVE15 (15% off $30+), SUMMER25 (25% off $100+). Apply at checkout!';
      } else {
        answer = "👋 I can help with: shipping info, return policy, payment methods, ordering, account setup, order tracking, and product recommendations. What would you like to know?";
      }
    }

    return res.json({
      success: true,
      data: {
        type: 'faq',
        message: answer,
      },
    });
  } catch (error) {
    console.error('AI endpoint error:', error.message);
    return res.status(500).json({ success: false, message: error.message || 'AI request failed' });
  }
};
