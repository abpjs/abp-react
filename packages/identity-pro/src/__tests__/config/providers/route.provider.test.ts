/**
 * Tests for Identity Route Provider
 * @abpjs/identity-pro v3.0.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock @abpjs/core
vi.mock('@abpjs/core', () => ({
  getRoutesService: vi.fn(),
  eLayoutType: {
    application: 'application',
    account: 'account',
    empty: 'empty',
  },
}));

import { getRoutesService, eLayoutType } from '@abpjs/core';
import {
  configureRoutes,
  initializeIdentityRoutes,
  IDENTITY_ROUTE_PROVIDERS,
} from '../../../config/providers/route.provider';
import { eIdentityRouteNames } from '../../../config/enums/route-names';
import { eIdentityPolicyNames } from '../../../config/enums/policy-names';

describe('configureRoutes', () => {
  let mockRoutesService: { add: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockRoutesService = {
      add: vi.fn(),
    };
    vi.clearAllMocks();
  });

  it('should return a function', () => {
    const result = configureRoutes(mockRoutesService as any);
    expect(typeof result).toBe('function');
  });

  it('should not add routes until the returned function is called', () => {
    configureRoutes(mockRoutesService as any);
    expect(mockRoutesService.add).not.toHaveBeenCalled();
  });

  it('should add routes when the returned function is called', () => {
    const initFn = configureRoutes(mockRoutesService as any);
    initFn();
    expect(mockRoutesService.add).toHaveBeenCalledTimes(1);
  });

  it('should add identity management parent route', () => {
    const initFn = configureRoutes(mockRoutesService as any);
    initFn();

    const addedRoutes = mockRoutesService.add.mock.calls[0][0];
    expect(addedRoutes).toHaveLength(1);

    const parentRoute = addedRoutes[0];
    expect(parentRoute.path).toBe('/identity');
    expect(parentRoute.name).toBe(eIdentityRouteNames.IdentityManagement);
    expect(parentRoute.requiredPolicy).toBe(eIdentityPolicyNames.IdentityManagement);
    expect(parentRoute.layout).toBe(eLayoutType.application);
    expect(parentRoute.iconClass).toBe('fas fa-id-card-o');
    expect(parentRoute.order).toBe(1);
  });

  it('should add child routes for Roles, Users, ClaimTypes, OrganizationUnits', () => {
    const initFn = configureRoutes(mockRoutesService as any);
    initFn();

    const addedRoutes = mockRoutesService.add.mock.calls[0][0];
    const parentRoute = addedRoutes[0];
    expect(parentRoute.children).toBeDefined();
    expect(parentRoute.children).toHaveLength(4);

    // Verify Roles route
    const rolesRoute = parentRoute.children.find((r: any) => r.name === eIdentityRouteNames.Roles);
    expect(rolesRoute).toBeDefined();
    expect(rolesRoute.path).toBe('/identity/roles');
    expect(rolesRoute.requiredPolicy).toBe(eIdentityPolicyNames.Roles);
    expect(rolesRoute.order).toBe(1);

    // Verify Users route
    const usersRoute = parentRoute.children.find((r: any) => r.name === eIdentityRouteNames.Users);
    expect(usersRoute).toBeDefined();
    expect(usersRoute.path).toBe('/identity/users');
    expect(usersRoute.requiredPolicy).toBe(eIdentityPolicyNames.Users);
    expect(usersRoute.order).toBe(2);

    // Verify ClaimTypes route
    const claimsRoute = parentRoute.children.find((r: any) => r.name === eIdentityRouteNames.ClaimTypes);
    expect(claimsRoute).toBeDefined();
    expect(claimsRoute.path).toBe('/identity/claim-types');
    expect(claimsRoute.requiredPolicy).toBe(eIdentityPolicyNames.ClaimTypes);
    expect(claimsRoute.order).toBe(3);

    // Verify OrganizationUnits route
    const orgUnitsRoute = parentRoute.children.find((r: any) => r.name === eIdentityRouteNames.OrganizationUnits);
    expect(orgUnitsRoute).toBeDefined();
    expect(orgUnitsRoute.path).toBe('/identity/organization-units');
    expect(orgUnitsRoute.requiredPolicy).toBe(eIdentityPolicyNames.OrganizationUnits);
    expect(orgUnitsRoute.order).toBe(4);
  });
});

describe('initializeIdentityRoutes', () => {
  let mockRoutesService: { add: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockRoutesService = {
      add: vi.fn(),
    };
    vi.mocked(getRoutesService).mockReturnValue(mockRoutesService as any);
    vi.clearAllMocks();
  });

  it('should get the global routes service', () => {
    initializeIdentityRoutes();
    expect(getRoutesService).toHaveBeenCalled();
  });

  it('should return a function', () => {
    const result = initializeIdentityRoutes();
    expect(typeof result).toBe('function');
  });

  it('should add routes when the returned function is called', () => {
    const initFn = initializeIdentityRoutes();
    initFn();
    expect(mockRoutesService.add).toHaveBeenCalledTimes(1);
  });
});

describe('IDENTITY_ROUTE_PROVIDERS', () => {
  it('should export configureRoutes', () => {
    expect(IDENTITY_ROUTE_PROVIDERS.configureRoutes).toBe(configureRoutes);
  });

  it('should have configureRoutes as a function', () => {
    expect(typeof IDENTITY_ROUTE_PROVIDERS.configureRoutes).toBe('function');
  });
});
