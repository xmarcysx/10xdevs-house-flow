import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { LoginViewModel } from "../../types";

// Mapowanie błędów Supabase na polskie komunikaty
const errorTranslations: Record<string, string> = {
  "Invalid login credentials": "Nieprawidłowy email lub hasło",
  "Email not confirmed": "Adres email nie został potwierdzony",
  "Too many requests": "Zbyt wiele prób logowania. Spróbuj ponownie później",
  "User not found": "Użytkownik nie został znaleziony",
  "Password should be at least 6 characters": "Hasło musi mieć przynajmniej 6 znaków",
  "Signup is disabled": "Rejestracja jest tymczasowo niedostępna",
  "Email link is invalid or has expired": "Link resetowania hasła jest nieprawidłowy lub wygasł",
  "Unable to validate email address: invalid format": "Nieprawidłowy format adresu email",
  "User already registered": "Użytkownik o tym adresie email już istnieje",
  "Weak password": "Hasło jest zbyt słabe",
};

// Funkcja tłumacząca błędy na polski
const translateError = (errorMessage: string): string => {
  return errorTranslations[errorMessage] || errorMessage;
};

interface UseAuthReturn {
  // Loading states
  isLoading: boolean;

  // Error
  error: string | null;

  // Actions
  login: (data: LoginViewModel) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;

  // Utils
  clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleApiError = useCallback((err: unknown, defaultMessage: string) => {
    console.error("Auth Error:", err);
    if (err instanceof Error) {
      if (err.name === "AbortError") {
        setError("Przekroczono limit czasu żądania");
      } else {
        setError(err.message);
      }
    } else {
      setError(defaultMessage);
    }
  }, []);

  const login = useCallback(
    async (data: LoginViewModel): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(translateError(result.error) || "Wystąpił błąd podczas logowania");
        }

        toast.success("Zalogowano pomyślnie!");

        // Przekierowanie do dashboardu
        window.location.href = "/";
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Wystąpił błąd podczas logowania";
        handleApiError(err, errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [handleApiError]
  );

  const logout = useCallback(
    async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(translateError(result.error) || "Wystąpił błąd podczas wylogowywania");
        }

        toast.success("Wylogowano pomyślnie!");

        // Przekierowanie na stronę powitalną
        window.location.href = "/guest";
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Wystąpił błąd podczas wylogowywania";
        handleApiError(err, errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [handleApiError]
  );

  const resetPassword = useCallback(
    async (email: string): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(translateError(result.error) || "Wystąpił błąd podczas wysyłania linku resetowania");
        }

        toast.success(result.message || "Link do resetowania hasła został wysłany na Twój adres email!");
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Wystąpił błąd podczas wysyłania linku resetowania";
        handleApiError(err, errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [handleApiError]
  );

  const updatePassword = useCallback(
    async (newPassword: string): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        // TODO: Implementacja z Supabase Auth SDK
        // const { error: updateError } = await supabaseClient.auth.updateUser({
        //   password: newPassword,
        // });

        // if (updateError) {
        //   throw updateError;
        // }

        // Symulacja aktualizacji hasła dla wydmuszki
        console.log("Updating password");

        // Symulacja opóźnienia API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Symulacja sukcesu
        toast.success("Hasło zostało pomyślnie zaktualizowane!");
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Wystąpił błąd podczas aktualizacji hasła";
        handleApiError(err, errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [handleApiError]
  );

  return {
    isLoading,
    error,
    login,
    logout,
    resetPassword,
    updatePassword,
    clearError,
  };
};
