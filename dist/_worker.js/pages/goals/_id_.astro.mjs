globalThis.process ??= {}; globalThis.process.env ??= {};
import { e as createComponent, f as createAstro, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_ae_hJQlB.mjs';
import { $ as $$Layout } from '../../chunks/Layout_CW-7BzHS.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_JyCnA0Wd.mjs';

const $$Astro = createAstro();
const $$id = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$id;
  const { id } = Astro2.params;
  if (!id) {
    return Astro2.redirect("/goals");
  }
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Szczeg\xF3\u0142y celu - HouseFlow" }, { "default": ($$result2) => renderTemplate`  ${renderComponent($$result2, "Navbar", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/Admin/10xdevs-house-flow/src/components/Navbar", "client:component-export": "default" })}  ${renderComponent($$result2, "GoalDetailPage", null, { "goalId": id, "client:only": "react", "client:component-hydration": "only", "client:component-path": "C:/Users/Admin/10xdevs-house-flow/src/components/goals/GoalDetailPage", "client:component-export": "GoalDetailPage" })} ` })}`;
}, "C:/Users/Admin/10xdevs-house-flow/src/pages/goals/[id].astro", void 0);

const $$file = "C:/Users/Admin/10xdevs-house-flow/src/pages/goals/[id].astro";
const $$url = "/goals/[id]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
