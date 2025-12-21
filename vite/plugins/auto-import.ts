import AutoImport from 'unplugin-auto-import/vite'

export default function createAutoImportPlugins() {
  return [
    AutoImport({
      imports: [],
      dts: 'auto-imports.d.ts',
    }),
  ]
}
