import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      exclude: [
        './vite/**',
        './vitest/**',
        './src/map-tools/utils/libs/**',
        './src/**/examples/**',
      ],
    },
    projects: [
      {
        extends: './vite.config.ts',
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
        extends: './vite.config.ts',
        test: {
          name: 'jsdom',
          include: ['src/**/*.{test,spec}.{ts,mjs}'],
          exclude: ['src/**/*.browser.{test,spec}.{ts,mjs}'],
          environment: 'jsdom',
        },
      },
    ],
  },
})
