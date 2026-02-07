/**
 * Service Generation Utilities
 * Translated from @abp/ng.schematics v3.2.0
 *
 * Converts API controllers into Service model objects
 * that can be rendered by EJS templates.
 */

import type { Action, Controller, Type } from '../models/api-definition';
import { Import } from '../models/import';
import { Body, Method, Signature } from '../models/method';
import { Property } from '../models/model';
import { Service } from '../models/service';
import { parseGenerics } from './generics';
import { sortImports } from './import';
import { parseNamespace } from './namespace';
import {
  createTypeAdapter,
  createTypeParser,
  createTypesToImportsReducer,
  removeTypeModifiers,
} from './type';

/**
 * Serializes method parameters to a TypeScript signature string.
 * @example serializeParameters([{name:'id', type:'string', optional:'', default:''}]) → 'id: string'
 */
export function serializeParameters(parameters: Property[]): string {
  return parameters.map((p) => p.name + p.optional + ': ' + p.type + p.default).join(', ');
}

export interface ControllerToServiceMapperParams {
  solution: string;
  types: Record<string, Type>;
  apiName: string;
}

/**
 * Creates a mapper function that converts a Controller to a Service model.
 */
export function createControllerToServiceMapper({
  solution,
  types,
  apiName,
}: ControllerToServiceMapperParams): (controller: Controller) => Service {
  const mapActionToMethod = createActionToMethodMapper();

  return (controller: Controller): Service => {
    const name = controller.controllerName;
    const namespace = parseNamespace(solution, controller.type);
    const actions = Object.values(controller.actions);

    const imports = actions.reduce(createActionToImportsReducer(solution, types, namespace), []);
    imports.push(new Import({ path: '@abpjs/core', specifiers: ['RestService'] }));
    sortImports(imports);

    const methods = actions.map(mapActionToMethod);
    sortMethods(methods);

    return new Service({ apiName, imports, methods, name, namespace });
  };
}

function sortMethods(methods: Method[]): void {
  methods.sort((a, b) => (a.signature.name > b.signature.name ? 1 : -1));
}

/**
 * Creates a mapper that converts an Action to a Method (body + signature).
 */
export function createActionToMethodMapper(): (action: Action) => Method {
  const mapActionToBody = createActionToBodyMapper();
  const mapActionToSignature = createActionToSignatureMapper();

  return (action: Action): Method => {
    const body = mapActionToBody(action);
    const signature = mapActionToSignature(action);
    return new Method({ body, signature });
  };
}

/**
 * Creates a mapper that converts an Action to a Body (HTTP details).
 */
export function createActionToBodyMapper(): (action: Action) => Body {
  const adaptType = createTypeAdapter();

  return ({ httpMethod, parameters, returnValue, url }: Action): Body => {
    const responseType = adaptType(returnValue.typeSimple);
    const body = new Body({ method: httpMethod, responseType, url });
    parameters.forEach(body.registerActionParameter);
    return body;
  };
}

/**
 * Creates a mapper that converts an Action to a Signature (method name + params).
 */
export function createActionToSignatureMapper(): (action: Action) => Signature {
  const adaptType = createTypeAdapter();

  return (action: Action): Signature => {
    const signature = new Signature({ name: getMethodNameFromAction(action) });

    signature.parameters = action.parametersOnMethod.map((p) => {
      const type = adaptType(p.typeSimple);
      const parameter = new Property({ name: p.name, type });
      if (p.defaultValue) parameter.default = ` = ${p.defaultValue}`;
      else if (p.isOptional) parameter.optional = '?';
      return parameter;
    });

    return signature;
  };
}

/**
 * Extracts the method name from an action, removing the 'Async' suffix.
 */
function getMethodNameFromAction(action: Action): string {
  return action.uniqueName.split('Async')[0];
}

/**
 * Creates a reducer that collects import references from action parameters and return types.
 */
function createActionToImportsReducer(
  solution: string,
  types: Record<string, Type>,
  namespace: string
): (imports: Import[], action: Action) => Import[] {
  const mapTypesToImports = createTypesToImportsReducer(solution, namespace);
  const parseType = createTypeParser(removeTypeModifiers);

  return (imports: Import[], { parametersOnMethod, returnValue }: Action): Import[] =>
    mapTypesToImports(
      imports,
      [returnValue, ...parametersOnMethod].reduce<{ type: string; isEnum: boolean }[]>(
        (acc, param) => {
          parseType(param.type).forEach((paramType) =>
            parseGenerics(paramType)
              .toGenerics()
              .forEach((type) => {
                if (types[type]) acc.push({ type, isEnum: types[type].isEnum });
              })
          );
          return acc;
        },
        []
      )
    );
}
