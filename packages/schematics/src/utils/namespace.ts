/**
 * Namespace Parsing Utilities
 * Translated from @abp/ng.schematics v3.2.0
 *
 * Extracts TypeScript namespaces from .NET fully-qualified type names
 * by stripping the solution root prefix and "Controllers" segments.
 */

import { createTypeParser, removeGenerics } from './type';

/**
 * Parses a .NET namespace from a fully-qualified type name.
 * Strips the solution root prefix and removes "Controllers" segments.
 *
 * @param solution - The solution root namespace (e.g. 'MyCompany.MyProduct')
 * @param type - The fully-qualified .NET type (e.g. 'MyCompany.MyProduct.Users.Controllers.UserController')
 * @returns The cleaned namespace (e.g. 'Users')
 */
export function parseNamespace(solution: string, type: string): string {
  const parseType = createTypeParser(removeGenerics);
  let namespace = parseType(type)[0].split('.').slice(0, -1).join('.');

  solution.split('.').reduceRight((acc, part) => {
    acc = `${part}\\.${acc}`;
    const regex = new RegExp(`^${acc}(Controllers\\.)?`);
    namespace = namespace.replace(regex, '');
    return acc;
  }, '');

  return namespace;
}
