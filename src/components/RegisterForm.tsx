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
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Rejestracja</CardTitle>
        <CardDescription className="text-center">Wypełnij formularz aby utworzyć konto w HouseFlow</CardDescription>
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
              placeholder="Minimum 8 znaków, wielkie i małe litery"
              disabled={isLoading || isSubmitting}
              className={errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
              autoComplete="new-password"
            />
            {errors.password && <p className="text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>}
          </div>

          {/* Pole Potwierdzenie hasła */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Potwierdź hasło *
            </Label>
            <Input
              {...register("confirmPassword")}
              type="password"
              id="confirmPassword"
              placeholder="Powtórz hasło"
              disabled={isLoading || isSubmitting}
              className={errors.confirmPassword ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>
            )}
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
                Tworzenie konta...
              </>
            ) : (
              "Zarejestruj się"
            )}
          </Button>
        </form>

        {/* Link do logowania */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Masz już konto?{" "}
            <a
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Zaloguj się
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
