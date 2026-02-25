import path from 'node:path'
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
  }
})
