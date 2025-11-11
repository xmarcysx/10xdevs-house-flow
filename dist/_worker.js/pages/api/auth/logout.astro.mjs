globalThis.process ??= {}; globalThis.process.env ??= {};
import { createSupabaseServerInstance } from '../../../chunks/supabase.client_ledu3tKm.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_JyCnA0Wd.mjs';

const prerender = false;
const POST = async ({ cookies, request }) => {
  try {
    const supabase = createSupabaseServerInstance({
      cookies,
      headers: request.headers
    });
    const { error } = await supabase.auth.signOut();
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Logout error:", error);
    return new Response(JSON.stringify({ error: "Wystąpił błąd podczas wylogowywania" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
