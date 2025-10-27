import React, { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

const Navbar: React.FC = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Mock user data
  const user = {
    name: "Jan Kowalski",
    email: "jan.kowalski@example.com",
    avatar: null, // możemy później dodać URL do avatara
    initials: "JK",
  };

  const navItems: NavItem[] = [
    { label: "Dashboard", href: "/", active: true },
    { label: "Wydatki", href: "/expenses" },
    { label: "Dochody", href: "/incomes" },
    { label: "Cele", href: "/goals" },
    { label: "Raporty", href: "/reports" },
    { label: "Kategorie", href: "/categories" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">HouseFlow</span>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  item.active
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Theme Toggle & User Section */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {/* Mobile menu button - będziemy mogli dodać później */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.avatar || undefined} alt={user.name} />
                  <AvatarFallback className="bg-blue-600 text-white text-sm">{user.initials}</AvatarFallback>
                </Avatar>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                </div>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <Card className="absolute right-0 mt-2 w-56 py-2 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                  </div>
                  <div className="py-1">
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      Ustawienia
                    </button>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      Pomoc
                    </button>
                    <button className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      Wyloguj się
                    </button>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
