/**
 * Source Utilities Tests
 */

import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import {
  readProxyConfig,
  saveProxyConfig,
  saveProxyWarning,
  clearProxy,
  writeFile,
  generateProxyConfigJson,
} from '../../utils/source';
import type { ProxyConfig } from '../../models/proxy-config';

describe('Source Utils', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'source-test-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  describe('readProxyConfig', () => {
    it('should read and parse proxy config', () => {
      const configDir = path.join(tempDir, 'proxy');
      fs.mkdirSync(configDir, { recursive: true });
      const config = { modules: {}, types: {}, generated: ['app'] };
      fs.writeFileSync(
        path.join(configDir, 'generate-proxy.json'),
        JSON.stringify(config)
      );

      const result = readProxyConfig(tempDir);
      expect(result.generated).toEqual(['app']);
    });

    it('should throw for missing config', () => {
      expect(() => readProxyConfig(tempDir)).toThrow();
    });
  });

  describe('saveProxyConfig', () => {
    it('should write proxy config file', () => {
      const config: ProxyConfig = {
        modules: {},
        types: {},
        generated: ['app', 'identity'],
      };

      saveProxyConfig(config, tempDir);

      const configPath = path.join(tempDir, 'proxy', 'generate-proxy.json');
      expect(fs.existsSync(configPath)).toBe(true);

      const saved = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      expect(saved.generated).toEqual(['app', 'identity']);
    });

    it('should create directories as needed', () => {
      const config: ProxyConfig = { modules: {}, types: {}, generated: [] };
      saveProxyConfig(config, tempDir);

      expect(fs.existsSync(path.join(tempDir, 'proxy'))).toBe(true);
    });
  });

  describe('saveProxyWarning', () => {
    it('should write README.md warning file', () => {
      saveProxyWarning(tempDir);

      const warningPath = path.join(tempDir, 'proxy', 'README.md');
      expect(fs.existsSync(warningPath)).toBe(true);

      const content = fs.readFileSync(warningPath, 'utf-8');
      expect(content.length).toBeGreaterThan(0);
    });
  });

  describe('clearProxy', () => {
    it('should remove subdirectories', () => {
      const proxyDir = path.join(tempDir, 'proxy');
      const subDir = path.join(proxyDir, 'identity');
      fs.mkdirSync(subDir, { recursive: true });
      fs.writeFileSync(path.join(subDir, 'models.ts'), '');

      clearProxy(tempDir);

      expect(fs.existsSync(subDir)).toBe(false);
      expect(fs.existsSync(proxyDir)).toBe(true);
    });

    it('should remove index.ts', () => {
      const proxyDir = path.join(tempDir, 'proxy');
      fs.mkdirSync(proxyDir, { recursive: true });
      fs.writeFileSync(path.join(proxyDir, 'index.ts'), 'export {};');

      clearProxy(tempDir);

      expect(fs.existsSync(path.join(proxyDir, 'index.ts'))).toBe(false);
    });

    it('should handle non-existent proxy directory', () => {
      expect(() => clearProxy(tempDir)).not.toThrow();
    });

    it('should preserve proxy root directory', () => {
      const proxyDir = path.join(tempDir, 'proxy');
      fs.mkdirSync(proxyDir, { recursive: true });

      clearProxy(tempDir);

      expect(fs.existsSync(proxyDir)).toBe(true);
    });
  });

  describe('writeFile', () => {
    it('should write file content', () => {
      const filePath = path.join(tempDir, 'test.ts');
      writeFile(filePath, 'export const x = 1;');

      expect(fs.readFileSync(filePath, 'utf-8')).toBe('export const x = 1;');
    });

    it('should create parent directories', () => {
      const filePath = path.join(tempDir, 'a', 'b', 'test.ts');
      writeFile(filePath, 'content');

      expect(fs.existsSync(filePath)).toBe(true);
    });
  });

  describe('generateProxyConfigJson', () => {
    it('should generate formatted JSON string', () => {
      const config: ProxyConfig = { modules: {}, types: {}, generated: ['app'] };
      const json = generateProxyConfigJson(config);

      expect(JSON.parse(json)).toEqual(config);
      expect(json).toContain('\n'); // pretty printed
    });
  });
});
