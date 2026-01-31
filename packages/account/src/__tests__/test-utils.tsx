import React, { ReactElement, ReactNode } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { AccountProvider, type AccountProviderProps } from '../providers';

// Mock @abpjs/core slices
const configReducer = (state = defaultConfigState) => state;
const loaderReducer = (state = defaultLoaderState) => state;
const sessionReducer = (
  state = defaultSessionState,
  action: { type: string; payload?: any }
) => {
  if (action.type === 'session/setTenant') {
    return { ...state, tenant: action.payload };
  }
  return state;
};
const profileReducer = (state = { profile: null }) => state;

export interface ConfigState {
  environment: {
    application?: { name?: string };
    apis?: { default?: { url?: string } };
    localization?: { defaultResourceName?: string };
    oAuthConfig?: {
      authority?: string;
      client_id?: string;
      scope?: string;
    };
  };
  requirements?: { layouts?: any[] };
  routes?: any[];
  localization?: {
    values?: Record<string, Record<string, string>>;
    languages?: any[];
  };
  auth?: {
    policies?: Record<string, any>;
    grantedPolicies?: Record<string, boolean>;
  };
  setting?: { values?: Record<string, string> };
  currentUser?: {
    isAuthenticated?: boolean;
    id?: string;
    tenantId?: string;
    userName?: string;
  };
  features?: { values?: Record<string, any> };
}

export interface LoaderState {
  loading: number;
  requests: any[];
}

export interface SessionState {
  language: string;
  tenant: { id: string; name: string };
}

export interface TestRootState {
  config: ConfigState;
  loader: LoaderState;
  session: SessionState;
  profile: { profile: null };
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
    preloadedState: {
      config: { ...defaultConfigState, ...preloadedState?.config },
      loader: { ...defaultLoaderState, ...preloadedState?.loader },
      session: { ...defaultSessionState, ...preloadedState?.session },
      profile: { profile: null, ...preloadedState?.profile },
    } as any,
  });
}

interface WrapperProps {
  children: ReactNode;
}

export interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Partial<TestRootState>;
  store?: ReturnType<typeof createTestStore>;
  accountOptions?: AccountProviderProps['options'];
  initialRoute?: string;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    accountOptions,
    initialRoute = '/',
    ...renderOptions
  }: RenderWithProvidersOptions = {}
): RenderResult & { store: ReturnType<typeof createTestStore> } {
  function Wrapper({ children }: WrapperProps): JSX.Element {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[initialRoute]}>
          <AccountProvider options={accountOptions}>{children}</AccountProvider>
        </MemoryRouter>
      </Provider>
    );
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
    localization: { defaultResourceName: 'AbpAccount' },
    oAuthConfig: {
      authority: 'https://auth.test.com',
      client_id: 'test-client',
      scope: 'openid profile email',
    },
  },
  requirements: { layouts: [] },
  routes: [],
  localization: {
    values: {
      AbpAccount: {
        Login: 'Log in',
        Register: 'Register',
        UserNameOrEmailAddress: 'Username or email address',
        Password: 'Password',
        RememberMe: 'Remember me',
        ForgotPassword: 'Forgot password?',
        AreYouANewUser: "Don't have an account?",
        AlreadyRegistered: 'Already have an account?',
        UserName: 'Username',
        EmailAddress: 'Email address',
        SuccessfullyRegistered: 'Successfully registered!',
        Success: 'Success',
        DefaultErrorMessage: 'An error occurred',
        // v1.1.0 additions
        CurrentPassword: 'Current Password',
        NewPassword: 'New Password',
        NewPasswordConfirm: 'Confirm New Password',
        Submit: 'Submit',
        PasswordChangedMessage: 'Your password has been changed successfully.',
        PersonalSettings: 'Personal Settings',
        ChangePassword: 'Change Password',
        ManageYourAccount: 'Manage Your Account',
        PersonalSettingsSaved: 'Personal settings have been saved successfully.',
        'DisplayName:Name': 'Name',
        'DisplayName:Surname': 'Surname',
        PhoneNumber: 'Phone Number',
      },
      AbpUiMultiTenancy: {
        Tenant: 'Tenant',
        NotSelected: 'Not selected',
        Switch: 'Switch',
        SwitchTenant: 'Switch Tenant',
        Name: 'Name',
        SwitchTenantHint: 'Leave empty to switch to the host.',
        GivenTenantIsNotAvailable: 'Tenant "{0}" is not available',
      },
      AbpTenantManagement: {
        Cancel: 'Cancel',
        Save: 'Save',
      },
      AbpUi: {
        Error: 'Error',
        DefaultErrorMessage: 'An error occurred',
      },
    },
    languages: [
      { cultureName: 'en', displayName: 'English', uiCultureName: 'en', flagIcon: '' },
    ],
  },
  auth: {
    policies: {},
    grantedPolicies: {},
  },
  setting: {
    values: {},
  },
  currentUser: {
    isAuthenticated: false,
    id: '',
    tenantId: '',
    userName: '',
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
  tenant: { id: '', name: '' },
};

// Mock RestService
export const createMockRestService = () => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  request: vi.fn(),
});

// Mock toaster
export const createMockToaster = () => ({
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
});
