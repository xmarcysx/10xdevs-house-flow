globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, f as createAstro, h as addAttribute, aq as renderHead, ar as renderSlot, k as renderComponent, r as renderTemplate } from './astro/server_1erLSVHf.mjs';
/* empty css                         */

if (typeof globalThis === "undefined") {
  globalThis.global = globalThis;
}

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  const { title = "10x Astro Starter" } = Astro2.props;
  return renderTemplate`<html lang="en" data-astro-cid-sckkx6r4> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/x-icon" href="/public/favicon.ico"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title}</title>${renderHead()}</head> <body data-astro-cid-sckkx6r4> ${renderSlot($$result, $$slots["default"])} ${renderComponent($$result, "Toaster", null, { "client:only": "react", "client:component-hydration": "only", "data-astro-cid-sckkx6r4": true, "client:component-path": "C:/Users/Admin/10xdevs-house-flow/src/components/ui/sonner", "client:component-export": "Toaster" })} </body></html>`;
}, "C:/Users/Admin/10xdevs-house-flow/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
