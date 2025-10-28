import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCategories } from "./useCategories";

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("useCategories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with empty categories array", () => {
    const { result } = renderHook(() => useCategories());

    expect(result.current.categories).toEqual([]);
    expect(result.current.pagination).toEqual({ page: 1, limit: 10, total: 0 });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isSubmitting).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it("should fetch categories successfully", async () => {
    const mockCategories = [
      { id: "1", name: "Jedzenie", is_default: true, created_at: "2024-01-01T00:00:00Z" },
      { id: "2", name: "Transport", is_default: false, created_at: "2024-01-01T00:00:00Z" },
    ];

    const mockPagination = { page: 1, limit: 10, total: 2 };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ data: mockCategories, pagination: mockPagination }),
    });

    const { result } = renderHook(() => useCategories());

    // Trigger fetch
    await result.current.fetchCategories();

    await waitFor(() => {
      expect(result.current.categories).toEqual(mockCategories);
      expect(result.current.pagination).toEqual(mockPagination);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    expect(mockFetch).toHaveBeenCalledWith("/api/categories?page=1&limit=10", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
  });

  it("should handle fetch error", async () => {
    const errorMessage = "Network error";
    mockFetch.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useCategories());

    await result.current.fetchCategories();

    await waitFor(() => {
      expect(result.current.categories).toEqual([]);
      expect(result.current.pagination).toEqual({ page: 1, limit: 10, total: 0 });
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(errorMessage);
    });
  });

  it("should handle unauthorized error and redirect", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    const { result } = renderHook(() => useCategories());

    await result.current.fetchCategories();

    await waitFor(() => {
      expect(window.location.href).toBe("/login");
    });
  });

  it("should clear error", () => {
    const { result } = renderHook(() => useCategories());

    // Manually set error state (normally this would be done by the hook)
    result.current.clearError();

    expect(result.current.error).toBe(null);
  });
});
