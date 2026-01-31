import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeBasicProvider, defaultThemeBasicConfig } from '../providers/ThemeBasicProvider';

// Mock @abpjs/core
vi.mock('@abpjs/core', () => ({
  useSession: vi.fn(() => ({ language: 'en-US' })),
  useDirection: vi.fn(() => ({ direction: 'ltr', isRtl: false })),
}));

// Mock @abpjs/theme-shared
vi.mock('@abpjs/theme-shared', () => ({
  ThemeSharedProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-shared-provider">{children}</div>
  ),
  defineConfig: vi.fn((config) => config),
}));

describe('ThemeBasicProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset document attributes
    document.documentElement.dir = '';
    document.documentElement.lang = '';
  });

  describe('basic rendering', () => {
    it('should render children', () => {
      render(
        <ThemeBasicProvider>
          <div data-testid="child">Child Content</div>
        </ThemeBasicProvider>
      );

      expect(screen.getByTestId('child')).toHaveTextContent('Child Content');
    });

    it('should render ThemeSharedProvider', () => {
      render(
        <ThemeBasicProvider>
          <div>Content</div>
        </ThemeBasicProvider>
      );

      expect(screen.getByTestId('theme-shared-provider')).toBeInTheDocument();
    });
  });

  describe('props', () => {
    it('should use default props when not specified', () => {
      render(
        <ThemeBasicProvider>
          <div data-testid="child">Content</div>
        </ThemeBasicProvider>
      );

      // Just verify the component renders without errors
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should accept custom renderToasts prop', () => {
      render(
        <ThemeBasicProvider renderToasts={false}>
          <div data-testid="child">Content</div>
        </ThemeBasicProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should accept custom renderConfirmation prop', () => {
      render(
        <ThemeBasicProvider renderConfirmation={false}>
          <div data-testid="child">Content</div>
        </ThemeBasicProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should accept custom toastPosition prop', () => {
      render(
        <ThemeBasicProvider toastPosition="top-right">
          <div data-testid="child">Content</div>
        </ThemeBasicProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should accept enableColorMode prop', () => {
      render(
        <ThemeBasicProvider enableColorMode={true}>
          <div data-testid="child">Content</div>
        </ThemeBasicProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should accept defaultColorMode prop', () => {
      render(
        <ThemeBasicProvider defaultColorMode="dark">
          <div data-testid="child">Content</div>
        </ThemeBasicProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should accept logo prop', () => {
      render(
        <ThemeBasicProvider logo={<span>Logo</span>}>
          <div data-testid="child">Content</div>
        </ThemeBasicProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should accept logoIcon prop', () => {
      render(
        <ThemeBasicProvider logoIcon={<span>Icon</span>}>
          <div data-testid="child">Content</div>
        </ThemeBasicProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should accept appName prop', () => {
      render(
        <ThemeBasicProvider appName="Test App">
          <div data-testid="child">Content</div>
        </ThemeBasicProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should accept logoLink prop', () => {
      render(
        <ThemeBasicProvider logoLink="/home">
          <div data-testid="child">Content</div>
        </ThemeBasicProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('should accept custom themeOverrides', () => {
      const customTheme = { theme: { tokens: { colors: {} } } };
      render(
        <ThemeBasicProvider themeOverrides={customTheme}>
          <div data-testid="child">Content</div>
        </ThemeBasicProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });
  });

  describe('locale synchronization', () => {
    it('should set document direction and lang', () => {
      // Default mock returns ltr and en-US
      render(
        <ThemeBasicProvider>
          <div>Content</div>
        </ThemeBasicProvider>
      );

      expect(document.documentElement.dir).toBe('ltr');
      expect(document.documentElement.lang).toBe('en-US');
    });
  });
});

describe('defaultThemeBasicConfig', () => {
  it('should define brand colors', () => {
    expect(defaultThemeBasicConfig).toBeDefined();
    expect(defaultThemeBasicConfig.theme).toBeDefined();
    expect(defaultThemeBasicConfig.theme.tokens).toBeDefined();
    expect(defaultThemeBasicConfig.theme.tokens.colors).toBeDefined();
    expect(defaultThemeBasicConfig.theme.tokens.colors.brand).toBeDefined();
  });

  it('should have brand color scale from 50 to 950', () => {
    const brandColors = defaultThemeBasicConfig.theme.tokens.colors.brand;
    expect(brandColors['50']).toBeDefined();
    expect(brandColors['500']).toBeDefined();
    expect(brandColors['950']).toBeDefined();
  });

  it('should define semantic tokens', () => {
    expect(defaultThemeBasicConfig.theme.semanticTokens).toBeDefined();
    expect(defaultThemeBasicConfig.theme.semanticTokens.colors).toBeDefined();
    expect(defaultThemeBasicConfig.theme.semanticTokens.colors.brand).toBeDefined();
  });

  it('should define globalCss', () => {
    expect(defaultThemeBasicConfig.globalCss).toBeDefined();
    expect(defaultThemeBasicConfig.globalCss['html, body']).toBeDefined();
    expect(defaultThemeBasicConfig.globalCss['html, body'].colorPalette).toBe('brand');
  });
});
