globalThis.process ??= {}; globalThis.process.env ??= {};
import { b as validateGetGoalsQuery, c as sanitizeGetGoalsQuery, G as GoalsService, d as validateCreateGoalCommand, e as sanitizeCreateGoalCommand } from '../../chunks/goals.service_BlhTZ2g9.mjs';
import { r as requireAuth } from '../../chunks/api-helpers_gexHC0qf.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_B70jUmW-.mjs';

const GET = async (context) => {
  try {
    const authResult = await requireAuth(context);
    if (authResult instanceof Response) return authResult;
    const { user } = authResult;
    const url = new URL(context.request.url);
    const queryParams = url.searchParams;
    const validation = validateGetGoalsQuery(queryParams);
    if (!validation.isValid) {
      return new Response(JSON.stringify({ message: validation.errors.join(", ") }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const query = sanitizeGetGoalsQuery(queryParams);
    const goalsService = new GoalsService(context.locals.supabase);
    const result = await goalsService.getGoals(user.id, query);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Błąd podczas pobierania celów:", error);
    return new Response(JSON.stringify({ message: "Wystąpił błąd serwera podczas pobierania celów" }), {
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
    const validation = validateCreateGoalCommand(requestBody);
    if (!validation.isValid) {
      return new Response(JSON.stringify({ message: validation.errors.join(", ") }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const command = sanitizeCreateGoalCommand(requestBody);
    if (!command) {
      return new Response(JSON.stringify({ message: "Błąd podczas przetwarzania danych wejściowych" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const goalsService = new GoalsService(context.locals.supabase);
    const goal = await goalsService.create(command, user.id);
    return new Response(JSON.stringify(goal), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Błąd podczas tworzenia celu:", error);
    if (error instanceof Error) {
      if (error.message.includes("już istnieje")) {
        return new Response(JSON.stringify({ message: error.message }), {
          status: 422,
          headers: { "Content-Type": "application/json" }
        });
      }
      if (error.message.includes("większa od zera")) {
        return new Response(JSON.stringify({ message: error.message }), {
          status: 422,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    return new Response(JSON.stringify({ message: "Wystąpił błąd serwera podczas tworzenia celu" }), {
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
