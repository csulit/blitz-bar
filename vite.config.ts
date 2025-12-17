import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import createNeonPlugin from './neon-vite-plugin.ts'

const config = defineConfig({
  plugins: [
    devtools(),
    nitro(),
    createNeonPlugin({
      seed: {
        type: 'sql-script',
        path: 'db/init.sql',
      },
      referrer: 'create-tanstack',
      dotEnvKey: 'VITE_DATABASE_URL',
    }),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
  ssr: {
    noExternal: ['@tabler/icons-react'],
  },
})

export default config
