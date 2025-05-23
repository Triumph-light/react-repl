import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import dts from 'vite-plugin-dts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // dts({
    //   rollupTypes: true,
    //   include: ['**/*.ts', '**/*.tsx'],
    // }),
    react()
  ],
  base: './',
  build: {
    target: 'esnext',
    minify: false,
    lib: {
      entry: {
        'react-repl': './src/index.ts',
      },
      formats: ['es'],
      fileName: () => '[name].js',
    },
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        chunkFileNames: 'chunks/[name]-[hash].js',
      },
      external: ['react', 'react-dom'],
    },
  }
})
