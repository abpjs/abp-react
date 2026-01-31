import { describe, it, expect } from 'vitest';
import {
  configReducer,
  configActions,
  ConfigState,
  selectConfig,
  selectEnvironment,
  selectRoutes,
  selectLocalization,
  selectAuth,
  selectCurrentUser,
  selectSetting,
  selectFeatures,
  selectApiUrl,
  selectGrantedPolicy,
  selectSetting_,
  selectLocalizationValue,
  selectApplicationInfo,
  selectRoute,
  selectSettings,
  selectLocalizationString,
} from './config.slice';
import { ABP } from '../models';

describe('config.slice', () => {
  const initialState: ConfigState = {
    environment: {},
    requirements: { layouts: [] },
    routes: [],
    localization: { values: {}, languages: [] },
    auth: { policies: {}, grantedPolicies: {} },
    setting: { values: {} },
    currentUser: { isAuthenticated: false, id: '', tenantId: '', userName: '' },
    features: { values: {} },
  };

  describe('reducers', () => {
    describe('setConfig', () => {
      it('should merge partial config', () => {
        const state = configReducer(
          initialState,
          configActions.setConfig({
            environment: { application: { name: 'Test App' } },
          })
        );
        expect(state.environment.application?.name).toBe('Test App');
      });
    });

    describe('setEnvironment', () => {
      it('should set environment', () => {
        const state = configReducer(
          initialState,
          configActions.setEnvironment({
            apis: { default: { url: 'https://api.example.com' } },
          })
        );
        expect(state.environment.apis?.default.url).toBe('https://api.example.com');
      });
    });

    describe('setRequirements', () => {
      it('should set requirements', () => {
        const state = configReducer(initialState, configActions.setRequirements({ layouts: [] }));
        expect(state.requirements.layouts).toEqual([]);
      });
    });

    describe('setRoutes', () => {
      it('should set routes', () => {
        const routes: ABP.FullRoute[] = [{ name: 'Home', path: 'home' }];
        const state = configReducer(initialState, configActions.setRoutes(routes));
        expect(state.routes).toHaveLength(1);
        expect(state.routes[0].name).toBe('Home');
      });
    });

    describe('patchRoute', () => {
      it('should patch a route by name', () => {
        const stateWithRoutes: ConfigState = {
          ...initialState,
          routes: [
            { name: 'Home', path: 'home', order: 1 },
            { name: 'About', path: 'about', order: 2 },
          ],
        };

        const state = configReducer(
          stateWithRoutes,
          configActions.patchRoute({
            name: 'Home',
            newValue: { order: 10, invisible: true },
          })
        );

        expect(state.routes[0].order).toBe(10);
        expect(state.routes[0].invisible).toBe(true);
      });

      it('should patch nested route', () => {
        const stateWithRoutes: ConfigState = {
          ...initialState,
          routes: [
            {
              name: 'Admin',
              path: 'admin',
              children: [{ name: 'Users', path: 'users' }],
            },
          ],
        };

        const state = configReducer(
          stateWithRoutes,
          configActions.patchRoute({
            name: 'Users',
            newValue: { order: 5 },
          })
        );

        expect(state.routes[0].children![0].order).toBe(5);
      });

      it('should update URL when path changes', () => {
        const stateWithRoutes: ConfigState = {
          ...initialState,
          routes: [{ name: 'Home', path: 'home', url: '/home' }],
        };

        const state = configReducer(
          stateWithRoutes,
          configActions.patchRoute({
            name: 'Home',
            newValue: { path: 'dashboard' },
          })
        );

        expect(state.routes[0].path).toBe('dashboard');
        expect(state.routes[0].url).toBe('/dashboard');
      });
    });

    describe('setApplicationConfiguration', () => {
      it('should set application configuration', () => {
        const appConfig = {
          localization: {
            values: { TestResource: { Hello: 'World' } },
            languages: [{ cultureName: 'en', displayName: 'English', uiCultureName: 'en' }],
          },
          auth: {
            policies: { 'AbpIdentity.Users': true },
            grantedPolicies: { 'AbpIdentity.Users': true },
          },
          setting: { values: { 'Test.Setting': 'value' } },
          currentUser: {
            isAuthenticated: true,
            id: '123',
            tenantId: '456',
            userName: 'admin',
          },
          features: { values: { 'Feature.A': 'true' } },
        };

        const state = configReducer(
          initialState,
          configActions.setApplicationConfiguration(appConfig as any)
        );

        expect(state.localization.values.TestResource.Hello).toBe('World');
        expect(state.auth.grantedPolicies['AbpIdentity.Users']).toBe(true);
        expect(state.currentUser.isAuthenticated).toBe(true);
        expect(state.currentUser.userName).toBe('admin');
      });
    });
  });

  describe('selectors', () => {
    const testState = {
      config: {
        environment: {
          application: { name: 'Test App' },
          apis: {
            default: { url: 'https://api.default.com' },
            other: { url: 'https://api.other.com' },
          },
          localization: { defaultResourceName: 'TestResource' },
        },
        requirements: { layouts: [] },
        routes: [
          { name: 'Home', path: 'home', url: '/home' },
          {
            name: 'Admin',
            path: 'admin',
            url: '/admin',
            children: [{ name: 'Users', path: 'users', url: '/admin/users' }],
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
    };

    describe('basic selectors', () => {
      it('selectConfig should return config state', () => {
        expect(selectConfig(testState)).toBe(testState.config);
      });

      it('selectEnvironment should return environment', () => {
        expect(selectEnvironment(testState)).toBe(testState.config.environment);
      });

      it('selectRoutes should return routes', () => {
        expect(selectRoutes(testState)).toBe(testState.config.routes);
      });

      it('selectLocalization should return localization', () => {
        expect(selectLocalization(testState)).toBe(testState.config.localization);
      });

      it('selectAuth should return auth', () => {
        expect(selectAuth(testState)).toBe(testState.config.auth);
      });

      it('selectCurrentUser should return current user', () => {
        expect(selectCurrentUser(testState)).toBe(testState.config.currentUser);
      });

      it('selectSetting should return setting', () => {
        expect(selectSetting(testState)).toBe(testState.config.setting);
      });

      it('selectFeatures should return features', () => {
        expect(selectFeatures(testState)).toBe(testState.config.features);
      });

      it('selectApplicationInfo should return application info', () => {
        expect(selectApplicationInfo(testState)).toBe(testState.config.environment.application);
      });
    });

    describe('selectApiUrl', () => {
      it('should return default API URL', () => {
        expect(selectApiUrl()(testState)).toBe('https://api.default.com');
      });

      it('should return specific API URL by key', () => {
        expect(selectApiUrl('other')(testState)).toBe('https://api.other.com');
      });

      it('should return empty string for non-existent key', () => {
        expect(selectApiUrl('nonexistent')(testState)).toBe('');
      });
    });

    describe('selectGrantedPolicy', () => {
      it('should return true for empty condition', () => {
        expect(selectGrantedPolicy('')(testState)).toBe(true);
        expect(selectGrantedPolicy()(testState)).toBe(true);
      });

      it('should return policy value for single condition', () => {
        expect(selectGrantedPolicy('AbpIdentity.Users')(testState)).toBe(true);
        expect(selectGrantedPolicy('AbpIdentity.Users.Create')(testState)).toBe(false);
      });

      it('should evaluate AND conditions', () => {
        expect(selectGrantedPolicy('AbpIdentity.Users && AbpIdentity.Roles')(testState)).toBe(true);
        expect(selectGrantedPolicy('AbpIdentity.Users && AbpIdentity.Users.Create')(testState)).toBe(
          false
        );
      });

      it('should evaluate OR conditions', () => {
        expect(
          selectGrantedPolicy('AbpIdentity.Users.Create || AbpIdentity.Users')(testState)
        ).toBe(true);
        expect(
          selectGrantedPolicy('AbpIdentity.Users.Create || AbpIdentity.Users.Delete')(testState)
        ).toBe(false);
      });

      it('should evaluate NOT with compound conditions', () => {
        // NOT with compound expressions works via the boolean evaluator
        expect(
          selectGrantedPolicy('!AbpIdentity.Users.Create || AbpIdentity.Users')(testState)
        ).toBe(true);
        expect(
          selectGrantedPolicy('!AbpIdentity.Users && !AbpIdentity.Roles')(testState)
        ).toBe(false);
      });

      it('should evaluate complex conditions with parentheses', () => {
        expect(
          selectGrantedPolicy('(AbpIdentity.Users || AbpIdentity.Users.Create) && AbpIdentity.Roles')(
            testState
          )
        ).toBe(true);
        expect(
          selectGrantedPolicy(
            '!(AbpIdentity.Users.Create && AbpIdentity.Users.Delete)'
          )(testState)
        ).toBe(true);
      });

      it('should return false for non-existent policy', () => {
        expect(selectGrantedPolicy('NonExistent.Policy')(testState)).toBe(false);
      });
    });

    describe('selectSetting_', () => {
      it('should return setting value by key', () => {
        expect(selectSetting_('Abp.Localization.DefaultLanguage')(testState)).toBe('en');
      });

      it('should return undefined for non-existent key', () => {
        expect(selectSetting_('NonExistent')(testState)).toBeUndefined();
      });
    });

    describe('selectLocalizationValue', () => {
      it('should return localization value', () => {
        expect(selectLocalizationValue('TestResource', 'Hello')(testState)).toBe('Hello');
      });

      it('should return undefined for non-existent key', () => {
        expect(selectLocalizationValue('TestResource', 'NonExistent')(testState)).toBeUndefined();
      });
    });

    describe('selectRoute', () => {
      it('should find route by path', () => {
        const route = selectRoute('home')(testState);
        expect(route).toBeDefined();
        expect(route!.name).toBe('Home');
      });

      it('should find route by name', () => {
        const route = selectRoute(undefined, 'Admin')(testState);
        expect(route).toBeDefined();
        expect(route!.path).toBe('admin');
      });

      it('should find route by url (v1.1.0 feature)', () => {
        const route = selectRoute(undefined, undefined, '/home')(testState);
        expect(route).toBeDefined();
        expect(route!.name).toBe('Home');
      });

      it('should find nested route by url', () => {
        const route = selectRoute(undefined, undefined, '/admin/users')(testState);
        expect(route).toBeDefined();
        expect(route!.name).toBe('Users');
      });

      it('should find nested route by path', () => {
        const route = selectRoute('users')(testState);
        expect(route).toBeDefined();
        expect(route!.name).toBe('Users');
      });

      it('should return undefined for non-existent route', () => {
        expect(selectRoute('nonexistent')(testState)).toBeUndefined();
      });

      it('should return undefined for non-existent url', () => {
        expect(selectRoute(undefined, undefined, '/nonexistent')(testState)).toBeUndefined();
      });

      it('should prioritize path match when both path and name are provided', () => {
        const route = selectRoute('home', 'Admin')(testState);
        expect(route).toBeDefined();
        expect(route!.name).toBe('Home');
      });
    });

    describe('selectSettings', () => {
      it('should return all settings without keyword', () => {
        const settings = selectSettings()(testState);
        expect(Object.keys(settings)).toHaveLength(3);
      });

      it('should filter settings by keyword', () => {
        const settings = selectSettings('Abp')(testState);
        expect(Object.keys(settings)).toHaveLength(2);
        expect(settings['Abp.Localization.DefaultLanguage']).toBe('en');
        expect(settings['Abp.Timing.TimeZone']).toBe('UTC');
      });

      it('should return empty object when no matches', () => {
        const settings = selectSettings('NonExistent')(testState);
        expect(Object.keys(settings)).toHaveLength(0);
      });
    });

    describe('selectLocalizationString', () => {
      it('should return localized string for simple key', () => {
        expect(selectLocalizationString('TestResource::Hello')(testState)).toBe('Hello');
      });

      it('should interpolate parameters', () => {
        expect(selectLocalizationString('TestResource::Greeting', 'World')(testState)).toBe(
          'Hello World!'
        );
      });

      it('should interpolate multiple parameters', () => {
        expect(
          selectLocalizationString('TestResource::DoubleGreeting', 'Alice', 'Bob')(testState)
        ).toBe('Hello Alice and Bob!');
      });

      it('should use default resource name when not specified', () => {
        expect(selectLocalizationString('Hello')(testState)).toBe('Hello');
      });

      it('should return key as default when not found', () => {
        expect(selectLocalizationString('NonExistent')(testState)).toBe('NonExistent');
      });

      it('should handle object key with defaultValue', () => {
        expect(
          selectLocalizationString({ key: 'NonExistent', defaultValue: 'Default' })(testState)
        ).toBe('Default');
      });
    });
  });
});
