// Komponent formularza logowania dla użytkowników HouseFlow
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../lib/hooks/useAuth";
import { loginSchema } from "../lib/validation/auth.validation";
import type { LoginViewModel } from "../types";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const LoginForm: React.FC = () => {
  const { login, resetPassword, isLoading, error: apiError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  } = useForm<LoginViewModel>({
    resolver: zodResolver(loginSchema),
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
    window.location.href = "/reset-password";
  };

  const handleRegisterRedirect = () => {
    // TODO: Przekierowanie do  rejestracji
    window.location.href = "/register";
  };

  return (
    <Card className="w-full border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg shadow-2xl rounded-3xl transform transition-all duration-300 hover:shadow-3xl">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl text-center font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
          Logowanie
        </CardTitle>
        <CardDescription className="text-center text-gray-600 dark:text-gray-400">
          Wprowadź swoje dane aby się zalogować
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Pole Email */}
          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
              </svg>
              Adres email *
            </Label>
            <Input
              {...register("email")}
              type="email"
              id="email"
              placeholder="twoj@email.com"
              disabled={isLoading || isSubmitting}
              className={`h-12 rounded-xl border-2 transition-all duration-200 ${
                errors.email
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50 dark:bg-red-900/20"
                  : "border-gray-200 focus:border-blue-400 focus:ring-blue-200 dark:border-gray-700 dark:focus:border-blue-500 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Pole Hasło */}
          <div className="space-y-3">
            <Label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              Hasło *
            </Label>
            <Input
              {...register("password")}
              type="password"
              id="password"
              placeholder="Wprowadź hasło"
              disabled={isLoading || isSubmitting}
              className={`h-12 rounded-xl border-2 transition-all duration-200 ${
                errors.password
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50 dark:bg-red-900/20"
                  : "border-gray-200 focus:border-green-400 focus:ring-green-200 dark:border-gray-700 dark:focus:border-green-500 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
                {errors.password.message}
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
            disabled={isLoading || isSubmitting}
          >
            {isLoading || isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Logowanie...
              </>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                </svg>
                Zaloguj się
              </span>
            )}
          </Button>
        </form>

        {/* Linki pomocnicze */}
        <div className="mt-8 space-y-4">
          <div className="text-center">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200 inline-flex items-center gap-1 hover:underline"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
              </svg>
              Zapomniałeś hasła?
            </button>
          </div>
          <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Nie masz konta?{" "}
              <button
                type="button"
                onClick={handleRegisterRedirect}
                className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200 inline-flex items-center gap-1"
              >
                Zarejestruj się
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </button>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
