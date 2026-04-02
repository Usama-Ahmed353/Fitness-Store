# Member Onboarding Flow & Profile Setup Documentation

## Overview
Complete member onboarding system implemented for CrunchFit Pro post-authentication flow. Two main components handle the multi-step onboarding and profile completion processes.

---

## Component 1: OnboardingFlow.jsx

**Location**: `src/pages/member/OnboardingFlow.jsx`  
**Size**: 11.62 KB (gzip: 3.33 KB)  
**Type**: Multi-step protected route component

### Features

#### Step 1: Welcome Carousel
- Three animated slides with floating icons (💪📅📊)
- Core messaging: "Crush Your Goals / Book Classes Easily / Track Your Progress"
- "Get Started" button to advance
- Animated vertical movement for visual interest

#### Step 2: Find Your Gym
- Location search input with real-time filtering
- Mock gym directory with 3 locations (Times Square, East Village, Midtown)
- Each gym displays:
  - Name and full address
  - Distance indicator
  - Amenities (Pool, Boxing Ring, Rock Climbing, etc.)
  - Selection highlight with checkmark
- Search filters gym list dynamically
- "Choose This Gym" button disabled until selection made

#### Step 3: Pick Your Plan
- 4 membership plan cards:
  - **Base**: $9.99/mo - Home gym access, locker rooms, 2 guest passes/year
  - **Peak**: $21.99/mo - Unlimited tanning, HydroMassage
  - **Peak Results**: $29.99/mo - 1 PT session/month, nutrition app
  - **Peak Plus**: $34.99/mo - Unlimited Crunch+, nutrition coaching
- Mock Stripe payment form (demo only):
  - Cardholder name, card number, expiry, CVC inputs
  - Note for testing: 4242 4242 4242 4242
- Form appears conditionally only after plan selection
- "Start Membership" button disabled until plan selected

#### Step 4: Set Your Goals
- **Goal Selection Chips** (5 options):
  - Lose Weight ⚖️
  - Build Muscle 💪
  - Improve Endurance 🏃
  - Flexibility 🧘
  - General Fitness ✨
- **Fitness Level Buttons**: Beginner / Intermediate / Advanced
- **Days Per Week Slider**: 1-7 days with visual value display
- All three inputs required before completion
- Error toast if any required field missing

### State Management
```javascript
const [step, setStep] = useState(1);
const [selectedGym, setSelectedGym] = useState(null);
const [selectedPlan, setSelectedPlan] = useState(null);
const [selectedGoals, setSelectedGoals] = useState([]);
const [fitnessLevel, setFitnessLevel] = useState('Beginner');
const [daysPerWeek, setDaysPerWeek] = useState(3);
const [searchQuery, setSearchQuery] = useState('');
const [isSubmitting, setIsSubmitting] = useState(false);
```

### Data Flow on Completion
- Saves onboarding data to localStorage:
  ```javascript
  {
    gymId: string,
    planId: string,
    goals: string[],
    fitnessLevel: string,
    daysPerWeek: number
  }
  ```
- Shows success toast
- Navigates to `/member/dashboard`
- Mock API delay: 1500ms

### UI/UX Patterns
- **Progress Indicator**: 4-step numbered progress bar that fills as user advances
- **Step Transitions**: AnimatePresence with fade + slide animations
- **Navigation**: Back button available on steps 2-4, prevents going back to step 1
- **Color Coding**: Accent color (#E94560) for selected states
- **Responsive**: Grid layouts adapt from 1 column on mobile to 2+ on desktop

---

## Component 2: ProfileSetupPage.jsx

**Location**: `src/pages/member/ProfileSetupPage.jsx`  
**Size**: 6.37 KB (gzip: 2.43 KB)  
**Type**: Single-page form component with file upload

### Features

#### Photo Upload Section
- Drag-and-drop file upload UI with visual indicator
- Supported formats: PNG, JPG, WebP
- File size limit: 5MB
- **Preview State**:
  - Shows uploaded image with 128px × 128px display
  - Remove button (X) to clear selection
  - Upload status indicator ("Photo selected" or "Uploading...")
- Validation:
  - File size validation (5MB max)
  - MIME type validation (image/jpeg, image/png, image/webp only)

#### Personal Information Section
- **First Name**: Required, minimum 2 characters
- **Last Name**: Required, minimum 2 characters
- **Birthday**: Date input field, required
- Real-time form validation via Zod schema
- Field-level error display

#### Emergency Contact Section
- **Contact Name**: Required, minimum 2 characters
- **Contact Phone**: 10-digit phone validation (supports formats: 5551234567 or 555-123-4567)
- Error messages for invalid phone formats

#### Medical Notes Section
- Optional textarea (4 rows)
- Placeholder guidance: "Any injuries, allergies, or medical conditions we should know about?"
- Helper text explaining purpose of medical information

#### Terms & Conditions
- Reminder banner with links to /terms and /privacy
- Visual separation with accent color background

### Form Validation

```javascript
const profileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  birthday: z.string().nonempty('Birthday is required'),
  emergencyContactName: z.string().min(2, 'Emergency contact name is required'),
  emergencyContactPhone: z.string().regex(
    /^\d{10}$|^\d{3}-\d{3}-\d{4}$/,
    'Valid phone number required'
  ),
  medicalNotes: z.string().optional(),
});
```

### Photo Upload Handling
```javascript
// Validation
- Checks file MIME type (image/jpeg, image/png, image/webp)
- Checks file size (max 5MB)
- Shows toast errors for validation failures

// Upload Flow (Mock Cloudinary)
- Shows "Uploading..." indicator
- Disables submit button during upload
- 1500ms simulated API delay
- Stores data URL as fallback (production uses Cloudinary secure_url)

// Production Cloudinary Integration (commented in code)
- FormData with file + upload_preset
- POST to Cloudinary /image/upload endpoint
- Returns secure_url for permanent storage
```

### Data Flow on Completion
- Validates all required fields
- Ensures photo is selected
- Optionally uploads photo to Cloudinary
- Saves profile data to localStorage:
  ```javascript
  {
    firstName: string,
    lastName: string,
    birthday: string,
    emergencyContactName: string,
    emergencyContactPhone: string,
    medicalNotes: string,
    photoUrl: string (data URL or Cloudinary URL)
  }
  ```
- Shows success toast
- Navigates to `/member/dashboard`
- Mock API delay: 1500ms

### UI/UX Patterns
- **Loading State**: Animated spinner button during form submission
- **Photo Preview**: Image display with remove button overlay
- **Error Display**: Field-level error messages below inputs
- **Feedback**: Toast notifications for validation and success
- **Accessibility**: Proper label associations and semantic HTML

---

## Routes Configuration

### Added Routes in `src/routes/AppRouter.jsx`

```javascript
// Member Onboarding Routes
<Route
  path="/member/onboarding"
  element={
    <ProtectedRoute>
      <PublicLayout>
        <OnboardingFlow />
      </PublicLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/member/profile-setup"
  element={
    <ProtectedRoute>
      <PublicLayout>
        <ProfileSetupPage />
      </PublicLayout>
    </ProtectedRoute>
  }
/>
```

#### Route Protection
- Both routes wrapped in `<ProtectedRoute>` component
- Requires valid authentication (isAuthenticated = true)
- Redirects unauthenticated users to `/login`
- Uses PublicLayout (includes Navbar + Footer)

#### Navigation Flow
1. User logs in → `/member/dashboard` or `/member/onboarding` (if first login)
2. If no gym selected → Redirect to `/member/onboarding`
3. Complete onboarding → Navigates to `/member/dashboard`
4. If profile incomplete → Link to `/member/profile-setup`
5. Complete profile → Navigates back to `/member/dashboard`

---

## Integration Points

### Redux Dependencies
- `useSelector` to check authentication state
- No direct Redux dispatch (localStorage-based state management)
- Token verification handled by AppRouter

### External Libraries
- **react-hook-form**: Form state and validation
- **@hookform/resolvers**: Zod integration with react-hook-form
- **zod**: Schema validation
- **framer-motion**: Animations (AnimatePresence, motion components)
- **react-hot-toast**: Toast notifications
- **lucide-react**: Icons (Upload, X, MapPin, Check, etc.)

### Backend API Expectations
Currently mocked with 1500ms delays. Future implementations should:
- POST `/api/onboarding` - Save gym, plan, goals, fitness level
- POST `/api/profile` - Save personal info and payment data
- POST `/api/profile/photo` - Upload photo to Cloudinary

### Cloudinary Integration
**Status**: Commented out, ready for implementation
- Requires environment variables:
  - `REACT_APP_CLOUDINARY_NAME`
  - `REACT_APP_CLOUDINARY_PRESET`
- File upload handling already in place
- Error handling for upload failures

---

## Mock Data

### Gyms (3 locations)
```javascript
[
  { id: 'gym-1', name: 'Times Square, New York', address: '404 W 42nd St...', distance: '0.5 miles away', amenities: ['Pool', 'Rock Climbing', 'Sauna'] },
  { id: 'gym-2', name: 'East Village, New York', address: '128 E Houston St...', distance: '1.2 miles away', amenities: ['Boxing Ring', 'Spinning Studio'] },
  { id: 'gym-3', name: 'Midtown, New York', address: '750 3rd Ave...', distance: '2.1 miles away', amenities: ['Olympic Pool', 'Basketball Court'] }
]
```

### Plans (4 membership tiers)
```javascript
[
  { id: 'base', name: 'Base', price: '$9.99/mo', features: ['Home gym access', 'Locker rooms', '2 guest passes/year'] },
  { id: 'peak', name: 'Peak', price: '$21.99/mo', features: ['All Base features', 'Unlimited tanning', 'HydroMassage'] },
  { id: 'peak-results', name: 'Peak Results', price: '$29.99/mo', features: ['All Peak features', '1 PT session/mo', 'Nutrition app'] },
  { id: 'peak-plus', name: 'Peak Plus', price: '$34.99/mo', features: ['All Peak Results', 'Unlimited Crunch+', 'Nutrition coaching'] }
]
```

### Goals (5 fitness objectives)
```javascript
[
  { id: 'lose-weight', label: 'Lose Weight', icon: '⚖️' },
  { id: 'build-muscle', label: 'Build Muscle', icon: '💪' },
  { id: 'endurance', label: 'Improve Endurance', icon: '🏃' },
  { id: 'flexibility', label: 'Flexibility', icon: '🧘' },
  { id: 'general', label: 'General Fitness', icon: '✨' }
]
```

---

## Testing Checklist

### OnboardingFlow
- [ ] All 4 steps render and navigate correctly
- [ ] Progress indicator updates with step
- [ ] Step 1 displays 3 carousel slides (with animation)
- [ ] Step 2 gym search filters list dynamically
- [ ] Step 2 gym selection shows checkmark when selected
- [ ] Step 3 plans display with features and pricing
- [ ] Step 3 Stripe mock form appears after plan selection
- [ ] Step 4 goals can be selected/deselected (chips toggle)
- [ ] Step 4 fitness level buttons are mutually exclusive
- [ ] Step 4 days per week slider changes value on drag
- [ ] Validation messages appear for missing required fields
- [ ] Back button navigates to previous step
- [ ] Final submission shows loading spinner and saves to localStorage
- [ ] Navigation to `/member/dashboard` on completion

### ProfileSetupPage
- [ ] Photo upload input accepts image files
- [ ] Photo preview displays after selection
- [ ] Remove photo button clears selection
- [ ] File size validation prevents files > 5MB
- [ ] File type validation rejects non-image formats
- [ ] Form validation shows field-level errors
- [ ] Phone number accepts both formats (10-digit and dashed)
- [ ] Birthday date picker works
- [ ] Medical notes are optional
- [ ] Submit button disabled during form submission
- [ ] Loading spinner shows during submission
- [ ] Profile data saved to localStorage on completion
- [ ] Navigation to `/member/dashboard` on completion
- [ ] Success toast notification displays

### Route Protection
- [ ] Unauthenticated users redirected to `/login`
- [ ] Authenticated users can access both routes
- [ ] Routes display with PublicLayout (Navbar + Footer)

---

## Production Deployment Notes

### Environment Variables Required
```
VITE_API_BASE_URL=https://api.crunchfit.com
REACT_APP_CLOUDINARY_NAME=your-cloudinary-name
REACT_APP_CLOUDINARY_PRESET=your-cloudinary-preset
```

### Cloudinary Setup
1. Create Cloudinary account
2. Get Cloud Name and Unsigned Upload Preset
3. Update environment variables
4. Uncomment Cloudinary upload code in ProfileSetupPage.jsx

### Backend API Implementation
1. Create POST `/api/onboarding` endpoint
2. Create POST `/api/profile` endpoint
3. Update mock API calls to real axios requests
4. Implement photo processing on backend

### Analytics/Tracking
- Consider tracking onboarding completion rates
- Monitor which plans are most selected
- Track fitness goal distribution by user segment

---

## File Size Summary

| Component | Size | Gzip | Description |
|-----------|------|------|-------------|
| OnboardingFlow.jsx | 11.62 KB | 3.33 KB | Multi-step onboarding wizard |
| ProfileSetupPage.jsx | 6.37 KB | 2.43 KB | Profile completion form |
| **Combined** | **17.99 KB** | **5.76 KB** | Total new onboarding bundle |

**Build Impact**: +2 modules (2601 vs 2599), +3.4 KB gzipped main bundle

---

## Support & Maintenance

### Known Limitations (Demo Mode)
- [ ] Stripe Elements not integrated (mock form only)
- [ ] Photo upload simulated (Cloudinary integration commented)
- [ ] Maps not rendered (gym location mockup only)
- [ ] Payment processing not functional
- [ ] Email verification of photo upload not tracked

### Next Steps for Production
1. Integrate real Stripe Elements form component
2. Complete Cloudinary photo upload integration
3. Connect to backend API endpoints
4. Add maps integration (Google Maps or Mapbox)
5. Implement email verification workflow
6. Add analytics tracking
7. Implement gym location autocomplete
8. Add promo code/referral code input on step 3

---

