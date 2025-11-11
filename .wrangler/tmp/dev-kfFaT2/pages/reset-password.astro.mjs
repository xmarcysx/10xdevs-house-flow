globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_1erLSVHf.mjs';
import { $ as $$AuthLayout } from '../chunks/AuthLayout_DxKr9_gI.mjs';
/* empty css                                          */
export { r as renderers } from '../chunks/_@astro-renderers_B70jUmW-.mjs';

const $$ResetPassword = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AuthLayout", $$AuthLayout, { "title": "Resetowanie has\u0142a - HouseFlow", "data-astro-cid-oiuorpsm": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="max-w-md w-full space-y-8" data-astro-cid-oiuorpsm> <div class="text-center" data-astro-cid-oiuorpsm> <h2 class="mt-6 text-center text-3xl font-extrabold bg-gradient-to-r from-gray-900 via-orange-800 to-red-800 dark:from-white dark:via-orange-200 dark:to-red-200 bg-clip-text text-transparent" data-astro-cid-oiuorpsm>
Resetowanie hasła
</h2> <p class="mt-2 text-sm text-gray-600 dark:text-gray-400" data-astro-cid-oiuorpsm>Odzyskaj dostęp do swojego konta HouseFlow</p> </div> <div class="transform hover:scale-105 transition-all duration-300" data-astro-cid-oiuorpsm> ${renderComponent($$result2, "ResetPasswordForm", null, { "client:only": "react", "client:component-hydration": "only", "data-astro-cid-oiuorpsm": true, "client:component-path": "C:/Users/Admin/10xdevs-house-flow/src/components/ResetPasswordForm", "client:component-export": "default" })} </div> </div> ` })} `;
}, "C:/Users/Admin/10xdevs-house-flow/src/pages/reset-password.astro", void 0);

const $$file = "C:/Users/Admin/10xdevs-house-flow/src/pages/reset-password.astro";
const $$url = "/reset-password";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$ResetPassword,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
