/**
 * Theme basic component key constants.
 * Used for component replacement/customization in the theme system.
 *
 * @since 2.7.0
 * @updated 3.0.0 - Added CurrentUser and Languages component keys
 */
export const eThemeBasicComponents = {
  ApplicationLayout: 'Theme.ApplicationLayoutComponent',
  AccountLayout: 'Theme.AccountLayoutComponent',
  EmptyLayout: 'Theme.EmptyLayoutComponent',
  Logo: 'Theme.LogoComponent',
  Routes: 'Theme.RoutesComponent',
  NavItems: 'Theme.NavItemsComponent',
  /**
   * Component key for the current user nav item.
   * @since 3.0.0
   */
  CurrentUser: 'Theme.CurrentUserComponent',
  /**
   * Component key for the languages nav item.
   * @since 3.0.0
   */
  Languages: 'Theme.LanguagesComponent',
} as const;

/**
 * Type for eThemeBasicComponents values
 */
export type eThemeBasicComponents =
  (typeof eThemeBasicComponents)[keyof typeof eThemeBasicComponents];
