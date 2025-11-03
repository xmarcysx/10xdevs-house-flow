// Komponent formularza rejestracyjnego dla użytkowników HouseFlow
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { useRegister } from "../lib/hooks/useRegister";
import type { RegisterFormData } from "../types";
import { registerSchema } from "../lib/validation/auth.validation";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";


const RegisterForm: React.FC = () => {
  const { register: registerUser, isLoading, error: apiError } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data);
      reset();
    } catch (error) {
      // Błąd jest już obsługiwany w hooku useRegister
      console.error("Registration failed:", error);
    }
  };

  return (
    <Card className="w-full border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg shadow-2xl rounded-3xl transform transition-all duration-300 hover:shadow-3xl">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl text-center font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
          Rejestracja
        </CardTitle>
        <CardDescription className="text-center text-gray-600 dark:text-gray-400">
          Wypełnij formularz aby utworzyć konto w HouseFlow
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
              placeholder="Minimum 8 znaków, wielkie i małe litery"
              disabled={isLoading || isSubmitting}
              className={`h-12 rounded-xl border-2 transition-all duration-200 ${
                errors.password
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50 dark:bg-red-900/20"
                  : "border-gray-200 focus:border-green-400 focus:ring-green-200 dark:border-gray-700 dark:focus:border-green-500 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
              autoComplete="new-password"
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

          {/* Pole Potwierdzenie hasła */}
          <div className="space-y-3">
            <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Potwierdź hasło *
            </Label>
            <Input
              {...register("confirmPassword")}
              type="password"
              id="confirmPassword"
              placeholder="Powtórz hasło"
              disabled={isLoading || isSubmitting}
              className={`h-12 rounded-xl border-2 transition-all duration-200 ${
                errors.confirmPassword
                  ? "border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50 dark:bg-red-900/20"
                  : "border-gray-200 focus:border-purple-400 focus:ring-purple-200 dark:border-gray-700 dark:focus:border-purple-500 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
                {errors.confirmPassword.message}
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
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={isLoading || isSubmitting}
          >
            {isLoading || isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Tworzenie konta...
              </>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                </svg>
                Zarejestruj się
              </span>
            )}
          </Button>
        </form>

        {/* Link do logowania */}
        <div className="mt-8 text-center pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Masz już konto?{" "}
            <a
              href="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-200 inline-flex items-center gap-1"
            >
              Zaloguj się
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
