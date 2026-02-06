/**
 * Tests for config/providers/route.provider
 * @abpjs/audit-logging v3.0.0
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  configureRoutes,
  AUDIT_LOGGING_ROUTE_PROVIDERS,
  initializeAuditLoggingRoutes,
} from '../../../config/providers/route.provider';
import { eAuditLoggingRouteNames } from '../../../config/enums/route-names';
import { eAuditLoggingPolicyNames } from '../../../config/enums/policy-names';
import { RoutesService } from '@abpjs/core';

// Mock the @abpjs/core module
vi.mock('@abpjs/core', async () => {
  const actual = await vi.importActual('@abpjs/core');

  // Create a mock RoutesService class
  class MockRoutesService {
    private routes: any[] = [];

    add(routes: any[]): void {
      this.routes.push(...routes);
    }

    getRoutes(): any[] {
      return this.routes;
    }

    static getInstance(): MockRoutesService {
      return new MockRoutesService();
    }
  }

  return {
    ...actual,
    RoutesService: MockRoutesService,
    getRoutesService: vi.fn(() => new MockRoutesService()),
    eLayoutType: {
      account: 'account',
      application: 'application',
      empty: 'empty',
    },
  };
});

describe('route.provider (v3.0.0)', () => {
  let mockRoutesService: any;

  beforeEach(() => {
    mockRoutesService = {
      add: vi.fn(),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('configureRoutes', () => {
    it('should return a function', () => {
      const result = configureRoutes(mockRoutesService);
      expect(typeof result).toBe('function');
    });

    it('should add routes when the returned function is called', () => {
      const addRoutes = configureRoutes(mockRoutesService);
      addRoutes();
      expect(mockRoutesService.add).toHaveBeenCalledTimes(1);
    });

    it('should add audit logging route with correct configuration', () => {
      const addRoutes = configureRoutes(mockRoutesService);
      addRoutes();

      expect(mockRoutesService.add).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            path: '/audit-logging',
            name: eAuditLoggingRouteNames.AuditLogging,
            parentName: 'AbpUiNavigation::Menu:Administration',
            requiredPolicy: eAuditLoggingPolicyNames.AuditLogging,
          }),
        ])
      );
    });

    it('should configure route with application layout', () => {
      const addRoutes = configureRoutes(mockRoutesService);
      addRoutes();

      expect(mockRoutesService.add).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            layout: 'application',
          }),
        ])
      );
    });

    it('should configure route with icon class', () => {
      const addRoutes = configureRoutes(mockRoutesService);
      addRoutes();

      expect(mockRoutesService.add).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            iconClass: 'fas fa-file-alt',
          }),
        ])
      );
    });

    it('should configure route with order', () => {
      const addRoutes = configureRoutes(mockRoutesService);
      addRoutes();

      expect(mockRoutesService.add).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            order: 6,
          }),
        ])
      );
    });
  });

  describe('AUDIT_LOGGING_ROUTE_PROVIDERS', () => {
    it('should export configureRoutes function', () => {
      expect(AUDIT_LOGGING_ROUTE_PROVIDERS.configureRoutes).toBe(configureRoutes);
    });

    it('should be an object with configureRoutes property', () => {
      expect(typeof AUDIT_LOGGING_ROUTE_PROVIDERS).toBe('object');
      expect(AUDIT_LOGGING_ROUTE_PROVIDERS).toHaveProperty('configureRoutes');
    });
  });

  describe('initializeAuditLoggingRoutes', () => {
    it('should return a function', () => {
      const result = initializeAuditLoggingRoutes();
      expect(typeof result).toBe('function');
    });

    it('should call the returned function to add routes', () => {
      const addRoutes = initializeAuditLoggingRoutes();
      // Should not throw when called
      expect(() => addRoutes()).not.toThrow();
    });
  });
});
