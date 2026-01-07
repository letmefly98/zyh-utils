import type { UserConfig } from 'vite'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
// import createAutoImportPlugins from './auto-import'
import createSetupExtend from './setup-extend'

export default function createVitePlugins(_isBuild = false) {
  const vitePlugins: UserConfig['plugins'] = [vue(), vueJsx()]
  // vitePlugins.push(createAutoImportPlugins())
  vitePlugins.push(createSetupExtend())
  return vitePlugins
}
