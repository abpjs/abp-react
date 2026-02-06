/**
 * Tests for SaaS Route Provider
 * @abpjs/saas v3.0.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  SAAS_ROUTE_CONFIG,
  configureRoutes,
  initializeSaasRoutes,
  SAAS_ROUTE_PROVIDERS,
} from '../../../config/providers/route.provider';
import { eSaasRouteNames } from '../../../config/enums/route-names';

describe('SAAS_ROUTE_CONFIG', () => {
  it('should have correct path', () => {
    expect(SAAS_ROUTE_CONFIG.path).toBe('/saas');
  });

  it('should have correct name using eSaasRouteNames.Saas', () => {
    expect(SAAS_ROUTE_CONFIG.name).toBe(eSaasRouteNames.Saas);
    expect(SAAS_ROUTE_CONFIG.name).toBe('Saas::Menu:Saas');
  });

  it('should have correct icon class', () => {
    expect(SAAS_ROUTE_CONFIG.iconClass).toBe('fas fa-building');
  });

  it('should have correct order', () => {
    expect(SAAS_ROUTE_CONFIG.order).toBe(2);
  });

  it('should have correct required policy with OR condition', () => {
    expect(SAAS_ROUTE_CONFIG.requiredPolicy).toBe('Saas.Tenants || Saas.Editions');
  });

  describe('children routes', () => {
    it('should have exactly 2 children', () => {
      expect(SAAS_ROUTE_CONFIG.children).toHaveLength(2);
    });

    it('should have tenants route as first child', () => {
      const tenantsRoute = SAAS_ROUTE_CONFIG.children?.[0];
      expect(tenantsRoute?.path).toBe('tenants');
      expect(tenantsRoute?.name).toBe(eSaasRouteNames.Tenants);
      expect(tenantsRoute?.requiredPolicy).toBe('Saas.Tenants');
      expect(tenantsRoute?.order).toBe(1);
    });

    it('should have editions route as second child', () => {
      const editionsRoute = SAAS_ROUTE_CONFIG.children?.[1];
      expect(editionsRoute?.path).toBe('editions');
      expect(editionsRoute?.name).toBe(eSaasRouteNames.Editions);
      expect(editionsRoute?.requiredPolicy).toBe('Saas.Editions');
      expect(editionsRoute?.order).toBe(2);
    });
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
    const result = configureRoutes(mockRoutesService as any);
    expect(typeof result).toBe('function');
  });

  it('should not call add immediately', () => {
    configureRoutes(mockRoutesService as any);
    expect(mockRoutesService.add).not.toHaveBeenCalled();
  });

  it('should call add with SAAS_ROUTE_CONFIG when returned function is invoked', () => {
    const configure = configureRoutes(mockRoutesService as any);
    configure();
    expect(mockRoutesService.add).toHaveBeenCalledTimes(1);
    expect(mockRoutesService.add).toHaveBeenCalledWith([SAAS_ROUTE_CONFIG]);
  });
});

describe('initializeSaasRoutes', () => {
  let mockRoutesService: { add: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockRoutesService = {
      add: vi.fn(),
    };
  });

  it('should call add immediately', () => {
    initializeSaasRoutes(mockRoutesService as any);
    expect(mockRoutesService.add).toHaveBeenCalledTimes(1);
  });

  it('should call add with SAAS_ROUTE_CONFIG', () => {
    initializeSaasRoutes(mockRoutesService as any);
    expect(mockRoutesService.add).toHaveBeenCalledWith([SAAS_ROUTE_CONFIG]);
  });
});

describe('SAAS_ROUTE_PROVIDERS', () => {
  it('should have useFactory property', () => {
    expect(SAAS_ROUTE_PROVIDERS.useFactory).toBe(configureRoutes);
  });

  it('should have deps property', () => {
    expect(SAAS_ROUTE_PROVIDERS.deps).toEqual(['RoutesService']);
  });

  it('should have deps as a readonly tuple', () => {
    expect(Array.isArray(SAAS_ROUTE_PROVIDERS.deps)).toBe(true);
    expect(SAAS_ROUTE_PROVIDERS.deps).toHaveLength(1);
  });
});
