globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_1erLSVHf.mjs';
import { $ as $$Layout } from '../chunks/Layout_Ruqev_Kq.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_B70jUmW-.mjs';

const $$Expenses = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Wydatki - HouseFlow" }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "Navbar", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/Admin/10xdevs-house-flow/src/components/Navbar", "client:component-export": "default" })}  ${renderComponent($$result2, "ExpensesPage", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/Admin/10xdevs-house-flow/src/components/expenses/ExpensesPage", "client:component-export": "ExpensesPage" })} ` })}`;
}, "C:/Users/Admin/10xdevs-house-flow/src/pages/expenses.astro", void 0);

const $$file = "C:/Users/Admin/10xdevs-house-flow/src/pages/expenses.astro";
const $$url = "/expenses";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Expenses,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
