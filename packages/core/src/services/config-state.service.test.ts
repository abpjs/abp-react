import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ConfigStateService } from './config-state.service';
import { ConfigState, configActions } from '../slices/config.slice';
import { RootState } from '../store';
import { Config } from '../models';

describe('ConfigStateService', () => {
  let service: ConfigStateService;
  let mockState: RootState;
  let mockDispatch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockDispatch = vi.fn();
    mockState = {
      config: {
        environment: {
          application: { name: 'Test App', logoUrl: '/logo.png' },
          apis: {
            default: { url: 'https://api.default.com' },
            other: { url: 'https://api.other.com' },
          },
          localization: { defaultResourceName: 'TestResource' },
          production: false,
          oAuthConfig: {} as any,
        },
        requirements: { layouts: [] },
        routes: [
          { name: 'Home', path: 'home', url: '/home' },
          {
            name: 'Admin',
            path: 'admin',
            url: '/admin',
            children: [
              { name: 'Users', path: 'users', url: '/admin/users' },
              { name: 'Roles', path: 'roles', url: '/admin/roles' },
            ],
          },
        ],
        localization: {
          values: {
            TestResource: {
              Hello: 'Hello',
              Greeting: 'Hello {0}!',
              DoubleGreeting: 'Hello {0} and {1}!',
            },
          },
          languages: [
            { cultureName: 'en', displayName: 'English', uiCultureName: 'en' },
            { cultureName: 'tr', displayName: 'Türkçe', uiCultureName: 'tr' },
          ],
        },
        auth: {
          policies: {},
          grantedPolicies: {
            'AbpIdentity.Users': true,
            'AbpIdentity.Roles': true,
            'AbpIdentity.Users.Create': false,
            'AbpIdentity.Users.Delete': false,
          },
        },
        setting: {
          values: {
            'Abp.Localization.DefaultLanguage': 'en',
            'Abp.Timing.TimeZone': 'UTC',
            'App.Theme': 'dark',
          },
        },
        currentUser: {
          isAuthenticated: true,
          id: 'user-123',
          tenantId: 'tenant-456',
          userName: 'testuser',
        },
        features: { values: { 'Feature.A': 'true' } },
      } as ConfigState,
      session: {
        language: 'en',
        tenant: { id: 'tenant-456', name: 'Test Tenant' },
      },
      profile: {
        profile: null,
        loading: false,
        error: null,
      },
      loader: {
        isLoading: false,
        requests: [],
      },
    };

    service = new ConfigStateService(() => mockState, mockDispatch);
  });

  describe('getAll', () => {
    it('should return the entire config state', () => {
      const config = service.getAll();
      expect(config).toBe(mockState.config);
      expect(config.environment.application?.name).toBe('Test App');
    });
  });

  describe('getApplicationInfo', () => {
    it('should return application info from environment', () => {
      const appInfo = service.getApplicationInfo();
      expect(appInfo).toBeDefined();
      expect(appInfo?.name).toBe('Test App');
      expect(appInfo?.logoUrl).toBe('/logo.png');
    });

    it('should return undefined when application info is not set', () => {
      mockState.config.environment = {};
      const appInfo = service.getApplicationInfo();
      expect(appInfo).toBeUndefined();
    });
  });

  describe('getOne', () => {
    it('should return a specific config key', () => {
      expect(service.getOne('environment')).toBe(mockState.config.environment);
      expect(service.getOne('routes')).toBe(mockState.config.routes);
      expect(service.getOne('currentUser')).toBe(mockState.config.currentUser);
    });
  });

  describe('getDeep', () => {
    it('should return nested value with dot notation', () => {
      expect(service.getDeep('environment.application.name')).toBe('Test App');
    });

    it('should return nested value with array of keys', () => {
      expect(service.getDeep(['environment', 'application', 'logoUrl'])).toBe('/logo.png');
    });

    it('should return undefined for non-existent path', () => {
      expect(service.getDeep('environment.nonexistent.path')).toBeUndefined();
    });

    it('should throw error for invalid argument', () => {
      expect(() => service.getDeep(123 as any)).toThrow(
        'The argument must be a dot string or an string array.'
      );
    });
  });

  describe('getRoute', () => {
    it('should find route by path', () => {
      const route = service.getRoute('home');
      expect(route).toBeDefined();
      expect(route?.name).toBe('Home');
    });

    it('should find route by name', () => {
      const route = service.getRoute(undefined, 'Admin');
      expect(route).toBeDefined();
      expect(route?.path).toBe('admin');
    });

    it('should find route by url (v1.1.0 feature)', () => {
      const route = service.getRoute(undefined, undefined, '/admin/users');
      expect(route).toBeDefined();
      expect(route?.name).toBe('Users');
    });

    it('should find nested route by path', () => {
      const route = service.getRoute('users');
      expect(route).toBeDefined();
      expect(route?.name).toBe('Users');
      expect(route?.url).toBe('/admin/users');
    });

    it('should find nested route by name', () => {
      const route = service.getRoute(undefined, 'Roles');
      expect(route).toBeDefined();
      expect(route?.path).toBe('roles');
    });

    it('should return undefined for non-existent route', () => {
      expect(service.getRoute('nonexistent')).toBeUndefined();
      expect(service.getRoute(undefined, 'NonExistent')).toBeUndefined();
      expect(service.getRoute(undefined, undefined, '/nonexistent')).toBeUndefined();
    });
  });

  describe('getSetting', () => {
    it('should return setting value by key', () => {
      expect(service.getSetting('Abp.Localization.DefaultLanguage')).toBe('en');
      expect(service.getSetting('App.Theme')).toBe('dark');
    });

    it('should return undefined for non-existent setting', () => {
      expect(service.getSetting('NonExistent')).toBeUndefined();
    });
  });

  describe('getSettings', () => {
    it('should return all settings when no keyword provided', () => {
      const settings = service.getSettings();
      expect(Object.keys(settings)).toHaveLength(3);
      expect(settings['Abp.Localization.DefaultLanguage']).toBe('en');
    });

    it('should filter settings by keyword', () => {
      const settings = service.getSettings('Abp');
      expect(Object.keys(settings)).toHaveLength(2);
      expect(settings['Abp.Localization.DefaultLanguage']).toBe('en');
      expect(settings['Abp.Timing.TimeZone']).toBe('UTC');
      expect(settings['App.Theme']).toBeUndefined();
    });

    it('should return empty object when no matches', () => {
      const settings = service.getSettings('NonExistent');
      expect(Object.keys(settings)).toHaveLength(0);
    });
  });

  describe('getApiUrl', () => {
    it('should return default API URL', () => {
      expect(service.getApiUrl()).toBe('https://api.default.com');
    });

    it('should return specific API URL by key', () => {
      expect(service.getApiUrl('other')).toBe('https://api.other.com');
    });

    it('should return empty string for non-existent key', () => {
      expect(service.getApiUrl('nonexistent')).toBe('');
    });
  });

  describe('getGrantedPolicy', () => {
    it('should return true for empty condition', () => {
      expect(service.getGrantedPolicy('')).toBe(true);
      expect(service.getGrantedPolicy()).toBe(true);
    });

    it('should return policy value for single condition', () => {
      expect(service.getGrantedPolicy('AbpIdentity.Users')).toBe(true);
      expect(service.getGrantedPolicy('AbpIdentity.Users.Create')).toBe(false);
    });

    it('should evaluate AND conditions', () => {
      expect(service.getGrantedPolicy('AbpIdentity.Users && AbpIdentity.Roles')).toBe(true);
      expect(service.getGrantedPolicy('AbpIdentity.Users && AbpIdentity.Users.Create')).toBe(false);
    });

    it('should evaluate OR conditions', () => {
      expect(service.getGrantedPolicy('AbpIdentity.Users.Create || AbpIdentity.Users')).toBe(true);
      expect(service.getGrantedPolicy('AbpIdentity.Users.Create || AbpIdentity.Users.Delete')).toBe(
        false
      );
    });

    it('should evaluate NOT conditions in compound expressions', () => {
      // NOT operator works in compound expressions evaluated by the boolean evaluator
      expect(service.getGrantedPolicy('!AbpIdentity.Users.Create || AbpIdentity.Users')).toBe(true);
      expect(service.getGrantedPolicy('!AbpIdentity.Users && !AbpIdentity.Roles')).toBe(false);
    });

    it('should evaluate complex conditions with parentheses', () => {
      expect(
        service.getGrantedPolicy('(AbpIdentity.Users || AbpIdentity.Users.Create) && AbpIdentity.Roles')
      ).toBe(true);
      expect(
        service.getGrantedPolicy('!(AbpIdentity.Users.Create && AbpIdentity.Users.Delete)')
      ).toBe(true);
    });

    it('should return false for non-existent policy', () => {
      expect(service.getGrantedPolicy('NonExistent.Policy')).toBe(false);
    });
  });

  describe('getLocalization', () => {
    it('should return localized string for ResourceName::Key format', () => {
      expect(service.getLocalization('TestResource::Hello')).toBe('Hello');
    });

    it('should use default resource when only key is provided', () => {
      expect(service.getLocalization('Hello')).toBe('Hello');
    });

    it('should interpolate single parameter', () => {
      expect(service.getLocalization('TestResource::Greeting', 'World')).toBe('Hello World!');
    });

    it('should interpolate multiple parameters', () => {
      expect(service.getLocalization('TestResource::DoubleGreeting', 'Alice', 'Bob')).toBe(
        'Hello Alice and Bob!'
      );
    });

    it('should return key as default when not found', () => {
      expect(service.getLocalization('NonExistent')).toBe('NonExistent');
    });

    it('should handle LocalizationWithDefault object', () => {
      expect(
        service.getLocalization({ key: 'NonExistent', defaultValue: 'Default Value' })
      ).toBe('Default Value');
    });

    it('should return defaultValue from object when key exists', () => {
      expect(
        service.getLocalization({ key: 'TestResource::Hello', defaultValue: 'Fallback' })
      ).toBe('Hello');
    });

    it('should handle alternative parameter placeholder formats', () => {
      // Test { '0' } format (alternative quoted placeholder style)
      mockState.config.localization.values.TestResource.AltGreeting = "Hello { '0' }!";
      expect(service.getLocalization('TestResource::AltGreeting', 'World')).toBe('Hello World!');
    });
  });

  describe('dispatchSetEnvironment', () => {
    it('should dispatch setEnvironment action with the provided environment', () => {
      const newEnvironment: Config.Environment = {
        production: true,
        oAuthConfig: {
          client_id: 'test-client',
          authority: 'https://auth.example.com',
          redirect_uri: 'https://app.example.com/callback',
        },
        apis: {
          default: { url: 'https://api.example.com' },
        },
        application: { name: 'New App' },
      };

      service.dispatchSetEnvironment(newEnvironment);

      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith(configActions.setEnvironment(newEnvironment));
    });

    it('should throw error when dispatch is not configured', () => {
      const serviceWithoutDispatch = new ConfigStateService(() => mockState);

      const newEnvironment: Config.Environment = {
        production: true,
        oAuthConfig: {} as any,
        apis: {},
      };

      expect(() => serviceWithoutDispatch.dispatchSetEnvironment(newEnvironment)).toThrow(
        'Dispatch not configured. ConfigStateService requires dispatch for dispatchSetEnvironment.'
      );
    });

    it('should dispatch with minimal environment configuration', () => {
      const minimalEnvironment: Config.Environment = {
        production: false,
        oAuthConfig: {
          client_id: 'minimal-client',
          authority: 'https://auth.test.com',
          redirect_uri: 'https://test.com/callback',
        },
        apis: {},
      };

      service.dispatchSetEnvironment(minimalEnvironment);

      expect(mockDispatch).toHaveBeenCalledWith(configActions.setEnvironment(minimalEnvironment));
    });

    it('should dispatch with environment containing localization settings', () => {
      const envWithLocalization: Config.Environment = {
        production: true,
        oAuthConfig: {
          client_id: 'test',
          authority: 'https://auth.example.com',
          redirect_uri: 'https://app.example.com/callback',
        },
        apis: {
          default: { url: 'https://api.example.com' },
        },
        localization: {
          defaultResourceName: 'MyResource',
        },
      };

      service.dispatchSetEnvironment(envWithLocalization);

      expect(mockDispatch).toHaveBeenCalledWith(configActions.setEnvironment(envWithLocalization));
    });

    it('should allow multiple consecutive dispatches', () => {
      const env1: Config.Environment = {
        production: false,
        oAuthConfig: {} as any,
        apis: { default: { url: 'https://api1.example.com' } },
      };

      const env2: Config.Environment = {
        production: true,
        oAuthConfig: {} as any,
        apis: { default: { url: 'https://api2.example.com' } },
      };

      service.dispatchSetEnvironment(env1);
      service.dispatchSetEnvironment(env2);

      expect(mockDispatch).toHaveBeenCalledTimes(2);
      expect(mockDispatch).toHaveBeenNthCalledWith(1, configActions.setEnvironment(env1));
      expect(mockDispatch).toHaveBeenNthCalledWith(2, configActions.setEnvironment(env2));
    });
  });
});

// Note: ConfigService alias was removed in v2.0.0
// Use ConfigStateService directly
