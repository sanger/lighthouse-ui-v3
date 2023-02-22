import { defineConfig } from 'vite'
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [
    {
      ...vue(),
      apply: (config) => {
        return config.mode === "test";
      },
    }
  ]
})
