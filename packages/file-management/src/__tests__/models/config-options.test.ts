/**
 * Tests for config-options
 * @abpjs/file-management v3.2.0
 */
import { describe, it, expect } from 'vitest';
import { eFileManagementComponents } from '../../enums/components';
import type {
  EntityAction,
  EntityProp,
  ToolbarAction,
  EntityActionContributorCallback,
  EntityPropContributorCallback,
  ToolbarActionContributorCallback,
  FileManagementEntityActionContributors,
  FileManagementEntityPropContributors,
  FileManagementToolbarActionContributors,
  FileManagementConfigOptions,
} from '../../models/config-options';
import type { DirectoryContentDto } from '../../proxy/directories/models';

describe('config-options', () => {
  describe('EntityAction', () => {
    it('should accept valid entity action', () => {
      const action: EntityAction<DirectoryContentDto> = {
        text: 'Download',
        action: (record) => {
          console.log('Downloading:', record.name);
        },
      };

      expect(action.text).toBe('Download');
      expect(typeof action.action).toBe('function');
    });

    it('should accept action with all optional fields', () => {
      const action: EntityAction<DirectoryContentDto> = {
        text: 'Delete',
        action: () => {},
        permission: 'FileManagement.FileDescriptor.Delete',
        visible: (record) => !record.isDirectory,
        icon: 'fa-trash',
      };

      expect(action.permission).toBe('FileManagement.FileDescriptor.Delete');
      expect(action.icon).toBe('fa-trash');
      expect(typeof action.visible).toBe('function');
    });
  });

  describe('EntityProp', () => {
    it('should accept valid entity prop', () => {
      const prop: EntityProp<DirectoryContentDto> = {
        type: 'string',
        name: 'name',
        displayName: 'Name',
      };

      expect(prop.type).toBe('string');
      expect(prop.name).toBe('name');
      expect(prop.displayName).toBe('Name');
    });

    it('should accept prop with all optional fields', () => {
      const prop: EntityProp<DirectoryContentDto> = {
        type: 'number',
        name: 'size',
        displayName: 'Size',
        sortable: true,
        visible: (record) => !record.isDirectory,
        valueResolver: (record) => `${record.size} bytes`,
      };

      expect(prop.sortable).toBe(true);
      expect(typeof prop.visible).toBe('function');
      expect(typeof prop.valueResolver).toBe('function');
    });

    it('should support different prop types', () => {
      const types: EntityProp<DirectoryContentDto>['type'][] = [
        'string',
        'number',
        'boolean',
        'date',
        'enum',
      ];

      types.forEach((type) => {
        const prop: EntityProp<DirectoryContentDto> = {
          type,
          name: 'test',
          displayName: 'Test',
        };
        expect(prop.type).toBe(type);
      });
    });
  });

  describe('ToolbarAction', () => {
    it('should accept valid toolbar action', () => {
      const action: ToolbarAction<DirectoryContentDto[]> = {
        text: 'Bulk Delete',
        action: (data) => {
          console.log('Deleting', data.length, 'items');
        },
      };

      expect(action.text).toBe('Bulk Delete');
      expect(typeof action.action).toBe('function');
    });

    it('should accept toolbar action with all optional fields', () => {
      const action: ToolbarAction<DirectoryContentDto[]> = {
        text: 'Export Selected',
        action: () => {},
        permission: 'FileManagement.Export',
        visible: (data) => data.length > 0,
        icon: 'fa-download',
      };

      expect(action.permission).toBe('FileManagement.Export');
      expect(action.icon).toBe('fa-download');
    });
  });

  describe('Contributor callbacks', () => {
    it('should accept EntityActionContributorCallback', () => {
      const callback: EntityActionContributorCallback<DirectoryContentDto> = (actions) => {
        actions.push({
          text: 'Custom Action',
          action: () => {},
        });
      };

      const actions: EntityAction<DirectoryContentDto>[] = [];
      callback(actions);

      expect(actions).toHaveLength(1);
      expect(actions[0].text).toBe('Custom Action');
    });

    it('should accept EntityPropContributorCallback', () => {
      const callback: EntityPropContributorCallback<DirectoryContentDto> = (props) => {
        props.push({
          type: 'string',
          name: 'customProp',
          displayName: 'Custom Property',
        });
      };

      const props: EntityProp<DirectoryContentDto>[] = [];
      callback(props);

      expect(props).toHaveLength(1);
      expect(props[0].name).toBe('customProp');
    });

    it('should accept ToolbarActionContributorCallback', () => {
      const callback: ToolbarActionContributorCallback<DirectoryContentDto[]> = (actions) => {
        actions.push({
          text: 'Custom Toolbar Action',
          action: () => {},
        });
      };

      const actions: ToolbarAction<DirectoryContentDto[]>[] = [];
      callback(actions);

      expect(actions).toHaveLength(1);
      expect(actions[0].text).toBe('Custom Toolbar Action');
    });
  });

  describe('FileManagementEntityActionContributors', () => {
    it('should accept contributors for FolderContent', () => {
      const contributors: FileManagementEntityActionContributors = {
        [eFileManagementComponents.FolderContent]: [
          (actions) => {
            actions.push({ text: 'Action 1', action: () => {} });
          },
          (actions) => {
            actions.push({ text: 'Action 2', action: () => {} });
          },
        ],
      };

      expect(contributors[eFileManagementComponents.FolderContent]).toHaveLength(2);
    });

    it('should accept empty contributors', () => {
      const contributors: FileManagementEntityActionContributors = {};
      expect(contributors[eFileManagementComponents.FolderContent]).toBeUndefined();
    });
  });

  describe('FileManagementEntityPropContributors', () => {
    it('should accept contributors for FolderContent', () => {
      const contributors: FileManagementEntityPropContributors = {
        [eFileManagementComponents.FolderContent]: [
          (props) => {
            props.push({ type: 'string', name: 'custom', displayName: 'Custom' });
          },
        ],
      };

      expect(contributors[eFileManagementComponents.FolderContent]).toHaveLength(1);
    });
  });

  describe('FileManagementToolbarActionContributors', () => {
    it('should accept contributors for FolderContent', () => {
      const contributors: FileManagementToolbarActionContributors = {
        [eFileManagementComponents.FolderContent]: [
          (actions) => {
            actions.push({ text: 'Toolbar Action', action: () => {} });
          },
        ],
      };

      expect(contributors[eFileManagementComponents.FolderContent]).toHaveLength(1);
    });
  });

  describe('FileManagementConfigOptions', () => {
    it('should accept full config options', () => {
      const options: FileManagementConfigOptions = {
        entityActionContributors: {
          [eFileManagementComponents.FolderContent]: [() => {}],
        },
        entityPropContributors: {
          [eFileManagementComponents.FolderContent]: [() => {}],
        },
        toolbarActionContributors: {
          [eFileManagementComponents.FolderContent]: [() => {}],
        },
      };

      expect(options.entityActionContributors).toBeDefined();
      expect(options.entityPropContributors).toBeDefined();
      expect(options.toolbarActionContributors).toBeDefined();
    });

    it('should accept partial config options', () => {
      const options: FileManagementConfigOptions = {
        entityActionContributors: {
          [eFileManagementComponents.FolderContent]: [() => {}],
        },
      };

      expect(options.entityActionContributors).toBeDefined();
      expect(options.entityPropContributors).toBeUndefined();
      expect(options.toolbarActionContributors).toBeUndefined();
    });

    it('should accept empty config options', () => {
      const options: FileManagementConfigOptions = {};

      expect(options.entityActionContributors).toBeUndefined();
      expect(options.entityPropContributors).toBeUndefined();
      expect(options.toolbarActionContributors).toBeUndefined();
    });
  });
});
