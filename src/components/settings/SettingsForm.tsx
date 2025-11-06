// Komponent formularza ustawień użytkownika
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSettings } from "../../lib/hooks/useSettings";
import type { SettingsFormData } from "../../types";
import { settingsSchema } from "../../lib/validation/auth.validation";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const SettingsForm: React.FC = () => {
  const { profile, isLoading, isSubmitting, error, fetchProfile, updateProfile } = useSettings();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      avatar: null,
    },
  });

  // Pobierz profil przy montowaniu komponentu
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Wypełnij formularz danymi z profilu
  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName,
        lastName: profile.lastName,
        avatar: null,
      });
      setAvatarPreview(profile.avatarUrl || null);
      setSelectedAvatar(null);
    }
  }, [profile, reset]);

  const onSubmit = async (data: SettingsFormData) => {
    try {
      // Dodaj wybrany awatar do danych
      const submitData = {
        ...data,
        avatar: selectedAvatar,
      };
      await updateProfile(submitData);
    } catch (error) {
      // Błąd jest już obsługiwany w hooku useSettings
      console.error("Settings update failed:", error);
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedAvatar(file);
      // Utwórz podgląd awatara
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedAvatar(null);
    }
  };

  const getUserInitials = () => {
    const firstName = profile?.firstName || "";
    const lastName = profile?.lastName || "";
    return firstName && lastName ? `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() : "?";
  };

  return (
    <Card className="w-full border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg shadow-2xl rounded-3xl transform transition-all duration-300 hover:shadow-3xl">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl text-center font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
          Ustawienia profilu
        </CardTitle>
        <CardDescription className="text-center text-gray-600 dark:text-gray-400">
          Zarządzaj swoimi danymi osobowymi i awatarem
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Sekcja awatara */}
            <div className="space-y-4">
              <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Zdjęcie profilowe
              </Label>
              <div className="flex items-center space-x-6">
                <Avatar className="w-20 h-20 ring-4 ring-blue-500/20">
                  <AvatarImage src={avatarPreview || undefined} alt="Avatar" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-xl font-semibold">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    disabled={isLoading || isSubmitting}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Maksymalny rozmiar: 5MB. Format: JPEG, PNG, WebP
                  </p>
                </div>
              </div>
              {errors.avatar && (
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                  </svg>
                  {errors.avatar.message}
                </p>
              )}
            </div>

            {/* Pole Imię */}
            <div className="space-y-3">
              <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                Imię *
              </Label>
              <Input
                {...register("firstName")}
                type="text"
                id="firstName"
                placeholder="Jan"
                disabled={isLoading || isSubmitting}
                className={`h-12 rounded-xl border-2 transition-all duration-200 ${
                  errors.firstName
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-200 focus:border-blue-400 focus:ring-blue-200 dark:border-gray-700 dark:focus:border-blue-500 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
                autoComplete="given-name"
              />
              {errors.firstName && (
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                  </svg>
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Pole Nazwisko */}
            <div className="space-y-3">
              <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
                Nazwisko *
              </Label>
              <Input
                {...register("lastName")}
                type="text"
                id="lastName"
                placeholder="Kowalski"
                disabled={isLoading || isSubmitting}
                className={`h-12 rounded-xl border-2 transition-all duration-200 ${
                  errors.lastName
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-200 focus:border-green-400 focus:ring-green-200 dark:border-gray-700 dark:focus:border-green-500 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
                autoComplete="family-name"
              />
              {errors.lastName && (
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                  </svg>
                  {errors.lastName.message}
                </p>
              )}
            </div>

            {/* Błędy API */}
            {error && (
              <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
                <p className="text-sm text-red-800 dark:text-red-200 flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                  </svg>
                  {error}
                </p>
              </div>
            )}

            {/* Przycisk Submit */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={isLoading || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Zapisywanie...
                </>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Zapisz zmiany
                </span>
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default SettingsForm;
