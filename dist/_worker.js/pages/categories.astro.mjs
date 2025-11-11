globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_ae_hJQlB.mjs';
import { $ as $$Layout } from '../chunks/Layout_CW-7BzHS.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_JyCnA0Wd.mjs';

const $$Categories = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Kategorie - HouseFlow" }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "Navbar", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/Admin/10xdevs-house-flow/src/components/Navbar", "client:component-export": "default" })}  ${renderComponent($$result2, "CategoriesPage", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/Admin/10xdevs-house-flow/src/components/categories/CategoriesPage", "client:component-export": "CategoriesPage" })} ` })}`;
}, "C:/Users/Admin/10xdevs-house-flow/src/pages/categories.astro", void 0);

const $$file = "C:/Users/Admin/10xdevs-house-flow/src/pages/categories.astro";
const $$url = "/categories";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Categories,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
