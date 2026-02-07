/**
 * Barrel File Generation Tests
 */

import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { generateBarrelFromPath, createProxyIndexGenerator } from '../../utils/barrel';

describe('Barrel Utils', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'barrel-test-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  describe('generateBarrelFromPath', () => {
    it('should generate index.ts with file exports', () => {
      fs.writeFileSync(path.join(tempDir, 'user.service.ts'), 'export class UserService {}');
      fs.writeFileSync(path.join(tempDir, 'models.ts'), 'export interface User {}');

      generateBarrelFromPath(tempDir);

      const indexPath = path.join(tempDir, 'index.ts');
      expect(fs.existsSync(indexPath)).toBe(true);

      const content = fs.readFileSync(indexPath, 'utf-8');
      expect(content).toContain("export * from './models';");
      expect(content).toContain("export * from './user.service';");
    });

    it('should not include index.ts in exports', () => {
      fs.writeFileSync(path.join(tempDir, 'models.ts'), 'export interface User {}');
      fs.writeFileSync(path.join(tempDir, 'index.ts'), '// existing');

      generateBarrelFromPath(tempDir);

      const content = fs.readFileSync(path.join(tempDir, 'index.ts'), 'utf-8');
      expect(content).not.toContain("'./index'");
    });

    it('should export subdirectories with PascalCase name', () => {
      const subDir = path.join(tempDir, 'identity');
      fs.mkdirSync(subDir);
      fs.writeFileSync(path.join(subDir, 'models.ts'), 'export interface User {}');

      generateBarrelFromPath(tempDir);

      const content = fs.readFileSync(path.join(tempDir, 'index.ts'), 'utf-8');
      expect(content).toContain("export * as Identity from './identity';");
    });

    it('should recursively generate barrel files in subdirectories', () => {
      const subDir = path.join(tempDir, 'users');
      fs.mkdirSync(subDir);
      fs.writeFileSync(path.join(subDir, 'models.ts'), 'export interface User {}');

      generateBarrelFromPath(tempDir);

      const subIndex = path.join(subDir, 'index.ts');
      expect(fs.existsSync(subIndex)).toBe(true);
      const content = fs.readFileSync(subIndex, 'utf-8');
      expect(content).toContain("export * from './models';");
    });

    it('should skip empty subdirectories', () => {
      const emptyDir = path.join(tempDir, 'empty');
      fs.mkdirSync(emptyDir);
      fs.writeFileSync(path.join(tempDir, 'models.ts'), 'export {}');

      generateBarrelFromPath(tempDir);

      const content = fs.readFileSync(path.join(tempDir, 'index.ts'), 'utf-8');
      expect(content).not.toContain('empty');
    });

    it('should sort exports alphabetically', () => {
      fs.writeFileSync(path.join(tempDir, 'zebra.ts'), 'export {}');
      fs.writeFileSync(path.join(tempDir, 'alpha.ts'), 'export {}');

      generateBarrelFromPath(tempDir);

      const content = fs.readFileSync(path.join(tempDir, 'index.ts'), 'utf-8');
      const lines = content.trim().split('\n');
      expect(lines[0]).toContain('alpha');
      expect(lines[1]).toContain('zebra');
    });

    it('should handle non-existent directory', () => {
      expect(() => generateBarrelFromPath('/non/existent/path')).not.toThrow();
    });
  });

  describe('createProxyIndexGenerator', () => {
    it('should create a function that generates barrel at proxy path', () => {
      const proxyDir = path.join(tempDir, 'proxy');
      fs.mkdirSync(proxyDir, { recursive: true });
      fs.writeFileSync(path.join(proxyDir, 'models.ts'), 'export {}');

      const generateIndex = createProxyIndexGenerator(tempDir);
      generateIndex();

      expect(fs.existsSync(path.join(proxyDir, 'index.ts'))).toBe(true);
    });
  });
});
