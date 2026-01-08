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
- **Create and Edit** multiple goals with **name, target amount, and currency (INR/USD)**
  - Edit goal details via inline pencil icon
  - Update goal name, target amount, or currency
  - Allow currency changes even with existing contributions
- Display goals as cards with:
  - Original target amount
  - Converted target (live exchange rate)
  - Current saved amount
  - Progress bar with percentage
- **Add and Edit** contributions via modal with **title, amount, and date**
  - Edit contribution details from contributions table
  - Smart amount calculation (adjusts goal progress by difference)
  - Update title, amount, or date for any contribution
- View contributions history in scrollable table with:
  - Title with text truncation for long names
  - Date (sorted newest first)
  - Amount in goal currency
  - **Actions column** with edit and delete buttons
- **Delete** goals and contributions with confirmation modals
  - Delete entire goals (removes all contributions)
  - Delete individual contributions (adjusts saved amount)
  - Confirmation dialogs prevent accidental deletion
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
- **Modal reuse pattern**: Same modals for create and edit operations with prefilled data
- **Confirmation dialogs**: Danger/warning/info variants for destructive actions
- **Inline edit buttons**: Pencil icons appear next to goal titles for quick editing
- **Actions column**: Dedicated edit/delete buttons in contributions table with hover effects
- **Smart amount updates**: Editing contribution amounts calculates difference and adjusts goal progress
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
  - `useGoals` → Full CRUD operations (Create, Read, Update, Delete) + persistence
  - `useExchangeRate` → API + caching
  - `useDashboardStats` → derived state
- **Modal reuse strategy**: Single modal components serve both create and edit modes

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
│       ├── GoalCard.tsx        # Individual goal display with inline edit button
│       ├── AddGoalModal.tsx    # Modal for creating/editing goals (dual mode)
│       ├── AddContributionModal.tsx  # Modal for adding/editing contributions (dual mode)
│       └── ViewContributionsModal.tsx # Contributions table with actions column
│
├── hooks/                      # Custom React Hooks
│   ├── useExchangeRate.ts      # Fetch + cache exchange rates
│   ├── useGoals.ts             # Full CRUD operations for goals & contributions
│   └── useDashboardStats.ts    # Computed dashboard statistics
│
├── lib/
│   │
│   ├── api/                    # API Layer / Business Logic
│   │   ├── exchangeRate.ts     # Exchange rate API integration
│   │   └── goals.ts            # Goal & contribution CRUD operations
│   │                           # (create, read, update, delete functions)
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
│  │    - Full CRUD ops    │        │  • GoalCard (w/ edit)    │ │
│  │  • useExchangeRate()  │        │  • AddGoalModal          │ │
│  │  • useDashboardStats()│        │    (create/edit mode)    │ │
│  │                       │        │  • AddContributionModal  │ │
│  │                       │        │    (create/edit mode)    │ │
│  │                       │        │  • ViewContributionsModal│ │
│  │                       │        │    (w/ actions column)   │ │
│  └──────────┬────────────┘        │  • ConfirmationModal     │ │
│             │                     └──────────────────────────┘ │
│             ▼                                                   │
│  ┌───────────────────────┐        ┌──────────────────────────┐ │
│  │   API / Business      │        │   UI Primitives          │ │
│  │   Logic Layer         │        │                          │ │
│  │                       │        │  • Button                │ │
│  │  • goals.ts           │        │  • Input                 │ │
│  │    - Create goals     │        │  • Select                │ │
│  │    - Update goals     │        │  • Modal                 │ │
│  │    - Delete goals     │        │  • ProgressBar           │ │
│  │    - Add contribution │        │  • Card                  │ │
│  │    - Edit contribution│        └──────────────────────────┘ │
│  │    - Delete contrib   │                                      │
│  │                       │                                      │
│  │  • exchangeRate.ts    │                                      │
│  │    - API integration  │                                      │
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

### Example: Edit Contribution
```
User clicks edit icon in Actions column
         ↓
    ViewContributionsModal → onEditContribution handler
         ↓
    Parent (page.tsx) → Opens AddContributionModal with prefilled data
         ↓
    User modifies fields → Form Validation (validation.ts)
         ↓
    Form Submission → Custom Hook (useGoals.editContribution)
         ↓
    API Layer (goals.ts → updateContribution)
         ↓
    Calculate amount difference (newAmount - oldAmount)
         ↓
    Update contribution + adjust goal's currentAmount
         ↓
    Update State + localStorage (storage.ts)
         ↓
    Re-render Components with New Data
         ↓
    Dashboard Stats Recalculated (useDashboardStats)
         ↓
    UI Updates (GoalCard, DashboardHeader, ViewContributionsModal)
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
| `GoalCard` | Show goal details, progress, actions, edit button | Local modal states |
| `AddGoalModal` | Goal create/edit form (dual mode), validation | Form state, errors, edit mode |
| `AddContributionModal` | Contribution create/edit form (dual mode) | Form state, errors, edit mode |
| `ViewContributionsModal` | Contributions table with actions column | None (pure display) |

### Custom Hooks (hooks/)
**Purpose**: Encapsulate business logic and side effects

| Hook | Returns | Side Effects |
|------|---------|--------------|
| `useGoals` | goals[], Full CRUD functions (addGoal, editGoal, removeGoal, addGoalContribution, editContribution, removeContribution) | localStorage sync |
| `useExchangeRate` | rate, loading, error, refresh | API calls, caching |
| `useDashboardStats` | computed stats | Memoized calculations |

---

## Edit & Delete Implementation Details

### Modal Reuse Pattern
Both `AddGoalModal` and `AddContributionModal` support dual modes:
- **Create Mode**: Empty form, "Add" button text
- **Edit Mode**: Prefilled form, "Update" button text
- Mode detection: `const isEditMode = !!goal` or `!!contribution`

### Smart Amount Calculation
When editing contribution amounts:
```typescript
const amountDifference = newAmount - oldAmount;
goal.currentAmount = goal.currentAmount + amountDifference;
```
This ensures goal progress stays accurate without recalculating all contributions.

### Actions Column
The contributions table includes a dedicated Actions column (15% width) with:
- **Edit button**: Pencil icon → Opens prefilled edit modal
- **Delete button**: Trash icon → Shows confirmation dialog
- Hover effects: Blue (edit), Red (delete)

### State Management for Edits
The main page maintains separate state for:
- Edit goal modal (goalId)
- Edit contribution modal (goalId + contribution object)
- Delete contribution confirmation (goalId + contributionId + title)

---


