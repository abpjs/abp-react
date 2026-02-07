/**
 * Proxy Refresh Command
 * Translated from @abp/ng.schematics v3.2.0 commands/proxy-refresh/index.js
 *
 * Re-fetches the API definition and regenerates all previously generated modules.
 */

import {
  getApiDefinition,
  readProxyConfig,
  saveProxyConfig,
  saveProxyWarning,
  clearProxy,
} from '../utils/source';
import { createProxyIndexGenerator } from '../utils/barrel';
import { generateApi } from './api';
import type { ProxyConfig } from '../models/proxy-config';

export interface ProxyRefreshOptions {
  /** Backend API name / remote service name (default: 'default') */
  apiName?: string;
  /** Backend API URL (e.g. 'https://localhost:44300') */
  source: string;
  /** Output directory for generated files */
  target: string;
  /** Solution root namespace (e.g. 'MyCompany.MyProduct') */
  rootNamespace: string;
}

/**
 * Executes the proxy-refresh command.
 *
 * Flow:
 * 1. Read existing proxy config to get list of generated modules
 * 2. Re-fetch API definition from backend
 * 3. Clear old proxy files
 * 4. Regenerate all previously generated modules
 * 5. Generate barrel index files
 */
export async function proxyRefresh(options: ProxyRefreshOptions): Promise<void> {
  const targetPath = options.target;
  const solution = options.rootNamespace;

  // Read existing config to get generated modules list
  let generated: string[];
  try {
    const existingConfig = readProxyConfig(targetPath);
    generated = existingConfig.generated || [];
  } catch {
    throw new Error(
      'No existing proxy configuration found. Run proxy-add first.'
    );
  }

  if (generated.length === 0) {
    console.log('No modules to refresh.');
    return;
  }

  console.log(`Fetching API definition from ${options.source}...`);
  console.log(`Refreshing modules: ${generated.join(', ')}`);

  // Fetch API definition
  const apiDefinition = await getApiDefinition(options.source);

  // Build proxy config
  const proxyConfig: ProxyConfig = {
    ...apiDefinition,
    generated: [],
  };

  // Clear and regenerate
  clearProxy(targetPath);
  saveProxyWarning(targetPath);

  // Generate for each previously generated module
  for (const moduleName of generated) {
    if (!apiDefinition.modules[moduleName]) {
      console.warn(`Module "${moduleName}" not found in API definition, skipping.`);
      continue;
    }

    console.log(`Generating proxy for module: ${moduleName}...`);

    await generateApi({
      targetPath,
      solution,
      moduleName,
      proxyConfig,
    });
  }

  // Save proxy config
  saveProxyConfig(proxyConfig, targetPath);

  // Generate barrel files
  console.log('Generating barrel files...');
  const generateIndex = createProxyIndexGenerator(targetPath);
  generateIndex();

  console.log(`Proxy refresh complete. Refreshed modules: ${proxyConfig.generated.join(', ')}`);
}
