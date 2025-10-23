import type { APIRoute } from "astro";
import { DEFAULT_USER_ID } from "../../../db/supabase.client";
import {
  sanitizeUpdateGoalCommand,
  validateGoalId,
  validateUpdateGoalCommand,
} from "../../../lib/validation/goals.validation";
import { GoalsService } from "../../../services/goals.service";
import type { MessageDTO } from "../../../types";

/**
 * PUT /api/goals/{id}
 * Aktualizuje istniejący cel oszczędnościowy dla uwierzytelnionego użytkownika
 */
export const PUT: APIRoute = async (context) => {
  try {
    // Pobierz ID celu z parametrów ścieżki
    const { id } = context.params;

    // Sprawdź czy ID celu zostało podane
    if (!id) {
      return new Response(JSON.stringify({ message: "ID celu jest wymagane" } as MessageDTO), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Walidacja ID celu
    const idValidation = validateGoalId(id);
    if (!idValidation.isValid) {
      return new Response(JSON.stringify({ message: idValidation.errors.join(", ") } as MessageDTO), {
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
    const validation = validateUpdateGoalCommand(requestBody);
    if (!validation.isValid) {
      return new Response(JSON.stringify({ message: validation.errors.join(", ") } as MessageDTO), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Sanityzacja danych
    const command = sanitizeUpdateGoalCommand(requestBody);
    if (!command) {
      return new Response(JSON.stringify({ message: "Błąd podczas przetwarzania danych wejściowych" } as MessageDTO), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Utwórz instancję GoalsService
    const goalsService = new GoalsService(context.locals.supabase);

    // Aktualizuj cel używając domyślnego ID użytkownika
    const updatedGoal = await goalsService.update(id, command, DEFAULT_USER_ID);

    // Zwróć zaktualizowany cel z kodem 200
    return new Response(JSON.stringify(updatedGoal), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Błąd podczas aktualizacji celu:", error);

    // Obsługa specyficznych błędów biznesowych
    if (error instanceof Error) {
      if (error.message.includes("nie istnieje lub nie należy do użytkownika")) {
        return new Response(JSON.stringify({ message: "Cel nie został znaleziony" } as MessageDTO), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

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
    return new Response(JSON.stringify({ message: "Wystąpił błąd serwera podczas aktualizacji celu" } as MessageDTO), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

/**
 * DELETE /api/goals/{id}
 * Usuwa istniejący cel oszczędnościowy dla uwierzytelnionego użytkownika
 */
export const DELETE: APIRoute = async (context) => {
  try {
    // Pobierz ID celu z parametrów ścieżki
    const { id } = context.params;

    // Sprawdź czy ID celu zostało podane
    if (!id) {
      return new Response(JSON.stringify({ message: "ID celu jest wymagane" } as MessageDTO), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Walidacja ID celu
    const idValidation = validateGoalId(id);
    if (!idValidation.isValid) {
      return new Response(JSON.stringify({ message: idValidation.errors.join(", ") } as MessageDTO), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Utwórz instancję GoalsService
    const goalsService = new GoalsService(context.locals.supabase);

    // Usuń cel używając domyślnego ID użytkownika
    await goalsService.delete(id, DEFAULT_USER_ID);

    // Zwróć komunikat potwierdzający usunięcie z kodem 200
    return new Response(JSON.stringify({ message: "Cel został usunięty" } as MessageDTO), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Błąd podczas usuwania celu:", error);

    // Obsługa specyficznych błędów biznesowych
    if (error instanceof Error) {
      if (error.message.includes("nie istnieje lub nie należy do użytkownika")) {
        return new Response(JSON.stringify({ message: "Cel nie został znaleziony" } as MessageDTO), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Ogólny błąd serwera
    return new Response(JSON.stringify({ message: "Wystąpił błąd serwera podczas usuwania celu" } as MessageDTO), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
