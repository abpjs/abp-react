/**
 * Tests for SaaS Proxy Index exports
 * @since 3.2.0
 */

import { describe, it, expect } from 'vitest';
import * as proxy from '../../proxy';

describe('Proxy Index Exports', () => {
  describe('Re-exports from host', () => {
    it('should export EditionService', () => {
      expect(proxy.EditionService).toBeDefined();
      expect(typeof proxy.EditionService).toBe('function');
    });

    it('should export TenantService', () => {
      expect(proxy.TenantService).toBeDefined();
      expect(typeof proxy.TenantService).toBe('function');
    });
  });

  describe('EditionService class', () => {
    it('should be constructable with restService', () => {
      const mockRestService = { request: () => Promise.resolve({}) };
      const service = new proxy.EditionService(mockRestService as any);
      expect(service).toBeInstanceOf(proxy.EditionService);
    });

    it('should have expected methods', () => {
      const mockRestService = { request: () => Promise.resolve({}) };
      const service = new proxy.EditionService(mockRestService as any);

      expect(typeof service.create).toBe('function');
      expect(typeof service.delete).toBe('function');
      expect(typeof service.get).toBe('function');
      expect(typeof service.getList).toBe('function');
      expect(typeof service.getUsageStatistics).toBe('function');
      expect(typeof service.update).toBe('function');
    });

    it('should have apiName property', () => {
      const mockRestService = { request: () => Promise.resolve({}) };
      const service = new proxy.EditionService(mockRestService as any);
      expect(service.apiName).toBe('default');
    });
  });

  describe('TenantService class', () => {
    it('should be constructable with restService', () => {
      const mockRestService = { request: () => Promise.resolve({}) };
      const service = new proxy.TenantService(mockRestService as any);
      expect(service).toBeInstanceOf(proxy.TenantService);
    });

    it('should have expected methods', () => {
      const mockRestService = { request: () => Promise.resolve({}) };
      const service = new proxy.TenantService(mockRestService as any);

      expect(typeof service.create).toBe('function');
      expect(typeof service.delete).toBe('function');
      expect(typeof service.deleteDefaultConnectionString).toBe('function');
      expect(typeof service.get).toBe('function');
      expect(typeof service.getDefaultConnectionString).toBe('function');
      expect(typeof service.getList).toBe('function');
      expect(typeof service.update).toBe('function');
      expect(typeof service.updateDefaultConnectionString).toBe('function');
    });

    it('should have apiName property', () => {
      const mockRestService = { request: () => Promise.resolve({}) };
      const service = new proxy.TenantService(mockRestService as any);
      expect(service.apiName).toBe('default');
    });
  });

  describe('Module structure', () => {
    it('should export at least 2 services', () => {
      const exportedServices = Object.keys(proxy).filter(
        key => key.endsWith('Service')
      );
      expect(exportedServices.length).toBeGreaterThanOrEqual(2);
    });

    it('should export all expected members', () => {
      const expectedExports = ['EditionService', 'TenantService'];
      for (const exportName of expectedExports) {
        expect(proxy).toHaveProperty(exportName);
      }
    });
  });
});
