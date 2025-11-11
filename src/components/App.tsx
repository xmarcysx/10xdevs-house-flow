import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import AuthGuard from "./AuthGuard";
import Navbar from "./Navbar";

// Import page components
import Dashboard from "./Dashboard";
import { ExpensesPage } from "./expenses/ExpensesPage";
import { IncomesPage } from "./incomes/IncomesPage";
import { GoalsPage } from "./goals/GoalsPage";
import ReportsPage from "./reports/ReportsPage";
import { CategoriesPage } from "./categories/CategoriesPage";
import SettingsPage from "./settings/SettingsPage";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ResetPasswordForm from "./ResetPasswordForm";

const AuthLayout: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
          {title}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Lub{" "}
          <a
            href="/register"
            className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200"
          >
            utwórz nowe konto
          </a>
        </p>
      </div>
      <div className="transform hover:scale-105 transition-all duration-300">{children}</div>
    </div>
  </div>
);

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen">
    <Navbar />
    {children}
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public auth routes */}
        <Route
          path="/login"
          element={
            <AuthLayout title="Zaloguj się">
              <LoginForm />
            </AuthLayout>
          }
        />
        <Route
          path="/register"
          element={
            <AuthLayout title="Utwórz konto">
              <RegisterForm />
            </AuthLayout>
          }
        />
        <Route
          path="/reset-password"
          element={
            <AuthLayout title="Resetuj hasło">
              <ResetPasswordForm />
            </AuthLayout>
          }
        />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <AuthGuard>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </AuthGuard>
          }
        />
        <Route
          path="/expenses"
          element={
            <AuthGuard>
              <MainLayout>
                <ExpensesPage />
              </MainLayout>
            </AuthGuard>
          }
        />
        <Route
          path="/incomes"
          element={
            <AuthGuard>
              <MainLayout>
                <IncomesPage />
              </MainLayout>
            </AuthGuard>
          }
        />
        <Route
          path="/goals"
          element={
            <AuthGuard>
              <MainLayout>
                <GoalsPage />
              </MainLayout>
            </AuthGuard>
          }
        />
        <Route
          path="/reports"
          element={
            <AuthGuard>
              <MainLayout>
                <ReportsPage />
              </MainLayout>
            </AuthGuard>
          }
        />
        <Route
          path="/reports/goals"
          element={
            <AuthGuard>
              <MainLayout>
                <ReportsPage />
              </MainLayout>
            </AuthGuard>
          }
        />
        <Route
          path="/reports/monthly"
          element={
            <AuthGuard>
              <MainLayout>
                <ReportsPage />
              </MainLayout>
            </AuthGuard>
          }
        />
        <Route
          path="/categories"
          element={
            <AuthGuard>
              <MainLayout>
                <CategoriesPage />
              </MainLayout>
            </AuthGuard>
          }
        />
        <Route
          path="/settings"
          element={
            <AuthGuard>
              <MainLayout>
                <SettingsPage />
              </MainLayout>
            </AuthGuard>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
