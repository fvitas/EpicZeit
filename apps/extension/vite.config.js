import { crx } from '@crxjs/vite-plugin'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import chromeManifest from './manifest.chrome.json'
import firefoxManifest from './manifest.firefox.json'
import packageJson from './package.json'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  const manifest = env.VITE_EXTENSION === 'FIREFOX' ? firefoxManifest : chromeManifest
  const outputDir = env.VITE_EXTENSION === 'FIREFOX' ? 'dist/firefox' : 'dist/chrome'

  return {
    plugins: [react(), crx({ manifest })],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@ui': path.resolve(__dirname, '../../packages/ui/src'),
      },
    },
    define: {
      'import.meta.env.APP_VERSION': JSON.stringify(packageJson.version),
    },
    build: {
      outDir: outputDir,
      sourcemap: false,
      emptyOutDir: true,
    },
    server: {
      port: 3000,
    },
  }
})
