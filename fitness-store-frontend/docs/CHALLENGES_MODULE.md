# Fitness Challenges Module Documentation

## Overview

The Fitness Challenges module provides a gamified experience for gym members to compete in challenges, earn rewards, climb leaderboards, and unlock badges. It's designed to increase engagement and motivation through social competition and achievable goals.

## Features

### 1. Active Challenges (`ActiveChallenges.jsx`)
- **Challenge Cards**: Difficulty-colored cards with progress visualization
- **Real-time Progress**: Current value vs. target with percentage
- **Countdown Timer**: Days and hours remaining
- **Participant Count**: Number of members in challenge
- **Reward Points**: Challenge difficulty-based point allocation
- **Quick Leaderboard**: Top 3 participants preview
- **Join/Leave Toggle**: Easy participation management

**Difficulty Levels**:
```javascript
const CHALLENGE_DIFFICULTY = {
  EASY: { multiplier: 1, points: 10, badge: '🥉 Bronze' },
  MEDIUM: { multiplier: 1.5, points: 25, badge: '🥈 Silver' },
  HARD: { multiplier: 2, points: 50, badge: '🥇 Gold' },
  ELITE: { multiplier: 3, points: 100, badge: '💎 Diamond' }
};
```

### 2. Challenge Detail Modal (`ChallengeDetail.jsx`)
- **Full Leaderboard**: All participants ranked by progress
- **Personal Progress**: Your current standing (if joined)
- **Challenge Info**: Type, duration, muscle groups, requirements
- **Time Remaining**: Live countdown
- **Action Buttons**: Join/Leave challenge
- **Participant Stats**: Total members and points available

**Shows**:
- Full leaderboard with real-time rankings
- Progress bars for each participant
- Completion percentage
- Your rank and progress (if joined)

### 3. Completed Challenges (`CompletedChallenges.jsx`)
- **Badge Gallery**: Visual display of completed challenge badges
- **Summary Stats**: Total completed, total points earned, average time
- **Challenge History**: Chronological list with rewards
- **Earned Badges**: Badge visualization with completion date
- **Points Summary**: Total points from all completed challenges

**Displays**:
- Completion date
- Time to complete challenge
- Points earned
- Difficulty level
- Badge earned

### 4. Main Hub (`ChallengesPage.jsx`)
- **User Statistics**: Points, rank, challenges won
- **Tab Navigation**: Active vs. Completed challenges
- **Challenge Selection**: Click to view details and leaderboard
- **Join/Leave Management**: Simple button controls

## Challenge Types

```javascript
const CHALLENGE_TYPES = {
  TONNAGE: 'tonnage',          // Accumulate total weight moved
  REPS: 'reps',                // Complete total reps
  SESSIONS: 'sessions',        // Log X workouts
  DISTANCE: 'distance',        // Cardio distance
  DURATION: 'duration',        // Total training time
  WEIGHT_LOSS: 'weight_loss',  // Weight loss goal
  STRENGTH: 'strength',        // Max lift achievement
  STREAK: 'streak'             // Consecutive training days
};
```

## Utility Functions (`challengeCalculator.js`)

### Progress & Completion
```javascript
calculateChallengeProgress(currentValue, targetValue)
  // Returns: 0-100 percentage

isChallengeCompleted(currentValue, targetValue)
  // Returns: boolean

getChallengeTimeRemaining(endDate)
  // Returns: { days, hours, minutes, isExpired }
```

### Leaderboard & Rankings
```javascript
generateLeaderboard(participants, metric='progress')
  // Sorts by progress, returns array with ranks

generateSeasonLeaderboard(challenges)
  // Cumulative leaderboard across multiple challenges

getChallengeBadge(difficulty)
  // Returns: emoji badge for difficulty level
```

### Rewards & Points
```javascript
calculateRewardPoints(challenge, completionTime)
  // Base points × difficulty × completion time bonus
  // Early completion = 1.5x-2x multiplier

formatReward(points, badge)
  // Returns: formatted reward display object
```

### Recommendations
```javascript
getRecommendedChallenges(userProfile, allChallenges)
  // Returns: challenges sorted by match score

calculateChallengeMatch(userProfile, challenge)
  // Returns: 0-1 match score based on preferences

suggestNextChallenge(completedChallenges, userStats)
  // Returns: suggestion with difficulty progression
```

### Achievement Tracking
```javascript
checkAchievements(userStats)
  // Returns: array of achievement IDs and titles

calculateChallengeStreak(completedChallenges)
  // Returns: number of consecutive completed challenges
```

## Data Structures

### Challenge Object
```javascript
{
  id: 1,
  name: 'Bench Press Master',
  description: 'Increase your bench press max by 25 lbs',
  type: 'strength',                    // See CHALLENGE_TYPES
  difficulty: 'HARD',                  // EASY, MEDIUM, HARD, ELITE
  muscleGroup: ['chest'],              // Targeted muscle groups
  targetValue: 100,                    // Target number
  currentValue: 85,                    // User's current progress
  startDate: '2024-02-01',
  endDate: '2024-03-01',
  participants: [                      // Leaderboard data
    { userId: 1, username: 'You', currentValue: 85, targetValue: 100, rank: 1 }
  ],
  rewards: 50,                         // Points available
  badge: '🥇 Bench King'              // Visual badge
}
```

### Participant Object
```javascript
{
  userId: 1,
  username: 'John',
  currentValue: 350,        // Current progress
  targetValue: 405,         // Goal value
  progress: 86,             // Calculated percentage
  rank: 2                   // Calculated rank
}
```

### Completed Challenge Object
```javascript
{
  id: 101,
  name: 'Deadlift Confidence',
  difficulty: 'MEDIUM',
  completedDate: '2024-02-20',
  badge: '🥈 Deadlift Pro',
  pointsEarned: 25,
  timeToComplete: 18        // Days
}
```

### User Challenge Status
```javascript
{
  id: 1,
  joined: true,
  currentValue: 85          // User's progress
}
```

## Leaderboard Algorithm

```javascript
generateLeaderboard(participants) {
  1. Map participants to include calculated progress %
  2. Sort by progress (descending)
  3. Assign rank (1, 2, 3, ...)
  4. Return sorted array
}

// Participants auto-rank by:
// 1. Progress percentage (primary)
// 2. Value achieved (tiebreaker)
```

## Reward System

### Point Calculation
```javascript
Points = Base Points × Difficulty Multiplier × Time Multiplier

Base Points:
  - EASY: 10 points
  - MEDIUM: 25 points
  - HARD: 50 points
  - ELITE: 100 points

Time Multiplier:
  - 50%+ time remaining: 1.5x
  - 75%+ time remaining: 2.0x
  - Complete on time: 1.0x
```

### Badge Allocation
- One badge per completed challenge
- Badge displayed in history and profile
- All badges count toward total achievements
- Special badges for streaks and milestones

## Achievement Unlocking

```javascript
checkAchievements(userStats) {
  - Week Warrior: 7-day streak
  - Month Master: 30-day streak
  - Challenge Chaser: 5 challenges completed
  - Point Collector: 500+ points earned
  - PR King: 10+ personal records
}
```

## Data Flow

```
ChallengesPage (main hub)
  ├── User Stats Calculation
  │   ├── Total points from completedChallenges
  │   ├── Rank calculation vs. all gym members
  │   └── Challenge count
  ├── ActiveChallenges
  │   ├── generateLeaderboard() per challenge
  │   ├── calculateChallengeProgress()
  │   ├── getChallengeTimeRemaining()
  │   └── onSelectChallenge() → ChallengeDetail
  ├── ChallengeDetail (modal)
  │   ├── Full leaderboard display
  │   ├── Your progress (if joined)
  │   ├── onJoin() → Add to userChallenges
  │   └── onLeave() → Remove from userChallenges
  └── CompletedChallenges
      ├── Badge gallery
      ├── Summary statistics
      └── Achievement display
```

## API Integration (When Backend Ready)

**Getting Challenges**:
```javascript
GET /api/challenges/active
  Response: [{ id, name, type, difficulty, ... }, ...]

GET /api/challenges/completed
  Response: [{ id, name, completedDate, badge, ... }, ...]

GET /api/challenges/:id/leaderboard
  Response: [{ userId, username, currentValue, rank, ... }, ...]
```

**User Participation**:
```javascript
POST /api/challenges/:id/join
  Response: { success: true, joinedAt: date }

DELETE /api/challenges/:id/leave
  Response: { success: true }

PUT /api/challenges/:id/update-progress
  Payload: { currentValue: number }
  Response: { progress: percentage, rank: number }
```

**Completion Detection**:
```javascript
GET /api/challenges/:id/check-completion
  Response: { isCompleted: boolean, completionBonus: points }
```

**User Rankings**:
```javascript
GET /api/challenges/user/stats
  Response: {
    totalPoints: number,
    rank: number,
    completedChallenges: number,
    achievementBadges: []
  }

GET /api/challenges/leaderboard/season
  Response: [{ rank, userId, username, totalPoints, ... }, ...]
```

## Theming & Localization

### Dark Mode Support
- All components respond to `useTheme()` hook
- Gradient backgrounds with difficulty coloring
- Smooth color transitions on interactions

**Difficulty Colors**:
```javascript
EASY: bg-green-500/20 border-green-500/30
MEDIUM: bg-blue-500/20 border-blue-500/30
HARD: bg-orange-500/20 border-orange-500/30
ELITE: bg-purple-500/20 border-purple-500/30
```

### Multi-Language
- All labels using `useLanguage()` hook
- Translation keys: `t('challenges.title', 'Fitness Challenges')`
- Difficulty names use built-in constants

## Performance Optimization

1. **useMemo for Leaderboards**: No recalculation on re-render
2. **AnimatePresence**: Smooth modal transitions
3. **Lazy Rendering**: Only selected challenge detail shown
4. **Sorted Arrays**: Pre-sorted leaderboard data

## Testing Guidance

### Unit Tests
-  `calculateChallengeProgress()` with 0/50/100 percent
- `getChallengeTimeRemaining()` with expired dates
- `calculateRewardPoints()` with different difficulties
- Leaderboard ranking with tied scores

### Component Tests
- ActiveChallenges: Rendering cards, filtering by difficulty
- ChallengeDetail: Leaderboard sorting, join/leave buttons
- CompletedChallenges: Badge display, stats calculation
- ChallengesPage: Tab switching, modal open/close

### Integration Tests
- Flow: Select challenge → Modal opens → Join → Appears in Active
- Flow: Complete challenge → Appears in Completed → Badge displayed
- Points calculation: Complete multiple challenges → Verify total points
- Leaderboard: Update progress → Rank changes accordingly

## Achievement Tracking Examples

### Week Warrior Challenge
```javascript
{
  type: 'sessions',
  difficulty: 'EASY',
  targetValue: 7,    // 7 workouts
  timeLimit: 7,      // days
  badge: '⚡ Week Warrior'
}
```

### Strength Beast Challenge
```javascript
{
  type: 'strength',
  difficulty: 'ELITE',
  targetValue: 500,  // 500 lb deadlift
  timeLimit: 60,     // days
  badge: '💪 Strength Beast'
}
```

### Cardio Warrior Challenge
```javascript
{
  type: 'distance',
  difficulty: 'HARD',
  targetValue: 50,   // 50 miles
  timeLimit: 30,     // days
  badge: '🏃 Cardio Master'
}
```

## Future Enhancements

1. **Social Sharing**: Share progress on gym's social feed
2. **Challenge Templates**: Pre-made challenges by trainers
3. **Seasonal Competitions**: Month-long/year-long competitions
4. **Team Challenges**: Small team competitions
5. **Progressive Difficulty**: Auto-adjust targets based on history
6. **Streak Bonuses**: Extra points for consecutive challenge wins
7. **Duo Challenges**: Partner-based challenges
8. **Live Notifications**: Real-time leaderboard updates
9. **Challenge Replay**: Previous challenges available to retry
10. **Custom Challenges**: Trainers create custom challenges

## Troubleshooting

**Issue**: Leaderboard not updating
- Check `generateLeaderboard()` is called on participant data
- Verify all participants have `currentValue` and `targetValue`

**Issue**: Progress bar not showing correct percentage
- Verify math: `(current / target) * 100`
- Check progress is capped at 100%

**Issue**: Points not calculating correctly
- Check difficulty multiplier: `BASE × DIFFICULTY × TIME_BONUS`
- Verify time remaining calculation uses current date

**Issue**: Badge not displaying after completion
- Verify `isChallengeCompleted()` returns true
- Check completed challenge object has `badge` property

## File Structure

```
src/pages/member/
  ├── ChallengesPage.jsx          (main hub)
  └── challenges/
      ├── ActiveChallenges.jsx
      ├── ChallengeDetail.jsx
      ├── CompletedChallenges.jsx
      └── index.js

src/utils/
  └── challengeCalculator.js      (calculations & rankings)
```

## Dependencies

- **React**: State management (useState, useContext)
- **Framer Motion**: Animations (motion, AnimatePresence)
- **Lucide React**: Icons
- **Tailwind CSS**: Styling
- **Context Hooks**: `useTheme()`, `useLanguage()`

## Size & Performance

- **Main Page**: ~280 lines
- **Sub-components**: ~280-350 lines each
- **Utilities**: ~320 lines
- **Bundle Impact**: ~35KB minified (gzipped shared)
- **Leaderboard Rendering**: O(n log n) for sorting

## Security Considerations

1. **Progress Updates**: Should be validated server-side
2. **Fraud Prevention**: Log all progress updates, verify authenticity
3. **Rank Manipulation**: Immutable historical records
4. **Data Privacy**: Hide other users' detailed metrics
5. **Admin Features**: Trainers can create/manage challenges

## Support

For integration questions or bugs:
1. Verify challenge data structure
2. Check leaderboard sorting logic
3. Test point calculation with known values
4. Ensure theme/language hooks available
5. Test with mock data before API integration
