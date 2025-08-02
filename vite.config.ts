import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'TaggySDK',
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`,
    },
    rollupOptions: {
      external: ['openapi-typescript-fetch', 'zod'],
      output: {
        globals: {
          'openapi-typescript-fetch': 'openapi-typescript-fetch',
          zod: 'zod',
        },
      },
    },
    sourcemap: true,
    minify: 'terser',
  },
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
  test: {
    globals: true,
    environment: 'node',
  },
});