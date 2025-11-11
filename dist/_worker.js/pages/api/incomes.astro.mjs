globalThis.process ??= {}; globalThis.process.env ??= {};
import { b as validateGetIncomesQuery, c as sanitizeGetIncomesQuery, I as IncomesService, d as validateCreateIncomeCommand, e as sanitizeCreateIncomeCommand } from '../../chunks/incomes.service_D1Qr8tjl.mjs';
import { r as requireAuth } from '../../chunks/api-helpers_gexHC0qf.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_JyCnA0Wd.mjs';

const GET = async (context) => {
  try {
    const authResult = await requireAuth(context);
    if (authResult instanceof Response) return authResult;
    const { user } = authResult;
    const url = new URL(context.request.url);
    const queryParams = url.searchParams;
    const validation = validateGetIncomesQuery(queryParams);
    if (!validation.isValid) {
      return new Response(JSON.stringify({ message: validation.errors.join(", ") }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const query = sanitizeGetIncomesQuery(queryParams);
    const incomesService = new IncomesService(context.locals.supabase);
    const result = await incomesService.getIncomes(user.id, query);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Błąd podczas pobierania wpływów:", error);
    return new Response(JSON.stringify({ message: "Wystąpił błąd serwera podczas pobierania wpływów" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const POST = async (context) => {
  try {
    const authResult = await requireAuth(context);
    if (authResult instanceof Response) return authResult;
    const { user } = authResult;
    let requestBody;
    try {
      requestBody = await context.request.json();
    } catch {
      return new Response(JSON.stringify({ message: "Nieprawidłowe dane JSON w żądaniu" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const validation = validateCreateIncomeCommand(requestBody);
    if (!validation.isValid) {
      return new Response(JSON.stringify({ message: validation.errors.join(", ") }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const command = sanitizeCreateIncomeCommand(requestBody);
    if (!command) {
      return new Response(JSON.stringify({ message: "Błąd podczas przetwarzania danych wejściowych" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const incomesService = new IncomesService(context.locals.supabase);
    const income = await incomesService.create(command, user.id);
    return new Response(JSON.stringify(income), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Błąd podczas tworzenia wpływu:", error);
    return new Response(JSON.stringify({ message: "Wystąpił błąd serwera podczas tworzenia wpływu" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
