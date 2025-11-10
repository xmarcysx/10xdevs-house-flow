import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Database } from "../db/database.types";
import type { SupabaseClient } from "@supabase/supabase-js";
import { IncomesService } from "./incomes.service";
import type { CreateIncomeCommand, UpdateIncomeCommand, GetIncomesQuery } from "../types";

// Mock Supabase client
const createMockQuery = () => ({
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  gte: vi.fn().mockReturnThis(),
  lte: vi.fn().mockReturnThis(),
  order: vi.fn().mockReturnThis(),
  range: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  maybeSingle: vi.fn(),
  single: vi.fn(),
});

const mockSupabase = {
  from: vi.fn(() => createMockQuery()),
} as unknown as SupabaseClient<Database>;

describe("IncomesService", () => {
  let incomesService: IncomesService;

  beforeEach(() => {
    vi.clearAllMocks();
    incomesService = new IncomesService(mockSupabase);
  });

  describe("belongsToUser", () => {
    it("powinien zwrócić true gdy wpływ należy do użytkownika", async () => {
      const mockData = { id: "income-1" };
      const mockQuery = createMockQuery();
      mockSupabase.from.mockReturnValueOnce(mockQuery);
      mockQuery.maybeSingle.mockResolvedValueOnce({
        data: mockData,
        error: null,
      });

      const result = await incomesService.belongsToUser("income-1", "user-1");

      expect(result).toBe(true);
      expect(mockSupabase.from).toHaveBeenCalledWith("incomes");
    });

    it("powinien zwrócić false gdy wpływ nie należy do użytkownika", async () => {
      const mockQuery = createMockQuery();
      mockSupabase.from.mockReturnValueOnce(mockQuery);
      mockQuery.maybeSingle.mockResolvedValueOnce({
        data: null,
        error: null,
      });

      const result = await incomesService.belongsToUser("income-1", "user-1");

      expect(result).toBe(false);
    });

    it("powinien rzucić błąd gdy wystąpi błąd bazy danych", async () => {
      const mockError = new Error("Database error");
      const mockQuery = createMockQuery();
      mockSupabase.from.mockReturnValueOnce(mockQuery);
      mockQuery.maybeSingle.mockResolvedValueOnce({
        data: null,
        error: mockError,
      });

      await expect(incomesService.belongsToUser("income-1", "user-1")).rejects.toThrow(
        "Błąd podczas sprawdzania własności wpływu: Database error"
      );
    });
  });

  describe("create", () => {
    it("powinien utworzyć nowy wpływ i zwrócić go", async () => {
      const createCommand: CreateIncomeCommand = {
        amount: 1000,
        date: "2024-01-15",
        description: "Pensja",
        source: "Praca",
      };

      const mockCreatedIncome = {
        id: "income-1",
        amount: 1000,
        date: "2024-01-15",
        description: "Pensja",
        source: "Praca",
        created_at: "2024-01-15T10:00:00Z",
      };

      const mockQuery = createMockQuery();
      mockSupabase.from.mockReturnValueOnce(mockQuery);
      mockQuery.single.mockResolvedValueOnce({
        data: mockCreatedIncome,
        error: null,
      });

      const result = await incomesService.create(createCommand, "user-1");

      expect(result).toEqual(mockCreatedIncome);
      expect(mockSupabase.from).toHaveBeenCalledWith("incomes");
    });

    it("powinien rzucić błąd gdy tworzenie się nie powiedzie", async () => {
      const createCommand: CreateIncomeCommand = {
        amount: 1000,
        date: "2024-01-15",
        description: "Pensja",
      };

      const mockQuery = createMockQuery();
      mockSupabase.from.mockReturnValueOnce(mockQuery);
      mockQuery.single.mockResolvedValueOnce({
        data: null,
        error: new Error("Insert error"),
      });

      await expect(incomesService.create(createCommand, "user-1")).rejects.toThrow(
        "Błąd podczas tworzenia wpływu: Insert error"
      );
    });
  });

  describe("getIncomes", () => {
    it("powinien zwrócić paginowaną listę wpływów", async () => {
      const query: GetIncomesQuery = {
        page: 1,
        limit: 10,
        sort: "date DESC",
      };

      const mockIncomes = [
        {
          id: "income-1",
          amount: 1000,
          date: "2024-01-15",
          description: "Pensja",
          source: "Praca",
          created_at: "2024-01-15T10:00:00Z",
        },
      ];

      // Mock for data query
      const mockDataQuery = createMockQuery();
      mockSupabase.from.mockReturnValueOnce(mockDataQuery);
      mockDataQuery.range.mockResolvedValueOnce({
        data: mockIncomes,
        error: null,
      });

      // Mock for count query
      const mockCountQuery = createMockQuery();
      mockSupabase.from.mockReturnValueOnce(mockCountQuery);
      mockCountQuery.eq.mockResolvedValueOnce({
        data: null,
        error: null,
        count: 1,
      });

      const result = await incomesService.getIncomes("user-1", query);

      expect(result.data).toEqual(mockIncomes);
      expect(result.pagination).toEqual({
        page: 1,
        limit: 10,
        total: 1,
      });
    });

    it("powinien obsłużyć filtrowanie po roku", async () => {
      const query: GetIncomesQuery = {
        page: 1,
        limit: 10,
        year: 2024,
        sort: "date DESC",
      };

      // Mock for data query
      const mockDataQuery = createMockQuery();
      mockSupabase.from.mockReturnValueOnce(mockDataQuery);
      mockDataQuery.range.mockResolvedValueOnce({
        data: [],
        error: null,
      });

      // Mock for count query - needs to support gte/lte chaining
      const mockCountQuery = createMockQuery();
      mockSupabase.from.mockReturnValueOnce(mockCountQuery);
      // The count query gets chained with gte/lte, so we need to return the query itself
      mockCountQuery.gte.mockReturnValueOnce(mockCountQuery);
      mockCountQuery.lte.mockResolvedValueOnce({
        data: null,
        error: null,
        count: 0,
      });

      await incomesService.getIncomes("user-1", query);

      expect(mockSupabase.from).toHaveBeenCalledWith("incomes");
    });
  });

  describe("update", () => {
    it("powinien zaktualizować wpływ i zwrócić zaktualizowany obiekt", async () => {
      const updateCommand: UpdateIncomeCommand = {
        amount: 1500,
        description: "Podwyżka",
      };

      const mockUpdatedIncome = {
        id: "income-1",
        amount: 1500,
        date: "2024-01-15",
        description: "Podwyżka",
        source: "Praca",
        created_at: "2024-01-15T10:00:00Z",
      };

      // Mock belongsToUser check
      const mockBelongsQuery = createMockQuery();
      mockSupabase.from.mockReturnValueOnce(mockBelongsQuery);
      mockBelongsQuery.maybeSingle.mockResolvedValueOnce({
        data: { id: "income-1" },
        error: null,
      });

      // Mock update
      const mockUpdateQuery = createMockQuery();
      mockSupabase.from.mockReturnValueOnce(mockUpdateQuery);
      mockUpdateQuery.single.mockResolvedValueOnce({
        data: mockUpdatedIncome,
        error: null,
      });

      const result = await incomesService.update("income-1", updateCommand, "user-1");

      expect(result).toEqual(mockUpdatedIncome);
    });

    it("powinien rzucić błąd gdy wpływ nie należy do użytkownika", async () => {
      const updateCommand: UpdateIncomeCommand = {
        amount: 1500,
      };

      // Mock belongsToUser check - income doesn't belong to user
      const mockBelongsQuery = createMockQuery();
      mockSupabase.from.mockReturnValueOnce(mockBelongsQuery);
      mockBelongsQuery.maybeSingle.mockResolvedValueOnce({
        data: null,
        error: null,
      });

      await expect(incomesService.update("income-1", updateCommand, "user-1")).rejects.toThrow(
        "Wpływ nie istnieje lub nie należy do użytkownika"
      );
    });
  });

  describe("delete", () => {
    it("powinien usunąć wpływ", async () => {
      // Mock belongsToUser check
      const mockBelongsQuery = createMockQuery();
      mockSupabase.from.mockReturnValueOnce(mockBelongsQuery);
      mockBelongsQuery.maybeSingle.mockResolvedValueOnce({
        data: { id: "income-1" },
        error: null,
      });

      // Mock delete - delete() returns a query that can be chained with multiple eq()
      const mockDeleteQuery = createMockQuery();
      mockSupabase.from.mockReturnValueOnce(mockDeleteQuery);
      mockDeleteQuery.delete.mockReturnValueOnce(mockDeleteQuery);
      // First eq() call returns the query for chaining
      mockDeleteQuery.eq.mockReturnValueOnce(mockDeleteQuery);
      // Second eq() call returns the final result
      mockDeleteQuery.eq.mockResolvedValueOnce({
        error: null,
      });

      await expect(incomesService.delete("income-1", "user-1")).resolves.toBeUndefined();
    });

    it("powinien rzucić błąd gdy wpływ nie należy do użytkownika", async () => {
      // Mock belongsToUser check - income doesn't belong to user
      const mockBelongsQuery = createMockQuery();
      mockSupabase.from.mockReturnValueOnce(mockBelongsQuery);
      mockBelongsQuery.maybeSingle.mockResolvedValueOnce({
        data: null,
        error: null,
      });

      await expect(incomesService.delete("income-1", "user-1")).rejects.toThrow(
        "Wpływ nie istnieje lub nie należy do użytkownika"
      );
    });
  });
});
