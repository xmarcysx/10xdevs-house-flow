import { z } from "zod";

// Schemat walidacji dla formularza logowania
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Adres email jest wymagany")
    .email("Podaj prawidłowy adres email")
    .max(254, "Adres email może mieć maksymalnie 254 znaki"),
  password: z.string().min(1, "Hasło jest wymagane").max(128, "Hasło może mieć maksymalnie 128 znaków"),
});

// Schemat walidacji dla formularza rejestracji
export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "Imię jest wymagane")
      .min(2, "Imię musi mieć przynajmniej 2 znaki")
      .max(50, "Imię może mieć maksymalnie 50 znaków")
      .regex(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]+$/, "Imię może zawierać tylko litery"),
    lastName: z
      .string()
      .min(1, "Nazwisko jest wymagane")
      .min(2, "Nazwisko musi mieć przynajmniej 2 znaki")
      .max(50, "Nazwisko może mieć maksymalnie 50 znaków")
      .regex(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]+$/, "Nazwisko może zawierać tylko litery"),
    email: z
      .string()
      .min(1, "Adres email jest wymagany")
      .email("Podaj prawidłowy adres email")
      .max(254, "Adres email może mieć maksymalnie 254 znaki"),
    password: z
      .string()
      .min(8, "Hasło musi mieć przynajmniej 8 znaków")
      .max(128, "Hasło może mieć maksymalnie 128 znaków")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])/, "Hasło musi zawierać przynajmniej jedną małą i jedną wielką literę"),
    confirmPassword: z.string().min(1, "Potwierdzenie hasła jest wymagane"),
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
      .regex(/^(?=.*[a-z])(?=.*[A-Z])/, "Hasło musi zawierać przynajmniej jedną małą i jedną wielką literę"),
    confirmPassword: z.string().min(1, "Potwierdzenie hasła jest wymagane"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła nie są identyczne",
    path: ["confirmPassword"],
  });

// Schemat walidacji dla formularza ustawień
export const settingsSchema = z.object({
  firstName: z
    .string()
    .min(1, "Imię jest wymagane")
    .min(2, "Imię musi mieć przynajmniej 2 znaki")
    .max(50, "Imię może mieć maksymalnie 50 znaków")
    .regex(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]+$/, "Imię może zawierać tylko litery"),
  lastName: z
    .string()
    .min(1, "Nazwisko jest wymagane")
    .min(2, "Nazwisko musi mieć przynajmniej 2 znaki")
    .max(50, "Nazwisko może mieć maksymalnie 50 znaków")
    .regex(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]+$/, "Nazwisko może zawierać tylko litery"),
  avatar: z
    .union([z.instanceof(File), z.null()])
    .optional()
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, "Rozmiar pliku nie może przekraczać 5MB")
    .refine(
      (file) => !file || ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type),
      "Dozwolone formaty: JPEG, PNG, WebP"
    ),
});

// Typy wywnioskowane ze schematów
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type SettingsFormData = z.infer<typeof settingsSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type NewPasswordFormData = z.infer<typeof newPasswordSchema>;
