# CrunchFit Pro - Developer Quick Reference

## 🚀 Quick Start (5 minutes)

```bash
# 1. Install
npm install

# 2. Copy env
cp .env.example .env

# 3. Edit .env with your credentials
# (MongoDB, Stripe, Cloudinary, Email)

# 4. Start
npm run dev

# Server running on http://localhost:5000
```

---

## 📚 Most Used Commands

### Development
```bash
npm run dev          # Start with hot reload
npm run lint         # Check code quality
npm run format       # Auto-format code
npm start           # Run production
```

### Testing Endpoints
```bash
# Health check
curl http://localhost:5000/api/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@test.com","password":"Test123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"Test123"}'
```

---

## 🗂️ File Navigation Guide

| Need | Find In | File |
|------|---------|------|
| User signup/login | controllers | `auth.controller.js` |
| Gym CRUD | controllers | `gym.controller.js` |
| Class booking | controllers | `class.controller.js` |
| Member subscriptions | controllers | `member.controller.js` |
| Trainer profiles | controllers | `trainer.controller.js` |
| Reviews/ratings | controllers | `review.controller.js` |
| Search feature | controllers | `search.controller.js` |
| User schema | models | `User.js` |
| Gym schema | models | `Gym.js` |
| Class schema | models | `Class.js` |
| Verify JWT | middleware | `auth.js` |
| Check permissions | middleware | `roleCheck.js` |
| Handle errors | middleware | `errorHandler.js` |
| MongoDB config | config | `db.js` |
| Cloudinary setup | config | `cloudinary.js` |
| Stripe setup | config | `stripe.js` |

---

## 🔌 Common API Calls

### Authentication
```javascript
// Register
POST /api/auth/register
{ firstName, lastName, email, password }

// Login
POST /api/auth/login
{ email, password }
// Returns: { token, refreshToken, user }

// Current user
GET /api/auth/me
Headers: { Authorization: "Bearer TOKEN" }
```

### Gyms
```javascript
// Search nearby
GET /api/gyms?lat=40.7128&lng=-74.0060&radius=25

// Get details
GET /api/gyms/gym-slug

// Create gym (gym_owner)
POST /api/gyms
{ name, email, phone, address, ... }

// Upload photos
PUT /api/gyms/:id/photos
Headers: { "Content-Type": "multipart/form-data" }
```

### Members
```javascript
// Join gym
POST /api/members/join
{ gymId, plan: "peak", paymentMethodId }

// Get my membership
GET /api/members/me

// Check in
POST /api/members/checkin
{ gymId }

// Freeze (max 3 months/year)
PATCH /api/members/me/freeze
{ freezeDurationMonths: 1 }

// Cancel
PATCH /api/members/me/cancel
{ reason: "Moving" }
```

### Classes
```javascript
// List classes
GET /api/classes?gymId=xxx&difficulty=beginner

// Book class
POST /api/classes/:id/book
// Returns booking or waitlist position

// Cancel booking (48hr policy)
DELETE /api/classes/:id/cancel-booking

// Check in
POST /api/classes/:id/check-in
```

### Trainers
```javascript
// List trainers
GET /api/trainers?gymId=xxx&minPrice=50&maxPrice=150

// Get availability
GET /api/trainers/:id/availability?startDate=2024-01-01

// Book PT session
POST /api/trainers/:id/book-session
{ scheduledDate: "2024-01-15T10:00:00Z", duration: 60 }
```

### Search
```javascript
// Basic search
GET /api/search?q=yoga

// Advanced search
GET /api/search/advanced?type=gym&filters={"city":"NYC","minRating":4}
```

---

## 🔐 Authentication Usage

### With Headers
```javascript
fetch('http://localhost:5000/api/members/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

### With Cookies (automatic)
```javascript
// Token automatically sent in httpOnly cookie
fetch('http://localhost:5000/api/members/me', {
  credentials: 'include'
})
```

---

## 📦 Adding New Endpoint

### 1. Create Model (if new resource)
```javascript
// models/Resource.js
const schema = new mongoose.Schema({ ... });
module.exports = mongoose.model('Resource', schema);
```

### 2. Create Controller
```javascript
// controllers/resource.controller.js
exports.getResource = async (req, res) => {
  const data = await Resource.findById(req.params.id);
  res.status(200).json({ success: true, data });
};
```

### 3. Create Routes
```javascript
// routes/resource.routes.js
router.get('/:id', getResource);
```

### 4. Mount in Server
```javascript
// server.js
app.use('/api/resources', resourceRoutes);
```

---

## 🧪 Quick Testing

### Using Postman Collection Variables
```javascript
// Set these in Postman:
{{BASE_URL}} → http://localhost:5000/api
{{TOKEN}} → Your JWT token
{{GYM_ID}} → Gym object ID
{{USER_ID}} → User object ID
```

### Using curl Variables
```bash
BASE_URL="http://localhost:5000/api"
TOKEN="your_jwt_token"
GYM_ID="gym_id"

# Usage
curl -H "Authorization: Bearer $TOKEN" \
  $BASE_URL/gyms/$GYM_ID
```

---

## 🐛 Common Issues & Fixes

### MongoDB Connection Failed
```
✗ Check if MongoDB is running
• Local: mongosh
• Atlas: Verify connection string in .env
```

### Port 5000 in Use
```bash
# Kill process
lsof -i :5000
kill -9 <PID>
```

### Token Invalid
```
✗ Token might be expired/malformed
• If expired: Use refresh-token endpoint
• If malformed: Re-login for new token
```

### Cloudinary Upload Fails
```
✗ Check credentials in .env
✗ Verify file size < 20MB
✗ Check MIME type is valid image
```

### Stripe Subscription Failed
```
✗ Verify Stripe API key in .env
✗ Check payment method ID is valid
✗ Ensure Stripe account has test mode enabled
```

---

## 📊 Database Queries Cheatsheet

### Find
```javascript
// Single record
const gym = await Gym.findById(gymId);

// With filters
const gyms = await Gym.find({ isActive: true, rating: { $gte: 4 } });

// With population
const gym = await Gym.findById(gymId).populate('ownerId');

// With projection
const gyms = await Gym.find({}, 'name rating slug');
```

### Update
```javascript
// By ID
const updated = await Gym.findByIdAndUpdate(id, updateData, { new: true });

// Multiple records
await Gym.updateMany({ isActive: false }, { isActive: true });
```

### Delete
```javascript
// By ID
await Gym.findByIdAndDelete(id);

// Soft delete (set flag)
gym.isActive = false;
await gym.save();
```

### Aggregation
```javascript
// Geosearch
await Gym.aggregate([
  {
    $geoNear: {
      near: { type: 'Point', coordinates: [lng, lat] },
      distanceField: 'distance',
      maxDistance: radiusInRadians,
      spherical: true,
    }
  },
  { $match: { isActive: true } },
  { $limit: 10 }
]);
```

---

## 🔑 Environment Variables Setup

```env
# Required for development
MONGODB_URI=mongodb://localhost:27017/fitness_store
JWT_SECRET=generate_with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
REFRESH_TOKEN_SECRET=generate_same_way

# For testing/demo
STRIPE_API_KEY=sk_test_xxxxx
CLOUDINARY_NAME=your_cloud_name
EMAIL_USER=your_email@gmail.com
```

---

## 📞 Getting Help

| Question | Resource |
|----------|----------|
| How do I call endpoint X? | API_DOCUMENTATION.md |
| How do I set up the project? | SETUP_GUIDE.md |
| What features are implemented? | IMPLEMENTATION_CHECKLIST.md |
| Overall project info? | PROJECT_SUMMARY.md |
| Code structure? | README.md |

---

## ⚡ Performance Tips

1. **Use pagination**: Always add `?page=1&limit=20` to list endpoints
2. **Limit populations**: Only populate needed fields
3. **Use projections**: Select only needed fields with second parameter
4. **Cache results**: Redis for frequently accessed data
5. **Index queries**: Verify indexes exist on filter fields
6. **Batch operations**: Use updateMany instead of loops

---

## 🎯 Development Workflow

1. **Start server**
   ```bash
   npm run dev
   ```

2. **Check/fix linting**
   ```bash
   npm run lint
   npm run format
   ```

3. **Make changes**
   - Server auto-reloads via nodemon

4. **Test endpoint**
   ```bash
   curl -X GET http://localhost:5000/api/endpoint
   ```

5. **Commit code**
   ```bash
   git add .
   git commit -m "description"
   ```

---

## 🚀 Deployment Checklist

- [ ] Set NODE_ENV=production
- [ ] Update all .env values
- [ ] Run npm audit (fix vulnerabilities)
- [ ] Test all endpoints in staging
- [ ] Enable HTTPS
- [ ] Update CORS origins
- [ ] Configure logging/monitoring
- [ ] Setup database backups
- [ ] Test payment flow
- [ ] Verify file upload limits

---

## 📁 Key Files to Know

| File | Purpose | When to Edit |
|------|---------|--------------|
| server.js | Main app setup | Add/remove routes |
| package.json | Dependencies | Add npm packages |
| .env | Config | Update credentials |
| .eslintrc.json | Code quality | Adjust rules |
| API_DOCUMENTATION.md | API reference | Document new endpoints |
| models/*.js | Data schemas | Change data structure |
| controllers/*.js | Business logic | Implement features |
| routes/*.js | API routes | Add new routes |
| middleware/*.js | Request handling | Add validation/auth |

---

## 💡 Code Examples

### Create & Save Document
```javascript
const gym = await Gym.create({
  name: 'Crunch Fitness',
  ownerId: userId,
  address: { city: 'NYC', country: 'USA' },
  isActive: true,
});
```

### Use Middleware (Protected Route)
```javascript
router.get(
  '/:id',
  verifyToken,           // Check JWT
  authorize('admin'),    // Check role
  getGymController       // Handler
);
```

### Response Format
```javascript
res.status(200).json({
  success: true,
  message: 'Operation successful',
  data: { /* your data */ }
});
```

### Error Response
```javascript
res.status(400).json({
  success: false,
  message: 'Validation failed',
  errors: validationResult(req).array()
});
```

---

**Last Updated:** March 24, 2026
**Version:** 1.0 Complete
**Status:** Production Ready
