import type { APIContext } from "astro";

/**
 * Sprawdza autoryzację użytkownika dla API endpointów
 * @param context - kontekst Astro API
 * @returns obiekt z użytkownikiem lub null jeśli nieautoryzowany
 */
export async function checkAuth(context: APIContext) {
  const supabase = context.locals.supabase;
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user ?? null;
}

/**
 * Sprawdza autoryzację i zwraca odpowiedź 401 jeśli użytkownik nie jest zalogowany
 * @param context - kontekst Astro API
 * @returns użytkownik lub Response z błędem 401
 */
export async function requireAuth(context: APIContext): Promise<{ user: any } | Response> {
  const user = await checkAuth(context);

  if (!user) {
    return new Response(JSON.stringify({ message: "Brak autoryzacji" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  return { user };
}
