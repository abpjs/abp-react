/**
 * Source / API Definition Utilities
 * Translated from @abp/ng.schematics v3.2.0
 *
 * Handles fetching API definitions from a running ABP backend,
 * reading/writing proxy configuration files, and managing proxy directories.
 *
 * Key changes from Angular version:
 * - Uses native fetch instead of got
 * - Uses fs/promises instead of @angular-devkit/schematics Tree
 * - Root namespace from CLI params instead of Angular environment.ts
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { API_DEFINITION_ENDPOINT, PROXY_CONFIG_PATH, PROXY_PATH, PROXY_WARNING, PROXY_WARNING_PATH } from '../constants';
import type { ApiDefinition } from '../models/api-definition';
import type { ProxyConfig } from '../models/proxy-config';
import { Exception } from '../enums';
import { interpolate } from './common';

/**
 * Fetches the API definition from a running ABP backend.
 *
 * @param sourceUrl - The backend base URL (e.g. 'https://localhost:44300')
 * @returns The full API definition including modules and types
 */
export async function getApiDefinition(sourceUrl: string): Promise<ApiDefinition> {
  const url = `${sourceUrl}${API_DEFINITION_ENDPOINT}?includeTypes=true`;

  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return (await response.json()) as ApiDefinition;
  } catch (err) {
    throw new Error(
      Exception.NoApi +
        `\nURL: ${url}\nError: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}

/**
 * Reads the proxy configuration file (generate-proxy.json).
 *
 * @param targetPath - The root target directory
 * @returns The parsed proxy configuration
 */
export function readProxyConfig(targetPath: string): ProxyConfig {
  const configPath = path.join(targetPath, PROXY_CONFIG_PATH);

  try {
    const content = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(content) as ProxyConfig;
  } catch {
    throw new Error(interpolate(Exception.NoProxyConfig, configPath));
  }
}

/**
 * Saves the proxy configuration file (generate-proxy.json).
 *
 * @param data - The proxy configuration to save
 * @param targetPath - The root target directory
 */
export function saveProxyConfig(data: ProxyConfig, targetPath: string): void {
  const configPath = path.join(targetPath, PROXY_CONFIG_PATH);
  const dir = path.dirname(configPath);

  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(configPath, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * Saves the proxy warning README.md file.
 *
 * @param targetPath - The root target directory
 */
export function saveProxyWarning(targetPath: string): void {
  const warningPath = path.join(targetPath, PROXY_WARNING_PATH);
  const dir = path.dirname(warningPath);

  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(warningPath, PROXY_WARNING, 'utf-8');
}

/**
 * Clears all generated proxy files and subdirectories.
 * Preserves the proxy root directory itself.
 *
 * @param targetPath - The root target directory
 */
export function clearProxy(targetPath: string): void {
  const proxyPath = path.join(targetPath, PROXY_PATH);

  if (!fs.existsSync(proxyPath)) return;

  try {
    const entries = fs.readdirSync(proxyPath, { withFileTypes: true });

    // Remove subdirectories and their contents
    entries
      .filter((e) => e.isDirectory())
      .forEach((dir) => {
        fs.rmSync(path.join(proxyPath, dir.name), { recursive: true, force: true });
      });

    // Remove the proxy index.ts if it exists
    const indexPath = path.join(proxyPath, 'index.ts');
    if (fs.existsSync(indexPath)) {
      fs.unlinkSync(indexPath);
    }
  } catch {
    throw new Error(interpolate(Exception.DirRemoveFailed, proxyPath));
  }
}

/**
 * Generates the proxy configuration JSON string.
 */
export function generateProxyConfigJson(proxyConfig: ProxyConfig): string {
  return JSON.stringify(proxyConfig, null, 2);
}

/**
 * Writes a file, creating parent directories as needed.
 */
export function writeFile(filePath: string, content: string): void {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf-8');
}
