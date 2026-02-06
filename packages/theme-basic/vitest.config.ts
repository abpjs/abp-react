import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    reporters: ['default', 'junit'],
    outputFile: { junit: 'theme-basic.test-report.junit.xml' },
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/__tests__/setup.ts',
        'src/__tests__/test-utils.tsx',
        '**/*.d.ts',
      ],
    },
  },
});
