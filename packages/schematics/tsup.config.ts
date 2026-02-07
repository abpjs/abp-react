import { defineConfig } from 'tsup';
import { copyFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    cli: 'src/cli.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  external: [],
  banner: ({ format }) => {
    if (format === 'cjs') {
      return {};
    }
    return {};
  },
  onSuccess: async () => {
    // Copy EJS templates to dist/templates
    const srcDir = join('src', 'templates');
    const destDir = join('dist', 'templates');
    mkdirSync(destDir, { recursive: true });
    readdirSync(srcDir).forEach((file) => {
      copyFileSync(join(srcDir, file), join(destDir, file));
    });
  },
});
