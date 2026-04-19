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

const STORE_QUERY_SYSTEM_PROMPT = `You are FitStore Assistant, an AI shopping and support assistant for a fitness e-commerce store.

Your job:
1. Answer only store-related questions.
2. Understand paraphrases, synonyms, and minor spelling mistakes.
3. Map user messages to the closest intent even when wording is different.
4. Be helpful, concise, and action-oriented.

Intent mapping rules:
- search_products: user wants to see/find/browse items.
  Examples: "show me products", "what do you have", "display items", "find something", "i need gym stuff"
- recommend_products: user asks for trending/popular/best/recommended.
  Examples: "trending", "recommended products", "best sellers", "top picks"
- category_query: user asks what types/categories are available.
- cart_action: add/view cart related queries.
- order_query: track/order status/history.
- policy_query: shipping, returns, refunds, exchange.
- help: how to use store features.
- fallback: unclear request.

Important behavior:
- Treat generic product requests (like "show me products") as search_products, not fallback.
- If user text is close in meaning, still respond correctly (example: "recomended", "trendng", "sho me produtcs").
- If intent is unclear, ask one short clarifying question.
- Never invent unavailable products, prices, or policies.
- If user asks something outside store scope, politely say you can help only with this store.

Return format:
Return ONLY valid JSON with this exact shape:
{
  "intent": "search_products|recommend_products|category_query|cart_action|order_query|policy_query|help|fallback",
  "confidence": 0.0,
  "normalized_query": "cleaned user request",
  "filters": {
    "category": null,
    "price_min": null,
    "price_max": null,
    "brand": null,
    "rating_min": null,
    "sort": "relevance|popular|rating|price_low_to_high|price_high_to_low|newest"
  },
  "reply": "short natural language response for user",
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
}

Confidence rules:
- 0.85 to 1.0 when intent is obvious.
- 0.60 to 0.84 when probable.
- below 0.60 use fallback and ask clarification.

If user says "show me products" or similar:
- intent must be search_products
- confidence must be at least 0.85
- filters can stay null
- suggestions should include category or trending options.`;

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

function getSearchFiltersFromAIResponse(parsedJson) {
  if (!parsedJson || typeof parsedJson !== 'object') return null;

  // New prompt shape: { intent, confidence, normalized_query, filters: { ... } }
  const nestedFilters = parsedJson.filters && typeof parsedJson.filters === 'object'
    ? parsedJson.filters
    : null;

  if (nestedFilters) {
    return normalizeFilters({
      category: nestedFilters.category,
      brand: nestedFilters.brand,
      minRating: nestedFilters.rating_min,
      price: {
        min: nestedFilters.price_min,
        max: nestedFilters.price_max,
      },
    });
  }

  // Backward compatibility: old direct filter shape
  return normalizeFilters(parsedJson);
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
    const lowerInput = userInput.toLowerCase();
    const history = buildChatHistory(req.body?.history);

    if (!userInput) {
      return res.status(400).json({ success: false, message: 'userInput is required' });
    }

    // Try AI-powered filter extraction, fall back to rule-based
    const ai = await safeGeminiCall([
      {
        role: 'system',
        content: STORE_QUERY_SYSTEM_PROMPT,
      },
      ...history,
      { role: 'user', content: userInput },
    ]);

    let normalizedFilters;
    if (ai?.parsedJson) {
      normalizedFilters = getSearchFiltersFromAIResponse(ai.parsedJson);
    } else {
      // Rule-based fallback: comprehensive price extraction from natural language
      let priceMin = null;
      let priceMax = null;

      // "under $50", "below 50", "less than 50", "cheaper than 50", "up to 50", "max 50"
      const underMatch = lowerInput.match(/(?:under|below|less than|cheaper than|up to|max|maximum)\s*\$?\s*(\d+(?:\.\d+)?)/i);
      if (underMatch) priceMax = Number(underMatch[1]);

      // "above $50", "over 50", "more than 50", "greater than 50", "min 50", "starting 50", "atleast 50"
      const aboveMatch = lowerInput.match(/(?:above|over|more than|greater than|min|minimum|atleast|at least|starting|starts? from)\s*\$?\s*(\d+(?:\.\d+)?)/i);
      if (aboveMatch) priceMin = Number(aboveMatch[1]);

      // "between 20 and 80", "between $20 to $80", "from 20 to 80"
      const betweenMatch = lowerInput.match(/(?:between|from)\s*\$?\s*(\d+(?:\.\d+)?)\s*(?:and|to|-)\s*\$?\s*(\d+(?:\.\d+)?)/i);
      if (betweenMatch) {
        priceMin = Number(betweenMatch[1]);
        priceMax = Number(betweenMatch[2]);
      }

      // Range shorthand: "20-80" or "$20-$80"
      if (!betweenMatch) {
        const rangeMatch = lowerInput.match(/\$?(\d+(?:\.\d+)?)\s*-\s*\$?(\d+(?:\.\d+)?)/);
        if (rangeMatch) {
          priceMin = Number(rangeMatch[1]);
          priceMax = Number(rangeMatch[2]);
        }
      }

      // Keyword-based price defaults
      if (priceMin === null && priceMax === null) {
        if (/\b(cheap|budget|affordable|inexpensive|low price|low cost|cheapest|economical|bargain)\b/.test(lowerInput)) {
          priceMax = 50;
        } else if (/\b(expensive|premium|high end|highend|luxury|pricey|top tier|deluxe)\b/.test(lowerInput)) {
          priceMin = 100;
        } else if (/\b(mid range|midrange|moderate|medium price|average price)\b/.test(lowerInput)) {
          priceMin = 30;
          priceMax = 100;
        }
      }

      const foundCat = VALID_CATEGORIES.find((c) => lowerInput.includes(c));
      normalizedFilters = normalizeFilters({
        category: foundCat || null,
        price: {
          min: priceMin,
          max: priceMax,
        },
      });
    }

    const filter = buildProductFilter(normalizedFilters);

    const isGenericProductRequest = /\b(show|list|display|browse|view|find|search|get|need|want|shop)\b/.test(lowerInput)
      && /\b(product|products|item|items)\b/.test(lowerInput);
    const isAllProductsRequest =
      (/\b(all|every|entire|complete)\b/.test(lowerInput) && /\b(product|products|item|items|shop)\b/.test(lowerInput)) ||
      /\b(show all products|all products|all items|entire shop)\b/.test(lowerInput);
    const hasExplicitFilters =
      Boolean(normalizedFilters.category) ||
      Boolean(normalizedFilters.brand) ||
      normalizedFilters.minRating !== null ||
      normalizedFilters.price.min !== null ||
      normalizedFilters.price.max !== null;

    if (isAllProductsRequest && !hasExplicitFilters) {
      const products = await Product.find({ isActive: true })
        .sort({ createdAt: -1 })
        .lean();

      return res.json({
        success: true,
        data: {
          query: userInput,
          filters: normalizedFilters,
          showAll: true,
          totalCount: products.length,
          products: products.map(serializeProduct),
          suggestions: ['Show trending products', 'Show supplements', 'Show equipment'],
        },
      });
    }

    // If no specific filters, try text search
    if (Object.keys(filter).length <= 1) {
      const searchWords = userInput
        .replace(/show|me|my|find|get|browse|list|display|view|products?|items?|i\s+want|i\s+need|looking\s+for/gi, '')
        .trim();
      if (searchWords) {
        filter.$or = [
          { title: { $regex: searchWords.split(/\s+/).join('|'), $options: 'i' } },
          { tags: { $regex: searchWords.split(/\s+/).join('|'), $options: 'i' } },
        ];
      }
    }

    // Generic queries like "show my products" should return top products, not empty text-search results.
    if (isGenericProductRequest && !hasExplicitFilters && !filter.$or) {
      const products = await Product.find({ isActive: true })
        .sort({ viewCount: -1, 'ratings.average': -1, createdAt: -1 })
        .limit(20)
        .lean();

      return res.json({
        success: true,
        data: {
          query: userInput,
          filters: normalizedFilters,
          products: products.map(serializeProduct),
          suggestions: ['Show trending products', 'Show supplements', 'Show equipment'],
        },
      });
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
      // Rule-based FAQ fallback with simplified NLP via natural
      const lower = userMessage.toLowerCase();
      const natural = require('natural');
      
      const isMatch = (msg, keywords) => {
        return keywords.some((kw) => {
          if (msg.includes(kw)) return true;
          return msg.split(' ').some(word => natural.JaroWinklerDistance(word, kw) > 0.85);
        });
      };

      if (isMatch(lower, ['shipping', 'delivery', 'ship'])) {
        answer = '🚚 We offer FREE shipping on orders over $50. Standard delivery takes 3-5 business days. Express shipping (1-2 days) is available for $12.99.';
      } else if (isMatch(lower, ['return', 'refund', 'send back'])) {
        answer = '↩️ Returns are accepted within 30 days of delivery for unused items in original packaging. Refunds are processed within 5-7 business days after we receive the item.';
      } else if (isMatch(lower, ['payment', 'pay', 'card', 'stripe', 'checkout'])) {
        answer = '💳 We accept credit/debit cards (Visa, Mastercard, Amex) via Stripe secure checkout. All payments are encrypted and processed securely.';
      } else if (isMatch(lower, ['order', 'buy', 'purchase'])) {
        answer = '🛒 To order: Browse products → Add to cart → Go to checkout → Enter shipping info → Pay with card. You\'ll receive an order confirmation email.';
      } else if (isMatch(lower, ['track', 'where is my order', 'status'])) {
        answer = '📦 Go to your Orders page to see current status and tracking info. You can also ask me "Where is my order?" and I\'ll look it up for you!';
      } else if (isMatch(lower, ['account', 'signup', 'register', 'login'])) {
        answer = '👤 Click "Register" at the top right. Fill in your details and you\'re ready to shop! You can also use demo accounts for testing.';
      } else if (isMatch(lower, ['coupon', 'discount', 'promo', 'code'])) {
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
