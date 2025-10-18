# HouseFlow

## Project Description

HouseFlow is an MVP application designed to simplify household budget management. It enables users to record income and expenses, track expense categories, and monitor progress toward savings goals. The application focuses on simplicity and responsiveness, supporting mobile devices with full functionality. The main goal is to replace the tedious tracking of budgets in spreadsheets and notes, providing intuitive tools for quickly checking financial status.

The app solves the problem of users struggling to track household budgets using spreadsheets and notes, which is error-prone and time-consuming. It makes it easy to quickly determine the remaining amount after paychecks, the distribution of expenses by categories (e.g., home, pharmacy, cleaning supplies, pleasures, entertainment, clothing, food), and progress toward long-term savings goals (e.g., building a house).

## Tech Stack

### Frontend

- **Astro 5** - For creating fast, efficient websites and applications with minimal JavaScript
- **React 19** - Provides interactivity where needed
- **TypeScript 5** - For static typing and better IDE support
- **Tailwind 4** - For convenient application styling
- **Shadcn/ui** - Provides a library of accessible React components for UI foundation

### Backend

- **Supabase** - Comprehensive backend solution providing:
  - PostgreSQL database
  - SDKs in multiple languages serving as Backend-as-a-Service
  - Open source solution that can be hosted locally or on your own server
  - Built-in user authentication

### AI Integration

- **Openrouter.ai** - Access to a wide range of models (OpenAI, Anthropic, Google, and many others) to find solutions ensuring high efficiency and low costs, with financial limits on API keys

### CI/CD and Hosting

- **GitHub Actions** - For creating CI/CD pipelines
- **DigitalOcean** - For hosting the application via Docker image

## Getting Started Locally

### Prerequisites

- Node.js version 22.14.0 (use `.nvmrc` file for automatic version switching with nvm)
- npm or yarn package manager

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd house-flow
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:4321` (default Astro dev server port)

## Available Scripts

- `npm run dev` - Start the development server with hot reload
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run astro` - Run Astro CLI commands
- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Run ESLint and automatically fix fixable issues
- `npm run format` - Format code using Prettier

## Project Scope

### Core Features

- **Income Tracking**: Add, edit, and delete income entries with amount, date, and optional description
- **Expense Tracking**: Add, edit, and delete expenses with amount, date, category, and description
- **Expense Categories**: Predefined categories (home, pharmacy, cleaning supplies, pleasures, entertainment, clothing, food, other) plus custom user-defined categories
- **Expense Filtering**: View expense lists filtered by month or category
- **User Accounts**: Registration and login with email/password validation (8+ characters, uppercase/lowercase), optional password reset
- **Monthly Budget View**: Calculate remaining amount (income minus expenses), percentage breakdown of expenses by categories
- **Savings Goals**: Create goals with name and target amount, add contributions, view progress percentage and remaining amount, automatic achievement date prediction based on recent months' average, linear progress chart with simplified contribution history
- **Reporting Interface**: Monthly view with expense lists and category totals, goals view with linear progress bars
- **Mobile Responsiveness**: Full functionality with layout optimization for mobile devices
- **Security**: Standard security measures without additional encryption of sensitive data
- **Database Design**: Designed with future data export in mind (e.g., CSV)
- **User Activity Metrics**: Custom mechanisms for measuring activity (login timestamps) with opt-out options

### Project Boundaries

- No transaction import from files, CSV, bank reports, or URLs
- No receipt photos, OCR, or rich multimedia
- No shared budgets, family accounts, or user roles
- No bank integrations or automatic synchronization
- No advanced analytics (ML predictions, seasonality, push alerts)
- PLN currency only
- No motivational elements like notifications or gamification
- No additional confirmations for editing financial data

### Success Metrics

- ≥90% of active users add at least one income entry in the first week of use
- ≥80% of users record at least 5 expenses in the first month
- ≥60% of users create at least 1 savings goal
- Average of ≥1 weekly session per user in the first 4 weeks

## Project Status

This is an MVP (Minimum Viable Product) in early development phase. The core functionality for household budget management is implemented, with focus on simplicity and mobile responsiveness.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
