import { defineConfig } from 'vite'

import createVitePlugins from './vite/plugins'

export default defineConfig(({ command }) => {
  return {
    plugins: createVitePlugins(command === 'build'),
    test: {
      environment: 'jsdom',
      coverage: {
        provider: 'v8',
      },
    },
  }
})
