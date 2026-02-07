import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/tree/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    'react/jsx-runtime',
    '@chakra-ui/react',
    '@abpjs/theme-shared',
    'react-icons',
    'react-icons/lu',
  ],
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
});
