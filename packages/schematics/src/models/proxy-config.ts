/**
 * Proxy Config Model
 * Translated from @abp/ng.schematics v3.1.0
 *
 * Configuration for generated proxies.
 */

import type { ApiDefinition } from './api-definition';

/**
 * Proxy configuration extending ApiDefinition with generated file tracking.
 */
export interface ProxyConfig extends ApiDefinition {
  /**
   * List of generated file paths
   */
  generated: string[];
}
