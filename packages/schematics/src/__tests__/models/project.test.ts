/**
 * Project Model Tests
 */

import { describe, expect, it } from 'vitest';
import type { Project, ProjectDefinition } from '../../models/project';

describe('ProjectDefinition', () => {
  it('should be correctly typed with minimal options', () => {
    const definition: ProjectDefinition = {
      root: 'apps/my-app',
    };

    expect(definition.root).toBe('apps/my-app');
    expect(definition.sourceRoot).toBeUndefined();
    expect(definition.prefix).toBeUndefined();
    expect(definition.projectType).toBeUndefined();
  });

  it('should be correctly typed with all options', () => {
    const definition: ProjectDefinition = {
      root: 'apps/my-app',
      sourceRoot: 'apps/my-app/src',
      prefix: 'app',
      projectType: 'application',
      targets: {
        build: { executor: '@nrwl/web:build' },
      },
      extensions: {
        custom: 'value',
      },
    };

    expect(definition.root).toBe('apps/my-app');
    expect(definition.sourceRoot).toBe('apps/my-app/src');
    expect(definition.prefix).toBe('app');
    expect(definition.projectType).toBe('application');
    expect(definition.targets).toBeDefined();
    expect(definition.extensions).toBeDefined();
  });

  it('should support library project type', () => {
    const definition: ProjectDefinition = {
      root: 'libs/shared',
      projectType: 'library',
    };

    expect(definition.projectType).toBe('library');
  });
});

describe('Project', () => {
  it('should be correctly typed', () => {
    const project: Project = {
      name: 'my-app',
      definition: {
        root: 'apps/my-app',
        sourceRoot: 'apps/my-app/src',
        projectType: 'application',
      },
    };

    expect(project.name).toBe('my-app');
    expect(project.definition.root).toBe('apps/my-app');
  });
});
