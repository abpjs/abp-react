/**
 * Exception Messages Enum
 * Translated from @abp/ng.schematics v3.1.0
 *
 * Standard error messages used by the schematics package.
 * Uses placeholders like {0}, {1} for interpolation.
 */

export const Exception = {
  /** Cannot remove directory */
  DirRemoveFailed: '[Directory Remove Failed] Cannot remove "{0}".',
  /** File not found at path */
  FileNotFound: '[File Not Found] There is no file at "{0}" path.',
  /** Cannot write file at path */
  FileWriteFailed: '[File Write Failed] Cannot write file at "{0}".',
  /** Backend module does not exist */
  InvalidModule: '[Invalid Module] Backend module "{0}" does not exist in API definition.',
  /** API definition is invalid */
  InvalidApiDefinition: '[Invalid API Definition] The provided API definition is invalid.',
  /** Workspace config is not valid JSON */
  InvalidWorkspace: '[Invalid Workspace] The angular.json should be a valid JSON file.',
  /** API is not available */
  NoApi: '[API Not Available] Please double-check the URL in the source project environment and make sure your application is up and running.',
  /** Project not found in workspace */
  NoProject: '[Project Not Found] Either define a default project in your workspace or specify the project name in schematics options.',
  /** Proxy config file not found */
  NoProxyConfig: '[Proxy Config Not Found] There is no JSON file at "{0}".',
  /** Type definition not found */
  NoTypeDefinition: '[Type Definition Not Found] There is no type definition for "{0}".',
  /** Workspace not found */
  NoWorkspace: '[Workspace Not Found] Make sure you are running schematics at the root directory of your workspace and it has an angular.json file.',
  /** Environment file not found */
  NoEnvironment: '[Environment Not Found] An environment file cannot be located in "{0}" project.',
  /** API URL not found for remote service */
  NoApiUrl: '[API URL Not Found] Cannot resolve API URL for "{1}" remote service name from "{0}" project.',
  /** Root namespace not found */
  NoRootNamespace: '[Root Namespace Not Found] Cannot resolve root namespace for "{1}" api from "{0}" project.',
} as const;

export type Exception = (typeof Exception)[keyof typeof Exception];
