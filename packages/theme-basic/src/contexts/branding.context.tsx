import React, {
  createContext,
  useContext,
  useMemo,
  ReactNode,
} from 'react';

/**
 * Branding configuration for the application.
 * Allows customization of logo, brand name, and related visual elements.
 */
export interface BrandingConfig {
  /** Full logo component (used in expanded sidebar) */
  logo?: ReactNode;
  /** Icon-only logo (used in mobile navbar or collapsed sidebar) */
  logoIcon?: ReactNode;
  /** Brand/application name (fallback when no logo provided) */
  appName?: string;
  /** Link destination when clicking the logo */
  logoLink?: string;
}

/**
 * Context value for branding configuration.
 */
export interface BrandingContextValue {
  /** Current branding configuration */
  config: BrandingConfig;
}

const defaultConfig: BrandingConfig = {
  appName: 'ABP Application',
  logoLink: '/',
};

const BrandingContext = createContext<BrandingContextValue>({
  config: defaultConfig,
});

export interface BrandingProviderProps {
  children: ReactNode;
  /** Custom logo component for the sidebar */
  logo?: ReactNode;
  /** Icon-only logo for mobile/collapsed views */
  logoIcon?: ReactNode;
  /** Application name (used as fallback if no logo provided) */
  appName?: string;
  /** Link destination when clicking the logo (default: '/') */
  logoLink?: string;
}

/**
 * Provider component for branding configuration.
 * Allows setting logo and brand name at the application level.
 *
 * @example
 * ```tsx
 * // With custom logo component
 * <BrandingProvider logo={<MyCustomLogo />} appName="My App">
 *   <App />
 * </BrandingProvider>
 * ```
 *
 * @example
 * ```tsx
 * // With separate full and icon logos
 * <BrandingProvider
 *   logo={<FullLogo />}
 *   logoIcon={<IconOnlyLogo />}
 *   appName="My App"
 * >
 *   <App />
 * </BrandingProvider>
 * ```
 */
export function BrandingProvider({
  children,
  logo,
  logoIcon,
  appName,
  logoLink,
}: BrandingProviderProps): React.ReactElement {
  const config = useMemo<BrandingConfig>(
    () => ({
      logo,
      logoIcon: logoIcon || logo, // Fallback to full logo if icon not provided
      appName: appName || defaultConfig.appName,
      logoLink: logoLink || defaultConfig.logoLink,
    }),
    [logo, logoIcon, appName, logoLink]
  );

  const contextValue = useMemo<BrandingContextValue>(
    () => ({ config }),
    [config]
  );

  return (
    <BrandingContext.Provider value={contextValue}>
      {children}
    </BrandingContext.Provider>
  );
}

/**
 * Hook to access the branding configuration.
 */
export function useBranding(): BrandingConfig {
  return useContext(BrandingContext).config;
}

/**
 * Hook to get the appropriate logo based on context.
 * @param preferIcon - If true, returns iconLogo when available
 */
export function useLogo(preferIcon = false): ReactNode {
  const { logo, logoIcon, appName } = useBranding();

  if (preferIcon && logoIcon) {
    return logoIcon;
  }

  return logo || appName;
}
