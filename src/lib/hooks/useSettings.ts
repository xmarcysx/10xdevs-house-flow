import { useCallback, useState } from "react";
import { toast } from "sonner";
import { supabaseClient } from "../../db/supabase.client";
import type { SettingsFormData } from "../../types";

// Mapowanie błędów na polskie komunikaty
const errorTranslations: Record<string, string> = {
  "Invalid request": "Nieprawidłowe żądanie",
  "User not found": "Użytkownik nie został znaleziony",
  Unauthorized: "Brak uprawnień",
  "File too large": "Plik jest zbyt duży",
  "Invalid file type": "Nieprawidłowy typ pliku",
  "Upload failed": "Przesyłanie pliku nie powiodło się",
};

// Funkcja tłumacząca błędy na polski
const translateError = (errorMessage: string): string => {
  return errorTranslations[errorMessage] || errorMessage;
};

interface UseSettingsReturn {
  // Loading states
  isLoading: boolean;
  isSubmitting: boolean;

  // Error
  error: string | null;

  // Data
  profile: {
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  } | null;

  // Actions
  fetchProfile: () => Promise<void>;
  updateProfile: (data: SettingsFormData) => Promise<void>;

  // Utils
  clearError: () => void;
}

export const useSettings = (): UseSettingsReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<{
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  } | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleApiError = useCallback((err: unknown, defaultMessage: string) => {
    console.error("Settings Error:", err);
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

  const fetchProfile = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/auth/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(translateError(result.error) || "Wystąpił błąd podczas pobierania profilu");
      }

      setProfile(result.profile);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Wystąpił błąd podczas pobierania profilu";
      handleApiError(err, errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [handleApiError]);

  const updateProfile = useCallback(
    async (data: SettingsFormData): Promise<void> => {
      try {
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData();
        formData.append("firstName", data.firstName);
        formData.append("lastName", data.lastName);
        if (data.avatar) {
          formData.append("avatar", data.avatar);
        }

        const response = await fetch("/api/auth/profile", {
          method: "PUT",
          body: formData,
        });

        const result = await response.json();
        console.log(result);
        if (!response.ok) {
          throw new Error(translateError(result.error) || "Wystąpił błąd podczas aktualizacji profilu");
        }

        console.log("Setting profile...");
        // Aktualizuj lokalny stan profilu PRZED innymi operacjami
        setProfile({
          firstName: result.profile.firstName,
          lastName: result.profile.lastName,
          avatarUrl: result.profile.avatarUrl,
        });
        console.log("Profile set successfully");

        console.log("Refreshing session...");
        // Odśwież sesję, żeby navbar mógł pobrać zaktualizowane dane
        try {
          // Dodaj timeout na wypadek nieskończonej pętli
          const refreshPromise = supabaseClient.auth.refreshSession();
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Session refresh timeout")), 5000)
          );

          await Promise.race([refreshPromise, timeoutPromise]);
          console.log("Session refreshed");
        } catch (sessionError) {
          console.warn("Session refresh failed or timed out:", sessionError);
          // Kontynuuj mimo błędu odświeżania sesji
        }

        console.log("Sending navbar event...");
        // Wyślij event do Navbar, żeby odświeżył dane profilu
        window.localStorage.setItem("profileUpdated", Date.now().toString());
        window.dispatchEvent(new Event("profileUpdated"));
        console.log("Navbar event sent");

        console.log("Showing success toast...");
        toast.success("Profil został zaktualizowany pomyślnie!");

        // Resetuj stan przed przekierowaniem
        setIsSubmitting(false);

        // Opóźnij przekierowanie, żeby dać czas na aktualizację stanu
        setTimeout(() => {
          window.location.href = "/";
        }, 100);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Wystąpił błąd podczas aktualizacji profilu";
        handleApiError(err, errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        // Dodatkowo upewnij się, że stan zostanie zresetowany (na wypadek błędu)
        setIsSubmitting(false);
      }
    },
    [handleApiError]
  );

  return {
    isLoading,
    isSubmitting,
    error,
    profile,
    fetchProfile,
    updateProfile,
    clearError,
  };
};
