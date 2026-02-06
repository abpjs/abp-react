import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  configureRoutes,
  IDENTITY_ROUTE_PROVIDERS,
  initializeIdentityRoutes,
} from '../../../config/providers/route.provider';
import { eIdentityRouteNames } from '../../../config/enums/route-names';
import { eIdentityPolicyNames } from '../../../config/enums/policy-names';

// Mock @abpjs/core
const mockAdd = vi.fn();
const mockRoutesService = {
  add: mockAdd,
};

vi.mock('@abpjs/core', () => ({
  getRoutesService: vi.fn(() => mockRoutesService),
  RoutesService: vi.fn(),
  eLayoutType: {
    application: 'application',
    account: 'account',
    empty: 'empty',
  },
}));

describe('route.provider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('configureRoutes', () => {
    it('should be a function', () => {
      expect(typeof configureRoutes).toBe('function');
    });

    it('should return a function when called with RoutesService', () => {
      const addRoutes = configureRoutes(mockRoutesService as any);
      expect(typeof addRoutes).toBe('function');
    });

    it('should not add routes until returned function is called', () => {
      configureRoutes(mockRoutesService as any);
      expect(mockAdd).not.toHaveBeenCalled();
    });

    it('should add routes when returned function is called', () => {
      const addRoutes = configureRoutes(mockRoutesService as any);
      addRoutes();
      expect(mockAdd).toHaveBeenCalledTimes(1);
    });

    it('should add identity management route with correct properties', () => {
      const addRoutes = configureRoutes(mockRoutesService as any);
      addRoutes();

      const routes = mockAdd.mock.calls[0][0];
      const identityRoute = routes.find(
        (r: any) => r.name === eIdentityRouteNames.IdentityManagement
      );

      expect(identityRoute).toBeDefined();
      expect(identityRoute.path).toBe('/identity');
      expect(identityRoute.parentName).toBe('AbpUiNavigation::Menu:Administration');
      expect(identityRoute.requiredPolicy).toBe(eIdentityPolicyNames.IdentityManagement);
      expect(identityRoute.layout).toBe('application');
      expect(identityRoute.iconClass).toBe('bi bi-people');
      expect(identityRoute.order).toBe(1);
    });

    it('should add roles route with correct properties', () => {
      const addRoutes = configureRoutes(mockRoutesService as any);
      addRoutes();

      const routes = mockAdd.mock.calls[0][0];
      const rolesRoute = routes.find((r: any) => r.name === eIdentityRouteNames.Roles);

      expect(rolesRoute).toBeDefined();
      expect(rolesRoute.path).toBe('/identity/roles');
      expect(rolesRoute.parentName).toBe(eIdentityRouteNames.IdentityManagement);
      expect(rolesRoute.requiredPolicy).toBe(eIdentityPolicyNames.Roles);
      expect(rolesRoute.order).toBe(1);
    });

    it('should add users route with correct properties', () => {
      const addRoutes = configureRoutes(mockRoutesService as any);
      addRoutes();

      const routes = mockAdd.mock.calls[0][0];
      const usersRoute = routes.find((r: any) => r.name === eIdentityRouteNames.Users);

      expect(usersRoute).toBeDefined();
      expect(usersRoute.path).toBe('/identity/users');
      expect(usersRoute.parentName).toBe(eIdentityRouteNames.IdentityManagement);
      expect(usersRoute.requiredPolicy).toBe(eIdentityPolicyNames.Users);
      expect(usersRoute.order).toBe(2);
    });

    it('should add exactly 3 routes', () => {
      const addRoutes = configureRoutes(mockRoutesService as any);
      addRoutes();

      const routes = mockAdd.mock.calls[0][0];
      expect(routes).toHaveLength(3);
    });

    it('should set users route order after roles route', () => {
      const addRoutes = configureRoutes(mockRoutesService as any);
      addRoutes();

      const routes = mockAdd.mock.calls[0][0];
      const rolesRoute = routes.find((r: any) => r.name === eIdentityRouteNames.Roles);
      const usersRoute = routes.find((r: any) => r.name === eIdentityRouteNames.Users);

      expect(usersRoute.order).toBeGreaterThan(rolesRoute.order);
    });
  });

  describe('IDENTITY_ROUTE_PROVIDERS', () => {
    it('should be defined', () => {
      expect(IDENTITY_ROUTE_PROVIDERS).toBeDefined();
    });

    it('should be an object', () => {
      expect(typeof IDENTITY_ROUTE_PROVIDERS).toBe('object');
    });

    it('should have configureRoutes property', () => {
      expect(IDENTITY_ROUTE_PROVIDERS.configureRoutes).toBeDefined();
    });

    it('should have configureRoutes as the same function', () => {
      expect(IDENTITY_ROUTE_PROVIDERS.configureRoutes).toBe(configureRoutes);
    });
  });

  describe('initializeIdentityRoutes', () => {
    it('should be a function', () => {
      expect(typeof initializeIdentityRoutes).toBe('function');
    });

    it('should not throw when called', () => {
      expect(() => initializeIdentityRoutes()).not.toThrow();
    });

    it('should add routes to the routes service', () => {
      // Since the mock is set up, calling initializeIdentityRoutes should trigger mockAdd
      initializeIdentityRoutes();
      expect(mockAdd).toHaveBeenCalled();
    });
  });

  describe('route hierarchy', () => {
    it('should have roles and users as children of identity management', () => {
      const addRoutes = configureRoutes(mockRoutesService as any);
      addRoutes();

      const routes = mockAdd.mock.calls[0][0];
      const rolesRoute = routes.find((r: any) => r.name === eIdentityRouteNames.Roles);
      const usersRoute = routes.find((r: any) => r.name === eIdentityRouteNames.Users);

      expect(rolesRoute.parentName).toBe(eIdentityRouteNames.IdentityManagement);
      expect(usersRoute.parentName).toBe(eIdentityRouteNames.IdentityManagement);
    });

    it('should have identity management as child of Administration', () => {
      const addRoutes = configureRoutes(mockRoutesService as any);
      addRoutes();

      const routes = mockAdd.mock.calls[0][0];
      const identityRoute = routes.find(
        (r: any) => r.name === eIdentityRouteNames.IdentityManagement
      );

      expect(identityRoute.parentName).toBe('AbpUiNavigation::Menu:Administration');
    });
  });
});
