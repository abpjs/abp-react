/**
 * Generate Proxy Schema
 * Translated from @abp/ng.schematics v3.1.0
 *
 * Configuration schema for proxy generation.
 */

/**
 * Schema for proxy generation command options.
 */
export interface GenerateProxySchema {
  /**
   * Backend module name
   */
  module?: string;
  /**
   * Backend api name, a.k.a. remoteServiceName
   */
  'api-name'?: string;
  /**
   * Source project for API definition URL & root namespace resolution
   */
  source?: string;
  /**
   * Target project to place the generated code
   */
  target?: string;
}
