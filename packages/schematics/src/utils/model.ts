/**
 * Model / Interface Generation Utilities
 * Translated from @abp/ng.schematics v4.0.0
 *
 * Converts type references into Model objects containing
 * TypeScript interface definitions.
 */

import { VOLO_NAME_VALUE, VOLO_REGEX } from '../constants';
import type { Type } from '../models/api-definition';
import { Interface, Model, Property } from '../models/model';
import { parseGenerics } from './generics';
import { parseNamespace } from './namespace';
import { relativePathToModel } from './path';
import {
  createTypeParser,
  createTypeSimplifier,
  createTypesToImportsReducer,
  removeTypeModifiers,
} from './type';
import { camel } from './text';

export interface ModelGeneratorParams {
  solution: string;
  types: Record<string, Type>;
}

/**
 * Creates a reducer that converts import references to Model objects
 * with TypeScript interfaces.
 *
 * Each Model groups interfaces by namespace and includes the necessary imports.
 */
export function createImportRefsToModelReducer(params: ModelGeneratorParams) {
  const reduceImportRefsToInterfaces = createImportRefToInterfaceReducerCreator(params);
  const createRefToImportReducer = createRefToImportReducerCreator(params);
  const { solution, types } = params;

  return (models: Model[], importRefs: string[]): Model[] => {
    const interfaces = importRefs.reduce(reduceImportRefsToInterfaces, []);
    sortInterfaces(interfaces);

    interfaces.forEach((_interface) => {
      if (VOLO_REGEX.test(_interface.ref)) return;
      if (types[_interface.ref].isEnum) return;

      const index = models.findIndex((m) => m.namespace === _interface.namespace);

      if (index > -1) {
        if (models[index].interfaces.some((i) => i.identifier === _interface.identifier)) return;
        if (_interface.ref.startsWith(VOLO_NAME_VALUE.ref)) return;
        models[index].interfaces.push(_interface);
      } else {
        if (_interface.ref.startsWith(VOLO_NAME_VALUE.ref)) _interface = VOLO_NAME_VALUE;
        const { namespace } = _interface;
        models.push(
          new Model({
            interfaces: [_interface],
            namespace,
            path: relativePathToModel(namespace, namespace),
          })
        );
      }
    });

    // Resolve imports for each model (cross-namespace refs and enum refs)
    models.forEach((model) => {
      const toBeImported: { type: string; isEnum: boolean }[] = [];

      model.interfaces.forEach((_interface) => {
        const { baseType } = types[_interface.ref];
        if (baseType && parseNamespace(solution, baseType) !== model.namespace) {
          toBeImported.push({ type: baseType.split('<')[0], isEnum: false });
        }

        _interface.properties.forEach((prop) => {
          prop.refs.forEach((ref) => {
            const propType = types[ref];
            if (!propType) return;
            if (propType.isEnum) toBeImported.push({ type: ref, isEnum: true });
            else if (parseNamespace(solution, ref) !== model.namespace)
              toBeImported.push({ type: ref, isEnum: false });
          });
        });
      });

      if (!toBeImported.length) return;

      const reduceRefToImport = createRefToImportReducer(model.namespace);
      reduceRefToImport(model.imports, toBeImported);
    });

    return models;
  };
}

function sortInterfaces(interfaces: Interface[]): void {
  interfaces.sort((a, b) => (a.identifier > b.identifier ? 1 : -1));
}

/**
 * Creates a reducer that recursively builds Interface objects from type references.
 * Follows base types and property type references to build the complete interface graph.
 */
export function createImportRefToInterfaceReducerCreator(params: ModelGeneratorParams) {
  const { solution, types } = params;
  const parseType = createTypeParser(removeTypeModifiers);
  const simplifyType = createTypeSimplifier();
  const getIdentifier = (type: string) => removeTypeModifiers(simplifyType(type));

  function reduceRefsToInterfaces(interfaces: Interface[], ref: string): Interface[] {
    const typeDef = types[ref];
    if (!typeDef) return interfaces;

    const namespace = parseNamespace(solution, ref);
    const identifier = (typeDef.genericArguments ?? []).reduce(
      (acc, t, i) => acc.replace(`T${i}`, t),
      getIdentifier(ref)
    );
    const base = typeDef.baseType ? getIdentifier(typeDef.baseType) : null;
    const _interface = new Interface({ identifier, base, namespace, ref });

    typeDef.properties?.forEach((prop) => {
      const name = camel(prop.name);
      const optional = prop.typeSimple.endsWith('?') ? '?' : '';
      const type = simplifyType(prop.typeSimple);
      const refs = parseType(prop.type).reduce<string[]>(
        (acc, r) => acc.concat(parseGenerics(r).toGenerics()),
        []
      );
      _interface.properties.push(new Property({ name, optional, type, refs }));
    });

    interfaces.push(_interface);

    // Recursively resolve nested type references
    return _interface.properties
      .reduce<string[]>((refs, prop) => {
        prop.refs.forEach((type) => {
          if (!types[type]?.isEnum) refs.push(type);
        });
        return refs;
      }, [])
      .concat(base ? parseGenerics(typeDef.baseType!).toGenerics() : [])
      .reduce(reduceRefsToInterfaces, interfaces);
  }

  return reduceRefsToInterfaces;
}

/**
 * Creates a factory for import reducers, scoped to a specific namespace.
 */
export function createRefToImportReducerCreator(params: ModelGeneratorParams) {
  const { solution } = params;
  return (namespace: string) => createTypesToImportsReducer(solution, namespace);
}
