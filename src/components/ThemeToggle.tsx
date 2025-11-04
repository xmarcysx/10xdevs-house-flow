import { Moon, Sun } from "lucide-react";
import React from "react";
import { useTheme } from "../lib/hooks/useTheme";
import { Switch } from "./ui/switch";

const ThemeToggle: React.FC = () => {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-300 transform hover:scale-105">
      <Sun className="h-4 w-4 text-yellow-500" />
      <Switch
        checked={resolvedTheme === "dark"}
        onCheckedChange={toggleTheme}
        aria-label="Przełącz motyw"
        className="border-2 border-gray-300 dark:border-gray-600"
      />
      <Moon className="h-4 w-4 text-blue-500" />
    </div>
  );
};

export default ThemeToggle;
