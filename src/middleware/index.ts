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

  // IMPORTANT: Always get user session first before any other operations
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    context.locals.user = {
      email: user.email,
      id: user.id,
    };

    // Redirect logged-in users away from auth pages
    if (AUTH_ROUTES.includes(context.url.pathname)) {
      return context.redirect('/');
    }
  } else if (!PUBLIC_PATHS.includes(context.url.pathname)) {
    // Redirect to login for protected routes
    return context.redirect('/login');
  }

  return next();
});
