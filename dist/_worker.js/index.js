globalThis.process ??= {}; globalThis.process.env ??= {};
import { r as renderers } from './chunks/_@astro-renderers_JyCnA0Wd.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_CSKFiNSB.mjs';
import { manifest } from './manifest_DwJpyCqZ.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/500.astro.mjs');
const _page2 = () => import('./pages/api/auth/login.astro.mjs');
const _page3 = () => import('./pages/api/auth/logout.astro.mjs');
const _page4 = () => import('./pages/api/auth/profile.astro.mjs');
const _page5 = () => import('./pages/api/auth/register.astro.mjs');
const _page6 = () => import('./pages/api/auth/reset-password.astro.mjs');
const _page7 = () => import('./pages/api/auth/session.astro.mjs');
const _page8 = () => import('./pages/api/budget/monthly.astro.mjs');
const _page9 = () => import('./pages/api/categories/_id_.astro.mjs');
const _page10 = () => import('./pages/api/categories.astro.mjs');
const _page11 = () => import('./pages/api/expenses/_id_.astro.mjs');
const _page12 = () => import('./pages/api/expenses.astro.mjs');
const _page13 = () => import('./pages/api/goals/_goal_id_/contributions/_id_.astro.mjs');
const _page14 = () => import('./pages/api/goals/_goal_id_/contributions.astro.mjs');
const _page15 = () => import('./pages/api/goals/_id_.astro.mjs');
const _page16 = () => import('./pages/api/goals.astro.mjs');
const _page17 = () => import('./pages/api/incomes/_id_.astro.mjs');
const _page18 = () => import('./pages/api/incomes.astro.mjs');
const _page19 = () => import('./pages/api/reports/goals.astro.mjs');
const _page20 = () => import('./pages/api/reports/monthly/_month_.astro.mjs');
const _page21 = () => import('./pages/categories.astro.mjs');
const _page22 = () => import('./pages/expenses.astro.mjs');
const _page23 = () => import('./pages/goals/_id_.astro.mjs');
const _page24 = () => import('./pages/goals.astro.mjs');
const _page25 = () => import('./pages/guest.astro.mjs');
const _page26 = () => import('./pages/incomes.astro.mjs');
const _page27 = () => import('./pages/login.astro.mjs');
const _page28 = () => import('./pages/register.astro.mjs');
const _page29 = () => import('./pages/reports/goals.astro.mjs');
const _page30 = () => import('./pages/reports/monthly.astro.mjs');
const _page31 = () => import('./pages/reports.astro.mjs');
const _page32 = () => import('./pages/reset-password.astro.mjs');
const _page33 = () => import('./pages/settings.astro.mjs');
const _page34 = () => import('./pages/index.astro.mjs');
const _page35 = () => import('./pages/_---slug_.astro.mjs');
const pageMap = new Map([
    ["node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint.js", _page0],
    ["src/pages/500.astro", _page1],
    ["src/pages/api/auth/login.ts", _page2],
    ["src/pages/api/auth/logout.ts", _page3],
    ["src/pages/api/auth/profile.ts", _page4],
    ["src/pages/api/auth/register.ts", _page5],
    ["src/pages/api/auth/reset-password.ts", _page6],
    ["src/pages/api/auth/session.ts", _page7],
    ["src/pages/api/budget/monthly.ts", _page8],
    ["src/pages/api/categories/[id].ts", _page9],
    ["src/pages/api/categories/index.ts", _page10],
    ["src/pages/api/expenses/[id].ts", _page11],
    ["src/pages/api/expenses/index.ts", _page12],
    ["src/pages/api/goals/[goal_id]/contributions/[id].ts", _page13],
    ["src/pages/api/goals/[goal_id]/contributions.ts", _page14],
    ["src/pages/api/goals/[id].ts", _page15],
    ["src/pages/api/goals.ts", _page16],
    ["src/pages/api/incomes/[id].ts", _page17],
    ["src/pages/api/incomes/index.ts", _page18],
    ["src/pages/api/reports/goals.ts", _page19],
    ["src/pages/api/reports/monthly/[month].ts", _page20],
    ["src/pages/categories.astro", _page21],
    ["src/pages/expenses.astro", _page22],
    ["src/pages/goals/[id].astro", _page23],
    ["src/pages/goals.astro", _page24],
    ["src/pages/guest.astro", _page25],
    ["src/pages/incomes.astro", _page26],
    ["src/pages/login.astro", _page27],
    ["src/pages/register.astro", _page28],
    ["src/pages/reports/goals.astro", _page29],
    ["src/pages/reports/monthly.astro", _page30],
    ["src/pages/reports/index.astro", _page31],
    ["src/pages/reset-password.astro", _page32],
    ["src/pages/settings.astro", _page33],
    ["src/pages/index.astro", _page34],
    ["src/pages/[...slug].astro", _page35]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_astro-internal_middleware.mjs')
});
const _args = undefined;
const _exports = createExports(_manifest);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) {
	serverEntrypointModule[_start](_manifest, _args);
}

export { __astrojsSsrVirtualEntry as default, pageMap };
