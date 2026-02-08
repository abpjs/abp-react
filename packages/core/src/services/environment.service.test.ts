import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EnvironmentService } from './environment.service';
import type { RootState } from '../store';
import { configActions } from '../slices/config.slice';

function createMockState(envOverrides: Record<string, any> = {}): RootState {
  return {
    config: {
      environment: {
        production: false,
        apis: {
          default: { url: 'https://api.example.com' },
          reporting: { url: 'https://reporting.example.com' },
        },
        application: { name: 'Test App' },
        oAuthConfig: {} as any,
        ...envOverrides,
      },
      requirements: { layouts: [] },
      routes: [],
      localization: {
        currentCulture: {
          cultureName: '',
          dateTimeFormat: {
            calendarAlgorithmType: '',
            dateSeparator: '',
            fullDateTimePattern: '',
            longTimePattern: '',
            shortDatePattern: '',
            shortTimePattern: '',
          },
          displayName: '',
          englishName: '',
          isRightToLeft: false,
          name: '',
          nativeName: '',
          threeLetterIsoLanguageName: '',
          twoLetterIsoLanguageName: '',
        },
        defaultResourceName: '',
        languages: [],
        values: {},
      },
      auth: { policies: {}, grantedPolicies: {} },
      setting: { values: {} },
      currentUser: {
        isAuthenticated: false,
        id: '',
        tenantId: '',
        userName: '',
        email: '',
        emailVerified: false,
        name: '',
        phoneNumber: '',
        phoneNumberVerified: false,
        surName: '',
        roles: [],
      },
      currentTenant: { id: '', name: '' },
      features: { values: {} },
    },
    session: {
      language: '',
      tenant: {},
      sessionDetail: { openedTabCount: 0, lastExitTime: 0, remember: false },
    },
    profile: { profile: null },
    loader: { showLoading: false },
  } as unknown as RootState;
}

describe('EnvironmentService (v4.0.0)', () => {
  let mockDispatch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockDispatch = vi.fn();
  });

  describe('getEnvironment', () => {
    it('should return the full environment configuration', () => {
      const state = createMockState();
      const service = new EnvironmentService(() => state);

      const env = service.getEnvironment();
      expect(env.production).toBe(false);
      expect(env.application?.name).toBe('Test App');
    });

    it('should return empty environment when not configured', () => {
      const state = createMockState({});
      (state as any).config.environment = {};
      const service = new EnvironmentService(() => state);

      const env = service.getEnvironment();
      expect(env).toEqual({});
    });

    it('should reflect state changes', () => {
      let currentState = createMockState();
      const service = new EnvironmentService(() => currentState);

      expect(service.getEnvironment().production).toBe(false);

      currentState = createMockState({ production: true });
      expect(service.getEnvironment().production).toBe(true);
    });
  });

  describe('getApiUrl', () => {
    it('should return default API URL', () => {
      const service = new EnvironmentService(() => createMockState());
      expect(service.getApiUrl()).toBe('https://api.example.com');
    });

    it('should return API URL for specific key', () => {
      const service = new EnvironmentService(() => createMockState());
      expect(service.getApiUrl('reporting')).toBe('https://reporting.example.com');
    });

    it('should return empty string for non-existent key', () => {
      const service = new EnvironmentService(() => createMockState());
      expect(service.getApiUrl('nonexistent')).toBe('');
    });

    it('should return empty string when no apis configured', () => {
      const state = createMockState({});
      (state as any).config.environment = {};
      const service = new EnvironmentService(() => state);
      expect(service.getApiUrl()).toBe('');
    });

    it('should default to "default" key when no argument', () => {
      const service = new EnvironmentService(() => createMockState());
      expect(service.getApiUrl()).toBe(service.getApiUrl('default'));
    });
  });

  describe('setState', () => {
    it('should dispatch setEnvironment action', () => {
      const service = new EnvironmentService(() => createMockState(), mockDispatch);

      const newEnv = {
        production: true,
        oAuthConfig: {} as any,
        apis: { default: { url: 'https://new-api.example.com' } },
        application: { name: 'Updated App' },
      };
      service.setState(newEnv);

      expect(mockDispatch).toHaveBeenCalledTimes(1);
      expect(mockDispatch).toHaveBeenCalledWith(configActions.setEnvironment(newEnv));
    });

    it('should throw error when dispatch is not configured', () => {
      const service = new EnvironmentService(() => createMockState());

      expect(() =>
        service.setState({
          production: true,
          oAuthConfig: {} as any,
          apis: { default: { url: '' } },
        })
      ).toThrow('Dispatch not configured. EnvironmentService requires dispatch for setState.');
    });

    it('should allow multiple setState calls', () => {
      const service = new EnvironmentService(() => createMockState(), mockDispatch);

      const env1 = { production: false, oAuthConfig: {} as any, apis: { default: { url: 'a' } } };
      const env2 = { production: true, oAuthConfig: {} as any, apis: { default: { url: 'b' } } };

      service.setState(env1);
      service.setState(env2);

      expect(mockDispatch).toHaveBeenCalledTimes(2);
    });
  });
});
