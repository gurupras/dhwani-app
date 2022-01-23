import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'

import config from 'config'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: IconsResolver()
    }),
    Icons()

  ],
  define: {
    CENTRAL_BACKEND_WEBSOCKET_URL: `'${config.backend.centralBackendWebsocketURL}'`,
    NATIVE_BACKEND_HOST: `'${config.backend.nativeBackendHost}'`
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
