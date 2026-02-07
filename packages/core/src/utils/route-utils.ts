import { ABP } from '../models';
import { RoutesService } from '../services/routes.service';
import { TreeNode } from './tree-utils';

/**
 * Find a route in the RoutesService by path
 * @param routes - The RoutesService instance
 * @param path - The path to find
 * @returns The found TreeNode or null
 * @since 3.0.0
 */
export function findRoute(
  routes: RoutesService,
  path: string
): TreeNode<ABP.Route> | null {
  return routes.find((node) => node.path === path);
}

/**
 * Get the current route path from a URL
 * @param url - The URL to parse (e.g., from window.location.pathname)
 * @returns The route path
 * @since 3.0.0
 */
export function getRoutePath(url: string): string {
  // Remove query string and hash
  const cleanUrl = url.split('?')[0].split('#')[0];
  // Remove trailing slash
  return cleanUrl.endsWith('/') && cleanUrl.length > 1
    ? cleanUrl.slice(0, -1)
    : cleanUrl;
}

/**
 * @deprecated Use RoutesService instead. Will be removed in v4.0.0
 * Organize routes by setting up parent-child relationships
 */
export function organizeRoutes(
  routes: ABP.FullRoute[],
  wrappers: ABP.FullRoute[] = [],
  parentNameArr: ABP.FullRoute[] = [],
  parentName: string | null = null
): ABP.FullRoute[] {
  const filter = (route: ABP.FullRoute): boolean => {
    if (route.children) {
      route.children = organizeRoutes(route.children, wrappers, parentNameArr, route.name);
    }
    if (route.parentName && route.parentName !== parentName) {
      parentNameArr.push(route);
      return false;
    }
    return true;
  };

  if (parentName) {
    return routes.filter(filter);
  }

  const filteredRoutes = routes.filter(filter);

  if (parentNameArr.length) {
    return sortRoutes(setChildRoute([...filteredRoutes, ...wrappers], parentNameArr));
  }

  return filteredRoutes;
}

/**
 * Set child routes based on parentName
 */
export function setChildRoute(
  routes: ABP.FullRoute[],
  parentNameArr: ABP.FullRoute[]
): ABP.FullRoute[] {
  return routes
    .map((route) => {
      if (route.children && route.children.length) {
        route.children = setChildRoute(route.children, parentNameArr);
      }

      const foundedChildren = parentNameArr.filter((parent) => parent.parentName === route.name);

      if (foundedChildren && foundedChildren.length) {
        route.children = [...(route.children || []), ...foundedChildren];
      }

      return route;
    })
    .filter((route) => route.path || (route.children && route.children.length));
}

/**
 * Sort routes by order property
 */
export function sortRoutes(routes: ABP.FullRoute[] = []): ABP.FullRoute[] {
  if (!routes.length) return [];

  return routes
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((route) => {
      if (route.children && route.children.length) {
        route.children = sortRoutes(route.children);
      }
      return route;
    });
}

/**
 * Set URLs for routes recursively
 */
export function setUrls(routes: ABP.FullRoute[], parentUrl?: string): ABP.FullRoute[] {
  if (parentUrl) {
    return routes.map((route): ABP.FullRoute => ({
      ...route,
      url: `${parentUrl}/${route.path}`,
      ...(route.children &&
        route.children.length && {
          children: setUrls(route.children, `${parentUrl}/${route.path}`),
        }),
    }));
  }

  return routes.map((route): ABP.FullRoute => ({
    ...route,
    url: `/${route.path}`,
    ...(route.children &&
      route.children.length && {
        children: setUrls(route.children, `/${route.path}`),
      }),
  }));
}

/**
 * Find a route by name recursively
 */
export function findRouteByName(routes: ABP.FullRoute[], name: string): ABP.FullRoute | undefined {
  for (const route of routes) {
    if (route.name === name) {
      return route;
    }
    if (route.children) {
      const found = findRouteByName(route.children, name);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
}

/**
 * Flatten routes into a single array
 */
export function flattenRoutes(routes: ABP.FullRoute[]): ABP.FullRoute[] {
  return routes.reduce<ABP.FullRoute[]>((acc, route) => {
    acc.push(route);
    if (route.children) {
      acc.push(...flattenRoutes(route.children));
    }
    return acc;
  }, []);
}

// Internal storage for dynamically added routes
let abpRoutes: ABP.FullRoute[] = [];

/**
 * Add routes to the ABP route registry
 * This allows modules to register their routes dynamically
 * @since 1.0.0
 */
export function addAbpRoutes(routes: ABP.FullRoute | ABP.FullRoute[]): void {
  if (Array.isArray(routes)) {
    abpRoutes = [...abpRoutes, ...routes];
  } else {
    abpRoutes = [...abpRoutes, routes];
  }
}

/**
 * Get all registered ABP routes
 * @since 1.0.0
 */
export function getAbpRoutes(): ABP.FullRoute[] {
  return [...abpRoutes];
}

/**
 * Clear all registered ABP routes (useful for testing)
 * @internal
 */
export function clearAbpRoutes(): void {
  abpRoutes = [];
}

/**
 * Reload the current route
 * In React, this typically triggers a page reload or route refresh
 *
 * Note: This is a simplified version of Angular's router reload.
 * In React, you may want to use react-router's navigate with replace
 * or implement a custom refresh mechanism.
 *
 * @since 3.2.0
 */
export function reloadRoute(): void {
  // In React/SPA context, we reload the current page
  // This is equivalent to Angular's router reload behavior
  window.location.reload();
}
