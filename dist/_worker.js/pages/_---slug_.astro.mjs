globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_ae_hJQlB.mjs';
import { A as App } from '../chunks/App_CxRaBHSy.mjs';
import { $ as $$Layout } from '../chunks/Layout_CW-7BzHS.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_JyCnA0Wd.mjs';

const $$Astro = createAstro();
const $$ = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  const { slug } = Astro2.params;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "HouseFlow" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "App", App, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Admin/10xdevs-house-flow/src/components/App", "client:component-export": "default" })} ` })}`;
}, "C:/Users/Admin/10xdevs-house-flow/src/pages/[...slug].astro", void 0);

const $$file = "C:/Users/Admin/10xdevs-house-flow/src/pages/[...slug].astro";
const $$url = "/[...slug]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
