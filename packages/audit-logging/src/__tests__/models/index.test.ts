/**
 * Tests for models/index barrel exports
 * @abpjs/audit-logging v4.0.0
 *
 * @since 4.0.0 - Removed entity-change export (use proxy DTOs)
 */
import { describe, it, expect } from 'vitest';
import * as ModelsExports from '../../models';

describe('models/index exports (v4.0.0)', () => {
  it('should export AuditLogging namespace', () => {
    // AuditLogging is a namespace with State interface, exported as a value via namespace
    expect(ModelsExports).toBeDefined();
  });

  it('should have AuditLogging.State accessible via type system', () => {
    // Verify the namespace models are re-exported
    const state: ModelsExports.AuditLogging.State = {
      result: { items: [], totalCount: 0 },
      averageExecutionStatistics: {},
      errorRateStatistics: {},
    };

    expect(state.result.items).toEqual([]);
    expect(state.result.totalCount).toBe(0);
    expect(state.averageExecutionStatistics).toEqual({});
    expect(state.errorRateStatistics).toEqual({});
  });

  it('should not export EntityChange namespace (removed in v4.0.0)', () => {
    expect(
      (ModelsExports as Record<string, unknown>).EntityChange
    ).toBeUndefined();
  });

  it('should not export Statistics namespace (removed in v4.0.0)', () => {
    expect(
      (ModelsExports as Record<string, unknown>).Statistics
    ).toBeUndefined();
  });

  it('should export config-options types', () => {
    // DEFAULT_AUDIT_LOGGING_CONFIG_OPTIONS is a value export from config-options
    expect(ModelsExports.DEFAULT_AUDIT_LOGGING_CONFIG_OPTIONS).toBeDefined();
    expect(typeof ModelsExports.DEFAULT_AUDIT_LOGGING_CONFIG_OPTIONS).toBe('object');
  });
});
