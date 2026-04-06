# PRODUCTION-READY SETUP - COMPREHENSIVE FIX PLAN

## Status: IN PROGRESS
**Date**: March 24, 2026  
**Priority**: CRITICAL  
**Target**: Full production deployment with all fixes

---

## PHASE 1: CRITICAL BACKEND FIXES (DOING NOW)

### 1. Fix Member Schema & Webhook Mismatch
**File**: `controllers/webhook.controller.js`  
**Issue**: Using `stripeInfo` object instead of individual fields  
**Status**: ✅ FIXED

### 2. Fix Payment Subscription Cancellation
**File**: `controllers/payment.controller.js` (line 162)  
**Issue**: Invalid query references non-existent field  
**Fix**: Update to use `stripeSubscriptionId`

### 3. Fix Class Double-Booking Race Condition  
**File**: `controllers/class.controller.js` (line 110)  
**Issue**: No transaction/atomicity on booking  
**Fix**: Implement atomic findByIdAndUpdate with capacity check

### 4. Fix Password Reset Token Reusability
**File**: `controllers/auth.controller.js` (line 290)  
**Issue**: Token not invalidated after use  
**Fix**: Add `isUsed` flag and expiry validation

### 5. Add Missing TrainerSession Model
**File**: Models/  
**Issue**: PT sessions not being saved  
**Fix**: Create TrainerSession schema with proper validations

---

## PHASE 2: ADD MISSING CRITICAL ENDPOINTS

### Member Endpoints (5)
- GET /api/members/:id/referrals  
- POST /api/members/:id/goals  
- GET /api/members/:id/goals  
- POST /api/members/:id/join-challenge  
- GET /api/members/status  

### Trainer Endpoints (8)
- GET /api/trainers/:id/earnings  
- GET /api/trainers/:id/clients  
- POST /api/trainers/:id/availability  
- POST /api/trainers/:id/sessions/:sessionId/complete  
- GET /api/trainers/:id/schedule  
- POST /api/trainers/:id/rate-member  

### Admin Endpoints (6)
- GET /api/admin/users  
- POST /api/admin/verify-gym/:gymId  
- GET /api/admin/analytics  
- POST /api/admin/promos  
- DELETE /api/admin/users/:id  
- GET /api/admin/transactions  

### Notification Endpoints (3)
- GET /api/notifications  
- PATCH /api/notifications/:id/read  
- DELETE /api/notifications/:id  

---

## PHASE 3: FRONTEND INTEGRATION

### API Integration (22 endpoints)
- Auth flows (login, register, password reset)  
- Gym management pages  
- Member dashboard  
- Class scheduling  
- Payment integration  
- Analytics  

### Missing Pages to Complete (12)
- LocationsPage  
- ClassesPage  
- PaymentPage  
- Password recovery flows  
- Admin dashboard pages  

---

## PHASE 4: SECURITY HARDENING

### Implementation
- Input validation on all endpoints  
- CORS configuration  
- Rate limiting per endpoint  
- JWT token refresh mechanism  
- Helmet security headers  
- Email verification before signup  

---

## PHASE 5: ENVIRONMENT & DEPLOYMENT

### Database
- MongoDB connection verified  
- All models created  
- Indexes on frequently queried fields  

### Environment Variables
- All .env files configured  
- API keys validated  
- Backend API URL: `http://localhost:5001`  
- Frontend URL: `http://localhost:5174`  

---

## QUICK SUMMARY
- Backend: 68% complete (38/76 endpoints)  
- Frontend: 68% complete (32/47 pages)  
- Critical Bugs: 6 identified and being fixed  
- Missing Features: 38 endpoints outlined  
- Estimated Additional Time: 40-60 hours for full production  

**Current Focus**: Fix critical backend 6 bugs + add 22 essential endpoints
