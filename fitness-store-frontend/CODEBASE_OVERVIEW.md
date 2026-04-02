# Fitness Store Frontend - Codebase Overview

## 1. Redux Store Structure

### Store Configuration
- **Location**: [src/app/store.js](src/app/store.js)
- **Framework**: Redux Toolkit + Redux Persist (for localStorage persistence)
- **Persisted Slices**:
  - `auth`: user, accessToken, refreshToken, isAuthenticated
  - `member`: currentMembership, bookings, favorites

### Available Slices

#### **authSlice** ([src/app/slices/authSlice.js](src/app/slices/authSlice.js))
**Async Thunks:**
- `loginAsync({ email, password, rememberMe })` - Login with optional remember-me
- `registerAsync(payload)` - User registration
- `logoutAsync()` - Logout
- `getMeAsync()` - Fetch current user
- `refreshTokenAsync()` - Refresh access token
- `verifyTokenAsync()` - Verify token validity

**State Structure:**
```javascript
{
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null
}
```

**Special Features:**
- Axios interceptors for automatic token attachment and 401 handling
- Token refresh queue system to prevent multiple refresh calls
- Automatic logout on invalid refresh token

---

#### **memberSlice** ([src/app/slices/memberSlice.js](src/app/slices/memberSlice.js))
**Async Thunks:**
- `fetchMemberProfile(memberId)` - Get member profile
- `updateMemberProfile({ memberId, data })` - Update profile
- `purchaseMembership({ memberId, planId, paymentData })` - Buy membership
- `fetchMemberBookings(memberId)` - Get user's class bookings
- `addToFavorites({ memberId, itemId, itemType })` - Add to favorites
- `removeFromFavorites({ memberId, itemId })` - Remove from favorites

**State Structure:**
```javascript
{
  profile: null,
  currentMembership: null,
  bookings: [],
  favorites: [],
  loading: false,
  profileLoading: false,
  error: null,
  successMessage: null
}
```

**Redux Actions:**
- `clearError()` - Clear error message
- `clearSuccessMessage()` - Clear success message

---

#### **gymSlice** ([src/app/slices/gymSlice.js](src/app/slices/gymSlice.js))
**Async Thunks:**
- `fetchGyms(filters)` - Get gyms with filter support
- `fetchGymDetails(gymId)` - Get single gym details

**State Structure:**
```javascript
{
  list: [],
  selectedGym: null,
  filters: {
    location: '',
    amenities: [],
    priceRange: [0, 200],
    rating: 0
  },
  loading: false,
  error: null,
  totalCount: 0
}
```

---

#### **classSlice** ([src/app/slices/classSlice.js](src/app/slices/classSlice.js))
**Async Thunks:**
- `fetchClasses(filters)` - Get classes
- `fetchClassDetails(classId)` - Get class details
- `bookClass({ classId, memberId })` - Book a class
- `cancelClassBooking({ bookingId })` - Cancel booking

---

#### **trainerSlice** ([src/app/slices/trainerSlice.js](src/app/slices/trainerSlice.js))
**Async Thunks:**
- `fetchTrainers(filters)` - Get trainers
- `fetchTrainerDetails(trainerId)` - Get trainer details
- `bookTrainerSession({ trainerId, memberId, sessionData })` - Book session
- `rateTrainer({ trainerId, rating, comment })` - Rate trainer

---

#### **notificationSlice** ([src/app/slices/notificationSlice.js](src/app/slices/notificationSlice.js))
**Redux Actions (no API calls):**
- `addNotification(payload)` - Add a notification
- `markAsRead(notificationId)` - Mark single as read
- `markAllAsRead()` - Mark all as read
- `removeNotification(notificationId)` - Delete notification
- `clearNotifications()` - Clear all
- `receiveNotification({ type, data, title, message })` - Handle real-time notifications

**State Structure:**
```javascript
{
  notifications: [
    {
      id: timestamp,
      type: 'booking' | 'class_reminder' | 'promotion' | 'system',
      title: string,
      message: string,
      data: object, // Additional context
      timestamp: ISO string,
      read: boolean
    }
  ],
  unreadCount: 0
}
```

---

#### **uiSlice** ([src/app/slices/uiSlice.js](src/app/slices/uiSlice.js))
**Redux Actions:**
- `toggleSidebar()`, `setSidebarOpen(bool)`
- `toggleMobileMenu()`, `setMobileMenuOpen(bool)`
- `toggleDarkMode()`, `setDarkMode(bool)`
- `setPageLoading(bool)`
- `setSearchQuery(string)`
- `setFilters(filterObj)`
- `clearFilters()`
- `setViewMode('grid' | 'list')`
- `openModal(modalName)`, `closeModal(modalName)`

**State Structure:**
```javascript
{
  sidebarOpen: false,
  mobileMenuOpen: false,
  darkMode: true,
  pageLoading: false,
  searchQuery: '',
  viewMode: 'grid',
  filters: {
    sort: 'popular',
    priceRange: [0, 200],
    location: 'all'
  },
  modalStates: {
    loginModal: false,
    signupModal: false,
    bookingModal: false,
    filterModal: false
  }
}
```

---

#### **loadingSlice** ([src/app/slices/loadingSlice.js](src/app/slices/loadingSlice.js))
**Redux Actions:**
- `startLoading(key)` - Start loading for API endpoint
- `stopLoading(key)` - Stop loading
- `setLoadingError({ key, error })` - Set error for loading state
- `clearLoadingError(key)` - Clear error
- `clearAllLoading()` - Reset all loading

**State Structure:**
```javascript
{
  [key]: {
    loading: boolean,
    error: null | string
  }
}
```

**Usage Pattern in Thunks:**
```javascript
export const fetchSomething = createAsyncThunk(
  'slice/fetch',
  async (payload, { dispatch }) => {
    dispatch(startLoading('gyms'));
    try {
      // API call
      dispatch(stopLoading('gyms'));
      return data;
    } catch (error) {
      dispatch(setLoadingError({ key: 'gyms', error: error.message }));
    }
  }
);
```

---

## 2. Existing Utilities & Helpers

### 2.1 Custom Hooks

#### **useApiLoading** ([src/hooks/useApiLoading.js](src/hooks/useApiLoading.js))
```javascript
const { isLoading, error } = useApiLoading('gyms');
const { isLoading: classLoading } = useApiLoading('classes');
const { isLoading, errorCount } = useGlobalLoading(); // Check any endpoint loading
```

#### **useLanguage** ([src/hooks/useLanguage.js](src/hooks/useLanguage.js))
```javascript
const { t, language, setLanguage, isSpanish, isEnglish, i18n } = useLanguage();
// Usage: {t('member.nav.dashboard')}
```

#### **usePWA** ([src/hooks/usePWA.js](src/hooks/usePWA.js))
```javascript
const { deferredPrompt, isInstallable, isInstalled } = usePWA();
// Handles beforeinstallprompt event and service worker registration
// Service worker path: /sw.js
// Notifies user on updates
```

### 2.2 Context & Providers

#### **ThemeContext** ([src/context/ThemeContext.jsx](src/context/ThemeContext.jsx))
```javascript
const { isDark, setIsDark } = useTheme();
// Features:
// - Persists to localStorage ('crunchfit-theme')
// - Auto-detects system preference
// - Applies 'dark' class to <html> for Tailwind dark: prefix
// - Listens to system theme changes
```

### 2.3 Authentication Utilities
- **Location**: [src/app/slices/authSlice.js](src/app/slices/authSlice.js) lines 40-103
- **Axios Interceptors**: 
  - Request interceptor attaches Bearer token
  - Response interceptor handles 401 with token refresh
  - Queue system for failed requests during refresh

### 2.4 Accessibility Utilities ([src/utils/accessibility.js](src/utils/accessibility.js))
```javascript
export const useFocusTrap(containerRef) // Trap focus in modal/dialog
export const announceToScreenReader(message, politeness)
export const focusElement(element, alignToTop)
export const isElementInViewport(element)
export const getFocusableElements(container)
```

---

## 3. Component Patterns

### 3.1 Modal Pattern
**Location**: [src/components/ui/Modal.jsx](src/components/ui/Modal.jsx)

```javascript
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Modal Title"
  size="md" // sm | md | lg | xl
  footer={<button>OK</button>}
>
  <p>Content here</p>
</Modal>
```
- Uses Headless UI's Dialog
- Framer Motion animations (scale + fade)
- Backdrop blur effect

---

### 3.2 Form & Input Pattern
**Location**: [src/components/ui/Input.jsx](src/components/ui/Input.jsx)

```javascript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Minimum 6 characters'),
});

const MyForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    // Handle submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Email"
        {...register('email')}
        error={errors.email?.message}
        leftIcon={Mail}
        helperText="We'll never share your email"
      />
    </form>
  );
};
```

**Input Features:**
- Floating labels
- Error animations (AnimatePresence)
- Icon support (left/right)
- Helper text
- Disabled state
- Focus styles

---

### 3.3 Toast/Notification Pattern
**Library**: `react-hot-toast`

```javascript
import toast from 'react-hot-toast';

// Basic usage
toast.success('Welcome back!');
toast.error('Login failed');
toast.loading('Processing...');

// Custom
toast.custom((t) => (
  <div className={t.visible ? 'animate-enter' : 'animate-leave'}>
    Custom toast content
  </div>
));
```

**Used in:**
- [src/pages/auth/LoginPage.jsx](src/pages/auth/LoginPage.jsx)
- [src/pages/auth/RegisterPage.jsx](src/pages/auth/RegisterPage.jsx)
- [src/pages/member/ProfileSetupPage.jsx](src/pages/member/ProfileSetupPage.jsx)

---

### 3.4 Loading & Skeleton Pattern
**Location**: [src/components/loading/](src/components/loading/)

```javascript
// Suspense boundary
<Suspense fallback={<LoadingFallback />}>
  <LazyComponent />
</Suspense>

// Using useApiLoading hook
const { isLoading } = useApiLoading('gyms');
if (isLoading) return <Skeleton />;
```

---

### 3.5 Animation Pattern
**Library**: `framer-motion`

```javascript
import { motion, AnimatePresence } from 'framer-motion';

// Achievement badges with stagger
<motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.3, delay: index * 0.05 }}
  whileHover={unlocked ? { scale: 1.1, y: -4 } : {}}
>
  {badge.icon}
</motion.div>

// Conditional animations
{unlocked && (
  <motion.div
    animate={{ scale: [1, 1.2, 1] }}
    transition={{ duration: 2, repeat: Infinity }}
    className="glow-effect"
  />
)}
```

**Examples:**
- [src/components/member/Achievements.jsx](src/components/member/Achievements.jsx) - Badge animations, glow effects
- [src/pages/auth/LoginPage.jsx](src/pages/auth/LoginPage.jsx) - Page transitions

---

### 3.6 Custom UI Components
**Location**: [src/components/ui/](src/components/ui/)

Available:
- `Avatar.jsx` - User avatar with initials
- `Badge.jsx` - Status badges
- `Button.jsx` - Primary/secondary buttons with loading state
- `Card.jsx` - Container cards
- `Dropdown.jsx` - Dropdown menu
- `Modal.jsx` - See 3.1
- `Input.jsx` - See 3.2
- `Rating.jsx` - Star rating display
- `Skeleton.jsx` - Loading skeletons for different layouts

---

## 4. Existing Pages & Member Components

### 4.1 Member Pages
**Location**: [src/pages/member/](src/pages/member/)

#### **DashboardPage** ([src/pages/member/DashboardPage.jsx](src/pages/member/DashboardPage.jsx))
- Redux state: `member.profile`, `member.bookings`, `member.currentMembership`
- Auth state: `auth.user`
- Includes: WelcomeCard, TodaysSchedule, CountdownTimer, QuickActions, MembershipCard, ActivityFeed, Achievements
- Uses MemberLayout wrapper
- Local logic for "next class within 24 hours"

#### **ProfileSetupPage** ([src/pages/member/ProfileSetupPage.jsx](src/pages/member/ProfileSetupPage.jsx))
- Form using `react-hook-form` + Zod
- Dispatches `updateMemberProfile` async thunk
- Toast notifications for success/error

#### **Bookings** ([src/pages/member/Bookings.jsx](src/pages/member/Bookings.jsx))
- Lists user's class bookings
- Uses Redux state: `member.bookings`

#### **OnboardingFlow** ([src/pages/member/OnboardingFlow.jsx](src/pages/member/OnboardingFlow.jsx))
- Multi-step member setup
- Form validation with react-hook-form
- Toast notifications

---

### 4.2 Member Components
**Location**: [src/components/member/](src/components/member/)

| Component | Purpose |
|-----------|---------|
| `WelcomeCard.jsx` | Hero greeting + key stats |
| `TodaysSchedule.jsx` | Today's class list |
| `CountdownTimer.jsx` | Time until next class |
| `QuickActions.jsx` | Rapid action cards (Book, Browse, etc.) |
| `MembershipCard.jsx` | Current membership display |
| `ActivityFeed.jsx` | Timeline of recent activities |
| `Achievements.jsx` | Badge system with unlock animations |

**Pattern**: All components use:
- `useTheme()` for dark mode
- `useLanguage()` for i18n
- Redux selectors for data
- Framer Motion for animations

---

### 4.3 MemberLayout
**Location**: [src/layouts/MemberLayout.jsx](src/layouts/MemberLayout.jsx)

```javascript
<MemberLayout>
  {children}
</MemberLayout>
```

**Features:**
- Sidebar (desktop) with icons + labels
- Bottom navigation (mobile)
- Top bar with:
  - Greeting message
  - Search bar
  - Notifications icon (with unread badge)
  - Profile dropdown
- Navigation items:
  - Dashboard
  - My Classes / Classes
  - Trainers
  - Nutrition
  - Progress
  - Achievements
  - Messaging
  - Settings
- Logout action

**State Integration:**
- Uses Redux for user data
- Route-aware (highlights active nav item)
- Responsive design with Tailwind

---

## 5. Available Dependencies & Libraries

### Core
- `React` 19.2.4
- `React Router` 7.13.2
- `Redux` (Toolkit 2.11.2 + React-Redux 9.2.0)
- `Redux Persist` 6.0.0

### Forms & Validation
- `react-hook-form` 7.72.0
- `@hookform/resolvers` 5.2.2
- `zod` 4.3.6

### UI & Animations
- `framer-motion` 12.38.0
- `@headlessui/react` 2.2.9
- `lucide-react` 1.0.1 (icons)
- `tailwindcss` 4.2.2

### Notifications
- `react-hot-toast` 2.6.0

### Data Fetching
- `axios` 1.13.6

### Date/Time
- `date-fns` 4.1.0

### Maps
- `leaflet` 1.9.4
- `react-leaflet` 5.0.0

### Other
- `react-intersection-observer` 10.0.3 (lazy loading)
- `react-window` 1.8.10 (virtualization)
- `swiper` 12.1.2 (carousels)
- `react-helmet-async` 1.3.0 (SEO/meta tags)
- `vite-plugin-pwa` 0.17.4 (PWA support)

---

## 6. API Call Patterns

### Pattern 1: Simple Async Thunk
```javascript
export const fetchGyms = createAsyncThunk(
  'gyms/fetchGyms',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters);
      const response = await axios.get(`${API_BASE_URL}/gyms?${params}`);
      return response.data.gyms;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch gyms');
    }
  }
);
```

### Pattern 2: Async Thunk with Request Body
```javascript
export const purchaseMembership = createAsyncThunk(
  'member/purchaseMembership',
  async ({ memberId, planId, paymentData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/members/${memberId}/memberships`,
        { planId, paymentData }
      );
      return response.data.membership;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to purchase');
    }
  }
);
```

### Pattern 3: Extra Reducers (Handling Thunk States)
```javascript
extraReducers: (builder) => {
  builder
    .addCase(fetchGyms.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchGyms.fulfilled, (state, action) => {
      state.loading = false;
      state.list = action.payload;
    })
    .addCase(fetchGyms.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
}
```

### Pattern 4: Using Async Thunks in Components
```javascript
const MyComponent = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector(state => state.gyms);

  useEffect(() => {
    dispatch(fetchGyms({ location: 'NYC' }));
  }, [dispatch]);

  if (loading) return <Skeleton />;
  if (error) return <div>Error: {error}</div>;

  return <div>{/* Render list */}</div>;
};
```

---

## 7. Environment & Configuration

### Environment Variables
- **File**: `.env` / `.env.example`
- **Key Variable**: `VITE_API_BASE_URL` (defaults to `http://localhost:5000/api`)

### Build Script Hooks
```json
{
  "build": "vite build && node scripts/generate-sitemap.js",
  "build:analyze": "vite build && node scripts/analyze-bundle.js"
}
```

### Available Scripts
```bash
npm run dev          # Start dev server (Vite)
npm run build        # Build & generate sitemap
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run analyze      # Analyze bundle size
npm run generate:sitemap  # Generate sitemap only
```

---

## 8. Key Patterns Summary Table

| Feature | Library | Location | Example |
|---------|---------|----------|---------|
| **Dark Mode** | React Context + Tailwind | [ThemeContext.jsx](src/context/ThemeContext.jsx) | `useTheme()` |
| **Forms** | react-hook-form + Zod | [LoginPage.jsx](src/pages/auth/LoginPage.jsx) | Schema validation |
| **Modals** | @headlessui + Framer Motion | [Modal.jsx](src/components/ui/Modal.jsx) | Scale + fade animations |
| **Notifications** | react-hot-toast | [LoginPage.jsx](src/pages/auth/LoginPage.jsx) line 10 | `toast.success('msg')` |
| **Animations** | framer-motion | [Achievements.jsx](src/components/member/Achievements.jsx) | Stagger, glow, scale |
| **API Calls** | axios + Redux Thunks | [authSlice.js](src/app/slices/authSlice.js) | Token refresh queue |
| **Loading States** | Redux slice + Hook | [useApiLoading.js](src/hooks/useApiLoading.js) | Per-endpoint tracking |
| **i18n** | react-i18next | [useLanguage.js](src/hooks/useLanguage.js) | `t('translation.key')` |
| **Icons** | lucide-react | [MemberLayout.jsx](src/layouts/MemberLayout.jsx) | `<Dashboard size={20} />` |
| **Virtualization** | react-window | [package.json](package.json) | For lists >100 items |
| **SEO** | react-helmet-async | [package.json](package.json) | Meta tags management |
| **PWA** | vite-plugin-pwa | [usePWA.js](src/hooks/usePWA.js) | Service worker registration |

---

## 9. Notes on What's NOT Currently Implemented

- **Chart Libraries**: No recharts or chart.js (need to install if needed)
- **Confetti Library**: No confetti animations (would need to install if needed)
- **Server-Sent Events**: Notifications currently Redux-only (real-time via WebSocket not shown)
- **Advanced Forms**: No multi-step form library beyond custom logic
- **Error Boundary**: No global ErrorBoundary component shown (recommendation: add for React error catching)

---

## 10. Quick Start for Common Tasks

### Add a New Member Page
1. Create component in `src/pages/member/YourPage.jsx`
2. Wrap with `<MemberLayout>`
3. Use selectors from Redux slices as needed
4. Add route in `src/routes/`

### Add a Toast Notification
```javascript
import toast from 'react-hot-toast';
toast.success('Action completed!');
```

### Fetch Data in Component
```javascript
const dispatch = useDispatch();
const { list, loading } = useSelector(state => state.sliceName);

useEffect(() => {
  dispatch(asyncThunkName(params));
}, [dispatch]);
```

### Add Loading UI
```javascript
const { isLoading } = useApiLoading('sliceKey');
if (isLoading) return <Skeleton />;
```

### Use Theme in Styling
```javascript
const { isDark } = useTheme();
className={isDark ? 'bg-black' : 'bg-white'}
```

---

This overview covers the major architectural patterns and available utilities. For specific implementations, refer to the file paths listed throughout.
