
            // MessageChannel polyfill for Cloudflare Workers
            if (typeof MessageChannel === 'undefined') {
              globalThis.MessageChannel = function() {
                return {
                  port1: { postMessage: function() {}, addEventListener: function() {}, removeEventListener: function() {}, close: function() {} },
                  port2: { postMessage: function() {}, addEventListener: function() {}, removeEventListener: function() {}, close: function() {} }
                };
              };
            }
          
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
