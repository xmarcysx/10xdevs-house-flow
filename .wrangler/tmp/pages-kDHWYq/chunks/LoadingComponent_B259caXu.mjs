globalThis.process ??= {}; globalThis.process.env ??= {};
import { j as jsxRuntimeExports } from './index_BqwsLh0s.mjs';
import { a as reactExports } from './_@astro-renderers_B70jUmW-.mjs';

const LoadingComponent = ({
  message = "Ładowanie danych...",
  size = "md",
  className = ""
}) => {
  const spinnerSizes = {
    sm: "h-8 w-8",
    md: "h-16 w-16",
    lg: "h-20 w-20"
  };
  const textSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl"
  };
  reactExports.useEffect(() => {
    const existingStyle = document.getElementById("loading-animations");
    if (!existingStyle) {
      const style = document.createElement("style");
      style.id = "loading-animations";
      style.textContent = `
        .animation-delay-100 {
          animation-delay: 0.1s;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .bg-clip-text {
          -webkit-background-clip: text;
          background-clip: text;
        }
        .text-transparent {
          -webkit-text-fill-color: transparent;
        }
      `;
      document.head.appendChild(style);
    }
    return () => {
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `col-span-full flex items-center justify-center py-20 ${className}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `animate-spin rounded-full ${spinnerSizes[size]} border-4 border-blue-200 dark:border-blue-800`
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `animate-spin rounded-full ${spinnerSizes[size]} border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 absolute top-0`
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "h3",
      {
        className: `font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-4 ${textSizes[size]}`,
        children: message
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600 dark:text-gray-400 text-lg", children: "Przygotowujemy Twoje dane finansowe" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-center gap-2 mt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-blue-500 rounded-full animate-bounce" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-100" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 bg-blue-500 rounded-full animate-bounce animation-delay-200" })
    ] })
  ] }) });
};

export { LoadingComponent as L };
