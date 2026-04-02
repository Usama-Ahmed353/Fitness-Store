# Quick Reference: Member Onboarding Flow

## Routes
```
/member/onboarding        → OnboardingFlow component
/member/profile-setup     → ProfileSetupPage component
```

## Navigation Flow
```
login → /member/dashboard (if gym selected)
     → /member/onboarding (if first login, no gym)
        → Step 1: Welcome carousel
        → Step 2: Gym selection (Step 1 → sets selectedGym)
        → Step 3: Plan selection (Step 2 → sets selectedPlan)
        → Step 4: Goals + fitness level (Step 3 → sets goals/level)
        → /member/dashboard (Step 4 complete → saves onboardingData to localStorage)

        → /member/profile-setup (from dashboard link)
           → Photo upload
           → Personal info form
           → Emergency contact
           → Medical notes
           → /member/dashboard (complete → saves profileData to localStorage)
```

## Data Structure

### OnboardingData (stored in localStorage)
```javascript
{
  gymId: "gym-1" | "gym-2" | "gym-3",
  planId: "base" | "peak" | "peak-results" | "peak-plus",
  goals: ["lose-weight", "build-muscle", "endurance"],  // array, min 1
  fitnessLevel: "Beginner" | "Intermediate" | "Advanced",
  daysPerWeek: 1-7            // number
}
```

### ProfileData (stored in localStorage)
```javascript
{
  firstName: string (min 2 chars),
  lastName: string (min 2 chars),
  birthday: YYYY-MM-DD,
  emergencyContactName: string (min 2 chars),
  emergencyContactPhone: "(555) 123-4567" or "5551234567",
  medicalNotes: string (optional),
  photoUrl: string (data URL or Cloudinary URL)
}
```

## Component Props

### OnboardingFlow
- No props required
- Fully self-contained with internal state
- Protected by ProtectedRoute in AppRouter

### ProfileSetupPage
- No props required
- Fully self-contained with form state
- Protected by ProtectedRoute in AppRouter

## Form Validation

### Gym Selection
```
Step 2 requirement: selectedGym !== null
Error: "Please select a gym"
```

### Plan Selection
```
Step 3 requirement: selectedPlan !== null
Error: "Please select a plan"
```

### Goal Selection
```
Step 4 requirement: selectedGoals.length > 0
Error: "Please select at least one goal"
```

### Profile Form
```
firstName: z.string().min(2, 'First name must be at least 2 characters')
lastName: z.string().min(2, 'Last name must be at least 2 characters')
birthday: z.string().nonempty('Birthday is required')
emergencyContactName: z.string().min(2, 'Emergency contact name is required')
emergencyContactPhone: z.string().regex(/^\d{10}$|^\d{3}-\d{3}-\d{4}$/, 'Valid phone number required')
medicalNotes: z.string().optional()
photoFile: required (via button check, not Zod)
```

## API Endpoints (To Be Implemented)

```
POST /api/onboarding
  Request: { gymId, planId, goals, fitnessLevel, daysPerWeek }
  Response: { success: true }

POST /api/profile
  Request: { firstName, lastName, birthday, emergencyContactName, emergencyContactPhone, medicalNotes, photoUrl }
  Response: { success: true, userId }

POST /api/profile/photo (Cloudinary or backend)
  Request: FormData with file
  Response: { secure_url: string }
```

## Mock Data Reference

### Gyms
```javascript
const mockGyms = [
  { id: 'gym-1', name: 'Times Square, New York', address: '404 W 42nd St...', distance: '0.5 miles away', amenities: ['Pool', 'Rock Climbing', 'Sauna'] },
  { id: 'gym-2', name: 'East Village, New York', address: '128 E Houston St...', distance: '1.2 miles away', amenities: ['Boxing Ring', 'Spinning Studio'] },
  { id: 'gym-3', name: 'Midtown, New York', address: '750 3rd Ave...', distance: '2.1 miles away', amenities: ['Olympic Pool', 'Basketball Court'] }
];
```

### Plans
```javascript
const plans = [
  { id: 'base', name: 'Base', price: '$9.99/mo', features: [...] },
  { id: 'peak', name: 'Peak', price: '$21.99/mo', features: [...] },
  { id: 'peak-results', name: 'Peak Results', price: '$29.99/mo', features: [...] },
  { id: 'peak-plus', name: 'Peak Plus', price: '$34.99/mo', features: [...] }
];
```

### Goals
```javascript
const goalOptions = [
  { id: 'lose-weight', label: 'Lose Weight', icon: '⚖️' },
  { id: 'build-muscle', label: 'Build Muscle', icon: '💪' },
  { id: 'endurance', label: 'Improve Endurance', icon: '🏃' },
  { id: 'flexibility', label: 'Flexibility', icon: '🧘' },
  { id: 'general', label: 'General Fitness', icon: '✨' }
];
```

## Styling Classes

### Colors
- Primary button: `variant="primary"` → `bg-accent text-white`
- Outline button: `variant="outline"` → border + text-light
- Selected state: `border-accent bg-accent/10`
- Error state: `border-red-500 text-red-500`

### Common Elements
```jsx
<Card variant="default" className="border border-accent/30 p-8">
  {/* Card content */}
</Card>

<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
  {/* Animated content */}
</motion.div>

<Button variant="primary" size="lg" className="w-full">
  {/* Button label */}
</Button>

<Input label="Field Label" placeholder="..." error={errorMessage} />
```

## Animations Used

### OnboardingFlow
- Step transitions: `fade + slide right (exit left)`
- Progress bar fill: `layout animation`
- Carousel slides: `y-axis bounce (3s repeat)`
- Button hover: `scale on hover`

### ProfileSetupPage
- Photo preview: `scale-in + fade on appearance`
- Form submission: `spinner animation`
- Remove button: `scale on hover`

Animation library: **Framer Motion** (`motion.*`, `AnimatePresence`, `whileHover`, `whileTap`)

## Testing Patterns

### Unit Test Example (ProfileSetupPage photo validation)
```javascript
it('should reject files larger than 5MB', () => {
  const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg');
  handlePhotoChange({ target: { files: [largeFile] } });
  // expect toast.error to be called with 'File size must be less than 5MB'
});
```

### E2E Test Example (Onboarding flow completion)
```javascript
// Navigate to /member/onboarding
// Click "Get Started"
// Select gym (click gym card)
// Select plan (click plan card, fill mock payment form)
// Select goals (click 2+ goal chips)
// Set fitness level (click Intermediate)
// Adjust slider to 5
// Click "Complete Onboarding"
// Expect navigation to /member/dashboard
// Expect onboardingData in localStorage
```

## Performance Tips

### Bundle Size
- OnboardingFlow: ~3.33 KB (gzipped)
- ProfileSetupPage: ~2.43 KB (gzipped)
- Use React.lazy() for route-based code splitting (already implemented in AppRouter)

### Loading States
- Show spinner during form submission (1500ms mock delay)
- Disable buttons during submission to prevent double-submit
- Display toast notifications for user feedback

### Form Optimization
- Use `react-hook-form` for minimal re-renders (only affected fields update)
- Zod validation is performant for client-side checking
- File preview uses FileReader API (efficient for local processing)

## Accessibility

- Form labels associated with inputs (`<label htmlFor>`)
- Error messages linked to inputs
- Keyboard navigation support via buttons
- Color not sole indicator (icons + text for feedback)
- Toast announcements for important state changes

## Environment Variables (Production)

```
VITE_API_BASE_URL=https://api.crunchfit.com
REACT_APP_CLOUDINARY_NAME=
REACT_APP_CLOUDINARY_PRESET=
```

## Integration Checklist

- [ ] Replace mock API calls with real axios requests to backend
- [ ] Uncomment and configure Cloudinary photo upload
- [ ] Integrate real Stripe Elements form (Step 3)
- [ ] Add Google Maps integration for gym location (Step 2)
- [ ] Implement confirmation email after profile completion
- [ ] Add server-side form validation (prevent tampering)
- [ ] Setup analytics tracking for onboarding metrics
- [ ] Add promo/referral code input (Step 3 or separate)
- [ ] Implement account activation email workflow
- [ ] Add onboarding completion banner to dashboard

