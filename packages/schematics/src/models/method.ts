/**
 * Method Classes
 * Translated from @abp/ng.schematics v3.1.0
 *
 * Classes for representing methods, signatures, and bodies in code generation.
 */

import { eBindingSourceId, eMethodModifier } from '../enums';
import type { ParameterInBody } from './api-definition';
import type { Property } from './model';
import type { Omissible } from './util';

/**
 * Utility function to convert a string to camelCase.
 */
function camelize(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^[A-Z]/, (char) => char.toLowerCase());
}

/**
 * Represents a complete method with signature and body.
 */
export class Method {
  body!: Body;
  signature!: Signature;

  constructor(options: MethodOptions) {
    Object.assign(this, options);
  }
}

export type MethodOptions = Method;

/**
 * Represents a method signature.
 */
export class Signature {
  generics!: string;
  modifier!: eMethodModifier;
  name!: string;
  parameters!: Property[];
  returnType!: string;

  constructor(options: SignatureOptions) {
    this.generics = '';
    this.modifier = eMethodModifier.Public;
    this.parameters = [];
    this.returnType = '';
    Object.assign(this, options);
  }
}

export type SignatureOptions = Omissible<
  Signature,
  'generics' | 'modifier' | 'parameters' | 'returnType'
>;

/**
 * Represents a method body.
 */
export class Body {
  body?: string;
  method!: string;
  params!: string[];
  requestType!: string;
  responseType!: string;
  url!: string;

  /**
   * Registers an action parameter by processing it based on binding source.
   */
  registerActionParameter: (param: ParameterInBody) => void;

  constructor(options: BodyOptions) {
    this.params = [];
    this.requestType = 'any';
    this.registerActionParameter = (param: ParameterInBody) => {
      const { bindingSourceId, descriptorName, name, nameOnMethod } = param;
      const camelName = camelize(name);
      const value = descriptorName ? `${descriptorName}.${camelName}` : nameOnMethod;

      switch (bindingSourceId) {
        case eBindingSourceId.Model:
        case eBindingSourceId.Query:
          this.params.push(`${camelName}: ${value}`);
          break;
        case eBindingSourceId.Body:
          this.body = value;
          break;
        case eBindingSourceId.Path: {
          const regex = new RegExp('{' + camelName + '}', 'g');
          this.url = this.url.replace(regex, '${' + value + '}');
          break;
        }
        default:
          break;
      }
    };
    Object.assign(this, options);
  }
}

export type BodyOptions = Omissible<
  Omit<Body, 'registerActionParameter'>,
  'params' | 'requestType'
>;
