import React, { useState, useEffect } from "react";
import { useAuth } from "../lib/hooks/useAuth";
import { useAuthState } from "../lib/hooks/useAuthState";
import ThemeToggle from "./ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface NavItem {
  label: string;
  href: string;
}

const Navbar: React.FC = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("/");
  const { user, isLoading, isAuthenticated } = useAuthState();
  const { logout } = useAuth();

  // Przygotuj dane użytkownika dla wyświetlania
  const userEmail = user?.email || "";
  const userInitials = userEmail ? userEmail.charAt(0).toUpperCase() : "?";

  // Sprawdź aktualną ścieżkę
  useEffect(() => {
    const updatePath = () => setCurrentPath(window.location.pathname);
    updatePath();

    // Nasłuchuj zmian w historii przeglądarki
    window.addEventListener('popstate', updatePath);

    return () => window.removeEventListener('popstate', updatePath);
  }, []);

  const navItems: NavItem[] = [
    { label: "Dashboard", href: "/" },
    { label: "Wydatki", href: "/expenses" },
    { label: "Dochody", href: "/incomes" },
    { label: "Cele", href: "/goals" },
    { label: "Raporty", href: "/reports" },
    { label: "Kategorie", href: "/categories" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-lg backdrop-blur-sm bg-white/95 dark:bg-gray-900/95">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <img src="/src/assets/logo.png" alt="HouseFlow Logo" className="h-10 w-10 md:h-12 md:w-12 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full opacity-80"></div>
              </div>
              <span className="text-2xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                HouseFlow
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = currentPath === item.href;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                    isActive
                      ? "text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg hover:shadow-xl"
                      : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                  )}
                </a>
              );
            })}
          </div>

          {/* Theme Toggle & User Section */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {/* User Menu - tylko jeśli użytkownik jest zalogowany */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 p-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300 transform hover:scale-105"
                >
                  <Avatar className="w-9 h-9 ring-2 ring-blue-500/20">
                    <AvatarImage src={undefined} alt={userEmail} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-sm font-semibold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{userEmail}</div>
                  </div>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-all duration-300 ${isUserMenuOpen ? "rotate-180 text-blue-500" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <Card className="absolute right-0 mt-3 w-64 py-3 shadow-2xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl">
                    <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">{userEmail}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Zalogowany</div>
                    </div>
                    <div className="py-2">
                      <button className="block w-full text-left px-5 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 font-medium">
                        Ustawienia
                      </button>
                      <button
                        onClick={() => logout()}
                        className="block w-full text-left px-5 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 font-medium rounded-b-2xl"
                      >
                        Wyloguj się
                      </button>
                    </div>
                  </Card>
                )}
              </div>
            )}

            {/* Mobile menu button - będziemy mogli dodać później */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300 transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
