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
      // Define MessageChannel as undefined to prevent React from using it during build
      MessageChannel: "undefined",
      "globalThis.MessageChannel": "undefined",
    },
    optimizeDeps: {
      exclude: ["react-dom/server"],
    },
  },
  adapter: cloudflare({
    platformProxy: {
      // Enable platform proxy to access Node.js globals
      persist: true,
    },
  }),
});
