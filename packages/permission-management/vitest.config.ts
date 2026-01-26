import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    passWithNoTests: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'node_modules/',
        'src/__tests__/setup.ts',
        'src/__tests__/test-utils.tsx',
        'src/index.ts',
        'src/**/index.ts',
        '**/*.d.ts',
        // Components not modified in v0.9.0 - focus tests on API changes
        'src/components/**/*.tsx',
      ],
    },
  },
});
