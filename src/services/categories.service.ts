import type { Database } from "../db/database.types";
import type { SupabaseClient } from "../db/supabase.client";
import type { GetCategoriesQuery } from "../lib/validation/categories.validation";
import type {
  CategoryDTO,
  CreateCategoryCommand,
  PaginationDTO,
  UpdateCategoryCommand,
  UpdateCategoryDTO,
} from "../types";

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

  /**
   * Pobiera paginowaną listę kategorii dla uwierzytelnionego użytkownika
   * @param userId ID użytkownika
   * @param query Parametry zapytania zawierające page, limit i sort
   * @returns Obiekt zawierający dane kategorii i informacje o paginacji
   */
  async getCategories(
    userId: string,
    query: GetCategoriesQuery
  ): Promise<{ data: CategoryDTO[]; pagination: PaginationDTO }> {
    const { page, limit, sort } = query;

    // Oblicz offset dla paginacji
    const offset = (page - 1) * limit;

    // Parsowanie parametru sortowania
    const [sortField, sortDirection] = sort.split(" ");

    // Zapytanie pobierające kategorie z paginacją i sortowaniem
    const { data: categories, error: dataError } = await this.supabase
      .from("categories")
      .select("id, name, is_default, created_at")
      .eq("user_id", userId)
      .order(sortField, { ascending: sortDirection === "ASC" })
      .range(offset, offset + limit - 1);

    if (dataError) {
      throw new Error(`Błąd podczas pobierania kategorii: ${dataError.message}`);
    }

    // Zapytanie pobierające całkowitą liczbę kategorii dla paginacji
    const { count, error: countError } = await this.supabase
      .from("categories")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (countError) {
      throw new Error(`Błąd podczas liczenia kategorii: ${countError.message}`);
    }

    const total = count || 0;

    // Przygotowanie obiektu paginacji
    const pagination: PaginationDTO = {
      page,
      limit,
      total,
    };

    return {
      data: categories || [],
      pagination,
    };
  }

  /**
   * Aktualizuje istniejącą kategorię dla uwierzytelnionego użytkownika
   * @param categoryId ID kategorii do aktualizacji
   * @param command Dane kategorii do aktualizacji
   * @param userId ID użytkownika
   * @returns Zaktualizowana kategoria
   * @throws Error gdy kategoria nie istnieje, nie należy do użytkownika lub nazwa już istnieje
   */
  async update(categoryId: string, command: UpdateCategoryCommand, userId: string): Promise<UpdateCategoryDTO> {
    // Sprawdź czy kategoria istnieje i należy do użytkownika
    const belongsToUser = await this.belongsToUser(categoryId, userId);
    if (!belongsToUser) {
      throw new Error("Kategoria nie istnieje lub nie należy do użytkownika");
    }

    // Sprawdź czy nowa nazwa kategorii już istnieje dla użytkownika (z wykluczeniem aktualnej kategorii)
    const { data: existingCategory, error: checkError } = await this.supabase
      .from("categories")
      .select("id")
      .eq("user_id", userId)
      .eq("name", command.name)
      .neq("id", categoryId)
      .maybeSingle();

    if (checkError) {
      throw new Error(`Błąd podczas sprawdzania unikalności kategorii: ${checkError.message}`);
    }

    if (existingCategory) {
      throw new Error("Kategoria o podanej nazwie już istnieje");
    }

    // Aktualizuj kategorię
    const { data: updatedCategory, error: updateError } = await this.supabase
      .from("categories")
      .update({
        name: command.name,
        updated_at: new Date().toISOString(),
      })
      .eq("id", categoryId)
      .eq("user_id", userId)
      .select("id, name, is_default, updated_at")
      .single();

    if (updateError) {
      throw new Error(`Błąd podczas aktualizacji kategorii: ${updateError.message}`);
    }

    if (!updatedCategory) {
      throw new Error("Nie udało się zaktualizować kategorii");
    }

    return updatedCategory;
  }

  /**
   * Usuwa istniejącą kategorię dla uwierzytelnionego użytkownika
   * @param categoryId ID kategorii do usunięcia
   * @param userId ID użytkownika
   * @throws Error gdy kategoria nie istnieje, nie należy do użytkownika lub jest domyślna
   */
  async delete(categoryId: string, userId: string): Promise<void> {
    // Sprawdź czy kategoria istnieje i należy do użytkownika
    const belongsToUser = await this.belongsToUser(categoryId, userId);
    if (!belongsToUser) {
      throw new Error("Kategoria nie istnieje lub nie należy do użytkownika");
    }

    // Sprawdź czy kategoria nie jest domyślna
    const { data: category, error: checkError } = await this.supabase
      .from("categories")
      .select("is_default")
      .eq("id", categoryId)
      .eq("user_id", userId)
      .single();

    if (checkError) {
      throw new Error(`Błąd podczas sprawdzania typu kategorii: ${checkError.message}`);
    }

    if (category?.is_default) {
      throw new Error("Nie można usunąć domyślnej kategorii");
    }

    // Usuń kategorię
    const { error: deleteError } = await this.supabase
      .from("categories")
      .delete()
      .eq("id", categoryId)
      .eq("user_id", userId);

    if (deleteError) {
      throw new Error(`Błąd podczas usuwania kategorii: ${deleteError.message}`);
    }
  }
}
