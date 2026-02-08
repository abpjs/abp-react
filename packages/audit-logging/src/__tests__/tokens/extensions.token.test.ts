/**
 * Tests for tokens/extensions.token
 * @abpjs/audit-logging v4.0.0
 *
 * @since 4.0.0 - Updated type references from namespace types to proxy DTOs
 */
import { describe, it, expect } from 'vitest';
import {
  DEFAULT_AUDIT_LOGGING_ENTITY_ACTIONS,
  DEFAULT_AUDIT_LOGGING_TOOLBAR_ACTIONS,
  DEFAULT_AUDIT_LOGGING_ENTITY_PROPS,
  AUDIT_LOGGING_ENTITY_ACTION_CONTRIBUTORS,
  AUDIT_LOGGING_TOOLBAR_ACTION_CONTRIBUTORS,
  AUDIT_LOGGING_ENTITY_PROP_CONTRIBUTORS,
  type EntityAction,
  type EntityProp,
  type ToolbarAction,
  type EntityActionContributorCallback,
  type EntityPropContributorCallback,
  type ToolbarActionContributorCallback,
} from '../../tokens/extensions.token';
import type { AuditLogDto } from '../../proxy/audit-logging/models';

describe('extensions.token (v4.0.0)', () => {
  describe('DEFAULT_AUDIT_LOGGING_ENTITY_ACTIONS', () => {
    it('should be an object', () => {
      expect(typeof DEFAULT_AUDIT_LOGGING_ENTITY_ACTIONS).toBe('object');
    });

    it('should have AuditLogsComponent key', () => {
      expect(DEFAULT_AUDIT_LOGGING_ENTITY_ACTIONS).toHaveProperty(
        'AuditLogging.AuditLogsComponent'
      );
    });

    it('should have EntityChangesComponent key', () => {
      expect(DEFAULT_AUDIT_LOGGING_ENTITY_ACTIONS).toHaveProperty(
        'AuditLogging.EntityChangesComponent'
      );
    });

    it('should have empty arrays as default values', () => {
      expect(DEFAULT_AUDIT_LOGGING_ENTITY_ACTIONS['AuditLogging.AuditLogsComponent']).toEqual([]);
      expect(DEFAULT_AUDIT_LOGGING_ENTITY_ACTIONS['AuditLogging.EntityChangesComponent']).toEqual(
        []
      );
    });
  });

  describe('DEFAULT_AUDIT_LOGGING_TOOLBAR_ACTIONS', () => {
    it('should be an object', () => {
      expect(typeof DEFAULT_AUDIT_LOGGING_TOOLBAR_ACTIONS).toBe('object');
    });

    it('should have AuditLogsComponent key', () => {
      expect(DEFAULT_AUDIT_LOGGING_TOOLBAR_ACTIONS).toHaveProperty(
        'AuditLogging.AuditLogsComponent'
      );
    });

    it('should have empty array as default value', () => {
      expect(DEFAULT_AUDIT_LOGGING_TOOLBAR_ACTIONS['AuditLogging.AuditLogsComponent']).toEqual([]);
    });
  });

  describe('DEFAULT_AUDIT_LOGGING_ENTITY_PROPS', () => {
    it('should be an object', () => {
      expect(typeof DEFAULT_AUDIT_LOGGING_ENTITY_PROPS).toBe('object');
    });

    it('should have AuditLogsComponent key', () => {
      expect(DEFAULT_AUDIT_LOGGING_ENTITY_PROPS).toHaveProperty(
        'AuditLogging.AuditLogsComponent'
      );
    });

    it('should have empty array as default value', () => {
      expect(DEFAULT_AUDIT_LOGGING_ENTITY_PROPS['AuditLogging.AuditLogsComponent']).toEqual([]);
    });
  });

  describe('contributor tokens', () => {
    describe('AUDIT_LOGGING_ENTITY_ACTION_CONTRIBUTORS', () => {
      it('should be a symbol', () => {
        expect(typeof AUDIT_LOGGING_ENTITY_ACTION_CONTRIBUTORS).toBe('symbol');
      });

      it('should have descriptive name', () => {
        expect(AUDIT_LOGGING_ENTITY_ACTION_CONTRIBUTORS.description).toBe(
          'AUDIT_LOGGING_ENTITY_ACTION_CONTRIBUTORS'
        );
      });
    });

    describe('AUDIT_LOGGING_TOOLBAR_ACTION_CONTRIBUTORS', () => {
      it('should be a symbol', () => {
        expect(typeof AUDIT_LOGGING_TOOLBAR_ACTION_CONTRIBUTORS).toBe('symbol');
      });

      it('should have descriptive name', () => {
        expect(AUDIT_LOGGING_TOOLBAR_ACTION_CONTRIBUTORS.description).toBe(
          'AUDIT_LOGGING_TOOLBAR_ACTION_CONTRIBUTORS'
        );
      });
    });

    describe('AUDIT_LOGGING_ENTITY_PROP_CONTRIBUTORS', () => {
      it('should be a symbol', () => {
        expect(typeof AUDIT_LOGGING_ENTITY_PROP_CONTRIBUTORS).toBe('symbol');
      });

      it('should have descriptive name', () => {
        expect(AUDIT_LOGGING_ENTITY_PROP_CONTRIBUTORS.description).toBe(
          'AUDIT_LOGGING_ENTITY_PROP_CONTRIBUTORS'
        );
      });
    });

    it('should all be unique symbols', () => {
      expect(AUDIT_LOGGING_ENTITY_ACTION_CONTRIBUTORS).not.toBe(
        AUDIT_LOGGING_TOOLBAR_ACTION_CONTRIBUTORS
      );
      expect(AUDIT_LOGGING_TOOLBAR_ACTION_CONTRIBUTORS).not.toBe(
        AUDIT_LOGGING_ENTITY_PROP_CONTRIBUTORS
      );
      expect(AUDIT_LOGGING_ENTITY_ACTION_CONTRIBUTORS).not.toBe(
        AUDIT_LOGGING_ENTITY_PROP_CONTRIBUTORS
      );
    });
  });

  describe('EntityAction interface', () => {
    it('should accept valid entity action object', () => {
      const action: EntityAction<AuditLogDto> = {
        text: 'View Details',
        action: ({ record }) => console.log(record.id),
      };
      expect(action.text).toBe('View Details');
      expect(typeof action.action).toBe('function');
    });

    it('should accept optional properties', () => {
      const action: EntityAction<AuditLogDto> = {
        text: 'Delete',
        action: () => {},
        permission: 'AuditLogging.Delete',
        visible: ({ record }) => record.httpStatusCode !== 200,
        icon: 'fas fa-trash',
        className: 'btn-danger',
      };
      expect(action.permission).toBe('AuditLogging.Delete');
      expect(action.icon).toBe('fas fa-trash');
      expect(action.className).toBe('btn-danger');
    });
  });

  describe('EntityProp interface', () => {
    it('should accept valid entity prop object', () => {
      const prop: EntityProp<AuditLogDto> = {
        type: 'string',
        name: 'url',
        displayName: 'URL',
      };
      expect(prop.type).toBe('string');
      expect(prop.name).toBe('url');
    });

    it('should accept all valid types', () => {
      const types: EntityProp<any>['type'][] = ['string', 'number', 'boolean', 'date', 'enum'];
      types.forEach((type) => {
        const prop: EntityProp<AuditLogDto> = {
          type,
          name: 'test',
          displayName: 'Test',
        };
        expect(prop.type).toBe(type);
      });
    });

    it('should accept optional properties', () => {
      const prop: EntityProp<AuditLogDto> = {
        type: 'number',
        name: 'httpStatusCode',
        displayName: 'Status',
        sortable: true,
        columnWidth: 100,
        valueResolver: ({ record }) => String(record.httpStatusCode ?? ''),
        visible: true,
      };
      expect(prop.sortable).toBe(true);
      expect(prop.columnWidth).toBe(100);
    });
  });

  describe('ToolbarAction interface', () => {
    it('should accept valid toolbar action object', () => {
      const action: ToolbarAction<AuditLogDto[]> = {
        text: 'Export',
        action: ({ records }) => console.log(records),
      };
      expect(action.text).toBe('Export');
    });

    it('should accept optional properties', () => {
      const action: ToolbarAction<AuditLogDto[]> = {
        text: 'Refresh',
        action: () => {},
        permission: 'AuditLogging.Read',
        visible: () => true,
        icon: 'fas fa-sync',
        className: 'btn-primary',
      };
      expect(action.permission).toBe('AuditLogging.Read');
    });
  });

  describe('contributor callback types', () => {
    it('should accept EntityActionContributorCallback', () => {
      const contributor: EntityActionContributorCallback<AuditLogDto> = (actionList) => {
        return [
          ...actionList,
          {
            text: 'Custom Action',
            action: () => {},
          },
        ];
      };
      const result = contributor([]);
      expect(result).toHaveLength(1);
    });

    it('should accept EntityPropContributorCallback', () => {
      const contributor: EntityPropContributorCallback<AuditLogDto> = (propList) => {
        return [
          ...propList,
          {
            type: 'string',
            name: 'customProp',
            displayName: 'Custom',
          },
        ];
      };
      const result = contributor([]);
      expect(result).toHaveLength(1);
    });

    it('should accept ToolbarActionContributorCallback', () => {
      const contributor: ToolbarActionContributorCallback<AuditLogDto[]> = (actionList) => {
        return [
          ...actionList,
          {
            text: 'Custom Toolbar',
            action: () => {},
          },
        ];
      };
      const result = contributor([]);
      expect(result).toHaveLength(1);
    });
  });
});
