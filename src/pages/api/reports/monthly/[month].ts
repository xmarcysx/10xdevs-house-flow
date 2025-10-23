import type { APIRoute } from "astro";
import { DEFAULT_USER_ID } from "../../../../db/supabase.client";
import { sanitizeMonthParameter, validateMonthParameter } from "../../../../lib/validation/reports.validation";
import { ReportsService } from "../../../../services/reports.service";
import type { MessageDTO } from "../../../../types";

/**
 * GET /api/reports/monthly/[month]
 * Pobiera miesięczny raport wydatków dla uwierzytelnionego użytkownika
 */
export const GET: APIRoute = async (context) => {
  try {
    // Pobierz parametr month z URL
    const { month } = context.params;

    if (!month) {
      return new Response(JSON.stringify({ message: "Parametr month jest wymagany" } as MessageDTO), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Walidacja parametru month
    const validation = validateMonthParameter(month);
    if (!validation.isValid) {
      return new Response(JSON.stringify({ message: validation.errors.join(", ") } as MessageDTO), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Sanityzacja parametru
    const sanitizedMonth = sanitizeMonthParameter(month);
    if (!sanitizedMonth) {
      return new Response(JSON.stringify({ message: "Błąd podczas przetwarzania parametru month" } as MessageDTO), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Utwórz instancję ReportsService
    const reportsService = new ReportsService(context.locals.supabase);

    // Pobierz miesięczny raport używając domyślnego ID użytkownika
    const report = await reportsService.getMonthlyReport(DEFAULT_USER_ID, sanitizedMonth);

    // Zwróć raport z kodem 200
    return new Response(JSON.stringify(report), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Błąd podczas pobierania miesięcznego raportu:", error);

    // Ogólny błąd serwera
    return new Response(
      JSON.stringify({ message: "Wystąpił błąd serwera podczas pobierania miesięcznego raportu" } as MessageDTO),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
