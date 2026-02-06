import { describe, it, expect, beforeEach } from 'vitest';
import {
  organizeRoutes,
  setChildRoute,
  sortRoutes,
  setUrls,
  findRouteByName,
  flattenRoutes,
  addAbpRoutes,
  getAbpRoutes,
  clearAbpRoutes,
  findRoute,
  getRoutePath,
} from './route-utils';
import { ABP } from '../models';
import { RoutesService } from '../services/routes.service';

describe('route-utils', () => {
  beforeEach(() => {
    clearAbpRoutes();
  });

  describe('addAbpRoutes', () => {
    it('should add a single route', () => {
      const route: ABP.FullRoute = { name: 'Test', path: 'test' };
      addAbpRoutes(route);
      expect(getAbpRoutes()).toHaveLength(1);
      expect(getAbpRoutes()[0].name).toBe('Test');
    });

    it('should add multiple routes from array', () => {
      const routes: ABP.FullRoute[] = [
        { name: 'Route1', path: 'route1' },
        { name: 'Route2', path: 'route2' },
      ];
      addAbpRoutes(routes);
      expect(getAbpRoutes()).toHaveLength(2);
    });

    it('should append to existing routes', () => {
      addAbpRoutes({ name: 'First', path: 'first' });
      addAbpRoutes({ name: 'Second', path: 'second' });
      expect(getAbpRoutes()).toHaveLength(2);
    });
  });

  describe('getAbpRoutes', () => {
    it('should return a copy of routes', () => {
      addAbpRoutes({ name: 'Test', path: 'test' });
      const routes = getAbpRoutes();
      routes.push({ name: 'Added', path: 'added' });
      expect(getAbpRoutes()).toHaveLength(1);
    });
  });

  describe('clearAbpRoutes', () => {
    it('should clear all routes', () => {
      addAbpRoutes([
        { name: 'Route1', path: 'route1' },
        { name: 'Route2', path: 'route2' },
      ]);
      expect(getAbpRoutes()).toHaveLength(2);
      clearAbpRoutes();
      expect(getAbpRoutes()).toHaveLength(0);
    });
  });

  describe('sortRoutes', () => {
    it('should sort routes by order property', () => {
      const routes: ABP.FullRoute[] = [
        { name: 'Third', path: 'third', order: 3 },
        { name: 'First', path: 'first', order: 1 },
        { name: 'Second', path: 'second', order: 2 },
      ];
      const sorted = sortRoutes(routes);
      expect(sorted[0].name).toBe('First');
      expect(sorted[1].name).toBe('Second');
      expect(sorted[2].name).toBe('Third');
    });

    it('should handle routes without order (default to 0)', () => {
      const routes: ABP.FullRoute[] = [
        { name: 'WithOrder', path: 'order', order: 1 },
        { name: 'NoOrder', path: 'no-order' },
      ];
      const sorted = sortRoutes(routes);
      expect(sorted[0].name).toBe('NoOrder');
      expect(sorted[1].name).toBe('WithOrder');
    });

    it('should sort children recursively', () => {
      const routes: ABP.FullRoute[] = [
        {
          name: 'Parent',
          path: 'parent',
          children: [
            { name: 'Child2', path: 'child2', order: 2 },
            { name: 'Child1', path: 'child1', order: 1 },
          ],
        },
      ];
      const sorted = sortRoutes(routes);
      expect(sorted[0].children![0].name).toBe('Child1');
      expect(sorted[0].children![1].name).toBe('Child2');
    });

    it('should return empty array for empty input', () => {
      expect(sortRoutes([])).toEqual([]);
      expect(sortRoutes()).toEqual([]);
    });
  });

  describe('setUrls', () => {
    it('should set URLs for root routes', () => {
      const routes: ABP.FullRoute[] = [
        { name: 'Home', path: 'home' },
        { name: 'About', path: 'about' },
      ];
      const withUrls = setUrls(routes);
      expect(withUrls[0].url).toBe('/home');
      expect(withUrls[1].url).toBe('/about');
    });

    it('should set URLs with parent URL prefix', () => {
      const routes: ABP.FullRoute[] = [{ name: 'Child', path: 'child' }];
      const withUrls = setUrls(routes, '/parent');
      expect(withUrls[0].url).toBe('/parent/child');
    });

    it('should handle nested routes recursively', () => {
      const routes: ABP.FullRoute[] = [
        {
          name: 'Parent',
          path: 'parent',
          children: [{ name: 'Child', path: 'child' }],
        },
      ];
      const withUrls = setUrls(routes);
      expect(withUrls[0].url).toBe('/parent');
      expect(withUrls[0].children![0].url).toBe('/parent/child');
    });
  });

  describe('findRouteByName', () => {
    const routes: ABP.FullRoute[] = [
      { name: 'Home', path: 'home' },
      {
        name: 'Admin',
        path: 'admin',
        children: [
          { name: 'Users', path: 'users' },
          {
            name: 'Settings',
            path: 'settings',
            children: [{ name: 'General', path: 'general' }],
          },
        ],
      },
    ];

    it('should find a root-level route', () => {
      const found = findRouteByName(routes, 'Home');
      expect(found).toBeDefined();
      expect(found!.name).toBe('Home');
    });

    it('should find a nested route', () => {
      const found = findRouteByName(routes, 'Users');
      expect(found).toBeDefined();
      expect(found!.name).toBe('Users');
    });

    it('should find a deeply nested route', () => {
      const found = findRouteByName(routes, 'General');
      expect(found).toBeDefined();
      expect(found!.name).toBe('General');
    });

    it('should return undefined for non-existent route', () => {
      const found = findRouteByName(routes, 'NonExistent');
      expect(found).toBeUndefined();
    });
  });

  describe('flattenRoutes', () => {
    it('should flatten nested routes', () => {
      const routes: ABP.FullRoute[] = [
        { name: 'Home', path: 'home' },
        {
          name: 'Admin',
          path: 'admin',
          children: [
            { name: 'Users', path: 'users' },
            { name: 'Roles', path: 'roles' },
          ],
        },
      ];
      const flattened = flattenRoutes(routes);
      expect(flattened).toHaveLength(4);
      expect(flattened.map((r) => r.name)).toEqual(['Home', 'Admin', 'Users', 'Roles']);
    });

    it('should handle empty routes', () => {
      expect(flattenRoutes([])).toEqual([]);
    });

    it('should handle routes without children', () => {
      const routes: ABP.FullRoute[] = [
        { name: 'Route1', path: 'r1' },
        { name: 'Route2', path: 'r2' },
      ];
      expect(flattenRoutes(routes)).toHaveLength(2);
    });
  });

  describe('setChildRoute', () => {
    it('should attach children to parent by parentName', () => {
      const routes: ABP.FullRoute[] = [
        { name: 'Parent', path: 'parent' },
        { name: 'Standalone', path: 'standalone' },
      ];
      const parentNameArr: ABP.FullRoute[] = [{ name: 'Child', path: 'child', parentName: 'Parent' }];

      const result = setChildRoute(routes, parentNameArr);

      const parent = result.find((r) => r.name === 'Parent');
      expect(parent!.children).toHaveLength(1);
      expect(parent!.children![0].name).toBe('Child');
    });

    it('should filter routes without path or children', () => {
      const routes: ABP.FullRoute[] = [
        { name: 'WithPath', path: 'path' },
        { name: 'NoPath', path: '' },
      ];
      const result = setChildRoute(routes, []);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('WithPath');
    });
  });

  describe('organizeRoutes', () => {
    it('should organize flat routes with parent-child relationships', () => {
      const routes: ABP.FullRoute[] = [
        { name: 'Dashboard', path: 'dashboard', order: 1 },
        { name: 'Users', path: 'users', parentName: 'Admin', order: 1 },
        { name: 'Admin', path: 'admin', order: 2 },
      ];

      const organized = organizeRoutes(routes);

      expect(organized).toHaveLength(2);
      expect(organized[0].name).toBe('Dashboard');
      expect(organized[1].name).toBe('Admin');
      expect(organized[1].children).toHaveLength(1);
      expect(organized[1].children![0].name).toBe('Users');
    });

    it('should handle empty routes', () => {
      expect(organizeRoutes([])).toEqual([]);
    });
  });

  describe('findRoute', () => {
    let routesService: RoutesService;

    beforeEach(() => {
      RoutesService.resetInstance();
      routesService = RoutesService.getInstance();
      routesService.add([
        { name: 'Home', path: '/home' },
        { name: 'About', path: '/about' },
        { name: 'Admin', path: '/admin' },
        { name: 'Users', path: '/users', parentName: 'Admin' },
      ]);
    });

    it('should find a route by path', () => {
      const found = findRoute(routesService, '/home');

      expect(found).not.toBeNull();
      expect(found!.name).toBe('Home');
    });

    it('should find a nested route by path', () => {
      const found = findRoute(routesService, '/users');

      expect(found).not.toBeNull();
      expect(found!.name).toBe('Users');
    });

    it('should return null when route not found', () => {
      const found = findRoute(routesService, '/nonexistent');

      expect(found).toBeNull();
    });

    it('should find route with exact path match', () => {
      const found = findRoute(routesService, '/about');

      expect(found).not.toBeNull();
      expect(found!.path).toBe('/about');
    });
  });

  describe('getRoutePath', () => {
    it('should return clean path from URL', () => {
      const path = getRoutePath('/users/list');

      expect(path).toBe('/users/list');
    });

    it('should remove query string', () => {
      const path = getRoutePath('/users?page=1&size=10');

      expect(path).toBe('/users');
    });

    it('should remove hash fragment', () => {
      const path = getRoutePath('/docs#section-1');

      expect(path).toBe('/docs');
    });

    it('should remove both query string and hash', () => {
      const path = getRoutePath('/page?id=1#top');

      expect(path).toBe('/page');
    });

    it('should remove trailing slash', () => {
      const path = getRoutePath('/users/');

      expect(path).toBe('/users');
    });

    it('should not remove trailing slash from root path', () => {
      const path = getRoutePath('/');

      expect(path).toBe('/');
    });

    it('should handle complex URLs', () => {
      const path = getRoutePath('/admin/users/edit/?id=123&mode=advanced#details');

      expect(path).toBe('/admin/users/edit');
    });

    it('should handle URL with only query string', () => {
      const path = getRoutePath('/?redirect=home');

      expect(path).toBe('/');
    });

    it('should handle empty string', () => {
      const path = getRoutePath('');

      expect(path).toBe('');
    });

    it('should handle path without leading slash', () => {
      const path = getRoutePath('users/list');

      expect(path).toBe('users/list');
    });
  });
});
