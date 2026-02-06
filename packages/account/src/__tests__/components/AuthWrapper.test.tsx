import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Mock @chakra-ui/react
vi.mock('@chakra-ui/react', () => ({
  Box: ({ children, className, textAlign, mt, ...props }: any) => (
    <div className={className} style={{ textAlign, marginTop: mt }} data-testid="box" {...props}>
      {children}
    </div>
  ),
  Container: ({ children, maxW, ...props }: any) => (
    <div data-testid="container" data-maxw={maxW} {...props}>
      {children}
    </div>
  ),
  Stack: ({ children, gap, ...props }: any) => (
    <div data-testid="stack" data-gap={gap} {...props}>
      {children}
    </div>
  ),
  Flex: ({ children, className, height, flex, ...props }: any) => (
    <div className={className} data-testid="flex" style={{ height, flex }} {...props}>
      {children}
    </div>
  ),
  Text: ({ children, ...props }: any) => (
    <span data-testid="text" {...props}>{children}</span>
  ),
}));

// Mock setting value for local login
let mockLocalLoginSetting: string | undefined | null = undefined;

// Mock @abpjs/core
vi.mock('@abpjs/core', () => ({
  useLocalization: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'AbpAccount::LocalLoginDisabledMessage': 'Local login is disabled. Please use an external login provider.',
      };
      return translations[key] || key;
    },
  }),
  useSetting: (key: string) => {
    if (key === 'Abp.Account.EnableLocalLogin') {
      return mockLocalLoginSetting;
    }
    return undefined;
  },
}));

import { AuthWrapper } from '../../components/AuthWrapper/AuthWrapper';

describe('AuthWrapper', () => {
  beforeEach(() => {
    mockLocalLoginSetting = undefined; // Reset to default (enabled)
  });

  it('should render children when provided', () => {
    render(
      <AuthWrapper>
        <div data-testid="child-content">Child Content</div>
      </AuthWrapper>
    );

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('should render mainContent when provided', () => {
    render(
      <AuthWrapper mainContent={<div data-testid="main-content">Main Content</div>} />
    );

    expect(screen.getByTestId('main-content')).toBeInTheDocument();
    expect(screen.getByText('Main Content')).toBeInTheDocument();
  });

  it('should prefer mainContent over children', () => {
    render(
      <AuthWrapper mainContent={<div data-testid="main-content">Main Content</div>}>
        <div data-testid="child-content">Child Content</div>
      </AuthWrapper>
    );

    expect(screen.getByTestId('main-content')).toBeInTheDocument();
    expect(screen.queryByTestId('child-content')).not.toBeInTheDocument();
  });

  it('should render cancelContent when provided', () => {
    render(
      <AuthWrapper cancelContent={<a href="/cancel">Cancel</a>}>
        <div>Main Content</div>
      </AuthWrapper>
    );

    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should not render cancel area when cancelContent is not provided', () => {
    const { container } = render(
      <AuthWrapper>
        <div>Main Content</div>
      </AuthWrapper>
    );

    // Should only have main content box, not cancel content box
    const boxes = container.querySelectorAll('[data-testid="box"]');
    // One box for the main layout, no additional box for cancel content
    expect(boxes.length).toBeLessThan(3);
  });

  it('should render with auth-wrapper className', () => {
    render(
      <AuthWrapper>
        <div>Content</div>
      </AuthWrapper>
    );

    const flex = screen.getByTestId('flex');
    expect(flex).toHaveClass('auth-wrapper');
  });

  it('should render container with md maxWidth', () => {
    render(
      <AuthWrapper>
        <div>Content</div>
      </AuthWrapper>
    );

    const container = screen.getByTestId('container');
    expect(container).toHaveAttribute('data-maxw', 'md');
  });

  it('should render both mainContent and cancelContent together', () => {
    render(
      <AuthWrapper
        mainContent={<form data-testid="login-form">Login Form</form>}
        cancelContent={<a href="/register">Create account</a>}
      />
    );

    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.getByText('Create account')).toBeInTheDocument();
  });

  it('should render empty when no content provided', () => {
    render(<AuthWrapper />);

    // Should still render the wrapper structure
    expect(screen.getByTestId('flex')).toBeInTheDocument();
    expect(screen.getByTestId('container')).toBeInTheDocument();
    expect(screen.getByTestId('stack')).toBeInTheDocument();
  });

  it('should render complex content structures', () => {
    render(
      <AuthWrapper
        mainContent={
          <div>
            <h1 data-testid="title">Welcome</h1>
            <form data-testid="form">
              <input type="text" placeholder="Username" />
              <button type="submit">Submit</button>
            </form>
          </div>
        }
        cancelContent={
          <div>
            <span>Already have an account?</span>
            <a href="/login">Log in</a>
          </div>
        }
      />
    );

    expect(screen.getByTestId('title')).toBeInTheDocument();
    expect(screen.getByTestId('form')).toBeInTheDocument();
    expect(screen.getByText('Already have an account?')).toBeInTheDocument();
    expect(screen.getByText('Log in')).toBeInTheDocument();
  });

  // v2.0.0: enableLocalLogin feature tests
  describe('enableLocalLogin prop (v2.0.0)', () => {
    it('should render content when enableLocalLogin is true', () => {
      render(
        <AuthWrapper enableLocalLogin={true}>
          <div data-testid="login-content">Login Form</div>
        </AuthWrapper>
      );

      expect(screen.getByTestId('login-content')).toBeInTheDocument();
    });

    it('should show disabled message when enableLocalLogin is false', () => {
      render(
        <AuthWrapper enableLocalLogin={false}>
          <div data-testid="login-content">Login Form</div>
        </AuthWrapper>
      );

      expect(screen.queryByTestId('login-content')).not.toBeInTheDocument();
      expect(screen.getByText('Local login is disabled. Please use an external login provider.')).toBeInTheDocument();
    });

    it('should not render mainContent when enableLocalLogin is false', () => {
      render(
        <AuthWrapper
          enableLocalLogin={false}
          mainContent={<div data-testid="main-content">Main</div>}
          cancelContent={<div data-testid="cancel-content">Cancel</div>}
        />
      );

      expect(screen.queryByTestId('main-content')).not.toBeInTheDocument();
      expect(screen.queryByTestId('cancel-content')).not.toBeInTheDocument();
    });

    it('should still render wrapper structure when local login is disabled', () => {
      render(<AuthWrapper enableLocalLogin={false} />);

      expect(screen.getByTestId('flex')).toBeInTheDocument();
      expect(screen.getByTestId('flex')).toHaveClass('auth-wrapper');
      expect(screen.getByTestId('container')).toBeInTheDocument();
    });
  });

  describe('enableLocalLogin from ABP settings (v2.0.0)', () => {
    it('should enable local login when setting is undefined', () => {
      mockLocalLoginSetting = undefined;

      render(
        <AuthWrapper>
          <div data-testid="login-content">Login Form</div>
        </AuthWrapper>
      );

      expect(screen.getByTestId('login-content')).toBeInTheDocument();
    });

    it('should enable local login when setting is null', () => {
      mockLocalLoginSetting = null;

      render(
        <AuthWrapper>
          <div data-testid="login-content">Login Form</div>
        </AuthWrapper>
      );

      expect(screen.getByTestId('login-content')).toBeInTheDocument();
    });

    it('should enable local login when setting is "true"', () => {
      mockLocalLoginSetting = 'true';

      render(
        <AuthWrapper>
          <div data-testid="login-content">Login Form</div>
        </AuthWrapper>
      );

      expect(screen.getByTestId('login-content')).toBeInTheDocument();
    });

    it('should enable local login when setting is "True" (case insensitive)', () => {
      mockLocalLoginSetting = 'True';

      render(
        <AuthWrapper>
          <div data-testid="login-content">Login Form</div>
        </AuthWrapper>
      );

      expect(screen.getByTestId('login-content')).toBeInTheDocument();
    });

    it('should disable local login when setting is "false"', () => {
      mockLocalLoginSetting = 'false';

      render(
        <AuthWrapper>
          <div data-testid="login-content">Login Form</div>
        </AuthWrapper>
      );

      expect(screen.queryByTestId('login-content')).not.toBeInTheDocument();
      expect(screen.getByText('Local login is disabled. Please use an external login provider.')).toBeInTheDocument();
    });

    it('should disable local login when setting is "False" (case insensitive)', () => {
      mockLocalLoginSetting = 'False';

      render(
        <AuthWrapper>
          <div data-testid="login-content">Login Form</div>
        </AuthWrapper>
      );

      expect(screen.queryByTestId('login-content')).not.toBeInTheDocument();
    });

    it('prop should override setting value (prop=true, setting=false)', () => {
      mockLocalLoginSetting = 'false';

      render(
        <AuthWrapper enableLocalLogin={true}>
          <div data-testid="login-content">Login Form</div>
        </AuthWrapper>
      );

      expect(screen.getByTestId('login-content')).toBeInTheDocument();
    });

    it('prop should override setting value (prop=false, setting=true)', () => {
      mockLocalLoginSetting = 'true';

      render(
        <AuthWrapper enableLocalLogin={false}>
          <div data-testid="login-content">Login Form</div>
        </AuthWrapper>
      );

      expect(screen.queryByTestId('login-content')).not.toBeInTheDocument();
    });
  });

  // v2.7.0: Component key tests
  describe('tenantBoxKey static property (v2.7.0)', () => {
    it('should have tenantBoxKey static property', () => {
      expect(AuthWrapper.tenantBoxKey).toBeDefined();
    });

    it('should have tenantBoxKey matching eAccountComponents.TenantBox', () => {
      expect(AuthWrapper.tenantBoxKey).toBe('Account.TenantBoxComponent');
    });
  });

  // v2.4.0: isMultiTenancyEnabled prop tests
  describe('isMultiTenancyEnabled prop (v2.4.0)', () => {
    it('should have isMultiTenancyEnabled default to true', () => {
      // The prop defaults to true, so content should render normally
      render(
        <AuthWrapper>
          <div data-testid="content">Content</div>
        </AuthWrapper>
      );

      // Content should be visible when multi-tenancy is enabled (default)
      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('should render content when isMultiTenancyEnabled is true', () => {
      render(
        <AuthWrapper isMultiTenancyEnabled={true}>
          <div data-testid="content">Content</div>
        </AuthWrapper>
      );

      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('should render content when isMultiTenancyEnabled is false', () => {
      // Note: isMultiTenancyEnabled doesn't hide content, it's used by parent
      // components to decide whether to show TenantBox
      render(
        <AuthWrapper isMultiTenancyEnabled={false}>
          <div data-testid="content">Content</div>
        </AuthWrapper>
      );

      // Content should still render - isMultiTenancyEnabled controls TenantBox visibility externally
      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('should work with both enableLocalLogin and isMultiTenancyEnabled props', () => {
      render(
        <AuthWrapper enableLocalLogin={true} isMultiTenancyEnabled={true}>
          <div data-testid="content">Content</div>
        </AuthWrapper>
      );

      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('should respect enableLocalLogin=false even when isMultiTenancyEnabled=true', () => {
      render(
        <AuthWrapper enableLocalLogin={false} isMultiTenancyEnabled={true}>
          <div data-testid="content">Content</div>
        </AuthWrapper>
      );

      // enableLocalLogin=false should show disabled message
      expect(screen.queryByTestId('content')).not.toBeInTheDocument();
      expect(screen.getByText('Local login is disabled. Please use an external login provider.')).toBeInTheDocument();
    });

    it('should render with all content props and isMultiTenancyEnabled', () => {
      render(
        <AuthWrapper
          isMultiTenancyEnabled={true}
          mainContent={<div data-testid="main">Main</div>}
          cancelContent={<div data-testid="cancel">Cancel</div>}
        />
      );

      expect(screen.getByTestId('main')).toBeInTheDocument();
      expect(screen.getByTestId('cancel')).toBeInTheDocument();
    });
  });
});
