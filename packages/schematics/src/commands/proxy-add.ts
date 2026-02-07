/**
 * Proxy Add Command
 * Translated from @abp/ng.schematics v3.2.0 commands/proxy-add/index.js
 *
 * Fetches an API definition from a running ABP backend and generates
 * typed proxy services, React Query hooks, models, and enums.
 */

import { camel } from '../utils/text';
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

export interface ProxyAddOptions {
  /** Backend module name (default: 'app') */
  module?: string;
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
 * Executes the proxy-add command.
 *
 * Flow:
 * 1. Fetch API definition from backend
 * 2. Read existing proxy config (if any) to preserve generated list
 * 3. Clear old proxy files
 * 4. Save new proxy config + warning
 * 5. Generate API proxy files for each module
 * 6. Generate barrel index files
 */
export async function proxyAdd(options: ProxyAddOptions): Promise<void> {
  const moduleName = camel(options.module || 'app');
  const targetPath = options.target;
  const solution = options.rootNamespace;

  console.log(`Fetching API definition from ${options.source}...`);

  // Fetch API definition
  const apiDefinition = await getApiDefinition(options.source);

  // Read existing generated list
  let generated: string[] = [];
  try {
    const existingConfig = readProxyConfig(targetPath);
    generated = existingConfig.generated || [];
    if (!generated.includes(moduleName)) {
      generated.push(moduleName);
    }
  } catch {
    generated = [moduleName];
  }

  // Build proxy config
  const proxyConfig: ProxyConfig = {
    ...apiDefinition,
    generated: [],
  };

  console.log('Clearing old proxy files...');

  // Clear and regenerate
  clearProxy(targetPath);
  saveProxyWarning(targetPath);

  // Generate for each module in the generated list
  for (const mod of generated) {
    if (!apiDefinition.modules[mod]) {
      console.warn(`Module "${mod}" not found in API definition, skipping.`);
      continue;
    }

    console.log(`Generating proxy for module: ${mod}...`);

    await generateApi({
      targetPath,
      solution,
      moduleName: mod,
      proxyConfig,
    });
  }

  // Save proxy config
  saveProxyConfig(proxyConfig, targetPath);

  // Generate barrel files
  console.log('Generating barrel files...');
  const generateIndex = createProxyIndexGenerator(targetPath);
  generateIndex();

  console.log(`Proxy generation complete. Generated modules: ${proxyConfig.generated.join(', ')}`);
}
