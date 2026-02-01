/**
 * Tests for Audit Logging Enums
 * @abpjs/audit-logging v2.4.0
 */
import { describe, it, expect } from 'vitest';
import { eAuditLoggingComponents } from '../enums';

describe('eAuditLoggingComponents (v2.4.0)', () => {
  it('should have AuditLogs component identifier', () => {
    expect(eAuditLoggingComponents.AuditLogs).toBe('AuditLogging.AuditLogsComponent');
  });

  it('should be usable as a string value', () => {
    const componentKey: string = eAuditLoggingComponents.AuditLogs;
    expect(componentKey).toBe('AuditLogging.AuditLogsComponent');
  });

  it('should be usable for component registration', () => {
    // Simulate component registration pattern
    const componentRegistry: Record<string, string> = {};
    componentRegistry[eAuditLoggingComponents.AuditLogs] = 'AuditLogsComponent';

    expect(componentRegistry['AuditLogging.AuditLogsComponent']).toBe('AuditLogsComponent');
  });

  it('should have correct enum keys', () => {
    const keys = Object.keys(eAuditLoggingComponents);
    expect(keys).toContain('AuditLogs');
  });

  it('should have correct enum values', () => {
    const values = Object.values(eAuditLoggingComponents);
    expect(values).toContain('AuditLogging.AuditLogsComponent');
  });
});
