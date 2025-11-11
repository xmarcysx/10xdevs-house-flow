globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createSupabaseServerInstance } from '../../../chunks/supabase.client_Bi6fAPfN.mjs';
import { a as resetPasswordSchema } from '../../../chunks/auth.validation_CrA6CCPv.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_B70jUmW-.mjs';

const prerender = false;
const POST = async ({ request, cookies }) => {
  try {
    const { email } = await request.json();
    const validationResult = resetPasswordSchema.safeParse({ email });
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: validationResult.error.issues[0].message
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    const supabase = createSupabaseServerInstance({
      cookies,
      headers: request.headers
    });
    const { error } = await supabase.auth.resetPasswordForEmail(validationResult.data.email, {
      redirectTo: `${new URL(request.url).origin}/reset-password`
    });
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(
      JSON.stringify({
        success: true,
        message: "Link do resetowania hasła został wysłany na Twój adres email"
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return new Response(JSON.stringify({ error: "Wystąpił błąd podczas wysyłania linku resetowania" }), {
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
