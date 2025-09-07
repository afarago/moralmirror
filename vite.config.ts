import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
        svgoConfig: {
          floatPrecision: 2,
        },
      },
      include: "**/*.svg?react",
      exclude: "",
    }),
  ],
  build: {
    outDir: "dist",
    sourcemap: false,
    // assetsInlineLimit: 40960,
    minify: "esbuild",
  },
  esbuild: {
    // This option removes legal comments
    legalComments: "none",
  },
  server: {
    // hot: true,
    // host: true,
    // port: 5173,
  },
  preview: {
    port: 6173,
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler", // or "modern"
        silenceDeprecations: [
          "mixed-decls",
          "color-functions",
          "global-builtin",
          "import",
        ],
      },
    },
  },
  assetsInclude: ["**/*.webp", "**/*.svg", "**/*.png"],
});
