import { z } from "zod";

// Schemat walidacji dla formularza logowania
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Adres email jest wymagany")
    .email("Podaj prawidłowy adres email")
    .max(254, "Adres email może mieć maksymalnie 254 znaki"),
  password: z
    .string()
    .min(1, "Hasło jest wymagane")
    .max(128, "Hasło może mieć maksymalnie 128 znaków"),
});

// Schemat walidacji dla formularza rejestracji
export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, "Adres email jest wymagany")
      .email("Podaj prawidłowy adres email")
      .max(254, "Adres email może mieć maksymalnie 254 znaki"),
    password: z
      .string()
      .min(8, "Hasło musi mieć przynajmniej 8 znaków")
      .max(128, "Hasło może mieć maksymalnie 128 znaków")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])/,
        "Hasło musi zawierać przynajmniej jedną małą i jedną wielką literę"
      ),
    confirmPassword: z
      .string()
      .min(1, "Potwierdzenie hasła jest wymagane"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła nie są identyczne",
    path: ["confirmPassword"],
  });

// Schemat walidacji dla resetowania hasła
export const resetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Adres email jest wymagany")
    .email("Podaj prawidłowy adres email")
    .max(254, "Adres email może mieć maksymalnie 254 znaki"),
});

// Schemat walidacji dla nowego hasła (po kliknięciu linku resetowania)
export const newPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Hasło musi mieć przynajmniej 8 znaków")
      .max(128, "Hasło może mieć maksymalnie 128 znaków")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])/,
        "Hasło musi zawierać przynajmniej jedną małą i jedną wielką literę"
      ),
    confirmPassword: z
      .string()
      .min(1, "Potwierdzenie hasła jest wymagane"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła nie są identyczne",
    path: ["confirmPassword"],
  });

// Typy wywnioskowane ze schematów
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type NewPasswordFormData = z.infer<typeof newPasswordSchema>;
