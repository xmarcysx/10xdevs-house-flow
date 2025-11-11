
            // MessageChannel polyfill for Cloudflare Workers
            if (typeof MessageChannel === 'undefined') {
              globalThis.MessageChannel = function() {
                return {
                  port1: { postMessage: function() {}, addEventListener: function() {}, removeEventListener: function() {}, close: function() {} },
                  port2: { postMessage: function() {}, addEventListener: function() {}, removeEventListener: function() {}, close: function() {} }
                };
              };
            }
          
import { e as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_G7LsiH47.mjs';
import { j as jsxRuntimeExports, C as Card, a as CardHeader, b as CardTitle, c as CardContent } from '../../chunks/index_4yhPCitK.mjs';
import { a as reactExports } from '../../chunks/_@astro-renderers_BVqCE940.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_BVqCE940.mjs';
import { B as Button } from '../../chunks/button_O2Qao3mA.mjs';
import { L as LoadingComponent } from '../../chunks/LoadingComponent_BTO0VYda.mjs';
import { $ as $$Layout } from '../../chunks/Layout_m61kTqBM.mjs';

function useGoalsReport() {
  const [isLoading, setIsLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [goals, setGoals] = reactExports.useState([]);
  const formatCurrency = (amount) => {
    return `${amount.toFixed(2)} PLN`;
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pl-PL", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };
  const transformGoalData = (goal) => ({
    ...goal,
    formatted_percentage: `${Math.round(goal.progress_percentage)}%`,
    formatted_remaining_amount: formatCurrency(goal.remaining_amount),
    formatted_predicted_date: goal.predicted_completion_date ? formatDate(goal.predicted_completion_date) : void 0
  });
  const fetchGoalsReport = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/reports/goals");
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Brak autoryzacji. Zaloguj się ponownie.");
        } else {
          throw new Error("Wystąpił błąd podczas ładowania danych. Spróbuj ponownie.");
        }
      }
      const data = await response.json();
      if (!data.goals || !Array.isArray(data.goals)) {
        throw new Error("Nieprawidłowa struktura danych odpowiedzi");
      }
      const transformedGoals = data.goals.map(transformGoalData);
      setGoals(transformedGoals);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Wystąpił błąd podczas ładowania danych";
      setError(errorMessage);
      console.error("Error fetching goals report:", err);
    } finally {
      setIsLoading(false);
    }
  };
  reactExports.useEffect(() => {
    fetchGoalsReport();
  }, []);
  return {
    isLoading,
    error,
    goals,
    refetch: fetchGoalsReport
  };
}

const ErrorState = ({ error, onRetry }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col items-center justify-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "mx-auto h-12 w-12 text-red-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "path",
      {
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 1,
        d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-2 text-sm font-medium text-gray-900 dark:text-white", children: "Wystąpił błąd" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-md", children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: onRetry, variant: "outline", children: "Spróbuj ponownie" }) })
  ] }) });
};

const ProgressBar = ({ progress, className = "" }) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 ${className}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out",
      style: { width: `${clampedProgress}%` }
    }
  ) });
};

const GoalCard = ({ goal }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg font-semibold text-gray-900 dark:text-white", children: goal.name }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Postęp" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-gray-900 dark:text-white", children: goal.formatted_percentage })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ProgressBar, { progress: parseFloat(goal.formatted_percentage) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Pozostało do celu" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-gray-900 dark:text-white", children: goal.formatted_remaining_amount })
      ] }),
      goal.formatted_predicted_date && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Przewidywane ukończenie" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-blue-600 dark:text-blue-400", children: goal.formatted_predicted_date })
      ] })
    ] })
  ] });
};

const GoalsReportLayout = ({ children }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-indigo-900 dark:to-purple-900", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full opacity-20 animate-pulse" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 animate-pulse animation-delay-1000" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-4", children: [
          "Raport celów House",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-600 dark:text-blue-400", children: "Flow" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto", children: "Przegląd postępów w realizacji wszystkich celów oszczędnościowych." })
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

const GoalsReportPage = () => {
  const { isLoading, error, goals, refetch } = useGoalsReport();
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(GoalsReportLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingComponent, { message: "Ładowanie raportu celów...", size: "md" }) });
  }
  if (error) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(GoalsReportLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorState, { error, onRetry: refetch }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(GoalsReportLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: goals.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: goals.map((goal) => /* @__PURE__ */ jsxRuntimeExports.jsx(GoalCard, { goal }, goal.id)) }) : (
    /* Brak celów */
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-12", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "mx-auto h-12 w-12 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "path",
        {
          strokeLinecap: "round",
          strokeLinejoin: "round",
          strokeWidth: 1,
          d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-2 text-sm font-medium text-gray-900 dark:text-white", children: "Brak celów" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-gray-500 dark:text-gray-400", children: "Nie masz jeszcze żadnych celów oszczędnościowych." })
    ] })
  ) }) });
};

const $$Goals = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Raport cel\xF3w | HouseFlow" }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "Navbar", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/Admin/10xdevs-house-flow/src/components/Navbar", "client:component-export": "default" })}  ${renderComponent($$result2, "GoalsReportPage", GoalsReportPage, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Admin/10xdevs-house-flow/src/components/reports/goals/GoalsReportPage.tsx", "client:component-export": "default" })} ` })}`;
}, "C:/Users/Admin/10xdevs-house-flow/src/pages/reports/goals.astro", void 0);

const $$file = "C:/Users/Admin/10xdevs-house-flow/src/pages/reports/goals.astro";
const $$url = "/reports/goals";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Goals,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
