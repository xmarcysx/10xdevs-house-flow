globalThis.process ??= {}; globalThis.process.env ??= {};
import { b as validateGetExpensesQuery, c as sanitizeGetExpensesQuery, E as ExpensesService, d as validateCreateExpenseCommand, e as sanitizeCreateExpenseCommand } from '../../chunks/expenses.service_P9B9d-Bs.mjs';
import { r as requireAuth } from '../../chunks/api-helpers_gexHC0qf.mjs';
export { r as renderers } from '../../chunks/_@astro-renderers_JyCnA0Wd.mjs';

const GET = async (context) => {
  try {
    const authResult = await requireAuth(context);
    if (authResult instanceof Response) return authResult;
    const { user } = authResult;
    const url = new URL(context.request.url);
    const queryParams = url.searchParams;
    const validation = validateGetExpensesQuery(queryParams);
    if (!validation.isValid) {
      return new Response(JSON.stringify({ message: validation.errors.join(", ") }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const query = sanitizeGetExpensesQuery(queryParams);
    const expensesService = new ExpensesService(context.locals.supabase);
    const result = await expensesService.getExpenses(user.id, query);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Błąd podczas pobierania wydatków:", error);
    return new Response(
      JSON.stringify({ message: "Wystąpił błąd serwera podczas pobierania wydatków" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
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
    const validation = validateCreateExpenseCommand(requestBody);
    if (!validation.isValid) {
      return new Response(JSON.stringify({ message: validation.errors.join(", ") }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const command = sanitizeCreateExpenseCommand(requestBody);
    if (!command) {
      return new Response(JSON.stringify({ message: "Błąd podczas przetwarzania danych wejściowych" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    const expensesService = new ExpensesService(context.locals.supabase);
    const expense = await expensesService.create(command, user.id);
    return new Response(JSON.stringify(expense), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Błąd podczas tworzenia wydatku:", error);
    if (error instanceof Error) {
      if (error.message.includes("Kategoria nie istnieje")) {
        return new Response(JSON.stringify({ message: error.message }), {
          status: 422,
          headers: { "Content-Type": "application/json" }
        });
      }
    }
    return new Response(JSON.stringify({ message: "Wystąpił błąd serwera podczas tworzenia wydatku" }), {
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
