import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  build: { manifest: true },
  base: process.env.mode === "production" ? "/static/" : "/",
  plugins: [react()],
  server: {
    historyApiFallback: true, // Fixes reload issues
  },
});