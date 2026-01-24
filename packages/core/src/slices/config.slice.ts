import { createSlice, PayloadAction, Slice, PayloadActionCreator } from '@reduxjs/toolkit';
import { ApplicationConfiguration, Config, ABP } from '../models';

export interface ConfigState {
  environment: Partial<Config.Environment>;
  requirements: Config.Requirements;
  routes: ABP.FullRoute[];
  localization: ApplicationConfiguration.Localization;
  auth: ApplicationConfiguration.Auth;
  setting: ApplicationConfiguration.Setting;
  currentUser: ApplicationConfiguration.CurrentUser;
  features: ApplicationConfiguration.Features;
}

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

// Helper function to patch routes recursively
function patchRouteDeep(
  routes: ABP.FullRoute[],
  name: string,
  newValue: Partial<ABP.FullRoute>,
  parentUrl: string | null = null
): ABP.FullRoute[] {
  return routes.map((route) => {
    if (route.name === name) {
      const updatedRoute = { ...route, ...newValue };
      if (newValue.path) {
        updatedRoute.url = `${parentUrl || ''}/${newValue.path}`;
      }
      if (newValue.children && newValue.children.length) {
        updatedRoute.children = newValue.children.map((child) => ({
          ...child,
          url: `${parentUrl || ''}/${route.path}/${child.path}`,
        }));
      }
      return updatedRoute;
    } else if (route.children && route.children.length) {
      return {
        ...route,
        children: patchRouteDeep(
          route.children,
          name,
          newValue,
          `${parentUrl || ''}/${route.path}`
        ),
      };
    }
    return route;
  });
}

const _configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    setConfig: (state, action: PayloadAction<Partial<ConfigState>>) => {
      return { ...state, ...action.payload };
    },
    setEnvironment: (state, action: PayloadAction<Partial<Config.Environment>>) => {
      state.environment = action.payload;
    },
    setRequirements: (state, action: PayloadAction<Config.Requirements>) => {
      state.requirements = action.payload;
    },
    setRoutes: (state, action: PayloadAction<ABP.FullRoute[]>) => {
      state.routes = action.payload;
    },
    patchRoute: (
      state,
      action: PayloadAction<{ name: string; newValue: Partial<ABP.FullRoute> }>
    ) => {
      const { name, newValue } = action.payload;
      state.routes = patchRouteDeep(state.routes, name, newValue);
    },
    setApplicationConfiguration: (
      state,
      action: PayloadAction<ApplicationConfiguration.Response>
    ) => {
      const { localization, auth, setting, currentUser, features } = action.payload;
      state.localization = localization;
      state.auth = auth;
      state.setting = setting;
      state.currentUser = currentUser;
      state.features = features;
    },
  },
});

// Type assertions to avoid Immer type issues in declaration files
// Using type assertion is necessary to avoid TS4023 error with Immer types in .d.ts files
export const configSlice = _configSlice as Slice<ConfigState>;
export const configActions: {
  setConfig: PayloadActionCreator<Partial<ConfigState>>;
  setEnvironment: PayloadActionCreator<Partial<Config.Environment>>;
  setRequirements: PayloadActionCreator<Config.Requirements>;
  setRoutes: PayloadActionCreator<ABP.FullRoute[]>;
  patchRoute: PayloadActionCreator<{ name: string; newValue: Partial<ABP.FullRoute> }>;
  setApplicationConfiguration: PayloadActionCreator<ApplicationConfiguration.Response>;
} = _configSlice.actions as any;
export const configReducer = _configSlice.reducer;

// Selectors
export const selectConfig = (state: { config: ConfigState }) => state.config;
export const selectEnvironment = (state: { config: ConfigState }) => state.config.environment;
export const selectRoutes = (state: { config: ConfigState }) => state.config.routes;
export const selectLocalization = (state: { config: ConfigState }) => state.config.localization;
export const selectAuth = (state: { config: ConfigState }) => state.config.auth;
export const selectCurrentUser = (state: { config: ConfigState }) => state.config.currentUser;
export const selectSetting = (state: { config: ConfigState }) => state.config.setting;
export const selectFeatures = (state: { config: ConfigState }) => state.config.features;

export const selectApiUrl =
  (key: string = 'default') =>
  (state: { config: ConfigState }) =>
    state.config.environment.apis?.[key]?.url || '';

export const selectGrantedPolicy =
  (condition: string = '') =>
  (state: { config: ConfigState }) => {
    if (!condition) return true;

    const keys = condition
      .replace(/\(|\)|\!|\s/g, '')
      .split(/\|\||&&/)
      .filter((key) => key);

    if (!keys.length) return true;

    const getPolicy = (key: string): boolean => state.config.auth.grantedPolicies[key] ?? false;

    if (keys.length > 1) {
      let evaluatedCondition = condition;
      keys.forEach((key) => {
        const value = getPolicy(key);
        evaluatedCondition = evaluatedCondition.replace(key, String(value));
      });
      // Safe evaluation for boolean expressions
      return evaluateBooleanExpression(evaluatedCondition);
    }

    return getPolicy(condition);
  };

// Safe boolean expression evaluator (replaces eval)
function evaluateBooleanExpression(expr: string): boolean {
  // Replace string 'true'/'false' with boolean
  expr = expr.replace(/true/g, '1').replace(/false/g, '0');

  // Simple parser for && || ! ( )
  const tokens = expr.match(/[()!]|&&|\|\||[01]/g) || [];

  let pos = 0;

  function parseOr(): boolean {
    let result = parseAnd();
    while (tokens[pos] === '||') {
      pos++;
      result = result || parseAnd();
    }
    return result;
  }

  function parseAnd(): boolean {
    let result = parseNot();
    while (tokens[pos] === '&&') {
      pos++;
      result = result && parseNot();
    }
    return result;
  }

  function parseNot(): boolean {
    if (tokens[pos] === '!') {
      pos++;
      return !parseNot();
    }
    return parsePrimary();
  }

  function parsePrimary(): boolean {
    if (tokens[pos] === '(') {
      pos++;
      const result = parseOr();
      pos++; // skip ')'
      return result;
    }
    const val = tokens[pos] === '1';
    pos++;
    return val;
  }

  return parseOr();
}

export const selectSetting_ = (key: string) => (state: { config: ConfigState }) =>
  state.config.setting.values[key];

export const selectLocalizationValue =
  (resourceName: string, key: string) => (state: { config: ConfigState }) =>
    state.config.localization.values[resourceName]?.[key];

export const selectApplicationInfo = (state: { config: ConfigState }) =>
  state.config.environment.application;

// Helper function to find a route by path or name recursively
function findRouteDeep(
  routes: ABP.FullRoute[],
  path?: string,
  name?: string
): ABP.FullRoute | undefined {
  for (const route of routes) {
    if ((path && route.path === path) || (name && route.name === name)) {
      return route;
    }
    if (route.children && route.children.length) {
      const found = findRouteDeep(route.children as ABP.FullRoute[], path, name);
      if (found) return found;
    }
  }
  return undefined;
}

export const selectRoute =
  (path?: string, name?: string) =>
  (state: { config: ConfigState }): ABP.FullRoute | undefined =>
    findRouteDeep(state.config.routes, path, name);
