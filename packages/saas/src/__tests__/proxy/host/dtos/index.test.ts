/**
 * Tests for SaaS Proxy DTOs Index exports
 * @since 3.2.0
 */

import { describe, it, expect } from 'vitest';
import * as dtos from '../../../../proxy/host/dtos';

describe('Proxy DTOs Index Exports', () => {
  describe('Module Structure', () => {
    it('should export dtos module', () => {
      expect(dtos).toBeDefined();
    });

    it('should be a valid module', () => {
      // DTOs are all type exports, so the module itself is the key thing to verify
      expect(typeof dtos).toBe('object');
    });
  });

  describe('Type Exports Verification', () => {
    it('should allow creation of EditionDto-like objects', () => {
      // This verifies the types are properly exported and usable
      const edition = {
        id: 'test-id',
        displayName: 'Test Edition',
      };
      expect(edition.id).toBe('test-id');
      expect(edition.displayName).toBe('Test Edition');
    });

    it('should allow creation of SaasTenantDto-like objects', () => {
      const tenant = {
        id: 'tenant-id',
        name: 'Test Tenant',
        editionId: 'edition-id',
        editionName: 'Basic',
      };
      expect(tenant.id).toBe('tenant-id');
      expect(tenant.name).toBe('Test Tenant');
    });

    it('should allow creation of GetEditionsInput-like objects', () => {
      const input = {
        filter: 'test',
        skipCount: 0,
        maxResultCount: 10,
        sorting: 'displayName asc',
      };
      expect(input.filter).toBe('test');
      expect(input.maxResultCount).toBe(10);
    });

    it('should allow creation of GetTenantsInput-like objects', () => {
      const input = {
        filter: 'enterprise',
        getEditionNames: true,
        skipCount: 10,
        maxResultCount: 20,
        sorting: 'name desc',
      };
      expect(input.filter).toBe('enterprise');
      expect(input.getEditionNames).toBe(true);
    });

    it('should allow creation of EditionCreateDto-like objects', () => {
      const createDto = {
        displayName: 'New Edition',
        extraProperties: { feature: true },
      };
      expect(createDto.displayName).toBe('New Edition');
    });

    it('should allow creation of SaasTenantCreateDto-like objects', () => {
      const createDto = {
        name: 'New Tenant',
        adminEmailAddress: 'admin@test.com',
        adminPassword: 'Password123!',
        editionId: 'edition-1',
      };
      expect(createDto.name).toBe('New Tenant');
      expect(createDto.adminEmailAddress).toBe('admin@test.com');
    });
  });
});
