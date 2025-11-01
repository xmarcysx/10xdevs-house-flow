import type { APIRoute } from "astro";
import {
  sanitizeUpdateIncomeCommand,
  validateIncomeId,
  validateUpdateIncomeCommand,
} from "../../../lib/validation/incomes.validation";
import { IncomesService } from "../../../services/incomes.service";
import type { MessageDTO } from "../../../types";

/**
 * PUT /api/incomes/{id}
 * Aktualizuje istniejący wpływ dla uwierzytelnionego użytkownika
 */
export const PUT: APIRoute = async (context) => {
  try {
    // Pobierz ID wpływu z parametrów ścieżki
    const { id } = context.params;

    // Sprawdź czy ID wpływu zostało podane
    if (!id) {
      return new Response(JSON.stringify({ message: "ID wpływu jest wymagane" } as MessageDTO), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Walidacja ID wpływu
    const idValidation = validateIncomeId(id);
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
    const validation = validateUpdateIncomeCommand(requestBody);
    if (!validation.isValid) {
      return new Response(JSON.stringify({ message: validation.errors.join(", ") } as MessageDTO), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Sanityzacja danych
    const command = sanitizeUpdateIncomeCommand(requestBody);
    if (!command) {
      return new Response(JSON.stringify({ message: "Błąd podczas przetwarzania danych wejściowych" } as MessageDTO), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Utwórz instancję IncomesService
    const incomesService = new IncomesService(context.locals.supabase);

    // Aktualizuj wpływ używając domyślnego ID użytkownika
    const updatedIncome = await incomesService.update(id, command, context.locals.user.id);

    // Zwróć zaktualizowany wpływ z kodem 200
    return new Response(JSON.stringify(updatedIncome), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Błąd podczas aktualizacji wpływu:", error);

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
    return new Response(
      JSON.stringify({ message: "Wystąpił błąd serwera podczas aktualizacji wpływu" } as MessageDTO),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

/**
 * DELETE /api/incomes/{id}
 * Usuwa istniejący wpływ dla uwierzytelnionego użytkownika
 */
export const DELETE: APIRoute = async (context) => {
  try {
    // Pobierz ID wpływu z parametrów ścieżki
    const { id } = context.params;

    // Sprawdź czy ID wpływu zostało podane
    if (!id) {
      return new Response(JSON.stringify({ message: "ID wpływu jest wymagane" } as MessageDTO), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Walidacja ID wpływu
    const idValidation = validateIncomeId(id);
    if (!idValidation.isValid) {
      return new Response(JSON.stringify({ message: idValidation.errors.join(", ") } as MessageDTO), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Utwórz instancję IncomesService
    const incomesService = new IncomesService(context.locals.supabase);

    // Usuń wpływ używając domyślnego ID użytkownika
    await incomesService.delete(id, context.locals.user.id);

    // Zwróć komunikat potwierdzający usunięcie z kodem 200
    return new Response(JSON.stringify({ message: "Wydatek usunięty" } as MessageDTO), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Błąd podczas usuwania wpływu:", error);

    // Obsługa specyficznych błędów biznesowych
    if (error instanceof Error) {
      if (error.message.includes("nie istnieje lub nie należy do użytkownika")) {
        return new Response(JSON.stringify({ message: "Wpływ nie został znaleziony" } as MessageDTO), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Ogólny błąd serwera
    return new Response(JSON.stringify({ message: "Wystąpił błąd serwera podczas usuwania wpływu" } as MessageDTO), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
