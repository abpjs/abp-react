/**
 * Tests for LogoComponent v2.7.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { LogoComponent } from '../components/logo';
import { BrandingProvider } from '../contexts/branding.context';

// Mock Chakra UI
vi.mock('@chakra-ui/react', () => ({
  Box: ({ children, asChild, ...props }: any) => (
    <div data-testid="box" {...props}>
      {children}
    </div>
  ),
  Text: ({ children, ...props }: any) => <span {...props}>{children}</span>,
}));

describe('LogoComponent', () => {
  const renderWithProviders = (
    ui: React.ReactElement,
    brandingProps?: {
      logo?: React.ReactNode;
      appName?: string;
      logoLink?: string;
    }
  ) => {
    return render(
      <MemoryRouter>
        <BrandingProvider {...brandingProps}>{ui}</BrandingProvider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render with default app name when no custom branding provided', () => {
      renderWithProviders(<LogoComponent />);

      // Default appName is 'ABP Application' from branding context
      expect(screen.getByText('ABP Application')).toBeInTheDocument();
    });

    it('should render app name as text when appName is provided', () => {
      renderWithProviders(<LogoComponent />, { appName: 'My Application' });

      expect(screen.getByText('My Application')).toBeInTheDocument();
    });

    it('should render custom logo when logo prop is provided', () => {
      const CustomLogo = () => <div data-testid="custom-logo">Custom Logo</div>;
      renderWithProviders(<LogoComponent />, { logo: <CustomLogo /> });

      expect(screen.getByTestId('custom-logo')).toBeInTheDocument();
    });

    it('should prefer logo over appName when both are provided', () => {
      const CustomLogo = () => <div data-testid="custom-logo">Custom Logo</div>;
      renderWithProviders(<LogoComponent />, {
        logo: <CustomLogo />,
        appName: 'My App',
      });

      expect(screen.getByTestId('custom-logo')).toBeInTheDocument();
      expect(screen.queryByText('My App')).not.toBeInTheDocument();
    });
  });

  describe('link behavior', () => {
    it('should link to "/" by default', () => {
      renderWithProviders(<LogoComponent />);

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/');
    });

    it('should use branding logoLink when provided', () => {
      renderWithProviders(<LogoComponent />, { logoLink: '/dashboard' });

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/dashboard');
    });

    it('should use linkTo prop over branding logoLink', () => {
      renderWithProviders(<LogoComponent linkTo="/custom-path" />, {
        logoLink: '/dashboard',
      });

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/custom-path');
    });
  });

  describe('styling', () => {
    it('should pass style prop to the Box container', () => {
      const customStyle = { marginTop: '10px' };
      renderWithProviders(<LogoComponent style={customStyle} />);

      const box = screen.getByTestId('box');
      expect(box).toHaveStyle({ marginTop: '10px' });
    });
  });

  describe('edge cases', () => {
    it('should handle empty appName by falling back to default appName from context', () => {
      // BrandingProvider has default appName of 'ABP Application'
      // Even if we pass empty string, the provider uses default
      renderWithProviders(<LogoComponent />, { appName: '' });

      // Empty string is falsy, provider falls back to 'ABP Application'
      expect(screen.getByText('ABP Application')).toBeInTheDocument();
    });

    it('should handle undefined logo by using appName', () => {
      renderWithProviders(<LogoComponent />, {
        logo: undefined,
        appName: 'Test App',
        logoLink: undefined,
      });

      // Should render appName and link to "/"
      expect(screen.getByText('Test App')).toBeInTheDocument();
      expect(screen.getByRole('link')).toHaveAttribute('href', '/');
    });
  });
});
