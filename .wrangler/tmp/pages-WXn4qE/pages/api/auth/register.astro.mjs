globalThis.process ??= {}; globalThis.process.env ??= {};
import { c as createSupabaseServerInstance } from '../../../chunks/supabase.client_Bi6fAPfN.mjs';
import { r as registerSchema } from '../../../chunks/auth.validation_CrA6CCPv.mjs';
export { r as renderers } from '../../../chunks/_@astro-renderers_B70jUmW-.mjs';

const prerender = false;
const POST = async ({ request, cookies }) => {
  try {
    const { firstName, lastName, email, password } = await request.json();
    const validationResult = registerSchema.safeParse({
      firstName,
      lastName,
      email,
      password,
      confirmPassword: password
    });
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
    const { data, error } = await supabase.auth.signUp({
      email: validationResult.data.email,
      password: validationResult.data.password,
      options: {
        data: {
          first_name: validationResult.data.firstName,
          last_name: validationResult.data.lastName
        }
      }
    });
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (data.user) {
      try {
        const { error: insertError } = await supabase.from("users").insert({
          id: data.user.id,
          email: data.user.email,
          first_name: validationResult.data.firstName,
          last_name: validationResult.data.lastName,
          password_hash: null
          // Supabase Auth zarządza hasłami
        });
        if (insertError) {
          console.error("Error inserting user to local table:", insertError);
        }
      } catch (insertError) {
        console.error("Error inserting user to local table:", insertError);
      }
    }
    console.log("Auto-login after registration...");
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: validationResult.data.email,
      password: validationResult.data.password
    });
    if (loginError) {
      console.error("Auto-login failed:", loginError);
      return new Response(
        JSON.stringify({
          user: data.user,
          autoLoginFailed: true
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    console.log("Auto-login successful, user:", loginData.user?.email, "session exists:", !!loginData.session);
    return new Response(
      JSON.stringify({
        user: data.user,
        session: loginData.session,
        autoLoggedIn: true
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Register error:", error);
    return new Response(JSON.stringify({ error: "Wystąpił błąd podczas rejestracji" }), {
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
