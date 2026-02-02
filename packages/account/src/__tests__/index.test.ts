import { describe, it, expect } from 'vitest';

/**
 * Tests for @abpjs/account package exports
 */
describe('@abpjs/account package exports', () => {
  // v2.7.0: Enum exports
  describe('v2.7.0 - Enum exports', () => {
    it('should export eAccountComponents from package root', async () => {
      const { eAccountComponents } = await import('../index');
      expect(eAccountComponents).toBeDefined();
      expect(eAccountComponents.Login).toBe('Account.LoginComponent');
      expect(eAccountComponents.Register).toBe('Account.RegisterComponent');
      expect(eAccountComponents.ManageProfile).toBe('Account.ManageProfileComponent');
      expect(eAccountComponents.TenantBox).toBe('Account.TenantBoxComponent');
      expect(eAccountComponents.AuthWrapper).toBe('Account.AuthWrapperComponent');
      expect(eAccountComponents.ChangePassword).toBe('Account.ChangePasswordComponent');
      expect(eAccountComponents.PersonalSettings).toBe('Account.PersonalSettingsComponent');
    });

    it('should export eAccountRouteNames from package root', async () => {
      const { eAccountRouteNames } = await import('../index');
      expect(eAccountRouteNames).toBeDefined();
      expect(eAccountRouteNames.Account).toBe('AbpAccount::Menu:Account');
      expect(eAccountRouteNames.Login).toBe('AbpAccount::Login');
      expect(eAccountRouteNames.Register).toBe('AbpAccount::Register');
      expect(eAccountRouteNames.ManageProfile).toBe('AbpAccount::ManageYourProfile');
    });
  });

  // Model exports
  describe('Model exports', () => {
    it('should export model types (type-only, verified by compilation)', async () => {
      // Account namespace is a TypeScript namespace (type-only export)
      // TenantIdResponse, LoginFormData, etc. are interfaces (type-only exports)
      // We can only verify the module loads correctly - types are checked at compile time
      const module = await import('../index');
      expect(module).toBeDefined();
    });
  });

  // Component exports
  describe('Component exports', () => {
    it('should export AuthWrapper', async () => {
      const { AuthWrapper } = await import('../index');
      expect(AuthWrapper).toBeDefined();
      // v2.7.0: Should have tenantBoxKey
      expect(AuthWrapper.tenantBoxKey).toBe('Account.TenantBoxComponent');
    });

    it('should export LoginForm', async () => {
      const { LoginForm } = await import('../index');
      expect(LoginForm).toBeDefined();
      // v2.7.0: Should have authWrapperKey
      expect(LoginForm.authWrapperKey).toBe('Account.AuthWrapperComponent');
    });

    it('should export RegisterForm', async () => {
      const { RegisterForm } = await import('../index');
      expect(RegisterForm).toBeDefined();
      // v2.7.0: Should have authWrapperKey
      expect(RegisterForm.authWrapperKey).toBe('Account.AuthWrapperComponent');
    });

    it('should export ManageProfile', async () => {
      const { ManageProfile } = await import('../index');
      expect(ManageProfile).toBeDefined();
      // v2.7.0: Should have component keys
      expect(ManageProfile.changePasswordKey).toBe('Account.ChangePasswordComponent');
      expect(ManageProfile.personalSettingsKey).toBe('Account.PersonalSettingsComponent');
    });

    it('should export TenantBox', async () => {
      const { TenantBox } = await import('../index');
      expect(TenantBox).toBeDefined();
      // v2.7.0: Should have componentKey
      expect(TenantBox.componentKey).toBe('Account.TenantBoxComponent');
    });
  });

  // Services exports
  describe('Service exports', () => {
    it('should export AccountService', async () => {
      const { AccountService } = await import('../index');
      expect(AccountService).toBeDefined();
    });
  });

  // Hooks exports
  describe('Hook exports', () => {
    it('should export usePasswordFlow', async () => {
      const { usePasswordFlow } = await import('../index');
      expect(usePasswordFlow).toBeDefined();
    });

    it('should export useAccountService', async () => {
      const { useAccountService } = await import('../index');
      expect(useAccountService).toBeDefined();
    });

    it('should export useSelfRegistrationEnabled', async () => {
      const { useSelfRegistrationEnabled } = await import('../index');
      expect(useSelfRegistrationEnabled).toBeDefined();
    });
  });

  // Routes exports
  describe('Route exports', () => {
    it('should export DEFAULT_REDIRECT_URL', async () => {
      const { DEFAULT_REDIRECT_URL } = await import('../index');
      expect(DEFAULT_REDIRECT_URL).toBe('/');
    });

    it('should export ACCOUNT_PATHS', async () => {
      const { ACCOUNT_PATHS } = await import('../index');
      expect(ACCOUNT_PATHS).toBeDefined();
      expect(ACCOUNT_PATHS.login).toBe('/account/login');
      expect(ACCOUNT_PATHS.register).toBe('/account/register');
    });
  });
});
