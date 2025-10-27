import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CreateExpenseCommand, ExpenseDTO, GetExpensesQuery, UpdateExpenseCommand } from "../../types";
import { useExpensesApi } from "./useExpensesApi";

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("useExpensesApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with empty state", () => {
    const { result } = renderHook(() => useExpensesApi());

    expect(result.current.expenses).toEqual([]);
    expect(result.current.pagination).toBe(null);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.error).toBe(null);
  });

  describe("fetchExpenses", () => {
    it("should fetch expenses successfully", async () => {
      const mockExpenses: ExpenseDTO[] = [
        {
          id: "1",
          amount: 100,
          date: "2024-01-01",
          description: "Test expense",
          category_id: "cat1",
          category_name: "Jedzenie",
          created_at: "2024-01-01T00:00:00Z",
        },
      ];

      const mockPagination = {
        page: 1,
        limit: 10,
        total: 1,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: mockExpenses, pagination: mockPagination }),
      });

      const { result } = renderHook(() => useExpensesApi());

      const query: GetExpensesQuery = {
        page: 1,
        limit: 10,
        sort: "date DESC",
      };

      await result.current.fetchExpenses(query);

      await waitFor(() => {
        expect(result.current.expenses).toEqual(mockExpenses);
        expect(result.current.pagination).toEqual(mockPagination);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe(null);
      });
    });

    it("should handle unauthorized error and redirect", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
      });

      const { result } = renderHook(() => useExpensesApi());

      const query: GetExpensesQuery = {
        page: 1,
        limit: 10,
        sort: "date DESC",
      };

      await result.current.fetchExpenses(query);

      await waitFor(() => {
        expect(window.location.href).toBe("/login");
      });
    });
  });

  describe("createExpense", () => {
    it("should create expense successfully", async () => {
      const createCommand: CreateExpenseCommand = {
        amount: 100,
        date: "2024-01-01",
        description: "Test expense",
        category_id: "cat1",
      };

      const createdExpense: ExpenseDTO = {
        id: "1",
        ...createCommand,
        category_name: "Jedzenie",
        created_at: "2024-01-01T00:00:00Z",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(createdExpense),
      });

      const { result } = renderHook(() => useExpensesApi());

      const response = await result.current.createExpense(createCommand);

      expect(response).toEqual(createdExpense);
      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.error).toBe(null);

      expect(mockFetch).toHaveBeenCalledWith("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createCommand),
      });
    });

    it("should handle validation error", async () => {
      const createCommand: CreateExpenseCommand = {
        amount: 100,
        date: "2024-01-01",
        category_id: "cat1",
      };

      const errorMessage = "Validation error";
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 422,
        json: () => Promise.resolve({ message: errorMessage }),
      });

      const { result } = renderHook(() => useExpensesApi());

      await expect(result.current.createExpense(createCommand)).rejects.toThrow(errorMessage);
      expect(result.current.isSubmitting).toBe(false);
    });
  });

  describe("updateExpense", () => {
    it("should update expense successfully", async () => {
      const updateCommand: UpdateExpenseCommand = {
        amount: 150,
        description: "Updated expense",
      };

      const updatedExpense: ExpenseDTO = {
        id: "1",
        amount: 150,
        date: "2024-01-01",
        description: "Updated expense",
        category_id: "cat1",
        category_name: "Jedzenie",
        created_at: "2024-01-01T00:00:00Z",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(updatedExpense),
      });

      const { result } = renderHook(() => useExpensesApi());

      const response = await result.current.updateExpense("1", updateCommand);

      expect(response).toEqual(updatedExpense);
      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it("should handle not found error", async () => {
      const updateCommand: UpdateExpenseCommand = {
        amount: 150,
      };

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const { result } = renderHook(() => useExpensesApi());

      await expect(result.current.updateExpense("1", updateCommand)).rejects.toThrow("Wydatek nie został znaleziony");
    });
  });

  describe("deleteExpense", () => {
    it("should delete expense successfully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
      });

      const { result } = renderHook(() => useExpensesApi());

      await result.current.deleteExpense("1");

      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.error).toBe(null);

      expect(mockFetch).toHaveBeenCalledWith("/api/expenses/1", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
    });

    it("should handle not found error", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const { result } = renderHook(() => useExpensesApi());

      await expect(result.current.deleteExpense("1")).rejects.toThrow("Wydatek nie został znaleziony");
    });
  });

  it("should clear error", () => {
    const { result } = renderHook(() => useExpensesApi());

    result.current.clearError();

    expect(result.current.error).toBe(null);
  });
});
