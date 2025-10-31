import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { LoginViewModel } from "../../types";

interface UseAuthReturn {
  // Loading states
  isLoading: boolean;

  // Error
  error: string | null;

  // Actions
  login: (data: LoginViewModel) => Promise<void>;
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

        // TODO: Implementacja z Supabase Auth SDK
        // import { supabaseClient } from "../../db/supabase.client";
        // const { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
        //   email: data.email,
        //   password: data.password,
        // });

        // if (authError) {
        //   throw authError;
        // }

        // Symulacja logowania dla wydmuszki
        console.log("Logging in user:", data);

        // Symulacja opóźnienia API
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Symulacja sukcesu
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

  const resetPassword = useCallback(
    async (email: string): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        // TODO: Implementacja z Supabase Auth SDK
        // const { error: resetError } = await supabaseClient.auth.resetPasswordForEmail(email, {
        //   redirectTo: `${window.location.origin}/reset-password`,
        // });

        // if (resetError) {
        //   throw resetError;
        // }

        // Symulacja resetowania hasła dla wydmuszki
        console.log("Resetting password for:", email);

        // Symulacja opóźnienia API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Symulacja sukcesu
        toast.success("Link do resetowania hasła został wysłany na Twój adres email!");
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
    resetPassword,
    updatePassword,
    clearError,
  };
};
