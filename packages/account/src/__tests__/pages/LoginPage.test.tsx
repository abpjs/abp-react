import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';

// Mock @chakra-ui/react
vi.mock('@chakra-ui/react', () => ({
  Container: ({ children, ...props }: any) => <div data-testid="container" {...props}>{children}</div>,
  Center: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}));

// Mock LoginForm
vi.mock('../../components', () => ({
  LoginForm: (props: any) => (
    <div data-testid="login-form" data-show-tenant-box={props.showTenantBox}>
      LoginForm
    </div>
  ),
}));

// Mock @abpjs/core
vi.mock('@abpjs/core', () => ({
  useLocalization: () => ({
    t: (key: string) => key,
  }),
}));

import { LoginPage } from '../../pages/LoginPage';

// Create mock store
const createMockStore = () => {
  const sessionReducer = (state = { language: 'en', tenant: { id: '', name: '' } }) => state;
  return configureStore({
    reducer: combineReducers({ session: sessionReducer }),
  });
};

describe('LoginPage', () => {
  const renderLoginPage = (props = {}) => {
    const store = createMockStore();
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <LoginPage {...props} />
        </MemoryRouter>
      </Provider>
    );
  };

  it('should render LoginForm', () => {
    renderLoginPage();

    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  it('should pass props to LoginForm', () => {
    renderLoginPage({ showTenantBox: false });

    const loginForm = screen.getByTestId('login-form');
    expect(loginForm).toHaveAttribute('data-show-tenant-box', 'false');
  });

  it('should render Container wrapper', () => {
    renderLoginPage();

    expect(screen.getByTestId('container')).toBeInTheDocument();
  });

  it('should accept custom maxWidth', () => {
    renderLoginPage({ maxWidth: 'container.lg' });

    expect(screen.getByTestId('container')).toBeInTheDocument();
  });

  it('should pass showRegisterLink to LoginForm', () => {
    renderLoginPage({ showRegisterLink: false });

    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  it('should pass registerUrl to LoginForm', () => {
    renderLoginPage({ registerUrl: '/custom/register' });

    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  it('should pass onLoginSuccess callback to LoginForm', () => {
    const onLoginSuccess = vi.fn();
    renderLoginPage({ onLoginSuccess });

    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });

  it('should pass onLoginError callback to LoginForm', () => {
    const onLoginError = vi.fn();
    renderLoginPage({ onLoginError });

    expect(screen.getByTestId('login-form')).toBeInTheDocument();
  });
});
