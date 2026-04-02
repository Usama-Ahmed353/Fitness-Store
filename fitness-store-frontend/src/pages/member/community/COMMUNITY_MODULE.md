# Community Module Documentation

## Overview

The **Community Module** provides comprehensive social features for CrunchFit Pro members, enabling engagement, collaboration, and competition within the gym community. Users can compete on leaderboards, discuss fitness topics in forums, connect with other members, and send kudos/recognition to peers.

## Features

### 1. **Leaderboards**
Real-time ranking system with multiple metrics and time ranges.

#### Key Features:
- **Time Ranges**: This Week, This Month, All Time
- **Sort Metrics**:
  - Points (weighted scoring system)
  - Check-ins (gym attendance)
  - Classes Attended
  - Challenges Completed
- **Member Cards**: Rank, avatar, name, score, trend (↑↓→)
- **Trend Indicators**: Shows percentage change from previous period
- **Tier System**: Elite, Advanced, Intermediate, Beginner (by percentile)
- **Search & Filter**: Find specific members by name or level

#### Leaderboard Ranking Algorithm:
```javascript
Score Calculation:
- Check-in: 5 points each
- Class attended: 10 points each
- Challenge won: 25 points each
- Base points: 10 points daily
- Total: Weighted sum rounded to nearest integer
```

#### Rank Badges:
- 🥇 Gold (1st place)
- 🥈 Silver (2nd place)
- 🥉 Bronze (3rd place)
- ⭐ Star (4-10th place)

### 2. **Forum System**
Category-based discussion platform with engagement tracking.

#### Categories:
- **General**: Gym chat, announcements, general fitness
- **Nutrition**: Diet advice, meal prep, supplement discussions
- **Workouts**: Exercise techniques, programming, form checks
- **Progress Stories**: Transformations, achievements, milestones

#### Forum Features:
- **Post Creation**: Title, content, category, tags, optional image
- **Engagement Metrics**:
  - Likes (heart icon)
  - Comments (nested replies)
  - Views count
  - Share count
- **Sorting Options**:
  - Recent (newest first)
  - Popular (highest engagement)
  - Trending (recent + weighted engagement)
  - Most Commented
- **Search**: Full-text search across title, content, author
- **Moderation**: Report inappropriate content with reason

#### Post Engagement Score:
```javascript
engagementScore = (likes × 1) + (comments × 3) + (views × 0.1) + (shares × 5)
```

#### Trending Algorithm:
- Recent posts get boost (decays over 24 hours)
- Engagement score × recency multiplier (0 to 2x)

### 3. **Members Directory**
Explore and connect with other gym members.

#### Member Information:
- **Profile**: Avatar, name, join date, level
- **Stats**:
  - Kudos received
  - Followers count
  - Following count
  - Total workout days
  - Last activity timestamp
- **Interests/Tags**: User-defined fitness interests
- **Level Badge**: Shows member's achievement level

#### Member Level System:
```javascript
Level Progression:
- Beginner: 0-24 exp
- Active: 25-99 exp
- Intermediate: 100-249 exp
- Advanced: 250-499 exp
- Legend: 500-999 exp
- Elite: 1000+ exp

EXP Sources:
- Kudos received: 10 exp each
- Posts created: 5 exp each
- Followers gained: 2 exp each
- Workout days: 1 exp each
```

#### Filtering & Sorting:
- **Filter by Level**: Elite, Legend, Advanced, Intermediate, All
- **Sort by**:
  - Most Followers
  - Most Active (last activity)
  - Most Kudos
  - Recently Joined

### 4. **Kudos System**
Recognition and appreciation system for member achievements.

#### Kudos Types:
| Type | Emoji | Description | Use Case |
|------|-------|-------------|----------|
| First PR | 🏅 | Hit a new personal record | Strength achievements |
| Weight Loss Win | ⬇️ | Reached weight loss goal | Weight management goals |
| On Fire | 🔥 | Amazing workout streak | Consistency |
| Challenge Champion | 🎯 | Won a gym challenge | Competition wins |
| Helpful | 💡 | Posted helpful advice | Knowledge sharing |
| Motivator | ⭐ | Inspiring others daily | Leadership/inspiration |
| Gym Buddy | 👯 | Great workout partner | Team/partnership |
| Consistent | 📅 | 100-day streak | Long-term consistency |
| Personal Best | 🚀 | Achieved major milestone | Major achievements |
| Comeback King | 💪 | Returned after break | Resilience |

#### Kudos Features:
- **Optional Message**: Add personalized note with kudos
- **Anonymous Support**: Can send without notification spam
- **Kudos Feed**: See all kudos received in profile
- **Kudos Breakdown**: View kudos count by type
- **Notification**: Members notified of received kudos

### 5. **Follow System**
Build your social network within the gym.

#### Follow Features:
- **Follow/Unfollow**: Connect with gym members
- **Mutual Follows**: See who follows you back
- **Follower List**: In member profiles
- **Following List**: Users you're tracking
- **Feed Generation**: (future) See followers' achievements
- **Suggested Members**: Algorithm-based recommendations

#### Suggestion Algorithm:
- Mutual follow priority (10 points)
- Common interests (3 points each)
- Active members (newer activity = higher score)
- Popular members (follower count)
- Return top 5 non-following members

## File Structure

```
src/
├── pages/member/community/
│   ├── CommunityPage.jsx           # Main hub with tab navigation
│   ├── Leaderboard.jsx             # Leaderboard display & filters
│   ├── Forum.jsx                   # Forum post list
│   ├── ForumPostDetail.jsx         # Single post view with comments
│   ├── CreatePostModal.jsx         # New post creation form
│   ├── Members.jsx                 # Members directory
│   └── index.js                    # Component exports
│
└── utils/
    ├── leaderboardCalculator.js    # Ranking & scoring logic
    ├── forumCalculator.js          # Forum utilities
    └── socialCalculator.js         # Kudos & follow logic
```

## Component Details

### CommunityPage.jsx
**Main Hub Component** - Orchestrates all community features

**Props:**
- `userId` (number): Current user ID
- `currentUser` (object): Current user data

**State:**
- `activeTab` (string): Current tab (leaderboard, forum, members)
- `searchQuery` (string): Global search query

**Features:**
- Tab navigation (Leaderboard, Forum, Members)
- User stats display (rank, points, kudos, level, trend)
- Global search bar
- Responsive sticky header

**Example:**
```jsx
<CommunityPage userId={1} currentUser={userData} />
```

### Leaderboard.jsx
**Leaderboard Display Component**

**Props:**
- `members` (array): All members with stats
- `userId` (number): Current user ID
- `searchQuery` (string): Pre-filled search

**Features:**
- Time range selector (week/month/all-time)
- Metric sorting dropdown
- Member search
- Featured top 3 cards
- Full leaderboard table
- User position indicator
- Trend visualization

**Returns:**
```jsx
<Leaderboard 
  members={membersList} 
  userId={currentUserId}
  searchQuery={searchText}
/>
```

### Forum.jsx
**Forum Post List Component**

**Props:**
- `userId` (number): Current user ID
- `searchQuery` (string): Pre-filled search

**Features:**
- Category tabs for filtering
- Sort options (recent, popular, trending, most-commented)
- Post list with engagement metrics
- Search posts by title/author/tags
- Create post button
- Like/comment counts
- Time since posted
- Single post modal with comments

### ForumPostDetail.jsx
**Single Post View Component**

**Props:**
- `post` (object): Post data with comments
- `userId` (number): Current user ID
- `onClose` (function): Close modal callback
- `onLike` (function): Like post callback
- `isLiked` (boolean): User liked this post

**Features:**
- Full post content
- Author information
- Category and tags
- Comments thread
- Add comment form
- Like/share/view counts
- Comment likes
- Reply functionality

### CreatePostModal.jsx
**Post Creation Modal**

**Props:**
- `userId` (number): Current user ID
- `userName` (string): Current user name
- `onClose` (function): Close callback
- `onSubmit` (function): Submit callback with new post

**Features:**
- Title input (max 200 chars)
- Content textarea (min 10 chars)
- Category selector
- Tag input (comma-separated)
- Image upload (max 5MB)
- Form validation
- Community guidelines info
- Submission loading state

### Members.jsx
**Members Directory Component**

**Props:**
- `members` (array): All members
- `userId` (number): Current user ID
- `searchQuery` (string): Pre-filled search
- `allKudos` (array): All kudos data

**Features:**
- Member cards with stats
- Level-based filtering
- Sort options (followers, active, kudos, recent)
- Member search
- Follow/Unfollow buttons
- Send Kudos modal
- Member interests/tags
- Activity timeline
- Responsive grid layout

## Utilities

### leaderboardCalculator.js

#### Key Functions:

```javascript
// Calculate member score with weighted metrics
calculateMemberScore(memberData) 
→ { checkInScore, classScore, challengeScore, totalScore }

// Generate and rank leaderboard
generateLeaderboard(members, metric, timeRange) 
→ Array of ranked members

// Calculate trend vs previous period
calculateTrend(previous, current) 
→ { direction: 'up'|'down'|'neutral', percentage: number }

// Get rank badge emoji
getRankBadge(rank) → '🥇' | '🥈' | '🥉' | '⭐'

// Get rank color class
getRankColor(rank) → 'text-yellow-400' | 'text-gray-300' | ...

// Get metric information
getMetricInfo(metric) 
→ { label, unit, icon, color }

// Filter leaderboard by search
filterLeaderboard(leaderboard, searchQuery) 
→ Filtered member array

// Group members by tier
groupMembersByTier(leaderboard) 
→ { elite, advanced, intermediate, beginner }

// Calculate achievement level
getAchievementLevel(rank, totalMembers, score) 
→ 'legend' | 'elite' | ...

// Get leaderboard statistics
getLeaderboardStats(leaderboard, metric) 
→ { avg, median, highest, lowest }

// Calculate user's rank vs friends
getRelativeRank(memberId, leaderboard, friendIds) 
→ { rank, percentile, trend }

// Get top N members
getTopMembers(leaderboard, count) 
→ Top members array

// Calculate activity streak
calculateStreak(activities) 
→ { current, longest, isActive }
```

### forumCalculator.js

#### Key Functions:

```javascript
// Post engagement scoring
calculatePostEngagement(post) 
→ { score, likes, comments, views, shares }

// Sort posts by criteria
sortPosts(posts, sortBy) 
→ Sorted array

// Calculate trending score
calculateTrendingScore(post) 
→ Trending rank number

// Filter by category
filterPostsByCategory(posts, category) 
→ Filtered posts

// Search posts
searchPosts(posts, query) 
→ Search results

// Format post content (mentions, hashtags, URLs)
formatPostContent(content) 
→ HTML formatted string

// Extract tags/mentions
extractMetadata(content) 
→ { mentions, tags, urls }

// Check edit permissions
canEditPost(userId, post) 
→ Boolean

// Post statistics
getPostStats(posts) 
→ { totalPosts, engagement, categoryBreakdown, topContributors }

// Get related posts
getRelatedPosts(currentPost, allPosts, limit) 
→ Similar posts array

// Get trending tags
getTrendingTags(posts, limit) 
→ Top tags array

// Report content
reportPost(postId, reason, details) 
→ Report object

// Moderation statistics
getModerationStats(reports) 
→ { totalReports, byReason, byStatus, pendingCount }
```

### socialCalculator.js

#### Key Functions:

```javascript
// Send kudos to member
sendKudos(senderId, recipientId, kudosType, message) 
→ Kudos object

// Get member's kudos
getMemberKudos(memberId, allKudos) 
→ Array of kudos

// Kudos breakdown by type
getKudosBreakdown(memberId, allKudos) 
→ { type: count, ... }

// Total kudos count
getTotalKudos(memberId, allKudos) 
→ Number

// Follow member
followMember(userId, memberId, userFollowing) 
→ Updated following list

// Unfollow member
unfollowMember(memberId, userFollowing) 
→ Updated following list

// Check if following
isFollowing(memberId, userFollowing) 
→ Boolean

// Get mutual follows
getMutualFollows(userId, userFollowing, graph) 
→ Mutual list

// Suggest members to follow
getSuggestedMembers(userId, allMembers, userFollowing, graph) 
→ Top 5 suggestions

// Member profile stats
getMemberProfileStats(member, allKudos, allPosts) 
→ Comprehensive stats object

// Calculate member level
calculateMemberLevel(member, allKudos, allPosts) 
→ { level, exp, nextLevelExp, expToNext }

// Get community highlights
getCommunityHighlights(allMembers, allKudos, allPosts) 
→ { topEngaged, hottest, rising }

// Direct messaging
sendMessage(senderId, recipientId, content) 
→ Message object

// Get conversation
getConversation(userId, otherUserId, messages) 
→ Message thread

// Mark messages as read
markMessagesAsRead(userId, otherUserId, messages) 
→ Updated messages

// Unread count
getUnreadCount(userId, messages) 
→ Number

// Block/Unblock
blockMember(userId, blockedUserId, blockedList) 
→ Updated block list

isBlocked(userId, blockedList) 
→ Boolean
```

## Data Structures

### Member Object
```javascript
{
  id: number,
  name: string,
  avatar: string (emoji),
  rank: number,
  points: number,
  level: string, // 'Elite' | 'Legend' | 'Advanced' | 'Intermediate' | 'Active' | 'Beginner'
  followersCount: number,
  followingCount: number,
  workoutDays: number,
  joinDate: Date,
  lastActivityAt: Date,
  interests: string[]
}
```

### Post Object
```javascript
{
  id: number | string,
  title: string,
  content: string,
  category: string, // 'nutrition' | 'workouts' | 'progress' | 'general'
  authorId: number,
  author: {
    name: string,
    avatar: string,
    level: string
  },
  tags: string[],
  likes: number,
  comments: Comment[],
  createdAt: Date,
  views: number,
  shares: number,
  image?: string
}
```

### Comment Object
```javascript
{
  id: number,
  authorId: number,
  author: {
    name: string,
    avatar: string
  },
  content: string,
  createdAt: Date,
  likes: number
}
```

### Kudos Object
```javascript
{
  id: string,
  senderId: number,
  recipientId: number,
  type: string, // One of KUDOS_TYPES
  message: string,
  sentAt: Date,
  read: boolean
}
```

## Color System

### Level Colors:
- **Elite**: `text-yellow-400` (🥇)
- **Legend**: `text-purple-400`
- **Advanced**: `text-blue-400`
- **Intermediate**: `text-green-400`
- **Active**: `text-orange-400`
- **Beginner**: `text-gray-400`

### Category Colors:
- **General**: Gray
- **Nutrition**: Green
- **Workouts**: Blue
- **Progress**: Purple

## Integration Guide

### Basic Setup

```jsx
// In your router or main component
import { CommunityPage } from '@/pages/member/community';

// Add route
<Route path="/community" element={<CommunityPage userId={1} currentUser={userData} />} />
```

### Using Individual Components

```jsx
import {
  Leaderboard,
  Forum,
  Members,
  CommunityPage
} from '@/pages/member/community';

// Leaderboard only
<Leaderboard members={members} userId={1} />

// Forum only
<Forum userId={1} />

// Members only
<Members members={members} userId={1} allKudos={kudos} />
```

### Context Integration

All components use:
- `useTheme()` - Dark/light mode support
- `useLanguage()` - i18n/translation support

Ensure these contexts are provided in your app:

```jsx
<ThemeProvider>
  <LanguageProvider>
    <CommunityPage />
  </LanguageProvider>
</ThemeProvider>
```

## Backend API Integration

### Required Endpoints:

```
GET /api/community/leaderboard
  Params: metric, timeRange, page, limit, search
  Returns: { members, total, rank }

GET /api/community/members
  Params: level, sortBy, search, page, limit
  Returns: { members, total }

GET /api/community/members/:id
  Returns: { member, kudos, posts, followers, following }

GET /api/forum/posts
  Params: category, sortBy, search, page, limit
  Returns: { posts, total }

POST /api/forum/posts
  Body: { title, content, category, tags, image }
  Returns: { post }

GET /api/forum/posts/:id
  Returns: { post, comments }

POST /api/forum/posts/:id/comments
  Body: { content }
  Returns: { comment }

POST /api/social/kudos
  Body: { recipientId, type, message }
  Returns: { kudos }

POST /api/social/follow
  Body: { memberId }
  Returns: { success }

DELETE /api/social/follow/:memberId
  Returns: { success }
```

## Performance Considerations

1. **Leaderboard**: Cache generated leaderboards (update hourly)
2. **Forum**: Implement pagination (20 posts per page)
3. **Member Search**: Use indexed full-text search
4. **Trending Calculation**: Batch calculate daily/weekly
5. **Images**: Compress and optimize before upload

## Security

- Moderate forum content for spam/abuse
- Rate limit kudos (max 10/day per user)
- Validate all user input
- Implement anti-bot measures
- Track and log reported content

## Testing

```javascript
// Leaderboard ranking
const members = [...];
const leaderboard = generateLeaderboard(members, 'points', 'week');
assert(leaderboard[0].rank === 1);

// Trend calculation
const trend = calculateTrend(100, 120);
assert(trend.direction === 'up');
assert(trend.percentage === 20);

// Kudos system
const kudos = sendKudos(1, 2, 'first_pr', 'Amazing!');
assert(kudos.type === 'first_pr');

// Member level
const level = calculateMemberLevel(member,[], []);
assert(['Elite', 'Legend', 'Advanced', ...].includes(level.level));
```

## Future Enhancements

1. **Direct Messaging**: Private conversations between members
2. **Activity Feed**: Real-time social feed
3. **Challenge Leaderboards**: Time-specific competitions
4. **Profile Customization**: Custom bios, social links
5. **Achievement Badges**: Milestone-based badges
6. **Community Events**: Organized fitness events
7. **Workout Sharing**: Share routines with community
8. **Group Formation**: Create training groups
9. **Mentor System**: Connect experienced with beginners
10. **Community Moderation**: Community-elected moderators

## Troubleshooting

### Leaderboard Not Updating
- Check if member data is being updated correctly
- Verify date/time calculations for time ranges
- Clear component cache

### Forum Posts Not Showing
- Verify category filter is correct
- Check search query formatting
- Ensure posts have required fields

### Kudos Not Sending
- Validate recipient ID exists
- Check kudos type is valid
- Verify user isn't sending to self

### Performance Issues
- Implement pagination for large lists
- Reduce animation complexity
- Optimize image sizes
- Use React.memo for list items
