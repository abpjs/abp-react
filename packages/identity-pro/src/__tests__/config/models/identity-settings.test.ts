/**
 * Tests for Identity Settings Models
 * @abpjs/identity-pro v3.0.0
 */
import { describe, it, expect } from 'vitest';
import type {
  Settings,
  Password,
  Lockout,
  SignIn,
  User,
} from '../../../config/models/identity-settings';

describe('Password interface', () => {
  it('should accept valid password settings', () => {
    const password: Password = {
      requiredLength: 8,
      requiredUniqueChars: 4,
      requireNonAlphanumeric: true,
      requireLowercase: true,
      requireUppercase: true,
      requireDigit: true,
    };

    expect(password.requiredLength).toBe(8);
    expect(password.requiredUniqueChars).toBe(4);
    expect(password.requireNonAlphanumeric).toBe(true);
    expect(password.requireLowercase).toBe(true);
    expect(password.requireUppercase).toBe(true);
    expect(password.requireDigit).toBe(true);
  });

  it('should accept password settings with all false', () => {
    const password: Password = {
      requiredLength: 1,
      requiredUniqueChars: 0,
      requireNonAlphanumeric: false,
      requireLowercase: false,
      requireUppercase: false,
      requireDigit: false,
    };

    expect(password.requireNonAlphanumeric).toBe(false);
    expect(password.requireLowercase).toBe(false);
    expect(password.requireUppercase).toBe(false);
    expect(password.requireDigit).toBe(false);
  });
});

describe('Lockout interface', () => {
  it('should accept valid lockout settings', () => {
    const lockout: Lockout = {
      allowedForNewUsers: true,
      lockoutDuration: 300,
      maxFailedAccessAttempts: 5,
    };

    expect(lockout.allowedForNewUsers).toBe(true);
    expect(lockout.lockoutDuration).toBe(300);
    expect(lockout.maxFailedAccessAttempts).toBe(5);
  });

  it('should accept lockout settings with lockout disabled', () => {
    const lockout: Lockout = {
      allowedForNewUsers: false,
      lockoutDuration: 0,
      maxFailedAccessAttempts: 0,
    };

    expect(lockout.allowedForNewUsers).toBe(false);
    expect(lockout.lockoutDuration).toBe(0);
    expect(lockout.maxFailedAccessAttempts).toBe(0);
  });
});

describe('SignIn interface', () => {
  it('should accept valid sign-in settings', () => {
    const signIn: SignIn = {
      requireConfirmedEmail: true,
      enablePhoneNumberConfirmation: true,
      requireConfirmedPhoneNumber: false,
    };

    expect(signIn.requireConfirmedEmail).toBe(true);
    expect(signIn.enablePhoneNumberConfirmation).toBe(true);
    expect(signIn.requireConfirmedPhoneNumber).toBe(false);
  });

  it('should accept sign-in settings with all disabled', () => {
    const signIn: SignIn = {
      requireConfirmedEmail: false,
      enablePhoneNumberConfirmation: false,
      requireConfirmedPhoneNumber: false,
    };

    expect(signIn.requireConfirmedEmail).toBe(false);
    expect(signIn.enablePhoneNumberConfirmation).toBe(false);
    expect(signIn.requireConfirmedPhoneNumber).toBe(false);
  });
});

describe('User interface', () => {
  it('should accept valid user settings', () => {
    const user: User = {
      isUserNameUpdateEnabled: true,
      isEmailUpdateEnabled: true,
    };

    expect(user.isUserNameUpdateEnabled).toBe(true);
    expect(user.isEmailUpdateEnabled).toBe(true);
  });

  it('should accept user settings with all disabled', () => {
    const user: User = {
      isUserNameUpdateEnabled: false,
      isEmailUpdateEnabled: false,
    };

    expect(user.isUserNameUpdateEnabled).toBe(false);
    expect(user.isEmailUpdateEnabled).toBe(false);
  });
});

describe('Settings interface', () => {
  it('should accept complete settings', () => {
    const settings: Settings = {
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

    expect(settings.password).toBeDefined();
    expect(settings.lockout).toBeDefined();
    expect(settings.signIn).toBeDefined();
    expect(settings.user).toBeDefined();
  });

  it('should have all required sections', () => {
    const settings: Settings = {
      password: {
        requiredLength: 1,
        requiredUniqueChars: 0,
        requireNonAlphanumeric: false,
        requireLowercase: false,
        requireUppercase: false,
        requireDigit: false,
      },
      lockout: {
        allowedForNewUsers: false,
        lockoutDuration: 0,
        maxFailedAccessAttempts: 0,
      },
      signIn: {
        requireConfirmedEmail: false,
        enablePhoneNumberConfirmation: false,
        requireConfirmedPhoneNumber: false,
      },
      user: {
        isUserNameUpdateEnabled: false,
        isEmailUpdateEnabled: false,
      },
    };

    // All sections should be accessible
    expect(typeof settings.password.requiredLength).toBe('number');
    expect(typeof settings.lockout.lockoutDuration).toBe('number');
    expect(typeof settings.signIn.requireConfirmedEmail).toBe('boolean');
    expect(typeof settings.user.isUserNameUpdateEnabled).toBe('boolean');
  });
});
