import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    'react-router-dom',
    'react/jsx-runtime',
  ],
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
});
