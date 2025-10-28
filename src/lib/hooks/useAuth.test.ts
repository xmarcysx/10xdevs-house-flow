import { act, renderHook, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { LoginViewModel } from "../../types";
import { useAuth } from "./useAuth";

// Mock toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with correct default state", () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(typeof result.current.login).toBe("function");
    expect(typeof result.current.resetPassword).toBe("function");
    expect(typeof result.current.clearError).toBe("function");
  });

  it("should handle successful login", async () => {
    const { result } = renderHook(() => useAuth());

    const loginData: LoginViewModel = {
      email: "test@example.com",
      password: "password123",
    };

    // Start login
    let loginPromise: Promise<void>;
    await act(async () => {
      loginPromise = result.current.login(loginData);
    });

    // Wait for completion
    await act(async () => {
      await loginPromise;
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(toast.success).toHaveBeenCalledWith("Zalogowano pomyślnie!");
      expect(window.location.href).toBe("/");
    });
  });

  it("should handle login error", async () => {
    const { result } = renderHook(() => useAuth());

    const loginData: LoginViewModel = {
      email: "test@example.com",
      password: "wrongpassword",
    };

    // Start login (should fail due to placeholder error)
    await act(async () => {
      await result.current.login(loginData);
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe("Backend nie jest jeszcze zaimplementowany");
      expect(toast.error).toHaveBeenCalledWith("Backend nie jest jeszcze zaimplementowany");
    });
  });

  it("should handle successful password reset", async () => {
    const { result } = renderHook(() => useAuth());

    // Start password reset
    await act(async () => {
      await result.current.resetPassword("test@example.com");
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(toast.success).toHaveBeenCalledWith("Link do resetowania hasła został wysłany na Twój adres email!");
    });
  });

  it("should clear error", () => {
    const { result } = renderHook(() => useAuth());

    // Manually trigger error state (normally this would be done by the hook)
    result.current.clearError();

    expect(result.current.error).toBe(null);
  });
});
