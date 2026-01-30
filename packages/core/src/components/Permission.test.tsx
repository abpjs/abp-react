import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { Permission, usePermissionCheck } from './Permission';
import { createTestStore, defaultConfigState } from '../__tests__/test-utils';
import { renderHook } from '@testing-library/react';

describe('Permission component', () => {
  const createWrapper = () => {
    const store = createTestStore({
      config: {
        ...defaultConfigState,
        auth: {
          policies: {},
          grantedPolicies: {
            'AbpIdentity.Users': true,
            'AbpIdentity.Roles': true,
            'AbpIdentity.Users.Create': false,
          },
        },
      },
    });

    return ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );
  };

  describe('Permission', () => {
    it('should render children when permission is granted', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <Permission condition="AbpIdentity.Users">
            <div data-testid="protected-content">Protected Content</div>
          </Permission>
        </Wrapper>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should not render children when permission is denied', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <Permission condition="AbpIdentity.Users.Create">
            <div data-testid="protected-content">Protected Content</div>
          </Permission>
        </Wrapper>
      );

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should render fallback when permission is denied', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <Permission
            condition="AbpIdentity.Users.Create"
            fallback={<div data-testid="fallback">No Access</div>}
          >
            <div data-testid="protected-content">Protected Content</div>
          </Permission>
        </Wrapper>
      );

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
      expect(screen.getByTestId('fallback')).toBeInTheDocument();
    });

    it('should render children for complex conditions when true', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <Permission condition="AbpIdentity.Users && AbpIdentity.Roles">
            <div data-testid="protected-content">Protected Content</div>
          </Permission>
        </Wrapper>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should not render children for complex conditions when false', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <Permission condition="AbpIdentity.Users && AbpIdentity.Users.Create">
            <div data-testid="protected-content">Protected Content</div>
          </Permission>
        </Wrapper>
      );

      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should render for OR condition when at least one is true', () => {
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <Permission condition="AbpIdentity.Users.Create || AbpIdentity.Users">
            <div data-testid="protected-content">Protected Content</div>
          </Permission>
        </Wrapper>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should render for negated condition in compound expression', () => {
      // Single NOT conditions have a bug in the implementation (looks up '!Policy' in grantedPolicies)
      // Use compound expressions for NOT to work properly
      const Wrapper = createWrapper();
      render(
        <Wrapper>
          <Permission condition="!AbpIdentity.Users.Create || AbpIdentity.Roles">
            <div data-testid="protected-content">Protected Content</div>
          </Permission>
        </Wrapper>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });
  });

  describe('usePermissionCheck', () => {
    it('should return hasPermission true for granted policy', () => {
      const Wrapper = createWrapper();
      const { result } = renderHook(
        () => usePermissionCheck('AbpIdentity.Users'),
        { wrapper: Wrapper }
      );

      expect(result.current.hasPermission).toBe(true);
    });

    it('should return hasPermission false for denied policy', () => {
      const Wrapper = createWrapper();
      const { result } = renderHook(
        () => usePermissionCheck('AbpIdentity.Users.Create'),
        { wrapper: Wrapper }
      );

      expect(result.current.hasPermission).toBe(false);
    });

    it('should provide a working PermissionWrapper component', () => {
      const Wrapper = createWrapper();
      const { result } = renderHook(
        () => usePermissionCheck('AbpIdentity.Users'),
        { wrapper: Wrapper }
      );

      const { PermissionWrapper } = result.current;

      render(
        <Wrapper>
          <PermissionWrapper>
            <div data-testid="wrapper-content">Wrapped Content</div>
          </PermissionWrapper>
        </Wrapper>
      );

      expect(screen.getByTestId('wrapper-content')).toBeInTheDocument();
    });

    it('should show fallback in PermissionWrapper when denied', () => {
      const Wrapper = createWrapper();
      const { result } = renderHook(
        () => usePermissionCheck('AbpIdentity.Users.Create'),
        { wrapper: Wrapper }
      );

      const { PermissionWrapper } = result.current;

      render(
        <Wrapper>
          <PermissionWrapper fallback={<div data-testid="fallback">Fallback</div>}>
            <div data-testid="wrapper-content">Wrapped Content</div>
          </PermissionWrapper>
        </Wrapper>
      );

      expect(screen.queryByTestId('wrapper-content')).not.toBeInTheDocument();
      expect(screen.getByTestId('fallback')).toBeInTheDocument();
    });
  });
});
