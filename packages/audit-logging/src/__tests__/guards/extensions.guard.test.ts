/**
 * Tests for guards/extensions.guard
 * @abpjs/audit-logging v3.0.0
 */
import { describe, it, expect } from 'vitest';
import {
  auditLoggingExtensionsGuard,
  canActivateAuditLoggingExtensions,
  auditLoggingExtensionsLoader,
} from '../../guards/extensions.guard';

describe('extensions.guard (v3.0.0)', () => {
  describe('auditLoggingExtensionsGuard', () => {
    it('should be a function', () => {
      expect(typeof auditLoggingExtensionsGuard).toBe('function');
    });

    it('should return a Promise', () => {
      const result = auditLoggingExtensionsGuard();
      expect(result).toBeInstanceOf(Promise);
    });

    it('should resolve to true', async () => {
      const result = await auditLoggingExtensionsGuard();
      expect(result).toBe(true);
    });

    it('should be awaitable', async () => {
      await expect(auditLoggingExtensionsGuard()).resolves.toBe(true);
    });
  });

  describe('canActivateAuditLoggingExtensions', () => {
    it('should be a function', () => {
      expect(typeof canActivateAuditLoggingExtensions).toBe('function');
    });

    it('should return true synchronously', () => {
      const result = canActivateAuditLoggingExtensions();
      expect(result).toBe(true);
    });

    it('should not return a Promise', () => {
      const result = canActivateAuditLoggingExtensions();
      expect(result).not.toBeInstanceOf(Promise);
    });

    it('should return boolean', () => {
      const result = canActivateAuditLoggingExtensions();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('auditLoggingExtensionsLoader', () => {
    it('should be a function', () => {
      expect(typeof auditLoggingExtensionsLoader).toBe('function');
    });

    it('should return a Promise', () => {
      const result = auditLoggingExtensionsLoader();
      expect(result).toBeInstanceOf(Promise);
    });

    it('should resolve to an object with ready property', async () => {
      const result = await auditLoggingExtensionsLoader();
      expect(result).toHaveProperty('ready');
    });

    it('should resolve with ready set to true', async () => {
      const result = await auditLoggingExtensionsLoader();
      expect(result.ready).toBe(true);
    });

    it('should return expected object shape', async () => {
      const result = await auditLoggingExtensionsLoader();
      expect(result).toEqual({ ready: true });
    });
  });

  describe('guard usage patterns', () => {
    it('should work in async route protection', async () => {
      const canAccess = await auditLoggingExtensionsGuard();
      if (canAccess) {
        // Route should be accessible
        expect(true).toBe(true);
      }
    });

    it('should work in conditional rendering', () => {
      const canRender = canActivateAuditLoggingExtensions();
      expect(canRender).toBe(true);
    });

    it('should work as react-router loader', async () => {
      const loaderResult = await auditLoggingExtensionsLoader();
      expect(loaderResult.ready).toBe(true);
    });

    it('should allow multiple consecutive calls', async () => {
      const [result1, result2, result3] = await Promise.all([
        auditLoggingExtensionsGuard(),
        auditLoggingExtensionsGuard(),
        auditLoggingExtensionsGuard(),
      ]);

      expect(result1).toBe(true);
      expect(result2).toBe(true);
      expect(result3).toBe(true);
    });
  });
});
