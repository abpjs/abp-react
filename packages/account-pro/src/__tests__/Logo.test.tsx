import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Logo } from '../components/Logo';

// Mock useConfig hook
vi.mock('@abpjs/core', () => ({
  useConfig: vi.fn(() => ({
    localization: {
      currentCulture: {
        displayName: 'Test App',
      },
      defaultResourceName: 'DefaultResource',
    },
  })),
}));

// Mock Chakra UI components
vi.mock('@chakra-ui/react', () => ({
  Box: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="box">{children}</div>
  ),
  Image: ({
    src,
    alt,
    maxW,
    maxH,
  }: {
    src: string;
    alt: string;
    maxW: string;
    maxH: string;
  }) => (
    <img
      src={src}
      alt={alt}
      data-max-width={maxW}
      data-max-height={maxH}
      data-testid="logo-image"
    />
  ),
  Text: ({
    children,
    fontSize,
    fontWeight,
  }: {
    children: React.ReactNode;
    fontSize: string;
    fontWeight: string;
  }) => (
    <span data-fontsize={fontSize} data-fontweight={fontWeight} data-testid="logo-text">
      {children}
    </span>
  ),
}));

describe('Logo (v2.9.0)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('default behavior', () => {
    it('should render application name from config when no props provided', () => {
      render(<Logo />);

      expect(screen.getByTestId('logo-text')).toBeInTheDocument();
      expect(screen.getByText('Test App')).toBeInTheDocument();
    });

    it('should have correct default text styling', () => {
      render(<Logo />);

      const textElement = screen.getByTestId('logo-text');
      expect(textElement).toHaveAttribute('data-fontsize', 'xl');
      expect(textElement).toHaveAttribute('data-fontweight', 'bold');
    });
  });

  describe('with logoUrl', () => {
    it('should render image when logoUrl is provided', () => {
      render(<Logo logoUrl="/assets/logo.png" />);

      expect(screen.getByTestId('logo-image')).toBeInTheDocument();
      expect(screen.getByTestId('logo-image')).toHaveAttribute('src', '/assets/logo.png');
    });

    it('should use default alt text when not provided', () => {
      render(<Logo logoUrl="/assets/logo.png" />);

      expect(screen.getByTestId('logo-image')).toHaveAttribute('alt', 'Logo');
    });

    it('should use custom alt text when provided', () => {
      render(<Logo logoUrl="/assets/logo.png" alt="Custom Logo" />);

      expect(screen.getByTestId('logo-image')).toHaveAttribute('alt', 'Custom Logo');
    });

    it('should use default max dimensions when not provided', () => {
      render(<Logo logoUrl="/assets/logo.png" />);

      const image = screen.getByTestId('logo-image');
      expect(image).toHaveAttribute('data-max-width', '150px');
      expect(image).toHaveAttribute('data-max-height', '50px');
    });

    it('should use custom max dimensions when provided', () => {
      render(<Logo logoUrl="/assets/logo.png" maxWidth="200px" maxHeight="80px" />);

      const image = screen.getByTestId('logo-image');
      expect(image).toHaveAttribute('data-max-width', '200px');
      expect(image).toHaveAttribute('data-max-height', '80px');
    });
  });

  describe('with children', () => {
    it('should render children instead of default logo', () => {
      render(
        <Logo>
          <div data-testid="custom-logo">Custom Logo Content</div>
        </Logo>
      );

      expect(screen.getByTestId('custom-logo')).toBeInTheDocument();
      expect(screen.getByText('Custom Logo Content')).toBeInTheDocument();
    });

    it('should prioritize children over logoUrl', () => {
      render(
        <Logo logoUrl="/assets/logo.png">
          <div data-testid="custom-logo">Custom Logo</div>
        </Logo>
      );

      expect(screen.getByTestId('custom-logo')).toBeInTheDocument();
      expect(screen.queryByTestId('logo-image')).not.toBeInTheDocument();
    });
  });

  describe('fallback behavior', () => {
    it('should use defaultResourceName when currentCulture is not available', async () => {
      const { useConfig } = await import('@abpjs/core');
      vi.mocked(useConfig).mockReturnValue({
        localization: {
          currentCulture: undefined,
          defaultResourceName: 'FallbackResource',
        },
      } as ReturnType<typeof useConfig>);

      render(<Logo />);

      expect(screen.getByText('FallbackResource')).toBeInTheDocument();
    });

    it('should use ABP as default when no localization config', async () => {
      const { useConfig } = await import('@abpjs/core');
      vi.mocked(useConfig).mockReturnValue({
        localization: undefined,
      } as ReturnType<typeof useConfig>);

      render(<Logo />);

      expect(screen.getByText('ABP')).toBeInTheDocument();
    });
  });

  describe('component replacement', () => {
    it('should have correct componentKey for component replacement', () => {
      expect(Logo.componentKey).toBe('Account.LogoComponent');
    });
  });

  describe('wrapper element', () => {
    it('should always wrap content in a Box', () => {
      render(<Logo />);

      expect(screen.getByTestId('box')).toBeInTheDocument();
    });

    it('should wrap image in a Box', () => {
      render(<Logo logoUrl="/assets/logo.png" />);

      expect(screen.getByTestId('box')).toBeInTheDocument();
    });

    it('should wrap children in a Box', () => {
      render(
        <Logo>
          <span>Custom</span>
        </Logo>
      );

      expect(screen.getByTestId('box')).toBeInTheDocument();
    });
  });
});
