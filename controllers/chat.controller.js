const Product = require('../models/Product');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

const natural = require('natural');

// Initialize NLP Classifier
const classifier = new natural.BayesClassifier();

// 1. Product Search
const searchPhrases = [
  'show', 'find', 'search', 'looking for', 'get me', 'i want', 'i need',
  'discover', 'browse', 'explore', 'display', 'list', 'give me', 'fetch',
  'see', 'lookup', 'look up', 'view products', 'show me items',
  'find products', 'search products', 'show me stuff', 'show items',
  'what do you have', 'give me products', 'i want products',
];
searchPhrases.forEach(p => classifier.addDocument(p, 'search'));

// 2. Price-based Search
const pricePhrases = [
  'under', 'below', 'less than', 'cheaper than', 'up to', 'max price',
  'above', 'over', 'more than', 'greater than', 'minimum price',
  'between', 'price range', 'budget', 'affordable', 'cheap', 'cheapest',
  'inexpensive', 'low price', 'low cost', 'expensive', 'premium',
  'high end', 'luxury', 'pricey', 'cost less', 'cost more',
  'products under', 'items under', 'products below', 'items below',
  'products above', 'items above', 'show me under', 'show below',
  'show under', 'products for less', 'items for less',
];
pricePhrases.forEach(p => classifier.addDocument(p, 'price_search'));

// 3. Add to Cart
const addToCartPhrases = [
  'add to cart', 'put in cart', 'buy', 'purchase', 'add this', 'cart it',
  'grab one', 'buy this', 'order this', 'get this', 'add item',
  'add product', 'put in basket', 'add to basket', 'i will take',
];
addToCartPhrases.forEach(p => classifier.addDocument(p, 'add_to_cart'));

// 4. View Cart
const viewCartPhrases = [
  'cart', 'my cart', 'what is in my cart', 'view cart', 'show cart',
  'cart items', 'basket', 'my basket', 'shopping cart', 'shopping bag',
  'bag', 'trolley', 'kart', 'whats in cart', 'check cart',
];
viewCartPhrases.forEach(p => classifier.addDocument(p, 'view_cart'));

// 5. Order Query
const orderPhrases = [
  'order', 'my orders', 'order status', 'track', 'where is my',
  'delivery status', 'track shipping', 'tracking', 'shipment',
  'shipped', 'dispatched', 'parcel', 'package', 'consignment',
  'where is my order', 'order history', 'past orders', 'recent orders',
];
orderPhrases.forEach(p => classifier.addDocument(p, 'order'));

// 6. Recommendations
const recommendPhrases = [
  'recommend', 'suggestion', 'trending', 'popular', 'best', 'top products',
  'suggest me', 'suggested', 'recommendations', 'best seller', 'bestseller',
  'best selling', 'top rated', 'top picks', 'hot products', 'featured',
  'must have', 'must buy', 'picks for me', 'whats hot', 'hot items',
  'what should i buy', 'what is popular', 'fame', 'famous',
];
recommendPhrases.forEach(p => classifier.addDocument(p, 'recommend'));

// 7. Categories
const categoryPhrases = [
  'category', 'categories', 'what do you sell', 'what products',
  'types of products', 'departments', 'sections', 'collections',
  'product types', 'what kind', 'what sort', 'what type',
  'genre', 'genres', 'catagory', 'catagories',
];
categoryPhrases.forEach(p => classifier.addDocument(p, 'category'));

// 8. Help / FAQ
const helpPhrases = [
  'help', 'support', 'faq', 'how do i', 'how to', 'assist', 'need help',
  'guide', 'tutorial', 'instructions', 'tell me how', 'explain',
  'what can you do', 'how does this work', 'help me',
];
helpPhrases.forEach(p => classifier.addDocument(p, 'help'));

// 9. Policies (Shipping/Returns)
const policyPhrases = [
  'shipping', 'delivery', 'return', 'refund', 'send back', 'exchange',
  'policy', 'policies', 'warranty', 'guarantee', 'replacement',
  'shipping cost', 'delivery time', 'return policy', 'refund policy',
  'exchange policy', 'terms', 'conditions',
];
policyPhrases.forEach(p => classifier.addDocument(p, 'policy'));

classifier.train();

// Helper: detect if message contains a price/range pattern
function hasPricePattern(msg) {
  return (
    /\b(under|below|less than|cheaper than|up to|max|maximum)\s*\$?\s*\d+/.test(msg) ||
    /\b(above|over|more than|greater than|min|minimum|atleast|at least|starting)\s*\$?\s*\d+/.test(msg) ||
    /\b(between)\s*\$?\s*\d+\s*(and|to|-)\s*\$?\s*\d+/.test(msg) ||
    /\$\d+/.test(msg) ||
    /\b(cheap|budget|affordable|inexpensive|low price|low cost|cheapest)\b/.test(msg) ||
    /\b(expensive|premium|high end|highend|luxury|pricey)\b/.test(msg) ||
    /\b(price range|price under|price below|price above|price over|cost less|cost more)\b/.test(msg)
  );
}

// Helper to determine intent with confidence score
function classifyIntent(msg) {
  // Price-based queries should always route to price_search regardless of other words
  if (hasPricePattern(msg)) return 'price_search';

  // Check exact matches via regex/substring first to not break existing strict keywords
  if (matchesIntent(msg, ['show', 'find', 'search', 'looking for', 'get me', 'i want', 'i need',
                           'discover', 'browse', 'explore', 'display', 'list', 'give me',
                           'fetch', 'see', 'lookup', 'look up', 'view products'])) return 'search';
  if (matchesIntent(msg, ['add to cart', 'put in cart', 'buy', 'purchase', 'add this',
                           'cart it', 'grab one', 'add item', 'add product'])) return 'add_to_cart';
  if (matchesIntent(msg, ['cart', 'my cart', "what's in my cart", 'view cart', 'show cart',
                           'basket', 'shopping bag', 'shopping cart', 'trolley', 'bag'])) return 'view_cart';
  if (matchesIntent(msg, ['order', 'my orders', 'order status', 'track', 'where is my',
                           'tracking', 'shipment', 'shipped', 'dispatched', 'parcel',
                           'package', 'order history'])) return 'order';
  if (matchesIntent(msg, ['recommend', 'suggestion', 'trending', 'popular', 'best',
                           'suggest', 'suggested', 'bestseller', 'best seller',
                           'top rated', 'top picks', 'hot products', 'featured',
                           'must have', 'picks for me', 'whats hot'])) return 'recommend';
  if (matchesIntent(msg, ['category', 'categories', 'what do you sell', 'what products',
                           'types of products', 'departments', 'sections', 'collections',
                           'product types', 'what kind', 'what sort', 'what type'])) return 'category';
  if (matchesIntent(msg, ['help', 'support', 'faq', 'how do i', 'how to', 'assist',
                           'guide', 'tutorial', 'instructions', 'what can you do'])) return 'help';
  if (matchesIntent(msg, ['shipping', 'delivery', 'return', 'refund', 'exchange',
                           'policy', 'warranty', 'guarantee', 'replacement',
                           'terms', 'conditions'])) return 'policy';

  // Fallback to NLP probability
  const classification = classifier.getClassifications(msg);
  if (classification.length > 0 && classification[0].value > 0.05) {
    return classification[0].label;
  }
  return 'default';
}

function matchesIntent(msg, keywords) {
  // Use NLP Jaro-Winkler string similarity for typos
  return keywords.some((kw) => {
    if (msg.includes(kw)) return true;
    const words = msg.split(' ');
    return words.some(word => natural.JaroWinklerDistance(word, kw) > 0.85);
  });
}

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

    const intent = classifyIntent(lowerMsg);

    // Intent routing
    switch(intent) {
      case 'search':
        response = await handleProductSearch(lowerMsg, req.user);
        break;
      case 'price_search':
        response = await handleProductSearch(lowerMsg, req.user);
        break;
      case 'add_to_cart':
        response = await handleAddToCart(lowerMsg, req.user);
        break;
      case 'view_cart':
        response = await handleViewCart(req.user);
        break;
      case 'order':
        response = await handleOrderQuery(lowerMsg, req.user);
        break;
      case 'recommend':
        response = await handleRecommendations(lowerMsg);
        break;
      case 'category':
        response = await handleCategories();
        break;
      case 'help':
        response = handleFAQ(lowerMsg);
        break;
      case 'policy':
        response = handlePolicies(lowerMsg);
        break;
      default:
        response = handleDefault();
    }

    res.json({ success: true, data: response });
  } catch (error) {
    console.error('Chat error:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Chat request failed' });
  }
};

// ============= Intent Handlers =============

async function handleProductSearch(msg, user) {
  // --- Comprehensive price extraction ---
  const filter = { isActive: true };
  let priceMin = null;
  let priceMax = null;
  let priceLabel = '';

  // "under $50", "below 50", "less than 50", "cheaper than 50", "up to 50", "max 50"
  const underMatch = msg.match(/(?:under|below|less than|cheaper than|up to|max|maximum)\s*\$?\s*(\d+(?:\.\d+)?)/i);
  if (underMatch) priceMax = Number(underMatch[1]);

  // "above $50", "over 50", "more than 50", "greater than 50", "min 50", "starting 50", "atleast 50"
  const aboveMatch = msg.match(/(?:above|over|more than|greater than|min|minimum|atleast|at least|starting|starts? from)\s*\$?\s*(\d+(?:\.\d+)?)/i);
  if (aboveMatch) priceMin = Number(aboveMatch[1]);

  // "between 20 and 80", "between $20 to $80", "from 20 to 80", "20-80", "$20-$80"
  const betweenMatch = msg.match(/(?:between|from)\s*\$?\s*(\d+(?:\.\d+)?)\s*(?:and|to|-)\s*\$?\s*(\d+(?:\.\d+)?)/i);
  if (betweenMatch) {
    priceMin = Number(betweenMatch[1]);
    priceMax = Number(betweenMatch[2]);
  }

  // Range shorthand: "20-80" or "$20-$80" (without between/from prefix)
  if (!betweenMatch) {
    const rangeMatch = msg.match(/\$?(\d+(?:\.\d+)?)\s*-\s*\$?(\d+(?:\.\d+)?)/);
    if (rangeMatch) {
      priceMin = Number(rangeMatch[1]);
      priceMax = Number(rangeMatch[2]);
    }
  }

  // Keyword-based price defaults for vague terms
  if (priceMin === null && priceMax === null) {
    if (/\b(cheap|budget|affordable|inexpensive|low price|low cost|cheapest|economical|bargain)\b/.test(msg)) {
      priceMax = 50;
      priceLabel = 'budget-friendly (under $50)';
    } else if (/\b(expensive|premium|high end|highend|luxury|pricey|top tier|deluxe)\b/.test(msg)) {
      priceMin = 100;
      priceLabel = 'premium (over $100)';
    } else if (/\b(mid range|midrange|moderate|medium price|average price)\b/.test(msg)) {
      priceMin = 30;
      priceMax = 100;
      priceLabel = 'mid-range ($30–$100)';
    }
  }

  // Apply price constraints
  if (priceMin !== null || priceMax !== null) {
    filter.price = {};
    if (priceMin !== null) filter.price.$gte = priceMin;
    if (priceMax !== null) filter.price.$lte = priceMax;
  }

  // Extract category with fuzzy matching
  const categories = [
    'supplements', 'equipment', 'apparel', 'accessories',
    'nutrition', 'recovery', 'cardio', 'strength', 'yoga',
  ];
  // Direct match
  let foundCat = categories.find((c) => msg.includes(c));
  // Fuzzy match for misspellings
  if (!foundCat) {
    const words = msg.split(/\s+/);
    for (const word of words) {
      for (const cat of categories) {
        if (word.length >= 3 && natural.JaroWinklerDistance(word, cat) > 0.85) {
          foundCat = cat;
          break;
        }
      }
      if (foundCat) break;
    }
  }
  if (foundCat) filter.category = foundCat;

  // Build text search from remaining words
  const stopWords = [
    'show', 'me', 'find', 'get', 'i', 'want', 'need', 'looking', 'for',
    'under', 'below', 'above', 'over', 'less', 'than', 'more', 'greater',
    'cheaper', 'between', 'from', 'and', 'to', 'price', 'priced',
    'the', 'a', 'an', 'some', 'any', 'all', 'products', 'items',
    'product', 'item', 'cheap', 'budget', 'affordable', 'expensive',
    'premium', 'luxury', 'pricey', 'up', 'max', 'min', 'minimum',
    'maximum', 'at', 'least', 'starting', 'range', 'cost',
    'display', 'list', 'browse', 'search', 'view', 'give',
    'fetch', 'see', 'explore', 'discover', 'look', 'lookup',
    'stuff', 'things', 'goods', 'gear', 'of', 'with', 'in',
    'inexpensive', 'low', 'high', 'end', 'mid', 'midrange', 'moderate',
  ];
  const searchTerms = msg
    .split(/\s+/)
    .filter((w) => !stopWords.includes(w) && !w.startsWith('$') && !/^\d+(\.\d+)?$/.test(w) && w.length > 1)
    .join(' ')
    .trim();

  let products;
  const hasFilters = filter.price || filter.category;

  if (searchTerms && !filter.category) {
    // Try text search combined with price filter
    products = await Product.find(
      { ...filter, title: { $regex: searchTerms.split(' ').join('|'), $options: 'i' } },
      null,
      { limit: 12 }
    ).lean();
  }

  if (!products || products.length === 0) {
    // Fetch by filters only (price/category) or general
    products = await Product.find(filter).sort('-ratings.average').limit(12).lean();
  }

  if (products.length === 0) {
    // Build helpful message
    let noResultMsg = "I couldn't find products matching your search.";
    if (priceMax) noResultMsg = `I couldn't find any products under $${priceMax}.`;
    if (priceMin && !priceMax) noResultMsg = `I couldn't find any products above $${priceMin}.`;
    if (priceMin && priceMax) noResultMsg = `I couldn't find any products between $${priceMin} and $${priceMax}.`;
    return {
      type: 'text',
      message: noResultMsg + ' Try a different price range or browse our categories!',
      suggestions: ['Show me trending products', 'What categories do you have?', 'Show products under $100'],
    };
  }

  // Build a descriptive response message
  let responseMsg = `I found ${products.length} product${products.length > 1 ? 's' : ''}`;
  if (priceMax && !priceMin) responseMsg += ` under $${priceMax}`;
  else if (priceMin && !priceMax) responseMsg += ` above $${priceMin}`;
  else if (priceMin && priceMax) responseMsg += ` between $${priceMin} and $${priceMax}`;
  else if (priceLabel) responseMsg += ` (${priceLabel})`;
  if (foundCat) responseMsg += ` in ${foundCat}`;
  responseMsg += ':';

  // Build context-aware suggestions
  const suggestions = [];
  if (priceMax && priceMax < 100) suggestions.push(`Show products under $${priceMax + 50}`);
  if (priceMin) suggestions.push(`Show products under $${priceMin}`);
  if (!priceMax) suggestions.push('Show budget products');
  if (!priceMin) suggestions.push('Show premium products');
  if (suggestions.length < 3) suggestions.push('Show me trending products');

  return {
    type: 'products',
    message: responseMsg,
    products: products.map(formatProduct),
    suggestions: suggestions.slice(0, 3),
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
  if (/trending|popular|populer|fame|famous|hot|whats hot/.test(msg)) {
    products = await Product.find({ isActive: true }).sort('-viewCount').limit(6).lean();
  } else if (/top rated|highest rated|best rated|best review/.test(msg)) {
    products = await Product.find({ isActive: true }).sort('-ratings.average').limit(6).lean();
  } else if (/best seller|bestseller|most sold|most bought/.test(msg)) {
    products = await Product.find({ isActive: true }).sort('-purchaseCount -viewCount').limit(6).lean();
  } else if (/newest|new arrival|just arrived|latest|recent/.test(msg)) {
    products = await Product.find({ isActive: true }).sort('-createdAt').limit(6).lean();
  } else {
    products = await Product.find({ isActive: true }).sort('-ratings.average').limit(6).lean();
  }

  return {
    type: 'products',
    message: 'Here are some popular picks:',
    products: products.map(formatProduct),
    suggestions: ['Show me supplements', 'Show products under $50', 'Show me equipment'],
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
  const isShipping = /shipping|shippng|ship|delivery|delivry|deliver|dispatch|postage|freight/.test(msg);
  const isReturn = /return|refund|refnd|send back|exchange|replacement|money back/.test(msg);
  const isWarranty = /warranty|guarantee|protection|insur/.test(msg);

  if (isShipping) {
    return {
      type: 'text',
      message: '🚚 We offer free shipping on orders over $50. Standard delivery takes 3-5 business days. Express shipping (1-2 days) is available for $12.99.',
      suggestions: ['Return policy', 'Track my order'],
    };
  }
  if (isReturn) {
    return {
      type: 'text',
      message: '↩️ Returns are accepted within 30 days of delivery for unused items in original packaging. Refunds are processed within 5-7 business days.',
      suggestions: ['Shipping info', 'Track my order'],
    };
  }
  if (isWarranty) {
    return {
      type: 'text',
      message: '🛡️ Product warranties vary by manufacturer. Most fitness equipment comes with a 1-year warranty. Contact us for warranty claims.',
      suggestions: ['Return policy', 'Shipping info'],
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
