globalThis.process ??= {}; globalThis.process.env ??= {};
import { R as ReportsService } from '../../../chunks/reports.service_B1ycDDhS.mjs';
import { r as requireAuth } from '../../../chunks/api-helpers_gexHC0qf.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_B70jUmW-.mjs';

const GET = async (context) => {
  try {
    const authResult = await requireAuth(context);
    if (authResult instanceof Response) return authResult;
    const { user } = authResult;
    const reportsService = new ReportsService(context.locals.supabase);
    const report = await reportsService.getGoalsReport(user.id);
    return new Response(JSON.stringify(report), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Błąd podczas pobierania raportu celów:", error);
    return new Response(
      JSON.stringify({ message: "Wystąpił błąd serwera podczas pobierania raportu celów" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
