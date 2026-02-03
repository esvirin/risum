# User Navigation Flow

## 🏠 Dashboard (`/cabinet`)

**Features:**
- Welcome message with user's first name
- 4 stat cards showing membership status, weekly classes, available classes, balance
- Quick action buttons
- Preview of next 3 upcoming classes

**Quick Actions:**
1. **Book a Class** → `/cabinet/schedule`
2. **Browse Plans** → `/cabinet/plans` ⭐ NEW
3. **My Bookings** (Coming soon)
4. **Make Payment**

---

## 📅 Schedule Page (`/cabinet/schedule`)

**Mobile View:**
- Swipeable horizontal date picker
- Class cards with time badges
- One-tap booking
- Past classes grayed out

**Desktop View:**
- Full week calendar grid
- Time-based positioning (6 AM - 8 PM)
- Previous/Next week navigation
- "Today" quick jump button

**Booking Flow:**
1. User clicks "Book" button on a class
2. API call to `POST /api/classes/book`
3. Success → Toast notification + UI update
4. Failure → Error toast with reason

---

## 🎯 Plans Page (`/cabinet/plans`) ⭐ NEW

**Features:**
- Grouped by category (e.g., "Crossfit", "General")
- Plan cards showing:
  - Plan name and type (recurring, session pack, etc.)
  - Included features (class access, gym access, 24/7)
  - "Active" badge if already enrolled
  - Purchase button

**Purchase Flow:**
1. User clicks "Purchase Plan"
2. API call to `POST /api/enrollments/purchase`
3. Success → Refresh page showing "Active" badge
4. Failure → Error toast (may need payment info)

---

## 🔗 API Flow

### Booking a Class
```
User → Schedule UI → POST /api/classes/book 
    → createReservation(classId, customerId) 
    → PushPress API POST /reservations
    → Return reservation object
    → UI Update + Toast
```

### Viewing Plans
```
Server → GET /api/plans 
    → getPlans() 
    → PushPress API GET /plans
    → Display categorized plans
```

### Purchasing a Plan
```
User → Plans UI → POST /api/enrollments/purchase 
    → createEnrollment(customerId, planId) 
    → PushPress API POST /enrollments
    → Return enrollment object
    → Page Reload + Success Toast
```

---

## 📱 Mobile Navigation

```
┌─────────────────────────┐
│   Dashboard             │
│   [Stats] [Stats]       │
│   ┌─────────────────┐   │
│   │ Quick Actions   │   │
│   │ • Book Class    │───┐
│   │ • Browse Plans  │─┐ │
│   └─────────────────┘ │ │
└───────────────────────┘ │ │
                          │ │
    ┌─────────────────────┘ │
    │                       │
    ▼                       ▼
┌─────────────┐    ┌──────────────┐
│  Schedule   │    │    Plans     │
│  Swipe →    │    │  [Category]  │
│  ┌────────┐ │    │  ┌────────┐  │
│  │ Class  │ │    │  │ Plan 1 │  │
│  │ [Book] │ │    │  │[Active]│  │
│  └────────┘ │    │  ├────────┤  │
│  ┌────────┐ │    │  │ Plan 2 │  │
│  │ Class  │ │    │  │Purchase│  │
│  │ [Book] │ │    │  └────────┘  │
│  └────────┘ │    └──────────────┘
└─────────────┘
```

---

## 🖥️ Desktop Navigation

```
┌──────────────────────────────────────────────────────┐
│                    Dashboard                          │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                    │
│  │Stat1│ │Stat2│ │Stat3│ │Stat4│                    │
│  └─────┘ └─────┘ └─────┘ └─────┘                    │
│  ┌──────────────────────────────────────────┐        │
│  │ Quick Actions                            │        │
│  │ [Book Class] [Browse Plans] [Bookings]  │        │
│  └──────────────────────────────────────────┘        │
│  Next Classes: [Card] [Card] [Card]                  │
└──────────────────────────────────────────────────────┘
                     ↓           ↓
    ┌────────────────┴───────┐   └──────────────┐
    ▼                        ▼                   ▼
┌────────────────┐  ┌────────────────┐  ┌───────────────┐
│   Schedule     │  │     Plans      │  │   Bookings    │
│  Week View     │  │  Grid Layout   │  │ (Coming Soon) │
│  Mon Tue Wed   │  │  ┌──────────┐  │  │               │
│  ┌─┬─┬─┬─┐     │  │  │  Plan 1  │  │  │               │
│6 │ │C│ │ │     │  │  │ [Active] │  │  │               │
│7 │ │L│ │C│     │  │  ├──────────┤  │  │               │
│8 │ │A│ │L│     │  │  │  Plan 2  │  │  │               │
│9 │ │S│ │A│     │  │  │[Purchase]│  │  │               │
│  └─┴─┴S┴─┘     │  │  └──────────┘  │  │               │
└────────────────┘  └────────────────┘  └───────────────┘
```

---

## 🎨 Color Coding

- **Primary Color** - Main actions, active badges
- **Muted** - Past classes, disabled states
- **Success** - Booking confirmations
- **Destructive** - Cancellations, errors

---

## 🔔 User Feedback

### Toast Notifications
- ✅ "Class booked successfully!"
- ✅ "Plan purchased successfully!"
- ❌ "Booking failed: [reason]"
- ❌ "Purchase failed: [reason]"

### Visual Indicators
- **Loading States** - Spinners on buttons during API calls
- **Disabled States** - Grayed out past classes, active plans
- **Badges** - "Today", "Tomorrow", "Active" tags
- **Icons** - Calendar, Clock, Activity, User, etc.

---

## 🚀 Performance Optimizations

1. **Server-Side Rendering** - Initial page loads with data
2. **Client-Side Updates** - Fast booking interactions
3. **Optimistic UI** - Immediate visual feedback
4. **Error Boundaries** - Graceful error handling
5. **Responsive Images** - Lazy loading for profile pics

---

## 📈 Analytics Potential

Track these user actions:
- Dashboard visits
- Schedule page views
- Classes viewed
- Booking attempts (success/fail)
- Plans page visits
- Plan purchases
- Cancellations

All ready for implementation! 🎉
