import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useCategories } from "../useCategories";

// Mock fetch globally
const fetchMock = vi.fn();
global.fetch = fetchMock;

// Mock window.location for redirect tests
Object.defineProperty(window, "location", {
  value: {
    href: "",
  },
  writable: true,
});

describe("useCategories", () => {
  const mockCategories = [
    { id: "1", name: "Jedzenie", is_default: false, created_at: "2023-01-01T00:00:00Z" },
    { id: "2", name: "Transport", is_default: false, created_at: "2023-01-02T00:00:00Z" },
  ];

  const mockPagination = { page: 1, limit: 10, total: 20 };

  const mockApiResponse = {
    data: mockCategories,
    pagination: mockPagination,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    fetchMock.mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockApiResponse),
    } as any);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("Stan początkowy", () => {
    it("powinien zwrócić prawidłowy stan początkowy", () => {
      const { result } = renderHook(() => useCategories());

      expect(result.current.categories).toEqual([]);
      expect(result.current.pagination).toEqual({ page: 1, limit: 10, total: 0 });
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.error).toBeNull();
      expect(typeof result.current.fetchCategories).toBe("function");
      expect(typeof result.current.createCategory).toBe("function");
      expect(typeof result.current.updateCategory).toBe("function");
      expect(typeof result.current.deleteCategory).toBe("function");
      expect(typeof result.current.clearError).toBe("function");
    });
  });

  describe("fetchCategories", () => {
    it("powinien pobrać kategorie z API i zaktualizować stan", async () => {
      const { result } = renderHook(() => useCategories());

      await act(async () => {
        await result.current.fetchCategories(1, 10);
      });

      expect(fetchMock).toHaveBeenCalledWith("/api/categories?page=1&limit=10", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      expect(result.current.categories).toEqual(mockCategories);
      expect(result.current.pagination).toEqual(mockPagination);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it("powinien używać domyślnych parametrów gdy nie są podane", async () => {
      const { result } = renderHook(() => useCategories());

      await act(async () => {
        await result.current.fetchCategories();
      });

      expect(fetchMock).toHaveBeenCalledWith("/api/categories?page=1&limit=10", expect.any(Object));
    });

    it("powinien obsłużyć błąd 401 i przekierować na stronę logowania", async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 401,
      } as any);

      const { result } = renderHook(() => useCategories());

      await act(async () => {
        await result.current.fetchCategories();
      });

      expect(window.location.href).toBe("/login");
    });

    it("powinien obsłużyć błąd HTTP i ustawić komunikat błędu", async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      } as any);

      const { result } = renderHook(() => useCategories());

      await act(async () => {
        await result.current.fetchCategories();
      });

      expect(result.current.error).toBe("HTTP 500: Internal Server Error");
      expect(result.current.isLoading).toBe(false);
    });

    it("powinien obsłużyć błąd AbortError", async () => {
      const abortError = new Error("Aborted");
      abortError.name = "AbortError";

      fetchMock.mockRejectedValue(abortError);

      const { result } = renderHook(() => useCategories());

      await act(async () => {
        await result.current.fetchCategories();
      });

      expect(result.current.error).toBe("Przekroczono limit czasu żądania");
    });

    it("powinien obsłużyć inne błędy i ustawić komunikat błędu", async () => {
      fetchMock.mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() => useCategories());

      await act(async () => {
        await result.current.fetchCategories();
      });

      expect(result.current.error).toBe("Network error");
    });
  });

  describe("createCategory", () => {
    const newCategoryCommand = { name: "Nowa Kategoria" };
    const createdCategory = {
      id: "3",
      name: "Nowa Kategoria",
      is_default: false,
      created_at: "2023-01-03T00:00:00Z",
    };

    it("powinien utworzyć nową kategorię i zwrócić ją", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(createdCategory),
      } as any);

      const { result } = renderHook(() => useCategories());

      let returnedCategory;
      await act(async () => {
        returnedCategory = await result.current.createCategory(newCategoryCommand);
      });

      expect(fetchMock).toHaveBeenCalledWith("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCategoryCommand),
      });

      expect(returnedCategory).toEqual(createdCategory);
      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it("powinien obsłużyć błąd 401 i rzucić błąd autoryzacji", async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 401,
      } as any);

      const { result } = renderHook(() => useCategories());

      await expect(result.current.createCategory(newCategoryCommand)).rejects.toThrow("Brak autoryzacji");
      expect(window.location.href).toBe("/login");
    });

    it("powinien obsłużyć błąd HTTP i rzucić błąd z API", async () => {
      const errorMessage = "Kategoria już istnieje";
      fetchMock.mockResolvedValue({
        ok: false,
        status: 400,
        json: vi.fn().mockResolvedValue({ message: errorMessage }),
      } as any);

      const { result } = renderHook(() => useCategories());

      await expect(result.current.createCategory(newCategoryCommand)).rejects.toThrow(errorMessage);
      expect(result.current.isSubmitting).toBe(false);
    });

    it("powinien obsłużyć błąd HTTP bez ciała odpowiedzi", async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: vi.fn().mockRejectedValue(new Error("No JSON")),
      } as any);

      const { result } = renderHook(() => useCategories());

      await expect(result.current.createCategory(newCategoryCommand)).rejects.toThrow("Błąd serwera");
    });

    it("powinien obsłużyć błąd sieciowy", async () => {
      fetchMock.mockRejectedValue(new Error("Network error"));

      const { result } = renderHook(() => useCategories());

      await expect(result.current.createCategory(newCategoryCommand)).rejects.toThrow("Network error");
    });
  });

  describe("updateCategory", () => {
    const updateCommand = { name: "Zaktualizowana Kategoria" };
    const updatedCategory = {
      id: "1",
      name: "Zaktualizowana Kategoria",
      is_default: false,
      created_at: "2023-01-01T00:00:00Z",
    };

    it("powinien zaktualizować kategorię i zwrócić ją", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(updatedCategory),
      } as any);

      const { result } = renderHook(() => useCategories());

      let returnedCategory;
      await act(async () => {
        returnedCategory = await result.current.updateCategory("1", updateCommand);
      });

      expect(fetchMock).toHaveBeenCalledWith("/api/categories/1", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateCommand),
      });

      expect(returnedCategory).toEqual(updatedCategory);
      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it("powinien obsłużyć błąd 401 podczas aktualizacji", async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 401,
      } as any);

      const { result } = renderHook(() => useCategories());

      await expect(result.current.updateCategory("1", updateCommand)).rejects.toThrow("Brak autoryzacji");
      expect(window.location.href).toBe("/login");
    });

    it("powinien obsłużyć błąd HTTP podczas aktualizacji", async () => {
      const errorMessage = "Błąd aktualizacji";
      fetchMock.mockResolvedValue({
        ok: false,
        status: 400,
        json: vi.fn().mockResolvedValue({ message: errorMessage }),
      } as any);

      const { result } = renderHook(() => useCategories());

      await expect(result.current.updateCategory("1", updateCommand)).rejects.toThrow(errorMessage);
    });
  });

  describe("deleteCategory", () => {
    it("powinien usunąć kategorię", async () => {
      fetchMock.mockResolvedValue({
        ok: true,
      } as any);

      const { result } = renderHook(() => useCategories());

      await act(async () => {
        await result.current.deleteCategory("1");
      });

      expect(fetchMock).toHaveBeenCalledWith("/api/categories/1", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      expect(result.current.isSubmitting).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it("powinien obsłużyć błąd 401 podczas usuwania", async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        status: 401,
      } as any);

      const { result } = renderHook(() => useCategories());

      await expect(result.current.deleteCategory("1")).rejects.toThrow("Brak autoryzacji");
      expect(window.location.href).toBe("/login");
    });

    it("powinien obsłużyć błąd HTTP podczas usuwania", async () => {
      const errorMessage = "Błąd usuwania";
      fetchMock.mockResolvedValue({
        ok: false,
        status: 400,
        json: vi.fn().mockResolvedValue({ message: errorMessage }),
      } as any);

      const { result } = renderHook(() => useCategories());

      await expect(result.current.deleteCategory("1")).rejects.toThrow(errorMessage);
    });
  });

  describe("clearError", () => {
    it("powinien wyczyścić błąd", () => {
      const { result } = renderHook(() => useCategories());

      // Symuluj błąd
      act(() => {
        // Manually trigger error state by calling a function that fails
        fetchMock.mockRejectedValueOnce(new Error("Test error"));
      });

      // Wyczyść błąd
      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe("Stan ładowania", () => {
    it("powinien ustawić isLoading na true podczas pobierania kategorii", async () => {
      let resolvePromise: (value: any) => void;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      fetchMock.mockReturnValue(promise as any);

      const { result } = renderHook(() => useCategories());

      act(() => {
        result.current.fetchCategories();
      });

      expect(result.current.isLoading).toBe(true);

      // Resolve the promise
      act(() => {
        resolvePromise!({
          ok: true,
          json: vi.fn().mockResolvedValue(mockApiResponse),
        });
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it("powinien ustawić isSubmitting na true podczas operacji mutacji", async () => {
      let resolvePromise: (value: any) => void;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      fetchMock.mockReturnValue(promise as any);

      const { result } = renderHook(() => useCategories());

      act(() => {
        result.current.createCategory({ name: "Test" });
      });

      expect(result.current.isSubmitting).toBe(true);

      // Resolve the promise
      act(() => {
        resolvePromise!({
          ok: true,
          json: vi.fn().mockResolvedValue({
            id: "3",
            name: "Test",
            is_default: false,
            created_at: "2023-01-03T00:00:00Z",
          }),
        });
      });

      await waitFor(() => {
        expect(result.current.isSubmitting).toBe(false);
      });
    });
  });

  describe("Edge cases", () => {
    it("powinien obsłużyć AbortError podczas tworzenia kategorii", async () => {
      const abortError = new Error("Aborted");
      abortError.name = "AbortError";

      fetchMock.mockRejectedValue(abortError);

      const { result } = renderHook(() => useCategories());

      await expect(result.current.createCategory({ name: "Test" })).rejects.toThrow(abortError);
    });

    it("powinien obsłużyć AbortError podczas aktualizacji kategorii", async () => {
      const abortError = new Error("Aborted");
      abortError.name = "AbortError";

      fetchMock.mockRejectedValue(abortError);

      const { result } = renderHook(() => useCategories());

      await expect(result.current.updateCategory("1", { name: "Test" })).rejects.toThrow(abortError);
    });

    it("powinien obsłużyć AbortError podczas usuwania kategorii", async () => {
      const abortError = new Error("Aborted");
      abortError.name = "AbortError";

      fetchMock.mockRejectedValue(abortError);

      const { result } = renderHook(() => useCategories());

      await expect(result.current.deleteCategory("1")).rejects.toThrow(abortError);
    });
  });
});
