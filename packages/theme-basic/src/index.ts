/**
 * @abpjs/theme-basic
 *
 * ABP Framework Theme Basic components for React.
 * Translated from @abp/ng.theme.basic v2.1.0
 *
 * This package provides the basic theme layout components for ABP React applications.
 *
 * @version 2.1.0
 * @since 2.0.0 - Removed legacy .abp-confirm styles (no impact on React - we use Chakra UI)
 * @since 2.1.0 - Angular: OAuthService replaced with AuthService (already using useAuth in React)
 *              - Angular: Added styles for loading, modal-backdrop, confirmation (handled by Chakra UI)
 */

// Models
export * from './models';

// Contexts - export specific items to avoid naming conflicts with Layout namespace
export {
  LayoutProvider,
  useLayoutContext,
  useLayoutService,
  useNavigationElements,
  BrandingProvider,
  useBranding,
  useLogo,
} from './contexts';
export type {
  LayoutService,
  LayoutContextValue,
  LayoutProviderProps,
  BrandingConfig,
  BrandingContextValue,
  BrandingProviderProps,
} from './contexts';

// Hooks
export * from './hooks';

// Components
export * from './components';

// Providers
export * from './providers';

// Re-export layout components with LAYOUTS constant for compatibility
import { LayoutApplication } from './components/layout-application';
import { LayoutAccount } from './components/layout-account';
import { LayoutEmpty } from './components/layout-empty';

/**
 * Array of layout components for use with ABP's dynamic layout system.
 * Matches the Angular LAYOUTS constant.
 */
export const LAYOUTS = [LayoutApplication, LayoutAccount, LayoutEmpty];
