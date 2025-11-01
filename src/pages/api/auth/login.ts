import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "../../../db/supabase.client";
import { loginSchema } from "../../../lib/validation/auth.validation";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { email, password } = await request.json();

    // Walidacja danych wejściowych
    const validationResult = loginSchema.safeParse({ email, password });
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

    const { data, error } = await supabase.auth.signInWithPassword({
      email: validationResult.data.email,
      password: validationResult.data.password,
    });

    if (error) {
      console.error("Login error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("Login successful, user:", data.user?.email, "session exists:", !!data.session);

    // Aktualizuj last_login w tabeli users (jeśli kolumny istnieją)
    if (data.user) {
      try {
        const { error: updateError } = await supabase
          .from('users')
          .update({
            last_login: new Date().toISOString()
          })
          .eq('id', data.user.id);

        if (updateError) {
          console.error('Error updating last_login:', updateError);
          // Nie przerywamy logowania jeśli aktualizacja się nie powiedzie
          // Kolumna może jeszcze nie istnieć
        }
      } catch (updateError) {
        console.error('Error updating last_login:', updateError);
        // Kontynuujemy - użytkownik jest zalogowany
      }
    }

    return new Response(JSON.stringify({
      user: data.user,
      session: data.session
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Login error:", error);
    return new Response(JSON.stringify({ error: "Wystąpił błąd podczas logowania" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
