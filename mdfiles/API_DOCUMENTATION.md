# CrunchFit Pro API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require Bearer token in `Authorization` header:
```
Authorization: Bearer <token>
```

Or token in httpOnly cookie: `token=<token>`

---

## Authentication Endpoints

### POST /auth/register
Register a new user
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securePass123",
  "role": "member" // optional: member|admin|super_admin|gym_owner|trainer
}
```
**Response:** User data, JWT token, refresh token

### POST /auth/login
Login user
```json
{
  "email": "john@example.com",
  "password": "securePass123"
}
```
**Response:** User data, JWT token, refresh token

### GET /auth/me
Get current logged-in user's profile (Protected)
**Response:** Full user object

### POST /auth/refresh-token
Refresh access token
```json
{
  "refreshToken": "<refresh_token>"
}
```

### GET /auth/verify-email/:token
Verify user's email

### POST /auth/forgot-password
Request password reset
```json
{
  "email": "john@example.com"
}
```

### POST /auth/reset-password/:token
Reset password with token
```json
{
  "password": "newPassword123"
}
```

### POST /auth/change-password
Change password (Protected)
```json
{
  "currentPassword": "oldPassword",
  "newPassword": "newPassword123"
}
```

### POST /auth/logout
Logout user (Protected)

---

## Gym Endpoints

### GET /gyms
Get all gyms with filters and geosearch
**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10)
- `city`: Filter by city
- `amenities`: Comma-separated amenities
- `rating`: Minimum rating
- `lat`: Latitude for geosearch
- `lng`: Longitude for geosearch
- `radius`: Search radius in miles (default: 25)

**Example:**
```
GET /gyms?page=1&limit=20&city=New York&lat=40.7128&lng=-74.0060&radius=10
```

### GET /gyms/:slug
Get gym details by slug
**Response:** Gym data with reviews, classes, trainers

### GET /gyms/:id/classes
Get gym's classes
**Query:** `page`, `limit`

### GET /gyms/:id/trainers
Get gym's trainers
**Query:** `page`, `limit`

### GET /gyms/:id/reviews
Get gym's reviews
**Query:** `page`, `limit`
**Response:** Reviews with rating distribution stats

### POST /gyms
Create new gym (gym_owner only) - Protected
```json
{
  "name": "Crunch Fitness",
  "email": "gym@example.com",
  "phone": "123-456-7890",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zip": "10001",
    "country": "USA",
    "coordinates": {
      "type": "Point",
      "coordinates": [-74.0060, 40.7128]
    }
  },
  "website": "https://crunch.com",
  "description": "Premium fitness gym",
  "amenities": "free wifi,pool,sauna",
  "openingHours": {
    "monday": { "open": "06:00", "close": "22:00" },
    // ... other days
  }
}
```

### PATCH /gyms/:id
Update gym (owner only) - Protected
Same fields as POST /gyms but all optional

### PUT /gyms/:id/photos
Upload gym photos (owner only) - Protected
**Headers:** `Content-Type: multipart/form-data`
**Fields:** `photos` (array of files, max 10)
**Optional:** `setCover=1` to set second image as cover photo

### DELETE /gyms/:id
Delete/deactivate gym (owner only) - Protected

---

## Member Endpoints

### POST /members/join
Join a gym - Protected
```json
{
  "gymId": "gym_object_id",
  "plan": "peak", // base|peak|peak_results|peak_plus
  "paymentMethodId": "stripe_payment_method_id"
}
```
**Response:** Member data with stripe subscription

### GET /members/me
Get current user's membership details - Protected
**Response:** Member info, class history, badges, points, stats

### PATCH /members/me/freeze
Freeze membership - Protected
```json
{
  "freezeDurationMonths": 1 // Max 3 months per year
}
```

### PATCH /members/me/cancel
Cancel membership - Protected
```json
{
  "reason": "Relocating" // optional
}
```

### POST /members/checkin
Check-in to gym - Protected
```json
{
  "gymId": "gym_object_id"
}
```
**Response:** Check-in count, points awarded

### GET /members/me/checkins
Get check-in history - Protected

### GET /members
Get all members (admin only) - Protected
**Query:** `page`, `limit`, `gymId`, `status`

---

## Class Endpoints

### GET /classes
Get all classes with filters
**Query Parameters:**
- `page`: Page number
- `limit`: Results per page
- `gymId`: Filter by gym
- `category`: Filter by category
- `instructorId`: Filter by instructor
- `difficulty`: beginner|intermediate|advanced

**Response:** Classes with availability info (available spots, is full)

### GET /classes/:id
Get single class details

### POST /classes
Create class (gym_owner only) - Protected
```json
{
  "gymId": "gym_id",
  "name": "CrossFit 101",
  "category": "strength", // strength|ride|mind_body|dance|cardio|specialty|hiit
  "description": "Beginner CrossFit class",
  "instructorId": "trainer_id",
  "duration": 60,
  "maxCapacity": 20,
  "schedule": {
    "dayOfWeek": "Monday",
    "time": "06:00",
    "recurring": true
  },
  "location": "Studio A",
  "difficulty": "beginner",
  "equipment": "barbell,dumbbells",
  "tags": "strength,fitness"
}
```

### POST /classes/:id/book
Book a class - Protected
**Response:** Booking info, wait list position if full
**Prevents double booking**
**Automatic waitlist if class is full**

### DELETE /classes/:id/cancel-booking
Cancel class booking (48-hour policy) - Protected

### POST /classes/:id/check-in
Check-in to class - Protected
**Response:** Booking confirmed, points awarded

### PATCH /classes/:id
Update class (owner only) - Protected

### POST /classes/:id/cancel
Cancel class (owner only) - Protected
```json
{
  "reason": "Instructor unavailable"
}
```
**Notifies all members**

---

## Trainer Endpoints

### GET /trainers
Get all trainers with filters
**Query Parameters:**
- `page`: Page number
- `limit`: Results per page
- `gymId`: Filter by gym
- `specialization`: Filter by specialization
- `minPrice`: Minimum hourly rate
- `maxPrice`: Maximum hourly rate

### GET /trainers/:id
Get trainer profile details

### GET /trainers/:id/availability
Get trainer's available time slots
**Query Parameters:**
- `startDate`: ISO 8601 date (optional)
- `endDate`: ISO 8601 date (optional)

**Response:** Calendar with available time slots

### POST /trainers/:id/book-session
Book PT session - Protected
```json
{
  "scheduledDate": "2024-04-15T10:00:00Z",
  "duration": 60,
  "notes": "Focus on upper body"
}
```
**Validates trainer availability**
**Response:** Session booking with total cost

### POST /trainers
Create trainer profile (gym_owner only) - Protected
```json
{
  "userId": "user_id",
  "gymId": "gym_id",
  "bio": "Certified CrossFit trainer",
  "specializations": "crossfit,strength",
  "certifications": "CrossFit L1,CPR",
  "yearsExperience": 5,
  "hourlyRate": 75,
  "languages": "English,Spanish",
  "availability": {
    "days": ["monday", "tuesday", "wednesday"],
    "timeSlots": ["08:00", "09:00", "10:00"]
  }
}
```

### PATCH /trainers/:id
Update trainer profile - Protected

### GET /trainers/:id/sessions
Get trainer's sessions - Protected
**Query:** `status`, `page`, `limit`

---

## Review Endpoints

### POST /reviews
Create review (verified member only) - Protected
```json
{
  "targetType": "gym", // gym|trainer|class
  "targetId": "target_object_id",
  "rating": 5,
  "title": "Great gym!",
  "body": "Excellent facilities and friendly staff. Highly recommended!"
}
```
**Verification:**
- Gym: Must be active member
- Trainer: Must have booked sessions
- Class: Must have attended

### GET /reviews
Get reviews for a target
**Query Parameters:**
- `targetType`: gym|trainer|class (required)
- `targetId`: Target ID (required)
- `page`: Page number
- `limit`: Results per page

**Response:** Reviews + stats (avg rating, distribution)

### PATCH /reviews/:id/helpful
Mark review as helpful - Protected

### DELETE /reviews/:id
Delete review (author only) - Protected

---

## Search Endpoints

### GET /search
Full-text search
**Query Parameters:**
- `q`: Search term (min 2 characters)

**Response:** Categorized results (gyms, classes, trainers, users)

### GET /search/advanced
Advanced search with filters
**Query Parameters:**
- `type`: gym|class|trainer (required)
- `q`: Search term
- `filters`: JSON filters (depends on type)

**Filters Examples:**
```
// For gyms
filters={"city":"NYC","minRating":4,"amenities":["pool","sauna"]}

// For classes
filters={"difficulty":"advanced","category":"hiit"}

// For trainers
filters={"minPrice":50,"maxPrice":150,"specialization":"yoga"}
```

---

## Payments Endpoints

### POST /payments/create-intent
Create a payment intent for one-time payments (Protected)

**Body:**
```json
{
  "amount": 99.99,
  "currency": "usd",
  "type": "class_pack|day_pass|merchandise|other",
  "description": "Class pack - 10 classes"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "clientSecret": "pi_xxx_secret_xxx",
    "intentId": "pi_xxx",
    "amount": 9999,
    "currency": "usd"
  }
}
```

### POST /payments/create-subscription
Create a recurring subscription (Protected)

**Body:**
```json
{
  "priceId": "price_xxx",
  "paymentMethodId": "pm_xxx"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "subscriptionId": "sub_xxx",
    "status": "active",
    "nextBillingDate": "2024-04-24T00:00:00Z",
    "paymentId": "ObjectId"
  }
}
```

### POST /payments/cancel-subscription
Cancel a subscription (Protected)

**Body:**
```json
{
  "subscriptionId": "sub_xxx",
  "immediately": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "subscriptionId": "sub_xxx",
    "status": "canceled",
    "cancelledAt": "2024-03-24T..."
  }
}
```

### GET /payments/history
Get user's payment history (Protected)

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20, max: 100)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "ObjectId",
      "type": "membership|class_pack|pt_session",
      "amount": 99.99,
      "currency": "usd",
      "status": "completed|pending|failed",
      "createdAt": "2024-03-24T..."
    }
  ],
  "pagination": {
    "total": 15,
    "page": 1,
    "limit": 20,
    "pages": 1
  }
}
```

### GET /payments/:id
Get payment details (Protected)

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "ObjectId",
    "userId": "ObjectId",
    "type": "membership",
    "amount": 99.99,
    "status": "completed",
    "stripeIntentId": "pi_xxx",
    "createdAt": "2024-03-24T..."
  }
}
```

### POST /payments/setup-intent
Create setup intent for saving payment method (Protected)

**Response:**
```json
{
  "success": true,
  "data": {
    "clientSecret": "seti_xxx_secret_xxx",
    "intentId": "seti_xxx"
  }
}
```

### POST /payments/confirm
Confirm a payment (Protected)

**Body:**
```json
{
  "intentId": "pi_xxx",
  "paymentMethodId": "pm_xxx"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "succeeded|processing|requires_action",
    "intentId": "pi_xxx"
  }
}
```

### POST /payments/portal
Create Stripe customer billing portal session (Protected)

**Body:**
```json
{
  "returnUrl": "https://example.com/account"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://billing.stripe.com/session/xxxxx"
  }
}
```

---

## Webhook Endpoints

### POST /webhooks/stripe
Stripe webhook receiver

**Headers Required:**
```
stripe-signature: t=timestamp,v1=signature
```

**Handled Events:**
- `customer.subscription.created` - Updates member status to active
- `customer.subscription.updated` - Syncs subscription changes
- `customer.subscription.deleted` - Cancels membership
- `invoice.payment_succeeded` - Records successful payment
- `invoice.payment_failed` - Handles failed payments
- `payment_intent.succeeded` - Confirms one-time payment
- `payment_intent.payment_failed` - Handles failed one-time payment

**Response:**
```json
{
  "received": true
}
```

See [PAYMENT_AND_WEBHOOKS.md](PAYMENT_AND_WEBHOOKS.md) for complete webhook documentation.

---

## Error Response Format

All errors follow this format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Optional: validation errors array
}
```

## Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad request / Validation error
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not found
- `500`: Server error

---

## Pricing Plans

| Feature | Base | Peak | Peak Results | Peak Plus |
|---------|------|-----|------|-----|
| Price/Month | $29.99 | $49.99 | $79.99 | $99.99 |
| Access Level | Limited | Standard | Premium | VIP |

---

## Response Examples

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { /* response data */ }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ /* array of items */ ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "pages": 5
  }
}
```

---

## Rate Limiting
- **100 requests per 15 minutes** per IP

## Socket.io Events
- `joinRoom`: Join a broadcast room
- `leaveRoom`: Leave a broadcast room
- `message`: Send message to room
