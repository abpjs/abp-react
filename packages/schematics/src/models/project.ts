/**
 * Project Model
 * Translated from @abp/ng.schematics v3.1.0
 *
 * Represents a project definition for code generation.
 */

/**
 * Project definition interface.
 * Note: The Angular version uses @angular-devkit/core workspaces.ProjectDefinition.
 * In React, we use a simplified version without Angular-specific dependencies.
 */
export interface ProjectDefinition {
  root: string;
  sourceRoot?: string;
  prefix?: string;
  projectType?: 'application' | 'library';
  targets?: Record<string, unknown>;
  extensions?: Record<string, unknown>;
}

/**
 * Represents a project in the workspace.
 */
export interface Project {
  name: string;
  definition: ProjectDefinition;
}
