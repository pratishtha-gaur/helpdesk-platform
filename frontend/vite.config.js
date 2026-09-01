import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite's config file — tells it to use React's plugin
// (which handles JSX syntax — the HTML-like code inside .jsx files).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // frontend will run on http://localhost:3000
  },
});
