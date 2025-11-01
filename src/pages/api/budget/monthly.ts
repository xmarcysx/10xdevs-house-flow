import type { APIRoute } from "astro";
import {
  sanitizeGetMonthlyBudgetQuery,
  validateGetMonthlyBudgetQuery,
} from "../../../lib/validation/budget.validation";
import { BudgetService } from "../../../services/budget.service";
import type { MessageDTO } from "../../../types";

/**
 * GET /api/budget/monthly
 * Pobiera miesięczne podsumowanie budżetu dla uwierzytelnionego użytkownika
 */
export const GET: APIRoute = async (context) => {
  try {
    // Pobierz parametry query z URL
    const url = new URL(context.request.url);
    const queryParams = url.searchParams;

    // Walidacja parametrów query
    const validation = validateGetMonthlyBudgetQuery(queryParams);
    if (!validation.isValid) {
      return new Response(JSON.stringify({ message: validation.errors.join(", ") } as MessageDTO), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Sanityzacja parametrów
    const query = sanitizeGetMonthlyBudgetQuery(queryParams);

    // Utwórz instancję BudgetService
    const budgetService = new BudgetService(context.locals.supabase);

    // Pobierz miesięczne podsumowanie budżetu używając ID aktualnie zalogowanego użytkownika
    const monthlyBudget = await budgetService.getMonthlyBudget(context.locals.user.id, query.month);

    // Zwróć podsumowanie budżetu
    return new Response(JSON.stringify(monthlyBudget), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Błąd podczas pobierania miesięcznego budżetu:", error);

    // Ogólny błąd serwera
    return new Response(
      JSON.stringify({ message: "Wystąpił błąd serwera podczas pobierania miesięcznego budżetu" } as MessageDTO),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

// Wyłącz prerendering dla tego endpointu API
export const prerender = false;
