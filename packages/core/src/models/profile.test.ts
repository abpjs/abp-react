import { describe, it, expect } from 'vitest';
import { Profile } from './profile';

describe('Profile namespace (v3.1.0)', () => {
  describe('Profile.Response interface', () => {
    it('should support isExternal property (v3.1.0)', () => {
      const profile: Profile.Response = {
        userName: 'testuser',
        email: 'test@example.com',
        name: 'Test',
        surname: 'User',
        phoneNumber: '+1234567890',
        isExternal: true,
      };

      expect(profile.isExternal).toBe(true);
    });

    it('should support hasPassword property (v3.1.0)', () => {
      const profile: Profile.Response = {
        userName: 'testuser',
        email: 'test@example.com',
        name: 'Test',
        surname: 'User',
        phoneNumber: '+1234567890',
        hasPassword: true,
      };

      expect(profile.hasPassword).toBe(true);
    });

    it('should support emailConfirmed property (v3.1.0)', () => {
      const profile: Profile.Response = {
        userName: 'testuser',
        email: 'test@example.com',
        name: 'Test',
        surname: 'User',
        phoneNumber: '+1234567890',
        emailConfirmed: true,
      };

      expect(profile.emailConfirmed).toBe(true);
    });

    it('should support phoneNumberConfirmed property (v3.1.0)', () => {
      const profile: Profile.Response = {
        userName: 'testuser',
        email: 'test@example.com',
        name: 'Test',
        surname: 'User',
        phoneNumber: '+1234567890',
        phoneNumberConfirmed: true,
      };

      expect(profile.phoneNumberConfirmed).toBe(true);
    });

    it('should allow all new properties to be undefined', () => {
      const profile: Profile.Response = {
        userName: 'testuser',
        email: 'test@example.com',
        name: 'Test',
        surname: 'User',
        phoneNumber: '+1234567890',
      };

      expect(profile.isExternal).toBeUndefined();
      expect(profile.hasPassword).toBeUndefined();
      expect(profile.emailConfirmed).toBeUndefined();
      expect(profile.phoneNumberConfirmed).toBeUndefined();
    });

    it('should support all properties together', () => {
      const profile: Profile.Response = {
        userName: 'johndoe',
        email: 'john@example.com',
        name: 'John',
        surname: 'Doe',
        phoneNumber: '+1555123456',
        isExternal: false,
        hasPassword: true,
        emailConfirmed: true,
        phoneNumberConfirmed: false,
      };

      expect(profile.userName).toBe('johndoe');
      expect(profile.email).toBe('john@example.com');
      expect(profile.name).toBe('John');
      expect(profile.surname).toBe('Doe');
      expect(profile.phoneNumber).toBe('+1555123456');
      expect(profile.isExternal).toBe(false);
      expect(profile.hasPassword).toBe(true);
      expect(profile.emailConfirmed).toBe(true);
      expect(profile.phoneNumberConfirmed).toBe(false);
    });

    it('should represent external user scenario', () => {
      // External users typically dont have a password
      const externalUser: Profile.Response = {
        userName: 'google-user-123',
        email: 'user@gmail.com',
        name: 'Google',
        surname: 'User',
        phoneNumber: '',
        isExternal: true,
        hasPassword: false,
        emailConfirmed: true, // Usually confirmed via external provider
        phoneNumberConfirmed: false,
      };

      expect(externalUser.isExternal).toBe(true);
      expect(externalUser.hasPassword).toBe(false);
    });

    it('should represent local user scenario', () => {
      // Local users should have password and be internal
      const localUser: Profile.Response = {
        userName: 'admin',
        email: 'admin@company.com',
        name: 'Admin',
        surname: 'User',
        phoneNumber: '+1234567890',
        isExternal: false,
        hasPassword: true,
        emailConfirmed: true,
        phoneNumberConfirmed: true,
      };

      expect(localUser.isExternal).toBe(false);
      expect(localUser.hasPassword).toBe(true);
    });

    it('should extend Partial<ExtensibleObject>', () => {
      const profile: Profile.Response = {
        userName: 'testuser',
        email: 'test@example.com',
        name: 'Test',
        surname: 'User',
        phoneNumber: '+1234567890',
        extraProperties: {
          customField1: 'value1',
          customField2: 123,
        },
      };

      expect(profile.extraProperties).toBeDefined();
      expect(profile.extraProperties?.customField1).toBe('value1');
    });
  });

  describe('Profile.State interface', () => {
    it('should contain profile property', () => {
      const state: Profile.State = {
        profile: {
          userName: 'testuser',
          email: 'test@example.com',
          name: 'Test',
          surname: 'User',
          phoneNumber: '+1234567890',
        },
      };

      expect(state.profile.userName).toBe('testuser');
    });
  });

  describe('Profile.ChangePasswordRequest interface', () => {
    it('should have currentPassword and newPassword', () => {
      const request: Profile.ChangePasswordRequest = {
        currentPassword: 'oldPassword123',
        newPassword: 'newPassword456',
      };

      expect(request.currentPassword).toBe('oldPassword123');
      expect(request.newPassword).toBe('newPassword456');
    });
  });
});
