import { describe, it, expect } from 'vitest';
import { ConfigService } from './config.service';
import { RootState } from '../store';
import { ConfigState } from '../slices/config.slice';

describe('ConfigService', () => {
  const mockConfigState: ConfigState = {
    environment: {
      application: { name: 'Test App' },
      apis: {
        default: { url: 'https://api.default.com' },
        other: { url: 'https://api.other.com' },
      },
      localization: { defaultResourceName: 'TestResource' },
    },
    requirements: { layouts: [] },
    routes: [{ name: 'Home', path: 'home' }],
    localization: {
      values: { TestResource: { Hello: 'World' } },
      languages: [],
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
      },
    },
    currentUser: {
      isAuthenticated: true,
      id: 'user-123',
      tenantId: 'tenant-456',
      userName: 'testuser',
    },
    features: { values: {} },
  };

  const mockRootState: RootState = {
    config: mockConfigState,
    loader: { loading: 0, requests: [] },
    session: { language: 'en', tenant: { id: '', name: '' } },
    profile: { profile: null },
  };

  const createService = () => new ConfigService(() => mockRootState);

  describe('getAll', () => {
    it('should return entire config state', () => {
      const service = createService();
      expect(service.getAll()).toBe(mockConfigState);
    });
  });

  describe('getOne', () => {
    it('should return environment', () => {
      const service = createService();
      expect(service.getOne('environment')).toBe(mockConfigState.environment);
    });

    it('should return routes', () => {
      const service = createService();
      expect(service.getOne('routes')).toBe(mockConfigState.routes);
    });

    it('should return localization', () => {
      const service = createService();
      expect(service.getOne('localization')).toBe(mockConfigState.localization);
    });

    it('should return auth', () => {
      const service = createService();
      expect(service.getOne('auth')).toBe(mockConfigState.auth);
    });

    it('should return currentUser', () => {
      const service = createService();
      expect(service.getOne('currentUser')).toBe(mockConfigState.currentUser);
    });
  });

  describe('getDeep', () => {
    it('should get deep value with dot notation string', () => {
      const service = createService();
      expect(service.getDeep('environment.application.name')).toBe('Test App');
    });

    it('should get deep value with array of keys', () => {
      const service = createService();
      expect(service.getDeep(['environment', 'application', 'name'])).toBe('Test App');
    });

    it('should return undefined for non-existent path', () => {
      const service = createService();
      expect(service.getDeep('environment.nonexistent.path')).toBeUndefined();
    });

    it('should get nested localization value', () => {
      const service = createService();
      expect(service.getDeep('localization.values.TestResource.Hello')).toBe('World');
    });

    it('should throw for invalid argument type', () => {
      const service = createService();
      // @ts-expect-error Testing invalid input
      expect(() => service.getDeep(123)).toThrow();
    });
  });

  describe('getSetting', () => {
    it('should return setting value', () => {
      const service = createService();
      expect(service.getSetting('Abp.Localization.DefaultLanguage')).toBe('en');
    });

    it('should return undefined for non-existent setting', () => {
      const service = createService();
      expect(service.getSetting('NonExistent.Setting')).toBeUndefined();
    });
  });

  describe('getApiUrl', () => {
    it('should return default API URL', () => {
      const service = createService();
      expect(service.getApiUrl()).toBe('https://api.default.com');
    });

    it('should return specific API URL', () => {
      const service = createService();
      expect(service.getApiUrl('other')).toBe('https://api.other.com');
    });

    it('should return empty string for non-existent key', () => {
      const service = createService();
      expect(service.getApiUrl('nonexistent')).toBe('');
    });
  });

  describe('getGrantedPolicy', () => {
    it('should return true for empty condition', () => {
      const service = createService();
      expect(service.getGrantedPolicy('')).toBe(true);
      expect(service.getGrantedPolicy()).toBe(true);
    });

    it('should return policy value for single condition', () => {
      const service = createService();
      expect(service.getGrantedPolicy('AbpIdentity.Users')).toBe(true);
      expect(service.getGrantedPolicy('AbpIdentity.Users.Create')).toBe(false);
    });

    it('should evaluate AND conditions', () => {
      const service = createService();
      expect(service.getGrantedPolicy('AbpIdentity.Users && AbpIdentity.Roles')).toBe(true);
      expect(service.getGrantedPolicy('AbpIdentity.Users && AbpIdentity.Users.Create')).toBe(false);
    });

    it('should evaluate OR conditions', () => {
      const service = createService();
      expect(service.getGrantedPolicy('AbpIdentity.Users.Create || AbpIdentity.Users')).toBe(true);
      expect(
        service.getGrantedPolicy('AbpIdentity.Users.Create || AbpIdentity.Users.Delete')
      ).toBe(false);
    });

    it('should evaluate NOT with compound conditions', () => {
      const service = createService();
      // NOT with compound expressions works via the boolean evaluator
      expect(
        service.getGrantedPolicy('!AbpIdentity.Users.Create || AbpIdentity.Users')
      ).toBe(true);
      expect(
        service.getGrantedPolicy('!AbpIdentity.Users && !AbpIdentity.Roles')
      ).toBe(false);
    });

    it('should evaluate complex conditions with parentheses', () => {
      const service = createService();
      expect(
        service.getGrantedPolicy(
          '(AbpIdentity.Users || AbpIdentity.Users.Create) && AbpIdentity.Roles'
        )
      ).toBe(true);
      expect(
        service.getGrantedPolicy('!(AbpIdentity.Users.Create && AbpIdentity.Users.Delete)')
      ).toBe(true);
    });

    it('should return false for non-existent policy', () => {
      const service = createService();
      expect(service.getGrantedPolicy('NonExistent.Policy')).toBe(false);
    });

    it('should handle double negation in compound expressions', () => {
      const service = createService();
      // Double negation with compound expression
      expect(
        service.getGrantedPolicy('!!AbpIdentity.Users || AbpIdentity.Roles')
      ).toBe(true);
    });

    it('should handle nested parentheses', () => {
      const service = createService();
      expect(
        service.getGrantedPolicy('((AbpIdentity.Users && AbpIdentity.Roles))')
      ).toBe(true);
    });
  });
});
