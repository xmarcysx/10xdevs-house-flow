import type { APIRoute } from "astro";
import {
  sanitizeCreateGoalCommand,
  sanitizeGetGoalsQuery,
  validateCreateGoalCommand,
  validateGetGoalsQuery,
} from "../../lib/validation/goals.validation";
import { GoalsService } from "../../services/goals.service";
import type { MessageDTO } from "../../types";

/**
 * GET /api/goals
 * Pobiera paginowaną listę celów oszczędnościowych dla uwierzytelnionego użytkownika
 */
export const GET: APIRoute = async (context) => {
  try {
    // Pobierz parametry query z URL
    const url = new URL(context.request.url);
    const queryParams = url.searchParams;

    // Walidacja parametrów query
    const validation = validateGetGoalsQuery(queryParams);
    if (!validation.isValid) {
      return new Response(JSON.stringify({ message: validation.errors.join(", ") } as MessageDTO), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Sanityzacja parametrów
    const query = sanitizeGetGoalsQuery(queryParams);

    // Utwórz instancję GoalsService
    const goalsService = new GoalsService(context.locals.supabase);

    // Pobierz cele używając ID aktualnie zalogowanego użytkownika
    const result = await goalsService.getGoals(context.locals.user.id, query);

    // Zwróć cele z informacjami o paginacji
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Błąd podczas pobierania celów:", error);

    // Ogólny błąd serwera
    return new Response(JSON.stringify({ message: "Wystąpił błąd serwera podczas pobierania celów" } as MessageDTO), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

/**
 * POST /api/goals
 * Tworzy nowy cel oszczędnościowy dla uwierzytelnionego użytkownika
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
    const validation = validateCreateGoalCommand(requestBody);
    if (!validation.isValid) {
      return new Response(JSON.stringify({ message: validation.errors.join(", ") } as MessageDTO), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Sanityzacja danych
    const command = sanitizeCreateGoalCommand(requestBody);
    if (!command) {
      return new Response(JSON.stringify({ message: "Błąd podczas przetwarzania danych wejściowych" } as MessageDTO), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Utwórz instancję GoalsService
    const goalsService = new GoalsService(context.locals.supabase);

    // Utwórz cel używając ID aktualnie zalogowanego użytkownika
    const goal = await goalsService.create(command, context.locals.user.id);

    // Zwróć utworzony cel z kodem 201
    return new Response(JSON.stringify(goal), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Błąd podczas tworzenia celu:", error);

    // Obsługa specyficznych błędów biznesowych
    if (error instanceof Error) {
      if (error.message.includes("już istnieje")) {
        return new Response(JSON.stringify({ message: error.message } as MessageDTO), {
          status: 422,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (error.message.includes("większa od zera")) {
        return new Response(JSON.stringify({ message: error.message } as MessageDTO), {
          status: 422,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Ogólny błąd serwera
    return new Response(JSON.stringify({ message: "Wystąpił błąd serwera podczas tworzenia celu" } as MessageDTO), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
