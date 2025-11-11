// @ts-check
import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  output: "server", // Server-side rendering for API routes
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    define: {
      global: "globalThis",
    },
    build: {
      rollupOptions: {
        output: {
          banner: `
            // MessageChannel polyfill for Cloudflare Workers
            if (typeof MessageChannel === 'undefined') {
              globalThis.MessageChannel = function() {
                return {
                  port1: { postMessage: function() {}, addEventListener: function() {}, removeEventListener: function() {}, close: function() {} },
                  port2: { postMessage: function() {}, addEventListener: function() {}, removeEventListener: function() {}, close: function() {} }
                };
              };
            }
          `,
        },
      },
    },
    optimizeDeps: {
      // exclude: ["react-dom/server"], // Removed for React 19 compatibility
    },
  },
  adapter: cloudflare({
    compatibilityFlags: ["nodejs_compat"],
  }),
});
