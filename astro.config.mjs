// @ts-check
import { defineConfig } from "astro/config";

import node from "@astrojs/node";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  output: "server", // Server-side rendering for API routes
  integrations: [react(), sitemap()],
  server: { port: 4321 }, // Default Astro port
  vite: {
    plugins: [tailwindcss()],
  },
  adapter: node({
    mode: "standalone",
  }),
});
