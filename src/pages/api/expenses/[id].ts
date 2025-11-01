import type { APIRoute } from "astro";
import {
  sanitizeUpdateExpenseCommand,
  validateExpenseId,
  validateUpdateExpenseCommand,
} from "../../../lib/validation/expenses.validation";
import { ExpensesService } from "../../../services/expenses.service";
import type { MessageDTO } from "../../../types";

/**
 * PUT /api/expenses/{id}
 * Aktualizuje istniejący wydatek dla uwierzytelnionego użytkownika
 */
export const PUT: APIRoute = async (context) => {
  try {
    // Pobierz ID wydatku z parametrów ścieżki
    const { id } = context.params;

    // Sprawdź czy ID wydatku zostało podane
    if (!id) {
      return new Response(JSON.stringify({ message: "ID wydatku jest wymagane" } as MessageDTO), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Walidacja ID wydatku
    const idValidation = validateExpenseId(id);
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
    const validation = validateUpdateExpenseCommand(requestBody);
    if (!validation.isValid) {
      return new Response(JSON.stringify({ message: validation.errors.join(", ") } as MessageDTO), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Sanityzacja danych
    const command = sanitizeUpdateExpenseCommand(requestBody);
    if (!command) {
      return new Response(JSON.stringify({ message: "Błąd podczas przetwarzania danych wejściowych" } as MessageDTO), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Utwórz instancję ExpensesService
    const expensesService = new ExpensesService(context.locals.supabase);

    // Aktualizuj wydatek używając domyślnego ID użytkownika
    const updatedExpense = await expensesService.update(id, command, context.locals.user.id);

    // Zwróć zaktualizowany wydatek z kodem 200
    return new Response(JSON.stringify(updatedExpense), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Błąd podczas aktualizacji wydatku:", error);

    // Obsługa specyficznych błędów biznesowych
    if (error instanceof Error) {
      if (error.message.includes("nie istnieje lub nie należy do użytkownika")) {
        return new Response(JSON.stringify({ message: error.message } as MessageDTO), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      if (error.message.includes("Kategoria nie istnieje")) {
        return new Response(JSON.stringify({ message: error.message } as MessageDTO), {
          status: 422,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Ogólny błąd serwera
    return new Response(
      JSON.stringify({ message: "Wystąpił błąd serwera podczas aktualizacji wydatku" } as MessageDTO),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

/**
 * DELETE /api/expenses/{id}
 * Usuwa istniejący wydatek finansowy należący do uwierzytelnionego użytkownika.
 *
 * Endpoint sprawdza prawo własności wydatku przed wykonaniem operacji usunięcia
 * i zwraca potwierdzenie usunięcia. Operacja jest permanentna i nie może zostać cofnięta.
 *
 * @param context - Kontekst Astro zawierający parametry ścieżki i instancję Supabase
 * @returns Response z komunikatem potwierdzającym usunięcie lub błędem
 *
 * Kody odpowiedzi:
 * - 200 OK: Wydatek został pomyślnie usunięty
 *   Response: {"message": "Wydatek został usunięty"}
 * - 400 Bad Request: Nieprawidłowy format UUID w parametrze {id}
 *   Response: {"message": "ID wydatku musi być prawidłowym UUID"}
 * - 404 Not Found: Wydatek o podanym ID nie istnieje lub nie należy do użytkownika
 *   Response: {"message": "Wydatek nie został znaleziony"}
 * - 500 Internal Server Error: Błąd serwera podczas przetwarzania żądania
 *   Response: {"message": "Wystąpił błąd serwera podczas usuwania wydatku"}
 *
 * Parametry ścieżki:
 * - id: string - UUID wydatku do usunięcia (wymagany)
 *
 * Zabezpieczenia:
 * - Walidacja formatu UUID
 * - Sprawdzanie prawa własności wydatku przed usunięciem
 * - Row Level Security (RLS) na poziomie bazy danych
 * - Obsługa błędów biznesowych z odpowiednimi komunikatami
 */
export const DELETE: APIRoute = async (context) => {
  try {
    // Pobierz ID wydatku z parametrów ścieżki
    const { id } = context.params;

    // Sprawdź czy ID wydatku zostało podane
    if (!id) {
      return new Response(JSON.stringify({ message: "ID wydatku jest wymagane" } as MessageDTO), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Walidacja ID wydatku
    const idValidation = validateExpenseId(id);
    if (!idValidation.isValid) {
      return new Response(JSON.stringify({ message: idValidation.errors.join(", ") } as MessageDTO), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Utwórz instancję ExpensesService
    const expensesService = new ExpensesService(context.locals.supabase);

    // Usuń wydatek używając domyślnego ID użytkownika
    await expensesService.delete(id, context.locals.user.id);

    // Zwróć komunikat potwierdzający usunięcie z kodem 200
    return new Response(JSON.stringify({ message: "Wydatek został usunięty" } as MessageDTO), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Błąd podczas usuwania wydatku:", error);

    // Obsługa specyficznych błędów biznesowych
    if (error instanceof Error) {
      if (error.message.includes("nie istnieje lub nie należy do użytkownika")) {
        return new Response(JSON.stringify({ message: "Wydatek nie został znaleziony" } as MessageDTO), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Ogólny błąd serwera
    return new Response(JSON.stringify({ message: "Wystąpił błąd serwera podczas usuwania wydatku" } as MessageDTO), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
