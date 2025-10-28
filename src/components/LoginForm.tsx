// Komponent formularza logowania dla użytkowników HouseFlow
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useAuth } from "../lib/hooks/useAuth";
import type { LoginViewModel } from "../types";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

// Schemat walidacji dla formularza logowania
const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, "Adres email jest wymagany")
    .email("Podaj prawidłowy adres email")
    .max(254, "Adres email może mieć maksymalnie 254 znaki"),
  password: z.string().min(1, "Hasło jest wymagane").max(128, "Hasło może mieć maksymalnie 128 znaków"),
});

const LoginForm: React.FC = () => {
  const { login, resetPassword, isLoading, error: apiError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginViewModel>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginViewModel) => {
    try {
      await login(data);
      reset();
      // TODO: Przekierowanie do dashboardu po pomyślnym logowaniu
    } catch (error) {
      // Błąd jest już obsługiwany w hooku useAuth
      console.error("Login failed:", error);
    }
  };

  const handleForgotPassword = async () => {
    const email = getValues("email");
    if (!email) {
      // Jeśli email nie jest wprowadzony, pokaż komunikat
      toast.error("Wprowadź adres email, aby zresetować hasło");
      return;
    }

    try {
      await resetPassword(email);
    } catch (error) {
      // Błąd jest już obsługiwany w hooku useAuth
      console.error("Forgot password failed:", error);
    }
  };

  const handleRegisterRedirect = () => {
    // TODO: Przekierowanie do strony rejestracji
    window.location.href = "/register";
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Logowanie</CardTitle>
        <CardDescription className="text-center">Wprowadź swoje dane aby się zalogować</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Pole Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Adres email *
            </Label>
            <Input
              {...register("email")}
              type="email"
              id="email"
              placeholder="twoj@email.com"
              disabled={isLoading || isSubmitting}
              className={errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
              autoComplete="email"
            />
            {errors.email && <p className="text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>}
          </div>

          {/* Pole Hasło */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Hasło *
            </Label>
            <Input
              {...register("password")}
              type="password"
              id="password"
              placeholder="Wprowadź hasło"
              disabled={isLoading || isSubmitting}
              className={errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
              autoComplete="current-password"
            />
            {errors.password && <p className="text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>}
          </div>

          {/* Błędy API */}
          {apiError && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3">
              <p className="text-sm text-red-800 dark:text-red-200">{apiError}</p>
            </div>
          )}

          {/* Przycisk Submit */}
          <Button type="submit" className="w-full" disabled={isLoading || isSubmitting}>
            {isLoading || isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Logowanie...
              </>
            ) : (
              "Zaloguj się"
            )}
          </Button>
        </form>

        {/* Linki pomocnicze */}
        <div className="mt-6 space-y-2">
          <div className="text-center">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Zapomniałeś hasła?
            </button>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Nie masz konta?{" "}
              <button
                type="button"
                onClick={handleRegisterRedirect}
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                Zarejestruj się
              </button>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
