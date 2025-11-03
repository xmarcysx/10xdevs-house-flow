// Komponent formularza resetowania hasła dla użytkowników HouseFlow
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useAuth } from "../lib/hooks/useAuth";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

// Schematy walidacji dla różnych stanów formularza
const requestResetSchema = z.object({
  email: z
    .string()
    .min(1, "Adres email jest wymagany")
    .email("Podaj prawidłowy adres email")
    .max(254, "Adres email może mieć maksymalnie 254 znaki"),
});

const newPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, "Hasło jest wymagane")
      .min(8, "Hasło musi mieć przynajmniej 8 znaków")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])/, "Hasło musi zawierać przynajmniej jedną małą i jedną wielką literę")
      .max(128, "Hasło może mieć maksymalnie 128 znaków"),
    confirmPassword: z.string().min(1, "Potwierdzenie hasła jest wymagane"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła nie są identyczne",
    path: ["confirmPassword"],
  });

type RequestResetFormData = z.infer<typeof requestResetSchema>;
type NewPasswordFormData = z.infer<typeof newPasswordSchema>;

type FormState = "request" | "email-sent" | "reset";

const ResetPasswordForm: React.FC = () => {
  const { resetPassword, updatePassword, isLoading, error: apiError } = useAuth();
  const [formState, setFormState] = useState<FormState>("request");

  // Formularz dla żądania resetowania hasła
  const requestForm = useForm<RequestResetFormData>({
    resolver: zodResolver(requestResetSchema),
    defaultValues: {
      email: "",
    },
  });

  // Formularz dla ustawiania nowego hasła
  const resetForm = useForm<NewPasswordFormData>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onRequestSubmit = async (data: RequestResetFormData) => {
    try {
      await resetPassword(data.email);
      setFormState("email-sent");
      requestForm.reset();
    } catch (error) {
      console.error("Reset password request failed:", error);
    }
  };

  const onResetSubmit = async (data: NewPasswordFormData) => {
    try {
      await updatePassword(data.password);
      resetForm.reset();
      toast.success("Hasło zostało pomyślnie zaktualizowane");
      // Przekierowanie do dashboardu po zmianie hasła
      window.location.href = "/";
    } catch (error) {
      console.error("Password update failed:", error);
    }
  };

  const handleBackToLogin = () => {
    window.location.href = "/login";
  };

  const handleBackToRequest = () => {
    setFormState("request");
  };

  // Stan: Wysyłanie linku resetowania
  if (formState === "request") {
    const {
      register: requestRegister,
      handleSubmit: handleRequestSubmit,
      formState: { errors: requestErrors, isSubmitting: requestIsSubmitting },
    } = requestForm;

    return (
      <Card className="w-full border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg shadow-2xl rounded-3xl transform transition-all duration-300 hover:shadow-3xl">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl text-center font-bold bg-gradient-to-r from-gray-900 via-orange-800 to-red-800 dark:from-white dark:via-orange-200 dark:to-red-200 bg-clip-text text-transparent">
            Resetowanie hasła
          </CardTitle>
          <CardDescription className="text-center text-gray-600 dark:text-gray-400">
            Wprowadź adres email powiązany z Twoim kontem, a wyślemy Ci link do resetowania hasła
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleRequestSubmit(onRequestSubmit)} className="space-y-5">
            {/* Pole Email */}
            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                </svg>
                Adres email *
              </Label>
              <Input
                {...requestRegister("email")}
                type="email"
                id="email"
                placeholder="twoj@email.com"
                disabled={isLoading || requestIsSubmitting}
                className={`h-12 rounded-xl border-2 transition-all duration-200 ${
                  requestErrors.email
                    ? "border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-200 focus:border-orange-400 focus:ring-orange-200 dark:border-gray-700 dark:focus:border-orange-500 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
                autoComplete="email"
              />
              {requestErrors.email && (
                <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                  </svg>
                  {requestErrors.email.message}
                </p>
              )}
            </div>

            {/* Błędy API */}
            {apiError && (
              <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 animate-pulse">
                <p className="text-sm text-red-800 dark:text-red-200 flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                  </svg>
                  {apiError}
                </p>
              </div>
            )}

            {/* Przycisk Submit */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={isLoading || requestIsSubmitting}
            >
              {isLoading || requestIsSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Wysyłanie...
                </>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  Wyślij link resetujący
                </span>
              )}
            </Button>
          </form>

          {/* Link powrotu do logowania */}
          <div className="mt-8 text-center pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleBackToLogin}
              className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200 inline-flex items-center gap-1 hover:underline"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Powrót do logowania
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Stan: Email został wysłany
  if (formState === "email-sent") {
    return (
      <Card className="w-full border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg shadow-2xl rounded-3xl transform transition-all duration-300 hover:shadow-3xl">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl text-center font-bold bg-gradient-to-r from-green-900 via-green-800 to-emerald-800 dark:from-green-200 dark:via-green-100 dark:to-emerald-200 bg-clip-text text-transparent">
            Sprawdź swoją skrzynkę
          </CardTitle>
          <CardDescription className="text-center text-gray-600 dark:text-gray-400">
            Link do resetowania hasła został wysłany na podany adres email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Jeśli nie widzisz wiadomości w skrzynce odbiorczej, sprawdź folder spam.
            </p>
          </div>

          <Button
            onClick={handleBackToRequest}
            variant="outline"
            className="w-full h-12 border-2 border-gray-300 hover:border-green-400 hover:text-green-600 dark:border-gray-600 dark:hover:border-green-500 dark:hover:text-green-400 font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Wyślij ponownie
            </span>
          </Button>

          <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleBackToLogin}
              className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200 inline-flex items-center gap-1 hover:underline"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Powrót do logowania
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Stan: Ustawianie nowego hasła
  const {
    register: resetRegister,
    handleSubmit: handleResetSubmit,
    formState: { errors: resetErrors, isSubmitting: resetIsSubmitting },
  } = resetForm;

  return (
    <Card className="w-full border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg shadow-2xl rounded-3xl transform transition-all duration-300 hover:shadow-3xl">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl text-center font-bold bg-gradient-to-r from-green-900 via-green-800 to-emerald-800 dark:from-green-200 dark:via-green-100 dark:to-emerald-200 bg-clip-text text-transparent">
          Ustaw nowe hasło
        </CardTitle>
        <CardDescription className="text-center text-gray-600 dark:text-gray-400">
          Wprowadź nowe hasło dla swojego konta
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleResetSubmit(onResetSubmit)} className="space-y-5">
          {/* Pole Hasło */}
          <div className="space-y-3">
            <Label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              Nowe hasło *
            </Label>
            <Input
              {...resetRegister("password")}
              type="password"
              id="password"
              placeholder="Minimum 8 znaków, wielkie i małe litery"
              disabled={isLoading || resetIsSubmitting}
              className={`h-12 rounded-xl border-2 transition-all duration-200 ${
                resetErrors.password
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50 dark:bg-red-900/20"
                  : "border-gray-200 focus:border-green-400 focus:ring-green-200 dark:border-gray-700 dark:focus:border-green-500 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
              autoComplete="new-password"
            />
            {resetErrors.password && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
                {resetErrors.password.message}
              </p>
            )}
          </div>

          {/* Pole Potwierdzenie hasła */}
          <div className="space-y-3">
            <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Potwierdź nowe hasło *
            </Label>
            <Input
              {...resetRegister("confirmPassword")}
              type="password"
              id="confirmPassword"
              placeholder="Powtórz nowe hasło"
              disabled={isLoading || resetIsSubmitting}
              className={`h-12 rounded-xl border-2 transition-all duration-200 ${
                resetErrors.confirmPassword
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50 dark:bg-red-900/20"
                  : "border-gray-200 focus:border-emerald-400 focus:ring-emerald-200 dark:border-gray-700 dark:focus:border-emerald-500 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
              autoComplete="new-password"
            />
            {resetErrors.confirmPassword && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
                {resetErrors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Błędy API */}
          {apiError && (
            <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 animate-pulse">
              <p className="text-sm text-red-800 dark:text-red-200 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
                {apiError}
              </p>
            </div>
          )}

          {/* Przycisk Submit */}
          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={isLoading || resetIsSubmitting}
          >
            {isLoading || resetIsSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Aktualizowanie hasła...
              </>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Ustaw nowe hasło
              </span>
            )}
          </Button>
        </form>

        {/* Link powrotu do logowania */}
        <div className="mt-8 text-center pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleBackToLogin}
            className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200 inline-flex items-center gap-1 hover:underline"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Powrót do logowania
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResetPasswordForm;
