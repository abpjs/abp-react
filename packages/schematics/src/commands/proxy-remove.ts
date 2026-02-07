/**
 * Proxy Remove Command
 * Translated from @abp/ng.schematics v3.2.0 commands/proxy-remove/index.js
 *
 * Removes a specific module from the generated proxy files.
 */

import { camel } from '../utils/text';
import {
  getApiDefinition,
  readProxyConfig,
  saveProxyConfig,
  clearProxy,
  saveProxyWarning,
} from '../utils/source';
import { createProxyIndexGenerator } from '../utils/barrel';
import { generateApi } from './api';
import type { ProxyConfig } from '../models/proxy-config';

export interface ProxyRemoveOptions {
  /** Backend module name to remove */
  module: string;
  /** Backend API URL (needed to regenerate remaining modules) */
  source?: string;
  /** Output directory for generated files */
  target: string;
  /** Solution root namespace */
  rootNamespace?: string;
}

/**
 * Executes the proxy-remove command.
 *
 * Flow:
 * 1. Read existing proxy config
 * 2. Remove the specified module from generated list
 * 3. Clear all proxy files
 * 4. If there are remaining modules, regenerate them
 * 5. Update proxy config and barrel files
 */
export async function proxyRemove(options: ProxyRemoveOptions): Promise<void> {
  const moduleName = camel(options.module);
  const targetPath = options.target;

  // Read existing config
  let existingConfig: ProxyConfig;
  try {
    existingConfig = readProxyConfig(targetPath);
  } catch {
    throw new Error('No existing proxy configuration found. Nothing to remove.');
  }

  const generated = existingConfig.generated || [];
  const index = generated.indexOf(moduleName);

  if (index < 0) {
    console.log(`Module "${moduleName}" is not in the generated list.`);
    console.log(`Generated modules: ${generated.join(', ') || '(none)'}`);
    return;
  }

  // Remove from list
  generated.splice(index, 1);

  console.log(`Removing proxy for module: ${moduleName}...`);

  // Clear all proxy files
  clearProxy(targetPath);

  if (generated.length > 0 && options.source && options.rootNamespace) {
    // Regenerate remaining modules
    console.log(`Regenerating remaining modules: ${generated.join(', ')}...`);

    const apiDefinition = await getApiDefinition(options.source);
    const proxyConfig: ProxyConfig = {
      ...apiDefinition,
      generated: [],
    };

    saveProxyWarning(targetPath);

    for (const mod of generated) {
      if (!apiDefinition.modules[mod]) {
        console.warn(`Module "${mod}" not found in API definition, skipping.`);
        continue;
      }

      await generateApi({
        targetPath,
        solution: options.rootNamespace,
        moduleName: mod,
        proxyConfig,
      });
    }

    saveProxyConfig(proxyConfig, targetPath);

    // Generate barrel files
    const generateIndex = createProxyIndexGenerator(targetPath);
    generateIndex();
  } else if (generated.length > 0) {
    // Just update the generated list without regenerating
    console.warn(
      'Remaining modules exist but --source/--root-namespace not provided. ' +
        'Only updating config. Run proxy-refresh to regenerate.'
    );
    existingConfig.generated = generated;
    saveProxyConfig(existingConfig, targetPath);
  } else {
    // No more modules, clean everything
    console.log('No modules remaining. Proxy directory cleaned.');
  }

  console.log(`Module "${moduleName}" removed successfully.`);
}
