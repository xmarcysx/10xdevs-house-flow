globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_1erLSVHf.mjs';
import { $ as $$Layout } from '../chunks/Layout_Ruqev_Kq.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_B70jUmW-.mjs';

const $$Incomes = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Wp\u0142ywy - HouseFlow" }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "Navbar", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/Admin/10xdevs-house-flow/src/components/Navbar", "client:component-export": "default" })}  ${renderComponent($$result2, "IncomesPage", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/Admin/10xdevs-house-flow/src/components/incomes/IncomesPage", "client:component-export": "IncomesPage" })} ` })}`;
}, "C:/Users/Admin/10xdevs-house-flow/src/pages/incomes.astro", void 0);

const $$file = "C:/Users/Admin/10xdevs-house-flow/src/pages/incomes.astro";
const $$url = "/incomes";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Incomes,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
