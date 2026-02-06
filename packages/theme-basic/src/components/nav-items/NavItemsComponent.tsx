import React, { useCallback } from 'react';
import { Stack, Box } from '@chakra-ui/react';
import { NavItem, useNavItems } from '@abpjs/theme-shared';

/**
 * Props for the NavItemsComponent.
 * @since 2.7.0
 * @updated 3.0.0 - Simplified to use NavItemsService from @abpjs/theme-shared
 */
export interface NavItemsComponentProps {
  /** Whether the screen is small (mobile) */
  smallScreen?: boolean;
}

/**
 * Public API component for navigation items.
 * Uses NavItemsService from @abpjs/theme-shared to manage nav items.
 *
 * This component is part of the theme-basic public API and can be
 * replaced using the component replacement system with eThemeBasicComponents.NavItems.
 *
 * @since 2.7.0 - Added as public API component
 * @updated 3.0.0 - Now uses NavItemsService from @abpjs/theme-shared
 *
 * @example
 * ```tsx
 * // Basic usage - nav items are configured via NavItemsService
 * <NavItemsComponent />
 *
 * // For small screens
 * <NavItemsComponent smallScreen />
 * ```
 */
export function NavItemsComponent({
  smallScreen = false,
}: NavItemsComponentProps): React.ReactElement {
  // Get nav items from NavItemsService
  const navItems = useNavItems();

  // Track function for nav items
  const trackByFn = useCallback((item: NavItem): string | number => {
    return item.id;
  }, []);

  // Render a single nav item
  const renderNavItem = useCallback((item: NavItem): React.ReactNode => {
    // If a component is provided, render it
    if (item.component) {
      const Component = item.component;
      return <Component key={item.id} />;
    }

    // If HTML is provided, render it (with caution for XSS)
    if (item.html) {
      return (
        <Box
          key={item.id}
          dangerouslySetInnerHTML={{ __html: item.html }}
        />
      );
    }

    // If an action is provided, render a clickable element
    if (item.action) {
      return (
        <Box
          key={item.id}
          as="button"
          onClick={item.action}
          cursor="pointer"
          width="full"
        />
      );
    }

    return null;
  }, []);

  return (
    <Stack gap={2} width="full">
      {navItems.map((item) => renderNavItem(item))}
    </Stack>
  );
}

export default NavItemsComponent;
