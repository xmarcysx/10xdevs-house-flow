globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate, m as maybeRenderHead, ar as renderSlot } from './astro/server_1erLSVHf.mjs';
import { $ as $$Layout } from './Layout_Ruqev_Kq.mjs';

const $$Astro = createAstro();
const $$AuthLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$AuthLayout;
  const { title } = Astro2.props;
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"> ${renderSlot($$result2, $$slots["default"])} </div> ` })}`;
}, "C:/Users/Admin/10xdevs-house-flow/src/layouts/AuthLayout.astro", void 0);

export { $$AuthLayout as $ };
