import { describe, it, expect, beforeEach, vi } from 'vitest';
import { eThemeSharedRouteNames } from '../enums/route-names';

// Create mock outside describe block
const mockAdd = vi.fn();
const mockRoutesService = { add: mockAdd };

// Mock @abpjs/core
vi.mock('@abpjs/core', () => ({
  RoutesService: vi.fn().mockImplementation(() => mockRoutesService),
  getRoutesService: vi.fn(() => mockRoutesService),
}));

describe('Route Provider (v3.0.0)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('configureRoutes', () => {
    it('should return a function', async () => {
      const { configureRoutes } = await import('../providers/route.provider');
      const mockService = { add: vi.fn() };
      const result = configureRoutes(mockService as any);

      expect(typeof result).toBe('function');
    });

    it('should not call routes.add until returned function is invoked', async () => {
      const { configureRoutes } = await import('../providers/route.provider');
      const mockService = { add: vi.fn() };
      configureRoutes(mockService as any);

      expect(mockService.add).not.toHaveBeenCalled();
    });

    it('should call routes.add when returned function is invoked', async () => {
      const { configureRoutes } = await import('../providers/route.provider');
      const mockService = { add: vi.fn() };
      const configure = configureRoutes(mockService as any);

      configure();

      expect(mockService.add).toHaveBeenCalledTimes(1);
    });

    it('should add Administration route with correct name', async () => {
      const { configureRoutes } = await import('../providers/route.provider');
      const mockService = { add: vi.fn() };
      const configure = configureRoutes(mockService as any);

      configure();

      const addedRoutes = mockService.add.mock.calls[0][0];
      expect(addedRoutes).toHaveLength(1);
      expect(addedRoutes[0].name).toBe(eThemeSharedRouteNames.Administration);
    });

    it('should add Administration route with empty path', async () => {
      const { configureRoutes } = await import('../providers/route.provider');
      const mockService = { add: vi.fn() };
      const configure = configureRoutes(mockService as any);

      configure();

      const addedRoutes = mockService.add.mock.calls[0][0];
      expect(addedRoutes[0].path).toBe('');
    });

    it('should add Administration route with order 100', async () => {
      const { configureRoutes } = await import('../providers/route.provider');
      const mockService = { add: vi.fn() };
      const configure = configureRoutes(mockService as any);

      configure();

      const addedRoutes = mockService.add.mock.calls[0][0];
      expect(addedRoutes[0].order).toBe(100);
    });

    it('should add Administration route with wrench icon', async () => {
      const { configureRoutes } = await import('../providers/route.provider');
      const mockService = { add: vi.fn() };
      const configure = configureRoutes(mockService as any);

      configure();

      const addedRoutes = mockService.add.mock.calls[0][0];
      expect(addedRoutes[0].iconClass).toBe('fa fa-wrench');
    });

    it('should add complete Administration route configuration', async () => {
      const { configureRoutes } = await import('../providers/route.provider');
      const mockService = { add: vi.fn() };
      const configure = configureRoutes(mockService as any);

      configure();

      const addedRoutes = mockService.add.mock.calls[0][0];
      expect(addedRoutes[0]).toEqual({
        name: eThemeSharedRouteNames.Administration,
        path: '',
        order: 100,
        iconClass: 'fa fa-wrench',
      });
    });

    it('should allow multiple calls to the returned function', async () => {
      const { configureRoutes } = await import('../providers/route.provider');
      const mockService = { add: vi.fn() };
      const configure = configureRoutes(mockService as any);

      configure();
      configure();
      configure();

      expect(mockService.add).toHaveBeenCalledTimes(3);
    });
  });

  describe('THEME_SHARED_ROUTE_PROVIDERS', () => {
    it('should export configureRoutes function', async () => {
      const { THEME_SHARED_ROUTE_PROVIDERS, configureRoutes } = await import('../providers/route.provider');
      expect(THEME_SHARED_ROUTE_PROVIDERS).toHaveProperty('configureRoutes');
      expect(THEME_SHARED_ROUTE_PROVIDERS.configureRoutes).toBe(configureRoutes);
    });

    it('should be an object', async () => {
      const { THEME_SHARED_ROUTE_PROVIDERS } = await import('../providers/route.provider');
      expect(typeof THEME_SHARED_ROUTE_PROVIDERS).toBe('object');
    });

    it('should have configureRoutes as the only property', async () => {
      const { THEME_SHARED_ROUTE_PROVIDERS } = await import('../providers/route.provider');
      const keys = Object.keys(THEME_SHARED_ROUTE_PROVIDERS);
      expect(keys).toEqual(['configureRoutes']);
    });
  });

  describe('initializeThemeSharedRoutes', () => {
    it('should configure routes using the mock service', async () => {
      const { initializeThemeSharedRoutes } = await import('../providers/route.provider');

      initializeThemeSharedRoutes();

      expect(mockAdd).toHaveBeenCalledTimes(1);
    });

    it('should add Administration route when called', async () => {
      const { initializeThemeSharedRoutes } = await import('../providers/route.provider');

      initializeThemeSharedRoutes();

      const addedRoutes = mockAdd.mock.calls[0][0];
      expect(addedRoutes[0].name).toBe(eThemeSharedRouteNames.Administration);
    });

    it('should be idempotent - can be called multiple times', async () => {
      const { initializeThemeSharedRoutes } = await import('../providers/route.provider');

      initializeThemeSharedRoutes();
      initializeThemeSharedRoutes();
      initializeThemeSharedRoutes();

      // Each call should invoke add (caller is responsible for preventing duplicates)
      expect(mockAdd).toHaveBeenCalledTimes(3);
    });

    it('should not return anything', async () => {
      const { initializeThemeSharedRoutes } = await import('../providers/route.provider');

      const result = initializeThemeSharedRoutes();

      expect(result).toBeUndefined();
    });
  });

  describe('integration with eThemeSharedRouteNames', () => {
    it('should use correct Administration route name value', async () => {
      const { configureRoutes } = await import('../providers/route.provider');
      const mockService = { add: vi.fn() };
      const configure = configureRoutes(mockService as any);

      configure();

      const addedRoutes = mockService.add.mock.calls[0][0];
      expect(addedRoutes[0].name).toBe('AbpUiNavigation::Menu:Administration');
    });
  });
});
