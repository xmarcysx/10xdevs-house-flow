import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "../../../db/supabase.client";
import { registerSchema } from "../../../lib/validation/auth.validation";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { email, password } = await request.json();

    // Walidacja danych wejściowych
    const validationResult = registerSchema.safeParse({ email, password, confirmPassword: password });
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: validationResult.error.issues[0].message
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const supabase = createSupabaseServerInstance({
      cookies,
      headers: request.headers,
    });

    const { data, error } = await supabase.auth.signUp({
      email: validationResult.data.email,
      password: validationResult.data.password,
      options: {
        data: {
          // Możemy dodać dodatkowe dane użytkownika jeśli potrzebne
        }
      }
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Jeśli rejestracja się udała, dodaj użytkownika do lokalnej tabeli users
    // aby trigger create_default_categories zadziałał
    // password_hash jest null ponieważ używamy Supabase Auth
    if (data.user) {
      try {
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email,
            password_hash: null, // Supabase Auth zarządza hasłami
          });

        if (insertError) {
          console.error('Error inserting user to local table:', insertError);
          // Nie przerywamy rejestracji jeśli dodanie do lokalnej tabeli się nie powiedzie
          // Użytkownik i tak jest zarejestrowany w Supabase Auth
        }
      } catch (insertError) {
        console.error('Error inserting user to local table:', insertError);
        // Kontynuujemy - użytkownik jest zarejestrowany w Supabase Auth
      }
    }

    // Automatycznie zaloguj użytkownika po rejestracji
    console.log("Auto-login after registration...");
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: validationResult.data.email,
      password: validationResult.data.password,
    });

    if (loginError) {
      console.error("Auto-login failed:", loginError);
      // Jeśli automatyczne logowanie się nie powiedzie, zwróć tylko dane rejestracji
      return new Response(JSON.stringify({
        user: data.user,
        autoLoginFailed: true
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("Auto-login successful, user:", loginData.user?.email, "session exists:", !!loginData.session);

    return new Response(JSON.stringify({
      user: data.user,
      session: loginData.session,
      autoLoggedIn: true
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Register error:", error);
    return new Response(JSON.stringify({ error: "Wystąpił błąd podczas rejestracji" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
