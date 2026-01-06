# 💰 Goal-Based Savings Planner

A modern, responsive web application for tracking financial goals and managing savings progress. Built with Next.js 15, TypeScript, and Tailwind CSS.

## 🌟 Features

- **Multiple Goal Tracking**: Create and manage multiple savings goals with different currencies (INR/USD)
- **Real-time Currency Conversion**: Automatic conversion between INR and USD using live exchange rates
- **Progress Visualization**: Beautiful progress bars and statistics dashboard
- **Contribution Management**: Add contributions with date tracking
- **Local Data Persistence**: Goals and contributions saved in browser localStorage
- **Exchange Rate Caching**: Efficient caching mechanism to minimize API calls
- **Responsive Design**: Fully responsive UI that works on all devices
- **Form Validation**: Comprehensive client-side validation with error messages
- **Loading States**: Smooth loading indicators for better UX

## 🚀 Live Demo

[View Live Demo](#) _(Deploy link will be added here)_

## 📸 Screenshots

![Dashboard View](./Screenshot%202026-01-07%20at%201.43.19%20AM.png)

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: React Hooks (Custom hooks for business logic)
- **Data Persistence**: Browser localStorage
- **API**: Exchange Rate API (https://exchangerate-api.com)

## 📋 Prerequisites

- Node.js 18+ and npm

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Arnavsao/Syfe-Assignment-Frontend-Intern.git
   cd "Syfe Assignment"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables (Optional)**
   ```bash
   cp .env.example .env
   ```

   Then edit `.env` and add your Exchange Rate API key:
   ```
   NEXT_PUBLIC_EXCHANGE_RATE_API_KEY=your_api_key_here
   ```

   > **Note**: The app will work without an API key using mock exchange rate data. Get a free API key from [exchangerate-api.com](https://www.exchangerate-api.com/) for live rates.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🏗️ Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with suppressHydrationWarning
│   ├── page.tsx            # Main page with all integrations
│   └── globals.css         # Global styles with Tailwind
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Modal.tsx
│   │   ├── ProgressBar.tsx
│   │   └── Card.tsx
│   ├── dashboard/          # Dashboard-specific components
│   │   └── DashboardHeader.tsx
│   └── goals/              # Goal-related components
│       ├── GoalCard.tsx
│       ├── AddGoalForm.tsx
│       └── AddContributionModal.tsx
├── hooks/                  # Custom React hooks
│   ├── useExchangeRate.ts
│   ├── useGoals.ts
│   └── useDashboardStats.ts
├── lib/
│   ├── api/               # API layer
│   │   ├── exchangeRate.ts
│   │   └── goals.ts
│   ├── utils/             # Utility functions
│   │   ├── format.ts      # Formatting utilities
│   │   ├── validation.ts  # Form validation
│   │   ├── currency.ts    # Currency conversion
│   │   └── storage.ts     # localStorage helpers
│   └── constants.ts       # App constants
├── types/
│   └── index.ts           # TypeScript type definitions
└── package.json
```

## 🎯 Key Design Decisions

### 1. **Architecture**
- **Component-based architecture**: Modular, reusable components following single responsibility principle
- **Custom hooks**: Business logic separated into custom hooks for better testability and reusability
- **Type safety**: Comprehensive TypeScript types for all data structures

### 2. **State Management**
- Used React's built-in hooks instead of external state management libraries
- Custom hooks (`useGoals`, `useExchangeRate`, `useDashboardStats`) encapsulate business logic
- localStorage for data persistence to avoid backend complexity

### 3. **Styling Approach**
- Tailwind CSS v4 for utility-first styling
- Custom gradient components matching the design reference
- Responsive design with mobile-first approach
- No component libraries (ChakraUI/MUI) as per requirements

### 4. **Data Flow**
- Unidirectional data flow from parent to child components
- Props drilling for component communication
- Event handlers passed down for user interactions

### 5. **Performance Optimizations**
- Exchange rate caching (1-hour cache duration)
- localStorage for instant data loading
- Memoized calculations in `useDashboardStats`
- Lazy modal rendering (only when open)

### 6. **Error Handling**
- Comprehensive form validation with user-friendly error messages
- Graceful API failure handling with fallback mock data
- Try-catch blocks for localStorage operations

## 🔑 Core Features Implementation

### Currency Conversion
- Fetches live USD to INR exchange rates
- Automatic conversion display on goal cards
- Converts all goals to a common currency for dashboard totals
- 1-hour cache to minimize API calls

### Goal Management
- Create goals with name, target amount, and currency
- Track multiple goals simultaneously
- Delete goals with confirmation
- Real-time progress calculation

### Contribution Tracking
- Add contributions with amount and date
- Date validation (cannot be in future)
- Visual feedback for goal completion
- Automatic progress updates

### Dashboard Statistics
- Total saved across all goals
- Total target in selected currency
- Overall progress percentage (average across all goals)
- Real-time updates as contributions are added

## 🧪 Form Validation

All forms include comprehensive validation:
- **Goal Name**: Required, 1-100 characters
- **Target Amount**: Required, > 0.01, < 999,999,999
- **Contribution Amount**: Required, > 0.01, < 999,999,999
- **Date**: Required, cannot be in the future

## 📱 Responsive Design

The app is fully responsive with breakpoints:
- **Mobile**: Single column layout
- **Tablet**: 2-column grid for goals
- **Desktop**: 3-column grid for goals

## 🔐 Data Persistence

Data is stored in browser's localStorage with keys:
- `syfe_goals`: All goals and contributions
- `syfe_exchange_rate`: Cached exchange rate
- `syfe_last_rate_fetch`: Timestamp of last rate fetch

## 🐛 Known Limitations

1. **Data Persistence**: Data is stored locally and will be lost if browser data is cleared
2. **Offline Mode**: Exchange rate fetching requires internet connection
3. **Multi-device Sync**: No cloud sync between devices

## 🚀 Future Enhancements

- Backend integration for data persistence
- User authentication and multi-user support
- Export goals to CSV/PDF
- Goal categories and tags
- Recurring contributions
- Charts and analytics
- Dark mode support
- Multiple currency display options

## 📝 Commit History

This project follows best practices with meaningful commit messages:
1. Initial Next.js setup with TypeScript and Tailwind CSS
2. Core architecture: types, utilities, API services, and hooks
3. UI components and full application integration

## 👨‍💻 Developer

**Arnav Sao**
- GitHub: [@Arnavsao](https://github.com/Arnavsao)

## 📄 License

ISC

---

Built with ❤️ as part of the Syfe Frontend Intern Assignment
