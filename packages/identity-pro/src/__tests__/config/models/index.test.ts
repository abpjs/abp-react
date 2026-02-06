/**
 * Tests for Identity Config Models barrel export
 * @abpjs/identity-pro v3.0.0
 */
import { describe, it, expect } from 'vitest';
import type { IdentitySettings } from '../../../config/models';

describe('config/models barrel export', () => {
  it('should export IdentitySettings namespace', () => {
    // Test that the type is usable
    const settings: IdentitySettings.Settings = {
      password: {
        requiredLength: 8,
        requiredUniqueChars: 4,
        requireNonAlphanumeric: true,
        requireLowercase: true,
        requireUppercase: true,
        requireDigit: true,
      },
      lockout: {
        allowedForNewUsers: true,
        lockoutDuration: 300,
        maxFailedAccessAttempts: 5,
      },
      signIn: {
        requireConfirmedEmail: true,
        enablePhoneNumberConfirmation: true,
        requireConfirmedPhoneNumber: false,
      },
      user: {
        isUserNameUpdateEnabled: true,
        isEmailUpdateEnabled: true,
      },
    };

    expect(settings).toBeDefined();
    expect(settings.password.requiredLength).toBe(8);
  });

  it('should export Password type through namespace', () => {
    const password: IdentitySettings.Password = {
      requiredLength: 8,
      requiredUniqueChars: 4,
      requireNonAlphanumeric: true,
      requireLowercase: true,
      requireUppercase: true,
      requireDigit: true,
    };

    expect(password.requiredLength).toBe(8);
  });

  it('should export Lockout type through namespace', () => {
    const lockout: IdentitySettings.Lockout = {
      allowedForNewUsers: true,
      lockoutDuration: 300,
      maxFailedAccessAttempts: 5,
    };

    expect(lockout.lockoutDuration).toBe(300);
  });

  it('should export SignIn type through namespace', () => {
    const signIn: IdentitySettings.SignIn = {
      requireConfirmedEmail: true,
      enablePhoneNumberConfirmation: true,
      requireConfirmedPhoneNumber: false,
    };

    expect(signIn.requireConfirmedEmail).toBe(true);
  });

  it('should export User type through namespace', () => {
    const user: IdentitySettings.User = {
      isUserNameUpdateEnabled: true,
      isEmailUpdateEnabled: true,
    };

    expect(user.isUserNameUpdateEnabled).toBe(true);
  });
});
