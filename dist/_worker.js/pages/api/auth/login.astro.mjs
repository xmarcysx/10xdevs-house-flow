
            // MessageChannel polyfill for Cloudflare Workers
            if (typeof MessageChannel === 'undefined') {
              globalThis.MessageChannel = function() {
                return {
                  port1: { postMessage: function() {}, addEventListener: function() {}, removeEventListener: function() {}, close: function() {} },
                  port2: { postMessage: function() {}, addEventListener: function() {}, removeEventListener: function() {}, close: function() {} }
                };
              };
            }
          
import { c as createSupabaseServerInstance } from '../../../chunks/supabase.client_Duah9mdn.mjs';
import { l as loginSchema } from '../../../chunks/auth.validation_BOy_GanA.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_BVqCE940.mjs';

const prerender = false;
const POST = async ({ request, cookies }) => {
  try {
    const { email, password } = await request.json();
    const validationResult = loginSchema.safeParse({ email, password });
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
    const { data, error } = await supabase.auth.signInWithPassword({
      email: validationResult.data.email,
      password: validationResult.data.password
    });
    if (error) {
      console.error("Login error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    console.log("Login successful, user:", data.user?.email, "session exists:", !!data.session);
    if (data.user) {
      try {
        const { error: updateError } = await supabase.from("users").update({
          last_login: (/* @__PURE__ */ new Date()).toISOString()
        }).eq("id", data.user.id);
        if (updateError) {
          console.error("Error updating last_login:", updateError);
        }
      } catch (updateError) {
        console.error("Error updating last_login:", updateError);
      }
    }
    return new Response(
      JSON.stringify({
        user: data.user,
        session: data.session
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    return new Response(JSON.stringify({ error: "Wystąpił błąd podczas logowania" }), {
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
