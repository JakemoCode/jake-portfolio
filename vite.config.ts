/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { configDefaults } from "vitest/config";

// Injects a <link rel="preload"> for the above-the-fold hero font using the
// hashed filename Vite emits, so the preload URL can never drift from the
// @font-face URL. Build-only: the dev server serves fonts unhashed from
// node_modules, and a stale preload there would just warn in the console.
function preloadHeroFont(): Plugin {
  return {
    name: "preload-hero-font",
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        if (!ctx.bundle) return html;
        const asset = Object.values(ctx.bundle).find(
          (chunk) =>
            chunk.type === "asset" &&
            /bricolage-grotesque-latin-wght-normal-[^/]*\.woff2$/.test(
              chunk.fileName,
            ),
        );
        if (!asset) return html;
        return {
          html,
          tags: [
            {
              tag: "link",
              attrs: {
                rel: "preload",
                as: "font",
                type: "font/woff2",
                href: `/${asset.fileName}`,
                crossorigin: "",
              },
              injectTo: "head-prepend",
            },
          ],
        };
      },
    },
  };
}

export default defineConfig({
  plugins: [react(), preloadHeroFont()],
  test: {
    environment: "jsdom",
    exclude: [...configDefaults.exclude, "_archive/**"],
  },
});
