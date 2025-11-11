globalThis.process ??= {}; globalThis.process.env ??= {};
import { d as defineMiddleware, s as sequence } from './chunks/index_D35fT-Gv.mjs';
import { createSupabaseServerInstance } from './chunks/supabase.client_ledu3tKm.mjs';
import './chunks/astro-designed-error-pages_xkw8gMu4.mjs';
import './chunks/astro/server_ae_hJQlB.mjs';
import './chunks/index_B7Oa2Wn_.mjs';

const PUBLIC_PATHS = [
  // Server-Rendered Astro Pages
  "/guest",
  "/login",
  "/register",
  "/reset-password",
  // Auth API endpoints
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/reset-password",
  "/api/auth/session",
  "/api/auth/logout"
];
const onRequest$2 = defineMiddleware(async (context, next) => {
  const supabase = createSupabaseServerInstance({
    cookies: context.cookies,
    headers: context.request.headers
  });
  context.locals.supabase = supabase;
  if (PUBLIC_PATHS.includes(context.url.pathname)) {
    return next();
  }
  if (context.url.pathname.startsWith("/api/")) {
    return next();
  }
  return next();
});

const onRequest$1 = (context, next) => {
  if (context.isPrerendered) {
    context.locals.runtime ??= {
      env: process.env
    };
  }
  return next();
};

const onRequest = sequence(
	onRequest$1,
	onRequest$2
	
);

export { onRequest };
