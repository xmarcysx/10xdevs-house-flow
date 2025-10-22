import type { APIRoute } from "astro";
import { DEFAULT_USER_ID } from "../../../db/supabase.client";
import {
  sanitizeUpdateCategoryCommand,
  validateCategoryId,
  validateUpdateCategoryCommand,
} from "../../../lib/validation/categories.validation";
import { CategoriesService } from "../../../services/categories.service";
import type { MessageDTO } from "../../../types";

/**
 * PUT /api/categories/{id}
 * Aktualizuje nazwę istniejącej kategorii dla uwierzytelnionego użytkownika
 */
export const PUT: APIRoute = async (context) => {
  try {
    // Pobierz ID kategorii z parametrów ścieżki
    const { id } = context.params;

    // Sprawdź czy ID kategorii zostało podane
    if (!id) {
      return new Response(JSON.stringify({ message: "ID kategorii jest wymagane" } as MessageDTO), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Walidacja ID kategorii
    const idValidation = validateCategoryId(id);
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
    const validation = validateUpdateCategoryCommand(requestBody);
    if (!validation.isValid) {
      return new Response(JSON.stringify({ message: validation.errors.join(", ") } as MessageDTO), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Sanityzacja danych
    const command = sanitizeUpdateCategoryCommand(requestBody);
    if (!command) {
      return new Response(JSON.stringify({ message: "Błąd podczas przetwarzania danych wejściowych" } as MessageDTO), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Utwórz instancję CategoriesService
    const categoriesService = new CategoriesService(context.locals.supabase);

    // Aktualizuj kategorię używając domyślnego ID użytkownika
    const updatedCategory = await categoriesService.update(id, command, DEFAULT_USER_ID);

    // Zwróć zaktualizowaną kategorię z kodem 200
    return new Response(JSON.stringify(updatedCategory), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Błąd podczas aktualizacji kategorii:", error);

    // Obsługa specyficznych błędów biznesowych
    if (error instanceof Error) {
      if (error.message.includes("nie istnieje lub nie należy do użytkownika")) {
        return new Response(JSON.stringify({ message: error.message } as MessageDTO), {
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
    }

    // Ogólny błąd serwera
    return new Response(
      JSON.stringify({ message: "Wystąpił błąd serwera podczas aktualizacji kategorii" } as MessageDTO),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
