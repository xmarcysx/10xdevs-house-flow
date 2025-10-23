import type { APIRoute } from "astro";
import { DEFAULT_USER_ID } from "../../../../db/supabase.client";
import {
  sanitizeCreateGoalContributionCommand,
  sanitizeGetGoalContributionsQuery,
  validateCreateGoalContributionCommand,
  validateGetGoalContributionsQuery,
  validateGoalId,
} from "../../../../lib/validation/goal-contributions.validation";
import { GoalContributionsService } from "../../../../services/goal-contributions.service";
import type { MessageDTO } from "../../../../types";

/**
 * GET /api/goals/{goal_id}/contributions
 * Pobiera paginowaną listę wpłat dla konkretnego celu oszczędnościowego
 */
export const GET: APIRoute = async (context) => {
  try {
    // Pobierz goal_id z parametrów ścieżki
    const { goal_id } = context.params;

    // Sprawdź czy goal_id zostało podane
    if (!goal_id) {
      return new Response(JSON.stringify({ message: "ID celu jest wymagane" } as MessageDTO), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Walidacja goal_id
    const goalIdValidation = validateGoalId(goal_id);
    if (!goalIdValidation.isValid) {
      return new Response(JSON.stringify({ message: goalIdValidation.errors.join(", ") } as MessageDTO), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Pobierz parametry query z URL
    const url = new URL(context.request.url);
    const queryParams = url.searchParams;

    // Walidacja parametrów query
    const validation = validateGetGoalContributionsQuery(queryParams);
    if (!validation.isValid) {
      return new Response(JSON.stringify({ message: validation.errors.join(", ") } as MessageDTO), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Sanityzacja parametrów
    const query = sanitizeGetGoalContributionsQuery(queryParams);

    // Utwórz instancję GoalContributionsService
    const goalContributionsService = new GoalContributionsService(context.locals.supabase);

    // Pobierz wpłaty używając domyślnego ID użytkownika
    const result = await goalContributionsService.getGoalContributions(goal_id, DEFAULT_USER_ID, query);

    // Zwróć wpłaty z informacjami o paginacji
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Błąd podczas pobierania wpłat:", error);

    // Ogólny błąd serwera
    return new Response(JSON.stringify({ message: "Wystąpił błąd serwera podczas pobierania wpłat" } as MessageDTO), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

/**
 * POST /api/goals/{goal_id}/contributions
 * Tworzy nową wpłatę na konkretny cel oszczędnościowy
 */
export const POST: APIRoute = async (context) => {
  try {
    // Pobierz goal_id z parametrów ścieżki
    const { goal_id } = context.params;

    // Sprawdź czy goal_id zostało podane
    if (!goal_id) {
      return new Response(JSON.stringify({ message: "ID celu jest wymagane" } as MessageDTO), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Walidacja goal_id
    const goalIdValidation = validateGoalId(goal_id);
    if (!goalIdValidation.isValid) {
      return new Response(JSON.stringify({ message: goalIdValidation.errors.join(", ") } as MessageDTO), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

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
    const validation = validateCreateGoalContributionCommand(requestBody);
    if (!validation.isValid) {
      return new Response(JSON.stringify({ message: validation.errors.join(", ") } as MessageDTO), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Sanityzacja danych
    const command = sanitizeCreateGoalContributionCommand(requestBody);
    if (!command) {
      return new Response(JSON.stringify({ message: "Błąd podczas przetwarzania danych wejściowych" } as MessageDTO), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Utwórz instancję GoalContributionsService
    const goalContributionsService = new GoalContributionsService(context.locals.supabase);

    // Utwórz wpłatę używając domyślnego ID użytkownika
    const contribution = await goalContributionsService.create(goal_id, command, DEFAULT_USER_ID);

    // Zwróć utworzoną wpłatę z kodem 201
    return new Response(JSON.stringify(contribution), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Błąd podczas tworzenia wpłaty:", error);

    // Obsługa specyficznych błędów biznesowych
    if (error instanceof Error) {
      if (error.message.includes("nie istnieje lub nie należy do użytkownika")) {
        return new Response(JSON.stringify({ message: error.message } as MessageDTO), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Ogólny błąd serwera
    return new Response(JSON.stringify({ message: "Wystąpił błąd serwera podczas tworzenia wpłaty" } as MessageDTO), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
