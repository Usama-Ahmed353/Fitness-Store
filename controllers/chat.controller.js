const Product = require('../models/Product');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

// @desc    AI Chat endpoint - handles natural language queries
// @route   POST /api/chat
exports.chat = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const lowerMsg = message.toLowerCase().trim();
    let response;

    // Intent detection (rule-based + keyword matching)
    if (matchesIntent(lowerMsg, ['show', 'find', 'search', 'looking for', 'get me', 'i want', 'i need'])) {
      response = await handleProductSearch(lowerMsg, req.user);
    } else if (matchesIntent(lowerMsg, ['add to cart', 'put in cart', 'buy'])) {
      response = await handleAddToCart(lowerMsg, req.user);
    } else if (matchesIntent(lowerMsg, ['cart', 'my cart', 'what\'s in my cart', 'view cart'])) {
      response = await handleViewCart(req.user);
    } else if (matchesIntent(lowerMsg, ['order', 'my orders', 'order status', 'track', 'where is my'])) {
      response = await handleOrderQuery(lowerMsg, req.user);
    } else if (matchesIntent(lowerMsg, ['recommend', 'suggestion', 'trending', 'popular', 'best'])) {
      response = await handleRecommendations(lowerMsg);
    } else if (matchesIntent(lowerMsg, ['category', 'categories', 'what do you sell', 'what products'])) {
      response = await handleCategories();
    } else if (matchesIntent(lowerMsg, ['help', 'support', 'faq', 'how do i', 'how to'])) {
      response = handleFAQ(lowerMsg);
    } else if (matchesIntent(lowerMsg, ['shipping', 'delivery', 'return', 'refund'])) {
      response = handlePolicies(lowerMsg);
    } else {
      response = handleDefault();
    }

    res.json({ success: true, data: response });
  } catch (error) {
    console.error('Chat error:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Chat request failed' });
  }
};

// ============= Intent Handlers =============

function matchesIntent(msg, keywords) {
  return keywords.some((kw) => msg.includes(kw));
}

async function handleProductSearch(msg, user) {
  // Extract price constraints
  const priceMatch = msg.match(/under\s*\$?(\d+)/);
  const aboveMatch = msg.match(/(?:above|over)\s*\$?(\d+)/);

  const filter = { isActive: true };

  if (priceMatch) filter.price = { ...filter.price, $lte: Number(priceMatch[1]) };
  if (aboveMatch) filter.price = { ...filter.price, $gte: Number(aboveMatch[1]) };

  // Extract category
  const categories = [
    'supplements', 'equipment', 'apparel', 'accessories',
    'nutrition', 'recovery', 'cardio', 'strength', 'yoga',
  ];
  const foundCat = categories.find((c) => msg.includes(c));
  if (foundCat) filter.category = foundCat;

  // Build text search from remaining words
  const stopWords = ['show', 'me', 'find', 'get', 'i', 'want', 'need', 'looking', 'for', 'under', 'above', 'over', 'the', 'a', 'an', 'some', 'any'];
  const searchTerms = msg
    .split(/\s+/)
    .filter((w) => !stopWords.includes(w) && !w.startsWith('$') && !/^\d+$/.test(w))
    .join(' ')
    .trim();

  let products;
  if (searchTerms && !filter.category) {
    // Try text search
    products = await Product.find(
      { ...filter, title: { $regex: searchTerms.split(' ').join('|'), $options: 'i' } },
      null,
      { limit: 6 }
    ).lean();
  } else {
    products = await Product.find(filter).sort('-ratings.average').limit(6).lean();
  }

  if (products.length === 0) {
    return {
      type: 'text',
      message: "I couldn't find products matching your search. Try browsing our categories or using different keywords!",
      suggestions: ['Show me trending products', 'What categories do you have?', 'Show me equipment'],
    };
  }

  return {
    type: 'products',
    message: `I found ${products.length} product${products.length > 1 ? 's' : ''} for you:`,
    products: products.map(formatProduct),
    suggestions: ['Add to cart', 'Show me more', 'Filter by price'],
  };
}

async function handleAddToCart(msg, user) {
  if (!user) {
    return {
      type: 'text',
      message: 'Please log in to add items to your cart.',
      action: 'login',
    };
  }

  // Extract product name from message
  const cleaned = msg.replace(/add\s+(to\s+)?cart|put\s+in\s+cart|buy/gi, '').trim();
  if (!cleaned) {
    return {
      type: 'text',
      message: 'Which product would you like to add? You can search for products first.',
      suggestions: ['Show me supplements', 'Show me equipment', 'Show me trending products'],
    };
  }

  const product = await Product.findOne({
    isActive: true,
    title: { $regex: cleaned, $options: 'i' },
  });

  if (!product) {
    return {
      type: 'text',
      message: `I couldn't find a product matching "${cleaned}". Let me search for similar items.`,
      suggestions: [`Show me ${cleaned}`, 'View all products'],
    };
  }

  // Add to cart
  let cart = await Cart.findOne({ user: user.id });
  if (!cart) cart = new Cart({ user: user.id, items: [] });

  const price = product.discount > 0
    ? Math.round(product.price * (1 - product.discount / 100) * 100) / 100
    : product.price;

  const existing = cart.items.find((i) => i.product.toString() === product._id.toString());
  if (existing) {
    existing.quantity += 1;
    existing.price = price;
  } else {
    cart.items.push({ product: product._id, quantity: 1, price });
  }
  await cart.save();

  return {
    type: 'cart_update',
    message: `Added "${product.title}" to your cart!`,
    product: formatProduct(product),
    suggestions: ['View my cart', 'Continue shopping', 'Checkout'],
  };
}

async function handleViewCart(user) {
  if (!user) {
    return { type: 'text', message: 'Please log in to view your cart.', action: 'login' };
  }

  const cart = await Cart.findOne({ user: user.id }).populate(
    'items.product',
    'title slug price discount images'
  );

  if (!cart || cart.items.length === 0) {
    return {
      type: 'text',
      message: 'Your cart is empty. Let me help you find something!',
      suggestions: ['Show me trending products', 'Show me supplements', 'What categories do you have?'],
    };
  }

  const total = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);

  return {
    type: 'cart',
    message: `You have ${cart.items.length} item${cart.items.length > 1 ? 's' : ''} in your cart:`,
    items: cart.items.map((i) => ({
      title: i.product.title,
      slug: i.product.slug,
      quantity: i.quantity,
      price: i.price,
      image: i.product.images?.[0]?.url,
    })),
    total: Math.round(total * 100) / 100,
    suggestions: ['Proceed to checkout', 'Continue shopping'],
  };
}

async function handleOrderQuery(msg, user) {
  if (!user) {
    return { type: 'text', message: 'Please log in to view your orders.', action: 'login' };
  }

  const orders = await Order.find({ user: user.id }).sort('-createdAt').limit(5).lean();

  if (orders.length === 0) {
    return {
      type: 'text',
      message: "You don't have any orders yet. Start shopping!",
      suggestions: ['Show me trending products', 'Browse categories'],
    };
  }

  return {
    type: 'orders',
    message: 'Here are your recent orders:',
    orders: orders.map((o) => ({
      orderNumber: o.orderNumber,
      status: o.status,
      total: o.total,
      date: o.createdAt,
      items: o.items.length,
    })),
    suggestions: ['Track my order', 'Continue shopping'],
  };
}

async function handleRecommendations(msg) {
  let products;
  if (msg.includes('trending') || msg.includes('popular')) {
    products = await Product.find({ isActive: true }).sort('-viewCount').limit(6).lean();
  } else {
    products = await Product.find({ isActive: true }).sort('-ratings.average').limit(6).lean();
  }

  return {
    type: 'products',
    message: 'Here are some popular picks:',
    products: products.map(formatProduct),
    suggestions: ['Show me supplements', 'Filter by price', 'Show me equipment'],
  };
}

async function handleCategories() {
  const categories = await Product.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  if (categories.length === 0) {
    return {
      type: 'text',
      message: 'We have products in: supplements, equipment, apparel, accessories, nutrition, recovery, cardio, strength, and yoga.',
      suggestions: categories.length > 0
        ? categories.slice(0, 3).map((c) => `Show me ${c._id}`)
        : ['Show me supplements', 'Show me equipment'],
    };
  }

  return {
    type: 'categories',
    message: 'Here are our product categories:',
    categories: categories.map((c) => ({ name: c._id, count: c.count })),
    suggestions: categories.slice(0, 3).map((c) => `Show me ${c._id}`),
  };
}

function handleFAQ(msg) {
  const faqs = {
    'how do i order': 'Browse products, add to cart, then proceed to checkout. You can pay with credit/debit card via Stripe.',
    'how to return': 'You can request a return within 30 days of delivery. Go to Orders → select order → Request Return.',
    'how to track': 'Go to your Orders page. Each order shows its current status and tracking info.',
    'create account': 'Click "Register" at the top right. Fill in your details and verify your email.',
  };

  const match = Object.keys(faqs).find((k) => msg.includes(k));
  if (match) {
    return { type: 'text', message: faqs[match], suggestions: ['More help', 'Contact support'] };
  }

  return {
    type: 'text',
    message: "I can help with: ordering, returns, tracking, and account setup. What would you like to know?",
    suggestions: ['How do I order?', 'How to track my order?', 'Return policy'],
  };
}

function handlePolicies(msg) {
  if (msg.includes('shipping') || msg.includes('delivery')) {
    return {
      type: 'text',
      message: 'We offer free shipping on orders over $50. Standard delivery takes 3-5 business days. Express shipping (1-2 days) is available for $12.99.',
      suggestions: ['Return policy', 'Track my order'],
    };
  }
  if (msg.includes('return') || msg.includes('refund')) {
    return {
      type: 'text',
      message: 'Returns are accepted within 30 days of delivery for unused items in original packaging. Refunds are processed within 5-7 business days.',
      suggestions: ['Shipping info', 'Track my order'],
    };
  }
  return { type: 'text', message: 'What would you like to know about?', suggestions: ['Shipping info', 'Return policy'] };
}

function handleDefault() {
  return {
    type: 'text',
    message: "Hi! I'm your FitStore assistant. I can help you find products, manage your cart, track orders, and answer questions. What can I help you with?",
    suggestions: ['Show me trending products', 'What categories do you have?', 'Track my order', 'Help'],
  };
}

function formatProduct(p) {
  return {
    id: p._id,
    title: p.title,
    slug: p.slug,
    price: p.price,
    discount: p.discount,
    finalPrice: p.discount > 0 ? Math.round(p.price * (1 - p.discount / 100) * 100) / 100 : p.price,
    image: p.images?.[0]?.url,
    rating: p.ratings?.average || 0,
    category: p.category,
  };
}
