globalThis.process ??= {}; globalThis.process.env ??= {};
import { v as validateIncomeId, a as validateUpdateIncomeCommand, s as sanitizeUpdateIncomeCommand, I as IncomesService } from '../../../chunks/incomes.service_D1Qr8tjl.mjs';
import { r as requireAuth } from '../../../chunks/api-helpers_gexHC0qf.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_JyCnA0Wd.mjs';

const PUT = async (context) => {
  try {
    const authResult = await requireAuth(context);
    if (authResult instanceof Response) return authResult;
    const { user } = authResult;
    const { id } = context.params;
    if (!id) {
      return new Response(JSON.stringify({ message: "ID wpływu jest wymagane" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const idValidation = validateIncomeId(id);
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
    const validation = validateUpdateIncomeCommand(requestBody);
    if (!validation.isValid) {
      return new Response(JSON.stringify({ message: validation.errors.join(", ") }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const command = sanitizeUpdateIncomeCommand(requestBody);
    if (!command) {
      return new Response(JSON.stringify({ message: "Błąd podczas przetwarzania danych wejściowych" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const incomesService = new IncomesService(context.locals.supabase);
    const updatedIncome = await incomesService.update(id, command, user.id);
    return new Response(JSON.stringify(updatedIncome), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Błąd podczas aktualizacji wpływu:", error);
    if (error instanceof Error) {
      if (error.message.includes("nie istnieje lub nie należy do użytkownika")) {
        return new Response(JSON.stringify({ message: error.message }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    return new Response(
      JSON.stringify({ message: "Wystąpił błąd serwera podczas aktualizacji wpływu" }),
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
    const { id } = context.params;
    if (!id) {
      return new Response(JSON.stringify({ message: "ID wpływu jest wymagane" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const idValidation = validateIncomeId(id);
    if (!idValidation.isValid) {
      return new Response(JSON.stringify({ message: idValidation.errors.join(", ") }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const incomesService = new IncomesService(context.locals.supabase);
    await incomesService.delete(id, user.id);
    return new Response(JSON.stringify({ message: "Wydatek usunięty" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Błąd podczas usuwania wpływu:", error);
    if (error instanceof Error) {
      if (error.message.includes("nie istnieje lub nie należy do użytkownika")) {
        return new Response(JSON.stringify({ message: "Wpływ nie został znaleziony" }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    return new Response(JSON.stringify({ message: "Wystąpił błąd serwera podczas usuwania wpływu" }), {
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
