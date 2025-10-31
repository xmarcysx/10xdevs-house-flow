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
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Resetowanie hasła</CardTitle>
          <CardDescription className="text-center">
            Wprowadź adres email powiązany z Twoim kontem, a wyślemy Ci link do resetowania hasła
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRequestSubmit(onRequestSubmit)} className="space-y-4">
            {/* Pole Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Adres email *
              </Label>
              <Input
                {...requestRegister("email")}
                type="email"
                id="email"
                placeholder="twoj@email.com"
                disabled={isLoading || requestIsSubmitting}
                className={requestErrors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                autoComplete="email"
              />
              {requestErrors.email && (
                <p className="text-sm text-red-600 dark:text-red-400">{requestErrors.email.message}</p>
              )}
            </div>

            {/* Błędy API */}
            {apiError && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3">
                <p className="text-sm text-red-800 dark:text-red-200">{apiError}</p>
              </div>
            )}

            {/* Przycisk Submit */}
            <Button type="submit" className="w-full" disabled={isLoading || requestIsSubmitting}>
              {isLoading || requestIsSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Wysyłanie...
                </>
              ) : (
                "Wyślij link resetujący"
              )}
            </Button>
          </form>

          {/* Link powrotu do logowania */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={handleBackToLogin}
              className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              ← Powrót do logowania
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Stan: Email został wysłany
  if (formState === "email-sent") {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Sprawdź swoją skrzynkę</CardTitle>
          <CardDescription className="text-center">
            Link do resetowania hasła został wysłany na podany adres email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Jeśli nie widzisz wiadomości w skrzynce odbiorczej, sprawdź folder spam.
            </p>
          </div>

          <Button onClick={handleBackToRequest} variant="outline" className="w-full">
            Wyślij ponownie
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleBackToLogin}
              className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              ← Powrót do logowania
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
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Ustaw nowe hasło</CardTitle>
        <CardDescription className="text-center">Wprowadź nowe hasło dla swojego konta</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleResetSubmit(onResetSubmit)} className="space-y-4">
          {/* Pole Hasło */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Nowe hasło *
            </Label>
            <Input
              {...resetRegister("password")}
              type="password"
              id="password"
              placeholder="Minimum 8 znaków, wielkie i małe litery"
              disabled={isLoading || resetIsSubmitting}
              className={resetErrors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
              autoComplete="new-password"
            />
            {resetErrors.password && (
              <p className="text-sm text-red-600 dark:text-red-400">{resetErrors.password.message}</p>
            )}
          </div>

          {/* Pole Potwierdzenie hasła */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Potwierdź nowe hasło *
            </Label>
            <Input
              {...resetRegister("confirmPassword")}
              type="password"
              id="confirmPassword"
              placeholder="Powtórz nowe hasło"
              disabled={isLoading || resetIsSubmitting}
              className={resetErrors.confirmPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
              autoComplete="new-password"
            />
            {resetErrors.confirmPassword && (
              <p className="text-sm text-red-600 dark:text-red-400">{resetErrors.confirmPassword.message}</p>
            )}
          </div>

          {/* Błędy API */}
          {apiError && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3">
              <p className="text-sm text-red-800 dark:text-red-200">{apiError}</p>
            </div>
          )}

          {/* Przycisk Submit */}
          <Button type="submit" className="w-full" disabled={isLoading || resetIsSubmitting}>
            {isLoading || resetIsSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Aktualizowanie hasła...
              </>
            ) : (
              "Ustaw nowe hasło"
            )}
          </Button>
        </form>

        {/* Link powrotu do logowania */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={handleBackToLogin}
            className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            ← Powrót do logowania
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResetPasswordForm;
