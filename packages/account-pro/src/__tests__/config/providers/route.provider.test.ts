import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  configureRoutes,
  ACCOUNT_ROUTE_PROVIDERS,
  initializeAccountRoutes,
} from '../../../config/providers/route.provider';
import { eAccountRouteNames } from '../../../config/enums/route-names';
import { eLayoutType } from '@abpjs/core';

// Mock the @abpjs/core module
const mockAdd = vi.fn();
const mockRoutesService = {
  add: mockAdd,
};

vi.mock('@abpjs/core', async () => {
  const actual = await vi.importActual('@abpjs/core');
  return {
    ...actual,
    getRoutesService: vi.fn(() => mockRoutesService),
  };
});

describe('route.provider (v3.0.0)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('configureRoutes', () => {
    it('should return a function', () => {
      const result = configureRoutes(mockRoutesService as any);
      expect(typeof result).toBe('function');
    });

    it('should not call routes.add immediately', () => {
      configureRoutes(mockRoutesService as any);
      expect(mockAdd).not.toHaveBeenCalled();
    });

    it('should call routes.add when the returned function is invoked', () => {
      const addRoutes = configureRoutes(mockRoutesService as any);
      addRoutes();
      expect(mockAdd).toHaveBeenCalledTimes(1);
    });

    it('should add routes array with correct structure', () => {
      const addRoutes = configureRoutes(mockRoutesService as any);
      addRoutes();

      expect(mockAdd).toHaveBeenCalledWith(expect.any(Array));
      const routes = mockAdd.mock.calls[0][0];
      expect(routes).toHaveLength(6);
    });

    describe('Account route', () => {
      it('should add the account parent route', () => {
        const addRoutes = configureRoutes(mockRoutesService as any);
        addRoutes();

        const routes = mockAdd.mock.calls[0][0];
        const accountRoute = routes.find(
          (r: any) => r.name === eAccountRouteNames.Account
        );

        expect(accountRoute).toBeDefined();
        expect(accountRoute.path).toBe('/account');
        expect(accountRoute.layout).toBe(eLayoutType.account);
        expect(accountRoute.invisible).toBe(true);
      });
    });

    describe('Login route', () => {
      it('should add the login route', () => {
        const addRoutes = configureRoutes(mockRoutesService as any);
        addRoutes();

        const routes = mockAdd.mock.calls[0][0];
        const loginRoute = routes.find(
          (r: any) => r.name === eAccountRouteNames.Login
        );

        expect(loginRoute).toBeDefined();
        expect(loginRoute.path).toBe('/account/login');
        expect(loginRoute.parentName).toBe(eAccountRouteNames.Account);
        expect(loginRoute.layout).toBe(eLayoutType.account);
        expect(loginRoute.order).toBe(1);
      });
    });

    describe('Register route', () => {
      it('should add the register route', () => {
        const addRoutes = configureRoutes(mockRoutesService as any);
        addRoutes();

        const routes = mockAdd.mock.calls[0][0];
        const registerRoute = routes.find(
          (r: any) => r.name === eAccountRouteNames.Register
        );

        expect(registerRoute).toBeDefined();
        expect(registerRoute.path).toBe('/account/register');
        expect(registerRoute.parentName).toBe(eAccountRouteNames.Account);
        expect(registerRoute.layout).toBe(eLayoutType.account);
        expect(registerRoute.order).toBe(2);
      });
    });

    describe('ForgotPassword route', () => {
      it('should add the forgot-password route', () => {
        const addRoutes = configureRoutes(mockRoutesService as any);
        addRoutes();

        const routes = mockAdd.mock.calls[0][0];
        const forgotRoute = routes.find(
          (r: any) => r.name === eAccountRouteNames.ForgotPassword
        );

        expect(forgotRoute).toBeDefined();
        expect(forgotRoute.path).toBe('/account/forgot-password');
        expect(forgotRoute.parentName).toBe(eAccountRouteNames.Account);
        expect(forgotRoute.layout).toBe(eLayoutType.account);
        expect(forgotRoute.order).toBe(3);
      });
    });

    describe('ResetPassword route', () => {
      it('should add the reset-password route', () => {
        const addRoutes = configureRoutes(mockRoutesService as any);
        addRoutes();

        const routes = mockAdd.mock.calls[0][0];
        const resetRoute = routes.find(
          (r: any) => r.name === eAccountRouteNames.ResetPassword
        );

        expect(resetRoute).toBeDefined();
        expect(resetRoute.path).toBe('/account/reset-password');
        expect(resetRoute.parentName).toBe(eAccountRouteNames.Account);
        expect(resetRoute.layout).toBe(eLayoutType.account);
        expect(resetRoute.order).toBe(4);
      });
    });

    describe('ManageProfile route', () => {
      it('should add the manage-profile route', () => {
        const addRoutes = configureRoutes(mockRoutesService as any);
        addRoutes();

        const routes = mockAdd.mock.calls[0][0];
        const profileRoute = routes.find(
          (r: any) => r.name === eAccountRouteNames.ManageProfile
        );

        expect(profileRoute).toBeDefined();
        expect(profileRoute.path).toBe('/account/manage-profile');
        expect(profileRoute.parentName).toBe(eAccountRouteNames.Account);
        expect(profileRoute.layout).toBe(eLayoutType.application);
        expect(profileRoute.order).toBe(5);
      });

      it('should use application layout for manage-profile (not account)', () => {
        const addRoutes = configureRoutes(mockRoutesService as any);
        addRoutes();

        const routes = mockAdd.mock.calls[0][0];
        const profileRoute = routes.find(
          (r: any) => r.name === eAccountRouteNames.ManageProfile
        );

        // ManageProfile uses application layout because it's for authenticated users
        expect(profileRoute.layout).toBe(eLayoutType.application);
      });
    });

    describe('route ordering', () => {
      it('should have routes in correct order', () => {
        const addRoutes = configureRoutes(mockRoutesService as any);
        addRoutes();

        const routes = mockAdd.mock.calls[0][0];
        const orderedRoutes = routes
          .filter((r: any) => r.order !== undefined)
          .sort((a: any, b: any) => a.order - b.order);

        expect(orderedRoutes[0].name).toBe(eAccountRouteNames.Login);
        expect(orderedRoutes[1].name).toBe(eAccountRouteNames.Register);
        expect(orderedRoutes[2].name).toBe(eAccountRouteNames.ForgotPassword);
        expect(orderedRoutes[3].name).toBe(eAccountRouteNames.ResetPassword);
        expect(orderedRoutes[4].name).toBe(eAccountRouteNames.ManageProfile);
      });
    });
  });

  describe('ACCOUNT_ROUTE_PROVIDERS', () => {
    it('should be an object', () => {
      expect(typeof ACCOUNT_ROUTE_PROVIDERS).toBe('object');
    });

    it('should have configureRoutes function', () => {
      expect(ACCOUNT_ROUTE_PROVIDERS.configureRoutes).toBeDefined();
      expect(typeof ACCOUNT_ROUTE_PROVIDERS.configureRoutes).toBe('function');
    });

    it('should have configureRoutes be the same function', () => {
      expect(ACCOUNT_ROUTE_PROVIDERS.configureRoutes).toBe(configureRoutes);
    });
  });

  describe('initializeAccountRoutes', () => {
    it('should be a function', () => {
      expect(typeof initializeAccountRoutes).toBe('function');
    });

    it('should call getRoutesService and configure routes', () => {
      initializeAccountRoutes();
      expect(mockAdd).toHaveBeenCalledTimes(1);
    });

    it('should add all 6 routes', () => {
      initializeAccountRoutes();

      const routes = mockAdd.mock.calls[0][0];
      expect(routes).toHaveLength(6);
    });
  });

  describe('route path consistency', () => {
    it('should have all child routes under /account prefix', () => {
      const addRoutes = configureRoutes(mockRoutesService as any);
      addRoutes();

      const routes = mockAdd.mock.calls[0][0];
      routes.forEach((route: any) => {
        expect(route.path).toMatch(/^\/account/);
      });
    });

    it('should have all child routes reference Account as parent', () => {
      const addRoutes = configureRoutes(mockRoutesService as any);
      addRoutes();

      const routes = mockAdd.mock.calls[0][0];
      const childRoutes = routes.filter((r: any) => r.parentName);
      childRoutes.forEach((route: any) => {
        expect(route.parentName).toBe(eAccountRouteNames.Account);
      });
    });
  });
});
