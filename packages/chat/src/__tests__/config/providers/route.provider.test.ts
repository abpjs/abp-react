/**
 * Tests for route.provider
 * @abpjs/chat v3.0.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  configureRoutes,
  initializeChatRoutes,
  CHAT_ROUTE_PROVIDERS,
} from '../../../config/providers/route.provider';
import { eChatRouteNames } from '../../../config/enums/route-names';
import { eChatPolicyNames } from '../../../config/enums/policy-names';

// Mock @abpjs/core
vi.mock('@abpjs/core', () => ({
  getRoutesService: vi.fn(() => ({
    add: vi.fn(),
  })),
  eLayoutType: {
    application: 'application',
    empty: 'empty',
    account: 'account',
  },
}));

describe('route.provider (v3.0.0)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('configureRoutes', () => {
    it('should return a function', () => {
      const mockRoutesService = { add: vi.fn() };
      const result = configureRoutes(mockRoutesService as any);
      expect(typeof result).toBe('function');
    });

    it('should call routes.add when returned function is invoked', () => {
      const mockAdd = vi.fn();
      const mockRoutesService = { add: mockAdd };

      const addRoutes = configureRoutes(mockRoutesService as any);
      addRoutes();

      expect(mockAdd).toHaveBeenCalledTimes(1);
    });

    it('should add route with correct configuration', () => {
      const mockAdd = vi.fn();
      const mockRoutesService = { add: mockAdd };

      const addRoutes = configureRoutes(mockRoutesService as any);
      addRoutes();

      expect(mockAdd).toHaveBeenCalledWith([
        expect.objectContaining({
          path: '/chat',
          name: eChatRouteNames.Chat,
          requiredPolicy: eChatPolicyNames.Messaging,
          layout: 'application',
          iconClass: 'fas fa-envelope',
          invisible: true,
        }),
      ]);
    });

    it('should set route as invisible', () => {
      const mockAdd = vi.fn();
      const mockRoutesService = { add: mockAdd };

      const addRoutes = configureRoutes(mockRoutesService as any);
      addRoutes();

      const routeConfig = mockAdd.mock.calls[0][0][0];
      expect(routeConfig.invisible).toBe(true);
    });

    it('should use application layout', () => {
      const mockAdd = vi.fn();
      const mockRoutesService = { add: mockAdd };

      const addRoutes = configureRoutes(mockRoutesService as any);
      addRoutes();

      const routeConfig = mockAdd.mock.calls[0][0][0];
      expect(routeConfig.layout).toBe('application');
    });
  });

  describe('initializeChatRoutes', () => {
    it('should return a function', () => {
      const result = initializeChatRoutes();
      expect(typeof result).toBe('function');
    });

    it('should use global RoutesService', async () => {
      const { getRoutesService } = await import('@abpjs/core');

      initializeChatRoutes();

      expect(getRoutesService).toHaveBeenCalled();
    });

    it('returned function should not throw', () => {
      const addRoutes = initializeChatRoutes();
      expect(() => addRoutes()).not.toThrow();
    });
  });

  describe('CHAT_ROUTE_PROVIDERS', () => {
    it('should be an object', () => {
      expect(typeof CHAT_ROUTE_PROVIDERS).toBe('object');
    });

    it('should have configureRoutes function', () => {
      expect(CHAT_ROUTE_PROVIDERS.configureRoutes).toBeDefined();
      expect(typeof CHAT_ROUTE_PROVIDERS.configureRoutes).toBe('function');
    });

    it('configureRoutes should be the same as exported function', () => {
      expect(CHAT_ROUTE_PROVIDERS.configureRoutes).toBe(configureRoutes);
    });
  });
});
