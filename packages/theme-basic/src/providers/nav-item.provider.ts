/**
 * Nav Item Provider
 * Translated from @abp/ng.theme.basic/lib/providers/nav-item.provider.ts v3.0.0
 *
 * Provides nav item configuration for the theme-basic module.
 * Uses NavItemsService from @abpjs/theme-shared to register nav items.
 *
 * @since 3.0.0
 */

import { NavItemsService, getNavItemsService } from '@abpjs/theme-shared';
import { CurrentUserComponent } from '../components/nav-items/CurrentUserComponent';
import { LanguagesComponent } from '../components/nav-items/LanguagesComponent';
import { eThemeBasicComponents } from '../enums/components';

/**
 * Configures the basic theme nav items.
 * This function is called during app initialization to register
 * the default nav items (Languages and CurrentUser).
 *
 * @param navItems - The NavItemsService instance
 * @returns A function that performs the nav item configuration
 * @since 3.0.0
 */
export function configureNavItems(navItems: NavItemsService): () => void {
  return () => {
    navItems.addItems([
      {
        id: eThemeBasicComponents.Languages,
        component: LanguagesComponent,
        order: 100,
      },
      {
        id: eThemeBasicComponents.CurrentUser,
        component: CurrentUserComponent,
        order: 200,
      },
    ]);
  };
}

/**
 * Basic theme nav item providers for initialization.
 * Use this in your app setup to configure theme-basic nav items.
 *
 * In React, you typically call this during app initialization:
 *
 * @example
 * ```tsx
 * import { initializeThemeBasicNavItems } from '@abpjs/theme-basic';
 *
 * // In your app initialization
 * initializeThemeBasicNavItems();
 * ```
 *
 * @since 3.0.0
 */
export const BASIC_THEME_NAV_ITEM_PROVIDERS = {
  configureNavItems,
};

/**
 * Initialize theme basic nav items.
 * Call this function during app initialization to register the
 * default Languages and CurrentUser nav items.
 *
 * @since 3.0.0
 *
 * @example
 * ```tsx
 * import { initializeThemeBasicNavItems } from '@abpjs/theme-basic';
 *
 * // Call once during app initialization
 * initializeThemeBasicNavItems();
 * ```
 */
export function initializeThemeBasicNavItems(): void {
  const navItemsService = getNavItemsService();
  configureNavItems(navItemsService)();
}
