globalThis.process ??= {}; globalThis.process.env ??= {};
import { v as validateExpenseId, a as validateUpdateExpenseCommand, s as sanitizeUpdateExpenseCommand, E as ExpensesService } from '../../../chunks/expenses.service_P9B9d-Bs.mjs';
import { r as requireAuth } from '../../../chunks/api-helpers_gexHC0qf.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_JyCnA0Wd.mjs';

const PUT = async (context) => {
  try {
    const authResult = await requireAuth(context);
    if (authResult instanceof Response) return authResult;
    const { user } = authResult;
    const { id } = context.params;
    if (!id) {
      return new Response(JSON.stringify({ message: "ID wydatku jest wymagane" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const idValidation = validateExpenseId(id);
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
    const validation = validateUpdateExpenseCommand(requestBody);
    if (!validation.isValid) {
      return new Response(JSON.stringify({ message: validation.errors.join(", ") }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const command = sanitizeUpdateExpenseCommand(requestBody);
    if (!command) {
      return new Response(JSON.stringify({ message: "Błąd podczas przetwarzania danych wejściowych" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const expensesService = new ExpensesService(context.locals.supabase);
    const updatedExpense = await expensesService.update(id, command, user.id);
    return new Response(JSON.stringify(updatedExpense), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Błąd podczas aktualizacji wydatku:", error);
    if (error instanceof Error) {
      if (error.message.includes("nie istnieje lub nie należy do użytkownika")) {
        return new Response(JSON.stringify({ message: error.message }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }
      if (error.message.includes("Kategoria nie istnieje")) {
        return new Response(JSON.stringify({ message: error.message }), {
          status: 422,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    return new Response(
      JSON.stringify({ message: "Wystąpił błąd serwera podczas aktualizacji wydatku" }),
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
      return new Response(JSON.stringify({ message: "ID wydatku jest wymagane" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const idValidation = validateExpenseId(id);
    if (!idValidation.isValid) {
      return new Response(JSON.stringify({ message: idValidation.errors.join(", ") }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const expensesService = new ExpensesService(context.locals.supabase);
    await expensesService.delete(id, user.id);
    return new Response(JSON.stringify({ message: "Wydatek został usunięty" }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Błąd podczas usuwania wydatku:", error);
    if (error instanceof Error) {
      if (error.message.includes("nie istnieje lub nie należy do użytkownika")) {
        return new Response(JSON.stringify({ message: "Wydatek nie został znaleziony" }), {
          status: 404,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    return new Response(JSON.stringify({ message: "Wystąpił błąd serwera podczas usuwania wydatku" }), {
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
