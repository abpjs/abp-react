/**
 * Service Model
 * Translated from @abp/ng.schematics v3.1.0
 *
 * Represents a service for code generation.
 */

import type { Controller, Type } from './api-definition';
import type { Import } from './import';
import type { Method } from './method';
import type { Omissible } from './util';

/**
 * Parameters for service generation.
 */
export interface ServiceGeneratorParams {
  targetPath: string;
  solution: string;
  types: Record<string, Type>;
  apiName: string;
  controllers: Controller[];
  serviceImports: Record<string, string[]>;
}

/**
 * Represents a generated service.
 */
export class Service {
  apiName!: string;
  imports!: Import[];
  methods!: Method[];
  name!: string;
  namespace!: string;

  constructor(options: ServiceOptions) {
    this.imports = [];
    this.methods = [];
    Object.assign(this, options);
  }
}

export type ServiceOptions = Omissible<Service, 'imports' | 'methods'>;
