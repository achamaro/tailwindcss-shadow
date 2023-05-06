import icon from "@achamaro/vite-plugin-icon";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [icon(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: mode === "production" ? "/tailwindcss-shadow/" : "/",
}));
