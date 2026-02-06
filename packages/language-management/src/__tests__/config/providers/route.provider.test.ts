/**
 * Tests for Language Management Route Provider
 * @abpjs/language-management v3.0.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  configureRoutes,
  initializeLanguageManagementRoutes,
  LANGUAGE_MANAGEMENT_ROUTE_PROVIDERS,
} from '../../../config/providers/route.provider';
import { eLanguageManagementRouteNames } from '../../../config/enums/route-names';
import { eLanguageManagementPolicyNames } from '../../../config/enums/policy-names';

// Mock @abpjs/core
vi.mock('@abpjs/core', () => ({
  getRoutesService: vi.fn(() => ({
    add: vi.fn(),
  })),
  eLayoutType: {
    application: 'application',
    account: 'account',
    empty: 'empty',
  },
}));

describe('configureRoutes', () => {
  let mockRoutesService: { add: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    vi.clearAllMocks();
    mockRoutesService = { add: vi.fn() };
  });

  it('should return a function', () => {
    const result = configureRoutes(mockRoutesService as any);
    expect(typeof result).toBe('function');
  });

  it('should call routes.add when the returned function is invoked', () => {
    const configureFn = configureRoutes(mockRoutesService as any);
    configureFn();
    expect(mockRoutesService.add).toHaveBeenCalledTimes(1);
  });

  it('should add the correct route configuration', () => {
    const configureFn = configureRoutes(mockRoutesService as any);
    configureFn();

    const addedRoutes = mockRoutesService.add.mock.calls[0][0];
    expect(addedRoutes).toHaveLength(1);

    const parentRoute = addedRoutes[0];
    expect(parentRoute.path).toBe('/language-management');
    expect(parentRoute.name).toBe(eLanguageManagementRouteNames.LanguageManagement);
    expect(parentRoute.requiredPolicy).toBe(eLanguageManagementPolicyNames.LanguageManagement);
    expect(parentRoute.layout).toBe('application');
    expect(parentRoute.iconClass).toBe('fas fa-globe');
    expect(parentRoute.order).toBe(6);
  });

  it('should add child routes for Languages and LanguageTexts', () => {
    const configureFn = configureRoutes(mockRoutesService as any);
    configureFn();

    const parentRoute = mockRoutesService.add.mock.calls[0][0][0];
    expect(parentRoute.children).toHaveLength(2);

    const [languagesRoute, textsRoute] = parentRoute.children;

    // Languages route
    expect(languagesRoute.path).toBe('/language-management/languages');
    expect(languagesRoute.name).toBe(eLanguageManagementRouteNames.Languages);
    expect(languagesRoute.requiredPolicy).toBe(eLanguageManagementPolicyNames.Languages);
    expect(languagesRoute.order).toBe(1);

    // LanguageTexts route
    expect(textsRoute.path).toBe('/language-management/texts');
    expect(textsRoute.name).toBe(eLanguageManagementRouteNames.LanguageTexts);
    expect(textsRoute.requiredPolicy).toBe(eLanguageManagementPolicyNames.LanguageTexts);
    expect(textsRoute.order).toBe(2);
  });
});

describe('initializeLanguageManagementRoutes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return a function', () => {
    const result = initializeLanguageManagementRoutes();
    expect(typeof result).toBe('function');
  });

  it('should use the global RoutesService', async () => {
    const { getRoutesService } = await import('@abpjs/core');
    initializeLanguageManagementRoutes();
    expect(getRoutesService).toHaveBeenCalled();
  });

  it('should call routes.add when the returned function is invoked', async () => {
    const { getRoutesService } = await import('@abpjs/core');
    const mockService = { add: vi.fn() };
    (getRoutesService as any).mockReturnValue(mockService);

    const initFn = initializeLanguageManagementRoutes();
    initFn();

    expect(mockService.add).toHaveBeenCalled();
  });
});

describe('LANGUAGE_MANAGEMENT_ROUTE_PROVIDERS', () => {
  it('should be defined', () => {
    expect(LANGUAGE_MANAGEMENT_ROUTE_PROVIDERS).toBeDefined();
  });

  it('should have configureRoutes function', () => {
    expect(LANGUAGE_MANAGEMENT_ROUTE_PROVIDERS.configureRoutes).toBe(configureRoutes);
    expect(typeof LANGUAGE_MANAGEMENT_ROUTE_PROVIDERS.configureRoutes).toBe('function');
  });
});
