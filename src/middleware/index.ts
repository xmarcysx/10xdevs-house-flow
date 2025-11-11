import { defineMiddleware } from "astro:middleware";
import { createSupabaseServerInstance } from "../db/supabase.client.ts";

// Public paths - Auth API endpoints & Server-Rendered Astro Pages
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
  "/api/auth/logout",
];

// Auth routes that should redirect logged-in users to dashboard
const AUTH_ROUTES = ["/login", "/register"];

export const onRequest = defineMiddleware(async (context, next) => {
  // Create Supabase instance for server-side operations
  const supabase = createSupabaseServerInstance({
    cookies: context.cookies,
    headers: context.request.headers,
  });

  context.locals.supabase = supabase;

  // Skip auth check for public paths
  if (PUBLIC_PATHS.includes(context.url.pathname)) {
    return next();
  }

  // For API routes, authentication is handled by individual endpoints
  // This prevents the ResponseSentError when Supabase tries to set cookies
  if (context.url.pathname.startsWith("/api/")) {
    return next();
  }

  // For pages, let them render and handle auth on client side
  // This prevents redirect loops and auth errors on page load
  return next();
});
