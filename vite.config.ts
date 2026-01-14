import path from 'node:path'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vite'
import createVitePlugins from './vite/plugins/index'

export default defineConfig(({ command }) => {
  return {
    plugins: createVitePlugins(command === 'build'),
    resolve: {
      alias: {
        '~': path.resolve(__dirname, ''),
        '@': path.resolve(__dirname, './src'),
      },
    },
    test: {
      environment: 'jsdom',
      coverage: {
        provider: 'v8',
        exclude: [
          './vite/**',
          './vitest/**',
          './src/map-tools/utils/libs/**',
        ],
      },
      projects: [
        {
          extends: true,
          test: {
            name: 'tmap',
            include: ['src/**/*.browser.{test,spec}.{ts,mjs}'],
            browser: {
              enabled: true,
              provider: playwright(),
              instances: [{ browser: 'chromium' }],
              headless: true,
              api: { host: '127.0.0.1', port: 63315 },
            },
            setupFiles: ['./vitest/setup/tmap-loader.ts'],
          },
        },
        {
          extends: true,
          test: {
            name: 'jsdom',
            include: ['src/**/*.{test,spec}.{ts,mjs}'],
            exclude: ['src/**/*.browser.{test,spec}.{ts,mjs}'],
            environment: 'jsdom',
          },
        },
      ],
    },
  }
})
