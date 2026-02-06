/**
 * Model Classes
 * Translated from @abp/ng.schematics v3.1.0
 *
 * Classes for representing models, interfaces, and properties in code generation.
 */

import type { Import } from './import';
import type { Omissible } from './util';

/**
 * Represents a model file containing interfaces.
 */
export class Model {
  imports!: Import[];
  interfaces!: Interface[];
  namespace!: string;
  path!: string;

  constructor(options: ModelOptions) {
    this.imports = [];
    this.interfaces = [];
    Object.assign(this, options);
  }
}

export type ModelOptions = Omissible<Model, 'imports' | 'interfaces'>;

/**
 * Represents a TypeScript interface.
 */
export class Interface {
  base!: string | null;
  identifier!: string;
  namespace!: string;
  properties!: Property[];
  ref!: string;

  constructor(options: InterfaceOptions) {
    this.properties = [];
    Object.assign(this, options);
  }
}

export type InterfaceOptions = Omissible<Interface, 'properties'>;

/**
 * Represents a property within an interface.
 */
export class Property {
  name!: string;
  type!: string;
  default!: string;
  optional!: '' | '?';
  refs!: string[];

  constructor(options: PropertyOptions) {
    this.default = '';
    this.optional = '';
    this.refs = [];
    Object.assign(this, options);
  }
}

export type PropertyOptions = Omissible<Property, 'default' | 'optional' | 'refs'>;
