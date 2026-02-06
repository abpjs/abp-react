import { describe, it, expect } from 'vitest';
import * as accountModule from '../index';

/**
 * Tests for @abpjs/account package exports
 * Uses static import to avoid slow dynamic imports during test execution.
 * @updated 3.0.0 - Added config and utils exports
 */
describe('@abpjs/account package exports', () => {
  // v3.0.0: Config exports
  describe('v3.0.0 - Config exports', () => {
    it('should export configureRoutes from config', () => {
      const { configureRoutes } = accountModule;
      expect(configureRoutes).toBeDefined();
      expect(typeof configureRoutes).toBe('function');
    });

    it('should export ACCOUNT_ROUTE_PROVIDERS from config', () => {
      const { ACCOUNT_ROUTE_PROVIDERS } = accountModule;
      expect(ACCOUNT_ROUTE_PROVIDERS).toBeDefined();
      expect(ACCOUNT_ROUTE_PROVIDERS.configureRoutes).toBeDefined();
    });

    it('should export initializeAccountRoutes from config', () => {
      const { initializeAccountRoutes } = accountModule;
      expect(initializeAccountRoutes).toBeDefined();
      expect(typeof initializeAccountRoutes).toBe('function');
    });
  });

  // v3.0.0: Utils exports
  describe('v3.0.0 - Utils exports', () => {
    it('should export accountOptionsFactory', () => {
      const { accountOptionsFactory } = accountModule;
      expect(accountOptionsFactory).toBeDefined();
      expect(typeof accountOptionsFactory).toBe('function');
    });

    it('accountOptionsFactory should return options with defaults', () => {
      const { accountOptionsFactory } = accountModule;
      const options = accountOptionsFactory({});
      expect(options.redirectUrl).toBe('/');
    });

    it('accountOptionsFactory should use provided redirectUrl', () => {
      const { accountOptionsFactory } = accountModule;
      const options = accountOptionsFactory({ redirectUrl: '/dashboard' });
      expect(options.redirectUrl).toBe('/dashboard');
    });
  });

  // v2.7.0: Enum exports
  describe('v2.7.0 - Enum exports', () => {
    it('should export eAccountComponents from package root', () => {
      const { eAccountComponents } = accountModule;
      expect(eAccountComponents).toBeDefined();
      expect(eAccountComponents.Login).toBe('Account.LoginComponent');
      expect(eAccountComponents.Register).toBe('Account.RegisterComponent');
      expect(eAccountComponents.ManageProfile).toBe('Account.ManageProfileComponent');
      expect(eAccountComponents.TenantBox).toBe('Account.TenantBoxComponent');
      expect(eAccountComponents.AuthWrapper).toBe('Account.AuthWrapperComponent');
      expect(eAccountComponents.ChangePassword).toBe('Account.ChangePasswordComponent');
      expect(eAccountComponents.PersonalSettings).toBe('Account.PersonalSettingsComponent');
    });

    it('should export eAccountRouteNames from package root', () => {
      const { eAccountRouteNames } = accountModule;
      expect(eAccountRouteNames).toBeDefined();
      expect(eAccountRouteNames.Account).toBe('AbpAccount::Menu:Account');
      expect(eAccountRouteNames.Login).toBe('AbpAccount::Login');
      expect(eAccountRouteNames.Register).toBe('AbpAccount::Register');
      expect(eAccountRouteNames.ManageProfile).toBe('AbpAccount::ManageYourProfile');
    });
  });

  // Model exports
  describe('Model exports', () => {
    it('should export model types (type-only, verified by compilation)', () => {
      // Account namespace is a TypeScript namespace (type-only export)
      // TenantIdResponse, LoginFormData, etc. are interfaces (type-only exports)
      // We can only verify the module loads correctly - types are checked at compile time
      expect(accountModule).toBeDefined();
    });
  });

  // Component exports
  describe('Component exports', () => {
    it('should export AuthWrapper', () => {
      const { AuthWrapper } = accountModule;
      expect(AuthWrapper).toBeDefined();
      // v2.7.0: Should have tenantBoxKey
      expect(AuthWrapper.tenantBoxKey).toBe('Account.TenantBoxComponent');
    });

    it('should export LoginForm', () => {
      const { LoginForm } = accountModule;
      expect(LoginForm).toBeDefined();
      // v2.7.0: Should have authWrapperKey
      expect(LoginForm.authWrapperKey).toBe('Account.AuthWrapperComponent');
    });

    it('should export RegisterForm', () => {
      const { RegisterForm } = accountModule;
      expect(RegisterForm).toBeDefined();
      // v2.7.0: Should have authWrapperKey
      expect(RegisterForm.authWrapperKey).toBe('Account.AuthWrapperComponent');
    });

    it('should export ManageProfile', () => {
      const { ManageProfile } = accountModule;
      expect(ManageProfile).toBeDefined();
      // v2.7.0: Should have component keys
      expect(ManageProfile.changePasswordKey).toBe('Account.ChangePasswordComponent');
      expect(ManageProfile.personalSettingsKey).toBe('Account.PersonalSettingsComponent');
    });

    it('should export TenantBox', () => {
      const { TenantBox } = accountModule;
      expect(TenantBox).toBeDefined();
      // v2.7.0: Should have componentKey
      expect(TenantBox.componentKey).toBe('Account.TenantBoxComponent');
    });
  });

  // Services exports
  describe('Service exports', () => {
    it('should export AccountService', () => {
      const { AccountService } = accountModule;
      expect(AccountService).toBeDefined();
    });
  });

  // Hooks exports
  describe('Hook exports', () => {
    it('should export usePasswordFlow', () => {
      const { usePasswordFlow } = accountModule;
      expect(usePasswordFlow).toBeDefined();
    });

    it('should export useAccountService', () => {
      const { useAccountService } = accountModule;
      expect(useAccountService).toBeDefined();
    });

    it('should export useSelfRegistrationEnabled', () => {
      const { useSelfRegistrationEnabled } = accountModule;
      expect(useSelfRegistrationEnabled).toBeDefined();
    });
  });

  // Routes exports
  describe('Route exports', () => {
    it('should export DEFAULT_REDIRECT_URL', () => {
      const { DEFAULT_REDIRECT_URL } = accountModule;
      expect(DEFAULT_REDIRECT_URL).toBe('/');
    });

    it('should export ACCOUNT_PATHS', () => {
      const { ACCOUNT_PATHS } = accountModule;
      expect(ACCOUNT_PATHS).toBeDefined();
      expect(ACCOUNT_PATHS.login).toBe('/account/login');
      expect(ACCOUNT_PATHS.register).toBe('/account/register');
    });
  });
});
