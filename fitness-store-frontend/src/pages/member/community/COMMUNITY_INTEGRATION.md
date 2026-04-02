# Community Features Integration Guide

## Overview

This guide explains how to integrate the Community Module into CrunchFit Pro's main member dashboard and router configuration.

## File Locations

```
Community Module Files:
├── src/pages/member/community/
│   ├── CommunityPage.jsx
│   ├── Leaderboard.jsx
│   ├── Forum.jsx
│   ├── ForumPostDetail.jsx
│   ├── CreatePostModal.jsx
│   ├── Members.jsx
│   └── index.js
│
├── src/utils/
│   ├── leaderboardCalculator.js
│   ├── forumCalculator.js
│   └── socialCalculator.js
│
└── src/pages/member/community/
    ├── COMMUNITY_MODULE.md (this file content)
    └── COMMUNITY_INTEGRATION.md (this integration guide)
```

## Step 1: Import Components

In your member dashboard router file (e.g., `src/pages/member/routes.jsx` or main router):

```jsx
import { CommunityPage } from '@/pages/member/community';
// Or import individual components:
import { Leaderboard, Forum, Members } from '@/pages/member/community';
```

## Step 2: Add Route

### Option A: Full Community Hub
```jsx
<Route 
  path="/community" 
  element={<CommunityPage userId={currentUserId} currentUser={userData} />} 
/>
```

### Option B: Individual Feature Routes
```jsx
<Route path="/community/leaderboard" element={<Leaderboard members={members} userId={currentUserId} />} />
<Route path="/community/forum" element={<Forum userId={currentUserId} />} />
<Route path="/community/members" element={<Members members={members} userId={currentUserId} allKudos={kudos} />} />
```

## Step 3: Add Navigation Link

In your member dashboard navigation/sidebar:

```jsx
import { Trophy, Users, MessageSquare } from 'lucide-react';

<nav>
  {/* ... existing navigation items ... */}
  
  <NavLink to="/community" className="flex items-center gap-2">
    <Trophy size={20} />
    Community
  </NavLink>
  
  {/* Or individual links */}
  <NavLink to="/community/leaderboard">Leaderboard</NavLink>
  <NavLink to="/community/forum">Forum</NavLink>
  <NavLink to="/community/members">Members</NavLink>
</nav>
```

## Step 4: Provide Required Context

Ensure your app provides these contexts (typically in your root layout):

```jsx
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <YourAppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}
```

## Step 5: Data Integration

### Fetching Data

```jsx
// In your member dashboard or page component
const [members, setMembers] = useState([]);
const [kudos, setKudos] = useState([]);

useEffect(() => {
  // Fetch members
  fetch('/api/community/members')
    .then(res => res.json())
    .then(data => setMembers(data.members));
  
  // Fetch kudos
  fetch('/api/community/kudos')
    .then(res => res.json())
    .then(data => setKudos(data.kudos));
}, []);

// Pass to CommunityPage
<CommunityPage 
  userId={currentUser.id} 
  currentUser={currentUser}
  members={members}
  kudos={kudos}
/>
```

### Passing Mock Data (for Development)

```jsx
// Temporary mock data while backend is being built
const mockMembers = [
  {
    id: 1,
    name: 'Sarah Johnson',
    avatar: '👩‍🦰',
    rank: 1,
    points: 2850,
    level: 'Elite',
    followersCount: 342,
    followingCount: 128,
    workoutDays: 156,
    joinDate: new Date('2022-01-15'),
    lastActivityAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    interests: ['strength', 'nutrition', 'challenges']
  },
  // ... more members
];

<CommunityPage 
  userId={1} 
  currentUser={currentUser}
  members={mockMembers}
  kudos={mockKudos}
/>
```

## Step 6: Hook Up Backend APIs

Update the components to use real backend data:

### Leaderboard Component
```jsx
// In Leaderboard.jsx - replace mock data fetching
useEffect(() => {
  const fetchLeaderboard = async () => {
    const response = await fetch(
      `/api/community/leaderboard?metric=${sortMetric}&timeRange=${timeRange}`
    );
    const data = await response.json();
    setLeaderboard(data.members);
  };
  
  fetchLeaderboard();
}, [sortMetric, timeRange]);
```

### Forum Component
```jsx
// In Forum.jsx - fetch posts from backend
useEffect(() => {
  const fetchPosts = async () => {
    const response = await fetch(
      `/api/forum/posts?category=${activeCategory}&sort=${sortBy}`
    );
    const data = await response.json();
    setPosts(data.posts);
  };
  
  fetchPosts();
}, [activeCategory, sortBy]);
```

### Handle Post Creation
```jsx
// In CreatePostModal.jsx - save new posts
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const response = await fetch('/api/forum/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: formData.title,
      content: formData.content,
      category: formData.category,
      tags: formData.tags,
      image: formData.image
    })
  });
  
  const newPost = await response.json();
  onSubmit(newPost);
};
```

### Handle Kudos
```jsx
// In Members.jsx - send kudos to backend
const handleSendKudos = async (memberId, kudosType, message) => {
  const response = await fetch('/api/social/kudos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipientId: memberId,
      type: kudosType,
      message: message
    })
  });
  
  const kudosData = await response.json();
  console.log('Kudos sent:', kudosData);
};
```

## Step 7: Add to Member Dashboard Layout

### Option: Tabs in Main Dashboard
```jsx
// In your member dashboard component
const [activeTab, setActiveTab] = useState('home'); // 'home', 'nutrition', 'workout', 'challenges', 'community'

return (
  <div>
    {/* Tab Navigation */}
    <Tabs activeTab={activeTab} onChange={setActiveTab}>
      <Tab id="home" label="Dashboard" />
      <Tab id="nutrition" label="Nutrition" />
      <Tab id="workout" label="Workouts" />
      <Tab id="challenges" label="Challenges" />
      <Tab id="community" label="Community" />
    </Tabs>
    
    {/* Tab Content */}
    {activeTab === 'community' && (
      <CommunityPage userId={currentUser.id} currentUser={currentUser} />
    )}
  </div>
);
```

### Option: Separate Page
```jsx
// Create a separate page for community
// src/pages/member/CommunityPage.jsx

import { CommunityPage } from '@/pages/member/community';

export function CommunityPageWrapper() {
  const { user } = useAuth(); // Get current user from auth context
  
  return (
    <CommunityPage 
      userId={user.id} 
      currentUser={user}
    />
  );
}

// In router
<Route path="/community" element={<CommunityPageWrapper />} />
```

## Step 8: Add Translation Keys

Update your i18n configuration for all community labels:

```javascript
// src/i18n/en.json
{
  "community": {
    "title": "Community Hub",
    "subtitle": "Connect, compete, and grow with your gym community",
    "leaderboard": "Leaderboard",
    "forum": "Forum",
    "members": "Members",
    "createPost": "Create Post",
    "addComment": "Add a comment",
    "enterComment": "Share your thoughts...",
    "postComment": "Post Comment",
    "beFirstToPost": "Be the first to start a discussion!",
    "publishPost": "Publish Post",
    "noPosts": "No posts yet"
  },
  "forum": {
    "title": "Community Forum",
    "general": "General",
    "nutrition": "Nutrition",
    "workouts": "Workouts",
    "progress": "Progress"
  },
  "members": {
    "title": "Community Members"
  },
  "leaderboard": {
    "points": "Points",
    "checkIns": "Check-ins",
    "classes": "Classes",
    "challenges": "Challenges Won"
  },
  "common": {
    "rank": "Rank",
    "level": "Level",
    "category": "Category",
    "sortBy": "Sort By",
    "recent": "Recent",
    "popular": "Popular",
    "trending": "Trending",
    "thisWeek": "This Week",
    "thisMonth": "This Month",
    "allTime": "All Time",
    "searchMembers": "Search members...",
    "searchPosts": "Search posts...",
    "noResults": "No results found"
  }
}
```

## Step 9: Styling Customization

### Dark Mode
All components automatically support dark/light mode via `useTheme()`:

```jsx
const { isDark } = useTheme();

// Components use isDark for conditional styling
className={isDark ? 'bg-gray-800' : 'bg-white'}
```

### Tailwind Configuration
Ensure your `tailwind.config.js` includes:

```javascript
module.exports = {
  darkMode: 'class', // or 'media'
  theme: {
    extend: {
      colors: {
        // Ensure orange is available for accent color
        orange: {
          400: '#FF6B35',
          500: '#FF6B35',
          600: '#E55A2B'
        }
      }
    }
  }
};
```

## Step 10: Performance Optimization

### Lazy Loading
```jsx
import { lazy, Suspense } from 'react';

const CommunityPage = lazy(() => import('@/pages/member/community'));

<Suspense fallback={<LoadingSpinner />}>
  <CommunityPage userId={userId} currentUser={currentUser} />
</Suspense>
```

### Memoization
```jsx
import { useMemo } from 'react';

const filteredMembers = useMemo(() => {
  // Heavy filtering logic
  return members.filter(...);
}, [members, filters]);
```

### Code Splitting
```jsx
// webpack.config.js or vite.config.js
const CommunityPage = () => import('@/pages/member/community');

<Route 
  path="/community" 
  element={<CommunityPage />}
  lazy={() => import('@/pages/member/community').then(m => ({ Component: m.default }))}
/>
```

## Testing Integration

### Example Component Test
```jsx
import { render, screen } from '@testing-library/react';
import { CommunityPage } from '@/pages/member/community';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';

describe('CommunityPage', () => {
  it('renders community hub', () => {
    render(
      <ThemeProvider>
        <LanguageProvider>
          <CommunityPage userId={1} currentUser={{ id: 1, name: 'Test User' }} />
        </LanguageProvider>
      </ThemeProvider>
    );
    
    expect(screen.getByText(/Community Hub/i)).toBeInTheDocument();
  });
});
```

## Example: Full Integration

```jsx
// src/pages/member/MemberDashboard.jsx

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { CommunityPage } from '@/pages/member/community';
import { NutritionPage } from '@/pages/member/nutrition';
import { WorkoutLogPage } from '@/pages/member/workout';
import { ChallengesPage } from '@/pages/member/challenges';
import DashboardHome from './DashboardHome';

export default function MemberDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    members: [],
    kudos: [],
    posts: []
  });

  useEffect(() => {
    // Fetch community data
    Promise.all([
      fetch('/api/community/members').then(r => r.json()),
      fetch('/api/social/kudos').then(r => r.json()),
      fetch('/api/forum/posts').then(r => r.json())
    ])
      .then(([members, kudos, posts]) => {
        setData({ members: members.members, kudos: kudos.kudos, posts: posts.posts });
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to load community data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  const tabContent = {
    home: <DashboardHome user={user} />,
    nutrition: <NutritionPage userId={user.id} />,
    workout: <WorkoutLogPage userId={user.id} />,
    challenges: <ChallengesPage userId={user.id} />,
    community: (
      <CommunityPage 
        userId={user.id} 
        currentUser={user}
        members={data.members}
        kudos={data.kudos}
      />
    )
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 flex gap-4">
          {['home', 'nutrition', 'workout', 'challenges', 'community'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === tab 
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto py-8 px-4">
        {tabContent[activeTab]}
      </main>
    </div>
  );
}
```

## Troubleshooting Integration

### Issue: "useTheme is not a function"
**Solution**: Ensure ThemeProvider wraps your component tree:
```jsx
<ThemeProvider>
  <CommunityPage />
</ThemeProvider>
```

### Issue: Components not updating with new data
**Solution**: Make sure you're passing updated data as props:
```jsx
const [members, setMembers] = useState([]);

useEffect(() => {
  fetchMembers().then(setMembers);
}, []);

<CommunityPage members={members} />
```

### Issue: Styling looks broken
**Solution**: Verify Tailwind CSS is configured and imported:
```jsx
// In your main.jsx or index.js
import '@/styles/tailwind.css';
```

### Issue: Icons not showing
**Solution**: Install lucide-react if not already installed:
```bash
npm install lucide-react
```

## Summary

1. ✅ Import community component
2. ✅ Add route to router
3. ✅ Add navigation link
4. ✅ Provide theme/language context
5. ✅ Integrate with backend APIs
6. ✅ Add translation keys
7. ✅ Customize styling
8. ✅ Optimize performance
9. ✅ Test integration
10. ✅ Deploy!

The Community Module is now fully integrated into your CrunchFit Pro application! 🚀
