// Komponent filtrów dla widoku wydatków
import React from "react";
import type { CategoryDTO } from "../../types";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export interface ExpensesFiltersData {
  month?: string;
  category_id?: string;
}

interface ExpensesFiltersProps {
  filters: ExpensesFiltersData;
  categories: CategoryDTO[];
  onFiltersChange: (filters: ExpensesFiltersData) => void;
}

export const ExpensesFilters: React.FC<ExpensesFiltersProps> = ({ filters, categories, onFiltersChange }) => {
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
    onFiltersChange({
      ...filters,
      month: value === "all" ? undefined : value,
    });
  };

  const handleCategoryChange = (value: string) => {
    onFiltersChange({
      ...filters,
      category_id: value === "all" ? undefined : value,
    });
  };

  const handleClearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = !!filters.month || !!filters.category_id;

  return (
    <div className="bg-gradient-to-br from-white/90 via-white/80 to-white/70 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-800/70 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-white/20 dark:border-gray-700/50">
      <div className="px-6 py-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Filtry wydatków</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">Znajdź wydatki z wybranego okresu i kategorii</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          {/* Filtr miesiąca */}
          <div className="flex-1 min-w-0">
            <Label htmlFor="month-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filtruj po miesiącu
            </Label>
            <Select value={filters.month || "all"} onValueChange={handleMonthChange}>
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
            <Select value={filters.category_id || "all"} onValueChange={handleCategoryChange}>
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
            <Button
              onClick={handleClearFilters}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0 whitespace-nowrap"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Wyczyść filtry
            </Button>
          )}
        </div>

        {/* Informacja o aktywnych filtrach */}
        {hasActiveFilters && (
          <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Aktywne filtry:{" "}
            {filters.month &&
              `Miesiąc: ${new Date(filters.month + "-01").toLocaleDateString("pl-PL", { year: "numeric", month: "long" })}`}
            {filters.month && filters.category_id && "; "}
            {filters.category_id &&
              `Kategoria: ${categories.find((cat) => cat.id === filters.category_id)?.name || filters.category_id}`}
          </div>
        )}
      </div>
    </div>
  );
};
