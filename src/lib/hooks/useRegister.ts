import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { RegisterFormData } from "../../types";

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

        // TODO: Implementacja z Supabase Auth SDK
        // const { data: authData, error: authError } = await supabase.auth.signUp({
        //   email: data.email,
        //   password: data.password,
        // });

        // if (authError) {
        //   throw authError;
        // }

        // Symulacja rejestracji dla wydmuszki
        console.log("Registering user:", data);

        // Symulacja opóźnienia API
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Symulacja sukcesu
        toast.success("Konto zostało utworzone pomyślnie!");

        // TODO: Automatyczne logowanie
        // await supabase.auth.signInWithPassword({
        //   email: data.email,
        //   password: data.password,
        // });

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
