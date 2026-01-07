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

## Implemented Requirements
This implementation covers all core requirements mentioned in the assignment:

- Create multiple goals with **name, target amount, and currency (INR/USD)**
- Display goals as cards with:
  - Original target
  - Converted target (live exchange rate)
  - Current saved amount
  - Progress bar
- Add contributions via modal (amount + date)
- Live INR ↔ USD exchange rate with:
  - Last updated timestamp
  - Manual refresh
  - Caching to avoid rate limits
- Dashboard totals:
  - Total target
  - Total saved
  - Overall progress (average completion)
- Client-side validation, loading states, error handling
- Fully responsive layout

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

### Data Persistence
- Goals and contributions stored in `localStorage`
- Exchange rate cached with timestamp to handle API limits gracefully

### Performance
- Memoized dashboard calculations
- Lazy rendering of modals
- Cached forex data (1-hour TTL)

### Validation & UX
- Input validation for amounts, dates, and required fields
- Graceful handling of API failures with fallback behavior
- Responsive layouts for mobile, tablet, and desktop

---

## Project Structure (High-Level)
app/ → App router pages & layout
components/ → UI and feature components
hooks/ → Business logic & data handling
lib/ → API, utilities, storage helpers
types/ → TypeScript interfaces