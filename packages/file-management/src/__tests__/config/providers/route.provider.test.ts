/**
 * Tests for route.provider
 * @abpjs/file-management v3.2.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  configureRoutes,
  FILE_MANAGEMENT_ROUTE_PROVIDERS,
  initializeFileManagementRoutes,
} from '../../../config/providers/route.provider';
import { eFileManagementRouteNames } from '../../../config/enums/route-names';
import { eFileManagementPolicyNames } from '../../../config/enums/policy-names';

// Mock @abpjs/core
vi.mock('@abpjs/core', () => ({
  getRoutesService: vi.fn(() => ({
    add: vi.fn(),
    patch: vi.fn(),
  })),
  eLayoutType: {
    application: 'application',
    empty: 'empty',
    account: 'account',
  },
}));

describe('route.provider', () => {
  let mockRoutesService: {
    add: ReturnType<typeof vi.fn>;
    patch: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockRoutesService = {
      add: vi.fn(),
      patch: vi.fn(),
    };
  });

  describe('configureRoutes', () => {
    it('should return a function', () => {
      const result = configureRoutes(mockRoutesService as any);
      expect(typeof result).toBe('function');
    });

    it('should call routes.add when returned function is invoked', () => {
      const addRoutes = configureRoutes(mockRoutesService as any);
      addRoutes();
      expect(mockRoutesService.add).toHaveBeenCalledTimes(1);
    });

    it('should add file management route with correct configuration', () => {
      const addRoutes = configureRoutes(mockRoutesService as any);
      addRoutes();

      expect(mockRoutesService.add).toHaveBeenCalledWith([
        expect.objectContaining({
          path: '/file-management',
          name: eFileManagementRouteNames.FileManagement,
          parentName: 'AbpUiNavigation::Menu:Administration',
          layout: 'application',
          iconClass: 'bi bi-folder',
          order: 30,
          requiredPolicy: eFileManagementPolicyNames.DirectoryDescriptor,
        }),
      ]);
    });

    it('should set correct path for file management route', () => {
      const addRoutes = configureRoutes(mockRoutesService as any);
      addRoutes();

      const addCall = mockRoutesService.add.mock.calls[0][0];
      expect(addCall[0].path).toBe('/file-management');
    });

    it('should set correct icon class', () => {
      const addRoutes = configureRoutes(mockRoutesService as any);
      addRoutes();

      const addCall = mockRoutesService.add.mock.calls[0][0];
      expect(addCall[0].iconClass).toBe('bi bi-folder');
    });

    it('should set order to 30', () => {
      const addRoutes = configureRoutes(mockRoutesService as any);
      addRoutes();

      const addCall = mockRoutesService.add.mock.calls[0][0];
      expect(addCall[0].order).toBe(30);
    });

    it('should require DirectoryDescriptor policy', () => {
      const addRoutes = configureRoutes(mockRoutesService as any);
      addRoutes();

      const addCall = mockRoutesService.add.mock.calls[0][0];
      expect(addCall[0].requiredPolicy).toBe('FileManagement.DirectoryDescriptor');
    });
  });

  describe('FILE_MANAGEMENT_ROUTE_PROVIDERS', () => {
    it('should be an object', () => {
      expect(typeof FILE_MANAGEMENT_ROUTE_PROVIDERS).toBe('object');
    });

    it('should have configureRoutes function', () => {
      expect(FILE_MANAGEMENT_ROUTE_PROVIDERS.configureRoutes).toBeDefined();
      expect(typeof FILE_MANAGEMENT_ROUTE_PROVIDERS.configureRoutes).toBe('function');
    });

    it('configureRoutes should work the same as standalone function', () => {
      const addRoutes = FILE_MANAGEMENT_ROUTE_PROVIDERS.configureRoutes(mockRoutesService as any);
      addRoutes();

      expect(mockRoutesService.add).toHaveBeenCalledTimes(1);
      expect(mockRoutesService.add).toHaveBeenCalledWith([
        expect.objectContaining({
          path: '/file-management',
        }),
      ]);
    });
  });

  describe('initializeFileManagementRoutes', () => {
    it('should be a function', () => {
      expect(typeof initializeFileManagementRoutes).toBe('function');
    });

    it('should call getRoutesService and add routes', async () => {
      const { getRoutesService } = await import('@abpjs/core');

      initializeFileManagementRoutes();

      expect(getRoutesService).toHaveBeenCalled();
    });
  });
});
