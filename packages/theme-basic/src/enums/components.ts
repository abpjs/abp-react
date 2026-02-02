/**
 * Theme basic component key constants.
 * Used for component replacement/customization in the theme system.
 *
 * @since 2.7.0
 */
export const eThemeBasicComponents = {
  ApplicationLayout: 'Theme.ApplicationLayoutComponent',
  AccountLayout: 'Theme.AccountLayoutComponent',
  EmptyLayout: 'Theme.EmptyLayoutComponent',
  Logo: 'Theme.LogoComponent',
  Routes: 'Theme.RoutesComponent',
  NavItems: 'Theme.NavItemsComponent',
} as const;

/**
 * Type for eThemeBasicComponents values
 */
export type eThemeBasicComponents =
  (typeof eThemeBasicComponents)[keyof typeof eThemeBasicComponents];
