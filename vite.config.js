import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(({ mode }) => {
  const isAnalyze = mode === 'analyze'
  
  return {
    plugins: [
      react({
        jsxRuntime: 'automatic'
      }),
      isAnalyze && visualizer({
        filename: 'dist/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
        template: 'treemap',
        title: 'Bundle Analysis',
      })
    ].filter(Boolean),
    base: '/blog/',
    server: {
      port: 3000,
    },
    preview: {
      port: 3000,
    },
    build: {
      outDir: 'dist',
      sourcemap: isAnalyze,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'react-vendor';
              }
              if (id.includes('react-router')) {
                return 'router-vendor';
              }
              if (id.includes('markdown-it')) {
                return 'markdown-vendor';
              }
              return 'vendor';
            }
          },
        },
        treeshake: isAnalyze ? false : {
          moduleSideEffects: false,
          propertyReadSideEffects: false,
          unknownGlobalSideEffects: false,
        }
      },
      minify: isAnalyze ? false : 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
  }
}) 