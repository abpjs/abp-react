/**
 * Tests for route.provider.ts
 * @since 3.0.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  TEXT_TEMPLATE_MANAGEMENT_ROUTE_CONFIG,
  TEXT_TEMPLATE_MANAGEMENT_ROUTE_PROVIDERS,
  configureRoutes,
  initializeTextTemplateManagementRoutes,
} from '../../../config/providers/route.provider';
import { eTextTemplateManagementRouteNames } from '../../../config/enums/route-names';
import { eTextTemplateManagementPolicyNames } from '../../../config/enums/policy-names';

describe('Route Provider', () => {
  describe('TEXT_TEMPLATE_MANAGEMENT_ROUTE_CONFIG', () => {
    it('should have correct path', () => {
      expect(TEXT_TEMPLATE_MANAGEMENT_ROUTE_CONFIG.path).toBe(
        '/text-template-management',
      );
    });

    it('should have correct name from route names enum', () => {
      expect(TEXT_TEMPLATE_MANAGEMENT_ROUTE_CONFIG.name).toBe(
        eTextTemplateManagementRouteNames.TextTemplates,
      );
    });

    it('should have icon class', () => {
      expect(TEXT_TEMPLATE_MANAGEMENT_ROUTE_CONFIG.iconClass).toBe(
        'fas fa-file-alt',
      );
    });

    it('should have order property', () => {
      expect(TEXT_TEMPLATE_MANAGEMENT_ROUTE_CONFIG.order).toBe(100);
    });

    it('should have required policy from policy names enum', () => {
      expect(TEXT_TEMPLATE_MANAGEMENT_ROUTE_CONFIG.requiredPolicy).toBe(
        eTextTemplateManagementPolicyNames.TextTemplates,
      );
    });

    it('should be a valid ABP.Route object', () => {
      expect(TEXT_TEMPLATE_MANAGEMENT_ROUTE_CONFIG).toHaveProperty('path');
      expect(TEXT_TEMPLATE_MANAGEMENT_ROUTE_CONFIG).toHaveProperty('name');
      expect(typeof TEXT_TEMPLATE_MANAGEMENT_ROUTE_CONFIG.path).toBe('string');
      expect(typeof TEXT_TEMPLATE_MANAGEMENT_ROUTE_CONFIG.name).toBe('string');
    });
  });

  describe('configureRoutes', () => {
    let mockRoutesService: { add: ReturnType<typeof vi.fn> };

    beforeEach(() => {
      mockRoutesService = {
        add: vi.fn(),
      };
    });

    it('should return a function', () => {
      const result = configureRoutes(mockRoutesService as never);
      expect(typeof result).toBe('function');
    });

    it('should not call add immediately', () => {
      configureRoutes(mockRoutesService as never);
      expect(mockRoutesService.add).not.toHaveBeenCalled();
    });

    it('should call add when returned function is invoked', () => {
      const configure = configureRoutes(mockRoutesService as never);
      configure();
      expect(mockRoutesService.add).toHaveBeenCalledTimes(1);
    });

    it('should pass route config array to add', () => {
      const configure = configureRoutes(mockRoutesService as never);
      configure();
      expect(mockRoutesService.add).toHaveBeenCalledWith([
        TEXT_TEMPLATE_MANAGEMENT_ROUTE_CONFIG,
      ]);
    });
  });

  describe('initializeTextTemplateManagementRoutes', () => {
    let mockRoutesService: { add: ReturnType<typeof vi.fn> };

    beforeEach(() => {
      mockRoutesService = {
        add: vi.fn(),
      };
    });

    it('should immediately configure routes', () => {
      initializeTextTemplateManagementRoutes(mockRoutesService as never);
      expect(mockRoutesService.add).toHaveBeenCalledTimes(1);
    });

    it('should pass correct route config', () => {
      initializeTextTemplateManagementRoutes(mockRoutesService as never);
      expect(mockRoutesService.add).toHaveBeenCalledWith([
        TEXT_TEMPLATE_MANAGEMENT_ROUTE_CONFIG,
      ]);
    });
  });

  describe('TEXT_TEMPLATE_MANAGEMENT_ROUTE_PROVIDERS', () => {
    it('should have useFactory property', () => {
      expect(TEXT_TEMPLATE_MANAGEMENT_ROUTE_PROVIDERS.useFactory).toBe(
        configureRoutes,
      );
    });

    it('should have deps array with RoutesService', () => {
      expect(TEXT_TEMPLATE_MANAGEMENT_ROUTE_PROVIDERS.deps).toContain(
        'RoutesService',
      );
    });

    it('should have deps as readonly array', () => {
      expect(Array.isArray(TEXT_TEMPLATE_MANAGEMENT_ROUTE_PROVIDERS.deps)).toBe(
        true,
      );
      expect(TEXT_TEMPLATE_MANAGEMENT_ROUTE_PROVIDERS.deps).toHaveLength(1);
    });
  });
});
