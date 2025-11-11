
            // MessageChannel polyfill for Cloudflare Workers
            if (typeof MessageChannel === 'undefined') {
              globalThis.MessageChannel = function() {
                return {
                  port1: { postMessage: function() {}, addEventListener: function() {}, removeEventListener: function() {}, close: function() {} },
                  port2: { postMessage: function() {}, addEventListener: function() {}, removeEventListener: function() {}, close: function() {} }
                };
              };
            }
          
import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_G7LsiH47.mjs';
import { $ as $$Layout } from '../chunks/Layout_m61kTqBM.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_BVqCE940.mjs';

const $$Astro = createAstro();
const $$ = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$;
  const { slug } = Astro2.params;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "HouseFlow" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "App", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/Admin/10xdevs-house-flow/src/components/App", "client:component-export": "default" })} ` })}`;
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
