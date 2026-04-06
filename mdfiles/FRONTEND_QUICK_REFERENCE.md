# CrunchFit Pro Frontend - Quick Reference Guide
**Actionable Issues with Line Numbers & Code Locations**

---

## QUICK ISSUE LOOKUP

### Pages to Complete (5 Critical)

#### 1. LocationsPage - Empty Placeholder
**File**: `src/pages/public/LocationsPage.jsx` (15 lines)
```javascript
Line 1-15: Complete skeleton
const Locations = () => {
  return (
    <div>
      <h1>Our Locations</h1>
      <div>Locations page coming soon...</div>
    </div>
  );
};
```
**Required Implementation**:
- [ ] Integrate `src/app/slices/gymSlice.js` → dispatch `fetchGyms()`
- [ ] Display gym list with cards showing: name, address, amenities, distance
- [ ] Add map view using Leaflet (dependency installed)
- [ ] Implement filters: location, amenities, price range
- [ ] Add location search with geolocation

**Time Estimate**: 6-8 hours

---

#### 2. ClassesPage - Placeholder
**File**: `src/pages/public/ClassesPage.jsx` (15 lines)
```javascript
Line 1-15: Complete skeleton
```
**Required Implementation**:
- [ ] Dispatch `fetchClasses()` from classSlice
- [ ] Display class cards: name, time, instructor, difficulty, availability
- [ ] Category filters (Strength, Ride, Mind Body, etc.)
- [ ] Schedule view with time slots
- [ ] Search by class name/instructor

**Time Estimate**: 6-8 hours

---

#### 3. TrainingPage - Placeholder
**File**: `src/pages/public/TrainingPage.jsx` (15 lines)
**Required Implementation**:
- [ ] Integrate with `trainerSlice` → fetch trainers
- [ ] Show top trainers with specializations
- [ ] Link to member TrainersPage for booking
- [ ] Display trainer ratings and reviews

**Time Estimate**: 4-6 hours

---

#### 4. ContactPage - Missing Implementation
**File**: `src/pages/public/ContactPage.jsx`
**Required Implementation**:
- [ ] Contact form with Zod validation
- [ ] Fields: name, email, subject, message
- [ ] Email integration with backend
- [ ] Success/error states

**Time Estimate**: 3-4 hours

---

#### 5. FreeTrial Page - Incomplete
**File**: `src/pages/public/FreeTrialPage.jsx` (line 16-25)
```javascript
Line 20: "Free Trial Form Coming Soon" placeholder
<p className="text-light-bg/70 mb-8">Free Trial Form Coming Soon</p>
```
**Required Implementation**:
- [ ] Free trial signup form
- [ ] Validate email and create temporary member account
- [ ] Set 7-day expiration
- [ ] Return success with trial details

**Time Estimate**: 4-6 hours

---

### Password Recovery Flow (3 Pages)

#### 1. ForgotPasswordPage
**File**: `src/pages/auth/ForgotPasswordPage.jsx`
**Required**:
- [ ] Email input with validation
- [ ] POST /auth/forgot-password endpoint call
- [ ] Success message: "Check your email"
- [ ] Backend sends reset link

**Time Estimate**: 2-3 hours

---

#### 2. ResetPasswordPage
**File**: `src/pages/auth/ResetPasswordPage.jsx`
**Required**:
- [ ] Parse token from URL query param
- [ ] Password + confirm password fields
- [ ] Strength indicator
- [ ] POST /auth/reset-password with token
- [ ] Redirect to login on success

**Time Estimate**: 3-4 hours

---

#### 3. VerifyEmailPage
**File**: `src/pages/auth/VerifyEmailPage.jsx`
**Required**:
- [ ] Display verification status
- [ ] Auto-verify if token in URL
- [ ] Resend verification email button
- [ ] POST /auth/verify-token endpoint

**Time Estimate**: 2-3 hours

---

### Admin Pages Missing Implementation (8 of 9)

| Page | File | Status | API Needed | Hours |
|------|------|--------|-----------|-------|
| Members | `MembersPage.jsx` | ❌ | GET /admin/members | 8 |
| Gym List | `GymsPage.jsx` | ❌ | GET /admin/gyms | 6 |
| Classes | `ClassManagementPage.jsx` | ❌ | GET/POST /admin/classes | 8 |
| Trainers | `TrainerManagementPage.jsx` | ❌ | GET/POST /admin/trainers | 6 |
| Blog | `BlogPage.jsx` | ❌ | GET/POST/DELETE /admin/blogs | 8 |
| Reports | `ReportsPage.jsx` | ❌ | GET /admin/reports | 8 |
| Settings | `SettingsPage.jsx` | ❌ | PUT /admin/settings | 4 |
| Scheduled Reports | `ScheduledReportsPage.jsx` | ❌ | GET/POST /admin/scheduled-reports | 6 |
| Financial Settlement | `FinancialSettlementPage.jsx` | ❌ | GET /admin/settlement | 8 |

---

### Critical Code Locations

#### TODO/FIXME Comments

**Line 90** - [src/pages/member/DashboardPage.jsx](src/pages/member/DashboardPage.jsx#L90)
```javascript
// TODO: Fetch member data on mount
useEffect(() => {
  if (!memberProfile) {
    // Dispatch fetchMemberProfile if not already loaded
    console.log('Member profile not loaded'); // ❌ Not actually dispatching
  }
}, [memberProfile, dispatch]);
```
**Fix**: Replace with `dispatch(fetchMemberProfile(memberId))`

---

**Line 78** - [src/pages/member/ProfileSetupPage.jsx](src/pages/member/ProfileSetupPage.jsx#L78)
```javascript
// Mock Cloudinary upload - in production, use actual Cloudinary API
setUploadingPhoto(true);
try {
  // const response = await axios.post(
  //   `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_NAME}/image/upload`,
  //   formData
  // );
  // return response.data.secure_url;
  
  // Simulate upload
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return photoPreview; // ❌ Returns data URL, not secure URL
}
```
**Fix**: Implement actual Cloudinary SDK integration

---

**Line 193** - [src/pages/gymOwner/SubscriptionPage.jsx](src/pages/gymOwner/SubscriptionPage.jsx#L193)
```javascript
// In production: API call to cancel subscription
const handleCancel = () => {
  // ❌ No actual API call
  setShowCancelModal(false);
  setSubscription((prev) => ({...prev, status: 'canceled'}));
};
```
**Fix**: Add `POST /gym-owner/{gymId}/subscription/cancel`

---

**Line 276** - [src/pages/gymOwner/GymClassesPage.jsx](src/pages/gymOwner/GymClassesPage.jsx#L276)
```
Advanced calendar views coming soon. Use month view for now.
```
**Fix**: Implement full calendar functionality for class scheduling

---

### Missing Form Validations (10+ Pages)

**OnboardingFlow.jsx**
```javascript
Line 83-95: Manual validation instead of schema
const handleNextStep = async () => {
  if (step === 2 && !selectedGym) {
    toast.error('Please select a gym');
    return;
  }
  // ❌ No Zod schema
};
```
**Fix**: Create Zod schemas for each step, use react-hook-form

---

**ClassesPage.jsx**
```javascript
Line 150+: BookingModal exists but validation undefined
// ❌ No form validation in BookingModal
<BookingModal
  selectedClass={selectedClass}
  onBook={handleBookClass}
  onClose={() => setShowBookingModal(false)}
/>
```
**Fix**: Add Zod validation schema for booking form

---

**TrainersPage.jsx**
```javascript
Line 200+: SessionBookingModal exists but validation undefined
// ❌ No form validation for trainer session booking
```
**Fix**: Add Zod schema for session booking

---

**GymOwner Pages (5+)**:
- GymClassesPage - Class creation form
- StaffManagementPage - Staff form
- AnnouncementPage - Announcement form
- BrandingPage - Branding form
- SubscriptionPage - Plan selection form

---

### API Integration Gaps

#### Routes That Need API Integration

**AppRouter.jsx Line 87-98** - Token Verification
```javascript
const AppRouter = () => {
  const dispatch = useDispatch();
  const store = useStore();
  const { accessToken, isTokenVerifying } = useSelector((state) => state.auth);

  // Initialize store reference for interceptors
  useEffect(() => {
    setStore(store); // ❓ Verify this works properly
  }, [store]);

  // Verify token on app mount
  useEffect(() => {
    if (accessToken) {
      dispatch(verifyTokenAsync(accessToken)); // ❓ Check if backend endpoint exists
    }
  }, [dispatch, accessToken]);
```

---

#### Unused Redux Thunks (Defined but Never Dispatched)

**gymSlice.js - Lines 6-32**
```javascript
export const fetchGyms = createAsyncThunk(...) // ❌ Never called
export const fetchGymDetails = createAsyncThunk(...) // ❌ Never called
```
**Used by**: Should be in LocationsPage, ClassesPage, OnboardingFlow
**Status**: ✅ Thunk exists, just needs to be dispatched

---

**classSlice.js - Lines 11-53**
```javascript
export const fetchClasses = createAsyncThunk(...) // ❌ Never called
export const bookClass = createAsyncThunk(...) // ❌ Never called in ClassesPage
export const cancelBooking = createAsyncThunk(...) // ❌ Never called
```
**Used by**: ClassesPage, BookingModal
**Status**: ✅ Thunks exist, just needs dispatching

---

**trainerSlice.js - Lines 10-51**
```javascript
export const fetchTrainers = createAsyncThunk(...) // ❌ Never called
export const bookSession = createAsyncThunk(...) // ❌ Never called
export const rateTrainer = createAsyncThunk(...) // ❌ Never called
```
**Used by**: TrainersPage, SessionBookingModal
**Status**: ✅ Thunks exist, just needs dispatching

---

### Accessibility Quick Fixes

#### ARIA Labels Missing

**Navbar.jsx Line 70**
```javascript
<button
  onClick={toggleMobileMenu}
  // ❌ Missing aria-label and aria-controls
  className="lg:hidden"
>
  {isOpen ? <X size={24} /> : <Menu size={24} />}
</button>
```
**Fix**: Add `aria-label="Toggle navigation menu" aria-expanded={isOpen} aria-controls="mobile-menu"`

---

**Button.jsx Line 40**
```javascript
{LeftIcon && !isLoading && <LeftIcon size={size === 'sm' ? 16 : 20} />}
// ❌ Icon-only buttons need aria-label
```
**Fix**: If no children, add `aria-label` prop

---

**Input.jsx Line 35**
```javascript
<label className={...}>
  {label}
</label>
// ❌ Label not associated with input via htmlFor
```
**Fix**: Add `htmlFor` to label, add `id` to input

---

#### Charts Not Accessible

**AdminDashboardPage.jsx Line 48+**
```javascript
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={chartData}>
    {/* ❌ No keyboard navigation, no data table alternative */}
  </LineChart>
</ResponsiveContainer>
```

**ProgressPage.jsx Line 150+**
```javascript
{/* Same issue with Recharts */}
```

**Fix**: Add role="img" with aria-label describing data, provide data table alternative

---

### Performance Issues

#### Large Lists Without Virtualization

**ClassesPage Line 200**
```javascript
const allClasses = [
  { id: 1, ... }, { id: 2, ... }, ... { id: 20, ... }
  // ❌ 20+ items hardcoded, no pagination
];
return (
  <div className="grid ...">
    {allClasses.map(cls => <ClassCard key={cls.id} ... />)}
  </div>
);
```
**Fix**: Use react-window FixedSizeList or implement pagination

---

**TrainersPage Line 180**
```javascript
const trainers = [
  { id: 1, ... }, { id: 2, ... }, ... { id: 20, ... }
  // ❌ 20+ trainers hardcoded
];
return (
  <div>
    {trainers.map(trainer => <TrainerCard key={trainer.id} ... />)}
  </div>
);
```
**Fix**: Implement pagination + lazy loading

---

### Image Loading Issues

**HomePage.jsx Line 55**
```javascript
<div
  className="absolute inset-0 bg-cover bg-center"
  style={{
    backgroundImage: 'url(https://images.unsplash.com/...)',
    // ❌ No lazy loading, no responsive sizes
    opacity: 0.1,
  }}
/>
```
**Fix**: Use `<img loading="lazy"` or Intersection Observer

---

**TrainersPage Line 80+**
```javascript
<img
  src="https://via.placeholder.com/200?text=Sarah"
  // ❌ Missing alt attribute
  className="..."
/>
```
**Fix**: Add `alt="Sarah Johnson, Yoga Instructor"`

---

### Environment & Build Issues

#### ENV Mismatch

**.env** (Line 1)
```
VITE_API_BASE_URL=http://localhost:5001/api
```

**.env.example** (Line 1)
```
VITE_API_BASE_URL=http://localhost:5000/api
```
**Issue**: Port mismatch (5001 vs 5000)
**Fix**: Update .env.example to port 5001

---

#### Missing Build Scripts

**package.json** - Missing:
```json
"test": "vitest",           // ❌ No test runner
"format": "prettier ...",    // ❌ No code formatter
"type-check": "tsc --noEmit" // ❌ No TS checking (if using TS)
```

---

### State Management Issues

#### Unused Selectors

**ClassesPage.jsx Line 18**
```javascript
const { profile } = useSelector((state) => state.member); // ❌ Imported but never used
```

---

#### Unused Redux Slices

**notificationSlice.js**
```javascript
// Slice exists but:
// ❌ No component dispatches notifications
// ❌ No socket/real-time integration
// ❌ NotificationCenter component likely unused
```

---

### TypeScript/Type Safety

**Missing**: No TypeScript configuration observed
- No `.ts` or `.tsx` files
- No type definitions for Redux state
- No type safety on API responses

**Recommendation**: Add TypeScript incrementally

---

## IMPLEMENTATION PRIORITY MATRIX

### Critical Track (Block Frontend Release)
```
Priority 1: Password recovery flow (6h)
Priority 2: Missing public pages (20h)
Priority 3: API integration core endpoints (40h)
Priority 4: Form validation (10h)
Total: 76 hours (2-3 weeks at 40h/week)
```

### High Priority Track (Needed for Admin/Gym Owner)
```
Priority 5: Admin pages (30h)
Priority 6: Gym owner pages (20h)
Priority 7: Error handling (10h)
Total: 60 hours (1.5-2 weeks)
```

### Medium Priority Track (Polish/A11y)
```
Priority 8: Accessibility improvements (12h)
Priority 9: Responsive design testing (8h)
Priority 10: Performance optimization (8h)
Total: 28 hours (1 week)
```

---

## CODE SNIPPETS FOR QUICK FIXES

### Quick Fix #1: Enable DashboardPage Fetch

**File**: `src/pages/member/DashboardPage.jsx`
**Current** (Line 90-97):
```javascript
useEffect(() => {
  if (!memberProfile) {
    // Dispatch fetchMemberProfile if not already loaded
    console.log('Member profile not loaded');
  }
}, [memberProfile, dispatch]);
```

**Fixed**:
```javascript
useEffect(() => {
  if (!memberProfile && user?.id) {
    dispatch(fetchMemberProfile(user.id));
  }
}, [memberProfile, dispatch, user?.id]);
```

---

### Quick Fix #2: Add Aria Label to Navbar Button

**File**: `src/components/layout/Navbar.jsx`
**Current** (Line 70):
```javascript
<button onClick={toggleMobileMenu} className="lg:hidden">
  {isOpen ? <X size={24} /> : <Menu size={24} />}
</button>
```

**Fixed**:
```javascript
<button
  onClick={toggleMobileMenu}
  className="lg:hidden"
  aria-label="Toggle navigation menu"
  aria-expanded={isOpen}
  aria-controls="mobile-menu"
>
  {isOpen ? <X size={24} /> : <Menu size={24} />}
</button>
```

---

### Quick Fix #3: Add Form Validation to OnboardingFlow

**File**: `src/pages/member/OnboardingFlow.jsx`
**Add at top** (after imports):
```javascript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const step2GymSchema = z.object({
  gymId: z.string().min(1, 'Please select a gym'),
});

const step3PlanSchema = z.object({
  planId: z.string().min(1, 'Please select a plan'),
});

const step4GoalsSchema = z.object({
  goals: z.array(z.string()).min(1, 'Select at least one goal'),
});
```

---

### Quick Fix #4: Export Unused Thunk

**File**: `src/pages/LocationsPage.jsx`
**Add at top**:
```javascript
import { useDispatch, useSelector } from 'react-redux';
import { fetchGyms } from '../app/slices/gymSlice';

const LocationsPage = () => {
  const dispatch = useDispatch();
  const { list: gyms, loading } = useSelector(state => state.gyms);

  useEffect(() => {
    dispatch(fetchGyms());
  }, [dispatch]);

  if (loading) return <LoadingFallback />;

  return (
    <div>
      {gyms.map(gym => (
        <GymCard key={gym.id} gym={gym} />
      ))}
    </div>
  );
};
```

---

## Testing Quick Check

To verify changes, use:
```bash
# Build check
npm run build

# Lint check
npm run lint

# Dev preview
npm run preview
```

---

**Last Updated**: March 24, 2026
