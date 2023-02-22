import { defineConfig } from 'vite'
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    {
      ...vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag) => ['StatusAlert'].includes(tag),
          }
        }
      }),
      apply: (config) => {
        return config.mode === "test";
      },
    }
  ]
})
