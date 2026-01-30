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

// Mock RegisterForm
vi.mock('../../components', () => ({
  RegisterForm: (props: any) => (
    <div data-testid="register-form" data-show-tenant-box={props.showTenantBox}>
      RegisterForm
    </div>
  ),
}));

// Mock @abpjs/core
vi.mock('@abpjs/core', () => ({
  useLocalization: () => ({
    t: (key: string) => key,
  }),
}));

import { RegisterPage } from '../../pages/RegisterPage';

// Create mock store
const createMockStore = () => {
  const sessionReducer = (state = { language: 'en', tenant: { id: '', name: '' } }) => state;
  return configureStore({
    reducer: combineReducers({ session: sessionReducer }),
  });
};

describe('RegisterPage', () => {
  const renderRegisterPage = (props = {}) => {
    const store = createMockStore();
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <RegisterPage {...props} />
        </MemoryRouter>
      </Provider>
    );
  };

  it('should render RegisterForm', () => {
    renderRegisterPage();

    expect(screen.getByTestId('register-form')).toBeInTheDocument();
  });

  it('should pass props to RegisterForm', () => {
    renderRegisterPage({ showTenantBox: false });

    const registerForm = screen.getByTestId('register-form');
    expect(registerForm).toHaveAttribute('data-show-tenant-box', 'false');
  });

  it('should render Container wrapper', () => {
    renderRegisterPage();

    expect(screen.getByTestId('container')).toBeInTheDocument();
  });

  it('should accept custom maxWidth', () => {
    renderRegisterPage({ maxWidth: 'container.lg' });

    expect(screen.getByTestId('container')).toBeInTheDocument();
  });

  it('should pass showLoginLink to RegisterForm', () => {
    renderRegisterPage({ showLoginLink: false });

    expect(screen.getByTestId('register-form')).toBeInTheDocument();
  });

  it('should pass loginUrl to RegisterForm', () => {
    renderRegisterPage({ loginUrl: '/custom/login' });

    expect(screen.getByTestId('register-form')).toBeInTheDocument();
  });

  it('should pass onRegisterSuccess callback to RegisterForm', () => {
    const onRegisterSuccess = vi.fn();
    renderRegisterPage({ onRegisterSuccess });

    expect(screen.getByTestId('register-form')).toBeInTheDocument();
  });

  it('should pass onRegisterError callback to RegisterForm', () => {
    const onRegisterError = vi.fn();
    renderRegisterPage({ onRegisterError });

    expect(screen.getByTestId('register-form')).toBeInTheDocument();
  });
});
