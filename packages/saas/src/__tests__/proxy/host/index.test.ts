/**
 * Tests for SaaS Proxy Host Index exports
 * @since 3.2.0
 */

import { describe, it, expect } from 'vitest';
import * as host from '../../../proxy/host';

describe('Proxy Host Index Exports', () => {
  describe('Service Exports', () => {
    it('should export EditionService', () => {
      expect(host.EditionService).toBeDefined();
      expect(typeof host.EditionService).toBe('function');
    });

    it('should export TenantService', () => {
      expect(host.TenantService).toBeDefined();
      expect(typeof host.TenantService).toBe('function');
    });
  });

  describe('DTO Type Exports (runtime check)', () => {
    it('should export DTO types via TypeScript module system', () => {
      // DTOs are type-only exports, so we verify the module structure
      // by checking that the index module can be imported
      expect(host).toBeDefined();
    });
  });

  describe('Module Structure', () => {
    it('should export EditionService class with correct prototype', () => {
      const mockRestService = { request: () => Promise.resolve({}) };
      const service = new host.EditionService(mockRestService as any);

      expect(service.constructor.name).toBe('EditionService');
      expect(service.apiName).toBe('default');
    });

    it('should export TenantService class with correct prototype', () => {
      const mockRestService = { request: () => Promise.resolve({}) };
      const service = new host.TenantService(mockRestService as any);

      expect(service.constructor.name).toBe('TenantService');
      expect(service.apiName).toBe('default');
    });
  });

  describe('EditionService Methods', () => {
    const mockRestService = { request: () => Promise.resolve({}) };

    it('should have create method', () => {
      const service = new host.EditionService(mockRestService as any);
      expect(typeof service.create).toBe('function');
    });

    it('should have delete method', () => {
      const service = new host.EditionService(mockRestService as any);
      expect(typeof service.delete).toBe('function');
    });

    it('should have get method', () => {
      const service = new host.EditionService(mockRestService as any);
      expect(typeof service.get).toBe('function');
    });

    it('should have getList method', () => {
      const service = new host.EditionService(mockRestService as any);
      expect(typeof service.getList).toBe('function');
    });

    it('should have getUsageStatistics method', () => {
      const service = new host.EditionService(mockRestService as any);
      expect(typeof service.getUsageStatistics).toBe('function');
    });

    it('should have update method', () => {
      const service = new host.EditionService(mockRestService as any);
      expect(typeof service.update).toBe('function');
    });
  });

  describe('TenantService Methods', () => {
    const mockRestService = { request: () => Promise.resolve({}) };

    it('should have create method', () => {
      const service = new host.TenantService(mockRestService as any);
      expect(typeof service.create).toBe('function');
    });

    it('should have delete method', () => {
      const service = new host.TenantService(mockRestService as any);
      expect(typeof service.delete).toBe('function');
    });

    it('should have deleteDefaultConnectionString method', () => {
      const service = new host.TenantService(mockRestService as any);
      expect(typeof service.deleteDefaultConnectionString).toBe('function');
    });

    it('should have get method', () => {
      const service = new host.TenantService(mockRestService as any);
      expect(typeof service.get).toBe('function');
    });

    it('should have getDefaultConnectionString method', () => {
      const service = new host.TenantService(mockRestService as any);
      expect(typeof service.getDefaultConnectionString).toBe('function');
    });

    it('should have getList method', () => {
      const service = new host.TenantService(mockRestService as any);
      expect(typeof service.getList).toBe('function');
    });

    it('should have update method', () => {
      const service = new host.TenantService(mockRestService as any);
      expect(typeof service.update).toBe('function');
    });

    it('should have updateDefaultConnectionString method', () => {
      const service = new host.TenantService(mockRestService as any);
      expect(typeof service.updateDefaultConnectionString).toBe('function');
    });
  });

  describe('All Expected Exports', () => {
    it('should export all expected service classes', () => {
      expect(host).toHaveProperty('EditionService');
      expect(host).toHaveProperty('TenantService');
    });
  });
});
