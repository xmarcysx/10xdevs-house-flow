
            // MessageChannel polyfill for Cloudflare Workers
            if (typeof MessageChannel === 'undefined') {
              globalThis.MessageChannel = function() {
                return {
                  port1: { postMessage: function() {}, addEventListener: function() {}, removeEventListener: function() {}, close: function() {} },
                  port2: { postMessage: function() {}, addEventListener: function() {}, removeEventListener: function() {}, close: function() {} }
                };
              };
            }
          
import { d as defineMiddleware, s as sequence } from './chunks/index_C-AMDxAb.mjs';
import { c as createSupabaseServerInstance } from './chunks/supabase.client_Duah9mdn.mjs';
import './chunks/astro-designed-error-pages_D2ODY06R.mjs';
import './chunks/astro/server_G7LsiH47.mjs';
import './chunks/index_2cyjVTDh.mjs';

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
