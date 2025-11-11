
            // MessageChannel polyfill for Cloudflare Workers
            if (typeof MessageChannel === 'undefined') {
              globalThis.MessageChannel = function() {
                return {
                  port1: { postMessage: function() {}, addEventListener: function() {}, removeEventListener: function() {}, close: function() {} },
                  port2: { postMessage: function() {}, addEventListener: function() {}, removeEventListener: function() {}, close: function() {} }
                };
              };
            }
          
import { o as objectType, l as stringType, n as unionType, p as instanceOfType, q as nullType } from './astro/server_G7LsiH47.mjs';

const loginSchema = objectType({
  email: stringType().min(1, "Adres email jest wymagany").email("Podaj prawidłowy adres email").max(254, "Adres email może mieć maksymalnie 254 znaki"),
  password: stringType().min(1, "Hasło jest wymagane").max(128, "Hasło może mieć maksymalnie 128 znaków")
});
const registerSchema = objectType({
  firstName: stringType().min(1, "Imię jest wymagane").min(2, "Imię musi mieć przynajmniej 2 znaki").max(50, "Imię może mieć maksymalnie 50 znaków").regex(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]+$/, "Imię może zawierać tylko litery"),
  lastName: stringType().min(1, "Nazwisko jest wymagane").min(2, "Nazwisko musi mieć przynajmniej 2 znaki").max(50, "Nazwisko może mieć maksymalnie 50 znaków").regex(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]+$/, "Nazwisko może zawierać tylko litery"),
  email: stringType().min(1, "Adres email jest wymagany").email("Podaj prawidłowy adres email").max(254, "Adres email może mieć maksymalnie 254 znaki"),
  password: stringType().min(8, "Hasło musi mieć przynajmniej 8 znaków").max(128, "Hasło może mieć maksymalnie 128 znaków").regex(/^(?=.*[a-z])(?=.*[A-Z])/, "Hasło musi zawierać przynajmniej jedną małą i jedną wielką literę"),
  confirmPassword: stringType().min(1, "Potwierdzenie hasła jest wymagane")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Hasła nie są identyczne",
  path: ["confirmPassword"]
});
const resetPasswordSchema = objectType({
  email: stringType().min(1, "Adres email jest wymagany").email("Podaj prawidłowy adres email").max(254, "Adres email może mieć maksymalnie 254 znaki")
});
objectType({
  password: stringType().min(8, "Hasło musi mieć przynajmniej 8 znaków").max(128, "Hasło może mieć maksymalnie 128 znaków").regex(/^(?=.*[a-z])(?=.*[A-Z])/, "Hasło musi zawierać przynajmniej jedną małą i jedną wielką literę"),
  confirmPassword: stringType().min(1, "Potwierdzenie hasła jest wymagane")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Hasła nie są identyczne",
  path: ["confirmPassword"]
});
const settingsSchema = objectType({
  firstName: stringType().min(1, "Imię jest wymagane").min(2, "Imię musi mieć przynajmniej 2 znaki").max(50, "Imię może mieć maksymalnie 50 znaków").regex(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]+$/, "Imię może zawierać tylko litery"),
  lastName: stringType().min(1, "Nazwisko jest wymagane").min(2, "Nazwisko musi mieć przynajmniej 2 znaki").max(50, "Nazwisko może mieć maksymalnie 50 znaków").regex(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]+$/, "Nazwisko może zawierać tylko litery"),
  avatar: unionType([instanceOfType(File), nullType()]).optional().refine((file) => !file || file.size <= 5 * 1024 * 1024, "Rozmiar pliku nie może przekraczać 5MB").refine(
    (file) => !file || ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type),
    "Dozwolone formaty: JPEG, PNG, WebP"
  )
});

export { resetPasswordSchema as a, loginSchema as l, registerSchema as r, settingsSchema as s };
