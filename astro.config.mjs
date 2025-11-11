// @ts-check
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

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
    mode: "directory",
    functionPerRoute: false,
  }),
});
