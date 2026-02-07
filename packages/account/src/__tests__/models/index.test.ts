import { describe, it, expect } from 'vitest';
import {
  Account,
  AccountOptions,
  LoginFormData,
  RegisterFormData,
  TenantInfo,
  PasswordFlowResult,
  RegisterRequest,
  RegisterResponse,
  TenantIdResponse,
} from '../../models';

describe('Account Models', () => {
  describe('AccountOptions', () => {
    it('should allow creating options with redirectUrl', () => {
      const options: AccountOptions = {
        redirectUrl: '/dashboard',
      };
      expect(options.redirectUrl).toBe('/dashboard');
    });

    it('should allow creating options with optional redirectUrl', () => {
      const options: AccountOptions = {};
      expect(options.redirectUrl).toBeUndefined();
    });
  });

  describe('LoginFormData', () => {
    it('should have required properties', () => {
      const loginData: LoginFormData = {
        username: 'testuser',
        password: 'password123',
        remember: true,
      };
      expect(loginData.username).toBe('testuser');
      expect(loginData.password).toBe('password123');
      expect(loginData.remember).toBe(true);
    });
  });

  describe('RegisterFormData', () => {
    it('should have required properties', () => {
      const registerData: RegisterFormData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };
      expect(registerData.username).toBe('testuser');
      expect(registerData.email).toBe('test@example.com');
      expect(registerData.password).toBe('password123');
    });
  });

  describe('TenantInfo', () => {
    it('should have name property', () => {
      const tenant: TenantInfo = {
        name: 'TestTenant',
      };
      expect(tenant.name).toBe('TestTenant');
    });
  });

  describe('PasswordFlowResult', () => {
    it('should allow success result', () => {
      const result: PasswordFlowResult = {
        success: true,
      };
      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should allow error result', () => {
      const result: PasswordFlowResult = {
        success: false,
        error: 'Invalid credentials',
      };
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
    });
  });

  describe('RegisterRequest', () => {
    it('should have required properties', () => {
      const request: RegisterRequest = {
        userName: 'testuser',
        emailAddress: 'test@example.com',
        password: 'Password123!',
      };
      expect(request.userName).toBe('testuser');
      expect(request.emailAddress).toBe('test@example.com');
      expect(request.password).toBe('Password123!');
    });

    it('should allow optional appName', () => {
      const request: RegisterRequest = {
        userName: 'testuser',
        emailAddress: 'test@example.com',
        password: 'Password123!',
        appName: 'React',
      };
      expect(request.appName).toBe('React');
    });
  });

  describe('RegisterResponse', () => {
    it('should have all required properties (v3.2.0 - twoFactorEnabled removed)', () => {
      const response: RegisterResponse = {
        tenantId: 'tenant-123',
        userName: 'testuser',
        name: 'Test',
        surname: 'User',
        email: 'test@example.com',
        emailConfirmed: false,
        phoneNumber: '',
        phoneNumberConfirmed: false,
        // Note: twoFactorEnabled was removed in v3.2.0
        lockoutEnabled: true,
        lockoutEnd: '',
        concurrencyStamp: 'stamp-123',
        isDeleted: false,
        deleterId: '',
        deletionTime: '',
        lastModificationTime: '',
        lastModifierId: '',
        creationTime: '2024-01-01T00:00:00Z',
        creatorId: '',
        id: 'user-123',
      };
      expect(response.id).toBe('user-123');
      expect(response.userName).toBe('testuser');
    });

    it('should not include twoFactorEnabled property (v3.2.0)', () => {
      const response: RegisterResponse = {
        tenantId: 'tenant-123',
        userName: 'testuser',
        name: 'Test',
        surname: 'User',
        email: 'test@example.com',
        emailConfirmed: false,
        phoneNumber: '',
        phoneNumberConfirmed: false,
        lockoutEnabled: true,
        lockoutEnd: '',
        concurrencyStamp: 'stamp-123',
        isDeleted: false,
        deleterId: '',
        deletionTime: '',
        lastModificationTime: '',
        lastModifierId: '',
        creationTime: '2024-01-01T00:00:00Z',
        creatorId: '',
        id: 'user-123',
      };
      // v3.2.0: twoFactorEnabled was removed from RegisterResponse
      // Verify the property doesn't exist on the type
      expect('twoFactorEnabled' in response).toBe(false);
    });

    it('should have all user identification properties', () => {
      const response: RegisterResponse = {
        tenantId: 'tenant-abc',
        userName: 'john.doe',
        name: 'John',
        surname: 'Doe',
        email: 'john.doe@example.com',
        emailConfirmed: true,
        phoneNumber: '+1234567890',
        phoneNumberConfirmed: true,
        lockoutEnabled: false,
        lockoutEnd: '2024-12-31T23:59:59Z',
        concurrencyStamp: 'abc-123-def',
        isDeleted: false,
        deleterId: '',
        deletionTime: '',
        lastModificationTime: '2024-06-15T10:30:00Z',
        lastModifierId: 'admin-user',
        creationTime: '2024-01-01T00:00:00Z',
        creatorId: 'system',
        id: 'user-john-doe',
      };

      // User identification
      expect(response.id).toBe('user-john-doe');
      expect(response.userName).toBe('john.doe');
      expect(response.tenantId).toBe('tenant-abc');

      // Name properties
      expect(response.name).toBe('John');
      expect(response.surname).toBe('Doe');

      // Contact properties
      expect(response.email).toBe('john.doe@example.com');
      expect(response.emailConfirmed).toBe(true);
      expect(response.phoneNumber).toBe('+1234567890');
      expect(response.phoneNumberConfirmed).toBe(true);
    });

    it('should have security and audit properties', () => {
      const response: RegisterResponse = {
        tenantId: '',
        userName: 'securitytest',
        name: '',
        surname: '',
        email: 'security@test.com',
        emailConfirmed: false,
        phoneNumber: '',
        phoneNumberConfirmed: false,
        lockoutEnabled: true,
        lockoutEnd: '2024-12-31T23:59:59Z',
        concurrencyStamp: 'concurrent-stamp-xyz',
        isDeleted: false,
        deleterId: '',
        deletionTime: '',
        lastModificationTime: '2024-06-01T00:00:00Z',
        lastModifierId: 'modifier-id',
        creationTime: '2024-01-01T00:00:00Z',
        creatorId: 'creator-id',
        id: 'security-user',
      };

      // Security properties
      expect(response.lockoutEnabled).toBe(true);
      expect(response.lockoutEnd).toBe('2024-12-31T23:59:59Z');
      expect(response.concurrencyStamp).toBe('concurrent-stamp-xyz');

      // Audit properties
      expect(response.creationTime).toBe('2024-01-01T00:00:00Z');
      expect(response.creatorId).toBe('creator-id');
      expect(response.lastModificationTime).toBe('2024-06-01T00:00:00Z');
      expect(response.lastModifierId).toBe('modifier-id');

      // Soft delete properties
      expect(response.isDeleted).toBe(false);
      expect(response.deleterId).toBe('');
      expect(response.deletionTime).toBe('');
    });

    it('should handle deleted user response', () => {
      const response: RegisterResponse = {
        tenantId: 'tenant-123',
        userName: 'deleteduser',
        name: 'Deleted',
        surname: 'User',
        email: 'deleted@example.com',
        emailConfirmed: true,
        phoneNumber: '',
        phoneNumberConfirmed: false,
        lockoutEnabled: false,
        lockoutEnd: '',
        concurrencyStamp: 'stamp',
        isDeleted: true,
        deleterId: 'admin-123',
        deletionTime: '2024-06-01T12:00:00Z',
        lastModificationTime: '2024-06-01T12:00:00Z',
        lastModifierId: 'admin-123',
        creationTime: '2024-01-01T00:00:00Z',
        creatorId: 'system',
        id: 'deleted-user-id',
      };

      expect(response.isDeleted).toBe(true);
      expect(response.deleterId).toBe('admin-123');
      expect(response.deletionTime).toBe('2024-06-01T12:00:00Z');
    });
  });

  describe('TenantIdResponse', () => {
    it('should have success and tenantId', () => {
      const response: TenantIdResponse = {
        success: true,
        tenantId: 'tenant-123',
      };
      expect(response.success).toBe(true);
      expect(response.tenantId).toBe('tenant-123');
    });

    // v2.7.0: name property tests
    it('should allow optional name property (v2.7.0)', () => {
      const response: TenantIdResponse = {
        success: true,
        tenantId: 'tenant-123',
        name: 'Test Tenant',
      };
      expect(response.name).toBe('Test Tenant');
    });

    it('should work without name property for backward compatibility (v2.7.0)', () => {
      const response: TenantIdResponse = {
        success: true,
        tenantId: 'tenant-456',
      };
      expect(response.name).toBeUndefined();
    });

    it('should handle empty name string (v2.7.0)', () => {
      const response: TenantIdResponse = {
        success: true,
        tenantId: 'tenant-789',
        name: '',
      };
      expect(response.name).toBe('');
    });
  });

  // v2.0.0: Account namespace tests
  describe('Account namespace (v2.0.0)', () => {
    describe('AuthWrapperComponentInputs', () => {
      it('should allow mainContentRef', () => {
        const inputs: Account.AuthWrapperComponentInputs = {
          mainContentRef: undefined,
        };
        expect(inputs.mainContentRef).toBeUndefined();
      });

      it('should allow optional cancelContentRef', () => {
        const inputs: Account.AuthWrapperComponentInputs = {
          mainContentRef: undefined,
          cancelContentRef: undefined,
        };
        expect(inputs.cancelContentRef).toBeUndefined();
      });
    });

    describe('AuthWrapperComponentOutputs', () => {
      it('should be an empty interface', () => {
        const outputs: Account.AuthWrapperComponentOutputs = {};
        expect(outputs).toEqual({});
      });
    });

    describe('TenantBoxComponentInputs', () => {
      it('should be an empty interface', () => {
        const inputs: Account.TenantBoxComponentInputs = {};
        expect(inputs).toEqual({});
      });
    });

    describe('TenantBoxComponentOutputs', () => {
      it('should be an empty interface', () => {
        const outputs: Account.TenantBoxComponentOutputs = {};
        expect(outputs).toEqual({});
      });
    });

    describe('PersonalSettingsComponentInputs', () => {
      it('should be an empty interface', () => {
        const inputs: Account.PersonalSettingsComponentInputs = {};
        expect(inputs).toEqual({});
      });
    });

    describe('PersonalSettingsComponentOutputs', () => {
      it('should be an empty interface', () => {
        const outputs: Account.PersonalSettingsComponentOutputs = {};
        expect(outputs).toEqual({});
      });
    });

    describe('ChangePasswordComponentInputs', () => {
      it('should be an empty interface', () => {
        const inputs: Account.ChangePasswordComponentInputs = {};
        expect(inputs).toEqual({});
      });
    });

    describe('ChangePasswordComponentOutputs', () => {
      it('should be an empty interface', () => {
        const outputs: Account.ChangePasswordComponentOutputs = {};
        expect(outputs).toEqual({});
      });
    });
  });
});
