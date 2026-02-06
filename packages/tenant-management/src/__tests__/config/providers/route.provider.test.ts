import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  configureRoutes,
  TENANT_MANAGEMENT_ROUTE_PROVIDERS,
  initializeTenantManagementRoutes,
} from '../../../config/providers/route.provider';
import { eTenantManagementRouteNames } from '../../../config/enums/route-names';
import { eTenantManagementPolicyNames } from '../../../config/enums/policy-names';
import { RoutesService, eLayoutType } from '@abpjs/core';

// Mock @abpjs/core
vi.mock('@abpjs/core', async () => {
  const actual = await vi.importActual('@abpjs/core');
  return {
    ...actual,
    getRoutesService: vi.fn(),
  };
});

describe('route.provider', () => {
  let mockRoutesService: {
    add: ReturnType<typeof vi.fn>;
    patch: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockRoutesService = {
      add: vi.fn(),
      patch: vi.fn(),
    };
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('configureRoutes', () => {
    it('should return a function', () => {
      const result = configureRoutes(mockRoutesService as unknown as RoutesService);
      expect(typeof result).toBe('function');
    });

    it('should not call routes.add until the returned function is called', () => {
      configureRoutes(mockRoutesService as unknown as RoutesService);
      expect(mockRoutesService.add).not.toHaveBeenCalled();
    });

    it('should call routes.add when the returned function is called', () => {
      const addRoutes = configureRoutes(mockRoutesService as unknown as RoutesService);
      addRoutes();
      expect(mockRoutesService.add).toHaveBeenCalledTimes(1);
    });

    it('should add 2 routes', () => {
      const addRoutes = configureRoutes(mockRoutesService as unknown as RoutesService);
      addRoutes();

      expect(mockRoutesService.add).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ path: '/tenant-management' }),
          expect.objectContaining({ path: '/tenant-management/tenants' }),
        ])
      );
    });

    describe('tenant management route configuration', () => {
      it('should configure the main tenant management route correctly', () => {
        const addRoutes = configureRoutes(mockRoutesService as unknown as RoutesService);
        addRoutes();

        const addedRoutes = mockRoutesService.add.mock.calls[0][0];
        const mainRoute = addedRoutes.find(
          (r: { path: string }) => r.path === '/tenant-management'
        );

        expect(mainRoute).toEqual({
          path: '/tenant-management',
          name: eTenantManagementRouteNames.TenantManagement,
          parentName: 'AbpUiNavigation::Menu:Administration',
          layout: eLayoutType.application,
          iconClass: 'bi bi-people',
          order: 2,
          requiredPolicy: eTenantManagementPolicyNames.TenantManagement,
        });
      });

      it('should use correct route name for main route', () => {
        const addRoutes = configureRoutes(mockRoutesService as unknown as RoutesService);
        addRoutes();

        const addedRoutes = mockRoutesService.add.mock.calls[0][0];
        const mainRoute = addedRoutes.find(
          (r: { path: string }) => r.path === '/tenant-management'
        );

        expect(mainRoute.name).toBe('AbpTenantManagement::Menu:TenantManagement');
      });

      it('should use Administration as parent for main route', () => {
        const addRoutes = configureRoutes(mockRoutesService as unknown as RoutesService);
        addRoutes();

        const addedRoutes = mockRoutesService.add.mock.calls[0][0];
        const mainRoute = addedRoutes.find(
          (r: { path: string }) => r.path === '/tenant-management'
        );

        expect(mainRoute.parentName).toBe('AbpUiNavigation::Menu:Administration');
      });

      it('should set order to 2 for main route', () => {
        const addRoutes = configureRoutes(mockRoutesService as unknown as RoutesService);
        addRoutes();

        const addedRoutes = mockRoutesService.add.mock.calls[0][0];
        const mainRoute = addedRoutes.find(
          (r: { path: string }) => r.path === '/tenant-management'
        );

        expect(mainRoute.order).toBe(2);
      });

      it('should use bi bi-people icon for main route', () => {
        const addRoutes = configureRoutes(mockRoutesService as unknown as RoutesService);
        addRoutes();

        const addedRoutes = mockRoutesService.add.mock.calls[0][0];
        const mainRoute = addedRoutes.find(
          (r: { path: string }) => r.path === '/tenant-management'
        );

        expect(mainRoute.iconClass).toBe('bi bi-people');
      });
    });

    describe('tenants child route configuration', () => {
      it('should configure the tenants child route correctly', () => {
        const addRoutes = configureRoutes(mockRoutesService as unknown as RoutesService);
        addRoutes();

        const addedRoutes = mockRoutesService.add.mock.calls[0][0];
        const tenantsRoute = addedRoutes.find(
          (r: { path: string }) => r.path === '/tenant-management/tenants'
        );

        expect(tenantsRoute).toEqual({
          path: '/tenant-management/tenants',
          name: eTenantManagementRouteNames.Tenants,
          parentName: eTenantManagementRouteNames.TenantManagement,
          layout: eLayoutType.application,
          requiredPolicy: eTenantManagementPolicyNames.Tenants,
        });
      });

      it('should use TenantManagement as parent for tenants route', () => {
        const addRoutes = configureRoutes(mockRoutesService as unknown as RoutesService);
        addRoutes();

        const addedRoutes = mockRoutesService.add.mock.calls[0][0];
        const tenantsRoute = addedRoutes.find(
          (r: { path: string }) => r.path === '/tenant-management/tenants'
        );

        expect(tenantsRoute.parentName).toBe(eTenantManagementRouteNames.TenantManagement);
      });

      it('should use correct route name for tenants route', () => {
        const addRoutes = configureRoutes(mockRoutesService as unknown as RoutesService);
        addRoutes();

        const addedRoutes = mockRoutesService.add.mock.calls[0][0];
        const tenantsRoute = addedRoutes.find(
          (r: { path: string }) => r.path === '/tenant-management/tenants'
        );

        expect(tenantsRoute.name).toBe('AbpTenantManagement::Tenants');
      });

      it('should not have order set on child route', () => {
        const addRoutes = configureRoutes(mockRoutesService as unknown as RoutesService);
        addRoutes();

        const addedRoutes = mockRoutesService.add.mock.calls[0][0];
        const tenantsRoute = addedRoutes.find(
          (r: { path: string }) => r.path === '/tenant-management/tenants'
        );

        expect(tenantsRoute.order).toBeUndefined();
      });

      it('should not have iconClass set on child route', () => {
        const addRoutes = configureRoutes(mockRoutesService as unknown as RoutesService);
        addRoutes();

        const addedRoutes = mockRoutesService.add.mock.calls[0][0];
        const tenantsRoute = addedRoutes.find(
          (r: { path: string }) => r.path === '/tenant-management/tenants'
        );

        expect(tenantsRoute.iconClass).toBeUndefined();
      });
    });

    describe('policy configuration', () => {
      it('should require TenantManagement policy for main route', () => {
        const addRoutes = configureRoutes(mockRoutesService as unknown as RoutesService);
        addRoutes();

        const addedRoutes = mockRoutesService.add.mock.calls[0][0];
        const mainRoute = addedRoutes.find(
          (r: { path: string }) => r.path === '/tenant-management'
        );

        expect(mainRoute.requiredPolicy).toBe('AbpTenantManagement.Tenants');
      });

      it('should require Tenants policy for tenants route', () => {
        const addRoutes = configureRoutes(mockRoutesService as unknown as RoutesService);
        addRoutes();

        const addedRoutes = mockRoutesService.add.mock.calls[0][0];
        const tenantsRoute = addedRoutes.find(
          (r: { path: string }) => r.path === '/tenant-management/tenants'
        );

        expect(tenantsRoute.requiredPolicy).toBe('AbpTenantManagement.Tenants');
      });
    });

    describe('layout configuration', () => {
      it('should use application layout for all routes', () => {
        const addRoutes = configureRoutes(mockRoutesService as unknown as RoutesService);
        addRoutes();

        const addedRoutes = mockRoutesService.add.mock.calls[0][0];
        addedRoutes.forEach((route: { layout: string }) => {
          expect(route.layout).toBe(eLayoutType.application);
        });
      });
    });
  });

  describe('TENANT_MANAGEMENT_ROUTE_PROVIDERS', () => {
    it('should be an object', () => {
      expect(typeof TENANT_MANAGEMENT_ROUTE_PROVIDERS).toBe('object');
    });

    it('should have configureRoutes property', () => {
      expect(TENANT_MANAGEMENT_ROUTE_PROVIDERS).toHaveProperty('configureRoutes');
    });

    it('should have configureRoutes as a function', () => {
      expect(typeof TENANT_MANAGEMENT_ROUTE_PROVIDERS.configureRoutes).toBe('function');
    });

    it('should reference the same configureRoutes function', () => {
      expect(TENANT_MANAGEMENT_ROUTE_PROVIDERS.configureRoutes).toBe(configureRoutes);
    });

    it('should work when called through the object', () => {
      const addRoutes = TENANT_MANAGEMENT_ROUTE_PROVIDERS.configureRoutes(
        mockRoutesService as unknown as RoutesService
      );
      addRoutes();

      expect(mockRoutesService.add).toHaveBeenCalledTimes(1);
    });
  });

  describe('initializeTenantManagementRoutes', () => {
    it('should be a function', () => {
      expect(typeof initializeTenantManagementRoutes).toBe('function');
    });

    it('should call getRoutesService and add routes', async () => {
      const { getRoutesService } = await import('@abpjs/core');
      (getRoutesService as ReturnType<typeof vi.fn>).mockReturnValue(mockRoutesService);

      initializeTenantManagementRoutes();

      expect(getRoutesService).toHaveBeenCalled();
      expect(mockRoutesService.add).toHaveBeenCalledTimes(1);
    });

    it('should add both tenant management routes', async () => {
      const { getRoutesService } = await import('@abpjs/core');
      (getRoutesService as ReturnType<typeof vi.fn>).mockReturnValue(mockRoutesService);

      initializeTenantManagementRoutes();

      const addedRoutes = mockRoutesService.add.mock.calls[0][0];
      expect(addedRoutes).toHaveLength(2);
      expect(addedRoutes[0].path).toBe('/tenant-management');
      expect(addedRoutes[1].path).toBe('/tenant-management/tenants');
    });
  });

  describe('route hierarchy', () => {
    it('should create proper parent-child relationship', () => {
      const addRoutes = configureRoutes(mockRoutesService as unknown as RoutesService);
      addRoutes();

      const addedRoutes = mockRoutesService.add.mock.calls[0][0];
      const mainRoute = addedRoutes.find(
        (r: { path: string }) => r.path === '/tenant-management'
      );
      const tenantsRoute = addedRoutes.find(
        (r: { path: string }) => r.path === '/tenant-management/tenants'
      );

      // Tenants should be a child of TenantManagement
      expect(tenantsRoute.parentName).toBe(mainRoute.name);
    });

    it('should have main route under Administration menu', () => {
      const addRoutes = configureRoutes(mockRoutesService as unknown as RoutesService);
      addRoutes();

      const addedRoutes = mockRoutesService.add.mock.calls[0][0];
      const mainRoute = addedRoutes.find(
        (r: { path: string }) => r.path === '/tenant-management'
      );

      expect(mainRoute.parentName).toBe('AbpUiNavigation::Menu:Administration');
    });
  });

  describe('multiple invocations', () => {
    it('should allow multiple calls to configureRoutes', () => {
      const addRoutes1 = configureRoutes(mockRoutesService as unknown as RoutesService);
      const addRoutes2 = configureRoutes(mockRoutesService as unknown as RoutesService);

      addRoutes1();
      addRoutes2();

      expect(mockRoutesService.add).toHaveBeenCalledTimes(2);
    });

    it('should return different functions for each call', () => {
      const addRoutes1 = configureRoutes(mockRoutesService as unknown as RoutesService);
      const addRoutes2 = configureRoutes(mockRoutesService as unknown as RoutesService);

      expect(addRoutes1).not.toBe(addRoutes2);
    });
  });
});
