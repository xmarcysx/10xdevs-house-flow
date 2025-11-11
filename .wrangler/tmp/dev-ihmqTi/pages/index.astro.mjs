globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, at as renderScript, r as renderTemplate } from '../chunks/astro/server_1erLSVHf.mjs';
import { $ as $$Layout } from '../chunks/Layout_Ruqev_Kq.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_B70jUmW-.mjs';

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "HouseFlow" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "App", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/Admin/10xdevs-house-flow/src/components/App", "client:component-export": "default" })} ` })} <!-- Catch-all redirect for SPA --> ${renderScript($$result, "C:/Users/Admin/10xdevs-house-flow/src/pages/index.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/Admin/10xdevs-house-flow/src/pages/index.astro", void 0);

const $$file = "C:/Users/Admin/10xdevs-house-flow/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
