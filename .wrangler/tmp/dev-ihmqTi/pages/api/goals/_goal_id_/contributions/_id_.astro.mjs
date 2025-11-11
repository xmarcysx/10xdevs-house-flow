globalThis.process ??= {}; globalThis.process.env ??= {};
import { v as validateGoalId, a as validateGoalContributionId, b as validateUpdateGoalContributionCommand, s as sanitizeUpdateGoalContributionCommand, G as GoalContributionsService } from '../../../../../chunks/goal-contributions.service_CY7nkhSe.mjs';
import { r as requireAuth } from '../../../../../chunks/api-helpers_gexHC0qf.mjs';
export { r as renderers } from '../../../../../chunks/_@astro-renderers_B70jUmW-.mjs';

const PUT = async (context) => {
  try {
    const authResult = await requireAuth(context);
    if (authResult instanceof Response) return authResult;
    const { user } = authResult;
    const { goal_id, id } = context.params;
    if (!goal_id) {
      return new Response(JSON.stringify({ message: "ID celu jest wymagane" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!id) {
      return new Response(JSON.stringify({ message: "ID wpłaty jest wymagane" }), {
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
    const contributionIdValidation = validateGoalContributionId(id);
    if (!contributionIdValidation.isValid) {
      return new Response(JSON.stringify({ message: contributionIdValidation.errors.join(", ") }), {
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
    const validation = validateUpdateGoalContributionCommand(requestBody);
    if (!validation.isValid) {
      return new Response(JSON.stringify({ message: validation.errors.join(", ") }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const command = sanitizeUpdateGoalContributionCommand(requestBody);
    if (!command) {
      return new Response(JSON.stringify({ message: "Błąd podczas przetwarzania danych wejściowych" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const goalContributionsService = new GoalContributionsService(context.locals.supabase);
    const updatedContribution = await goalContributionsService.update(id, goal_id, command, user.id);
    return new Response(JSON.stringify(updatedContribution), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Błąd podczas aktualizacji wpłaty:", error);
    if (error instanceof Error) {
      if (error.message.includes("nie istnieje") || error.message.includes("nie należy")) {
        return new Response(JSON.stringify({ message: "Wpłata nie została znaleziona" }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    return new Response(
      JSON.stringify({ message: "Wystąpił błąd serwera podczas aktualizacji wpłaty" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
};
const DELETE = async (context) => {
  try {
    const authResult = await requireAuth(context);
    if (authResult instanceof Response) return authResult;
    const { user } = authResult;
    const { goal_id, id } = context.params;
    if (!goal_id) {
      return new Response(JSON.stringify({ message: "ID celu jest wymagane" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!id) {
      return new Response(JSON.stringify({ message: "ID wpłaty jest wymagane" }), {
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
    const contributionIdValidation = validateGoalContributionId(id);
    if (!contributionIdValidation.isValid) {
      return new Response(JSON.stringify({ message: contributionIdValidation.errors.join(", ") }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const goalContributionsService = new GoalContributionsService(context.locals.supabase);
    await goalContributionsService.delete(id, goal_id, user.id);
    return new Response(JSON.stringify({ message: "Wpłata została usunięta" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Błąd podczas usuwania wpłaty:", error);
    if (error instanceof Error) {
      if (error.message.includes("nie istnieje") || error.message.includes("nie należy")) {
        return new Response(JSON.stringify({ message: "Wpłata nie została znaleziona" }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    return new Response(JSON.stringify({ message: "Wystąpił błąd serwera podczas usuwania wpłaty" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  PUT
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
