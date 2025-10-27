// Komponent filtrów dla widoku wydatków
import React from "react";
import type { CategoryDTO } from "../../types";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface FilterControlsProps {
  categories: CategoryDTO[];
  currentMonth?: string;
  currentCategoryId?: string;
  onFilterChange: (month?: string, categoryId?: string) => void;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  categories,
  currentMonth,
  currentCategoryId,
  onFilterChange,
}) => {
  // Generuj opcje miesięcy - od bieżącego miesiąca wstecz przez ostatnie 24 miesiące
  const generateMonthOptions = () => {
    const options = [];
    const currentDate = new Date();

    for (let i = 0; i < 24; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const value = date.toISOString().slice(0, 7); // YYYY-MM format
      const label = date.toLocaleDateString("pl-PL", {
        year: "numeric",
        month: "long",
      });

      options.push({ value, label });
    }

    return options;
  };

  const monthOptions = generateMonthOptions();

  const handleMonthChange = (value: string) => {
    onFilterChange(value === "all" ? undefined : value, currentCategoryId);
  };

  const handleCategoryChange = (value: string) => {
    onFilterChange(currentMonth, value === "all" ? undefined : value);
  };

  const handleClearFilters = () => {
    onFilterChange(undefined, undefined);
  };

  const hasActiveFilters = !!currentMonth || !!currentCategoryId;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
        {/* Filtr miesiąca */}
        <div className="flex-1 min-w-0">
          <Label htmlFor="month-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filtruj po miesiącu
          </Label>
          <Select value={currentMonth || "all"} onValueChange={handleMonthChange}>
            <SelectTrigger id="month-filter" className="mt-1">
              <SelectValue placeholder="Wybierz miesiąc" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszystkie miesiące</SelectItem>
              {monthOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtr kategorii */}
        <div className="flex-1 min-w-0">
          <Label htmlFor="category-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filtruj po kategorii
          </Label>
          <Select value={currentCategoryId || "all"} onValueChange={handleCategoryChange}>
            <SelectTrigger id="category-filter" className="mt-1">
              <SelectValue placeholder="Wybierz kategorię" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Wszystkie kategorie</SelectItem>
              {Array.isArray(categories) &&
                categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Przycisk wyczyść filtry */}
        {hasActiveFilters && (
          <Button variant="outline" onClick={handleClearFilters} className="whitespace-nowrap">
            Wyczyść filtry
          </Button>
        )}
      </div>

      {/* Informacja o aktywnych filtrach */}
      {hasActiveFilters && (
        <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          Aktywne filtry:{" "}
          {currentMonth &&
            `Miesiąc: ${new Date(currentMonth + "-01").toLocaleDateString("pl-PL", { year: "numeric", month: "long" })}`}
          {currentMonth && currentCategoryId && "; "}
          {currentCategoryId &&
            `Kategoria: ${categories.find((cat) => cat.id === currentCategoryId)?.name || currentCategoryId}`}
        </div>
      )}
    </div>
  );
};
