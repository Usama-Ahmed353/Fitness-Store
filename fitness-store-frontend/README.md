# CrunchFit Pro Frontend

A modern React fitness platform frontend built with Vite, Redux, and Tailwind CSS.

## Project Overview

CrunchFit Pro is a comprehensive fitness management platform featuring:
- User authentication (Login/Register)
- Gym location browsing and class scheduling
- Personal trainer booking and ratings
- Membership management
- Real-time notifications
- Responsive design with dark theme

## Tech Stack

### Core Framework
- **React 18** - UI library
- **Vite 8** - Fast build tool and dev server
- **React Router v6** - Client-side routing
- **Redux Toolkit** - State management
- **redux-persist** - localStorage persistence

### Styling & Components
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Headless UI** - Accessible UI components
- **lucide-react** - Icon library

### Forms & Validation
- **react-hook-form** - Efficient form handling
- **@hookform/resolvers** - Schema validation adapters
- **zod** - TypeScript-first schema validation

### HTTP & Notifications
- **axios** - HTTP client
- **react-hot-toast** - Toast notifications
- **react-intersection-observer** - Lazy loading
- **swiper** - Touch-enabled carousels

### Utilities
- **date-fns** - Date manipulation
- **react-leaflet** - Map integration
- **leaflet** - Mapping library

## Project Structure

```
src/
├── app/
│   ├── store.js                 # Redux store configuration
│   └── slices/
│       ├── authSlice.js        # Authentication state
│       ├── gymSlice.js         # Gyms listing & details
│       ├── classSlice.js       # Classes & bookings
│       ├── memberSlice.js      # Member profile & membership
│       ├── trainerSlice.js     # Trainers & sessions
│       ├── notificationSlice.js # Real-time notifications
│       └── uiSlice.js          # UI state (modals, filters, etc.)
├── components/
│   ├── ui/                      # Shared UI components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Card.jsx
│   │   ├── Modal.jsx
│   │   ├── Badge.jsx
│   │   ├── Avatar.jsx
│   │   ├── Rating.jsx
│   │   ├── Skeleton.jsx
│   │   ├── Dropdown.jsx
│   │   └── index.js             # Component exports
│   └── layout/
│       ├── Navbar.jsx           # Navigation header
│       └── Footer.jsx           # Footer section
├── pages/
│   ├── Home.jsx                 # Home page
│   ├── Locations.jsx            # Gym locations
│   ├── Classes.jsx              # Classes listing
│   ├── Training.jsx             # Personal training
│   ├── CrunchPlus.jsx           # Membership info
│   ├── About.jsx                # About page
│   ├── FreeTrial.jsx            # Free trial signup
│   ├── Join.jsx                 # Join/Membership
│   ├── auth/
│   │   ├── Login.jsx            # Login page
│   │   └── Register.jsx         # Registration page
│   ├── member/
│   │   ├── Dashboard.jsx        # Member dashboard
│   │   ├── Bookings.jsx         # My bookings
│   │   └── Profile.jsx          # Profile settings
│   ├── admin/
│   │   └── Dashboard.jsx        # Admin dashboard
│   └── gym-owner/
│       └── Dashboard.jsx        # Gym owner dashboard
├── routes/
│   └── AppRouter.jsx            # Route configuration
├── App.jsx                       # Root component
├── index.css                     # Global styles
├── App.css                       # App styles
└── main.jsx                      # Entry point
```

## Design System

### Colors
- **Primary Navy**: `#1A1A2E` - Dark navy background
- **Accent Red**: `#E94560` - Vibrant accent color
- **Secondary Blue**: `#0F3460` - Deep blue accent
- **Dark Background**: `#16213E` - Darker alternative
- **Light Text**: `#F5F5F5` - Light gray for text

### Typography
- **Heading 1**: 48px, bold
- **Heading 2**: 36px, bold
- **Heading 3**: 28px, semibold
- **Body**: 16px, regular
- **Small**: 14px, regular
- **Font**: Inter (Google Fonts)
- **Line Height**: 1.6

## Features

### UI Components (10 Pre-built)
- **Button** - 5 variants (primary, secondary, outline, ghost, danger), 3 sizes
- **Input** - Floating labels, error states, icons, validation
- **Card** - 3 variants with hover & animation effects
- **Modal** - Accessible dialogs with Framer Motion animations
- **Badge** - Status indicators in 5 colors
- **Avatar** - Profile images with initials fallback
- **Rating** - Interactive star ratings
- **Skeleton** - Loading placeholders with pulse animation
- **Dropdown** - Animated menus with alignment options
- **Navbar** - Sticky header with mobile menu, language switcher
- **Footer** - Multi-column footer with social links

### State Management (Redux)
- **Auth** - User login/registration, token persistence
- **Gyms** - Gym listings with filtering
- **Classes** - Class schedule and booking
- **Members** - Profile, membership, bookings, favorites
- **Trainers** - Trainer directory and session booking
- **Notifications** - Real-time alerts
- **UI** - Modals, filters, search, view modes

### Routes

#### Public Routes
- `/` - Home page
- `/locations` - Gym locations
- `/classes` - Classes listing
- `/training` - Personal training
- `/crunch-plus` - Membership plans
- `/about` - About us
- `/free-trial` - Free trial signup
- `/join` - Join/Membership
- `/login` - User login
- `/register` - User registration

#### Protected Routes (Members)
- `/member/dashboard` - Member dashboard
- `/member/bookings` - My bookings
- `/member/profile` - Profile settings

#### Protected Routes (Admin)
- `/admin/dashboard` - Admin panel

#### Protected Routes (Gym Owners)
- `/gym-owner/dashboard` - Gym owner dashboard

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation

1. Install dependencies
```bash
npm install
```

2. Create environment file
```bash
cp .env.example .env
```

3. Update `.env` with your API endpoint
```
VITE_API_BASE_URL=http://localhost:5000/api
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building

Create a production build:
```bash
npm run build
```

Preview the build:
```bash
npm run preview
```

## Redux Store Configuration

All state slices configured with Redux Toolkit:

### Persisted Slices (localStorage)
- **Auth**: user, token, isAuthenticated
- **Member**: currentMembership, bookings, favorites

Redux-persist middleware automatically syncs these to localStorage.

## Performance

- **Code Splitting** - Lazy-loaded route components
- **Build Optimization** - Vite's optimized bundling
- **State Persistence** - Redux-persist for offline support
- **Animations** - Hardware-accelerated Framer Motion
- **Bundle**: ~348KB main JS (gzipped: ~112KB)

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ JavaScript support
- Mobile responsive design

## Next Steps

Ready for page implementation:
1. Create detailed page components using UI library
2. Integrate with backend API
3. Add real-time features (WebSocket for notifications)
4. Implement analytics
5. Set up error tracking

## License

Proprietary - CrunchFit Pro
