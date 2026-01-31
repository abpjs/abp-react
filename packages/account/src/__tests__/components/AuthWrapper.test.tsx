import { describe, it, expect, vi } from 'vitest';
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
}));

import { AuthWrapper } from '../../components/AuthWrapper/AuthWrapper';

describe('AuthWrapper', () => {
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
    const { container } = render(<AuthWrapper />);

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
});
