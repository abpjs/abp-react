/**
 * Barrel File Generation Utilities
 * Translated from @abp/ng.schematics v3.2.0
 *
 * Generates index.ts barrel files that re-export all modules
 * in a directory tree.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { PROXY_PATH } from '../constants';
import { pascal } from './text';

/**
 * Creates a function that generates barrel index.ts files
 * for the proxy directory and all subdirectories.
 *
 * @param targetPath - The root target path (proxy dir is appended)
 */
export function createProxyIndexGenerator(targetPath: string): () => void {
  const proxyPath = path.join(targetPath, PROXY_PATH);
  return () => generateBarrelFromPath(proxyPath);
}

/**
 * Recursively generates barrel index.ts files.
 *
 * - Files ending in .ts (excluding index.ts) get `export * from './filename';`
 * - Subdirectories with content get `export * as DirName from './dirname';`
 * - Generates an index.ts in each directory that has exports.
 *
 * @param dirPath - Absolute path to the directory
 */
export function generateBarrelFromPath(dirPath: string): void {
  if (!fs.existsSync(dirPath)) return;

  const _exports: string[] = [];
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  // Export files
  entries
    .filter((e) => e.isFile() && e.name.endsWith('.ts') && e.name !== 'index.ts')
    .forEach((file) => {
      const name = file.name.replace(/\.ts$/, '');
      _exports.push(`export * from './${name}';`);
    });

  // Export subdirectories
  entries
    .filter((e) => e.isDirectory())
    .forEach((dir) => {
      const subDirPath = path.join(dirPath, dir.name);
      const hasFiles = directoryHasFiles(subDirPath);
      if (!hasFiles) return;

      _exports.push(`export * as ${pascal(dir.name)} from './${dir.name}';`);
      generateBarrelFromPath(subDirPath);
    });

  _exports.sort();

  if (_exports.length) {
    const indexPath = path.join(dirPath, 'index.ts');
    fs.writeFileSync(indexPath, _exports.join('\n') + '\n', 'utf-8');
  }
}

/**
 * Checks if a directory (recursively) contains any files.
 */
function directoryHasFiles(dirPath: string): boolean {
  if (!fs.existsSync(dirPath)) return false;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isFile()) return true;
    if (entry.isDirectory() && directoryHasFiles(path.join(dirPath, entry.name))) return true;
  }
  return false;
}
