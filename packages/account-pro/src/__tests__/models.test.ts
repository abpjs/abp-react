import { describe, it, expect } from 'vitest';
import type {
  AccountOptions,
  LoginFormData,
  RegisterFormData,
  TenantIdResponse,
  SendPasswordResetCodeRequest,
  ResetPasswordRequest,
  ChangePasswordFormData,
  ProfileResponse,
  PasswordFlowResult,
  ProfilePictureInput,
  ProfilePictureSourceDto,
  AccountTwoFactorSettingsDto,
} from '../models';
import { Account } from '../models';
import { ProfilePictureType } from '../config/enums/profile-picture-type';
import { eTwoFactorBehaviour } from '../config/enums/two-factor-behaviour';

describe('Models', () => {
  describe('AccountOptions', () => {
    it('should allow all optional properties', () => {
      const options: AccountOptions = {};
      expect(options).toBeDefined();
    });

    it('should allow full options', () => {
      const options: AccountOptions = {
        redirectUrl: '/dashboard',
        redirectToLogin: true,
        loginUrl: '/login',
        registerUrl: '/register',
        enableSocialLogins: true,
        enableTwoFactor: true,
      };
      expect(options.redirectUrl).toBe('/dashboard');
      expect(options.enableTwoFactor).toBe(true);
    });

    it('should allow enableLocalLogin option (v2.0.0)', () => {
      const options: AccountOptions = {
        enableLocalLogin: true,
      };
      expect(options.enableLocalLogin).toBe(true);
    });

    it('should allow disabling local login (v2.0.0)', () => {
      const options: AccountOptions = {
        enableLocalLogin: false,
        enableSocialLogins: true,
      };
      expect(options.enableLocalLogin).toBe(false);
      expect(options.enableSocialLogins).toBe(true);
    });
  });

  describe('Account namespace (v2.0.0)', () => {
    describe('TenantBoxComponentInputs', () => {
      it('should be a valid empty interface', () => {
        const inputs: Account.TenantBoxComponentInputs = {};
        expect(inputs).toBeDefined();
      });
    });

    describe('TenantBoxComponentOutputs', () => {
      it('should be a valid empty interface', () => {
        const outputs: Account.TenantBoxComponentOutputs = {};
        expect(outputs).toBeDefined();
      });
    });

    describe('PersonalSettingsComponentInputs', () => {
      it('should be a valid empty interface', () => {
        const inputs: Account.PersonalSettingsComponentInputs = {};
        expect(inputs).toBeDefined();
      });
    });

    describe('PersonalSettingsComponentOutputs', () => {
      it('should be a valid empty interface', () => {
        const outputs: Account.PersonalSettingsComponentOutputs = {};
        expect(outputs).toBeDefined();
      });
    });

    describe('ChangePasswordComponentInputs', () => {
      it('should be a valid empty interface', () => {
        const inputs: Account.ChangePasswordComponentInputs = {};
        expect(inputs).toBeDefined();
      });
    });

    describe('ChangePasswordComponentOutputs', () => {
      it('should be a valid empty interface', () => {
        const outputs: Account.ChangePasswordComponentOutputs = {};
        expect(outputs).toBeDefined();
      });
    });
  });

  describe('LoginFormData', () => {
    it('should have required properties', () => {
      const data: LoginFormData = {
        username: 'testuser',
        password: 'password123',
      };
      expect(data.username).toBe('testuser');
      expect(data.password).toBe('password123');
    });

    it('should allow optional rememberMe', () => {
      const data: LoginFormData = {
        username: 'testuser',
        password: 'password123',
        rememberMe: true,
      };
      expect(data.rememberMe).toBe(true);
    });
  });

  describe('RegisterFormData', () => {
    it('should have required properties', () => {
      const data: RegisterFormData = {
        username: 'testuser',
        emailAddress: 'test@example.com',
        password: 'password123',
      };
      expect(data.username).toBe('testuser');
      expect(data.emailAddress).toBe('test@example.com');
    });
  });

  describe('TenantIdResponse', () => {
    it('should have success and tenantId', () => {
      const response: TenantIdResponse = {
        success: true,
        tenantId: '123',
      };
      expect(response.success).toBe(true);
      expect(response.tenantId).toBe('123');
    });

    it('should allow null tenantId', () => {
      const response: TenantIdResponse = {
        success: false,
        tenantId: null,
      };
      expect(response.success).toBe(false);
      expect(response.tenantId).toBeNull();
    });
  });

  describe('SendPasswordResetCodeRequest', () => {
    it('should have required email', () => {
      const request: SendPasswordResetCodeRequest = {
        email: 'test@example.com',
      };
      expect(request.email).toBe('test@example.com');
    });

    it('should allow optional properties', () => {
      const request: SendPasswordResetCodeRequest = {
        email: 'test@example.com',
        appName: 'TestApp',
        returnUrl: '/login',
        returnUrlHash: '#success',
      };
      expect(request.appName).toBe('TestApp');
    });
  });

  describe('ResetPasswordRequest', () => {
    it('should have all required properties', () => {
      const request: ResetPasswordRequest = {
        userId: '123',
        resetToken: 'token123',
        password: 'newpassword',
      };
      expect(request.userId).toBe('123');
      expect(request.resetToken).toBe('token123');
      expect(request.password).toBe('newpassword');
    });
  });

  describe('ChangePasswordFormData', () => {
    it('should have all required properties', () => {
      const data: ChangePasswordFormData = {
        currentPassword: 'oldpass',
        newPassword: 'newpass',
        confirmNewPassword: 'newpass',
      };
      expect(data.currentPassword).toBe('oldpass');
      expect(data.newPassword).toBe('newpass');
      expect(data.confirmNewPassword).toBe('newpass');
    });
  });

  describe('ProfileResponse', () => {
    it('should have required properties', () => {
      const response: ProfileResponse = {
        userName: 'testuser',
        email: 'test@example.com',
      };
      expect(response.userName).toBe('testuser');
      expect(response.email).toBe('test@example.com');
    });

    it('should allow optional properties', () => {
      const response: ProfileResponse = {
        userName: 'testuser',
        email: 'test@example.com',
        name: 'Test',
        surname: 'User',
        phoneNumber: '+1234567890',
        isEmailConfirmed: true,
        isPhoneNumberConfirmed: false,
        isTwoFactorEnabled: true,
      };
      expect(response.name).toBe('Test');
      expect(response.isTwoFactorEnabled).toBe(true);
    });

    it('should support phoneNumberConfirmed field (v2.4.0)', () => {
      const response: ProfileResponse = {
        userName: 'testuser',
        email: 'test@example.com',
        phoneNumber: '+1234567890',
        phoneNumberConfirmed: true,
      };
      expect(response.phoneNumberConfirmed).toBe(true);
    });

    it('should allow both isPhoneNumberConfirmed and phoneNumberConfirmed (v2.4.0)', () => {
      const response: ProfileResponse = {
        userName: 'testuser',
        email: 'test@example.com',
        phoneNumber: '+1234567890',
        isPhoneNumberConfirmed: true, // deprecated
        phoneNumberConfirmed: true, // new field
      };
      expect(response.isPhoneNumberConfirmed).toBe(true);
      expect(response.phoneNumberConfirmed).toBe(true);
    });

    it('should handle unconfirmed phone number (v2.4.0)', () => {
      const response: ProfileResponse = {
        userName: 'testuser',
        email: 'test@example.com',
        phoneNumber: '+1234567890',
        phoneNumberConfirmed: false,
      };
      expect(response.phoneNumberConfirmed).toBe(false);
    });
  });

  describe('PasswordFlowResult', () => {
    it('should have success property', () => {
      const result: PasswordFlowResult = {
        success: true,
      };
      expect(result.success).toBe(true);
    });

    it('should allow optional error', () => {
      const result: PasswordFlowResult = {
        success: false,
        error: 'Invalid credentials',
      };
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
    });
  });

  describe('ProfilePictureInput (v3.2.0)', () => {
    it('should have required type property', () => {
      const input: ProfilePictureInput = {
        type: ProfilePictureType.Gravatar,
      };
      expect(input.type).toBe(ProfilePictureType.Gravatar);
    });

    it('should allow type None without fileBytes', () => {
      const input: ProfilePictureInput = {
        type: ProfilePictureType.None,
      };
      expect(input.type).toBe(ProfilePictureType.None);
      expect(input.fileBytes).toBeUndefined();
    });

    it('should allow type Gravatar without fileBytes', () => {
      const input: ProfilePictureInput = {
        type: ProfilePictureType.Gravatar,
      };
      expect(input.type).toBe(ProfilePictureType.Gravatar);
      expect(input.fileBytes).toBeUndefined();
    });

    it('should allow type Image with fileBytes', () => {
      const input: ProfilePictureInput = {
        type: ProfilePictureType.Image,
        fileBytes: 'base64encodedimagedata',
      };
      expect(input.type).toBe(ProfilePictureType.Image);
      expect(input.fileBytes).toBe('base64encodedimagedata');
    });

    it('should allow type Image with empty fileBytes', () => {
      const input: ProfilePictureInput = {
        type: ProfilePictureType.Image,
        fileBytes: '',
      };
      expect(input.type).toBe(ProfilePictureType.Image);
      expect(input.fileBytes).toBe('');
    });
  });

  describe('ProfilePictureSourceDto (v3.2.0)', () => {
    it('should have required type and source properties', () => {
      const dto: ProfilePictureSourceDto = {
        type: ProfilePictureType.Gravatar,
        source: 'https://gravatar.com/avatar/abc123',
      };
      expect(dto.type).toBe(ProfilePictureType.Gravatar);
      expect(dto.source).toBe('https://gravatar.com/avatar/abc123');
    });

    it('should allow type None with empty source', () => {
      const dto: ProfilePictureSourceDto = {
        type: ProfilePictureType.None,
        source: '',
      };
      expect(dto.type).toBe(ProfilePictureType.None);
      expect(dto.source).toBe('');
    });

    it('should allow type Gravatar with Gravatar URL', () => {
      const dto: ProfilePictureSourceDto = {
        type: ProfilePictureType.Gravatar,
        source: 'https://www.gravatar.com/avatar/abc123?s=200&d=identicon',
      };
      expect(dto.type).toBe(ProfilePictureType.Gravatar);
      expect(dto.source).toContain('gravatar.com');
    });

    it('should allow type Image with API endpoint source', () => {
      const dto: ProfilePictureSourceDto = {
        type: ProfilePictureType.Image,
        source: '/api/account/profile-picture/download',
      };
      expect(dto.type).toBe(ProfilePictureType.Image);
      expect(dto.source).toBe('/api/account/profile-picture/download');
    });

    it('should allow optional fileContent for Image type', () => {
      const dto: ProfilePictureSourceDto = {
        type: ProfilePictureType.Image,
        source: '/api/account/profile-picture/download',
        fileContent: 'base64encodedfiledata',
      };
      expect(dto.type).toBe(ProfilePictureType.Image);
      expect(dto.fileContent).toBe('base64encodedfiledata');
    });

    it('should allow fileContent to be undefined', () => {
      const dto: ProfilePictureSourceDto = {
        type: ProfilePictureType.Image,
        source: '/api/account/profile-picture/download',
      };
      expect(dto.fileContent).toBeUndefined();
    });
  });

  describe('AccountTwoFactorSettingsDto (v3.2.0)', () => {
    it('should have required isEnabled and behaviour properties', () => {
      const dto: AccountTwoFactorSettingsDto = {
        isEnabled: true,
        behaviour: eTwoFactorBehaviour.Optional,
      };
      expect(dto.isEnabled).toBe(true);
      expect(dto.behaviour).toBe(eTwoFactorBehaviour.Optional);
    });

    it('should allow isEnabled=false with Optional behaviour', () => {
      const dto: AccountTwoFactorSettingsDto = {
        isEnabled: false,
        behaviour: eTwoFactorBehaviour.Optional,
      };
      expect(dto.isEnabled).toBe(false);
      expect(dto.behaviour).toBe(eTwoFactorBehaviour.Optional);
    });

    it('should allow isEnabled=false with Disabled behaviour', () => {
      const dto: AccountTwoFactorSettingsDto = {
        isEnabled: false,
        behaviour: eTwoFactorBehaviour.Disabled,
      };
      expect(dto.isEnabled).toBe(false);
      expect(dto.behaviour).toBe(eTwoFactorBehaviour.Disabled);
    });

    it('should allow isEnabled=true with Forced behaviour', () => {
      const dto: AccountTwoFactorSettingsDto = {
        isEnabled: true,
        behaviour: eTwoFactorBehaviour.Forced,
      };
      expect(dto.isEnabled).toBe(true);
      expect(dto.behaviour).toBe(eTwoFactorBehaviour.Forced);
    });

    it('should support all behaviour types', () => {
      const optionalDto: AccountTwoFactorSettingsDto = {
        isEnabled: true,
        behaviour: eTwoFactorBehaviour.Optional,
      };
      const disabledDto: AccountTwoFactorSettingsDto = {
        isEnabled: false,
        behaviour: eTwoFactorBehaviour.Disabled,
      };
      const forcedDto: AccountTwoFactorSettingsDto = {
        isEnabled: true,
        behaviour: eTwoFactorBehaviour.Forced,
      };

      expect(optionalDto.behaviour).toBe(0);
      expect(disabledDto.behaviour).toBe(1);
      expect(forcedDto.behaviour).toBe(2);
    });
  });
});
