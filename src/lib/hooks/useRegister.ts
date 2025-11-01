import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { RegisterFormData } from "../../types";

// Mapowanie błędów Supabase na polskie komunikaty (takie same jak w useAuth)
const errorTranslations: Record<string, string> = {
  "Invalid login credentials": "Nieprawidłowy email lub hasło",
  "Email not confirmed": "Adres email nie został potwierdzony",
  "Too many requests": "Zbyt wiele prób. Spróbuj ponownie później",
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

interface UseRegisterReturn {
  // Loading states
  isLoading: boolean;

  // Error
  error: string | null;

  // Actions
  register: (data: RegisterFormData) => Promise<void>;

  // Utils
  clearError: () => void;
}

export const useRegister = (): UseRegisterReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleApiError = useCallback((err: unknown, defaultMessage: string) => {
    console.error("Registration Error:", err);
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

  const register = useCallback(
    async (data: RegisterFormData): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(translateError(result.error) || "Wystąpił błąd podczas rejestracji");
        }

        // Ręcznie ustaw sesję w kliencie Supabase po rejestracji
        if (result.session) {
          const { supabaseClient } = await import("../../db/supabase.client");
          console.log("Setting session after registration...");
          await supabaseClient.auth.setSession({
            access_token: result.session.access_token,
            refresh_token: result.session.refresh_token,
          });
        }

        if (result.autoLoggedIn) {
          toast.success("Konto zostało utworzone i zalogowano automatycznie!");
        } else {
          toast.success("Konto zostało utworzone pomyślnie!");
        }

        // Przekierowanie do dashboardu
        window.location.href = "/";
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Wystąpił błąd podczas rejestracji";
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
    register,
    clearError,
  };
};
