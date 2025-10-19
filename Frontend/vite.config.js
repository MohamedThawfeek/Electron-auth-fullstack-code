import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import { VitePWA } from "vite-plugin-pwa";
import compression from "vite-plugin-compression2";
import dns from "dns";
import path from "path";
import { execSync } from "child_process";

dns.setDefaultResultOrder("verbatim");

function getGitInfo(command) {
  try {
    return execSync(command).toString().trim();
  } catch (error) {
    console.warn(`Failed to get Git info with command "${command}"`);
    return "unknown";
  }
}

export default defineConfig({
  build: {
    outDir: "dist",
    assetsDir: "@/assets",
    rollupOptions: {},
    chunkSizeWarningLimit: 10 * 1024,
  },
  plugins: [
    react(),
    cssInjectedByJsPlugin(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: false,
        type: "module",
        navigateFallback: "index.html",
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
      },
      includeAssets: ["**/*", "favicon.ico"],
      manifest: [
        {
          display: "standalone",
          orientation: "portrait",
          scope: ".",
          start_url: ".",
          id: ".",
          short_name: "Sanas Admin Dashboard Website",
          name: "Sanas Dashboard : React Admin Dashboard",
          description: "Sanas Dashboard : React Admin Dashboard",
          icons: [
            {
              src: "favicon.ico",
              sizes: "48x48",
              type: "image/x-icon",
            },
          ],
        },
      ],
    }),
    compression(),
  ],
  server: {
    port: 5173,
  },

  define: {
    "process.env": process.env,
    __GIT_COMMIT__: JSON.stringify(getGitInfo("git rev-parse --short HEAD")),
    __GIT_BRANCH__: JSON.stringify(
      getGitInfo("git symbolic-ref --short HEAD")
    ),
    __GIT_VERSION__: JSON.stringify(
      getGitInfo("git describe --tags --abbrev=0")
    ),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString().split("T")[0]),
    __BUILD_TIME__: JSON.stringify(new Date().toLocaleTimeString("en-GB")),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/"),
      "@common": path.resolve(__dirname, "./src/components/common"),
    },
  },
  test: {
    global: true,
    environment: "jsdom",
    setupFiles: ["./src/setupTest.js"],
  },
});
//  "git rev-parse  --abbrev-ref HEAD"