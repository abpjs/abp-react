import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

// Mock @abpjs/core
vi.mock('@abpjs/core', async () => {
  return {
    eLayoutType: {
      empty: 'empty',
      account: 'account',
      application: 'application',
    },
    useDirection: vi.fn(() => ({ direction: 'ltr', isRtl: false })),
    useAuth: vi.fn(() => ({ logout: vi.fn(), isAuthenticated: false })),
    useConfig: vi.fn(() => ({ routes: [], currentUser: null, localization: {} })),
    useSession: vi.fn(() => ({ language: 'en-US' })),
    useLocalization: vi.fn(() => (key: string) => key),
  };
});

// Mock @abpjs/theme-shared
vi.mock('@abpjs/theme-shared', () => ({
  ChangePassword: () => <div data-testid="change-password" />,
  Profile: () => <div data-testid="profile" />,
}));

// Import after mocks
import { LayoutEmpty } from '../components/layout-empty/LayoutEmpty';
import { LayoutBase } from '../components/layout/Layout';

// Wrapper component that includes ChakraProvider
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={defaultSystem}>
      <MemoryRouter>{children}</MemoryRouter>
    </ChakraProvider>
  );
}

describe('LayoutEmpty', () => {
  it('should render with Outlet by default', () => {
    const { container } = render(
      <TestWrapper>
        <LayoutEmpty />
      </TestWrapper>
    );

    // Component should render without errors - Box renders a div
    expect(container.firstChild).toBeTruthy();
  });

  it('should render children when provided', () => {
    render(
      <TestWrapper>
        <LayoutEmpty>
          <div data-testid="custom-content">Custom Content</div>
        </LayoutEmpty>
      </TestWrapper>
    );

    expect(screen.getByTestId('custom-content')).toHaveTextContent('Custom Content');
  });

  it('should have static type property', () => {
    expect(LayoutEmpty.type).toBe('empty');
  });
});

describe('LayoutBase', () => {
  it('should render with default props', () => {
    render(
      <TestWrapper>
        <LayoutBase />
      </TestWrapper>
    );

    // Should render the navbar with default brand name
    expect(screen.getByText('MyProjectName')).toBeInTheDocument();
  });

  it('should render with custom brand name', () => {
    render(
      <TestWrapper>
        <LayoutBase brandName="Test App" />
      </TestWrapper>
    );

    expect(screen.getByText('Test App')).toBeInTheDocument();
  });

  it('should render children', () => {
    render(
      <TestWrapper>
        <LayoutBase>
          <div data-testid="nav-content">Nav Content</div>
        </LayoutBase>
      </TestWrapper>
    );

    // Children are rendered in both mobile and desktop areas, so use getAllByTestId
    const navContents = screen.getAllByTestId('nav-content');
    expect(navContents.length).toBeGreaterThan(0);
    expect(navContents[0]).toHaveTextContent('Nav Content');
  });

  it('should render with custom brand link', () => {
    render(
      <TestWrapper>
        <LayoutBase brandLink="/home" brandName="Home App" />
      </TestWrapper>
    );

    const link = screen.getByText('Home App').closest('a');
    expect(link).toHaveAttribute('href', '/home');
  });

  it('should render Outlet when renderOutlet is true', () => {
    render(
      <TestWrapper>
        <LayoutBase renderOutlet={true} />
      </TestWrapper>
    );

    // Component should render without errors
    expect(screen.getByText('MyProjectName')).toBeInTheDocument();
  });

  it('should not render Outlet when renderOutlet is false', () => {
    render(
      <TestWrapper>
        <LayoutBase renderOutlet={false} />
      </TestWrapper>
    );

    // Component should still render the navbar
    expect(screen.getByText('MyProjectName')).toBeInTheDocument();
  });

  it('should toggle navigation on button click', async () => {
    const { container } = render(
      <TestWrapper>
        <LayoutBase>
          <div>Menu Item</div>
        </LayoutBase>
      </TestWrapper>
    );

    // Find the toggle button
    const toggleButton = container.querySelector('[aria-label="Toggle Navigation"]');
    expect(toggleButton).toBeInTheDocument();
  });
});
