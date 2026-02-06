/**
 * Tests for eAuditLoggingPolicyNames
 * @abpjs/audit-logging v3.0.0
 */
import { describe, it, expect } from 'vitest';
import {
  eAuditLoggingPolicyNames,
  type AuditLoggingPolicyNameKey,
} from '../../../config/enums/policy-names';

describe('eAuditLoggingPolicyNames (v3.0.0)', () => {
  describe('enum values', () => {
    it('should have AuditLogging policy with correct value', () => {
      expect(eAuditLoggingPolicyNames.AuditLogging).toBe('AuditLogging.AuditLogs');
    });
  });

  describe('enum structure', () => {
    it('should have exactly 1 key', () => {
      const keys = Object.keys(eAuditLoggingPolicyNames);
      expect(keys).toHaveLength(1);
    });

    it('should have AuditLogging key', () => {
      const keys = Object.keys(eAuditLoggingPolicyNames);
      expect(keys).toContain('AuditLogging');
    });

    it('should be an object', () => {
      expect(typeof eAuditLoggingPolicyNames).toBe('object');
      expect(eAuditLoggingPolicyNames).not.toBeNull();
    });
  });

  describe('type safety', () => {
    it('should work with AuditLoggingPolicyNameKey type', () => {
      const policyKey: AuditLoggingPolicyNameKey =
        eAuditLoggingPolicyNames.AuditLogging;
      expect(policyKey).toBe('AuditLogging.AuditLogs');
    });

    it('should preserve literal types', () => {
      const value = eAuditLoggingPolicyNames.AuditLogging;
      expect(value).toBe('AuditLogging.AuditLogs');

      const exactValue: 'AuditLogging.AuditLogs' =
        eAuditLoggingPolicyNames.AuditLogging;
      expect(exactValue).toBe('AuditLogging.AuditLogs');
    });
  });

  describe('policy format', () => {
    it('should follow ABP policy naming convention (Module.Permission)', () => {
      expect(eAuditLoggingPolicyNames.AuditLogging).toMatch(/^[A-Za-z]+\.[A-Za-z]+$/);
    });

    it('should start with AuditLogging module name', () => {
      expect(eAuditLoggingPolicyNames.AuditLogging).toMatch(/^AuditLogging\./);
    });
  });

  describe('usage patterns', () => {
    it('should allow iteration over all policy keys', () => {
      const allKeys = Object.values(eAuditLoggingPolicyNames);
      expect(allKeys).toHaveLength(1);
      expect(allKeys).toContain('AuditLogging.AuditLogs');
    });

    it('should allow lookup by key name', () => {
      const keyName = 'AuditLogging' as keyof typeof eAuditLoggingPolicyNames;
      const value = eAuditLoggingPolicyNames[keyName];
      expect(value).toBe('AuditLogging.AuditLogs');
    });

    it('should work as permission check value', () => {
      const grantedPolicies: Record<string, boolean> = {
        [eAuditLoggingPolicyNames.AuditLogging]: true,
      };
      expect(grantedPolicies[eAuditLoggingPolicyNames.AuditLogging]).toBe(true);
    });

    it('should work in conditional permission checks', () => {
      const userPolicies = new Set([eAuditLoggingPolicyNames.AuditLogging]);
      expect(userPolicies.has(eAuditLoggingPolicyNames.AuditLogging)).toBe(true);
    });
  });
});
