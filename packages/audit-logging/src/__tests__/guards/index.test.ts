/**
 * Tests for guards/index exports
 * @abpjs/audit-logging v3.0.0
 */
import { describe, it, expect } from 'vitest';
import * as Guards from '../../guards';

describe('guards exports (v3.0.0)', () => {
  it('should export auditLoggingExtensionsGuard', () => {
    expect(Guards.auditLoggingExtensionsGuard).toBeDefined();
    expect(typeof Guards.auditLoggingExtensionsGuard).toBe('function');
  });

  it('should export canActivateAuditLoggingExtensions', () => {
    expect(Guards.canActivateAuditLoggingExtensions).toBeDefined();
    expect(typeof Guards.canActivateAuditLoggingExtensions).toBe('function');
  });

  it('should export auditLoggingExtensionsLoader', () => {
    expect(Guards.auditLoggingExtensionsLoader).toBeDefined();
    expect(typeof Guards.auditLoggingExtensionsLoader).toBe('function');
  });
});
