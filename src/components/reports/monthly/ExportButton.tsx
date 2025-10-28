import { DownloadIcon } from "lucide-react";
import React from "react";
import type { MonthlyReportDTO } from "../../../types";
import { Button } from "../../ui/button";

interface ExportButtonProps {
  reportData: MonthlyReportDTO;
  disabled?: boolean;
}

export const ExportButton: React.FC<ExportButtonProps> = ({ reportData, disabled = false }) => {
  const generateCSV = (data: MonthlyReportDTO): string => {
    const headers = ["Data", "Kwota", "Kategoria"];
    const rows = data.expenses.map((expense) => [
      expense.date,
      expense.amount.toString(),
      `"${expense.category}"`, // Dodaj cudzysłowy dla kategorii zawierających przecinki
    ]);

    // Dodaj podsumowanie kategorii
    rows.push([]); // Pusta linia
    rows.push(["Podsumowanie kategorii"]);
    rows.push(["Kategoria", "Suma"]);

    data.category_totals.forEach((category) => {
      rows.push([`"${category.category}"`, category.total.toString()]);
    });

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");

    return csvContent;
  };

  const downloadCSV = (data: MonthlyReportDTO) => {
    const csvContent = generateCSV(data);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `raport-miesieczny-${new Date().toISOString().slice(0, 7)}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleExport = () => {
    if (reportData && !disabled) {
      downloadCSV(reportData);
    }
  };

  const isDisabled = disabled || !reportData || (!reportData.expenses.length && !reportData.category_totals.length);

  return (
    <Button onClick={handleExport} disabled={isDisabled} variant="outline" className="flex items-center gap-2">
      <DownloadIcon className="h-4 w-4" />
      Eksportuj CSV
    </Button>
  );
};
