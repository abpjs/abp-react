import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { configureRoutes, ACCOUNT_ROUTE_PROVIDERS, initializeAccountRoutes } from '../../../config/providers/route.provider';
import { eAccountRouteNames } from '../../../config/enums/route-names';
import { RoutesService, eLayoutType } from '@abpjs/core';
import * as core from '@abpjs/core';

/**
 * Tests for route.provider.ts
 * @since 3.0.0
 */
describe('route.provider (v3.0.0)', () => {
  let mockRoutesService: {
    add: ReturnType<typeof vi.fn>;
    items: unknown[];
  };

  beforeEach(() => {
    mockRoutesService = {
      add: vi.fn(),
      items: [],
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('configureRoutes', () => {
    it('should return a function', () => {
      const configure = configureRoutes(mockRoutesService as unknown as RoutesService);
      expect(typeof configure).toBe('function');
    });

    it('should add routes when the returned function is called', () => {
      const configure = configureRoutes(mockRoutesService as unknown as RoutesService);
      configure();
      expect(mockRoutesService.add).toHaveBeenCalledTimes(1);
    });

    it('should add 4 account routes', () => {
      const configure = configureRoutes(mockRoutesService as unknown as RoutesService);
      configure();
      const routes = mockRoutesService.add.mock.calls[0][0];
      expect(routes).toHaveLength(4);
    });

    it('should add Account parent route', () => {
      const configure = configureRoutes(mockRoutesService as unknown as RoutesService);
      configure();
      const routes = mockRoutesService.add.mock.calls[0][0];
      const accountRoute = routes.find((r: { name: string }) => r.name === eAccountRouteNames.Account);

      expect(accountRoute).toBeDefined();
      expect(accountRoute.path).toBe('/account');
      expect(accountRoute.invisible).toBe(true);
      expect(accountRoute.layout).toBe(eLayoutType.application);
      expect(accountRoute.order).toBe(1);
    });

    it('should add Login route as child of Account', () => {
      const configure = configureRoutes(mockRoutesService as unknown as RoutesService);
      configure();
      const routes = mockRoutesService.add.mock.calls[0][0];
      const loginRoute = routes.find((r: { name: string }) => r.name === eAccountRouteNames.Login);

      expect(loginRoute).toBeDefined();
      expect(loginRoute.path).toBe('/account/login');
      expect(loginRoute.parentName).toBe(eAccountRouteNames.Account);
      expect(loginRoute.order).toBe(1);
    });

    it('should add Register route as child of Account', () => {
      const configure = configureRoutes(mockRoutesService as unknown as RoutesService);
      configure();
      const routes = mockRoutesService.add.mock.calls[0][0];
      const registerRoute = routes.find((r: { name: string }) => r.name === eAccountRouteNames.Register);

      expect(registerRoute).toBeDefined();
      expect(registerRoute.path).toBe('/account/register');
      expect(registerRoute.parentName).toBe(eAccountRouteNames.Account);
      expect(registerRoute.order).toBe(2);
    });

    it('should add ManageProfile route as child of Account', () => {
      const configure = configureRoutes(mockRoutesService as unknown as RoutesService);
      configure();
      const routes = mockRoutesService.add.mock.calls[0][0];
      const manageProfileRoute = routes.find((r: { name: string }) => r.name === eAccountRouteNames.ManageProfile);

      expect(manageProfileRoute).toBeDefined();
      expect(manageProfileRoute.path).toBe('/account/manage-profile');
      expect(manageProfileRoute.parentName).toBe(eAccountRouteNames.Account);
      expect(manageProfileRoute.order).toBe(3);
    });
  });

  describe('ACCOUNT_ROUTE_PROVIDERS', () => {
    it('should export configureRoutes function', () => {
      expect(ACCOUNT_ROUTE_PROVIDERS.configureRoutes).toBeDefined();
      expect(ACCOUNT_ROUTE_PROVIDERS.configureRoutes).toBe(configureRoutes);
    });
  });

  describe('initializeAccountRoutes', () => {
    it('should be a function', () => {
      expect(typeof initializeAccountRoutes).toBe('function');
    });

    it('should call getRoutesService and configure routes', () => {
      const mockAdd = vi.fn();
      const mockRoutesServiceInstance = {
        add: mockAdd,
        items: [],
      };

      // Mock getRoutesService
      vi.spyOn(core, 'getRoutesService').mockReturnValue(mockRoutesServiceInstance as unknown as RoutesService);

      // Call initializeAccountRoutes
      initializeAccountRoutes();

      // Verify getRoutesService was called
      expect(core.getRoutesService).toHaveBeenCalled();

      // Verify routes were added
      expect(mockAdd).toHaveBeenCalledTimes(1);

      // Verify the correct routes were added
      const routes = mockAdd.mock.calls[0][0];
      expect(routes).toHaveLength(4);
      expect(routes.some((r: { name: string }) => r.name === eAccountRouteNames.Account)).toBe(true);
      expect(routes.some((r: { name: string }) => r.name === eAccountRouteNames.Login)).toBe(true);
      expect(routes.some((r: { name: string }) => r.name === eAccountRouteNames.Register)).toBe(true);
      expect(routes.some((r: { name: string }) => r.name === eAccountRouteNames.ManageProfile)).toBe(true);

      // Restore mock
      vi.restoreAllMocks();
    });
  });
});
