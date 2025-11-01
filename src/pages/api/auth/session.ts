import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "../../../db/supabase.client";

export const prerender = false;

export const GET: APIRoute = async ({ cookies, request }) => {
  try {
    const supabase = createSupabaseServerInstance({
      cookies,
      headers: request.headers,
    });

    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ user: session?.user ?? null, session }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Session error:", error);
    return new Response(JSON.stringify({ error: "Wystąpił błąd podczas pobierania sesji" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
