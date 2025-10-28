import { useEffect, useState } from "react";
import type { MonthlyReportDTO } from "../../types";

interface UseMonthlyReportReturn {
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  reportData: MonthlyReportDTO | null;
  isLoading: boolean;
  error: string | null;
}

export function useMonthlyReport(): UseMonthlyReportReturn {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  const [reportData, setReportData] = useState<MonthlyReportDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMonthlyReport = async (month: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/reports/monthly/${month}`);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Brak autoryzacji. Zaloguj się ponownie.");
        } else if (response.status === 400) {
          throw new Error("Nieprawidłowy format miesiąca");
        } else {
          throw new Error("Wystąpił błąd podczas ładowania danych. Spróbuj ponownie.");
        }
      }

      const data: MonthlyReportDTO = await response.json();
      setReportData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Wystąpił błąd podczas ładowania danych";
      setError(errorMessage);
      console.error("Error fetching monthly report:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlyReport(selectedMonth);
  }, [selectedMonth]);

  const handleMonthChange = (month: string) => {
    // Walidacja formatu miesiąca (YYYY-MM)
    const monthRegex = /^\d{4}-\d{2}$/;
    if (!monthRegex.test(month)) {
      setError("Nieprawidłowy format miesiąca");
      return;
    }

    setSelectedMonth(month);
  };

  return {
    selectedMonth,
    setSelectedMonth: handleMonthChange,
    reportData,
    isLoading,
    error,
  };
}
