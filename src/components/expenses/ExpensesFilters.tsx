// Komponent filtrów dla widoku wydatków
import React from "react";
import type { CategoryDTO } from "../../types";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export interface ExpensesFiltersData {
  year?: number;
  month?: number; // 1-12
  category_id?: string;
}

interface ExpensesFiltersProps {
  filters: ExpensesFiltersData;
  categories: CategoryDTO[];
  onFiltersChange: (filters: ExpensesFiltersData) => void;
}

export const ExpensesFilters: React.FC<ExpensesFiltersProps> = ({ filters, categories, onFiltersChange }) => {
  // Opcje lat (2025-2030)
  const yearOptions = [
    { value: "2025", label: "2025" },
    { value: "2026", label: "2026" },
    { value: "2027", label: "2027" },
    { value: "2028", label: "2028" },
    { value: "2029", label: "2029" },
    { value: "2030", label: "2030" },
  ];

  // Opcje miesięcy (styczeń-grudzień)
  const monthOptions = [
    { value: "1", label: "Styczeń" },
    { value: "2", label: "Luty" },
    { value: "3", label: "Marzec" },
    { value: "4", label: "Kwiecień" },
    { value: "5", label: "Maj" },
    { value: "6", label: "Czerwiec" },
    { value: "7", label: "Lipiec" },
    { value: "8", label: "Sierpień" },
    { value: "9", label: "Wrzesień" },
    { value: "10", label: "Październik" },
    { value: "11", label: "Listopad" },
    { value: "12", label: "Grudzień" },
  ];

  const handleYearChange = (value: string) => {
    onFiltersChange({
      ...filters,
      year: value === "all" ? undefined : parseInt(value),
    });
  };

  const handleMonthChange = (value: string) => {
    onFiltersChange({
      ...filters,
      month: value === "all" ? undefined : parseInt(value),
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

  const hasActiveFilters = !!filters.year || !!filters.month || !!filters.category_id;

  return (
    <div className="bg-gradient-to-br from-white/90 via-white/80 to-white/70 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-800/70 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-white/20 dark:border-gray-700/50">
      <div className="px-6 py-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          {/* Filtr roku */}
          <div className="flex-1 min-w-0">
            <Label htmlFor="year-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filtruj po roku
            </Label>
            <Select value={filters.year?.toString() || "all"} onValueChange={handleYearChange}>
              <SelectTrigger
                id="year-filter"
                className="mt-1 bg-white/90 dark:bg-gray-800/90 border-2 border-gray-300 dark:border-gray-600 focus:border-red-500 dark:focus:border-red-400 shadow-sm w-full"
              >
                <SelectValue placeholder="Wszystkie lata" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie lata</SelectItem>
                {yearOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtr miesiąca */}
          <div className="flex-1 min-w-0">
            <Label htmlFor="month-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filtruj po miesiącu
            </Label>
            <Select value={filters.month?.toString() || "all"} onValueChange={handleMonthChange}>
              <SelectTrigger
                id="month-filter"
                className="mt-1 bg-white/90 dark:bg-gray-800/90 border-2 border-gray-300 dark:border-gray-600 focus:border-red-500 dark:focus:border-red-400 shadow-sm w-full"
              >
                <SelectValue placeholder="Wszystkie miesiące" />
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
              <SelectTrigger
                id="category-filter"
                className="mt-1 bg-white/90 dark:bg-gray-800/90 border-2 border-gray-300 dark:border-gray-600 focus:border-red-500 dark:focus:border-red-400 shadow-sm w-full"
              >
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
            {filters.year && (
              <>
                Rok: {filters.year}
                {(filters.month || filters.category_id) && "; "}
              </>
            )}
            {filters.month && (
              <>
                Miesiąc: {monthOptions.find((m) => parseInt(m.value) === filters.month)?.label || filters.month}
                {filters.category_id && "; "}
              </>
            )}
            {filters.category_id &&
              `Kategoria: ${categories.find((cat) => cat.id === filters.category_id)?.name || filters.category_id}`}
          </div>
        )}
      </div>
    </div>
  );
};
