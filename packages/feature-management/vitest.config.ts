import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    reporters: ['default', 'junit'],
    outputFile: { junit: 'feature-management.test-report.junit.xml' },
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    passWithNoTests: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'node_modules/',
        'src/__tests__/setup.ts',
        'src/index.ts',
        'src/**/index.ts',
        '**/*.d.ts',
        // Components not modified in v0.9.0 - focus tests on API changes
        'src/components/**/*.tsx',
      ],
    },
  },
});
