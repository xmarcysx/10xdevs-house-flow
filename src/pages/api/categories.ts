import type { APIRoute } from "astro";
import { DEFAULT_USER_ID, supabaseClient } from "../../db/supabase.client";
import {
  sanitizeCreateCategoryCommand,
  validateCreateCategoryCommand,
} from "../../lib/validation/categories.validation";
import { CategoriesService } from "../../services/categories.service";
import type { MessageDTO } from "../../types";

/**
 * POST /api/categories
 * Tworzy nową kategorię dla uwierzytelnionego użytkownika
 */
export const POST: APIRoute = async (context) => {
  try {
    // Parsuj ciało żądania JSON
    let requestBody: unknown;
    try {
      requestBody = await context.request.json();
    } catch (error) {
      return new Response(JSON.stringify({ message: "Nieprawidłowe dane JSON w żądaniu" } as MessageDTO), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Walidacja danych wejściowych
    const validation = validateCreateCategoryCommand(requestBody);
    if (!validation.isValid) {
      return new Response(JSON.stringify({ message: validation.errors.join(", ") } as MessageDTO), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Sanityzacja danych
    const command = sanitizeCreateCategoryCommand(requestBody);
    if (!command) {
      return new Response(JSON.stringify({ message: "Błąd podczas przetwarzania danych wejściowych" } as MessageDTO), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Utwórz instancję CategoriesService
    const categoriesService = new CategoriesService(supabaseClient);

    // Utwórz kategorię używając domyślnego ID użytkownika
    const category = await categoriesService.create(command, DEFAULT_USER_ID);

    // Zwróć utworzoną kategorię z kodem 201
    return new Response(JSON.stringify(category), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Błąd podczas tworzenia kategorii:", error);

    // Obsługa specyficznych błędów biznesowych
    if (error instanceof Error) {
      if (error.message.includes("już istnieje")) {
        return new Response(JSON.stringify({ message: error.message } as MessageDTO), {
          status: 422,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Ogólny błąd serwera
    return new Response(
      JSON.stringify({ message: "Wystąpił błąd serwera podczas tworzenia kategorii" } as MessageDTO),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
