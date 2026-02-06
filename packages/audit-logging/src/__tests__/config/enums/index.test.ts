/**
 * Tests for config/enums/index exports
 * @abpjs/audit-logging v3.0.0
 */
import { describe, it, expect } from 'vitest';
import * as ConfigEnums from '../../../config/enums';

describe('config/enums exports (v3.0.0)', () => {
  it('should export eAuditLoggingPolicyNames', () => {
    expect(ConfigEnums.eAuditLoggingPolicyNames).toBeDefined();
    expect(ConfigEnums.eAuditLoggingPolicyNames.AuditLogging).toBe('AuditLogging.AuditLogs');
  });

  it('should export eAuditLoggingRouteNames', () => {
    expect(ConfigEnums.eAuditLoggingRouteNames).toBeDefined();
    expect(ConfigEnums.eAuditLoggingRouteNames.AuditLogging).toBe('AbpAuditLogging::Menu:AuditLogging');
  });

  it('should export all expected enums', () => {
    const exportedKeys = Object.keys(ConfigEnums);
    expect(exportedKeys).toContain('eAuditLoggingPolicyNames');
    expect(exportedKeys).toContain('eAuditLoggingRouteNames');
  });
});
