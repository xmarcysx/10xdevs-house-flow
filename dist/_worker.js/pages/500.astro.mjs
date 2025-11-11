
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
import { $ as $$Layout } from '../chunks/Layout_m61kTqBM.mjs';
export { r as renderers } from '../chunks/_@astro-renderers_BVqCE940.mjs';

const $$500 = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "B\u0142\u0105d serwera - HouseFlow" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4"> ${renderComponent($$result2, "ErrorCard", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/Admin/10xdevs-house-flow/src/components/ErrorCard", "client:component-export": "default" })} </div> ` })}`;
}, "C:/Users/Admin/10xdevs-house-flow/src/pages/500.astro", void 0);

const $$file = "C:/Users/Admin/10xdevs-house-flow/src/pages/500.astro";
const $$url = "/500";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$500,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
