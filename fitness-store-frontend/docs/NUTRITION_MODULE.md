# CrunchFit Pro - Nutrition Module Documentation

## Overview

The Nutrition Module is a comprehensive macro tracking and meal planning system that exceeds basic dotFIT integration. It includes daily logging, AI-powered meal planning, a searchable food database, and detailed progress tracking.

## Features

### 1. Daily Log
Track daily food intake with meal categorization and automatic macro calculations.

**Features:**
- Date navigator to log past/future meals
- 4 meal sections: Breakfast, Lunch, Dinner, Snacks
- Real-time macro tracking with circular progress indicators
- Add foods from database with quantity selection
- View running totals for Calories, Protein, Carbs, Fat
- Delete individual food entries
- Meal section totals

**Key Components:**
- `DailyLog.jsx` - Main daily log interface
- `FoodSearchModal.jsx` - Food search and selection
- `CircularProgress.jsx` - Visual progress rings

### 2. Meal Planner
Plan weekly meals with drag-and-drop functionality and AI-powered suggestions.

**Features:**
- 7-day x 3-meal (breakfast, lunch, dinner) planning grid
- Drag-and-drop meal assignment from available meals sidebar
- Auto-calculate weekly macro totals
- "Generate AI Meal Plan" button for intelligent suggestions
- Reset plan button to clear all designations
- Weekly macro summary with goal tracking

**Key Components:**
- `MealPlanner.jsx` - Main meal planner interface
- Available meals sidebar with drag functionality
- Visual week grid with drop targets

### 3. Food Database
Search and manage a comprehensive food database powered by Open Food Facts API.

**Features:**
- Real-time food search across 1M+ items
- Display calories and macros per 100g
- Recently viewed foods quick access
- Favorite foods management (save/remove)
- Grid view with food images (when available)
- Detailed macro breakdown cards
- Quick add-to-favorites functionality

**Key Components:**
- `FoodDatabase.jsx` - Main database interface
- Open Food Facts API integration
- Favorites and recent foods management

### 4. Progress Tracking
Monitor nutrition progress with charts, trends, and weight tracking.

**Features:**
- 30-day calorie intake bar chart
- Average daily calorie and protein statistics
- Macro breakdown pie chart (40% protein, 45% carbs, 15% fat)
- Weight log with date tracking
- Weight change calculation
- Time range selector (7, 30, 90 days)
- Historical weight table with daily changes

**Key Components:**
- `NutritionProgress.jsx` - Progress dashboard
- Bar chart visualization
- Pie chart macro breakdown
- Weight log management

## Macro Calculation System

### TDEE Calculation
Uses the Mifflin-St Jeor equation to calculate Total Daily Energy Expenditure based on:
- Body weight (kg)
- Height (cm)
- Age (years)
- Gender
- Activity level multiplier

```javascript
import { calculateTDEE } from '@/utils/macroCalculator';

const tdee = calculateTDEE(75, 180, 25, 'male', 1.55);
```

### Macro Distribution
Automatically calculates macros based on:
- **Goal**: Cut (15% deficit) | Bulk (10% surplus) | Maintain (at TDEE)
- **Weight**: Used for protein calculation (2.2g/kg base)
- **Training Type**: Adjusts protein for strength, endurance, or mixed training

```javascript
import { calculateMacros } from '@/utils/macroCalculator';

const macros = calculateMacros(
  2200, // TDEE
  'cut', // Goal
  75,    // Weight (kg)
  'strength' // Training type
);
// Returns: { calories: 1870, protein: 180, carbs: 180, fat: 67 }
```

### Custom Override
Users can manually set macro goals in their profile/settings for personalized targets.

## API Integration

### Open Food Facts API
The Food Database uses the free Open Food Facts API (no API key required).

**Endpoint:** `https://world.openfoodfacts.org/cgi/search.pl`

**Features:**
- Search by product name, brand, or nutrients
- Returns 1M+ food items with complete nutritional data
- Includes product images
- Free tier with reasonable rate limits

**Example Request:**
```javascript
const response = await fetch(
  `https://world.openfoodfacts.org/cgi/search.pl?search_terms=chicken&json=1&pageSize=10`
);
const data = await response.json();
```

## Usage Examples

### 1. Log a meal
1. Navigate to Daily Log tab
2. Select a date using the date navigator
3. Click "Add Food" under desired meal section
4. Search for food or select from recent
5. Enter quantity (grams)
6. Confirm addition

### 2. Plan a week
1. Navigate to Meal Planner tab
2. Drag meals from sidebar to weekly grid
3. View weekly macro totals at top
4. (Optional) Click "Generate AI Plan" for suggestions
5. Adjust as needed

### 3. Search food database
1. Navigate to Food Database tab
2. Use search bar to find foods
3. View calorie and macro info per 100g
4. Add to favorites by clicking heart icon
5. View recently accessed foods

### 4. Track progress
1. Navigate to Progress tab
2. Select time range (7, 30, or 90 days)
3. View calorie intake trends
4. Check macro breakdown
5. Add weight entries and track changes

## Component Architecture

```
NutritionPage.jsx
├── DailyLog.jsx
│   ├── CircularProgress.jsx (x4)
│   └── FoodSearchModal.jsx
│       └── Open Food Facts API
├── MealPlanner.jsx
│   └── Drag-and-drop meal grid
├── FoodDatabase.jsx
│   ├── Food search cards
│   ├── Favorites management
│   └── Open Food Facts API
└── NutritionProgress.jsx
    ├── Bar chart (Calories)
    ├── Pie chart (Macros)
    └── Weight log table
```

## Styling & Theme Support

All components support:
- **Dark/Light Theme**: Uses `useTheme()` hook from context
- **Responsive Design**: Mobile, tablet, desktop layouts
- **Animations**: Framer Motion for smooth transitions
- **Accessibility**: Semantic HTML, ARIA labels

## Internationalization

All UI text supports multi-language via `useLanguage()` hook:
- Nutrition labels
- Button text
- Descriptions
- Error messages

## State Management

Currently uses React hooks with local state. For production:
- Consider Redux for global nutrition state
- Add API calls to persist data to backend
- Implement real user authentication

## Future Enhancements

1. **Barcode Scanning** - Quick food logging with camera
2. **Nutrition Analytics** - ML-powered insights and recommendations
3. **Restaurant Database** - Pre-calculated meal options
4. **Shopping List** - Generate from meal plans
5. **Recipe Builder** - Create custom meals with macros
6. **Sync with Fitness** - Adjust goals based on workout output
7. **Social Sharing** - Share meal plans with friends
8. **Export/Import** - Save and share meal plans

## Performance Considerations

- Food search is debounced (500ms) to reduce API calls
- Chart data is memoized to prevent unnecessary recalculations
- Image lazy loading for food database
- Virtual scrolling for large food lists (future)

## Testing

Example test scenarios:
1. Verify TDEE calculation accuracy
2. Test macro distribution for different goals
3. Validate food search API integration
4. Check drag-and-drop meal assignment
5. Verify progress chart calculations
6. Test empty states and error handling

## API Improvements vs dotFIT

✅ **Better Components:**
- More detailed macro visualization
- Interactive circular progress rings
- Drag-and-drop meal planning
- AI meal suggestions

✅ **Better User Experience:**
- Faster food search
- Favorites management
- Weight tracking with trends
- 30-day calorie charts

✅ **Better Data:**
- 1M+ food items from Open Food Facts
- Accurate macros per item
- Food images
- Recent foods quick access

✅ **Better Flexibility:**
- Multiple goal options (cut/bulk/maintain)
- Custom macro overrides
- Meal plan generation
- Weekly planning view
