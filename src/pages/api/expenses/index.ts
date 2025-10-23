import type { APIRoute } from "astro";
import { DEFAULT_USER_ID } from "../../../db/supabase.client";
import {
  sanitizeCreateExpenseCommand,
  sanitizeGetExpensesQuery,
  validateCreateExpenseCommand,
  validateGetExpensesQuery,
} from "../../../lib/validation/expenses.validation";
import { ExpensesService } from "../../../services/expenses.service";
import type { MessageDTO } from "../../../types";

/**
 * GET /api/expenses
 * Pobiera paginowaną listę wydatków dla uwierzytelnionego użytkownika
 */
export const GET: APIRoute = async (context) => {
  try {
    // Pobierz parametry query z URL
    const url = new URL(context.request.url);
    const queryParams = url.searchParams;

    // Walidacja parametrów query
    const validation = validateGetExpensesQuery(queryParams);
    if (!validation.isValid) {
      return new Response(JSON.stringify({ message: validation.errors.join(", ") } as MessageDTO), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Sanityzacja parametrów
    const query = sanitizeGetExpensesQuery(queryParams);

    // Utwórz instancję ExpensesService
    const expensesService = new ExpensesService(context.locals.supabase);

    // Pobierz wydatki używając domyślnego ID użytkownika
    const result = await expensesService.getExpenses(DEFAULT_USER_ID, query);

    // Zwróć wydatki z informacjami o paginacji
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Błąd podczas pobierania wydatków:", error);

    // Ogólny błąd serwera
    return new Response(
      JSON.stringify({ message: "Wystąpił błąd serwera podczas pobierania wydatków" } as MessageDTO),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

/**
 * POST /api/expenses
 * Tworzy nowy wydatek dla uwierzytelnionego użytkownika
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
    const validation = validateCreateExpenseCommand(requestBody);
    if (!validation.isValid) {
      return new Response(JSON.stringify({ message: validation.errors.join(", ") } as MessageDTO), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Sanityzacja danych
    const command = sanitizeCreateExpenseCommand(requestBody);
    if (!command) {
      return new Response(JSON.stringify({ message: "Błąd podczas przetwarzania danych wejściowych" } as MessageDTO), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Utwórz instancję ExpensesService
    const expensesService = new ExpensesService(context.locals.supabase);

    // Utwórz wydatek używając domyślnego ID użytkownika
    const expense = await expensesService.create(command, DEFAULT_USER_ID);

    // Zwróć utworzony wydatek z kodem 201
    return new Response(JSON.stringify(expense), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Błąd podczas tworzenia wydatku:", error);

    // Obsługa specyficznych błędów biznesowych
    if (error instanceof Error) {
      if (error.message.includes("Kategoria nie istnieje")) {
        return new Response(JSON.stringify({ message: error.message } as MessageDTO), {
          status: 422,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Ogólny błąd serwera
    return new Response(JSON.stringify({ message: "Wystąpił błąd serwera podczas tworzenia wydatku" } as MessageDTO), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
