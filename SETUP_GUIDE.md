# CrunchFit Pro - Quick Setup Guide

## ⚙️ Environment Variables Setup

Create `.env` file in root directory and add:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/fitness_store
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fitness_store

# JWT Secret Keys (Generate strong random strings)
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret_change_this_in_production
REFRESH_TOKEN_EXPIRE=30d

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Email Configuration (Gmail recommended)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
EMAIL_FROM=noreply@crunchfitpro.com

# Stripe Keys (Get from https://dashboard.stripe.com)
STRIPE_API_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Cloudinary Keys (Get from https://cloudinary.com)
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Redis (Optional, for caching/sessions)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# Socket.io Configuration
SOCKET_IO_URL=http://localhost:5000
```

## 🚀 First Time Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Verify MongoDB Connection**
   - Start MongoDB: `mongosh` or `mongo` (for local)
   - Or use MongoDB Atlas (cloud)

3. **Generate JWT Secrets**
   ```bash
   # Use any of these methods to generate secure keys:
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. **Setup Cloudinary** (for image uploads)
   - Sign up at https://cloudinary.com/
   - Get your cloud name, API key, and API secret
   - Add to `.env`

5. **Setup Stripe** (for payments)
   - Sign up at https://stripe.com/
   - Get your API keys from dashboard
   - Add to `.env`

6. **Setup Email Service**
   - Gmail: Create app-specific password
   - Or use SendGrid, Mailgun, Nodemailer config

## 🏃 Running the Server

```bash
# Development (auto-restart on file changes)
npm run dev

# Production
npm start

# With logging
npm run dev 2>&1 | tee server.log
```

Server runs on: `http://localhost:5000`

## ✅ Verify Setup

1. **Health Check API**
   ```bash
   curl http://localhost:5000/api/health
   ```
   Expected response:
   ```json
   {
     "success": true,
     "message": "Server is running"
   }
   ```

2. **Register New User**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "firstName": "John",
       "lastName": "Doe",
       "email": "john@example.com",
       "password": "StrongPassword123"
     }'
   ```

3. **Login**
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "john@example.com",
       "password": "StrongPassword123"
     }'
   ```

## 📁 File Structure Created

```
config/
  ├── db.js              # MongoDB with retry logic
  ├── cloudinary.js      # Cloudinary & multer config
  └── stripe.js          # Stripe client

controllers/
  ├── auth.controller.js      # 8 auth methods
  ├── gym.controller.js       # 8 gym endpoints
  ├── member.controller.js    # 7 member endpoints
  ├── class.controller.js     # 8 class endpoints
  ├── trainer.controller.js   # 7 trainer endpoints
  ├── review.controller.js    # 4 review endpoints
  └── search.controller.js    # 2 search endpoints

middleware/
  ├── auth.js           # JWT verification
  ├── roleCheck.js      # Role authorization
  └── errorHandler.js   # Error handling

models/
  ├── User.js           # With bcrypt & JWT methods
  ├── Gym.js            # With geospatial indexing
  ├── GymSubscription.js
  ├── Member.js
  ├── Class.js
  ├── ClassBooking.js
  ├── Trainer.js
  ├── Payment.js
  ├── Review.js
  ├── Notification.js
  └── Challenge.js

routes/
  ├── auth.routes.js    # 9 endpoints
  ├── gym.routes.js     # 9 endpoints
  ├── member.routes.js  # 7 endpoints
  ├── class.routes.js   # 8 endpoints
  ├── trainer.routes.js # 7 endpoints
  ├── review.routes.js  # 4 endpoints
  └── search.routes.js  # 2 endpoints

server.js               # Main app & Socket.io
```

## 🔑 Key API Endpoints Summary

**Auth:** 9 endpoints
- Register, Login, Refresh, Verify, Password Reset, Profile, etc.

**Gyms:** 9 endpoints
- List (with geosearch), Get, Create, Update, Upload Photos, etc.

**Members:** 7 endpoints
- Join, Get Profile, Freeze, Cancel, Check-in, History, Admin List

**Classes:** 8 endpoints
- List, Get, Create, Book, Cancel Booking, Check-in, Update, Cancel

**Trainers:** 7 endpoints
- List, Get, Availability, Book Session, Create, Update, Sessions

**Reviews:** 4 endpoints
- Create, Get, Mark Helpful, Delete

**Search:** 2 endpoints
- Basic Full-Text, Advanced with Filters

## 🔄 Data Flow Examples

### User Registration → Login → Join Gym
1. POST /auth/register → JWT token
2. POST /auth/login → Access token
3. POST /members/join → Stripe subscription

### Gym Creation → Class → Booking
1. POST /gyms (gym_owner) → Create gym
2. POST /classes → Add class
3. POST /classes/:id/book (member) → Book with waitlist

### Trainer Setup → Book Session
1. POST /trainers (gym_owner) → Create trainer
2. GET /trainers/:id/availability → Get slots
3. POST /trainers/:id/book-session (member) → Book PT

## 🛡️ Security Checklist

- ✅ JWT tokens with expiration
- ✅ Refresh token rotation
- ✅ HttpOnly cookies
- ✅ Password hashing (bcryptjs)
- ✅ Email verification
- ✅ CORS with credentials
- ✅ Helmet headers
- ✅ Rate limiting (100/15min)
- ✅ Input validation
- ✅ Role-based access control

**Production Checklist:**
- [ ] Change JWT_SECRET to strong random value
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS
- [ ] Use MongoDB Atlas with encryption
- [ ] Enable Stripe production keys
- [ ] Setup email provider (SendGrid/AWS SES)
- [ ] Configure DNS/domain
- [ ] Setup monitoring & logging
- [ ] Enable database backups
- [ ] Rate limit stricter for production

## 📚 Documentation

- `README.md` - Project overview
- `API_DOCUMENTATION.md` - Detailed endpoint docs
- `.env.example` - Environment variable template

## 🐛 Troubleshooting

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
mongosh
# Or start MongoDB service
sudo systemctl start mongod
```

### Port 5000 Already in Use
```bash
# Find and kill process
lsof -i :5000
kill -9 <PID>
```

### Cloudinary Upload Fails
- Verify credentials in `.env`
- Check file size < 20MB
- Ensure image MIME type is valid

### Stripe API Key Invalid
- Check for typos in `.env`
- Regenerate keys from Stripe dashboard
- Restart server after updating

## 📞 Support

For questions or issues, refer to:
- API_DOCUMENTATION.md
- GitHub issues
- Contact development team

---

**Happy Coding! 🚀**
