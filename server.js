require('dotenv').config();
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

// Import Socket.io handlers
const socketHandlers = require('./socket/handlers');

// Import Cloudinary config
const { uploadGymPhotos } = require('./config/cloudinary');
const { verifyToken } = require('./middleware/auth');
const { authorize } = require('./middleware/roleCheck');

// Initialize app
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
});

// Connect to MongoDB
connectDB();

// Trust proxy
app.set('trust proxy', 1);

// CORS Configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Helmet (security headers)
app.use(helmet());

// Morgan (logging)
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
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
