import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import packageJson from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), visualizer({ gzipSize: true })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@ui': path.resolve(__dirname, '../../packages/app/src'),
    },
  },
  define: {
    'import.meta.env.APP_VERSION': JSON.stringify(packageJson.version),
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      input: {
        main: path.resolve('./index.html'),
        app: path.resolve('./app.html'),
        privacy: path.resolve('./privacy.html'),
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'dayjs'],
          chroma: ['chroma-js'],
        },
      },
    },
  },
})
