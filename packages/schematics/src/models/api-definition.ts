/**
 * API Definition Types
 * Translated from @abp/ng.schematics v4.0.0
 *
 * Types representing ABP API definition structure.
 */

import { eBindingSourceId } from '../enums';

/**
 * Root API definition containing modules and types.
 */
export interface ApiDefinition {
  /** Map of module names to module definitions */
  modules: Record<string, Module>;
  /** Map of type names to type definitions */
  types: Record<string, Type>;
}

/**
 * Type definition structure.
 */
export interface Type {
  /** Base type name, if any */
  baseType: string | null;
  /** Whether this type is an enum */
  isEnum: boolean;
  /** Enum member names, if applicable */
  enumNames: string[] | null;
  /** Enum member values, if applicable */
  enumValues: number[] | null;
  /** Generic type arguments, if applicable */
  genericArguments: string[] | null;
  /** Type properties, if applicable */
  properties: PropertyDef[] | null;
}

/**
 * Property definition within a type.
 */
export interface PropertyDef {
  /** Property name */
  name: string;
  /** Full type string */
  type: string;
  /** Simplified type string */
  typeSimple: string;
  /**
   * Whether this property is required.
   * @since 4.0.0
   */
  isRequired: boolean;
}

/**
 * Module definition structure.
 */
export interface Module {
  /** Root path for the module */
  rootPath: string;
  /** Remote service name for API calls */
  remoteServiceName: string;
  /** Map of controller names to controller definitions */
  controllers: Record<string, Controller>;
}

/**
 * Controller definition structure.
 */
export interface Controller {
  /** Controller name */
  controllerName: string;
  /** Controller type */
  type: string;
  /** Implemented interfaces */
  interfaces: InterfaceDef[];
  /** Map of action names to action definitions */
  actions: Record<string, Action>;
}

/**
 * Interface definition reference.
 */
export interface InterfaceDef {
  /** Interface type string */
  type: string;
}

/**
 * API action/endpoint definition.
 */
export interface Action {
  /** Unique action name */
  uniqueName: string;
  /** Action name */
  name: string;
  /** HTTP method (GET, POST, etc.) */
  httpMethod: string;
  /** URL template */
  url: string;
  /** Supported API versions */
  supportedVersions: string[];
  /** Parameters in method signature */
  parametersOnMethod: ParameterInSignature[];
  /** Parameters in request body */
  parameters: ParameterInBody[];
  /** Return value type */
  returnValue: TypeDef;
}

/**
 * Parameter in method signature.
 */
export interface ParameterInSignature {
  /** Parameter name */
  name: string;
  /** Type as string */
  typeAsString: string;
  /** Full type */
  type: string;
  /** Simplified type */
  typeSimple: string;
  /** Whether parameter is optional */
  isOptional: boolean;
  /** Default value, if any */
  defaultValue: unknown;
}

/**
 * Parameter in HTTP request body.
 */
export interface ParameterInBody {
  /** Parameter name on method */
  nameOnMethod: string;
  /** Parameter name */
  name: string;
  /** Full type */
  type: string;
  /** Simplified type */
  typeSimple: string;
  /** Whether parameter is optional */
  isOptional: boolean;
  /** Default value, if any */
  defaultValue: unknown;
  /** Constraint types, if any */
  constraintTypes: string[] | null;
  /** Binding source identifier */
  bindingSourceId: eBindingSourceId;
  /** Descriptor name */
  descriptorName: string;
}

/**
 * Type definition reference.
 */
export interface TypeDef {
  /** Full type string */
  type: string;
  /** Simplified type string */
  typeSimple: string;
}

/**
 * Type with enum indicator.
 */
export interface TypeWithEnum {
  /** Whether this type is an enum */
  isEnum: boolean;
  /** Type string */
  type: string;
}
