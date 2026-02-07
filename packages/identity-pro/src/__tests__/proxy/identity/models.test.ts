/**
 * Tests for Identity proxy models
 * @abpjs/identity-pro v3.2.0
 */
import { describe, it, expect } from 'vitest';
import type {
  ChangePasswordInput,
  ProfileDto,
  UpdateProfileDto,
  ClaimTypeDto,
  CreateClaimTypeDto,
  UpdateClaimTypeDto,
  GetIdentityClaimTypesInput,
  IdentityRoleDto,
  IdentityRoleCreateDto,
  IdentityRoleUpdateDto,
  IdentityRoleClaimDto,
  GetIdentityRoleListInput,
  IdentityUserDto,
  IdentityUserCreateDto,
  IdentityUserUpdateDto,
  IdentityUserClaimDto,
  IdentityUserUpdatePasswordInput,
  IdentityUserUpdateRolesDto,
  GetIdentityUsersInput,
  IdentitySecurityLogDto,
  GetIdentitySecurityLogListInput,
  IdentityPasswordSettingsDto,
  IdentityLockoutSettingsDto,
  IdentitySignInSettingsDto,
  IdentityUserSettingsDto,
  IdentitySettingsDto,
  OrganizationUnitCreateDto,
  OrganizationUnitUpdateDto,
  OrganizationUnitRoleDto,
  OrganizationUnitDto,
  OrganizationUnitWithDetailsDto,
  OrganizationUnitMoveInput,
  OrganizationUnitRoleInput,
  OrganizationUnitUserInput,
  GetOrganizationUnitInput,
  GetAvailableRolesInput,
  GetAvailableUsersInput,
  UserLookupCountInputDto,
  UserLookupSearchInputDto,
} from '../../../proxy/identity/models';
import { IdentityClaimValueType } from '../../../proxy/identity/identity-claim-value-type.enum';

describe('Password and Profile Models', () => {
  describe('ChangePasswordInput', () => {
    it('should accept valid structure', () => {
      const input: ChangePasswordInput = {
        currentPassword: 'oldPassword123',
        newPassword: 'newPassword456',
      };

      expect(input.currentPassword).toBe('oldPassword123');
      expect(input.newPassword).toBe('newPassword456');
    });
  });

  describe('ProfileDto', () => {
    it('should accept valid structure', () => {
      const profile: ProfileDto = {
        userName: 'john.doe',
        email: 'john@example.com',
        emailConfirmed: true,
        name: 'John',
        surname: 'Doe',
        phoneNumber: '+1234567890',
        phoneNumberConfirmed: false,
        isExternal: false,
        hasPassword: true,
        extraProperties: {},
      };

      expect(profile.userName).toBe('john.doe');
      expect(profile.email).toBe('john@example.com');
      expect(profile.emailConfirmed).toBe(true);
      expect(profile.hasPassword).toBe(true);
    });
  });

  describe('UpdateProfileDto', () => {
    it('should accept valid structure', () => {
      const input: UpdateProfileDto = {
        userName: 'john.doe',
        email: 'john@example.com',
        name: 'John',
        surname: 'Doe',
        phoneNumber: '+1234567890',
        extraProperties: {},
      };

      expect(input.userName).toBe('john.doe');
      expect(input.email).toBe('john@example.com');
    });
  });
});

describe('Claim Type Models', () => {
  describe('ClaimTypeDto', () => {
    it('should accept valid structure', () => {
      const claimType: ClaimTypeDto = {
        id: 'claim-type-1',
        name: 'email',
        required: true,
        isStatic: false,
        regex: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
        regexDescription: 'Valid email format',
        description: 'User email address',
        valueType: IdentityClaimValueType.String,
        valueTypeAsString: 'String',
        extraProperties: {},
      };

      expect(claimType.id).toBe('claim-type-1');
      expect(claimType.name).toBe('email');
      expect(claimType.required).toBe(true);
      expect(claimType.valueType).toBe(IdentityClaimValueType.String);
    });
  });

  describe('CreateClaimTypeDto', () => {
    it('should accept valid structure', () => {
      const input: CreateClaimTypeDto = {
        name: 'custom_claim',
        required: false,
        regex: '',
        regexDescription: '',
        description: 'Custom claim type',
        valueType: IdentityClaimValueType.Boolean,
        extraProperties: {},
      };

      expect(input.name).toBe('custom_claim');
      expect(input.valueType).toBe(IdentityClaimValueType.Boolean);
    });
  });

  describe('UpdateClaimTypeDto', () => {
    it('should accept valid structure', () => {
      const input: UpdateClaimTypeDto = {
        name: 'updated_claim',
        required: true,
        regex: '.*',
        regexDescription: 'Any value',
        description: 'Updated description',
        valueType: IdentityClaimValueType.Int,
        extraProperties: {},
      };

      expect(input.name).toBe('updated_claim');
      expect(input.valueType).toBe(IdentityClaimValueType.Int);
    });
  });

  describe('GetIdentityClaimTypesInput', () => {
    it('should accept valid structure', () => {
      const input: GetIdentityClaimTypesInput = {
        filter: 'email',
        sorting: 'name',
        skipCount: 0,
        maxResultCount: 10,
      };

      expect(input.filter).toBe('email');
      expect(input.maxResultCount).toBe(10);
    });
  });
});

describe('Role Models', () => {
  describe('IdentityRoleDto', () => {
    it('should accept valid structure', () => {
      const role: IdentityRoleDto = {
        id: 'role-1',
        name: 'Admin',
        isDefault: false,
        isStatic: true,
        isPublic: true,
        concurrencyStamp: 'abc123',
        extraProperties: {},
      };

      expect(role.id).toBe('role-1');
      expect(role.name).toBe('Admin');
      expect(role.isStatic).toBe(true);
    });
  });

  describe('IdentityRoleCreateDto', () => {
    it('should accept valid structure', () => {
      const input: IdentityRoleCreateDto = {
        name: 'NewRole',
        isDefault: false,
        isPublic: true,
        extraProperties: {},
      };

      expect(input.name).toBe('NewRole');
    });
  });

  describe('IdentityRoleUpdateDto', () => {
    it('should accept valid structure', () => {
      const input: IdentityRoleUpdateDto = {
        name: 'UpdatedRole',
        isDefault: true,
        isPublic: false,
        concurrencyStamp: 'xyz789',
        extraProperties: {},
      };

      expect(input.name).toBe('UpdatedRole');
      expect(input.concurrencyStamp).toBe('xyz789');
    });
  });

  describe('IdentityRoleClaimDto', () => {
    it('should accept valid structure', () => {
      const claim: IdentityRoleClaimDto = {
        roleId: 'role-1',
        claimType: 'permission',
        claimValue: 'read:users',
      };

      expect(claim.roleId).toBe('role-1');
      expect(claim.claimType).toBe('permission');
    });
  });

  describe('GetIdentityRoleListInput', () => {
    it('should accept valid structure', () => {
      const input: GetIdentityRoleListInput = {
        filter: 'admin',
        sorting: 'name asc',
        skipCount: 10,
        maxResultCount: 20,
      };

      expect(input.filter).toBe('admin');
      expect(input.sorting).toBe('name asc');
    });
  });
});

describe('User Models', () => {
  describe('IdentityUserDto', () => {
    it('should accept valid structure', () => {
      const user: IdentityUserDto = {
        id: 'user-1',
        tenantId: 'tenant-1',
        userName: 'john.doe',
        email: 'john@example.com',
        name: 'John',
        surname: 'Doe',
        emailConfirmed: true,
        phoneNumber: '+1234567890',
        phoneNumberConfirmed: false,
        supportTwoFactor: true,
        lockoutEnabled: true,
        isLockedOut: false,
        concurrencyStamp: 'stamp123',
        extraProperties: {},
      };

      expect(user.id).toBe('user-1');
      expect(user.userName).toBe('john.doe');
      expect(user.supportTwoFactor).toBe(true);
    });

    it('should accept user without tenantId', () => {
      const user: IdentityUserDto = {
        id: 'user-1',
        userName: 'admin',
        email: 'admin@example.com',
        name: 'Admin',
        surname: 'User',
        emailConfirmed: true,
        phoneNumber: '',
        phoneNumberConfirmed: false,
        supportTwoFactor: false,
        lockoutEnabled: false,
        isLockedOut: false,
        concurrencyStamp: 'stamp456',
        extraProperties: {},
      };

      expect(user.tenantId).toBeUndefined();
    });
  });

  describe('IdentityUserCreateDto', () => {
    it('should accept valid structure', () => {
      const input: IdentityUserCreateDto = {
        userName: 'newuser',
        name: 'New',
        surname: 'User',
        email: 'new@example.com',
        phoneNumber: '+1234567890',
        lockoutEnabled: true,
        roleNames: ['User', 'Editor'],
        organizationUnitIds: ['ou-1', 'ou-2'],
        password: 'SecurePassword123!',
        extraProperties: {},
      };

      expect(input.userName).toBe('newuser');
      expect(input.password).toBe('SecurePassword123!');
      expect(input.roleNames).toHaveLength(2);
    });
  });

  describe('IdentityUserUpdateDto', () => {
    it('should accept valid structure', () => {
      const input: IdentityUserUpdateDto = {
        userName: 'updateduser',
        name: 'Updated',
        surname: 'User',
        email: 'updated@example.com',
        phoneNumber: '+9876543210',
        lockoutEnabled: false,
        roleNames: ['Admin'],
        organizationUnitIds: [],
        concurrencyStamp: 'stamp999',
        extraProperties: {},
      };

      expect(input.userName).toBe('updateduser');
      expect(input.concurrencyStamp).toBe('stamp999');
    });
  });

  describe('IdentityUserClaimDto', () => {
    it('should accept valid structure', () => {
      const claim: IdentityUserClaimDto = {
        userId: 'user-1',
        claimType: 'department',
        claimValue: 'Engineering',
      };

      expect(claim.userId).toBe('user-1');
      expect(claim.claimType).toBe('department');
    });
  });

  describe('IdentityUserUpdatePasswordInput', () => {
    it('should accept valid structure', () => {
      const input: IdentityUserUpdatePasswordInput = {
        newPassword: 'NewSecurePassword!',
      };

      expect(input.newPassword).toBe('NewSecurePassword!');
    });
  });

  describe('IdentityUserUpdateRolesDto', () => {
    it('should accept valid structure', () => {
      const input: IdentityUserUpdateRolesDto = {
        roleNames: ['Admin', 'Manager', 'User'],
      };

      expect(input.roleNames).toHaveLength(3);
      expect(input.roleNames).toContain('Admin');
    });

    it('should accept empty roles', () => {
      const input: IdentityUserUpdateRolesDto = {
        roleNames: [],
      };

      expect(input.roleNames).toHaveLength(0);
    });
  });

  describe('GetIdentityUsersInput', () => {
    it('should accept valid structure', () => {
      const input: GetIdentityUsersInput = {
        filter: 'john',
        sorting: 'userName asc',
        skipCount: 0,
        maxResultCount: 50,
      };

      expect(input.filter).toBe('john');
      expect(input.maxResultCount).toBe(50);
    });
  });
});

describe('Security Log Models', () => {
  describe('IdentitySecurityLogDto', () => {
    it('should accept valid structure', () => {
      const log: IdentitySecurityLogDto = {
        id: 'log-1',
        tenantId: 'tenant-1',
        applicationName: 'MyApp',
        identity: 'admin',
        action: 'LoginSucceeded',
        userId: 'user-1',
        userName: 'admin',
        tenantName: 'Default',
        clientId: 'client-1',
        correlationId: 'corr-123',
        clientIpAddress: '192.168.1.1',
        browserInfo: 'Mozilla/5.0',
        creationTime: '2024-01-01T12:00:00Z',
        extraProperties: {},
      };

      expect(log.id).toBe('log-1');
      expect(log.action).toBe('LoginSucceeded');
      expect(log.clientIpAddress).toBe('192.168.1.1');
    });

    it('should accept log without optional fields', () => {
      const log: IdentitySecurityLogDto = {
        id: 'log-2',
        applicationName: 'MyApp',
        identity: 'anonymous',
        action: 'LoginFailed',
        userName: '',
        tenantName: '',
        clientId: '',
        correlationId: '',
        clientIpAddress: '10.0.0.1',
        browserInfo: '',
        creationTime: '2024-01-01T12:00:00Z',
        extraProperties: {},
      };

      expect(log.userId).toBeUndefined();
      expect(log.tenantId).toBeUndefined();
    });
  });

  describe('GetIdentitySecurityLogListInput', () => {
    it('should accept valid structure', () => {
      const input: GetIdentitySecurityLogListInput = {
        startTime: '2024-01-01T00:00:00Z',
        endTime: '2024-12-31T23:59:59Z',
        applicationName: 'MyApp',
        identity: 'admin',
        action: 'Login',
        userName: 'john',
        clientId: 'client-1',
        correlationId: '',
        sorting: 'creationTime desc',
        skipCount: 0,
        maxResultCount: 100,
      };

      expect(input.startTime).toBe('2024-01-01T00:00:00Z');
      expect(input.applicationName).toBe('MyApp');
    });

    it('should accept input without optional date filters', () => {
      const input: GetIdentitySecurityLogListInput = {
        applicationName: '',
        identity: '',
        action: '',
        userName: '',
        clientId: '',
        correlationId: '',
        sorting: 'creationTime desc',
        skipCount: 0,
        maxResultCount: 50,
      };

      expect(input.startTime).toBeUndefined();
      expect(input.endTime).toBeUndefined();
    });
  });
});

describe('Settings Models', () => {
  describe('IdentityPasswordSettingsDto', () => {
    it('should accept valid structure', () => {
      const settings: IdentityPasswordSettingsDto = {
        requiredLength: 8,
        requiredUniqueChars: 2,
        requireNonAlphanumeric: true,
        requireLowercase: true,
        requireUppercase: true,
        requireDigit: true,
      };

      expect(settings.requiredLength).toBe(8);
      expect(settings.requireNonAlphanumeric).toBe(true);
    });
  });

  describe('IdentityLockoutSettingsDto', () => {
    it('should accept valid structure', () => {
      const settings: IdentityLockoutSettingsDto = {
        allowedForNewUsers: true,
        lockoutDuration: 300,
        maxFailedAccessAttempts: 5,
      };

      expect(settings.lockoutDuration).toBe(300);
      expect(settings.maxFailedAccessAttempts).toBe(5);
    });
  });

  describe('IdentitySignInSettingsDto', () => {
    it('should accept valid structure', () => {
      const settings: IdentitySignInSettingsDto = {
        requireConfirmedEmail: true,
        enablePhoneNumberConfirmation: false,
        requireConfirmedPhoneNumber: false,
      };

      expect(settings.requireConfirmedEmail).toBe(true);
    });
  });

  describe('IdentityUserSettingsDto', () => {
    it('should accept valid structure', () => {
      const settings: IdentityUserSettingsDto = {
        isUserNameUpdateEnabled: true,
        isEmailUpdateEnabled: true,
      };

      expect(settings.isUserNameUpdateEnabled).toBe(true);
    });
  });

  describe('IdentitySettingsDto', () => {
    it('should accept valid structure', () => {
      const settings: IdentitySettingsDto = {
        password: {
          requiredLength: 6,
          requiredUniqueChars: 1,
          requireNonAlphanumeric: false,
          requireLowercase: true,
          requireUppercase: true,
          requireDigit: true,
        },
        lockout: {
          allowedForNewUsers: true,
          lockoutDuration: 600,
          maxFailedAccessAttempts: 3,
        },
        signIn: {
          requireConfirmedEmail: false,
          enablePhoneNumberConfirmation: false,
          requireConfirmedPhoneNumber: false,
        },
        user: {
          isUserNameUpdateEnabled: false,
          isEmailUpdateEnabled: true,
        },
      };

      expect(settings.password.requiredLength).toBe(6);
      expect(settings.lockout.lockoutDuration).toBe(600);
      expect(settings.signIn.requireConfirmedEmail).toBe(false);
      expect(settings.user.isUserNameUpdateEnabled).toBe(false);
    });
  });
});

describe('Organization Unit Models', () => {
  describe('OrganizationUnitCreateDto', () => {
    it('should accept valid structure with parent', () => {
      const input: OrganizationUnitCreateDto = {
        displayName: 'Engineering',
        parentId: 'parent-ou-1',
        extraProperties: {},
      };

      expect(input.displayName).toBe('Engineering');
      expect(input.parentId).toBe('parent-ou-1');
    });

    it('should accept valid structure without parent (root unit)', () => {
      const input: OrganizationUnitCreateDto = {
        displayName: 'Root Organization',
        extraProperties: {},
      };

      expect(input.displayName).toBe('Root Organization');
      expect(input.parentId).toBeUndefined();
    });
  });

  describe('OrganizationUnitUpdateDto', () => {
    it('should accept valid structure', () => {
      const input: OrganizationUnitUpdateDto = {
        displayName: 'Updated Engineering',
        extraProperties: {},
      };

      expect(input.displayName).toBe('Updated Engineering');
    });
  });

  describe('OrganizationUnitRoleDto', () => {
    it('should accept valid structure', () => {
      const role: OrganizationUnitRoleDto = {
        organizationUnitId: 'ou-1',
        roleId: 'role-1',
        creationTime: '2024-01-01T12:00:00Z',
        creatorId: 'user-1',
      };

      expect(role.organizationUnitId).toBe('ou-1');
      expect(role.roleId).toBe('role-1');
    });
  });

  describe('OrganizationUnitDto', () => {
    it('should accept valid structure', () => {
      const ou: OrganizationUnitDto = {
        id: 'ou-1',
        parentId: 'parent-ou-1',
        code: '00001.00001',
        displayName: 'Engineering',
        roles: [],
        extraProperties: {},
        creationTime: '2024-01-01T12:00:00Z',
        creatorId: 'user-1',
        lastModificationTime: '2024-06-01T12:00:00Z',
        lastModifierId: 'user-2',
        isDeleted: false,
        deleterId: undefined,
        deletionTime: undefined,
      };

      expect(ou.id).toBe('ou-1');
      expect(ou.code).toBe('00001.00001');
    });
  });

  describe('OrganizationUnitWithDetailsDto', () => {
    it('should accept valid structure with roles', () => {
      const ou: OrganizationUnitWithDetailsDto = {
        id: 'ou-1',
        parentId: undefined,
        code: '00001',
        displayName: 'Root',
        roles: [
          {
            id: 'role-1',
            name: 'Admin',
            isDefault: false,
            isStatic: true,
            isPublic: true,
            concurrencyStamp: 'stamp',
            extraProperties: {},
          },
        ],
        extraProperties: {},
        creationTime: '2024-01-01T12:00:00Z',
        creatorId: 'user-1',
        lastModificationTime: undefined,
        lastModifierId: undefined,
        isDeleted: false,
        deleterId: undefined,
        deletionTime: undefined,
      };

      expect(ou.roles).toHaveLength(1);
      expect(ou.roles[0].name).toBe('Admin');
    });
  });

  describe('OrganizationUnitMoveInput', () => {
    it('should accept valid structure', () => {
      const input: OrganizationUnitMoveInput = {
        newParentId: 'new-parent-ou-1',
      };

      expect(input.newParentId).toBe('new-parent-ou-1');
    });

    it('should accept move to root (no parent)', () => {
      const input: OrganizationUnitMoveInput = {
        newParentId: undefined,
      };

      expect(input.newParentId).toBeUndefined();
    });
  });

  describe('OrganizationUnitRoleInput', () => {
    it('should accept valid structure', () => {
      const input: OrganizationUnitRoleInput = {
        roleIds: ['role-1', 'role-2', 'role-3'],
      };

      expect(input.roleIds).toHaveLength(3);
    });

    it('should accept empty role IDs', () => {
      const input: OrganizationUnitRoleInput = {
        roleIds: [],
      };

      expect(input.roleIds).toHaveLength(0);
    });
  });

  describe('OrganizationUnitUserInput', () => {
    it('should accept valid structure', () => {
      const input: OrganizationUnitUserInput = {
        userIds: ['user-1', 'user-2'],
      };

      expect(input.userIds).toHaveLength(2);
    });
  });

  describe('GetOrganizationUnitInput', () => {
    it('should accept valid structure', () => {
      const input: GetOrganizationUnitInput = {
        filter: 'engineering',
        sorting: 'displayName asc',
        skipCount: 0,
        maxResultCount: 25,
      };

      expect(input.filter).toBe('engineering');
    });
  });

  describe('GetAvailableRolesInput', () => {
    it('should accept valid structure', () => {
      const input: GetAvailableRolesInput = {
        filter: '',
        id: 'ou-1',
        sorting: 'name',
        skipCount: 0,
        maxResultCount: 10,
      };

      expect(input.id).toBe('ou-1');
    });
  });

  describe('GetAvailableUsersInput', () => {
    it('should accept valid structure', () => {
      const input: GetAvailableUsersInput = {
        filter: 'john',
        id: 'ou-1',
        sorting: 'userName',
        skipCount: 0,
        maxResultCount: 20,
      };

      expect(input.id).toBe('ou-1');
      expect(input.filter).toBe('john');
    });
  });
});

describe('User Lookup Models', () => {
  describe('UserLookupCountInputDto', () => {
    it('should accept valid structure', () => {
      const input: UserLookupCountInputDto = {
        filter: 'admin',
      };

      expect(input.filter).toBe('admin');
    });

    it('should accept empty filter', () => {
      const input: UserLookupCountInputDto = {
        filter: '',
      };

      expect(input.filter).toBe('');
    });
  });

  describe('UserLookupSearchInputDto', () => {
    it('should accept valid structure', () => {
      const input: UserLookupSearchInputDto = {
        sorting: 'userName',
        filter: 'test',
        skipCount: 0,
        maxResultCount: 10,
      };

      expect(input.sorting).toBe('userName');
      expect(input.filter).toBe('test');
    });
  });
});
