import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vite'
import createVitePlugins from './vite/plugins/index'

export default defineConfig(({ command }) => {
  return {
    plugins: createVitePlugins(command === 'build'),
    test: {
      environment: 'jsdom',
      coverage: {
        provider: 'v8',
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
