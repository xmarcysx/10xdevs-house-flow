import type { APIRoute } from "astro";
import {
  sanitizeUpdateGoalContributionCommand,
  validateGoalContributionId,
  validateGoalId,
  validateUpdateGoalContributionCommand,
} from "../../../../../lib/validation/goal-contributions.validation";
import { GoalContributionsService } from "../../../../../services/goal-contributions.service";
import type { MessageDTO } from "../../../../../types";

/**
 * PUT /api/goals/{goal_id}/contributions/{id}
 * Aktualizuje istniejącą wpłatę na cel oszczędnościowy
 */
export const PUT: APIRoute = async (context) => {
  try {
    // Pobierz goal_id i id z parametrów ścieżki
    const { goal_id, id } = context.params;

    // Sprawdź czy goal_id zostało podane
    if (!goal_id) {
      return new Response(JSON.stringify({ message: "ID celu jest wymagane" } as MessageDTO), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Sprawdź czy id zostało podane
    if (!id) {
      return new Response(JSON.stringify({ message: "ID wpłaty jest wymagane" } as MessageDTO), {
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

    // Walidacja id wpłaty
    const contributionIdValidation = validateGoalContributionId(id);
    if (!contributionIdValidation.isValid) {
      return new Response(JSON.stringify({ message: contributionIdValidation.errors.join(", ") } as MessageDTO), {
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
    const validation = validateUpdateGoalContributionCommand(requestBody);
    if (!validation.isValid) {
      return new Response(JSON.stringify({ message: validation.errors.join(", ") } as MessageDTO), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Sanityzacja danych
    const command = sanitizeUpdateGoalContributionCommand(requestBody);
    if (!command) {
      return new Response(JSON.stringify({ message: "Błąd podczas przetwarzania danych wejściowych" } as MessageDTO), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Utwórz instancję GoalContributionsService
    const goalContributionsService = new GoalContributionsService(context.locals.supabase);

    // Aktualizuj wpłatę używając domyślnego ID użytkownika
    const updatedContribution = await goalContributionsService.update(id, goal_id, command, context.locals.user.id);

    // Zwróć zaktualizowaną wpłatę z kodem 200
    return new Response(JSON.stringify(updatedContribution), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Błąd podczas aktualizacji wpłaty:", error);

    // Obsługa specyficznych błędów biznesowych
    if (error instanceof Error) {
      if (error.message.includes("nie istnieje") || error.message.includes("nie należy")) {
        return new Response(JSON.stringify({ message: "Wpłata nie została znaleziona" } as MessageDTO), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Ogólny błąd serwera
    return new Response(
      JSON.stringify({ message: "Wystąpił błąd serwera podczas aktualizacji wpłaty" } as MessageDTO),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

/**
 * DELETE /api/goals/{goal_id}/contributions/{id}
 * Usuwa istniejącą wpłatę z celu oszczędnościowego
 */
export const DELETE: APIRoute = async (context) => {
  try {
    // Pobierz goal_id i id z parametrów ścieżki
    const { goal_id, id } = context.params;

    // Sprawdź czy goal_id zostało podane
    if (!goal_id) {
      return new Response(JSON.stringify({ message: "ID celu jest wymagane" } as MessageDTO), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Sprawdź czy id zostało podane
    if (!id) {
      return new Response(JSON.stringify({ message: "ID wpłaty jest wymagane" } as MessageDTO), {
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

    // Walidacja id wpłaty
    const contributionIdValidation = validateGoalContributionId(id);
    if (!contributionIdValidation.isValid) {
      return new Response(JSON.stringify({ message: contributionIdValidation.errors.join(", ") } as MessageDTO), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Utwórz instancję GoalContributionsService
    const goalContributionsService = new GoalContributionsService(context.locals.supabase);

    // Usuń wpłatę używając domyślnego ID użytkownika
    await goalContributionsService.delete(id, goal_id, context.locals.user.id);

    // Zwróć komunikat potwierdzający usunięcie z kodem 200
    return new Response(JSON.stringify({ message: "Wpłata została usunięta" } as MessageDTO), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Błąd podczas usuwania wpłaty:", error);

    // Obsługa specyficznych błędów biznesowych
    if (error instanceof Error) {
      if (error.message.includes("nie istnieje") || error.message.includes("nie należy")) {
        return new Response(JSON.stringify({ message: "Wpłata nie została znaleziona" } as MessageDTO), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Ogólny błąd serwera
    return new Response(JSON.stringify({ message: "Wystąpił błąd serwera podczas usuwania wpłaty" } as MessageDTO), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
