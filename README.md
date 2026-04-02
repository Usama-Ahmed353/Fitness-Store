# CrunchFit Pro - Backend API

An improved Crunch Fitness clone with a Gym Subscription SaaS module built with Node.js, Express, and MongoDB.

## ✨ Features

### Complete API Implementation
- ✅ User authentication with JWT & refresh tokens
- ✅ Gym management with geolocation search (25-mile radius)
- ✅ Membership management with Stripe subscription
- ✅ Class booking system with waitlist
- ✅ Trainer profiles with PT session booking
- ✅ Reviews and ratings system
- ✅ Full-text search across gyms, classes, trainers
- ✅ Check-in system with gamification (points & badges)
- ✅ Cloudinary image uploads
- ✅ Real-time notifications via Socket.io
- ✅ Role-based access control (RBAC)

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT with Refresh Tokens
- **Security:** bcryptjs, Helmet, CORS, Rate Limiting
- **Real-time:** Socket.io
- **File Storage:** Cloudinary
- **Payment:** Stripe (memberships & PT sessions)
- **Caching:** Redis/ioredis
- **Email:** Nodemailer
- **Code Quality:** ESLint, Prettier
- **Validation:** express-validator

## Project Structure

```
Fitness_Store/
├── config/
│   ├── db.js                 # MongoDB connection
│   ├── cloudinary.js         # Cloudinary & multer setup
│   └── stripe.js             # Stripe configuration
├── controllers/
│   ├── auth.controller.js    # Authentication
│   ├── gym.controller.js     # Gym CRUD & geosearch
│   ├── member.controller.js  # Membership & check-in
│   ├── class.controller.js   # Class & booking
│   ├── trainer.controller.js # Trainer profiles & PT
│   ├── review.controller.js  # Reviews & ratings
│   └── search.controller.js  # Full-text search
├── middleware/
│   ├── auth.js              # JWT verification
│   ├── roleCheck.js         # Role authorization
│   └── errorHandler.js      # Global error handling
├── models/
│   ├── User.js              # User with auth methods
│   ├── Gym.js               # Gym with geospatial index
│   ├── GymSubscription.js   # Stripe subscriptions
│   ├── Member.js            # Membership tracking
│   ├── Class.js             # Class schedule
│   ├── ClassBooking.js      # Bookings & waitlist
│   ├── Trainer.js           # Trainer profiles
│   ├── Payment.js           # Payment records
│   ├── Review.js            # Reviews & ratings
│   ├── Notification.js      # Notifications
│   └── Challenge.js         # Gamification
├── routes/
│   ├── auth.routes.js       # Auth endpoints
│   ├── gym.routes.js        # Gym endpoints
│   ├── member.routes.js     # Member endpoints
│   ├── class.routes.js      # Class endpoints
│   ├── trainer.routes.js    # Trainer endpoints
│   ├── review.routes.js     # Review endpoints
│   └── search.routes.js     # Search endpoints
├── services/                # Business logic (future)
├── utils/
│   └── errorHandler.js      # Custom error class
├── server.js                # Main server
├── .env.example             # Environment template
├── .eslintrc.json          # ESLint config
├── .prettierrc              # Prettier config
└── package.json             # Dependencies
```

## Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- Stripe account
- Cloudinary account
- npm or yarn

### Steps

1. **Clone/Navigate to project**
   ```bash
   cd Fitness_Store
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with:
   - MongoDB URI
   - JWT secrets
   - Stripe keys
   - Cloudinary credentials
   - Email service info

4. **Start the server**
   ```bash
   # Development (with hot reload)
   npm run dev

   # Production
   npm start
   ```

Server runs on `http://localhost:5000`

## Available Scripts

- `npm start` - Production server
- `npm run dev` - Development with nodemon
- `npm run lint` - Run ESLint
- `npm run format` - Format with Prettier

## API Endpoints

### 🔐 Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Current user profile (Protected)
- `POST /api/auth/refresh-token` - Refresh access token
- `GET /api/auth/verify-email/:token` - Verify email
- `POST /api/auth/forgot-password` - Request reset
- `POST /api/auth/reset-password/:token` - Reset password
- `POST /api/auth/change-password` - Change password (Protected)
- `POST /api/auth/logout` - Logout (Protected)

### 🏋️ Gyms
- `GET /api/gyms` - List gyms (with geosearch)
- `GET /api/gyms/:slug` - Gym details
- `GET /api/gyms/:id/classes` - Gym's classes
- `GET /api/gyms/:id/trainers` - Gym's trainers
- `GET /api/gyms/:id/reviews` - Gym's reviews
- `POST /api/gyms` - Create gym (gym_owner only)
- `PATCH /api/gyms/:id` - Update gym (owner only)
- `PUT /api/gyms/:id/photos` - Upload photos (owner only)
- `DELETE /api/gyms/:id` - Delete gym (owner only)

### 👤 Members
- `POST /api/members/join` - Join gym (Protected)
- `GET /api/members/me` - My membership (Protected)
- `PATCH /api/members/me/freeze` - Freeze membership (Protected)
- `PATCH /api/members/me/cancel` - Cancel membership (Protected)
- `POST /api/members/checkin` - Check-in to gym (Protected)
- `GET /api/members/me/checkins` - Check-in history (Protected)
- `GET /api/members` - All members (admin only)

### 🏃 Classes
- `GET /api/classes` - List classes (with filters)
- `GET /api/classes/:id` - Class details
- `POST /api/classes` - Create class (gym_owner only)
- `POST /api/classes/:id/book` - Book class (Protected)
- `DELETE /api/classes/:id/cancel-booking` - Cancel booking (Protected, 48hr policy)
- `POST /api/classes/:id/check-in` - Check-in to class (Protected)
- `PATCH /api/classes/:id` - Update class (owner only)
- `POST /api/classes/:id/cancel` - Cancel class (owner only)

### 🎯 Trainers
- `GET /api/trainers` - List trainers (with filters)
- `GET /api/trainers/:id` - Trainer profile
- `GET /api/trainers/:id/availability` - Available time slots
- `POST /api/trainers/:id/book-session` - Book PT session (Protected)
- `POST /api/trainers` - Create trainer profile (gym_owner only)
- `PATCH /api/trainers/:id` - Update trainer profile (Protected)
- `GET /api/trainers/:id/sessions` - Trainer's sessions (Protected)

### ⭐ Reviews
- `POST /api/reviews` - Create review (Protected, verified member)
- `GET /api/reviews` - Get reviews (with stats)
- `PATCH /api/reviews/:id/helpful` - Mark helpful (Protected)
- `DELETE /api/reviews/:id` - Delete review (author only)

### 🔍 Search
- `GET /api/search?q=term` - Full-text search
- `GET /api/search/advanced?type=gym&filters=...` - Advanced search

### 📊 Utilities
- `GET /api/health` - Health check

## Database Models

### User
- Authentication fields, roles, profile data
- Compare password, generate JWT, email verification

### Gym
- Location with geospatial indexing (2dsphere)
- Subscription reference, amenities, photos
- Opening hours, ratings, verification status

### GymSubscription
- Stripe integration (customer & subscription IDs)
- Plan types: starter, professional, enterprise
- Feature flags, billing cycle

### Member
- Membership tracking, fitness level, goals
- Check-in count, badges, points
- Stripe subscription, referral system

### Class
- Schedule, capacity, difficulty
- Instructor reference, equipment, tags
- Cancellation support

### ClassBooking
- Status tracking (booked, attended, no_show)
- Waitlist position for full classes
- Check-in timestamps

### Trainer
- Certifications, specializations, hourly rate
- Availability calendar, languages
- Rating & review count

### Payment
- Type tracking (membership, PT, class pack)
- Stripe payment intent & charge IDs
- Metadata for future extensibility

### Review
- Verified purchase flag
- Target tracking (gym/trainer/class)
- Helpful vote count

### Notification
- Type-based routing
- Read status tracking
- Flexible data payload

### Challenge
- Type-based challenges (check_in, weight_loss, etc.)
- Participant progress tracking
- Gamification rewards

## Security Features

✅ Password hashing with bcryptjs (10 salt rounds)
✅ JWT tokens with expiration
✅ Refresh token rotation
✅ HttpOnly secure cookies
✅ Email verification tokens
✅ Password reset tokens with 1-hour expiry
✅ Role-based access control (RBAC)
✅ Helmet for HTTP security headers
✅ CORS with credentials
✅ Rate limiting (100 req/15min)
✅ Input validation with express-validator
✅ MongoDB injection prevention

## Geosearch Implementation

Search gyms near coordinates:
```
GET /api/gyms?lat=40.7128&lng=-74.0060&radius=25

Returns gyms within 25-mile radius sorted by distance
```

**GeoJSON Format:**
```json
"address": {
  "coordinates": {
    "type": "Point",
    "coordinates": [-74.0060, 40.7128] // [longitude, latitude]
  }
}
```

## Pagination

All list endpoints support pagination:
```
GET /api/gyms?page=1&limit=20
```

Response includes:
```json
{
  "data": [...],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "pages": 8
  }
}
```

## Stripe Integration

### Memberships
- Automatic Stripe customer creation
- Monthly/annual billing cycles
- Plan pricing: $29.99 - $99.99/month

### PT Sessions
- Per-session subscription
- Hourly rate * duration = total cost
- Trainer availability validation

## Cloudinary Integration

### Photo Uploads
- Gym logos, cover photos, gallery
- Trainer profile photos
- Class thumbnails
- Max 20MB per request
- Automatic optimization

## Error Handling

All endpoints return consistent error format:
```json
{
  "success": false,
  "message": "Descriptive error message",
  "errors": [] // Validation errors if applicable
}
```

## Roles & Permissions

| Role | Permissions |
|------|------------|
| member | Join gyms, book classes, write reviews |
| trainer | Create classes, manage sessions |
| gym_owner | Create gym, manage classes/trainers, view members |
| admin | View all members, system maintenance |
| super_admin | Full system access |

## Next Steps - Coming Soon

- [ ] Payment webhook handlers
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Video class streaming
- [ ] Nutrition tracking
- [ ] Workout analytics dashboard
- [ ] Mobile app API optimization
- [ ] Advanced analytics
- [ ] AI-powered recommendations

## API Documentation

For detailed API documentation, see [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

## Support & Issues

For bugs or feature requests, create an issue in the repository.

## License

ISC
#   F i t n e s s - S t o r e  
 