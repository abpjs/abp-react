import { ABP } from '../models';

/**
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
    return routes.map((route) => ({
      ...route,
      url: `${parentUrl}/${route.path}`,
      ...(route.children &&
        route.children.length && {
          children: setUrls(route.children, `${parentUrl}/${route.path}`),
        }),
    }));
  }

  return routes.map((route) => ({
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
