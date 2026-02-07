/**
 * @abpjs/theme-basic
 *
 * ABP Framework Theme Basic components for React.
 * Translated from @abp/ng.theme.basic v4.0.0
 *
 * This package provides the basic theme layout components for ABP React applications.
 *
 * Changes in v4.0.0:
 * - LogoComponent: Angular now uses EnvironmentService + ApplicationInfo instead of Store + Config.Application
 *   (React: no change needed, uses useBranding() context which already abstracts data source)
 * - CurrentUserComponent: Angular now uses ConfigStateService + EnvironmentService + CurrentUserDto
 *   (React: no change needed, already uses useConfig() + useAuth() hooks)
 * - LanguagesComponent: Angular now uses SessionStateService + ConfigStateService + LanguageInfo
 *   (React: updated type from deprecated ApplicationConfiguration.Language to LanguageInfo)
 * - RoutesComponent: Angular renamed 'routes' property to 'routesService'
 *   (React: no change needed, uses useConfig().routes hook)
 * - Dependency update to @abp/ng.theme.shared v4.0.0
 *
 * Changes in v3.2.0:
 * - Reduced .abp-loading background opacity from 0.1 to 0.05 for better UX
 * - Angular: RoutesComponent added closeDropdown() method (React handles via state/events)
 * - Angular: StylesProvider now uses ReplaceableComponentsService instead of Store (React uses hooks)
 * - Dependency update to @abp/ng.theme.shared v3.2.0
 *
 * Changes in v3.0.0:
 * - Added CurrentUserComponent and LanguagesComponent as public API components
 * - Added nav-item.provider and styles.provider for initialization
 * - Added BASIC_THEME_NAV_ITEM_PROVIDERS and BASIC_THEME_STYLES_PROVIDERS
 * - Added eThemeBasicComponents.CurrentUser and eThemeBasicComponents.Languages
 * - NavItemsComponent now uses NavItemsService from @abpjs/theme-shared
 * - Deprecated eNavigationElementNames (use NavItemsService instead)
 * - Deprecated LayoutStateService (use NavItemsService instead)
 * - Added bordered .datatable-body-row styles
 * - Dependency update to @abp/ng.theme.shared v3.0.0
 *
 * Changes in v2.9.0:
 * - Removed isDropdownChildDynamic from ApplicationLayoutComponent
 * - Removed isDropdownChildDynamic and openChange from RoutesComponent
 * - Angular: Added RTL support styles for dropdown menus (already supported via Chakra UI)
 * - Angular: Changed media query breakpoint from 768px to 992px (uses Chakra breakpoints)
 * - Dependency update to @abp/ng.theme.shared v2.9.0
 *
 * Changes in v2.7.0:
 * - Added eThemeBasicComponents enum for component replacement keys
 * - Added eNavigationElementNames enum for built-in navigation element names
 * - Added LogoComponent public API component
 * - Added NavItemsComponent public API component
 * - Added RoutesComponent public API component
 * - Added LayoutStateService (useLayoutStateService hook)
 * - ApplicationLayoutComponent now exposes component keys (logoComponentKey, routesComponentKey, navItemsComponentKey)
 * - Dependency update to @abp/ng.theme.shared v2.7.0
 *
 * Changes in v2.4.0:
 * - Angular: InitialService now uses DomInsertionService instead of LazyLoadService
 * - Angular: appendStyle() now returns void instead of Observable<void>
 * - Dependency update to @abp/ng.theme.shared v2.4.0
 * - No impact on React translation (styles handled via Chakra UI)
 *
 * Changes in v2.2.0:
 * - Angular: Added .ui-table .pagination-wrapper styles (handled by Chakra UI in React)
 * - Dependency update to @abp/ng.theme.shared v2.2.0
 * - No functional code changes
 *
 * @version 4.0.0
 * @since 2.0.0 - Removed legacy .abp-confirm styles (no impact on React - we use Chakra UI)
 * @since 2.1.0 - Angular: OAuthService replaced with AuthService (already using useAuth in React)
 *              - Angular: Added styles for loading, modal-backdrop, confirmation (handled by Chakra UI)
 */

// Models
export * from './models';

// Enums (v2.7.0+)
export * from './enums';

// Services (v2.7.0+)
export * from './services';

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
