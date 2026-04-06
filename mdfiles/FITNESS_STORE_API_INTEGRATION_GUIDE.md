# API INTEGRATION GUIDE - DEVELOPERS

## ⚡ Quick Start

### Base URL
```
http://localhost:5001/api
```

### Default Headers
```javascript
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

---

## 🔐 AUTHENTICATION

### 1. Register User
**Endpoint**: `POST /auth/register`

**Request**:
```javascript
{
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
  password: "SecurePass123!",
  phone: "+1234567890",
  role: "member" // member, gym_owner, trainer, admin
}
```

**Response** (201):
```javascript
{
  token: "eyJhbGciOiJIUzI1NiIs...",
  user: {
    _id: "65a1234567890abcdef",
    firstName: "John",
    email: "john@example.com",
    role: "member"
  }
}
```

---

### 2. Login
**Endpoint**: `POST /auth/login`

**Request**:
```javascript
{
  email: "john@example.com",
  password: "SecurePass123!"
}
```

**Response** (200):
```javascript
{
  token: "eyJhbGciOiJIUzI1NiIs...",
  refreshToken: "eyJhbGciOiJIUzI1NiIs...",
  user: {
    _id: "65a1234567890abcdef",
    firstName: "John",
    email: "john@example.com",
    role: "member"
  }
}
```

---

### 3. Refresh Token
**Endpoint**: `POST /auth/refresh-token`

**Request**:
```javascript
{
  refreshToken: "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response** (200):
```javascript
{
  token: "eyJhbGciOiJIUzI1NiIs...",
  refreshToken: "eyJhbGciOiJIUzI1NiIs..."
}
```

---

## 👥 MEMBERS API

### Get Member Details
**Endpoint**: `GET /members/:id`

**Headers**:
```javascript
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

**Response** (200):
```javascript
{
  _id: "65a1234567890abcdef",
  userId: "65a0987654321abcdef",
  gymId: "65a1357924680abcdef",
  membershipPlan: "peak",
  membershipStatus: "active",
  memberSince: "2024-01-15T10:30:00Z",
  membershipExpiry: "2025-01-15T10:30:00Z",
  checkInCount: 45,
  lastCheckIn: "2025-01-15T08:30:00Z",
  goals: ["weight_loss", "muscle_gain"],
  fitnessLevel: "intermediate",
  badges: ["week_warrior", "month_star"],
  points: 1250,
  referralCode: "JOHN_DOE_123"
}
```

---

### Update Member
**Endpoint**: `PATCH /members/:id`

**Request**:
```javascript
{
  fitnessLevel: "advanced",
  goals: ["muscle_gain", "endurance"],
  emergencyContact: {
    name: "Jane Doe",
    phone: "+9876543210",
    relationship: "Spouse"
  },
  medicalNotes: "Knee injury, avoid heavy squats"
}
```

**Response** (200):
```javascript
{
  message: "Member updated successfully",
  member: { /* updated member object */ }
}
```

---

### Get Member Goals
**Endpoint**: `GET /members/:id/goals`

**Response** (200):
```javascript
{
  goals: [
    {
      _id: "65a1111111111abcdef",
      memberId: "65a1234567890abcdef",
      goal: "weight_loss",
      target: 75,
      current: 85,
      unit: "kg",
      deadline: "2025-06-15",
      progress: 12.5,
      status: "in_progress"
    },
    {
      _id: "65a2222222222abcdef",
      memberId: "65a1234567890abcdef",
      goal: "muscle_gain",
      target: 85,
      current: 80,
      unit: "kg",
      deadline: "2025-12-31",
      progress: 6.25,
      status: "in_progress"
    }
  ]
}
```

---

### Add Goal
**Endpoint**: `POST /members/:id/goals`

**Request**:
```javascript
{
  goal: "strength",
  target: "Bench Press 100kg",
  deadline: "2025-12-31"
}
```

**Response** (201):
```javascript
{
  message: "Goal added successfully",
  goal: {
    _id: "65a3333333333abcdef",
    memberId: "65a1234567890abcdef",
    goal: "strength",
    target: "Bench Press 100kg",
    deadline: "2025-12-31",
    status: "in_progress",
    createdAt: "2025-01-15T15:00:00Z"
  }
}
```

---

## 🏋️ CLASSES API

### List Classes
**Endpoint**: `GET /classes?gymId=XXX&page=1&limit=10`

**Query Parameters**:
- `gymId` - Filter by gym (required)
- `page` - Pagination (default: 1)
- `limit` - Results per page (default: 10)
- `date` - Filter by date (YYYY-MM-DD)
- `trainer` - Filter by trainer name

**Response** (200):
```javascript
{
  classes: [
    {
      _id: "65a4444444444abcdef",
      name: "Morning Yoga",
      description: "Relaxing yoga session",
      trainer: "65a5555555555abcdef",
      gymId: "65a1357924680abcdef",
      schedule: {
        day: "Monday",
        startTime: "06:00",
        endTime: "07:00",
        capacity: 30
      },
      currentBookings: 25,
      difficulty: "beginner",
      tags: ["yoga", "flexibility", "mindfulness"],
      image: "yoga-class.jpg",
      status: "active"
    }
  ],
  pagination: {
    page: 1,
    limit: 10,
    total: 45,
    pages: 5
  }
}
```

---

### Book Class
**Endpoint**: `POST /classes/:id/book`

**Request**:
```javascript
{
  memberId: "65a1234567890abcdef"
}
```

**Response** (201):
```javascript
{
  message: "Class booked successfully",
  booking: {
    _id: "65a6666666666abcdef",
    classId: "65a4444444444abcdef",
    memberId: "65a1234567890abcdef",
    bookingDate: "2025-01-15T10:30:00Z",
    status: "confirmed",
    attendanceMarked: false
  }
}
```

---

### Cancel Booking
**Endpoint**: `DELETE /classes/:id/booking/:bookingId`

**Response** (200):
```javascript
{
  message: "Booking canceled successfully",
  refundStatus: "processed"
}
```

---

## 💳 PAYMENTS API

### Create Subscription
**Endpoint**: `POST /payments/subscription`

**Request**:
```javascript
{
  memberId: "65a1234567890abcdef",
  planType: "peak", // base, peak, peak_results, peak_plus
  billingCycle: "monthly", // monthly, yearly
  paymentMethodId: "pm_1234567890" // Stripe Payment Method ID
}
```

**Response** (201):
```javascript
{
  message: "Subscription created successfully",
  subscription: {
    _id: "65a7777777777abcdef",
    memberId: "65a1234567890abcdef",
    stripeSubscriptionId: "sub_1234567890",
    planType: "peak",
    billingCycle: "monthly",
    amount: 49.99,
    status: "active",
    startDate: "2025-01-15T10:30:00Z",
    nextBillingDate: "2025-02-15T10:30:00Z"
  }
}
```

---

### Get Payment History
**Endpoint**: `GET /payments/history?memberId=XXX&limit=10`

**Query Parameters**:
- `memberId` - Filter by member
- `limit` - Results (default: 10)
- `offset` - Pagination offset
- `status` - Filter by status (completed, pending, failed)

**Response** (200):
```javascript
{
  payments: [
    {
      _id: "65a8888888888abcdef",
      memberId: "65a1234567890abcdef",
      type: "subscription",
      amount: 49.99,
      currency: "USD",
      status: "completed",
      paymentMethod: "stripe",
      stripeChargeId: "ch_1234567890",
      invoiceNumber: "INV-2025-001",
      description: "Monthly Peak Membership",
      paidAt: "2025-01-15T10:30:00Z"
    }
  ],
  total: 1,
  totalAmount: 49.99
}
```

---

### Apply Promo Code
**Endpoint**: `POST /payments/apply-promo`

**Request**:
```javascript
{
  memberId: "65a1234567890abcdef",
  promoCode: "SAVE20",
  planType: "peak"
}
```

**Response** (200):
```javascript
{
  discount: 10.00,
  discountPercent: 20,
  originalPrice: 49.99,
  finalPrice: 39.99,
  message: "Promo code applied successfully"
}
```

---

## 🔔 NOTIFICATIONS API

### Get Notifications
**Endpoint**: `GET /notifications?limit=20&unreadOnly=false`

**Query Parameters**:
- `limit` - Results (default: 20)
- `unreadOnly` - Show only unread (default: false)

**Response** (200):
```javascript
{
  notifications: [
    {
      _id: "65a9999999999abcdef",
      userId: "65a1234567890abcdef",
      type: "class_booking",
      title: "Class Reminder",
      message: "Morning Yoga starts in 30 minutes",
      data: {
        classId: "65a4444444444abcdef",
        className: "Morning Yoga"
      },
      read: false,
      createdAt: "2025-01-15T05:30:00Z"
    },
    {
      _id: "65a1010101010abcdef",
      userId: "65a1234567890abcdef",
      type: "subscription_renewal",
      title: "Membership Renewed",
      message: "Your Peak membership has been renewed",
      data: {
        planType: "peak",
        nextBillingDate: "2025-02-15"
      },
      read: true,
      createdAt: "2025-01-15T10:30:00Z"
    }
  ],
  unreadCount: 5
}
```

---

### Mark Notification as Read
**Endpoint**: `PATCH /notifications/:id/read`

**Response** (200):
```javascript
{
  message: "Notification marked as read",
  notification: { /* updated notification */ }
}
```

---

### Get Unread Count
**Endpoint**: `GET /notifications/count/unread`

**Response** (200):
```javascript
{
  unreadCount: 5
}
```

---

## 🏋️‍♀️ TRAINERS API

### Get Trainer Profile
**Endpoint**: `GET /trainers/:id`

**Response** (200):
```javascript
{
  _id: "65a5555555555abcdef",
  userId: "65a0987654321abcdef",
  specialization: ["strength_training", "weight_loss"],
  certifications: ["ACE", "NASM"],
  experience: 8,
  availability: [
    {
      day: "Monday",
      slots: ["06:00-07:00", "10:00-11:00", "18:00-19:00"]
    }
  ],
  hourlyRate: 75,
  rating: 4.8,
  reviewCount: 125,
  bio: "Experienced trainer specializing in strength training",
  image: "trainer-profile.jpg",
  isAvailable: true
}
```

---

### Get Trainer Availability
**Endpoint**: `GET /trainers/:id/availability`

**Response** (200):
```javascript
{
  trainerId: "65a5555555555abcdef",
  availability: [
    {
      date: "2025-01-20",
      slots: [
        { time: "10:00-11:00", available: true },
        { time: "11:00-12:00", available: false },
        { time: "14:00-15:00", available: true },
        { time: "16:00-17:00", available: true }
      ]
    }
  ]
}
```

---

## 🏪 GYMS API

### Get Gym Details
**Endpoint**: `GET /gyms/:id`

**Response** (200):
```javascript
{
  _id: "65a1357924680abcdef",
  name: "FitPlex",
  owner: "65a0987654321abcdef",
  location: {
    address: "123 Main St, Downtown",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "USA",
    coordinates: { lat: 40.7128, lng: -74.0060 }
  },
  contact: {
    phone: "+1-800-FITNESS",
    email: "info@fitplex.com"
  },
  hours: {
    monday: { open: "06:00", close: "22:00" },
    tuesday: { open: "06:00", close: "22:00" }
  },
  amenities: ["parking", "locker_rooms", "sauna", "pool", "cafe"],
  equipment: [
    { name: "Treadmill", quantity: 10, status: "operational" },
    { name: "Dumbbell Set", quantity: 20, status: "operational" }
  ],
  memberCount: 250,
  rating: 4.6,
  reviews: 85,
  image: "gym-image.jpg",
  status: "active"
}
```

---

### Get Gym Members
**Endpoint**: `GET /gyms/:id/members?page=1&limit=20`

**Response** (200):
```javascript
{
  members: [
    {
      _id: "65a1234567890abcdef",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      membershipPlan: "peak",
      membershipStatus: "active",
      memberSince: "2024-01-15",
      checkInCount: 45
    }
  ],
  pagination: {
    page: 1,
    limit: 20,
    total: 250,
    pages: 13
  }
}
```

---

### Get Gym Stats
**Endpoint**: `GET /gyms/:id/stats`

**Response** (200):
```javascript
{
  totalMembers: 250,
  activeMembers: 220,
  frozenMembers: 20,
  canceledMembers: 10,
  totalRevenue: 45000,
  monthlyRevenue: 3500,
  avgCheckinsPerMember: 18.5,
  peakHour: "18:00",
  mostPopularClass: "Morning Yoga",
  equipmentHealth: 0.96,
  memberRetentionRate: 0.92,
  topTrainer: "John Smith",
  topClass: "HIIT Bootcamp"
}
```

---

## 🛠️ ADMIN API

### Get Analytics
**Endpoint**: `GET /admin/analytics?timeRange=month`

**Query Parameters**:
- `timeRange` - week, month, quarter, year

**Response** (200):
```javascript
{
  totalUsers: 1250,
  activeSubscriptions: 890,
  totalRevenue: 125000,
  monthlyRevenue: 35000,
  newSignups: 45,
  churnRate: 0.05,
  averageClassAttendance: 22,
  topPerformingGym: "FitPlex Downtown",
  topPerformingClass: "HIIT Bootcamp",
  memberSatisfactionScore: 4.6,
  paymentSuccessRate: 0.98
}
```

---

### List Users
**Endpoint**: `GET /admin/users?role=member&status=active&limit=20`

**Query Parameters**:
- `role` - Filter by role (member, gym_owner, trainer, admin)
- `status` - Filter by status (active, inactive, suspended)
- `limit` - Results per page

**Response** (200):
```javascript
{
  users: [
    {
      _id: "65a1234567890abcdef",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      role: "member",
      status: "active",
      createdAt: "2024-01-15",
      lastLogin: "2025-01-15T10:30:00Z"
    }
  ],
  pagination: {
    page: 1,
    limit: 20,
    total: 250,
    pages: 13
  }
}
```

---

## ⚠️ ERROR HANDLING

### Standard Error Response
```javascript
{
  success: false,
  message: "Validation Error",
  errors: [
    {
      field: "email",
      message: "Valid email is required"
    }
  ],
  statusCode: 400
}
```

### Common Status Codes
- `200` - OK (successful request)
- `201` - Created (resource created)
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `429` - Too Many Requests (rate limited)
- `500` - Server Error

---

## 🔑 JWT TOKEN STRUCTURE

```javascript
{
  iat: 1642255800,
  exp: 1642342200, // 24 hours
  userId: "65a1234567890abcdef",
  email: "john@example.com",
  role: "member"
}
```

---

## 📦 EXAMPLE FRONTEND INTEGRATION

### Using Fetch API
```javascript
// Register
const registerUser = async (userData) => {
  const response = await fetch('http://localhost:5001/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return response.json();
};

// Get Member
const getMember = async (memberId, token) => {
  const response = await fetch(`http://localhost:5001/api/members/${memberId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.json();
};

// Book Class
const bookClass = async (classId, memberId, token) => {
  const response = await fetch(`http://localhost:5001/api/classes/${classId}/book`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ memberId })
  });
  return response.json();
};
```

### Using Axios
```javascript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:5001/api'
});

// Add token to all requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Register
const registerUser = (userData) => 
  apiClient.post('/auth/register', userData);

// Get Member
const getMember = (memberId) => 
  apiClient.get(`/members/${memberId}`);

// Book Class
const bookClass = (classId, memberId) => 
  apiClient.post(`/classes/${classId}/book`, { memberId });
```

---

## 🧪 TESTING ENDPOINTS WITH CURL

```bash
# Register
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "phone": "+1234567890"
  }'

# Login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'

# Get Member (replace TOKEN and ID)
curl -X GET http://localhost:5001/api/members/65a1234567890abcdef \
  -H "Authorization: Bearer TOKEN"

# List Classes
curl -X GET "http://localhost:5001/api/classes?gymId=65a1357924680abcdef&limit=10"

# Get Notifications
curl -X GET http://localhost:5001/api/notifications \
  -H "Authorization: Bearer TOKEN"
```

---

## 🚀 RATE LIMITING

- **Limit**: 100 requests per 15 minutes per IP
- **Headers**:
  - `X-RateLimit-Limit`: 100
  - `X-RateLimit-Remaining`: 95
  - `X-RateLimit-Reset`: 1642255800

---

**Last Updated**: March 24, 2026  
**API Version**: 1.0  
**Status**: Production Ready
