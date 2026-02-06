import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { eLayoutType } from '@abpjs/core';
import {
  configureRoutes,
  hideRoutes,
  SETTING_MANAGEMENT_ROUTE_PROVIDERS,
  initializeSettingManagementRoutes,
} from '../../../config/providers/route.provider';
import { eSettingManagementRouteNames } from '../../../config/enums/route-names';

// Mock @abpjs/core
const mockAdd = vi.fn();
const mockPatch = vi.fn();
const mockRoutesService = {
  add: mockAdd,
  patch: mockPatch,
};

const mockSettingTabsService = {
  visible: [] as unknown[],
};

vi.mock('@abpjs/core', async () => {
  const actual = await vi.importActual('@abpjs/core');
  return {
    ...actual,
    getRoutesService: vi.fn(() => mockRoutesService),
    getSettingTabsService: vi.fn(() => mockSettingTabsService),
  };
});

describe('config/providers/route.provider (v3.0.0)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSettingTabsService.visible = [];
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('configureRoutes', () => {
    it('should return a function', () => {
      const result = configureRoutes(mockRoutesService as any);
      expect(typeof result).toBe('function');
    });

    it('should not call routes.add until the returned function is called', () => {
      configureRoutes(mockRoutesService as any);
      expect(mockAdd).not.toHaveBeenCalled();
    });

    it('should call routes.add when the returned function is called', () => {
      const addRoutes = configureRoutes(mockRoutesService as any);
      addRoutes();
      expect(mockAdd).toHaveBeenCalledTimes(1);
    });

    it('should add the setting management route with correct path', () => {
      const addRoutes = configureRoutes(mockRoutesService as any);
      addRoutes();

      expect(mockAdd).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            path: '/setting-management',
          }),
        ])
      );
    });

    it('should add the route with correct name from eSettingManagementRouteNames', () => {
      const addRoutes = configureRoutes(mockRoutesService as any);
      addRoutes();

      expect(mockAdd).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            name: eSettingManagementRouteNames.Settings,
          }),
        ])
      );
    });

    it('should set parentName to Administration menu', () => {
      const addRoutes = configureRoutes(mockRoutesService as any);
      addRoutes();

      expect(mockAdd).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            parentName: 'AbpUiNavigation::Menu:Administration',
          }),
        ])
      );
    });

    it('should set layout to application', () => {
      const addRoutes = configureRoutes(mockRoutesService as any);
      addRoutes();

      expect(mockAdd).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            layout: eLayoutType.application,
          }),
        ])
      );
    });

    it('should set iconClass to bi bi-gear', () => {
      const addRoutes = configureRoutes(mockRoutesService as any);
      addRoutes();

      expect(mockAdd).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            iconClass: 'bi bi-gear',
          }),
        ])
      );
    });

    it('should set order to 100', () => {
      const addRoutes = configureRoutes(mockRoutesService as any);
      addRoutes();

      expect(mockAdd).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            order: 100,
          }),
        ])
      );
    });

    it('should add exactly one route', () => {
      const addRoutes = configureRoutes(mockRoutesService as any);
      addRoutes();

      const addCall = mockAdd.mock.calls[0][0];
      expect(addCall).toHaveLength(1);
    });
  });

  describe('hideRoutes', () => {
    it('should return a function', () => {
      const result = hideRoutes(mockRoutesService as any, mockSettingTabsService as any);
      expect(typeof result).toBe('function');
    });

    it('should not call routes.patch until the returned function is called', () => {
      hideRoutes(mockRoutesService as any, mockSettingTabsService as any);
      expect(mockPatch).not.toHaveBeenCalled();
    });

    it('should call routes.patch when visible tabs is empty', () => {
      mockSettingTabsService.visible = [];
      const hideIfEmpty = hideRoutes(mockRoutesService as any, mockSettingTabsService as any);
      hideIfEmpty();

      expect(mockPatch).toHaveBeenCalledTimes(1);
    });

    it('should call routes.patch when visible tabs is undefined', () => {
      mockSettingTabsService.visible = undefined as any;
      const hideIfEmpty = hideRoutes(mockRoutesService as any, mockSettingTabsService as any);
      hideIfEmpty();

      expect(mockPatch).toHaveBeenCalledTimes(1);
    });

    it('should patch the route with invisible: true', () => {
      mockSettingTabsService.visible = [];
      const hideIfEmpty = hideRoutes(mockRoutesService as any, mockSettingTabsService as any);
      hideIfEmpty();

      expect(mockPatch).toHaveBeenCalledWith(eSettingManagementRouteNames.Settings, {
        invisible: true,
      });
    });

    it('should NOT call routes.patch when there are visible tabs', () => {
      mockSettingTabsService.visible = [
        { name: 'Account', component: () => null, order: 1 },
      ];
      const hideIfEmpty = hideRoutes(mockRoutesService as any, mockSettingTabsService as any);
      hideIfEmpty();

      expect(mockPatch).not.toHaveBeenCalled();
    });

    it('should NOT call routes.patch when there are multiple visible tabs', () => {
      mockSettingTabsService.visible = [
        { name: 'Account', component: () => null, order: 1 },
        { name: 'Security', component: () => null, order: 2 },
      ];
      const hideIfEmpty = hideRoutes(mockRoutesService as any, mockSettingTabsService as any);
      hideIfEmpty();

      expect(mockPatch).not.toHaveBeenCalled();
    });
  });

  describe('SETTING_MANAGEMENT_ROUTE_PROVIDERS', () => {
    it('should be an object', () => {
      expect(typeof SETTING_MANAGEMENT_ROUTE_PROVIDERS).toBe('object');
    });

    it('should have configureRoutes function', () => {
      expect(SETTING_MANAGEMENT_ROUTE_PROVIDERS.configureRoutes).toBeDefined();
      expect(typeof SETTING_MANAGEMENT_ROUTE_PROVIDERS.configureRoutes).toBe('function');
    });

    it('should have hideRoutes function', () => {
      expect(SETTING_MANAGEMENT_ROUTE_PROVIDERS.hideRoutes).toBeDefined();
      expect(typeof SETTING_MANAGEMENT_ROUTE_PROVIDERS.hideRoutes).toBe('function');
    });

    it('configureRoutes should be the same as the exported function', () => {
      expect(SETTING_MANAGEMENT_ROUTE_PROVIDERS.configureRoutes).toBe(configureRoutes);
    });

    it('hideRoutes should be the same as the exported function', () => {
      expect(SETTING_MANAGEMENT_ROUTE_PROVIDERS.hideRoutes).toBe(hideRoutes);
    });

    it('should be usable for route configuration', () => {
      const addRoutes = SETTING_MANAGEMENT_ROUTE_PROVIDERS.configureRoutes(
        mockRoutesService as any
      );
      addRoutes();

      expect(mockAdd).toHaveBeenCalled();
    });
  });

  describe('initializeSettingManagementRoutes', () => {
    it('should be a function', () => {
      expect(typeof initializeSettingManagementRoutes).toBe('function');
    });

    it('should call configureRoutes and execute the returned function', () => {
      initializeSettingManagementRoutes();

      expect(mockAdd).toHaveBeenCalledTimes(1);
    });

    it('should call hideRoutes and execute the returned function', () => {
      mockSettingTabsService.visible = [];
      initializeSettingManagementRoutes();

      expect(mockPatch).toHaveBeenCalledTimes(1);
    });

    it('should add routes with correct configuration', () => {
      initializeSettingManagementRoutes();

      expect(mockAdd).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            path: '/setting-management',
            name: eSettingManagementRouteNames.Settings,
          }),
        ])
      );
    });

    it('should hide route when no tabs are registered', () => {
      mockSettingTabsService.visible = [];
      initializeSettingManagementRoutes();

      expect(mockPatch).toHaveBeenCalledWith(eSettingManagementRouteNames.Settings, {
        invisible: true,
      });
    });

    it('should not hide route when tabs are registered', () => {
      mockSettingTabsService.visible = [
        { name: 'Account', component: () => null, order: 1 },
      ];
      initializeSettingManagementRoutes();

      expect(mockPatch).not.toHaveBeenCalled();
    });
  });

  describe('integration scenarios', () => {
    it('should support typical initialization flow', () => {
      // Step 1: Configure routes
      const addRoutes = configureRoutes(mockRoutesService as any);
      addRoutes();
      expect(mockAdd).toHaveBeenCalledTimes(1);

      // Step 2: Hide if empty
      mockSettingTabsService.visible = [];
      const hideIfEmpty = hideRoutes(mockRoutesService as any, mockSettingTabsService as any);
      hideIfEmpty();
      expect(mockPatch).toHaveBeenCalledTimes(1);
    });

    it('should support flow with registered tabs', () => {
      // Register some tabs
      mockSettingTabsService.visible = [
        { name: 'Account', component: () => null, order: 1 },
        { name: 'Security', component: () => null, order: 2 },
      ];

      // Configure routes
      const addRoutes = configureRoutes(mockRoutesService as any);
      addRoutes();
      expect(mockAdd).toHaveBeenCalledTimes(1);

      // Hide should not patch since we have tabs
      const hideIfEmpty = hideRoutes(mockRoutesService as any, mockSettingTabsService as any);
      hideIfEmpty();
      expect(mockPatch).not.toHaveBeenCalled();
    });

    it('should allow multiple calls to configureRoutes', () => {
      const addRoutes1 = configureRoutes(mockRoutesService as any);
      const addRoutes2 = configureRoutes(mockRoutesService as any);

      addRoutes1();
      addRoutes2();

      expect(mockAdd).toHaveBeenCalledTimes(2);
    });
  });
});
