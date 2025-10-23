import type { APIRoute } from "astro";
import { DEFAULT_USER_ID } from "../../../db/supabase.client";
import {
  sanitizeCreateIncomeCommand,
  sanitizeGetIncomesQuery,
  validateCreateIncomeCommand,
  validateGetIncomesQuery,
} from "../../../lib/validation/incomes.validation";
import { IncomesService } from "../../../services/incomes.service";
import type { MessageDTO } from "../../../types";

/**
 * GET /api/incomes
 * Pobiera paginowaną listę wpływów dla uwierzytelnionego użytkownika
 */
export const GET: APIRoute = async (context) => {
  try {
    // Pobierz parametry query z URL
    const url = new URL(context.request.url);
    const queryParams = url.searchParams;

    // Walidacja parametrów query
    const validation = validateGetIncomesQuery(queryParams);
    if (!validation.isValid) {
      return new Response(JSON.stringify({ message: validation.errors.join(", ") } as MessageDTO), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Sanityzacja parametrów
    const query = sanitizeGetIncomesQuery(queryParams);

    // Utwórz instancję IncomesService
    const incomesService = new IncomesService(context.locals.supabase);

    // Pobierz wpływy używając domyślnego ID użytkownika
    const result = await incomesService.getIncomes(DEFAULT_USER_ID, query);

    // Zwróć wpływy z informacjami o paginacji
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Błąd podczas pobierania wpływów:", error);

    // Ogólny błąd serwera
    return new Response(JSON.stringify({ message: "Wystąpił błąd serwera podczas pobierania wpływów" } as MessageDTO), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

/**
 * POST /api/incomes
 * Tworzy nowy wpływ dla uwierzytelnionego użytkownika
 */
export const POST: APIRoute = async (context) => {
  try {
    // Parsuj ciało żądania JSON
    let requestBody: unknown;
    try {
      requestBody = await context.request.json();
    } catch {
      return new Response(JSON.stringify({ message: "Nieprawidłowe dane JSON w żądaniu" } as MessageDTO), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Walidacja danych wejściowych
    const validation = validateCreateIncomeCommand(requestBody);
    if (!validation.isValid) {
      return new Response(JSON.stringify({ message: validation.errors.join(", ") } as MessageDTO), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Sanityzacja danych
    const command = sanitizeCreateIncomeCommand(requestBody);
    if (!command) {
      return new Response(JSON.stringify({ message: "Błąd podczas przetwarzania danych wejściowych" } as MessageDTO), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Utwórz instancję IncomesService
    const incomesService = new IncomesService(context.locals.supabase);

    // Utwórz wpływ używając domyślnego ID użytkownika
    const income = await incomesService.create(command, DEFAULT_USER_ID);

    // Zwróć utworzony wpływ z kodem 201
    return new Response(JSON.stringify(income), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Błąd podczas tworzenia wpływu:", error);

    // Ogólny błąd serwera
    return new Response(JSON.stringify({ message: "Wystąpił błąd serwera podczas tworzenia wpływu" } as MessageDTO), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
