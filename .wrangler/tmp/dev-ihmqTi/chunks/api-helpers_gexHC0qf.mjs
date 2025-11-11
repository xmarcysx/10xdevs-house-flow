globalThis.process ??= {}; globalThis.process.env ??= {};
async function checkAuth(context) {
  const supabase = context.locals.supabase;
  const {
    data: { session }
  } = await supabase.auth.getSession();
  return session?.user ?? null;
}
async function requireAuth(context) {
  const user = await checkAuth(context);
  if (!user) {
    return new Response(JSON.stringify({ message: "Brak autoryzacji" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  return { user };
}

export { requireAuth as r };
