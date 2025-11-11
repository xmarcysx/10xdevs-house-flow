globalThis.process ??= {}; globalThis.process.env ??= {};
import { v as validateGoalId, c as validateGetGoalContributionsQuery, d as sanitizeGetGoalContributionsQuery, G as GoalContributionsService, e as validateCreateGoalContributionCommand, f as sanitizeCreateGoalContributionCommand } from '../../../../chunks/goal-contributions.service_CY7nkhSe.mjs';
import { r as requireAuth } from '../../../../chunks/api-helpers_gexHC0qf.mjs';
export { r as renderers } from '../../../../chunks/_@astro-renderers_JyCnA0Wd.mjs';

const GET = async (context) => {
  try {
    const authResult = await requireAuth(context);
    if (authResult instanceof Response) return authResult;
    const { user } = authResult;
    const { goal_id } = context.params;
    if (!goal_id) {
      return new Response(JSON.stringify({ message: "ID celu jest wymagane" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const goalIdValidation = validateGoalId(goal_id);
    if (!goalIdValidation.isValid) {
      return new Response(JSON.stringify({ message: goalIdValidation.errors.join(", ") }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const url = new URL(context.request.url);
    const queryParams = url.searchParams;
    const validation = validateGetGoalContributionsQuery(queryParams);
    if (!validation.isValid) {
      return new Response(JSON.stringify({ message: validation.errors.join(", ") }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const query = sanitizeGetGoalContributionsQuery(queryParams);
    const goalContributionsService = new GoalContributionsService(context.locals.supabase);
    const result = await goalContributionsService.getGoalContributions(goal_id, user.id, query);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Błąd podczas pobierania wpłat:", error);
    return new Response(JSON.stringify({ message: "Wystąpił błąd serwera podczas pobierania wpłat" }), {
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
    const { goal_id } = context.params;
    if (!goal_id) {
      return new Response(JSON.stringify({ message: "ID celu jest wymagane" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const goalIdValidation = validateGoalId(goal_id);
    if (!goalIdValidation.isValid) {
      return new Response(JSON.stringify({ message: goalIdValidation.errors.join(", ") }), {
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
    const validation = validateCreateGoalContributionCommand(requestBody);
    if (!validation.isValid) {
      return new Response(JSON.stringify({ message: validation.errors.join(", ") }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const command = sanitizeCreateGoalContributionCommand(requestBody);
    if (!command) {
      return new Response(JSON.stringify({ message: "Błąd podczas przetwarzania danych wejściowych" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const goalContributionsService = new GoalContributionsService(context.locals.supabase);
    const contribution = await goalContributionsService.create(goal_id, command, user.id);
    return new Response(JSON.stringify(contribution), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Błąd podczas tworzenia wpłaty:", error);
    if (error instanceof Error) {
      if (error.message.includes("nie istnieje lub nie należy do użytkownika")) {
        return new Response(JSON.stringify({ message: error.message }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    return new Response(JSON.stringify({ message: "Wystąpił błąd serwera podczas tworzenia wpłaty" }), {
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
