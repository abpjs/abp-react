/**
 * Tests for Identity Pro Models
 * @abpjs/identity-pro v4.0.0
 */
import { describe, it, expect } from 'vitest';
import { PagedResultDto } from '@abpjs/core';
import { Identity, createOrganizationUnitWithDetailsDto } from '../../models';
import type { ClaimTypeDto, IdentityRoleDto, IdentityUserDto } from '../../proxy/identity/models';
import { IdentityClaimValueType } from '../../proxy/identity/identity-claim-value-type.enum';

describe('Identity namespace', () => {
  describe('ChangePasswordRequest (v2.7.0)', () => {
    it('should accept valid password request object', () => {
      const request: Identity.ChangePasswordRequest = {
        newPassword: 'SecurePassword123!',
      };

      expect(request.newPassword).toBe('SecurePassword123!');
    });

    it('should accept complex password strings', () => {
      const request: Identity.ChangePasswordRequest = {
        newPassword: 'C0mpl3x!P@ssw0rd#2024$%^&*()',
      };

      expect(request.newPassword).toBe('C0mpl3x!P@ssw0rd#2024$%^&*()');
    });

    it('should accept empty string (validation should be server-side)', () => {
      const request: Identity.ChangePasswordRequest = {
        newPassword: '',
      };

      expect(request.newPassword).toBe('');
    });

    it('should be usable in function parameters', () => {
      const mockChangePassword = (id: string, body: Identity.ChangePasswordRequest): boolean => {
        return body.newPassword.length > 0;
      };

      expect(mockChangePassword('user-1', { newPassword: 'Password123!' })).toBe(true);
      expect(mockChangePassword('user-1', { newPassword: '' })).toBe(false);
    });

    it('should be distinct from UserSaveRequest', () => {
      const passwordRequest: Identity.ChangePasswordRequest = {
        newPassword: 'Password123!',
      };

      const userRequest: Identity.UserSaveRequest = {
        userName: 'testuser',
        name: 'Test',
        surname: 'User',
        email: 'test@example.com',
        phoneNumber: '',
        twoFactorEnabled: false,
        lockoutEnabled: true,
        password: 'Password123!',
        roleNames: ['User'],
        organizationUnitIds: [],
      };

      // ChangePasswordRequest only has newPassword
      expect(Object.keys(passwordRequest)).toHaveLength(1);
      expect(Object.keys(passwordRequest)).toContain('newPassword');

      // UserSaveRequest has password and other fields
      expect(Object.keys(userRequest)).toContain('password');
      expect(Object.keys(userRequest)).not.toContain('newPassword');
    });

    it('should work with spread operator', () => {
      const baseRequest: Identity.ChangePasswordRequest = {
        newPassword: 'OldPassword123!',
      };

      const updatedRequest: Identity.ChangePasswordRequest = {
        ...baseRequest,
        newPassword: 'NewPassword456!',
      };

      expect(updatedRequest.newPassword).toBe('NewPassword456!');
    });
  });

  describe('existing types validation', () => {
    it('should have RoleItem interface', () => {
      const role: Identity.RoleItem = {
        id: 'role-1',
        name: 'Admin',
        isDefault: false,
        isPublic: true,
        isStatic: false,
        concurrencyStamp: 'stamp',
      };

      expect(role.id).toBe('role-1');
      expect(role.name).toBe('Admin');
    });

    it('should have UserItem interface', () => {
      const user: Identity.UserItem = {
        id: 'user-1',
        userName: 'admin',
        name: 'Admin',
        surname: 'User',
        email: 'admin@example.com',
        phoneNumber: '',
        twoFactorEnabled: false,
        lockoutEnabled: true,
        tenantId: '',
        emailConfirmed: true,
        phoneNumberConfirmed: false,
        isLockedOut: false,
        concurrencyStamp: 'stamp',
      };

      expect(user.id).toBe('user-1');
      expect(user.userName).toBe('admin');
    });

    it('should have ClaimType interface', () => {
      const claimType: Identity.ClaimType = {
        id: 'claim-1',
        name: 'email',
        required: true,
        isStatic: true,
        regex: '',
        regexDescription: '',
        description: 'Email claim',
        valueType: Identity.ClaimValueType.String,
      };

      expect(claimType.name).toBe('email');
      expect(claimType.valueType).toBe(0);
    });

    it('should have ClaimValueType enum', () => {
      expect(Identity.ClaimValueType.String).toBe(0);
      expect(Identity.ClaimValueType.Int).toBe(1);
      expect(Identity.ClaimValueType.Boolean).toBe(2);
      expect(Identity.ClaimValueType.DateTime).toBe(3);
    });
  });

  describe('UserSaveRequest with organizationUnitIds (v2.9.0)', () => {
    it('should include organizationUnitIds property', () => {
      const userRequest: Identity.UserSaveRequest = {
        userName: 'testuser',
        name: 'Test',
        surname: 'User',
        email: 'test@example.com',
        phoneNumber: '',
        twoFactorEnabled: false,
        lockoutEnabled: true,
        password: 'Password123!',
        roleNames: ['User'],
        organizationUnitIds: ['unit-1', 'unit-2'],
      };

      expect(userRequest.organizationUnitIds).toHaveLength(2);
      expect(userRequest.organizationUnitIds).toContain('unit-1');
      expect(userRequest.organizationUnitIds).toContain('unit-2');
    });

    it('should accept empty organizationUnitIds array', () => {
      const userRequest: Identity.UserSaveRequest = {
        userName: 'testuser',
        name: 'Test',
        surname: 'User',
        email: 'test@example.com',
        phoneNumber: '',
        twoFactorEnabled: false,
        lockoutEnabled: true,
        password: 'Password123!',
        roleNames: [],
        organizationUnitIds: [],
      };

      expect(userRequest.organizationUnitIds).toEqual([]);
    });

    it('should work with user creation containing multiple organization units', () => {
      const createUserData: Identity.UserSaveRequest = {
        userName: 'newemployee',
        name: 'New',
        surname: 'Employee',
        email: 'new.employee@company.com',
        phoneNumber: '+1234567890',
        twoFactorEnabled: false,
        lockoutEnabled: true,
        password: 'InitialPassword123!',
        roleNames: ['Employee', 'TeamMember'],
        organizationUnitIds: ['engineering', 'frontend-team', 'project-x'],
      };

      expect(createUserData.organizationUnitIds).toHaveLength(3);
      expect(createUserData.roleNames).toHaveLength(2);
    });
  });

  describe('State with organizationUnits (v2.9.0)', () => {
    it('should include organizationUnits in State interface', () => {
      const state: Identity.State = {
        roles: new PagedResultDto({ items: [], totalCount: 0 }),
        users: new PagedResultDto({ items: [], totalCount: 0 }),
        selectedRole: {} as IdentityRoleDto,
        selectedUser: {} as IdentityUserDto,
        selectedUserRoles: [],
        claims: new PagedResultDto({ items: [], totalCount: 0 }),
        selectedClaim: {} as ClaimTypeDto,
        organizationUnits: new PagedResultDto({ items: [], totalCount: 0 }),
      };

      expect(state.organizationUnits).toBeDefined();
      expect(state.organizationUnits.items).toEqual([]);
      expect(state.organizationUnits.totalCount).toBe(0);
    });

    it('should store organization units with full details', () => {
      const orgUnits = [
        createOrganizationUnitWithDetailsDto({
          id: 'unit-1',
          displayName: 'Engineering',
          code: '00001',
        }),
        createOrganizationUnitWithDetailsDto({
          id: 'unit-2',
          displayName: 'Marketing',
          code: '00002',
        }),
      ];

      const state: Identity.State = {
        roles: new PagedResultDto({ items: [], totalCount: 0 }),
        users: new PagedResultDto({ items: [], totalCount: 0 }),
        selectedRole: {} as IdentityRoleDto,
        selectedUser: {} as IdentityUserDto,
        selectedUserRoles: [],
        claims: new PagedResultDto({ items: [], totalCount: 0 }),
        selectedClaim: {} as ClaimTypeDto,
        organizationUnits: new PagedResultDto({ items: orgUnits, totalCount: 2 }),
      };

      expect(state.organizationUnits.items).toHaveLength(2);
      expect(state.organizationUnits.items![0].displayName).toBe('Engineering');
      expect(state.organizationUnits.items![1].displayName).toBe('Marketing');
    });
  });

  describe('State v4.0.0 - proxy type references', () => {
    it('should use PagedResultDto<IdentityRoleDto> for roles', () => {
      const roles: IdentityRoleDto[] = [
        {
          id: 'role-1',
          name: 'Admin',
          isDefault: false,
          isStatic: true,
          isPublic: true,
          concurrencyStamp: 'stamp-1',
          extraProperties: {},
        },
      ];
      const state: Identity.State = {
        roles: new PagedResultDto({ items: roles, totalCount: 1 }),
        users: new PagedResultDto({ items: [], totalCount: 0 }),
        selectedRole: roles[0],
        selectedUser: {} as IdentityUserDto,
        selectedUserRoles: roles,
        claims: new PagedResultDto({ items: [], totalCount: 0 }),
        selectedClaim: {} as ClaimTypeDto,
        organizationUnits: new PagedResultDto({ items: [], totalCount: 0 }),
      };

      expect(state.roles.items).toHaveLength(1);
      expect(state.roles.items![0].name).toBe('Admin');
      expect(state.selectedRole.isStatic).toBe(true);
      expect(state.selectedUserRoles).toHaveLength(1);
    });

    it('should use PagedResultDto<IdentityUserDto> for users', () => {
      const users: IdentityUserDto[] = [
        {
          id: 'user-1',
          userName: 'admin',
          email: 'admin@test.com',
          name: 'Admin',
          surname: 'User',
          emailConfirmed: true,
          phoneNumber: '',
          phoneNumberConfirmed: false,
          supportTwoFactor: true,
          lockoutEnabled: true,
          isLockedOut: false,
          concurrencyStamp: 'stamp-1',
          extraProperties: {},
        },
      ];
      const state: Identity.State = {
        roles: new PagedResultDto({ items: [], totalCount: 0 }),
        users: new PagedResultDto({ items: users, totalCount: 1 }),
        selectedRole: {} as IdentityRoleDto,
        selectedUser: users[0],
        selectedUserRoles: [],
        claims: new PagedResultDto({ items: [], totalCount: 0 }),
        selectedClaim: {} as ClaimTypeDto,
        organizationUnits: new PagedResultDto({ items: [], totalCount: 0 }),
      };

      expect(state.users.items).toHaveLength(1);
      expect(state.users.items![0].userName).toBe('admin');
      expect(state.selectedUser.supportTwoFactor).toBe(true);
    });

    it('should use PagedResultDto<ClaimTypeDto> for claims', () => {
      const claims: ClaimTypeDto[] = [
        {
          id: 'claim-1',
          name: 'email',
          required: true,
          isStatic: true,
          regex: '',
          regexDescription: '',
          description: 'Email claim',
          valueType: IdentityClaimValueType.String,
          valueTypeAsString: 'String',
          extraProperties: {},
        },
      ];
      const state: Identity.State = {
        roles: new PagedResultDto({ items: [], totalCount: 0 }),
        users: new PagedResultDto({ items: [], totalCount: 0 }),
        selectedRole: {} as IdentityRoleDto,
        selectedUser: {} as IdentityUserDto,
        selectedUserRoles: [],
        claims: new PagedResultDto({ items: claims, totalCount: 1 }),
        selectedClaim: claims[0],
        organizationUnits: new PagedResultDto({ items: [], totalCount: 0 }),
      };

      expect(state.claims.items).toHaveLength(1);
      expect(state.claims.items![0].name).toBe('email');
      expect(state.selectedClaim.valueType).toBe(IdentityClaimValueType.String);
      expect(state.selectedClaim.valueTypeAsString).toBe('String');
    });

    it('should no longer have claimTypes field (removed in v4.0.0)', () => {
      const state: Identity.State = {
        roles: new PagedResultDto({ items: [], totalCount: 0 }),
        users: new PagedResultDto({ items: [], totalCount: 0 }),
        selectedRole: {} as IdentityRoleDto,
        selectedUser: {} as IdentityUserDto,
        selectedUserRoles: [],
        claims: new PagedResultDto({ items: [], totalCount: 0 }),
        selectedClaim: {} as ClaimTypeDto,
        organizationUnits: new PagedResultDto({ items: [], totalCount: 0 }),
      };

      // claimTypes was removed in v4.0.0 State
      expect(state).not.toHaveProperty('claimTypes');
    });
  });

  describe('deprecated types backward compatibility (v4.0.0)', () => {
    it('should still export RoleItem for backward compatibility', () => {
      const role: Identity.RoleItem = {
        id: 'role-1',
        name: 'Admin',
        isDefault: false,
        isPublic: true,
        isStatic: false,
        concurrencyStamp: 'stamp',
      };
      expect(role.id).toBe('role-1');
    });

    it('should still export UserItem for backward compatibility', () => {
      const user: Identity.UserItem = {
        id: 'user-1',
        userName: 'admin',
        name: 'Admin',
        surname: 'User',
        email: 'admin@test.com',
        phoneNumber: '',
        twoFactorEnabled: false,
        lockoutEnabled: true,
        tenantId: '',
        emailConfirmed: true,
        phoneNumberConfirmed: false,
        isLockedOut: false,
        concurrencyStamp: 'stamp',
      };
      expect(user.id).toBe('user-1');
    });

    it('should still export ClaimValueType enum for backward compatibility', () => {
      expect(Identity.ClaimValueType.String).toBe(0);
      expect(Identity.ClaimValueType.Int).toBe(1);
      expect(Identity.ClaimValueType.Boolean).toBe(2);
      expect(Identity.ClaimValueType.DateTime).toBe(3);
    });

    it('should still export ClaimRequest for backward compatibility', () => {
      const claim: Identity.ClaimRequest = {
        userId: 'user-1',
        claimType: 'email',
        claimValue: 'admin@test.com',
      };
      expect(claim.claimType).toBe('email');
    });
  });
});

describe('Identity.UserLockDurationType (v3.1.0)', () => {
  describe('enum values', () => {
    it('should have Second value equal to 1', () => {
      expect(Identity.UserLockDurationType.Second).toBe(1);
    });

    it('should have Minute value equal to 60', () => {
      expect(Identity.UserLockDurationType.Minute).toBe(60);
    });

    it('should have Hour value equal to 3600', () => {
      expect(Identity.UserLockDurationType.Hour).toBe(3600);
    });

    it('should have Day value equal to 86400', () => {
      expect(Identity.UserLockDurationType.Day).toBe(86400);
    });

    it('should have Month value equal to 2592000', () => {
      expect(Identity.UserLockDurationType.Month).toBe(2592000);
    });

    it('should have Year value equal to 31536000', () => {
      expect(Identity.UserLockDurationType.Year).toBe(31536000);
    });
  });

  describe('duration calculations', () => {
    it('should correctly represent 1 minute as 60 seconds', () => {
      expect(Identity.UserLockDurationType.Minute).toBe(1 * 60);
    });

    it('should correctly represent 1 hour as 3600 seconds', () => {
      expect(Identity.UserLockDurationType.Hour).toBe(60 * 60);
    });

    it('should correctly represent 1 day as 86400 seconds', () => {
      expect(Identity.UserLockDurationType.Day).toBe(24 * 60 * 60);
    });

    it('should correctly represent 1 month as 30 days', () => {
      expect(Identity.UserLockDurationType.Month).toBe(30 * 24 * 60 * 60);
    });

    it('should correctly represent 1 year as 365 days', () => {
      expect(Identity.UserLockDurationType.Year).toBe(365 * 24 * 60 * 60);
    });
  });

  describe('usage in lock duration', () => {
    it('should be usable for lockUser duration parameter', () => {
      const lockDuration: number = Identity.UserLockDurationType.Hour;
      expect(lockDuration).toBe(3600);
    });

    it('should allow multiplication for custom durations', () => {
      // Lock for 2 hours
      const twoHours = 2 * Identity.UserLockDurationType.Hour;
      expect(twoHours).toBe(7200);

      // Lock for 5 days
      const fiveDays = 5 * Identity.UserLockDurationType.Day;
      expect(fiveDays).toBe(432000);
    });

    it('should be usable in comparison operations', () => {
      expect(Identity.UserLockDurationType.Second).toBeLessThan(Identity.UserLockDurationType.Minute);
      expect(Identity.UserLockDurationType.Minute).toBeLessThan(Identity.UserLockDurationType.Hour);
      expect(Identity.UserLockDurationType.Hour).toBeLessThan(Identity.UserLockDurationType.Day);
      expect(Identity.UserLockDurationType.Day).toBeLessThan(Identity.UserLockDurationType.Month);
      expect(Identity.UserLockDurationType.Month).toBeLessThan(Identity.UserLockDurationType.Year);
    });
  });

  describe('all enum members', () => {
    it('should have exactly 6 duration types', () => {
      const numericValues = Object.values(Identity.UserLockDurationType).filter(
        (v) => typeof v === 'number'
      );
      expect(numericValues).toHaveLength(6);
    });

    it('should have correct enum keys', () => {
      expect(Identity.UserLockDurationType.Second).toBeDefined();
      expect(Identity.UserLockDurationType.Minute).toBeDefined();
      expect(Identity.UserLockDurationType.Hour).toBeDefined();
      expect(Identity.UserLockDurationType.Day).toBeDefined();
      expect(Identity.UserLockDurationType.Month).toBeDefined();
      expect(Identity.UserLockDurationType.Year).toBeDefined();
    });
  });
});
