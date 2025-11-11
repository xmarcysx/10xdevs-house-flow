// Polyfills for Cloudflare Workers environment

// MessageChannel polyfill is now handled in astro.config.mjs rollup banner
// This file remains for any additional polyfills that might be needed

// Ensure global is available
if (typeof global === 'undefined') {
  (globalThis as any).global = globalThis;
}
