const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const http = require('http');
const socketIO = require('socket.io');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth.routes');
const gymRoutes = require('./routes/gym.routes');
const memberRoutes = require('./routes/member.routes');
const memberExtendedRoutes = require('./routes/member-extended.routes');
const classRoutes = require('./routes/class.routes');
const trainerRoutes = require('./routes/trainer.routes');
const reviewRoutes = require('./routes/review.routes');
const searchRoutes = require('./routes/search.routes');
const paymentRoutes = require('./routes/payment.routes');
const webhookRoutes = require('./routes/webhook.routes');
const notificationRoutes = require('./routes/notification.routes');
const adminRoutes = require('./routes/admin.routes');
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const wishlistRoutes = require('./routes/wishlist.routes');
const chatRoutes = require('./routes/chat.routes');
const aiRoutes = require('./routes/ai.routes');
const challengeRoutes = require('./routes/challenge.routes');
const nutritionRoutes = require('./routes/nutrition.routes');
const communityRoutes = require('./routes/community.routes');
const contentRoutes = require('./routes/content.routes');

// Import Socket.io handlers
const socketHandlers = require('./socket/handlers');

// Import Cloudinary config
const { uploadGymPhotos } = require('./config/cloudinary');
const { verifyToken } = require('./middleware/auth');
const { authorize } = require('./middleware/roleCheck');

// Initialize app
const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
];

const normalizedAllowedOrigins = [...new Set(allowedOrigins.filter(Boolean))];

const isAllowedOrigin = (origin) => {
  // Allow non-browser tools (curl/Postman/server-to-server) with no Origin header.
  if (!origin) return true;

  if (normalizedAllowedOrigins.includes(origin)) {
    return true;
  }

  // Allow local Vite/dev frontends on any localhost/127.0.0.1 port.
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
};

const corsOptions = {
  origin(origin, callback) {
    if (isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

const io = socketIO(server, {
  cors: {
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  },
});

// Connect to MongoDB
connectDB();

// Trust proxy
app.set('trust proxy', 1);

// CORS Configuration
app.use(cors(corsOptions));

// Helmet (security headers)
app.use(helmet());

// Morgan (logging)
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // relaxed in dev
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// IMPORTANT: Webhook must be BEFORE body parser to access raw body for signature verification
app.use('/api/webhooks', webhookRoutes);

// Body parser (after webhook)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Cookie parser
app.use(cookieParser());

// Make io accessible to request handlers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Root route - API documentation
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Fitness Store Backend API',
    version: '1.0.0',
    status: 'Running',
    timestamp: new Date(),
    endpoints: {
      auth: '/api/auth',
      gyms: '/api/gyms',
      members: '/api/members',
      members_extended: '/api/members-ext',
      classes: '/api/classes',
      trainers: '/api/trainers',
      reviews: '/api/reviews',
      search: '/api/search',
      payments: '/api/payments',
      notifications: '/api/notifications',
      admin: '/api/admin',
      products: '/api/products',
      cart: '/api/cart',
      orders: '/api/orders',
      wishlist: '/api/wishlist',
      chat: '/api/chat',
      ai: '/api/ai',
      challenges: '/api/challenges',
      nutrition: '/api/nutrition',
      community: '/api/community',
      content: '/api/content',
      webhooks: '/api/webhooks',
      health: '/api/health'
    },
    documentation: 'See API_DOCUMENTATION.md for endpoint details'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/gyms', gymRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/members-ext', memberExtendedRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/content', contentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Initialize Socket.io event handlers
socketHandlers.initializeHandlers(io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

module.exports = { app, server, io };
