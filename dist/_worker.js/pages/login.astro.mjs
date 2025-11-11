
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
import { $ as $$AuthLayout } from '../chunks/AuthLayout_COey6jNF.mjs';
/* empty css                                 */
export { r as renderers } from '../chunks/_@astro-renderers_BVqCE940.mjs';

const $$Login = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AuthLayout", $$AuthLayout, { "title": "Logowanie - HouseFlow", "data-astro-cid-sgpqyurt": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-md w-full space-y-8" data-astro-cid-sgpqyurt> <div data-astro-cid-sgpqyurt> <h2 class="mt-6 text-center text-3xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent" data-astro-cid-sgpqyurt>
Zaloguj się
</h2> <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400" data-astro-cid-sgpqyurt>
Lub${" "} <a href="/register" class="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200" data-astro-cid-sgpqyurt>
utwórz nowe konto
</a> </p> </div> <div class="transform hover:scale-105 transition-all duration-300" data-astro-cid-sgpqyurt> ${renderComponent($$result2, "LoginForm", null, { "client:only": "react", "client:component-hydration": "only", "data-astro-cid-sgpqyurt": true, "client:component-path": "C:/Users/Admin/10xdevs-house-flow/src/components/LoginForm", "client:component-export": "default" })} </div> </div> ` })} `;
}, "C:/Users/Admin/10xdevs-house-flow/src/pages/login.astro", void 0);

const $$file = "C:/Users/Admin/10xdevs-house-flow/src/pages/login.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
