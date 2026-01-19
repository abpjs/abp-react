import React, { ReactNode, useEffect } from 'react';
import { ThemeSharedProvider, defineConfig, ThemeOverride } from '@abpjs/theme-shared';
import { useSession, useDirection } from '@abpjs/core';
import { LayoutProvider } from '../contexts/layout.context';
import { BrandingProvider } from '../contexts/branding.context';

/**
 * Inner component that handles locale/RTL synchronization.
 * This component reads the current language from session and updates
 * the document direction and LocaleProvider accordingly.
 */
function LocaleSync({ children }: { children: ReactNode }) {
  const { language } = useSession();
  const { direction } = useDirection();

  // Update document direction when language changes
  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language || 'en';
  }, [direction, language]);

  return <>{children}</>;
}

/**
 * Props for the inner theme provider that has access to session context
 */
interface ThemeBasicInnerProps extends Omit<ThemeBasicProviderProps, 'children'> {
  children: ReactNode;
  mergedThemeOverrides: ThemeOverride;
}

/**
 * Inner provider component that can access useSession for locale.
 * ThemeSharedProvider must be rendered here so LocaleProvider gets the correct locale.
 */
function ThemeBasicInner({
  children,
  renderToasts,
  renderConfirmation,
  toastPosition,
  mergedThemeOverrides,
  enableColorMode,
  defaultColorMode,
  logo,
  logoIcon,
  appName,
  logoLink,
}: ThemeBasicInnerProps): React.ReactElement {
  const { language } = useSession();

  // Convert language code to locale format (e.g., 'ar' -> 'ar-SA', 'en' -> 'en-US')
  const locale = language || 'en-US';

  return (
    <ThemeSharedProvider
      renderToasts={renderToasts}
      renderConfirmation={renderConfirmation}
      toastPosition={toastPosition}
      themeOverrides={mergedThemeOverrides}
      enableColorMode={enableColorMode}
      defaultColorMode={defaultColorMode}
      locale={locale}
    >
      <LocaleSync>
        <BrandingProvider
          logo={logo}
          logoIcon={logoIcon}
          appName={appName}
          logoLink={logoLink}
        >
          <LayoutProvider>{children}</LayoutProvider>
        </BrandingProvider>
      </LocaleSync>
    </ThemeSharedProvider>
  );
}

/**
 * Props for ThemeBasicProvider
 */
export interface ThemeBasicProviderProps {
  /** Child components to render */
  children: ReactNode;
  /** Whether to render toast notifications automatically */
  renderToasts?: boolean;
  /** Whether to render confirmation dialog automatically */
  renderConfirmation?: boolean;
  /** Custom theme overrides for Chakra UI (use defineConfig from @abpjs/theme-shared) */
  themeOverrides?: ThemeOverride;
  /** Position for toast notifications */
  toastPosition?: 'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' | 'bottom-left';
  /** Enable color mode support (light/dark theme switching) */
  enableColorMode?: boolean;
  /** Default color mode when enableColorMode is true */
  defaultColorMode?: 'light' | 'dark' | 'system';
  /** Custom logo component for the sidebar/navbar */
  logo?: ReactNode;
  /** Icon-only logo for mobile/collapsed views */
  logoIcon?: ReactNode;
  /** Application name (used as fallback if no logo provided) */
  appName?: string;
  /** Link destination when clicking the logo (default: '/') */
  logoLink?: string;
}

/**
 * Default theme configuration for theme-basic
 * Uses Chakra v3's defineConfig format with proper light/dark mode support
 */
export const defaultThemeBasicConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#e3f2fd' },
          100: { value: '#bbdefb' },
          200: { value: '#90caf9' },
          300: { value: '#64b5f6' },
          400: { value: '#42a5f5' },
          500: { value: '#2196f3' },
          600: { value: '#1e88e5' },
          700: { value: '#1976d2' },
          800: { value: '#1565c0' },
          900: { value: '#0d47a1' },
          950: { value: '#082f5e' },
        },
      },
    },
    semanticTokens: {
      colors: {
        // Brand colors with light/dark support
        brand: {
          solid: {
            value: { _light: '{colors.brand.500}', _dark: '{colors.brand.400}' },
          },
          contrast: {
            value: { _light: '{colors.white}', _dark: '{colors.white}' },
          },
          fg: {
            value: { _light: '{colors.brand.700}', _dark: '{colors.brand.300}' },
          },
          muted: {
            value: { _light: '{colors.brand.100}', _dark: '{colors.brand.900}' },
          },
          subtle: {
            value: { _light: '{colors.brand.50}', _dark: '{colors.brand.950}' },
          },
          emphasized: {
            value: { _light: '{colors.brand.300}', _dark: '{colors.brand.600}' },
          },
          focusRing: {
            value: { _light: '{colors.brand.500}', _dark: '{colors.brand.400}' },
          },
        },
      },
    },
  },
  globalCss: {
    'html, body': {
      colorPalette: 'brand',
    },
  },
});

/**
 * Root provider for theme-basic.
 * Composes all necessary providers for the basic theme to work.
 *
 * This provider includes:
 * - Chakra UI provider with theme (via ThemeSharedProvider)
 * - ThemeShared provider (toasts, confirmations)
 * - Layout provider (navigation elements state)
 *
 * @example
 * ```tsx
 * import { ThemeBasicProvider } from '@abpjs/theme-basic';
 *
 * function App() {
 *   return (
 *     <ThemeBasicProvider>
 *       <Router>
 *         <Routes>
 *           ...
 *         </Routes>
 *       </Router>
 *     </ThemeBasicProvider>
 *   );
 * }
 * ```
 *
 * @example With custom theme overrides
 * ```tsx
 * import { ThemeBasicProvider, defineConfig } from '@abpjs/theme-basic';
 *
 * const customTheme = defineConfig({
 *   theme: {
 *     tokens: {
 *       colors: {
 *         brand: {
 *           500: { value: '#ff6600' },
 *         },
 *       },
 *     },
 *   },
 * });
 *
 * function App() {
 *   return (
 *     <ThemeBasicProvider themeOverrides={customTheme}>
 *       <Router>
 *         <Routes>
 *           ...
 *         </Routes>
 *       </Router>
 *     </ThemeBasicProvider>
 *   );
 * }
 * ```
 */
export function ThemeBasicProvider({
  children,
  renderToasts = true,
  renderConfirmation = true,
  themeOverrides,
  toastPosition = 'bottom-right',
  enableColorMode = false,
  defaultColorMode = 'light',
  logo,
  logoIcon,
  appName,
  logoLink,
}: ThemeBasicProviderProps): React.ReactElement {
  // Merge default theme-basic config with any custom overrides
  // The themeOverrides will be applied on top of the base ABP theme
  const mergedThemeOverrides = themeOverrides || defaultThemeBasicConfig;

  return (
    <ThemeBasicInner
      renderToasts={renderToasts}
      renderConfirmation={renderConfirmation}
      toastPosition={toastPosition}
      mergedThemeOverrides={mergedThemeOverrides}
      enableColorMode={enableColorMode}
      defaultColorMode={defaultColorMode}
      logo={logo}
      logoIcon={logoIcon}
      appName={appName}
      logoLink={logoLink}
    >
      {children}
    </ThemeBasicInner>
  );
}

// Re-export defineConfig for convenience
export { defineConfig };

export default ThemeBasicProvider;
