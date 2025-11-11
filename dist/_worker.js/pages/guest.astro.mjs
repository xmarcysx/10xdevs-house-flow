
            // MessageChannel polyfill for Cloudflare Workers
            if (typeof MessageChannel === 'undefined') {
              globalThis.MessageChannel = function() {
                return {
                  port1: { postMessage: function() {}, addEventListener: function() {}, removeEventListener: function() {}, close: function() {} },
                  port2: { postMessage: function() {}, addEventListener: function() {}, removeEventListener: function() {}, close: function() {} }
                };
              };
            }
          
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_G7LsiH47.mjs';
import { j as jsxRuntimeExports, C as Card, a as CardHeader, b as CardTitle, c as CardContent, d as CardDescription } from '../chunks/index_4yhPCitK.mjs';
import { R as React2, a as reactExports } from '../chunks/_@astro-renderers_BVqCE940.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_BVqCE940.mjs';
import { B as Button } from '../chunks/button_O2Qao3mA.mjs';
import { $ as $$Layout } from '../chunks/Layout_m61kTqBM.mjs';
/* empty css                                 */

const PieChartComponent = React2.lazy(() => import('../chunks/PieChart_Cc6ENbbA.mjs'));
const CategoryPieChart = ({ data }) => {
  if (!data || data.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-0 bg-gradient-to-br from-white to-orange-50/50 dark:from-gray-800 dark:to-orange-900/20 h-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "w-8 h-8 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "path",
            {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: "2",
              d: "M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "path",
            {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: "2",
              d: "M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
            }
          )
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2", children: "Podział wydatków" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8 text-gray-500 dark:text-gray-400", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-8 h-8 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: "2",
            d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          }
        ) }) }),
        "Brak danych do wyświetlenia"
      ] }) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-0 bg-gradient-to-br from-white to-orange-50/50 dark:from-gray-800 dark:to-orange-900/20", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { className: "w-8 h-8 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: "2",
            d: "M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: "2",
            d: "M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
          }
        )
      ] }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2", children: "Podział wydatków" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        reactExports.Suspense,
        {
          fallback: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center py-12", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-10 w-10 border-4 border-purple-200 dark:border-purple-800" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-spin rounded-full h-10 w-10 border-4 border-transparent border-t-purple-600 dark:border-t-purple-400 absolute top-0" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400 mt-4", children: "Ładowanie wykresu..." })
          ] }),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PieChartComponent, { data }) })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 grid grid-cols-2 gap-2", children: data.slice(0, 6).map((category, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "w-3 h-3 rounded-full shadow-sm",
            style: {
              backgroundColor: `hsl(${index * 60}, 70%, 50%)`
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gray-600 dark:text-gray-400 truncate", children: category.category_name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-gray-900 dark:text-white font-medium ml-auto", children: [
          category.percentage,
          "%"
        ] })
      ] }, category.category_name)) })
    ] })
  ] });
};

const GoalItem = ({ goal }) => {
  const progressPercentage = goal.target_amount > 0 ? Math.min(goal.current_amount / goal.target_amount * 100, 100) : 0;
  const remainingAmount = goal.target_amount - goal.current_amount;
  const isCompleted = goal.current_amount >= goal.target_amount;
  const handleClick = () => {
    window.location.href = `/goals/${goal.id}`;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "p-5 bg-gradient-to-r from-white to-green-50/30 dark:from-gray-800 dark:to-green-900/10 border border-green-100 dark:border-green-800 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group",
      onClick: handleClick,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-gray-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-300 transition-colors", children: goal.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-gray-900 dark:text-white", children: [
              goal.current_amount.toFixed(2),
              " zł"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-gray-500 dark:text-gray-400 block", children: [
              "z ",
              goal.target_amount.toFixed(2),
              " zł"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `h-full rounded-full transition-all duration-500 ease-out ${isCompleted ? "bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg" : "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-md"}`,
              style: { width: `${progressPercentage}%` }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full animate-pulse" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-2 h-2 rounded-full ${isCompleted ? "bg-green-500 animate-pulse" : "bg-blue-500"}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-gray-600 dark:text-gray-400 font-medium", children: [
              progressPercentage.toFixed(1),
              "% ukończone"
            ] })
          ] }),
          remainingAmount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-orange-600 dark:text-orange-400 font-medium bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-lg", children: [
            "Pozostało: ",
            remainingAmount.toFixed(2),
            " zł"
          ] }),
          isCompleted && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-lg flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "path",
              {
                "fill-rule": "evenodd",
                d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
                "clip-rule": "evenodd"
              }
            ) }),
            "Ukończone!"
          ] })
        ] })
      ]
    }
  );
};
const GoalsSummary = ({ goals }) => {
  const topGoals = goals.slice(0, 3);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-0 bg-gradient-to-br from-white to-orange-50/50 dark:from-gray-800 dark:to-orange-900/20 h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-8 h-8 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "path",
        {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        }
      ) }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2", children: "Cele oszczędnościowe" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: topGoals.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8 text-gray-500 dark:text-gray-400", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-8 h-8 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "path",
        {
          "stroke-linecap": "round",
          "stroke-linejoin": "round",
          "stroke-width": "2",
          d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        }
      ) }) }),
      "Brak celów do wyświetlenia"
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: topGoals.map((goal) => /* @__PURE__ */ jsxRuntimeExports.jsx(GoalItem, { goal }, goal.id)) }) })
  ] });
};

const $$Guest = createComponent(($$result, $$props, $$slots) => {
  const mockBudgetData = {
    category_breakdown: [
      { category_name: "\u017Bywno\u015B\u0107", percentage: 35, amount: 2170.31 },
      { category_name: "Dom", percentage: 25, amount: 1550.13 },
      { category_name: "Rozrywka", percentage: 15, amount: 930.08 },
      { category_name: "Transport", percentage: 12, amount: 744.06 },
      { category_name: "Inne", percentage: 13, amount: 805.92 }
    ]
  };
  const mockGoalsData = [
    {
      id: "1",
      name: "Wakacje nad morzem",
      target_amount: 5e3,
      current_amount: 3200,
      created_at: "2024-01-01"
    },
    {
      id: "2",
      name: "Nowy telewizor",
      target_amount: 3e3,
      current_amount: 1800,
      created_at: "2024-02-01"
    },
    {
      id: "3",
      name: "Remont kuchni",
      target_amount: 15e3,
      current_amount: 4500,
      created_at: "2024-03-01"
    }
  ];
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "HouseFlow - Zarz\u0105dzanie domowym bud\u017Cetem", "data-astro-cid-s5i7oqae": true }, { "default": ($$result2) => renderTemplate`  ${maybeRenderHead()}<section class="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-indigo-900 dark:to-purple-900 py-24 overflow-hidden" data-astro-cid-s5i7oqae> <!-- Background decorations --> <div class="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent" data-astro-cid-s5i7oqae></div> <!-- Floating elements --> <div class="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full opacity-20 animate-pulse" data-astro-cid-s5i7oqae></div> <div class="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 animate-pulse animation-delay-1000" data-astro-cid-s5i7oqae></div> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" data-astro-cid-s5i7oqae> <div class="text-center" data-astro-cid-s5i7oqae> <!-- Logo and Title --> <div class="flex items-center justify-center gap-6 mb-8" data-astro-cid-s5i7oqae> <div class="relative" data-astro-cid-s5i7oqae> <img src="/src/assets/logo.png" alt="HouseFlow Logo" class="h-20 w-20 md:h-24 md:w-24 drop-shadow-lg" data-astro-cid-s5i7oqae> </div> <h1 class="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent" data-astro-cid-s5i7oqae>
House<span class="text-blue-600 dark:text-blue-400" data-astro-cid-s5i7oqae>Flow</span> </h1> </div> <!-- Subtitle --> <p class="text-xl md:text-3xl text-gray-700 dark:text-gray-300 mb-6 max-w-4xl mx-auto font-medium leading-relaxed" data-astro-cid-s5i7oqae>
Uprość zarządzanie swoim domowym budżetem. Śledź wpływy, wydatki i cele oszczędnościowe w jednym miejscu.
</p> <!-- Description --> <p class="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed" data-astro-cid-s5i7oqae>
Zastąp męczące arkusze kalkulacyjne i notatki intuicyjnym narzędziem, które pomoże Ci szybko sprawdzić stan
          finansów i monitorować postępy w osiąganiu celów.
</p> <!-- Enhanced Auth Buttons --> <div class="flex flex-col sm:flex-row gap-6 justify-center items-center" data-astro-cid-s5i7oqae> <a href="/register" class="group" data-astro-cid-s5i7oqae> ${renderComponent($$result2, "Button", Button, { "size": "lg", "className": "text-lg px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0", "data-astro-cid-s5i7oqae": true }, { "default": ($$result3) => renderTemplate`
Rozpocznij za darmo
` })} </a> <a href="/login" class="group" data-astro-cid-s5i7oqae> ${renderComponent($$result2, "Button", Button, { "variant": "outline", "size": "lg", "className": "text-lg px-10 py-4 border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 dark:border-gray-600 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:border-blue-400 font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm", "data-astro-cid-s5i7oqae": true }, { "default": ($$result3) => renderTemplate`
Zaloguj się
` })} </a> </div> <!-- Trust indicators --> <div class="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400" data-astro-cid-s5i7oqae> <div class="flex items-center gap-2" data-astro-cid-s5i7oqae> <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20" data-astro-cid-s5i7oqae> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" data-astro-cid-s5i7oqae></path> </svg> <span data-astro-cid-s5i7oqae>Bezpłatne konto</span> </div> <div class="flex items-center gap-2" data-astro-cid-s5i7oqae> <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20" data-astro-cid-s5i7oqae> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" data-astro-cid-s5i7oqae></path> </svg> <span data-astro-cid-s5i7oqae>Brak karty kredytowej</span> </div> <div class="flex items-center gap-2" data-astro-cid-s5i7oqae> <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20" data-astro-cid-s5i7oqae> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" data-astro-cid-s5i7oqae></path> </svg> <span data-astro-cid-s5i7oqae>Konfiguracja w 5 minut</span> </div> </div> </div> </div> </section>  <section class="py-16 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-800 dark:via-indigo-800 dark:to-purple-800" data-astro-cid-s5i7oqae> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-astro-cid-s5i7oqae> <div class="grid grid-cols-1 md:grid-cols-4 gap-8 text-center" data-astro-cid-s5i7oqae> <!-- Stat 1 --> <div class="group" data-astro-cid-s5i7oqae> <div class="flex flex-col items-center" data-astro-cid-s5i7oqae> <div class="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-white/20 transition-all duration-300" data-astro-cid-s5i7oqae> <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-s5i7oqae> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" data-astro-cid-s5i7oqae></path> </svg> </div> <div class="text-3xl md:text-4xl font-bold text-white mb-2" data-astro-cid-s5i7oqae>10,000+</div> <div class="text-blue-100 font-medium" data-astro-cid-s5i7oqae>Zadowolonych użytkowników</div> </div> </div> <!-- Stat 2 --> <div class="group" data-astro-cid-s5i7oqae> <div class="flex flex-col items-center" data-astro-cid-s5i7oqae> <div class="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-white/20 transition-all duration-300" data-astro-cid-s5i7oqae> <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-s5i7oqae> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" data-astro-cid-s5i7oqae></path> </svg> </div> <div class="text-3xl md:text-4xl font-bold text-white mb-2" data-astro-cid-s5i7oqae>500,000+</div> <div class="text-blue-100 font-medium" data-astro-cid-s5i7oqae>Zarejestrowanych transakcji</div> </div> </div> <!-- Stat 3 --> <div class="group" data-astro-cid-s5i7oqae> <div class="flex flex-col items-center" data-astro-cid-s5i7oqae> <div class="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-white/20 transition-all duration-300" data-astro-cid-s5i7oqae> <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-s5i7oqae> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" data-astro-cid-s5i7oqae></path> </svg> </div> <div class="text-3xl md:text-4xl font-bold text-white mb-2" data-astro-cid-s5i7oqae>25,000+</div> <div class="text-blue-100 font-medium" data-astro-cid-s5i7oqae>Osiągniętych celów</div> </div> </div> <!-- Stat 4 --> <div class="group" data-astro-cid-s5i7oqae> <div class="flex flex-col items-center" data-astro-cid-s5i7oqae> <div class="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-white/20 transition-all duration-300" data-astro-cid-s5i7oqae> <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-s5i7oqae> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" data-astro-cid-s5i7oqae></path> </svg> </div> <div class="text-3xl md:text-4xl font-bold text-white mb-2" data-astro-cid-s5i7oqae>98%</div> <div class="text-blue-100 font-medium" data-astro-cid-s5i7oqae>Zadowolenie użytkowników</div> </div> </div> </div> </div> </section>  <section class="py-20 bg-white dark:bg-gray-900" data-astro-cid-s5i7oqae> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-astro-cid-s5i7oqae> <div class="text-center mb-16" data-astro-cid-s5i7oqae> <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4" data-astro-cid-s5i7oqae>
Zobacz, jak HouseFlow może pomóc Ci w zarządzaniu finansami
</h2> <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto" data-astro-cid-s5i7oqae>
Przykładowe funkcjonalności dostępne po rejestracji
</p> </div> <!-- Mock Dashboard Components --> <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12" data-astro-cid-s5i7oqae> <!-- Goals Summary --> <div class="transform hover:scale-105 transition-transform duration-300" data-astro-cid-s5i7oqae> ${renderComponent($$result2, "GoalsSummary", GoalsSummary, { "goals": mockGoalsData, "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Admin/10xdevs-house-flow/src/components/dashboard/GoalsSummary", "client:component-export": "default", "data-astro-cid-s5i7oqae": true })} </div> <div class="transform hover:scale-105 transition-transform duration-300" data-astro-cid-s5i7oqae> ${renderComponent($$result2, "CategoryPieChart", CategoryPieChart, { "data": mockBudgetData.category_breakdown, "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Admin/10xdevs-house-flow/src/components/dashboard/CategoryPieChart", "client:component-export": "default", "data-astro-cid-s5i7oqae": true })} </div> </div> </div> </section>  <section class="py-20 bg-gray-50 dark:bg-gray-800" data-astro-cid-s5i7oqae> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-astro-cid-s5i7oqae> <div class="text-center mb-16" data-astro-cid-s5i7oqae> <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4" data-astro-cid-s5i7oqae>Kluczowe funkcjonalności</h2> <p class="text-lg text-gray-600 dark:text-gray-300" data-astro-cid-s5i7oqae>
Wszystko, czego potrzebujesz do efektywnego zarządzania budżetem domowym
</p> </div> <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-astro-cid-s5i7oqae> <!-- Feature 1 --> ${renderComponent($$result2, "Card", Card, { "className": "group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-0 bg-gradient-to-br from-white to-blue-50/50 dark:from-gray-800 dark:to-blue-900/20", "data-astro-cid-s5i7oqae": true }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "CardHeader", CardHeader, { "className": "pb-4", "data-astro-cid-s5i7oqae": true }, { "default": ($$result4) => renderTemplate` <div class="relative" data-astro-cid-s5i7oqae> <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110" data-astro-cid-s5i7oqae> <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-s5i7oqae> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" data-astro-cid-s5i7oqae></path> </svg> </div> </div> ${renderComponent($$result4, "CardTitle", CardTitle, { "className": "text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2", "data-astro-cid-s5i7oqae": true }, { "default": ($$result5) => renderTemplate`
Rejestrowanie transakcji
` })} ` })} ${renderComponent($$result3, "CardContent", CardContent, { "data-astro-cid-s5i7oqae": true }, { "default": ($$result4) => renderTemplate` ${renderComponent($$result4, "CardDescription", CardDescription, { "className": "text-gray-600 dark:text-gray-300 leading-relaxed", "data-astro-cid-s5i7oqae": true }, { "default": ($$result5) => renderTemplate`
Łatwe dodawanie wpływów i wydatków z kategoriami, datami i opisami. Szybkie skanowanie paragonów i
              automatyczna kategoryzacja.
` })} ` })} ` })} <!-- Feature 2 --> ${renderComponent($$result2, "Card", Card, { "className": "group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-0 bg-gradient-to-br from-white to-green-50/50 dark:from-gray-800 dark:to-green-900/20", "data-astro-cid-s5i7oqae": true }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "CardHeader", CardHeader, { "className": "pb-4", "data-astro-cid-s5i7oqae": true }, { "default": ($$result4) => renderTemplate` <div class="relative" data-astro-cid-s5i7oqae> <div class="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110" data-astro-cid-s5i7oqae> <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-s5i7oqae> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" data-astro-cid-s5i7oqae></path> </svg> </div> </div> ${renderComponent($$result4, "CardTitle", CardTitle, { "className": "text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2", "data-astro-cid-s5i7oqae": true }, { "default": ($$result5) => renderTemplate`
Wizualizacja danych
` })} ` })} ${renderComponent($$result3, "CardContent", CardContent, { "data-astro-cid-s5i7oqae": true }, { "default": ($$result4) => renderTemplate` ${renderComponent($$result4, "CardDescription", CardDescription, { "className": "text-gray-600 dark:text-gray-300 leading-relaxed", "data-astro-cid-s5i7oqae": true }, { "default": ($$result5) => renderTemplate`
Interaktywne wykresy i podsumowania pokazujące trendy i strukturę wydatków. Analiza miesięczna i roczna z
              prognozami.
` })} ` })} ` })} <!-- Feature 3 --> ${renderComponent($$result2, "Card", Card, { "className": "group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-0 bg-gradient-to-br from-white to-purple-50/50 dark:from-gray-800 dark:to-purple-900/20", "data-astro-cid-s5i7oqae": true }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "CardHeader", CardHeader, { "className": "pb-4", "data-astro-cid-s5i7oqae": true }, { "default": ($$result4) => renderTemplate` <div class="relative" data-astro-cid-s5i7oqae> <div class="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110" data-astro-cid-s5i7oqae> <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-s5i7oqae> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" data-astro-cid-s5i7oqae></path> </svg> </div> </div> ${renderComponent($$result4, "CardTitle", CardTitle, { "className": "text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2", "data-astro-cid-s5i7oqae": true }, { "default": ($$result5) => renderTemplate`
Cele oszczędnościowe
` })} ` })} ${renderComponent($$result3, "CardContent", CardContent, { "data-astro-cid-s5i7oqae": true }, { "default": ($$result4) => renderTemplate` ${renderComponent($$result4, "CardDescription", CardDescription, { "className": "text-gray-600 dark:text-gray-300 leading-relaxed", "data-astro-cid-s5i7oqae": true }, { "default": ($$result5) => renderTemplate`
Twórz cele i śledź postępy z automatycznymi predykcjami terminów osiągnięcia. Motywujące powiadomienia i
              śledzenie postępów.
` })} ` })} ` })} <!-- Feature 4 --> ${renderComponent($$result2, "Card", Card, { "className": "group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-0 bg-gradient-to-br from-white to-orange-50/50 dark:from-gray-800 dark:to-orange-900/20", "data-astro-cid-s5i7oqae": true }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "CardHeader", CardHeader, { "className": "pb-4", "data-astro-cid-s5i7oqae": true }, { "default": ($$result4) => renderTemplate` <div class="relative" data-astro-cid-s5i7oqae> <div class="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110" data-astro-cid-s5i7oqae> <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-s5i7oqae> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" data-astro-cid-s5i7oqae></path> </svg> </div> </div> ${renderComponent($$result4, "CardTitle", CardTitle, { "className": "text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2", "data-astro-cid-s5i7oqae": true }, { "default": ($$result5) => renderTemplate`
Raporty miesięczne
` })} ` })} ${renderComponent($$result3, "CardContent", CardContent, { "data-astro-cid-s5i7oqae": true }, { "default": ($$result4) => renderTemplate` ${renderComponent($$result4, "CardDescription", CardDescription, { "className": "text-gray-600 dark:text-gray-300 leading-relaxed", "data-astro-cid-s5i7oqae": true }, { "default": ($$result5) => renderTemplate`
Szczegółowe podsumowania wydatków z filtrowaniem po kategoriach i miesiącach. Eksport do PDF i porównania
              rok do roku.
` })} ` })} ` })} <!-- Feature 5 --> ${renderComponent($$result2, "Card", Card, { "className": "group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-0 bg-gradient-to-br from-white to-red-50/50 dark:from-gray-800 dark:to-red-900/20", "data-astro-cid-s5i7oqae": true }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "CardHeader", CardHeader, { "className": "pb-4", "data-astro-cid-s5i7oqae": true }, { "default": ($$result4) => renderTemplate` <div class="relative" data-astro-cid-s5i7oqae> <div class="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110" data-astro-cid-s5i7oqae> <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-s5i7oqae> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" data-astro-cid-s5i7oqae></path> </svg> </div> </div> ${renderComponent($$result4, "CardTitle", CardTitle, { "className": "text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2", "data-astro-cid-s5i7oqae": true }, { "default": ($$result5) => renderTemplate`
Responsywność
` })} ` })} ${renderComponent($$result3, "CardContent", CardContent, { "data-astro-cid-s5i7oqae": true }, { "default": ($$result4) => renderTemplate` ${renderComponent($$result4, "CardDescription", CardDescription, { "className": "text-gray-600 dark:text-gray-300 leading-relaxed", "data-astro-cid-s5i7oqae": true }, { "default": ($$result5) => renderTemplate`
Pełna funkcjonalność na wszystkich urządzeniach - komputerach, tabletach i smartfonach. Synchronizacja
              danych w czasie rzeczywistym.
` })} ` })} ` })} <!-- Feature 6 --> ${renderComponent($$result2, "Card", Card, { "className": "group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-0 bg-gradient-to-br from-white to-indigo-50/50 dark:from-gray-800 dark:to-indigo-900/20", "data-astro-cid-s5i7oqae": true }, { "default": ($$result3) => renderTemplate` ${renderComponent($$result3, "CardHeader", CardHeader, { "className": "pb-4", "data-astro-cid-s5i7oqae": true }, { "default": ($$result4) => renderTemplate` <div class="relative" data-astro-cid-s5i7oqae> <div class="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110" data-astro-cid-s5i7oqae> <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-astro-cid-s5i7oqae> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" data-astro-cid-s5i7oqae></path> </svg> </div> </div> ${renderComponent($$result4, "CardTitle", CardTitle, { "className": "text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2", "data-astro-cid-s5i7oqae": true }, { "default": ($$result5) => renderTemplate`
Bezpieczeństwo
` })} ` })} ${renderComponent($$result3, "CardContent", CardContent, { "data-astro-cid-s5i7oqae": true }, { "default": ($$result4) => renderTemplate` ${renderComponent($$result4, "CardDescription", CardDescription, { "className": "text-gray-600 dark:text-gray-300 leading-relaxed", "data-astro-cid-s5i7oqae": true }, { "default": ($$result5) => renderTemplate`
Twoje dane finansowe są bezpieczne dzięki nowoczesnym standardom bezpieczeństwa. Szyfrowanie end-to-end i
              regularne audyty.
` })} ` })} ` })} </div> </div> </section>  <section class="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800" data-astro-cid-s5i7oqae> <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-astro-cid-s5i7oqae> <div class="text-center mb-16" data-astro-cid-s5i7oqae> <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4" data-astro-cid-s5i7oqae>Co mówią nasi użytkownicy</h2> <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto" data-astro-cid-s5i7oqae>
Dołącz do tysięcy zadowolonych użytkowników, którzy już uproszczają zarządzanie swoimi finansami
</p> </div> <div class="grid grid-cols-1 md:grid-cols-3 gap-8" data-astro-cid-s5i7oqae> <!-- Testimonial 1 --> <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col justify-between h-full" data-astro-cid-s5i7oqae> <div class="flex items-center mb-4" data-astro-cid-s5i7oqae> <div class="flex text-yellow-400" data-astro-cid-s5i7oqae> <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20" data-astro-cid-s5i7oqae><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" data-astro-cid-s5i7oqae></path></svg> <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20" data-astro-cid-s5i7oqae><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" data-astro-cid-s5i7oqae></path></svg> <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20" data-astro-cid-s5i7oqae><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" data-astro-cid-s5i7oqae></path></svg> <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20" data-astro-cid-s5i7oqae><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" data-astro-cid-s5i7oqae></path></svg> <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20" data-astro-cid-s5i7oqae><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" data-astro-cid-s5i7oqae></path></svg> </div> </div> <p class="text-gray-600 dark:text-gray-300 mb-6 italic leading-relaxed" data-astro-cid-s5i7oqae>
"HouseFlow całkowicie zmienił sposób, w jaki zarządzam naszym domowym budżetem. Wszystko jest tak proste i
            intuicyjne!"
</p> <div class="flex items-center" data-astro-cid-s5i7oqae> <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3" data-astro-cid-s5i7oqae>
A
</div> <div data-astro-cid-s5i7oqae> <div class="font-semibold text-gray-900 dark:text-white" data-astro-cid-s5i7oqae>Anna Kowalska</div> <div class="text-sm text-gray-500 dark:text-gray-400" data-astro-cid-s5i7oqae>Menedżer projektu</div> </div> </div> </div> <!-- Testimonial 2 --> <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col justify-between h-full" data-astro-cid-s5i7oqae> <div class="flex items-center mb-4" data-astro-cid-s5i7oqae> <div class="flex text-yellow-400" data-astro-cid-s5i7oqae> <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20" data-astro-cid-s5i7oqae><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" data-astro-cid-s5i7oqae></path></svg> <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20" data-astro-cid-s5i7oqae><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" data-astro-cid-s5i7oqae></path></svg> <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20" data-astro-cid-s5i7oqae><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" data-astro-cid-s5i7oqae></path></svg> <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20" data-astro-cid-s5i7oqae><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" data-astro-cid-s5i7oqae></path></svg> <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20" data-astro-cid-s5i7oqae><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" data-astro-cid-s5i7oqae></path></svg> </div> </div> <p class="text-gray-600 dark:text-gray-300 mb-6 italic leading-relaxed" data-astro-cid-s5i7oqae>
"Dzięki HouseFlow w końcu mam pełną kontrolę nad naszymi wydatkami. Cele oszczędnościowe to świetna
            motywacja!"
</p> <div class="flex items-center" data-astro-cid-s5i7oqae> <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3" data-astro-cid-s5i7oqae>
M
</div> <div data-astro-cid-s5i7oqae> <div class="font-semibold text-gray-900 dark:text-white" data-astro-cid-s5i7oqae>Marek Nowak</div> <div class="text-sm text-gray-500 dark:text-gray-400" data-astro-cid-s5i7oqae>Przedsiębiorca</div> </div> </div> </div> <!-- Testimonial 3 --> <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col justify-between h-full" data-astro-cid-s5i7oqae> <div class="flex items-center mb-4" data-astro-cid-s5i7oqae> <div class="flex text-yellow-400" data-astro-cid-s5i7oqae> <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20" data-astro-cid-s5i7oqae><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" data-astro-cid-s5i7oqae></path></svg> <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20" data-astro-cid-s5i7oqae><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" data-astro-cid-s5i7oqae></path></svg> <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20" data-astro-cid-s5i7oqae><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" data-astro-cid-s5i7oqae></path></svg> <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20" data-astro-cid-s5i7oqae><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" data-astro-cid-s5i7oqae></path></svg> <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20" data-astro-cid-s5i7oqae><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" data-astro-cid-s5i7oqae></path></svg> </div> </div> <p class="text-gray-600 dark:text-gray-300 mb-6 italic leading-relaxed" data-astro-cid-s5i7oqae>
"Aplikacja jest intuicyjna i bezpieczna. Wreszcie wiem, na co wydaję pieniądze i jak oszczędzać na ważne
            cele."
</p> <div class="flex items-center" data-astro-cid-s5i7oqae> <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3" data-astro-cid-s5i7oqae>
K
</div> <div data-astro-cid-s5i7oqae> <div class="font-semibold text-gray-900 dark:text-white" data-astro-cid-s5i7oqae>Katarzyna Wiśniewska</div> <div class="text-sm text-gray-500 dark:text-gray-400" data-astro-cid-s5i7oqae>Nauczycielka</div> </div> </div> </div> </div> </div> </section>  <section class="relative py-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-800 dark:via-purple-800 dark:to-pink-800 overflow-hidden" data-astro-cid-s5i7oqae> <!-- Background decorations --> <div class="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5" data-astro-cid-s5i7oqae></div> <!-- Floating elements --> <div class="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse" data-astro-cid-s5i7oqae></div> <div class="absolute bottom-10 right-10 w-40 h-40 bg-white/5 rounded-full blur-xl animate-pulse animation-delay-1000" data-astro-cid-s5i7oqae></div> <div class="absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full blur-xl animate-pulse animation-delay-2000" data-astro-cid-s5i7oqae></div> <div class="max-w-6xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10" data-astro-cid-s5i7oqae> <!-- Main heading --> <div class="mb-8" data-astro-cid-s5i7oqae> <h2 class="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight" data-astro-cid-s5i7oqae>
Gotowy, by przejąć
<span class="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent" data-astro-cid-s5i7oqae>
kontrolę nad swoim budżetem?
</span> </h2> <p class="text-xl md:text-2xl text-indigo-100 mb-12 max-w-3xl mx-auto leading-relaxed" data-astro-cid-s5i7oqae>
Dołącz do tysięcy użytkowników, którzy już uproszczają zarządzanie finansami z HouseFlow. Rozpocznij swoją
          podróż do finansowej wolności już dziś!
</p> </div> <!-- Enhanced CTA Buttons --> <div class="flex flex-col sm:flex-row gap-10 justify-center items-center mb-12" data-astro-cid-s5i7oqae> <a href="/register" class="group" data-astro-cid-s5i7oqae> ${renderComponent($$result2, "Button", Button, { "size": "lg", "className": "text-xl px-12 py-5 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-300 hover:to-orange-400 text-gray-900 font-bold rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-500 border-0 group-hover:shadow-yellow-400/25", "data-astro-cid-s5i7oqae": true }, { "default": ($$result3) => renderTemplate`
🚀 Rozpocznij za darmo
` })} </a> <a href="/login" class="group" data-astro-cid-s5i7oqae> ${renderComponent($$result2, "Button", Button, { "variant": "outline", "size": "lg", "className": "text-xl px-12 py-5 border-3 border-white/30 hover:border-white text-white hover:text-white hover:bg-white/10 font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 bg-white/5 backdrop-blur-sm", "data-astro-cid-s5i7oqae": true }, { "default": ($$result3) => renderTemplate`
Zaloguj się
` })} </a> </div> <!-- Trust indicators --> <div class="flex flex-col sm:flex-row items-center justify-center gap-8 text-indigo-200" data-astro-cid-s5i7oqae> <div class="flex items-center gap-2" data-astro-cid-s5i7oqae> <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20" data-astro-cid-s5i7oqae> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" data-astro-cid-s5i7oqae></path> </svg> <span class="font-medium" data-astro-cid-s5i7oqae>14 dni gwarancji zwrotu</span> </div> <div class="flex items-center gap-2" data-astro-cid-s5i7oqae> <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20" data-astro-cid-s5i7oqae> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" data-astro-cid-s5i7oqae></path> </svg> <span class="font-medium" data-astro-cid-s5i7oqae>Bezpieczne płatności SSL</span> </div> <div class="flex items-center gap-2" data-astro-cid-s5i7oqae> <svg class="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20" data-astro-cid-s5i7oqae> <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" data-astro-cid-s5i7oqae></path> </svg> <span class="font-medium" data-astro-cid-s5i7oqae>Wsparcie 24/7</span> </div> </div> </div> </section> ` })} `;
}, "C:/Users/Admin/10xdevs-house-flow/src/pages/guest.astro", void 0);

const $$file = "C:/Users/Admin/10xdevs-house-flow/src/pages/guest.astro";
const $$url = "/guest";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Guest,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
