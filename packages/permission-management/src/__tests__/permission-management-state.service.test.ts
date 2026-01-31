import { describe, it, expect, beforeEach } from 'vitest';
import { PermissionManagementStateService } from '../services/permission-management-state.service';
import type { PermissionManagement } from '../models';

describe('PermissionManagementStateService', () => {
  let service: PermissionManagementStateService;

  beforeEach(() => {
    service = new PermissionManagementStateService();
  });

  describe('initial state', () => {
    it('should have empty groups initially', () => {
      expect(service.getPermissionGroups()).toEqual([]);
    });

    it('should have empty entity display name initially', () => {
      expect(service.getEntityDisplayName()).toBe('');
    });
  });

  describe('setGroups and getPermissionGroups', () => {
    it('should set and get permission groups', () => {
      const groups: PermissionManagement.Group[] = [
        {
          name: 'IdentityManagement',
          displayName: 'Identity Management',
          permissions: [
            {
              name: 'AbpIdentity.Users',
              displayName: 'User Management',
              isGranted: true,
              parentName: '',
              allowedProviders: ['R', 'U'],
              grantedProviders: [{ providerName: 'R', providerKey: 'admin' }],
            },
          ],
        },
      ];

      service.setGroups(groups);
      expect(service.getPermissionGroups()).toEqual(groups);
    });

    it('should handle multiple groups', () => {
      const groups: PermissionManagement.Group[] = [
        {
          name: 'Group1',
          displayName: 'Group One',
          permissions: [],
        },
        {
          name: 'Group2',
          displayName: 'Group Two',
          permissions: [],
        },
        {
          name: 'Group3',
          displayName: 'Group Three',
          permissions: [],
        },
      ];

      service.setGroups(groups);
      expect(service.getPermissionGroups()).toHaveLength(3);
      expect(service.getPermissionGroups()[0].name).toBe('Group1');
      expect(service.getPermissionGroups()[2].name).toBe('Group3');
    });

    it('should overwrite previous groups', () => {
      const groups1: PermissionManagement.Group[] = [
        { name: 'First', displayName: 'First Group', permissions: [] },
      ];
      const groups2: PermissionManagement.Group[] = [
        { name: 'Second', displayName: 'Second Group', permissions: [] },
      ];

      service.setGroups(groups1);
      expect(service.getPermissionGroups()[0].name).toBe('First');

      service.setGroups(groups2);
      expect(service.getPermissionGroups()).toHaveLength(1);
      expect(service.getPermissionGroups()[0].name).toBe('Second');
    });
  });

  describe('setEntityDisplayName and getEntityDisplayName', () => {
    it('should set and get entity display name', () => {
      service.setEntityDisplayName('Admin Role');
      expect(service.getEntityDisplayName()).toBe('Admin Role');
    });

    it('should handle empty string', () => {
      service.setEntityDisplayName('Some Name');
      service.setEntityDisplayName('');
      expect(service.getEntityDisplayName()).toBe('');
    });

    it('should handle special characters', () => {
      const specialName = 'Role: Admin (Test) <Special>';
      service.setEntityDisplayName(specialName);
      expect(service.getEntityDisplayName()).toBe(specialName);
    });

    it('should overwrite previous entity display name', () => {
      service.setEntityDisplayName('First Name');
      service.setEntityDisplayName('Second Name');
      expect(service.getEntityDisplayName()).toBe('Second Name');
    });
  });

  describe('reset', () => {
    it('should reset groups to empty array', () => {
      const groups: PermissionManagement.Group[] = [
        { name: 'Test', displayName: 'Test Group', permissions: [] },
      ];
      service.setGroups(groups);
      expect(service.getPermissionGroups()).toHaveLength(1);

      service.reset();
      expect(service.getPermissionGroups()).toEqual([]);
    });

    it('should reset entity display name to empty string', () => {
      service.setEntityDisplayName('Admin Role');
      expect(service.getEntityDisplayName()).toBe('Admin Role');

      service.reset();
      expect(service.getEntityDisplayName()).toBe('');
    });

    it('should reset all state at once', () => {
      const groups: PermissionManagement.Group[] = [
        {
          name: 'IdentityManagement',
          displayName: 'Identity Management',
          permissions: [
            {
              name: 'AbpIdentity.Users',
              displayName: 'User Management',
              isGranted: true,
              parentName: '',
              allowedProviders: ['R'],
              grantedProviders: [],
            },
          ],
        },
      ];

      service.setGroups(groups);
      service.setEntityDisplayName('Test Entity');

      expect(service.getPermissionGroups()).toHaveLength(1);
      expect(service.getEntityDisplayName()).toBe('Test Entity');

      service.reset();

      expect(service.getPermissionGroups()).toEqual([]);
      expect(service.getEntityDisplayName()).toBe('');
    });

    it('should allow setting values again after reset', () => {
      const groups1: PermissionManagement.Group[] = [
        { name: 'First', displayName: 'First Group', permissions: [] },
      ];

      service.setGroups(groups1);
      service.setEntityDisplayName('First Entity');
      service.reset();

      const groups2: PermissionManagement.Group[] = [
        { name: 'Second', displayName: 'Second Group', permissions: [] },
      ];

      service.setGroups(groups2);
      service.setEntityDisplayName('Second Entity');

      expect(service.getPermissionGroups()[0].name).toBe('Second');
      expect(service.getEntityDisplayName()).toBe('Second Entity');
    });
  });

  describe('integration scenarios', () => {
    it('should handle typical usage flow', () => {
      // Initial state
      expect(service.getPermissionGroups()).toEqual([]);
      expect(service.getEntityDisplayName()).toBe('');

      // Load data
      const groups: PermissionManagement.Group[] = [
        {
          name: 'IdentityManagement',
          displayName: 'Identity Management',
          permissions: [
            {
              name: 'AbpIdentity.Users',
              displayName: 'User Management',
              isGranted: true,
              parentName: '',
              allowedProviders: ['R', 'U'],
              grantedProviders: [{ providerName: 'R', providerKey: 'admin' }],
            },
            {
              name: 'AbpIdentity.Users.Create',
              displayName: 'Create Users',
              isGranted: false,
              parentName: 'AbpIdentity.Users',
              allowedProviders: ['R', 'U'],
              grantedProviders: [],
            },
          ],
        },
      ];

      service.setGroups(groups);
      service.setEntityDisplayName('Admin Role');

      // Verify data
      expect(service.getPermissionGroups()).toHaveLength(1);
      expect(service.getPermissionGroups()[0].permissions).toHaveLength(2);
      expect(service.getEntityDisplayName()).toBe('Admin Role');

      // Reset for new context
      service.reset();

      expect(service.getPermissionGroups()).toEqual([]);
      expect(service.getEntityDisplayName()).toBe('');
    });

    it('should maintain reference equality for arrays', () => {
      const groups: PermissionManagement.Group[] = [
        { name: 'Test', displayName: 'Test Group', permissions: [] },
      ];

      service.setGroups(groups);
      const retrieved = service.getPermissionGroups();

      // The same array reference should be returned
      expect(retrieved).toBe(service.getPermissionGroups());
    });
  });
});
