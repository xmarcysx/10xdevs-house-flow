import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { SettingsFormData } from "../../types";
import { supabaseClient } from "../../db/supabase.client";

// Mapowanie błędów na polskie komunikaty
const errorTranslations: Record<string, string> = {
  "Invalid request": "Nieprawidłowe żądanie",
  "User not found": "Użytkownik nie został znaleziony",
  "Unauthorized": "Brak uprawnień",
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

        if (!response.ok) {
          throw new Error(translateError(result.error) || "Wystąpił błąd podczas aktualizacji profilu");
        }

        // Aktualizuj lokalny stan profilu
        setProfile({
          firstName: result.profile.firstName,
          lastName: result.profile.lastName,
          avatarUrl: result.profile.avatarUrl,
        });

        // Odśwież sesję, żeby navbar mógł pobrać zaktualizowane dane
        await supabaseClient.auth.refreshSession();

        // Wyślij event do Navbar, żeby odświeżył dane profilu
        window.localStorage.setItem('profileUpdated', Date.now().toString());
        window.dispatchEvent(new Event('profileUpdated'));

        toast.success("Profil został zaktualizowany pomyślnie!");

        // Przekierowanie do dashboard
        window.location.href = "/";
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Wystąpił błąd podczas aktualizacji profilu";
        handleApiError(err, errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
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
