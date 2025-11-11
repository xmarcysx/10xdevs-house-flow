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
  },
  adapter: cloudflare({
    platformProxy: {
      // Enable platform proxy to access Node.js globals
      persist: true,
    },
  }),
});
