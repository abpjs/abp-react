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
    it('should have all properties', () => {
      const response: RegisterResponse = {
        tenantId: 'tenant-123',
        userName: 'testuser',
        name: 'Test',
        surname: 'User',
        email: 'test@example.com',
        emailConfirmed: false,
        phoneNumber: '',
        phoneNumberConfirmed: false,
        twoFactorEnabled: false,
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
