import React from "react";
import { useMonthlyReport } from "../../../lib/hooks/useMonthlyReport";
import { CategorySummary } from "./CategorySummary";
import { ExpensesTable } from "./ExpensesTable";
import { ExportButton } from "./ExportButton";
import { MonthSelector } from "./MonthSelector";

const MonthlyReportPage: React.FC = () => {
  const { selectedMonth, setSelectedMonth, reportData, isLoading, error } = useMonthlyReport();

  // Stan ładowania
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Ładowanie raportu...</p>
          </div>
        </div>
      </div>
    );
  }

  // Stan błędu
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Wystąpił błąd podczas ładowania danych
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-red-100 dark:bg-red-800 px-3 py-2 rounded-md text-sm font-medium text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-700"
                  >
                    Spróbuj ponownie
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Nagłówek */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Raport miesięczny</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Szczegółowy przegląd wydatków za wybrany miesiąc</p>
        </div>

        {/* Selektor miesiąca */}
        <MonthSelector selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />

        {/* Dane raportu */}
        {reportData && (
          <>
            {/* Przycisk eksportu */}
            <div className="flex justify-end">
              <ExportButton reportData={reportData} />
            </div>

            {/* Tabela wydatków i podsumowanie kategorii */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Tabela wydatków - zajmuje 2 kolumny na dużych ekranach */}
              <div className="lg:col-span-2">
                <ExpensesTable expenses={reportData.expenses} />
              </div>

              {/* Podsumowanie kategorii - zajmuje 1 kolumnę */}
              <div className="lg:col-span-1">
                <CategorySummary categoryTotals={reportData.category_totals} />
              </div>
            </div>
          </>
        )}

        {/* Brak danych */}
        {!reportData && !isLoading && !error && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Brak danych</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Nie udało się załadować danych raportu.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyReportPage;
