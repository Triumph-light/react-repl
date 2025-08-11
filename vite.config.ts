import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    dts({
      rollupTypes: true,
    }),
    react(),
  ],
  base: "./",
  build: {
    target: "esnext",
    minify: false,
    lib: {
      entry: {
        "react-repl": "./src/index.ts",
      },
      formats: ["es"],
      fileName: (format, entryName) => `${entryName}.js`,
    },
    cssCodeSplit: true,
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        chunkFileNames: "chunks/[name]-[hash].js",
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
