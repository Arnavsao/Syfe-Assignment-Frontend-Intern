# Goal-Based Savings Planner
**Frontend Intern Take-Home Assignment (Syfe)**

A client-side savings planner that allows users to create multiple financial goals, track contributions, and visualize progress with live INR ↔ USD conversion.

Built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**, following production-style frontend practices.

---

## Live Demo
> https://syfe-assignment-frontend-intern.vercel.app/

## Repository
> https://github.com/Arnavsao/Syfe-Assignment-Frontend-Intern

---

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (no component libraries used)
- **State:** React hooks + custom hooks
- **Persistence:** `localStorage`
- **API:** exchangerate-api.com

---

## Features Implemented

### Core Requirements
- Create multiple goals with **name, target amount, and currency (INR/USD)**
- Display goals as cards with:
  - Original target amount
  - Converted target (live exchange rate)
  - Current saved amount
  - Progress bar with percentage
- Add contributions via modal with **title, amount, and date**
- View contributions history in scrollable table with:
  - Title with text truncation for long names
  - Date (sorted newest first)
  - Amount in goal currency
- Delete goals with confirmation modal
- Live INR ↔ USD exchange rate with:
  - Last updated timestamp
  - Manual refresh button
  - 1-hour caching to avoid rate limits
- Dashboard totals:
  - Total target across all goals
  - Total saved across all goals
  - Overall progress (total saved / total target)
  - Extra savings (when total saved > total target)
- Client-side validation, loading states, error handling
- Fully responsive layout (mobile, tablet, desktop)

### Enhanced UX Features
- **Smooth modal animations**: Spring-like scale + fade (350ms cubic-bezier)
- **Confirmation dialogs**: Danger/warning/info variants for destructive actions
- **Mobile optimizations**: Icon-only buttons, adaptive grid layouts
- **Goal completion alerts**: Shows when a contribution will complete a goal
- **Clickable contribution count**: Opens detailed contribution history
- **Real-time validation**: Field-level error messages
- **Loading indicators**: Skeleton loaders and spinners throughout

---

## Architecture & Design Decisions

### Component Structure
- UI split into **feature components** (Goals, Dashboard, Modals) and **reusable primitives**
- Business logic isolated in **custom hooks**:
  - `useGoals` → CRUD + persistence
  - `useExchangeRate` → API + caching
  - `useDashboardStats` → derived state

### State Management
- No external state libraries used
- React hooks chosen for:
  - Simplicity
  - Predictable data flow
  - Easier debugging for a client-only app
- Controlled components with props drilling

### Data Persistence
- Goals and contributions stored in `localStorage`
- Exchange rate cached with timestamp to handle API limits gracefully
- Safe get/set with error handling and type safety

### Performance
- Memoized dashboard calculations
- Lazy rendering of modals (only when open)
- Cached forex data (1-hour TTL)
- Optimized re-renders with minimal state updates

### Validation & UX
- Input validation for amounts, dates, and required fields
- Graceful handling of API failures with fallback behavior
- Responsive layouts for mobile, tablet, and desktop
- Accessible UI with semantic HTML and ARIA labels

---

## Project Structure

```
syfe-assignment/
│
├── app/
│   ├── layout.tsx              # Root layout with metadata
│   ├── page.tsx                # Main page - orchestrates all features
│   └── globals.css             # Global styles + Tailwind imports
│
├── components/
│   │
│   ├── ui/                     # Reusable UI Components
│   │   ├── Button.tsx          # Multi-variant button (primary, secondary, ghost, outline)
│   │   ├── Input.tsx           # Form input with label, error states, helper text
│   │   ├── Select.tsx          # Dropdown select with validation
│   │   ├── Modal.tsx           # Animated modal with spring effect (size variants)
│   │   ├── ProgressBar.tsx     # Visual progress indicator with percentage
│   │   ├── Card.tsx            # Shadowed container component
│   │   └── ConfirmationModal.tsx # Reusable confirmation dialog (danger/warning/info)
│   │
│   ├── dashboard/
│   │   └── DashboardHeader.tsx # Stats overview + exchange rate display
│   │
│   └── goals/                  # Goal Feature Components
│       ├── GoalCard.tsx        # Individual goal display with actions
│       ├── AddGoalModal.tsx    # Modal for creating new goals
│       ├── AddContributionModal.tsx  # Modal for adding contributions
│       └── ViewContributionsModal.tsx # Scrollable table of contributions
│
├── hooks/                      # Custom React Hooks
│   ├── useExchangeRate.ts      # Fetch + cache exchange rates
│   ├── useGoals.ts             # CRUD operations for goals
│   └── useDashboardStats.ts    # Computed dashboard statistics
│
├── lib/
│   │
│   ├── api/                    # API Layer / Business Logic
│   │   ├── exchangeRate.ts     # Exchange rate API integration
│   │   └── goals.ts            # Goal & contribution CRUD operations
│   │
│   ├── utils/                  # Utility Functions
│   │   ├── format.ts           # Currency & date formatting
│   │   ├── validation.ts       # Form validation rules & error messages
│   │   ├── currency.ts         # Currency conversion logic
│   │   └── storage.ts          # localStorage wrapper with error handling
│   │
│   └── constants.ts            # App-wide constants (validation limits, storage keys)
│
├── types/
│   └── index.ts                # TypeScript interfaces (Goal, Contribution, etc.)
│
└── package.json
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser (Client)                         │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    app/page.tsx (Main)                      │ │
│  │              Orchestrates all features & modals             │ │
│  └───────────┬─────────────────────────────────┬──────────────┘ │
│              │                                  │                 │
│              ▼                                  ▼                 │
│  ┌───────────────────────┐        ┌──────────────────────────┐ │
│  │   Custom Hooks Layer  │        │   Component Layer        │ │
│  │                       │        │                          │ │
│  │  • useGoals()         │◄───────┤  • DashboardHeader       │ │
│  │  • useExchangeRate()  │        │  • GoalCard              │ │
│  │  • useDashboardStats()│        │  • AddGoalModal          │ │
│  │                       │        │  • AddContributionModal  │ │
│  │                       │        │  • ViewContributionsModal│ │
│  └──────────┬────────────┘        │  • ConfirmationModal     │ │
│             │                     └──────────────────────────┘ │
│             ▼                                                   │
│  ┌───────────────────────┐        ┌──────────────────────────┐ │
│  │   API / Business      │        │   UI Primitives          │ │
│  │   Logic Layer         │        │                          │ │
│  │                       │        │  • Button                │ │
│  │  • goals.ts           │        │  • Input                 │ │
│  │    - CRUD operations  │        │  • Select                │ │
│  │    - Progress calc    │        │  • Modal                 │ │
│  │                       │        │  • ProgressBar           │ │
│  │  • exchangeRate.ts    │        │  • Card                  │ │
│  │    - API integration  │        └──────────────────────────┘ │
│  │    - Caching logic    │                                      │
│  └──────────┬────────────┘                                      │
│             │                                                    │
│             ▼                                                    │
│  ┌───────────────────────┐        ┌──────────────────────────┐ │
│  │   Utils & Helpers     │        │   Data Storage           │ │
│  │                       │        │                          │ │
│  │  • format.ts          │◄───────┤  localStorage            │ │
│  │  • validation.ts      │        │                          │ │
│  │  • currency.ts        │        │  Keys:                   │ │
│  │  • storage.ts         │        │  • syfe_goals            │ │
│  │  • constants.ts       │        │  • syfe_exchange_rate    │ │
│  └───────────────────────┘        └──────────────────────────┘ │
│             ▲                                                    │
│             │                                                    │
│             ▼                                                    │
│  ┌───────────────────────┐                                      │
│  │   External API        │                                      │
│  │   exchangerate-api    │                                      │
│  │   (USD → INR rates)   │                                      │
│  └───────────────────────┘                                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

```
User Action (e.g., "Add Contribution")
         ↓
    Component (AddContributionModal)
         ↓
    Form Submission → Validation (validation.ts)
         ↓
    Custom Hook (useGoals)
         ↓
    API Layer (goals.ts → addContribution)
         ↓
    Update State + localStorage (storage.ts)
         ↓
    Re-render Components with New Data
         ↓
    Dashboard Stats Recalculated (useDashboardStats)
         ↓
    UI Updates (GoalCard, DashboardHeader)
```

---

## Key Technical Highlights

### Modal Animation System
```typescript
// Spring-like animation with cubic-bezier
Scale: 0.7 → 1.0
Duration: 350ms
Easing: cubic-bezier(0.34, 1.56, 0.64, 1)
Exit: Smooth fade + scale down with cleanup
```

### Form Validation
```typescript
// Comprehensive validation rules
- Title: 1-100 characters, required
- Amount: > 0.01, < 999,999,999, required
- Date: Cannot be future, required
- Currency: Required selection
```

### Exchange Rate Caching
```typescript
// Smart caching strategy
Cache Duration: 1 hour
Storage: localStorage with timestamp
Fallback: Mock data on API failure
Display: User's last fetch time
```

---

## Data Models

```typescript
interface Goal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  currency: "INR" | "USD"
  contributions: Contribution[]
  createdAt: Date
  updatedAt: Date
}

interface Contribution {
  id: string
  title: string
  amount: number
  date: Date
  currency: "INR" | "USD"
}

interface DashboardStats {
  totalTarget: number
  totalSaved: number
  overallProgress: number
  totalGoals: number
  extraSavings: number
}

interface ExchangeRate {
  rate: number
  lastUpdated: Date
  from: "USD"
  to: "INR"
}
```

---

## Component Architecture Details

### UI Component Library (components/ui/)
**Purpose**: Reusable, presentational components with no business logic

| Component | Variants | Key Props | Use Case |
|-----------|----------|-----------|----------|
| `Button` | primary, secondary, outline, ghost | onClick, loading, disabled | All user actions |
| `Input` | text, number, date | value, onChange, error | Form inputs |
| `Select` | - | options, value, onChange | Dropdowns |
| `Modal` | sm, md, lg | isOpen, onClose, title | All dialogs |
| `ProgressBar` | - | percentage, color | Goal progress |
| `Card` | - | children | Content containers |
| `ConfirmationModal` | danger, warning, info | variant, onConfirm | Delete actions |

### Feature Components (components/goals/, components/dashboard/)
**Purpose**: Business logic + UI composition

| Component | Responsibilities | State Managed |
|-----------|-----------------|---------------|
| `DashboardHeader` | Display stats, exchange rate, refresh | Loading state |
| `GoalCard` | Show goal details, progress, actions | Local modal states |
| `AddGoalModal` | Goal creation form, validation | Form state, errors |
| `AddContributionModal` | Contribution form, completion preview | Form state, errors |
| `ViewContributionsModal` | Contributions table, sorting | None (pure display) |

### Custom Hooks (hooks/)
**Purpose**: Encapsulate business logic and side effects

| Hook | Returns | Side Effects |
|------|---------|--------------|
| `useGoals` | goals[], CRUD functions | localStorage sync |
| `useExchangeRate` | rate, loading, error, refresh | API calls, caching |
| `useDashboardStats` | computed stats | Memoized calculations |

---


