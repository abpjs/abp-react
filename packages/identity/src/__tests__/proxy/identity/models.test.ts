import { describe, it, expect } from 'vitest';
import type {
  ChangePasswordInput,
  GetIdentityUsersInput,
  IdentityRoleCreateDto,
  IdentityRoleCreateOrUpdateDtoBase,
  IdentityRoleDto,
  IdentityRoleUpdateDto,
  IdentityUserCreateDto,
  IdentityUserCreateOrUpdateDtoBase,
  IdentityUserDto,
  IdentityUserUpdateDto,
  IdentityUserUpdateRolesDto,
  ProfileDto,
  UpdateProfileDto,
  UserLookupCountInputDto,
  UserLookupSearchInputDto,
} from '../../../proxy/identity/models';

/**
 * Tests for Identity Proxy Models (v3.2.0)
 * Type validation tests for new DTOs.
 */
describe('Identity Proxy Models (v3.2.0)', () => {
  describe('ChangePasswordInput', () => {
    it('should have required properties', () => {
      const input: ChangePasswordInput = {
        currentPassword: 'OldPass123!',
        newPassword: 'NewPass123!',
      };
      expect(input.currentPassword).toBe('OldPass123!');
      expect(input.newPassword).toBe('NewPass123!');
    });
  });

  describe('GetIdentityUsersInput', () => {
    it('should extend PagedAndSortedResultRequestDto with filter', () => {
      const input: GetIdentityUsersInput = {
        filter: 'admin',
        skipCount: 0,
        maxResultCount: 10,
      };
      expect(input.filter).toBe('admin');
      expect(input.skipCount).toBe(0);
      expect(input.maxResultCount).toBe(10);
    });

    it('should allow sorting parameter', () => {
      const input: GetIdentityUsersInput = {
        filter: '',
        skipCount: 0,
        maxResultCount: 10,
        sorting: 'userName asc',
      };
      expect(input.sorting).toBe('userName asc');
    });
  });

  describe('IdentityRoleCreateOrUpdateDtoBase', () => {
    it('should have name, isDefault, and isPublic', () => {
      const dto: IdentityRoleCreateOrUpdateDtoBase = {
        name: 'TestRole',
        isDefault: false,
        isPublic: true,
      };
      expect(dto.name).toBe('TestRole');
      expect(dto.isDefault).toBe(false);
      expect(dto.isPublic).toBe(true);
    });
  });

  describe('IdentityRoleCreateDto', () => {
    it('should extend IdentityRoleCreateOrUpdateDtoBase', () => {
      const dto: IdentityRoleCreateDto = {
        name: 'NewRole',
        isDefault: true,
        isPublic: false,
      };
      expect(dto.name).toBe('NewRole');
      expect(dto.isDefault).toBe(true);
    });
  });

  describe('IdentityRoleUpdateDto', () => {
    it('should extend base with concurrencyStamp', () => {
      const dto: IdentityRoleUpdateDto = {
        name: 'UpdatedRole',
        isDefault: false,
        isPublic: true,
        concurrencyStamp: 'stamp-123',
      };
      expect(dto.concurrencyStamp).toBe('stamp-123');
    });
  });

  describe('IdentityRoleDto', () => {
    it('should have all role properties', () => {
      const dto: IdentityRoleDto = {
        id: 'role-1',
        name: 'Admin',
        isDefault: false,
        isStatic: true,
        isPublic: true,
        concurrencyStamp: 'stamp-123',
      };
      expect(dto.id).toBe('role-1');
      expect(dto.isStatic).toBe(true);
    });
  });

  describe('IdentityUserCreateOrUpdateDtoBase', () => {
    it('should have all user base properties', () => {
      const dto: IdentityUserCreateOrUpdateDtoBase = {
        userName: 'testuser',
        name: 'Test',
        surname: 'User',
        email: 'test@example.com',
        phoneNumber: '+1234567890',
        lockoutEnabled: true,
        roleNames: ['User'],
      };
      expect(dto.userName).toBe('testuser');
      expect(dto.roleNames).toContain('User');
    });
  });

  describe('IdentityUserCreateDto', () => {
    it('should extend base with password', () => {
      const dto: IdentityUserCreateDto = {
        userName: 'newuser',
        name: 'New',
        surname: 'User',
        email: 'new@example.com',
        phoneNumber: '',
        lockoutEnabled: true,
        roleNames: ['User'],
        password: 'Password123!',
      };
      expect(dto.password).toBe('Password123!');
    });
  });

  describe('IdentityUserUpdateDto', () => {
    it('should extend base with password and concurrencyStamp', () => {
      const dto: IdentityUserUpdateDto = {
        userName: 'updateduser',
        name: 'Updated',
        surname: 'User',
        email: 'updated@example.com',
        phoneNumber: '',
        lockoutEnabled: false,
        roleNames: ['Admin'],
        password: 'NewPassword123!',
        concurrencyStamp: 'stamp-456',
      };
      expect(dto.password).toBe('NewPassword123!');
      expect(dto.concurrencyStamp).toBe('stamp-456');
    });
  });

  describe('IdentityUserUpdateRolesDto', () => {
    it('should have roleNames array', () => {
      const dto: IdentityUserUpdateRolesDto = {
        roleNames: ['Admin', 'User', 'Moderator'],
      };
      expect(dto.roleNames).toHaveLength(3);
      expect(dto.roleNames).toContain('Admin');
    });

    it('should allow empty roleNames array', () => {
      const dto: IdentityUserUpdateRolesDto = {
        roleNames: [],
      };
      expect(dto.roleNames).toHaveLength(0);
    });
  });

  describe('IdentityUserDto', () => {
    it('should have all user properties', () => {
      const dto: IdentityUserDto = {
        id: 'user-1',
        tenantId: 'tenant-123',
        userName: 'admin',
        name: 'Admin',
        surname: 'User',
        email: 'admin@example.com',
        emailConfirmed: true,
        phoneNumber: '+1234567890',
        phoneNumberConfirmed: false,
        lockoutEnabled: true,
        lockoutEnd: undefined,
        concurrencyStamp: 'stamp-789',
      };
      expect(dto.id).toBe('user-1');
      expect(dto.emailConfirmed).toBe(true);
      expect(dto.lockoutEnd).toBeUndefined();
    });

    it('should allow optional tenantId', () => {
      const dto: IdentityUserDto = {
        id: 'user-1',
        userName: 'admin',
        name: 'Admin',
        surname: 'User',
        email: 'admin@example.com',
        emailConfirmed: true,
        phoneNumber: '',
        phoneNumberConfirmed: false,
        lockoutEnabled: true,
        concurrencyStamp: 'stamp',
      };
      expect(dto.tenantId).toBeUndefined();
    });

    it('should allow lockoutEnd as string', () => {
      const dto: IdentityUserDto = {
        id: 'user-1',
        userName: 'locked',
        name: 'Locked',
        surname: 'User',
        email: 'locked@example.com',
        emailConfirmed: false,
        phoneNumber: '',
        phoneNumberConfirmed: false,
        lockoutEnabled: true,
        lockoutEnd: '2024-12-31T23:59:59Z',
        concurrencyStamp: 'stamp',
      };
      expect(dto.lockoutEnd).toBe('2024-12-31T23:59:59Z');
    });
  });

  describe('ProfileDto', () => {
    it('should have all profile properties', () => {
      const dto: ProfileDto = {
        userName: 'admin',
        email: 'admin@example.com',
        name: 'Admin',
        surname: 'User',
        phoneNumber: '+1234567890',
        isExternal: false,
        hasPassword: true,
      };
      expect(dto.userName).toBe('admin');
      expect(dto.isExternal).toBe(false);
      expect(dto.hasPassword).toBe(true);
    });

    it('should indicate external user without password', () => {
      const dto: ProfileDto = {
        userName: 'externaluser',
        email: 'external@example.com',
        name: 'External',
        surname: 'User',
        phoneNumber: '',
        isExternal: true,
        hasPassword: false,
      };
      expect(dto.isExternal).toBe(true);
      expect(dto.hasPassword).toBe(false);
    });
  });

  describe('UpdateProfileDto', () => {
    it('should have updatable profile properties', () => {
      const dto: UpdateProfileDto = {
        userName: 'newusername',
        email: 'new@example.com',
        name: 'New',
        surname: 'Name',
        phoneNumber: '+0987654321',
      };
      expect(dto.userName).toBe('newusername');
      expect(dto.phoneNumber).toBe('+0987654321');
    });
  });

  describe('UserLookupCountInputDto', () => {
    it('should have filter property', () => {
      const dto: UserLookupCountInputDto = {
        filter: 'admin',
      };
      expect(dto.filter).toBe('admin');
    });

    it('should allow empty filter', () => {
      const dto: UserLookupCountInputDto = {
        filter: '',
      };
      expect(dto.filter).toBe('');
    });
  });

  describe('UserLookupSearchInputDto', () => {
    it('should extend PagedAndSortedResultRequestDto with filter', () => {
      const dto: UserLookupSearchInputDto = {
        filter: 'user',
        skipCount: 0,
        maxResultCount: 20,
      };
      expect(dto.filter).toBe('user');
      expect(dto.maxResultCount).toBe(20);
    });

    it('should allow sorting', () => {
      const dto: UserLookupSearchInputDto = {
        filter: '',
        skipCount: 10,
        maxResultCount: 10,
        sorting: 'name desc',
      };
      expect(dto.sorting).toBe('name desc');
    });
  });
});
