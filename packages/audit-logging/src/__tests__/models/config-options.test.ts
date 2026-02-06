/**
 * Tests for models/config-options
 * @abpjs/audit-logging v3.0.0
 */
import { describe, it, expect } from 'vitest';
import {
  type AuditLoggingConfigOptions,
  DEFAULT_AUDIT_LOGGING_CONFIG_OPTIONS,
} from '../../models/config-options';
import type { AuditLogging } from '../../models/audit-logging';
import type { EntityChange } from '../../models/entity-change';

describe('config-options (v3.0.0)', () => {
  describe('DEFAULT_AUDIT_LOGGING_CONFIG_OPTIONS', () => {
    it('should be an empty object', () => {
      expect(DEFAULT_AUDIT_LOGGING_CONFIG_OPTIONS).toEqual({});
    });

    it('should not have entityActionContributors', () => {
      expect(DEFAULT_AUDIT_LOGGING_CONFIG_OPTIONS.entityActionContributors).toBeUndefined();
    });

    it('should not have toolbarActionContributors', () => {
      expect(DEFAULT_AUDIT_LOGGING_CONFIG_OPTIONS.toolbarActionContributors).toBeUndefined();
    });

    it('should not have entityPropContributors', () => {
      expect(DEFAULT_AUDIT_LOGGING_CONFIG_OPTIONS.entityPropContributors).toBeUndefined();
    });
  });

  describe('AuditLoggingConfigOptions interface', () => {
    it('should accept empty object', () => {
      const options: AuditLoggingConfigOptions = {};
      expect(options).toBeDefined();
    });

    it('should accept entityActionContributors', () => {
      const options: AuditLoggingConfigOptions = {
        entityActionContributors: {
          'AuditLogging.AuditLogsComponent': [
            (actions) => [
              ...actions,
              {
                text: 'Custom Action',
                action: () => {},
              },
            ],
          ],
        },
      };
      expect(options.entityActionContributors).toBeDefined();
    });

    it('should accept toolbarActionContributors', () => {
      const options: AuditLoggingConfigOptions = {
        toolbarActionContributors: {
          'AuditLogging.AuditLogsComponent': [
            (actions) => [
              ...actions,
              {
                text: 'Export',
                action: () => {},
              },
            ],
          ],
        },
      };
      expect(options.toolbarActionContributors).toBeDefined();
    });

    it('should accept entityPropContributors', () => {
      const options: AuditLoggingConfigOptions = {
        entityPropContributors: {
          'AuditLogging.AuditLogsComponent': [
            (props) => [
              ...props,
              {
                type: 'string',
                name: 'customProp',
                displayName: 'Custom Property',
              },
            ],
          ],
        },
      };
      expect(options.entityPropContributors).toBeDefined();
    });

    it('should accept all contributors together', () => {
      const options: AuditLoggingConfigOptions = {
        entityActionContributors: {
          'AuditLogging.AuditLogsComponent': [],
          'AuditLogging.EntityChangesComponent': [],
        },
        toolbarActionContributors: {
          'AuditLogging.AuditLogsComponent': [],
        },
        entityPropContributors: {
          'AuditLogging.AuditLogsComponent': [],
        },
      };

      expect(options.entityActionContributors).toBeDefined();
      expect(options.toolbarActionContributors).toBeDefined();
      expect(options.entityPropContributors).toBeDefined();
    });

    it('should allow partial contributor configuration', () => {
      const options: AuditLoggingConfigOptions = {
        entityActionContributors: {
          'AuditLogging.AuditLogsComponent': [],
          // EntityChangesComponent is optional
        },
      };
      expect(options.entityActionContributors?.['AuditLogging.AuditLogsComponent']).toEqual([]);
      expect(options.entityActionContributors?.['AuditLogging.EntityChangesComponent']).toBeUndefined();
    });
  });

  describe('usage patterns', () => {
    it('should work with spread operator for extending defaults', () => {
      const customOptions: AuditLoggingConfigOptions = {
        ...DEFAULT_AUDIT_LOGGING_CONFIG_OPTIONS,
        entityActionContributors: {
          'AuditLogging.AuditLogsComponent': [],
        },
      };
      expect(customOptions.entityActionContributors).toBeDefined();
    });

    it('should allow merging multiple configs', () => {
      const config1: AuditLoggingConfigOptions = {
        entityActionContributors: {
          'AuditLogging.AuditLogsComponent': [],
        },
      };
      const config2: AuditLoggingConfigOptions = {
        toolbarActionContributors: {
          'AuditLogging.AuditLogsComponent': [],
        },
      };

      const merged: AuditLoggingConfigOptions = {
        ...config1,
        ...config2,
      };

      expect(merged.entityActionContributors).toBeDefined();
      expect(merged.toolbarActionContributors).toBeDefined();
    });
  });
});
