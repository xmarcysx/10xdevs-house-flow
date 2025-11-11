globalThis.process ??= {}; globalThis.process.env ??= {};
import { v as validateGoalId, G as GoalsService, a as validateUpdateGoalCommand, s as sanitizeUpdateGoalCommand } from '../../../chunks/goals.service_BlhTZ2g9.mjs';
import { r as requireAuth } from '../../../chunks/api-helpers_gexHC0qf.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_JyCnA0Wd.mjs';

const GET = async (context) => {
  try {
    const authResult = await requireAuth(context);
    if (authResult instanceof Response) return authResult;
    const { user } = authResult;
    const { id } = context.params;
    if (!id) {
      return new Response(JSON.stringify({ message: "ID celu jest wymagane" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const idValidation = validateGoalId(id);
    if (!idValidation.isValid) {
      return new Response(JSON.stringify({ message: idValidation.errors.join(", ") }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const goalsService = new GoalsService(context.locals.supabase);
    const goal = await goalsService.getGoalWithContributionsById(id, user.id);
    return new Response(JSON.stringify(goal), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Błąd podczas pobierania celu:", error);
    if (error instanceof Error) {
      if (error.message.includes("nie istnieje lub nie należy do użytkownika")) {
        return new Response(JSON.stringify({ message: "Cel nie został znaleziony" }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    return new Response(JSON.stringify({ message: "Wystąpił błąd serwera podczas pobierania celu" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const PUT = async (context) => {
  try {
    const authResult = await requireAuth(context);
    if (authResult instanceof Response) return authResult;
    const { user } = authResult;
    const { id } = context.params;
    if (!id) {
      return new Response(JSON.stringify({ message: "ID celu jest wymagane" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const idValidation = validateGoalId(id);
    if (!idValidation.isValid) {
      return new Response(JSON.stringify({ message: idValidation.errors.join(", ") }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    let requestBody;
    try {
      requestBody = await context.request.json();
    } catch {
      return new Response(JSON.stringify({ message: "Nieprawidłowe dane JSON w żądaniu" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const validation = validateUpdateGoalCommand(requestBody);
    if (!validation.isValid) {
      return new Response(JSON.stringify({ message: validation.errors.join(", ") }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const command = sanitizeUpdateGoalCommand(requestBody);
    if (!command) {
      return new Response(JSON.stringify({ message: "Błąd podczas przetwarzania danych wejściowych" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const goalsService = new GoalsService(context.locals.supabase);
    const updatedGoal = await goalsService.update(id, command, user.id);
    return new Response(JSON.stringify(updatedGoal), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Błąd podczas aktualizacji celu:", error);
    if (error instanceof Error) {
      if (error.message.includes("nie istnieje lub nie należy do użytkownika")) {
        return new Response(JSON.stringify({ message: "Cel nie został znaleziony" }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }
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
    return new Response(JSON.stringify({ message: "Wystąpił błąd serwera podczas aktualizacji celu" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const DELETE = async (context) => {
  try {
    const authResult = await requireAuth(context);
    if (authResult instanceof Response) return authResult;
    const { user } = authResult;
    const { id } = context.params;
    if (!id) {
      return new Response(JSON.stringify({ message: "ID celu jest wymagane" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const idValidation = validateGoalId(id);
    if (!idValidation.isValid) {
      return new Response(JSON.stringify({ message: idValidation.errors.join(", ") }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const goalsService = new GoalsService(context.locals.supabase);
    await goalsService.delete(id, user.id);
    return new Response(JSON.stringify({ message: "Cel został usunięty" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Błąd podczas usuwania celu:", error);
    if (error instanceof Error) {
      if (error.message.includes("nie istnieje lub nie należy do użytkownika")) {
        return new Response(JSON.stringify({ message: "Cel nie został znaleziony" }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    return new Response(JSON.stringify({ message: "Wystąpił błąd serwera podczas usuwania celu" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
