globalThis.process ??= {}; globalThis.process.env ??= {};
import { createSupabaseServerInstance } from '../../../chunks/supabase.client_ledu3tKm.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_JyCnA0Wd.mjs';

const prerender = false;
const GET = async ({ cookies, request }) => {
  try {
    const supabase = createSupabaseServerInstance({
      cookies,
      headers: request.headers
    });
    const {
      data: { session },
      error
    } = await supabase.auth.getSession();
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ user: session?.user ?? null, session }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Session error:", error);
    return new Response(JSON.stringify({ error: "Wystąpił błąd podczas pobierania sesji" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
