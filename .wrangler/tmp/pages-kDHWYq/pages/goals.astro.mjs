globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_1erLSVHf.mjs';
import { $ as $$Layout } from '../chunks/Layout_Ruqev_Kq.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_B70jUmW-.mjs';

const $$Goals = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Cele oszcz\u0119dno\u015Bciowe - HouseFlow" }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "Navbar", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/Admin/10xdevs-house-flow/src/components/Navbar", "client:component-export": "default" })}  ${renderComponent($$result2, "GoalsPage", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/Admin/10xdevs-house-flow/src/components/goals/GoalsPage", "client:component-export": "GoalsPage" })} ` })}`;
}, "C:/Users/Admin/10xdevs-house-flow/src/pages/goals.astro", void 0);

const $$file = "C:/Users/Admin/10xdevs-house-flow/src/pages/goals.astro";
const $$url = "/goals";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Goals,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
