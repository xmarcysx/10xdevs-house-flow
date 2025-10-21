import type { Database } from "../db/database.types";
import type { SupabaseClient } from "../db/supabase.client";
import type { CategoryDTO, CreateCategoryCommand } from "../types";

export class CategoriesService {
  constructor(private supabase: SupabaseClient<Database>) {}

  /**
   * Tworzy nową kategorię dla uwierzytelnionego użytkownika
   * @param command Dane kategorii do utworzenia
   * @param userId ID użytkownika
   * @returns Utworzona kategoria
   * @throws Error gdy nazwa kategorii już istnieje dla użytkownika
   */
  async create(command: CreateCategoryCommand, userId: string): Promise<CategoryDTO> {
    // Sprawdź czy kategoria o podanej nazwie już istnieje dla użytkownika
    const { data: existingCategory, error: checkError } = await this.supabase
      .from("categories")
      .select("id")
      .eq("user_id", userId)
      .eq("name", command.name)
      .maybeSingle();

    if (checkError) {
      throw new Error(`Błąd podczas sprawdzania unikalności kategorii: ${checkError.message}`);
    }

    if (existingCategory) {
      throw new Error("Kategoria o podanej nazwie już istnieje");
    }

    // Utwórz nową kategorię
    const { data: newCategory, error: insertError } = await this.supabase
      .from("categories")
      .insert({
        name: command.name,
        user_id: userId,
        is_default: false, // Nowe kategorie są zawsze niestandardowe
      })
      .select("id, name, is_default, created_at")
      .single();

    if (insertError) {
      throw new Error(`Błąd podczas tworzenia kategorii: ${insertError.message}`);
    }

    if (!newCategory) {
      throw new Error("Nie udało się utworzyć kategorii");
    }

    return newCategory;
  }

  /**
   * Sprawdza czy kategoria należy do użytkownika
   * @param categoryId ID kategorii
   * @param userId ID użytkownika
   * @returns true jeśli kategoria należy do użytkownika
   */
  async belongsToUser(categoryId: string, userId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from("categories")
      .select("id")
      .eq("id", categoryId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      throw new Error(`Błąd podczas sprawdzania własności kategorii: ${error.message}`);
    }

    return !!data;
  }
}
