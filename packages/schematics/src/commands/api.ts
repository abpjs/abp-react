/**
 * Core API Generator
 * Translated from @abp/ng.schematics v3.2.0 commands/api/index.js
 *
 * Orchestrates the generation of services, hooks, models, and enums
 * from an ABP API definition.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import * as ejs from 'ejs';
import type { ProxyConfig } from '../models/proxy-config';
import type { Service } from '../models/service';
import type { Model } from '../models/model';
import type { Import } from '../models/import';
import type { EnumDescriptor } from '../utils/enum';
import { PROXY_PATH } from '../constants';
import { Exception } from '../enums';
import {
  camel,
  pascal,
  kebab,
  dir,
  interpolate,
  serializeParameters,
  createControllerToServiceMapper,
  createImportRefsToModelReducer,
  createImportRefToEnumMapper,
  getEnumNamesFromImports,
  writeFile,
} from '../utils';

/**
 * Parameters for API generation.
 */
export interface GenerateApiParams {
  /** Root target directory (where proxy/ will be created) */
  targetPath: string;
  /** Solution root namespace (e.g. 'MyCompany.MyProduct') */
  solution: string;
  /** Module name to generate (e.g. 'app', 'identity') */
  moduleName: string;
  /** Full proxy configuration with API definition */
  proxyConfig: ProxyConfig;
}

/**
 * Resolves the templates directory path.
 */
function getTemplatesDir(): string {
  return path.resolve(__dirname, '..', 'templates');
}

/**
 * Renders an EJS template file with the given data.
 */
function renderTemplate(templateName: string, data: Record<string, unknown>): string {
  const templatePath = path.join(getTemplatesDir(), templateName);
  const template = fs.readFileSync(templatePath, 'utf-8');
  return ejs.render(template, data);
}

/**
 * Gets the query key type based on method signature name heuristic.
 * Methods with 'List' or 'All' in the name use 'list', otherwise 'detail'.
 */
function getQueryKeyType(signature: { name: string }): string {
  const name = signature.name.toLowerCase();
  if (name.includes('list') || name.includes('all') || name.includes('getlist')) {
    return 'list';
  }
  return 'detail';
}

/**
 * Gets the TypeScript type for mutation variables.
 * For single param: just the type. For multiple: an object type.
 */
function getMutationVariablesType(
  parameters: { name: string; type: string; optional: string }[]
): string {
  if (parameters.length === 0) return 'void';
  if (parameters.length === 1) return parameters[0].type;
  return (
    '{ ' + parameters.map((p) => `${p.name}${p.optional}: ${p.type}`).join('; ') + ' }'
  );
}

/**
 * Gets the mutation function parameter declaration.
 * For single param: `paramName: Type`. For multiple: destructured object.
 */
function getMutationFnParams(
  parameters: { name: string; type: string; optional: string }[]
): string {
  if (parameters.length === 0) return '';
  if (parameters.length === 1)
    return `${parameters[0].name}: ${parameters[0].type}`;
  return (
    '{ ' +
    parameters.map((p) => p.name).join(', ') +
    ' }: ' +
    getMutationVariablesType(parameters)
  );
}

/**
 * Collects type-only imports needed by the hook template.
 * Filters out RestService and framework imports, keeping only model/type imports.
 */
function getHookImports(serviceImports: Import[]): Import[] {
  return serviceImports.filter(
    (imp) => imp.path !== '@abpjs/core' && imp.path !== '@angular/core'
  );
}

/**
 * Main API generation function.
 * Reads the proxy config, validates the module, and generates all files.
 */
export async function generateApi(params: GenerateApiParams): Promise<void> {
  const { targetPath, solution, moduleName, proxyConfig } = params;
  const { types, modules } = proxyConfig;

  if (!types || !modules) {
    throw new Error(Exception.InvalidApiDefinition);
  }

  const definition = modules[moduleName];
  if (!definition) {
    throw new Error(interpolate(Exception.InvalidModule, moduleName));
  }

  const apiName = definition.remoteServiceName;
  const controllers = Object.values(definition.controllers || {});

  // Phase 1: Generate services
  const serviceImportsMap: Record<string, string[]> = {};
  const mapControllerToService = createControllerToServiceMapper({ solution, types, apiName });

  const services = controllers.map((controller) => {
    const service = mapControllerToService(controller);

    // Track imports for model/enum generation
    service.imports.forEach(({ refs, path: importPath }) =>
      refs.forEach((ref) => {
        if (importPath === '@abpjs/core') return;
        if (!serviceImportsMap[importPath])
          return (serviceImportsMap[importPath] = [ref]);
        serviceImportsMap[importPath] = [
          ...new Set([...serviceImportsMap[importPath], ref]),
        ];
      })
    );

    return service;
  });

  // Write service files
  for (const service of services) {
    writeServiceFile(targetPath, service);
    writeHookFile(targetPath, service);
  }

  // Phase 2: Generate models
  const modelImportsMap: Record<string, string[]> = {};
  const reduceImportRefsToModels = createImportRefsToModelReducer({ solution, types });
  const models = Object.values(serviceImportsMap).reduce(reduceImportRefsToModels, []);

  // Track model imports for enum generation
  models.forEach(({ imports }) =>
    imports.forEach(({ refs, path: importPath }) =>
      refs.forEach((ref) => {
        if (importPath === '@abpjs/core') return;
        if (!modelImportsMap[importPath])
          return (modelImportsMap[importPath] = [ref]);
        modelImportsMap[importPath] = [
          ...new Set([...modelImportsMap[importPath], ref]),
        ];
      })
    )
  );

  // Write model files
  for (const model of models) {
    writeModelFile(targetPath, model);
  }

  // Phase 3: Generate enums
  const enumRefs = [
    ...new Set([
      ...getEnumNamesFromImports(serviceImportsMap),
      ...getEnumNamesFromImports(modelImportsMap),
    ]),
  ];

  const mapImportRefToEnum = createImportRefToEnumMapper({ solution, types });

  for (const ref of enumRefs) {
    const enumDescriptor = mapImportRefToEnum(ref);
    writeEnumFile(targetPath, enumDescriptor);
  }

  // Phase 4: Update proxy config
  if (!proxyConfig.generated.includes(moduleName)) {
    proxyConfig.generated.push(moduleName);
  }
  proxyConfig.generated.sort();
}

/**
 * Writes a service file using the service.ts.ejs template.
 */
function writeServiceFile(targetPath: string, service: Service): void {
  const content = renderTemplate('service.ts.ejs', {
    ...service,
    camel,
    pascal,
    kebab,
    dir,
    serializeParameters,
  });

  const filePath = path.join(
    targetPath,
    PROXY_PATH,
    dir(service.namespace),
    `${kebab(service.name)}.service.ts`
  );

  writeFile(filePath, content);
}

/**
 * Writes a hook file using the hook.ts.ejs template.
 */
function writeHookFile(targetPath: string, service: Service): void {
  const hookImports = getHookImports(service.imports);

  const content = renderTemplate('hook.ts.ejs', {
    ...service,
    hookImports,
    camel,
    pascal,
    kebab,
    dir,
    serializeParameters,
    getQueryKeyType,
    getMutationVariablesType,
    getMutationFnParams,
  });

  const filePath = path.join(
    targetPath,
    PROXY_PATH,
    dir(service.namespace),
    `use-${kebab(service.name)}-service.ts`
  );

  writeFile(filePath, content);
}

/**
 * Writes a model file using the models.ts.ejs template.
 */
function writeModelFile(targetPath: string, model: Model): void {
  const content = renderTemplate('models.ts.ejs', {
    ...model,
    camel,
    pascal,
    kebab,
    dir,
  });

  const filePath = path.join(
    targetPath,
    PROXY_PATH,
    dir(model.namespace),
    'models.ts'
  );

  writeFile(filePath, content);
}

/**
 * Writes an enum file using the enum.ts.ejs template.
 */
function writeEnumFile(targetPath: string, enumDescriptor: EnumDescriptor): void {
  const content = renderTemplate('enum.ts.ejs', {
    ...enumDescriptor,
    camel,
    pascal,
    kebab,
    dir,
  });

  const filePath = path.join(
    targetPath,
    PROXY_PATH,
    dir(enumDescriptor.namespace),
    `${kebab(enumDescriptor.name)}.enum.ts`
  );

  writeFile(filePath, content);
}
