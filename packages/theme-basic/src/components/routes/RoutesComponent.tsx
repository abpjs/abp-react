import React, { useMemo, ReactNode } from 'react';
import { Stack } from '@chakra-ui/react';
import { useConfig, ABP, useDirection } from '@abpjs/core';
import { NavLinks } from '../blocks/sidebars/sidebar-with-collapsible/nav-links';

/**
 * Get visible routes (filter out invisible ones)
 */
function getVisibleRoutes(routes: ABP.FullRoute[]): ABP.FullRoute[] {
  return routes.reduce<ABP.FullRoute[]>((acc, val) => {
    if (val.invisible) {
      return acc;
    }

    const route = { ...val };
    if (route.children && route.children.length) {
      route.children = getVisibleRoutes(route.children);
    }

    return [...acc, route];
  }, []);
}

/**
 * Props for the RoutesComponent.
 * @since 2.7.0
 * @updated 2.9.0 - Removed isDropdownChildDynamic prop
 */
export interface RoutesComponentProps {
  /** Whether the screen is small (mobile) */
  smallScreen?: boolean;
  /** Default icon for routes without specific icons */
  defaultIcon?: ReactNode;
  /** Custom routes to display (overrides config routes) */
  routes?: ABP.FullRoute[];
}

/**
 * Public API component for rendering navigation routes.
 * Displays the visible routes from the config with support for
 * collapsible child routes.
 *
 * This component is part of the theme-basic public API and can be
 * replaced using the component replacement system with eThemeBasicComponents.Routes.
 *
 * @since 2.7.0 - Added as public API component
 *
 * @example
 * ```tsx
 * // Basic usage - uses routes from config
 * <RoutesComponent />
 *
 * // With custom default icon
 * <RoutesComponent defaultIcon={<LuHome />} />
 *
 * // With custom routes
 * <RoutesComponent routes={customRoutes} />
 * ```
 */
export function RoutesComponent({
  smallScreen = false,
  defaultIcon,
  routes: customRoutes,
}: RoutesComponentProps): React.ReactElement {
  const { routes: configRoutes } = useConfig();
  const { direction } = useDirection();

  // Use custom routes if provided, otherwise use config routes
  const routes = customRoutes || configRoutes || [];

  // Get visible routes
  const visibleRoutes = useMemo(() => {
    return getVisibleRoutes(routes);
  }, [routes]);

  // Track function for routes
  const trackByFn = (index: number, item: ABP.FullRoute) => {
    return item.name || item.path || index;
  };

  return (
    <Stack gap="1" dir={direction}>
      <NavLinks defaultIcon={defaultIcon} />
    </Stack>
  );
}

export default RoutesComponent;
