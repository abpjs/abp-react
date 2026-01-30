import React, { ReactElement, ReactNode } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { configReducer, ConfigState } from '../slices/config.slice';
import { loaderReducer, LoaderState } from '../slices/loader.slice';
import { sessionReducer, SessionState } from '../slices/session.slice';
import { profileReducer, ProfileState } from '../slices/profile.slice';

export interface TestRootState {
  config: ConfigState;
  loader: LoaderState;
  session: SessionState;
  profile: ProfileState;
}

const rootReducer = combineReducers({
  config: configReducer,
  loader: loaderReducer,
  session: sessionReducer,
  profile: profileReducer,
});

export function createTestStore(preloadedState?: Partial<TestRootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState as any,
  });
}

interface WrapperProps {
  children: ReactNode;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    ...renderOptions
  }: {
    preloadedState?: Partial<TestRootState>;
    store?: ReturnType<typeof createTestStore>;
  } & Omit<RenderOptions, 'wrapper'> = {}
): RenderResult & { store: ReturnType<typeof createTestStore> } {
  function Wrapper({ children }: WrapperProps): JSX.Element {
    return <Provider store={store}>{children}</Provider>;
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

// Default config state for testing
export const defaultConfigState: ConfigState = {
  environment: {
    application: { name: 'Test App' },
    apis: { default: { url: 'https://api.test.com' } },
    localization: { defaultResourceName: 'TestResource' },
  },
  requirements: { layouts: [] },
  routes: [],
  localization: {
    values: {
      TestResource: {
        HelloWorld: 'Hello World',
        Greeting: "Hello '{0}'!",
      },
    },
    languages: [
      { cultureName: 'en', displayName: 'English', uiCultureName: 'en', flagIcon: '' },
      { cultureName: 'ar', displayName: 'Arabic', uiCultureName: 'ar', flagIcon: '' },
    ],
  },
  auth: {
    policies: {},
    grantedPolicies: {
      'AbpIdentity.Users': true,
      'AbpIdentity.Roles': true,
      'AbpIdentity.Users.Create': false,
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

// Default loader state
export const defaultLoaderState: LoaderState = {
  loading: 0,
  requests: [],
};

// Default session state
export const defaultSessionState: SessionState = {
  language: 'en',
  tenant: { id: 'tenant-123', name: 'Test Tenant' },
};
