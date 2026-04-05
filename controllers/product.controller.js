const Product = require('../models/Product');
const { validationResult } = require('express-validator');

// @desc    Get all products (public, with filters/search/pagination)
// @route   GET /api/products
exports.getProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      brand,
      minPrice,
      maxPrice,
      minRating,
      search,
      sort = '-createdAt',
      tags,
      featured,
    } = req.query;

    const filter = { isActive: true };

    if (category) filter.category = category;
    if (brand) filter.brand = { $regex: brand, $options: 'i' };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (minRating) filter['ratings.average'] = { $gte: Number(minRating) };
    if (tags) filter.tags = { $in: tags.split(',').map((t) => t.trim().toLowerCase()) };
    if (featured === 'true') filter.isFeatured = true;

    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (Number(page) - 1) * Number(limit);

    // Build sort object
    let sortObj = {};
    if (search) {
      sortObj = { score: { $meta: 'textScore' }, ...parseSortString(sort) };
    } else {
      sortObj = parseSortString(sort);
    }

    const [products, total] = await Promise.all([
      Product.find(filter, search ? { score: { $meta: 'textScore' } } : {})
        .sort(sortObj)
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: products,
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

// @desc    Get single product by slug
// @route   GET /api/products/:slug
exports.getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Increment view count (fire and forget)
    Product.updateOne({ _id: product._id }, { $inc: { viewCount: 1 } }).catch(() => {});

    // Track recently viewed for logged-in users
    if (req.user) {
      trackRecentlyViewed(req.user.id, product._id);
    }

    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product (admin)
// @route   POST /api/products
exports.createProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const product = await Product.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A product with this title already exists',
      });
    }
    next(error);
  }
};

// @desc    Update product (admin)
// @route   PATCH /api/products/:id
exports.updateProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A product with this title already exists',
      });
    }
    next(error);
  }
};

// @desc    Delete product (admin)
// @route   DELETE /api/products/:id
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products for admin (includes inactive)
// @route   GET /api/products/admin/all
exports.getAdminProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, category, status } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (status === 'active') filter.isActive = true;
    if (status === 'inactive') filter.isActive = false;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(filter).sort('-createdAt').skip(skip).limit(Number(limit)).lean(),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: products,
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

// @desc    Get product categories with counts
// @route   GET /api/products/categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product brands with counts
// @route   GET /api/products/brands
exports.getBrands = async (req, res, next) => {
  try {
    const brands = await Product.aggregate([
      { $match: { isActive: true, brand: { $ne: null } } },
      { $group: { _id: '$brand', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    res.json({ success: true, data: brands });
  } catch (error) {
    next(error);
  }
};

// @desc    Search autocomplete
// @route   GET /api/products/autocomplete
exports.autocomplete = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.length < 2) {
      return res.json({ success: true, data: [] });
    }

    const products = await Product.find(
      { isActive: true, title: { $regex: q, $options: 'i' } },
      { title: 1, slug: 1, price: 1, images: { $slice: 1 }, category: 1 }
    )
      .limit(8)
      .lean();

    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

// @desc    Get trending products
// @route   GET /api/products/trending
exports.getTrending = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true })
      .sort({ viewCount: -1, 'ratings.average': -1 })
      .limit(8)
      .lean();

    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
exports.getFeatured = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true, isFeatured: true })
      .sort('-createdAt')
      .limit(8)
      .lean();

    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

// @desc    Get related products
// @route   GET /api/products/:slug/related
exports.getRelated = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const related = await Product.find({
      _id: { $ne: product._id },
      isActive: true,
      $or: [{ category: product.category }, { tags: { $in: product.tags } }],
    })
      .limit(6)
      .lean();

    res.json({ success: true, data: related });
  } catch (error) {
    next(error);
  }
};

// Helper: parse sort string like "-price" or "ratings.average"
function parseSortString(sort) {
  const sortObj = {};
  sort.split(',').forEach((field) => {
    if (field.startsWith('-')) {
      sortObj[field.substring(1)] = -1;
    } else {
      sortObj[field] = 1;
    }
  });
  return sortObj;
}

// Helper: track recently viewed products in-memory (simple approach)
const recentlyViewedMap = new Map();
function trackRecentlyViewed(userId, productId) {
  const key = userId.toString();
  if (!recentlyViewedMap.has(key)) {
    recentlyViewedMap.set(key, []);
  }
  const list = recentlyViewedMap.get(key);
  const pid = productId.toString();
  const idx = list.indexOf(pid);
  if (idx > -1) list.splice(idx, 1);
  list.unshift(pid);
  if (list.length > 20) list.pop();
}

// @desc    Get recently viewed products
// @route   GET /api/products/recently-viewed
exports.getRecentlyViewed = async (req, res, next) => {
  try {
    const key = req.user.id.toString();
    const ids = recentlyViewedMap.get(key) || [];
    if (ids.length === 0) {
      return res.json({ success: true, data: [] });
    }

    const products = await Product.find({ _id: { $in: ids }, isActive: true }).lean();

    // Maintain order
    const ordered = ids
      .map((id) => products.find((p) => p._id.toString() === id))
      .filter(Boolean);

    res.json({ success: true, data: ordered });
  } catch (error) {
    next(error);
  }
};

// @desc    Get "Customers Also Bought" recommendations
// @route   GET /api/products/:id/also-bought
exports.getAlsoBought = async (req, res, next) => {
  try {
    const Order = require('../models/Order');
    const productId = req.params.id;

    // Find orders containing this product
    const ordersWithProduct = await Order.find(
      { 'items.product': productId },
      { items: 1 }
    ).limit(50).lean();

    // Collect co-occurring product IDs
    const coProducts = {};
    ordersWithProduct.forEach((order) => {
      order.items.forEach((item) => {
        const pid = item.product.toString();
        if (pid !== productId) {
          coProducts[pid] = (coProducts[pid] || 0) + 1;
        }
      });
    });

    // Sort by frequency and get top 6
    const topIds = Object.entries(coProducts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([id]) => id);

    let products;
    if (topIds.length > 0) {
      products = await Product.find({ _id: { $in: topIds }, isActive: true }).lean();
    } else {
      // Fallback: return trending products in same category
      const currentProduct = await Product.findById(productId).lean();
      products = await Product.find({
        _id: { $ne: productId },
        isActive: true,
        category: currentProduct?.category,
      })
        .sort('-ratings.average')
        .limit(6)
        .lean();
    }

    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};
