import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "../../../db/supabase.client";
import { resetPasswordSchema } from "../../../lib/validation/auth.validation";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { email } = await request.json();

    // Walidacja danych wejściowych
    const validationResult = resetPasswordSchema.safeParse({ email });
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

    const { error } = await supabase.auth.resetPasswordForEmail(
      validationResult.data.email,
      {
        redirectTo: `${new URL(request.url).origin}/reset-password`,
      }
    );

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Link do resetowania hasła został wysłany na Twój adres email"
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return new Response(JSON.stringify({ error: "Wystąpił błąd podczas wysyłania linku resetowania" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
