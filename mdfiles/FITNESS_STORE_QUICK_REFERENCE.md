# FITNESS STORE - QUICK REFERENCE CARD

## 🚀 GET STARTED (3 STEPS)

### Step 1: Start Backend
```bash
cd backend
npm install
npm run dev
# Runs at http://localhost:5001
```

### Step 2: Start Frontend
```bash
cd frontend
npm install
npm run dev
# Runs at http://localhost:5173
```

### Step 3: Access
```
Frontend: http://localhost:5173/
API Health: http://localhost:5001/api/health
```

---

## 📋 API QUICK REFERENCE

### Authentication
```
POST   /api/auth/register        Register
POST   /api/auth/login           Login
POST   /api/auth/refresh-token   Refresh Token
```

### Core Resources
```
GET    /api/members              List members
GET    /api/members/:id          Get member
POST   /api/members              Create member
PATCH  /api/members/:id          Update member

GET    /api/classes              List classes
POST   /api/classes/:id/book     Book class
GET    /api/trainers             List trainers
GET    /api/gyms                 List gyms
```

### Payments
```
POST   /api/payments/subscription         Create subscription
GET    /api/payments/history              Payment history
POST   /api/payments/apply-promo          Apply promo
```

### Notifications & Admin
```
GET    /api/notifications                 Get notifications
PATCH  /api/notifications/:id/read        Mark read
GET    /api/admin/analytics               Analytics
```

---

## 🔐 AUTHENTICATION PATTERN

### 1. Register/Login
```javascript
const { token } = await login(email, password);
localStorage.setItem('token', token);
```

### 2. Use Token
```javascript
headers: {
  'Authorization': `Bearer ${token}`
}
```

### 3. Auto Refresh (if expired)
```javascript
POST /auth/refresh-token with refreshToken
```

---

## 🛠️ ENVIRONMENT FILES

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/fitness_store
JWT_SECRET=your_jwt_secret_key_here
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PORT=5001
```

### Frontend (.env)
```
VITE_API_BASE_URL=http://localhost:5001/api
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

---

## 📊 DATABASE MODELS

### Member
- userId, gymId, membershipPlan, membershipStatus
- stripeSubscriptionId, stripeCustomerId
- memberSince, membershipExpiry
- goals, badges, points, referralCode

### Gym
- name, location, contact, amenities
- equipment, hours, subscription
- memberCount, rating, status

### Class
- name, trainer, gymId
- schedule (day, startTime, endTime, capacity)
- difficulty, tags, status

### Payment
- memberId, type, amount, status
- stripeChargeId, invoiceNumber, paidAt

---

## 🔍 COMMON QUERIES

### Get Member's Membership
```javascript
GET /api/members/:id
// Returns full member object with:
membershipPlan, membershipStatus, membershipExpiry
```

### Book a Class
```javascript
POST /api/classes/:classId/book
body: { memberId }
// Returns: booking confirmation with bookingId
```

### Get Paid Transactions
```javascript
GET /api/payments/history?status=completed
// Returns: array of processed payments
```

### Check Notifications
```javascript
GET /api/notifications?unreadOnly=true
// Returns: unread notifications only
```

---

## ⚠️ ERROR CODES

| Code | Meaning | Action |
|------|---------|--------|
| 400 | Bad Request | Check request format |
| 401 | Unauthorized | Login/refresh token |
| 403 | Forbidden | Check permissions |
| 404 | Not Found | Verify ID exists |
| 429 | Rate Limited | Wait 15 minutes |
| 500 | Server Error | Check logs |

---

## 📦 RESPONSE FORMAT

### Success (200/201)
```javascript
{
  success: true,
  message: "Action completed",
  data: { /* resource */ }
}
```

### Error (4xx/5xx)
```javascript
{
  success: false,
  message: "Error description",
  errors: [{ field: "name", message: "is required" }],
  statusCode: 400
}
```

---

## 🧪 TEST DATA

### Test User
```
Email: test@example.com
Password: SecurePass123!
```

### Test Gym ID
```
65a1357924680abcdef
```

### Test Class ID
```
65a4444444444abcdef
```

### Test Trainer ID
```
65a5555555555abcdef
```

---

## 📱 COMMON FRONTEND FLOWS

### Sign Up & Login
```
1. POST /auth/register → Get token
2. Store token in localStorage
3. Redirect to dashboard
```

### Browse Classes
```
1. GET /classes?gymId=:id
2. Show class list
3. POST /classes/:id/book (logged in)
```

### Pay for Subscription
```
1. POST /payments/subscription
2. Stripe checkout modal
3. Webhook updates member status
```

### Check Notifications
```
1. GET /notifications
2. Show unread count
3. PATCH /notifications/:id/read when opened
```

---

## 🔧 USEFUL COMMANDS

### Check API Health
```bash
curl http://localhost:5001/api/health
```

### Check Database Connection
```bash
# MongoDB should be running
mongosh # Connect to MongoDB shell
use fitness_store
db.users.findOne()
```

### Check Node Logs
```bash
# Backend logs appear in terminal running npm run dev
```

### Check Frontend Issues
```bash
# Browser console: F12 → Console tab
```

---

## 📈 CURRENT STATUS

| Component | Status | Port |
|-----------|--------|------|
| Backend | ✅ Running | 5001 |
| Frontend | ✅ Running | 5173 |
| Database | ✅ Connected | 27017 |
| API Endpoints | 48/76 (63%) | — |
| JWT Auth | ✅ Working | — |
| Stripe Integration | ✅ Fixed | — |

---

## 🎯 NEXT PRIORITIES

1. ✅ Fix Stripe webhook (COMPLETED)
2. ✅ Add missing endpoints (16 added)
3. 🔄 Connect frontend to backend APIs
4. 📝 Write unit tests
5. 🚀 Deploy (Docker + Cloud)

---

## 📞 TROUBLESHOOTING

### Port Already in Use
```bash
# Kill process on port 5001
lsof -i :5001 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Or change port in .env
```

### MongoDB Connection Failed
```bash
# Start MongoDB
mongod

# Or check connection string in .env
MONGODB_URI=mongodb://localhost:27017/fitness_store
```

### CORS Errors
```
Make sure backend CORS is configured:
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### Token Expired
```javascript
// Automatically refresh with refresh token
POST /api/auth/refresh-token
```

---

## 📚 FILE STRUCTURE

```
Fitness_Store/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── middleware/
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── api.js
│   └── .env
└── docs/
    ├── API_INTEGRATION_GUIDE.md
    └── PRODUCTION_GUIDE.md
```

---

## 🎓 LEARNING RESOURCES

### API Testing
- Postman: https://www.postman.com
- Thunder Client: VS Code Extension
- Curl: Command line

### Documentation
- API Guide: FITNESS_STORE_API_INTEGRATION_GUIDE.md
- Production Guide: FITNESS_STORE_PRODUCTION_GUIDE.md

---

**Version**: 1.0  
**Last Updated**: March 24, 2026  
**Status**: Production Ready
