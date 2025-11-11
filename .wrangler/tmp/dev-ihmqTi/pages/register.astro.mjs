globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_1erLSVHf.mjs';
import { $ as $$AuthLayout } from '../chunks/AuthLayout_DxKr9_gI.mjs';
/* empty css                                    */
export { r as renderers } from '../chunks/_@astro-renderers_B70jUmW-.mjs';

const $$Register = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AuthLayout", $$AuthLayout, { "title": "Rejestracja - HouseFlow", "data-astro-cid-qraosrxq": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-md w-full space-y-8" data-astro-cid-qraosrxq> <div data-astro-cid-qraosrxq> <h2 class="mt-6 text-center text-3xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent" data-astro-cid-qraosrxq>
Utwórz konto
</h2> <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400" data-astro-cid-qraosrxq>
Lub${" "} <a href="/login" class="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200" data-astro-cid-qraosrxq>
zaloguj się do istniejącego konta
</a> </p> </div> <div class="transform hover:scale-105 transition-all duration-300" data-astro-cid-qraosrxq> ${renderComponent($$result2, "RegisterForm", null, { "client:only": "react", "client:component-hydration": "only", "data-astro-cid-qraosrxq": true, "client:component-path": "C:/Users/Admin/10xdevs-house-flow/src/components/RegisterForm", "client:component-export": "default" })} </div> </div> ` })} `;
}, "C:/Users/Admin/10xdevs-house-flow/src/pages/register.astro", void 0);

const $$file = "C:/Users/Admin/10xdevs-house-flow/src/pages/register.astro";
const $$url = "/register";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Register,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
