import type { APIRoute } from "astro";
import { ReportsService } from "../../../services/reports.service";
import type { MessageDTO } from "../../../types";

/**
 * GET /api/reports/goals
 * Pobiera raport celów oszczędnościowych dla uwierzytelnionego użytkownika
 */
export const GET: APIRoute = async (context) => {
  try {
    // Utwórz instancję ReportsService
    const reportsService = new ReportsService(context.locals.supabase);

    // Pobierz raport celów używając ID aktualnie zalogowanego użytkownika
    const report = await reportsService.getGoalsReport(context.locals.user.id);

    // Zwróć raport z kodem 200
    return new Response(JSON.stringify(report), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Błąd podczas pobierania raportu celów:", error);

    // Ogólny błąd serwera
    return new Response(
      JSON.stringify({ message: "Wystąpił błąd serwera podczas pobierania raportu celów" } as MessageDTO),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
