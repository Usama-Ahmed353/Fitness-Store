# Payment Processing, Webhooks & Notifications - PROMPT M1-A-3

## 📋 Overview

This guide covers the complete implementation of Stripe payment processing, webhook handling, and real-time notification system for CrunchFit Pro.

---

## 💳 Stripe Payment Service

### File: `services/stripe.service.js`

Complete Stripe API wrapper handling all payment operations.

#### Available Methods

```javascript
// Customer Management
await stripeService.createCustomer(user)           // Create Stripe customer
await stripeService.getOrCreateCustomer(user)     // Get existing or create new

// Subscriptions
await stripeService.createSubscription(customerId, priceId, paymentMethodId)
await stripeService.cancelSubscription(subscriptionId, immediately=false)
await stripeService.retrieveSubscription(subscriptionId)
await stripeService.updateSubscription(subscriptionId, params)

// One-Time Payments
await stripeService.createPaymentIntent(amount, currency, metadata)
await stripeService.confirmPaymentIntent(intentId, paymentMethodId)
await stripeService.retrievePaymentIntent(intentId)

// Setup & Management
await stripeService.createSetupIntent(customerId)          // Save payment method
await stripeService.createPortalSession(customerId, returnUrl)
await stripeService.listSubscriptions(customerId)
await stripeService.retrieveInvoice(invoiceId)

// Webhook
await stripeService.verifyWebhookSignature(body, signature)
```

---

## 💰 Payment API Endpoints

### File: `routes/payment.routes.js` & `controllers/payment.controller.js`

All payment endpoints require authentication (`Authorization: Bearer TOKEN`).

#### 1. Create Payment Intent (One-Time Payment)
```
POST /api/payments/create-intent

Body:
{
  "amount": 99.99,
  "currency": "usd",
  "type": "class_pack|day_pass|merchandise|other",
  "description": "Class pack - 10 classes"
}

Response:
{
  "success": true,
  "data": {
    "clientSecret": "pi_xxx...",
    "intentId": "pi_xxx...",
    "amount": 9999,  // in cents
    "currency": "usd"
  }
}
```

#### 2. Create Subscription
```
POST /api/payments/create-subscription

Body:
{
  "priceId": "price_xxx...",      // From Stripe
  "paymentMethodId": "pm_xxx..."  // From client-side
}

Response:
{
  "success": true,
  "data": {
    "subscriptionId": "sub_xxx...",
    "status": "active|pending",
    "nextBillingDate": "2024-04-24T00:00:00Z",
    "paymentId": "ObjectId"
  }
}
```

#### 3. Cancel Subscription
```
POST /api/payments/cancel-subscription

Body:
{
  "subscriptionId": "sub_xxx...",
  "immediately": false  // true = cancel now, false = at period end
}

Response:
{
  "success": true,
  "data": {
    "subscriptionId": "sub_xxx...",
    "status": "canceled",
    "cancelledAt": "2024-03-24T..."
  }
}
```

#### 4. Get Payment History
```
GET /api/payments/history?page=1&limit=20

Response:
{
  "success": true,
  "data": [
    {
      "_id": "ObjectId",
      "userId": "ObjectId",
      "type": "membership|class_pack|pt_session",
      "amount": 99.99,
      "currency": "usd",
      "status": "completed|pending|failed",
      "stripeIntentId": "pi_xxx...",
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

#### 5. Get Payment Details
```
GET /api/payments/:id

Response:
{
  "success": true,
  "data": {
    "_id": "ObjectId",
    "userId": "ObjectId",
    "type": "membership",
    "amount": 99.99,
    "status": "completed",
    "stripeIntentId": "pi_xxx...",
    "stripeChargeId": "ch_xxx...",
    "createdAt": "2024-03-24T..."
  }
}
```

#### 6. Create Setup Intent
```
POST /api/payments/setup-intent

Response:
{
  "success": true,
  "data": {
    "clientSecret": "seti_xxx...",
    "intentId": "seti_xxx..."
  }
}
```

#### 7. Confirm Payment (Client-side processed)
```
POST /api/payments/confirm

Body:
{
  "intentId": "pi_xxx...",
  "paymentMethodId": "pm_xxx..."
}

Response:
{
  "success": true,
  "data": {
    "status": "succeeded|processing|requires_action",
    "intentId": "pi_xxx..."
  }
}
```

#### 8. Create Billing Portal Session
```
POST /api/payments/portal

Body:
{
  "returnUrl": "https://example.com/account"  // Optional
}

Response:
{
  "success": true,
  "data": {
    "url": "https://billing.stripe.com/session/xxxxx"
  }
}
```

---

## 🔗 Stripe Webhook Handler

### File: `routes/webhook.routes.js` & `controllers/webhook.controller.js`

**IMPORTANT**: Webhook endpoint MUST receive raw request body for signature verification. This is handled in `server.js` by mounting webhook routes BEFORE JSON body parser.

### Endpoint
```
POST /api/webhooks/stripe

Headers:
{
  "stripe-signature": "t=timestamp,v1=signature"
}

Body: Raw JSON (NOT parsed)
```

### Handled Events

#### 1. `customer.subscription.created`
- Triggered when user completes subscription purchase
- **Action**: 
  - Update Payment status → `completed`
  - Update Member status → `active`
  - Send welcome email
  - Create notification

#### 2. `customer.subscription.updated`
- Triggered when subscription plan change, pause, or resume
- **Action**:
  - Update Member subscription dates
  - Update status if paused
  - Create notification

#### 3. `customer.subscription.deleted`
- Triggered when subscription canceled
- **Action**:
  - Set Member status → `canceled`
  - Revoke gym access
  - Send cancellation email
  - Create notification

#### 4. `invoice.payment_succeeded`
- Triggered on successful recurring payment
- **Action**:
  - Update Payment status → `completed`
  - Record charge ID
  - Send receipt email
  - Create notification

#### 5. `invoice.payment_failed`
- Triggered on failed recurring payment
- **Action**:
  - Set Member status → `past_due`
  - Send dunning email
  - Log failed payment date
  - Notify admin

#### 6. `payment_intent.succeeded`
- Triggered on successful one-time payment
- **Action**:
  - Update Payment status → `completed`
  - Send receipt email
  - Create notification

#### 7. `payment_intent.payment_failed`
- Triggered on failed one-time payment
- **Action**:
  - Update Payment status → `failed`
  - Send error email
  - Create notification

### Setting Up Webhooks in Stripe Dashboard

1. Go to Developers → Webhooks
2. Add Endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events to listen for (listed above)
4. Copy Signing Secret to `.env` as `STRIPE_WEBHOOK_SECRET`

### Testing Webhooks Locally

```bash
# Install Stripe CLI
https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks to localhost
stripe listen --forward-to localhost:5000/api/webhooks/stripe

# Trigger test event
stripe trigger customer.subscription.created
```

---

## 📧 Email Service

### File: `services/email.service.js`

SendGrid integration for transactional emails.

#### Available Email Functions

```javascript
await emailService.sendWelcomeEmail(user)
await emailService.sendEmailVerificationEmail(user, token)
await emailService.sendPasswordResetEmail(user, token)
await emailService.sendClassBookingConfirmationEmail(user, classData)
await emailService.sendClassReminderEmail(user, classData)
await emailService.sendPaymentReceiptEmail(user, paymentData)
await emailService.sendPaymentFailedEmail(user, paymentData)
await emailService.sendMembershipExpiryWarningEmail(user, membershipData)
await emailService.sendGymSubscriptionInvoiceEmail(user, invoiceData)
await emailService.sendCancellationConfirmationEmail(user, cancelData)
await emailService.sendTrainerBookingConfirmationEmail(user, trainerData)
```

### Email Templates

Each email is generated with HTML styling and includes:
- Professional branding
- Clear action buttons
- Relevant details
- Contact information

#### Example: Payment Receipt
```javascript
await emailService.sendPaymentReceiptEmail(user, {
  invoiceId: "inv_xxx",
  transactionId: "pi_xxx",
  amount: 99.99,
  date: new Date(),
  type: "membership",
  description: "Gym membership renewal"
});
```

---

## 🔔 Real-Time Notifications with Socket.io

### File: `socket/handlers.js`

Handles all real-time communication between server and clients.

#### Room Management

**User Notification Room**
```javascript
// Client emits
socket.emit('joinUserRoom', userId);

// Server can send to user
io.to(`user:${userId}`).emit('notification:new', notification);
```

**Class Room**
```javascript
// Client joins to see live seat updates
socket.emit('joinClassRoom', classId);

// Server broadcasts seat changes
io.to(`class:${classId}`).emit('class:seatUpdate', {
  classId, seatsTaken, seatsAvailable, capacity, timestamp
});
```

**Trainer Chat Room**
```javascript
// Private room: trainer:{trainerId}:member:{memberId}
socket.emit('chat:joinRoom', { trainerId, memberId });

// Send message
socket.emit('chat:sendMessage', {
  trainerId, memberId, message, senderId
});

// Receive message
socket.on('chat:messageReceived', (message) => {
  // Display message in UI
});
```

#### Key Events

| Event | Description | Payload |
|-------|-------------|---------|
| `joinUserRoom` | User joins notification room | `userId` |
| `notification:new` | New notification sent | See below |
| `notification:markAsRead` | Mark notification as read | `notificationId` |
| `class:updateSeats` | Broadcast seat update | `{classId, seatsTaken, capacity}` |
| `class:seatUpdate` | Seat update received | `{classId, seatsTaken, capacity}` |
| `chat:joinRoom` | Join trainer chat | `{trainerId, memberId}` |
| `chat:sendMessage` | Send trainer message | `{trainerId, memberId, message, senderId}` |
| `chat:messageReceived` | Receive message | `{senderId, message, timestamp}` |
| `trainer:availabilityUpdate` | Trainer availability changed | `{trainerId, availableSlots}` |
| `gym:memberCountUpdate` | Gym member count changed | `{gymId, checkedInCount}` |

#### Using Socket.io in Controllers

```javascript
// From any controller, emit to user:
req.io.to(`user:${userId}`).emit('notification:new', {
  type: 'booking',
  title: 'Class booked',
  message: 'Yoga class confirmed for tomorrow',
  data: { classId, className }
});

// Or use helper functions:
const socketHandlers = require('../socket/handlers');

socketHandlers.sendNotificationToUser(req.io, userId, notification);
socketHandlers.broadcastClassSeatUpdate(req.io, classId, seatData);
socketHandlers.broadcastTrainerAvailabilityChange(req.io, trainerId, slots);
socketHandlers.broadcastGymMemberCountUpdate(req.io, gymId, checkedIn, total);
```

---

## 🔐 Security Notes

### Stripe Webhook Verification
- Signature verified using HMAC-SHA256
- Raw body required (handled in middleware)
- Prevents unauthorized webhook calls

### Payment Intent Security
- Created server-side, client receives only client secret
- Sensitive data (charges, refunds) handled server-side
- PCI compliance through Stripe

### Email Sending
- SendGrid API for reliable delivery
- Rate limited for abuse prevention
- HTML templates for phishing prevention

---

## 📊 Database Schema Updates

### User Model
```javascript
{
  stripeCustomerId: String  // Stripe customer ID
}
```

### Member Model
```javascript
{
  stripeInfo: {
    subscriptionId: String,
    customerId: String
  },
  status: String,  // 'active', 'paused', 'past_due', 'canceled'
  lastPaymentFailureDate: Date
}
```

### Payment Model
```javascript
{
  userId: ObjectId,
  gymId: ObjectId,
  type: String,  // 'membership', 'class_pack', 'personal_training'
  amount: Number,
  currency: String,
  status: String,  // 'pending', 'completed', 'failed'
  stripeIntentId: String,
  stripeSubscriptionId: String,
  stripeChargeId: String,
  metadata: {}
}
```

---

## 🧪 Testing Guide

### 1. Test Payment Intent Creation
```bash
curl -X POST http://localhost:5000/api/payments/create-intent \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 99.99,
    "type": "class_pack"
  }'
```

### 2. Test Subscription Creation
```bash
# First register and login to get token
curl -X POST http://localhost:5000/api/payments/create-subscription \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "priceId": "price_1Nx...",
    "paymentMethodId": "pm_1Nx..."
  }'
```

### 3. Test Webhook (Local)
```bash
# Using Stripe CLI
stripe listen --forward-to localhost:5000/api/webhooks/stripe

# In another terminal
stripe trigger customer.subscription.created
```

### 4. Test Notifications (Client-side)
```javascript
// Connect Socket.io
const socket = io('http://localhost:5000');

// Join user notification room
socket.emit('joinUserRoom', userId);

// Listen for notifications
socket.on('notification:new', (notification) => {
  console.log('New notification:', notification);
});

// Join class room
socket.emit('joinClassRoom', classId);

// Watch for seat updates
socket.on('class:seatUpdate', (data) => {
  console.log(`Seats taken: ${data.seatsTaken}/${data.capacity}`);
});
```

---

## 🚀 Environment Variables

Add to `.env`:
```env
# Stripe
STRIPE_API_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_test_xxxxx

# SendGrid
SENDGRID_API_KEY=SG.xxxxx
EMAIL_FROM=noreply@crunchfitpro.com

# Frontend URL (needed for email links & CORS)
FRONTEND_URL=http://localhost:3000
```

---

## 📝 API Flow Examples

### Complete Payment Flow (Subscription)

1. **Client**: Displays payment form (Stripe Elements)
2. **Client**: Collects payment method → gets `paymentMethodId`
3. **Client**: POST `/api/payments/create-subscription`
4. **Server**: Creates Stripe subscription
5. **Server**: Saves Payment record (status: pending)
6. **Stripe**: Processes payment
7. **Stripe**: Sends `customer.subscription.created` webhook
8. **Server**: Webhook handler updates Member & Payment
9. **Server**: Sends welcome email
10. **Server**: Creates notification
11. **User**: Receives confirmation

### Class Booking with Real-Time Update

1. **User**: Books class via POST `/api/classes/:id/book`
2. **Controller**: Updates Class seatsBooked
3. **Controller**: Emits `class:seatUpdate` to `class:${classId}` room
4. **Connected clients**: Receive live seat count update
5. **Socket.io**: Shows "2 seats left" in real-time

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Webhook signature verification fails | Ensure raw body is passed (check server.js middleware order) |
| Email not sending | Verify SENDGRID_API_KEY in .env |
| Socket.io not connecting | Ensure CORS origin matches frontend URL |
| Payment intent fails | Check amount > 0, currency is valid |
| Subscription creation fails | Verify priceId & paymentMethodId from Stripe |

---

## 📚 Related Documentation

- Full API Reference: [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- Setup Instructions: [SETUP_GUIDE.md](SETUP_GUIDE.md)
- System Architecture: [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

---

**Last Updated**: March 24, 2026
**Status**: Production Ready
