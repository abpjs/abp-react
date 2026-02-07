/**
 * Tests for eFileManagementPolicyNames
 * @abpjs/file-management v3.2.0
 */
import { describe, it, expect } from 'vitest';
import { eFileManagementPolicyNames } from '../../../config/enums/policy-names';

describe('eFileManagementPolicyNames', () => {
  describe('DirectoryDescriptor policies', () => {
    it('should have DirectoryDescriptor base policy', () => {
      expect(eFileManagementPolicyNames.DirectoryDescriptor).toBe(
        'FileManagement.DirectoryDescriptor'
      );
    });

    it('should have DirectoryDescriptorCreate policy', () => {
      expect(eFileManagementPolicyNames.DirectoryDescriptorCreate).toBe(
        'FileManagement.DirectoryDescriptor.Create'
      );
    });

    it('should have DirectoryDescriptorDelete policy', () => {
      expect(eFileManagementPolicyNames.DirectoryDescriptorDelete).toBe(
        'FileManagement.DirectoryDescriptor.Delete'
      );
    });

    it('should have DirectoryDescriptorUpdate policy', () => {
      expect(eFileManagementPolicyNames.DirectoryDescriptorUpdate).toBe(
        'FileManagement.DirectoryDescriptor.Update'
      );
    });
  });

  describe('FileDescriptor policies', () => {
    it('should have FileDescriptor base policy', () => {
      expect(eFileManagementPolicyNames.FileDescriptor).toBe('FileManagement.FileDescriptor');
    });

    it('should have FileDescriptorCreate policy', () => {
      expect(eFileManagementPolicyNames.FileDescriptorCreate).toBe(
        'FileManagement.FileDescriptor.Create'
      );
    });

    it('should have FileDescriptorDelete policy', () => {
      expect(eFileManagementPolicyNames.FileDescriptorDelete).toBe(
        'FileManagement.FileDescriptor.Delete'
      );
    });

    it('should have FileDescriptorUpdate policy', () => {
      expect(eFileManagementPolicyNames.FileDescriptorUpdate).toBe(
        'FileManagement.FileDescriptor.Update'
      );
    });
  });

  describe('policy naming convention', () => {
    it('should follow FileManagement.Entity.Action pattern for CRUD policies', () => {
      const crudPolicies = [
        eFileManagementPolicyNames.DirectoryDescriptorCreate,
        eFileManagementPolicyNames.DirectoryDescriptorDelete,
        eFileManagementPolicyNames.DirectoryDescriptorUpdate,
        eFileManagementPolicyNames.FileDescriptorCreate,
        eFileManagementPolicyNames.FileDescriptorDelete,
        eFileManagementPolicyNames.FileDescriptorUpdate,
      ];

      crudPolicies.forEach((policy) => {
        expect(policy).toMatch(/^FileManagement\.\w+\.(Create|Delete|Update)$/);
      });
    });

    it('should follow FileManagement.Entity pattern for base policies', () => {
      const basePolicies = [
        eFileManagementPolicyNames.DirectoryDescriptor,
        eFileManagementPolicyNames.FileDescriptor,
      ];

      basePolicies.forEach((policy) => {
        expect(policy).toMatch(/^FileManagement\.\w+$/);
      });
    });

    it('all policies should start with FileManagement prefix', () => {
      const allPolicies = Object.values(eFileManagementPolicyNames);
      allPolicies.forEach((policy) => {
        expect(policy.startsWith('FileManagement.')).toBe(true);
      });
    });
  });

  describe('policy count', () => {
    it('should have exactly 8 policies', () => {
      const policyCount = Object.keys(eFileManagementPolicyNames).length;
      expect(policyCount).toBe(8);
    });
  });

  describe('usage in permission checks', () => {
    it('should be usable for grantedPolicies lookup', () => {
      const grantedPolicies: Record<string, boolean> = {
        [eFileManagementPolicyNames.DirectoryDescriptor]: true,
        [eFileManagementPolicyNames.FileDescriptor]: true,
        [eFileManagementPolicyNames.DirectoryDescriptorCreate]: false,
      };

      expect(grantedPolicies[eFileManagementPolicyNames.DirectoryDescriptor]).toBe(true);
      expect(grantedPolicies[eFileManagementPolicyNames.DirectoryDescriptorCreate]).toBe(false);
      expect(grantedPolicies[eFileManagementPolicyNames.DirectoryDescriptorDelete]).toBeUndefined();
    });
  });
});
