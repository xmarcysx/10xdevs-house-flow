// Komponent filtrów dla widoku wpływów
import React from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export interface IncomesFiltersData {
  month?: string;
}

interface IncomesFiltersProps {
  filters: IncomesFiltersData;
  onFiltersChange: (filters: IncomesFiltersData) => void;
}

export const IncomesFilters: React.FC<IncomesFiltersProps> = ({ filters, onFiltersChange }) => {
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

  const handleClearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = !!filters.month;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
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
          {filters.month &&
            `Miesiąc: ${new Date(filters.month + "-01").toLocaleDateString("pl-PL", { year: "numeric", month: "long" })}`}
        </div>
      )}
    </div>
  );
};
