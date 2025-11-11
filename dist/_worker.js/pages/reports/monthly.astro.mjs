globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_ae_hJQlB.mjs';
import { j as jsxRuntimeExports, C as Card, a as CardHeader, b as CardTitle, c as CardContent } from '../../chunks/index_CKL9oF96.mjs';
import { a as reactExports } from '../../chunks/_@astro-renderers_JyCnA0Wd.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_JyCnA0Wd.mjs';
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell, f as createLucideIcon, L as Label, S as Select, g as SelectTrigger, h as SelectValue, i as SelectContent, j as SelectItem } from '../../chunks/select_BWIBpmhr.mjs';
import { L as LoadingComponent } from '../../chunks/LoadingComponent_DRdnDuY2.mjs';
import { $ as $$Layout } from '../../chunks/Layout_CW-7BzHS.mjs';

function useMonthlyReport() {
  const [selectedMonth, setSelectedMonth] = reactExports.useState(() => {
    const now = /* @__PURE__ */ new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [reportData, setReportData] = reactExports.useState(null);
  const [isLoading, setIsLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const fetchMonthlyReport = async (month) => {
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
      const data = await response.json();
      setReportData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Wystąpił błąd podczas ładowania danych";
      setError(errorMessage);
      console.error("Error fetching monthly report:", err);
    } finally {
      setIsLoading(false);
    }
  };
  reactExports.useEffect(() => {
    fetchMonthlyReport(selectedMonth);
  }, [selectedMonth]);
  const handleMonthChange = (month) => {
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
    error
  };
}

const CategorySummary = ({ categoryTotals }) => {
  if (!categoryTotals || categoryTotals.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-gradient-to-br from-white/90 via-white/80 to-white/70 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-800/70 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-white/20 dark:border-gray-700/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "px-6 py-6 border-b border-white/20 dark:border-gray-700/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg font-medium text-gray-900 dark:text-white", children: "Podsumowanie kategorii" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-6 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 text-gray-500 dark:text-gray-400", children: "Brak danych kategorii do wyświetlenia" }) })
    ] });
  }
  const formatAmount = (amount) => {
    return `${amount.toFixed(2)} PLN`;
  };
  const totalAmount = categoryTotals.reduce((sum, category) => sum + category.total, 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-gradient-to-br from-white/90 via-white/80 to-white/70 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-800/70 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-white/20 dark:border-gray-700/50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "px-6 py-6 border-b border-white/20 dark:border-gray-700/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg font-medium text-gray-900 dark:text-white", children: "Podsumowanie kategorii" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: [
        "Łączna suma wydatków: ",
        formatAmount(totalAmount)
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-6 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: categoryTotals.map((category, index) => {
      const percentage = totalAmount > 0 ? category.total / totalAmount * 100 : 0;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-gray-900 dark:text-white", children: category.category }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: [
              percentage.toFixed(1),
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "bg-blue-600 h-2 rounded-full",
              style: { width: `${Math.min(percentage, 100)}%` }
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-4 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-gray-900 dark:text-white", children: formatAmount(category.total) }) })
      ] }, `${category.category}-${index}`);
    }) }) })
  ] });
};

const ExpensesTable = ({ expenses }) => {
  if (!expenses || expenses.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-br from-white/90 via-white/80 to-white/70 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-800/70 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-white/20 dark:border-gray-700/50", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "mx-auto h-12 w-12 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "path",
        {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: 1,
          d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-2 text-sm font-medium text-gray-900 dark:text-white", children: "Brak wydatków" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-gray-500 dark:text-gray-400", children: "W wybranym miesiącu nie znaleziono żadnych wydatków." })
    ] }) });
  }
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };
  const formatAmount = (amount) => {
    return `${amount.toFixed(2)} PLN`;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-br from-white/90 via-white/80 to-white/70 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-800/70 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-white/20 dark:border-gray-700/50", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-6 border-b border-white/20 dark:border-gray-700/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-medium text-gray-900 dark:text-white", children: "Lista wydatków" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: [
        "Wszystkie wydatki z wybranego miesiąca (",
        expenses.length,
        " pozycji)"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Data" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Kwota" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider", children: "Kategoria" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { className: "bg-gradient-to-br from-white/90 via-white/80 to-white/70 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-800/70 divide-y divide-gray-200 dark:divide-gray-700", children: expenses.map((expense, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white", children: formatDate(expense.date) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium", children: formatAmount(expense.amount) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white", children: expense.category })
      ] }, `${expense.date}-${expense.amount}-${index}`)) })
    ] }) })
  ] });
};

/**
 * @license lucide-react v0.552.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode = [
  ["path", { d: "M12 15V3", key: "m9g1x1" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
];
const Download = createLucideIcon("download", __iconNode);

const ExportButton = ({ reportData, disabled = false }) => {
  const generateCSV = (data) => {
    const headers = ["Data", "Kwota", "Kategoria"];
    const rows = data.expenses.map((expense) => [
      expense.date,
      expense.amount.toString(),
      `"${expense.category}"`
      // Dodaj cudzysłowy dla kategorii zawierających przecinki
    ]);
    rows.push([]);
    rows.push(["Podsumowanie kategorii"]);
    rows.push(["Kategoria", "Suma"]);
    data.category_totals.forEach((category) => {
      rows.push([`"${category.category}"`, category.total.toString()]);
    });
    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    return csvContent;
  };
  const downloadCSV = (data) => {
    const csvContent = generateCSV(data);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== void 0) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `raport-miesieczny-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 7)}.csv`);
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
  disabled || !reportData || !reportData.expenses.length && !reportData.category_totals.length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      onClick: handleExport,
      className: "inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0 disabled:opacity-50 disabled:cursor-not-allowed",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 mr-2" }),
        "Eksportuj CSV"
      ]
    }
  );
};

const MonthSelector = ({ selectedMonth, onMonthChange }) => {
  const generateMonthOptions = () => {
    const options = [];
    const currentDate = /* @__PURE__ */ new Date();
    for (let i = 0; i < 24; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const value = date.toISOString().slice(0, 7);
      const label = date.toLocaleDateString("pl-PL", {
        year: "numeric",
        month: "long"
      });
      options.push({ value, label });
    }
    return options;
  };
  const monthOptions = generateMonthOptions();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-gradient-to-br from-white/90 via-white/80 to-white/70 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-800/70 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden border border-white/20 dark:border-gray-700/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "month-selector", className: "text-sm font-medium text-gray-700 dark:text-gray-300", children: "Wybierz miesiąc raportu" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: selectedMonth, onValueChange: onMonthChange, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SelectTrigger,
        {
          id: "month-selector",
          className: "w-full sm:w-64 bg-white/90 dark:bg-gray-800/90 border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 shadow-sm",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Wybierz miesiąc" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: monthOptions.map((option) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: option.value, children: option.label }, option.value)) })
    ] })
  ] }) }) });
};

const MonthlyReportLayout = ({ children }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-indigo-900 dark:to-purple-900", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full opacity-20 animate-pulse" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 animate-pulse animation-delay-1000" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-4", children: [
          "Raporty miesięczne House",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-600 dark:text-blue-400", children: "Flow" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto", children: "Szczegółowe analizy wydatków i dochodów z podziałem na miesiące." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-6xl mx-auto", children })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        .bg-clip-text {
          -webkit-background-clip: text;
          background-clip: text;
        }
        .text-transparent {
          -webkit-text-fill-color: transparent;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
      ` })
  ] });
};

const MonthlyReportPage = () => {
  const { selectedMonth, setSelectedMonth, reportData, isLoading, error } = useMonthlyReport();
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(MonthlyReportLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingComponent, { message: "Ładowanie raportu...", size: "md" }) });
  }
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(MonthlyReportLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "h-5 w-5 text-red-400", viewBox: "0 0 20 20", fill: "currentColor", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "path",
        {
          fillRule: "evenodd",
          d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",
          clipRule: "evenodd"
        }
      ) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-medium text-red-800 dark:text-red-200", children: "Wystąpił błąd podczas ładowania danych" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-sm text-red-700 dark:text-red-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: error }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => window.location.reload(),
            className: "bg-red-100 dark:bg-red-800 px-3 py-2 rounded-md text-sm font-medium text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-700",
            children: "Spróbuj ponownie"
          }
        ) })
      ] })
    ] }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MonthlyReportLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(MonthSelector, { selectedMonth, onMonthChange: setSelectedMonth }),
    reportData && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExportButton, { reportData }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExpensesTable, { expenses: reportData.expenses }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CategorySummary, { categoryTotals: reportData.category_totals }) })
      ] })
    ] }),
    !reportData && !isLoading && !error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "mx-auto h-12 w-12 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "path",
        {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: 1,
          d: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-2 text-sm font-medium text-gray-900 dark:text-white", children: "Brak danych" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-gray-500 dark:text-gray-400", children: "Nie udało się załadować danych raportu." })
    ] })
  ] }) });
};

const $$Monthly = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Raport miesi\u0119czny | HouseFlow" }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "Navbar", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/Admin/10xdevs-house-flow/src/components/Navbar", "client:component-export": "default" })}  ${renderComponent($$result2, "MonthlyReportPage", MonthlyReportPage, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Admin/10xdevs-house-flow/src/components/reports/monthly/MonthlyReportPage.tsx", "client:component-export": "default" })} ` })}`;
}, "C:/Users/Admin/10xdevs-house-flow/src/pages/reports/monthly.astro", void 0);

const $$file = "C:/Users/Admin/10xdevs-house-flow/src/pages/reports/monthly.astro";
const $$url = "/reports/monthly";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Monthly,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
