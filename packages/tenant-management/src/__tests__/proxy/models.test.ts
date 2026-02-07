/**
 * Tests for proxy models (v3.2.0)
 * Tests the new typed DTOs for Tenant Management API
 */

import { describe, it, expect } from 'vitest';
import type {
  GetTenantsInput,
  TenantCreateDto,
  TenantCreateOrUpdateDtoBase,
  TenantDto,
  TenantUpdateDto,
} from '../../proxy/models';

describe('Proxy Models (v3.2.0)', () => {
  describe('GetTenantsInput', () => {
    it('should define filter property', () => {
      const input: GetTenantsInput = {
        filter: 'test',
        maxResultCount: 10,
        skipCount: 0,
      };

      expect(input.filter).toBe('test');
      expect(input.maxResultCount).toBe(10);
      expect(input.skipCount).toBe(0);
    });

    it('should allow empty filter string', () => {
      const input: GetTenantsInput = {
        filter: '',
        maxResultCount: 20,
        skipCount: 0,
      };

      expect(input.filter).toBe('');
    });

    it('should support sorting property from PagedAndSortedResultRequestDto', () => {
      const input: GetTenantsInput = {
        filter: 'search',
        maxResultCount: 10,
        skipCount: 5,
        sorting: 'name asc',
      };

      expect(input.sorting).toBe('name asc');
    });

    it('should support pagination with skipCount', () => {
      const input: GetTenantsInput = {
        filter: '',
        maxResultCount: 25,
        skipCount: 50,
      };

      expect(input.skipCount).toBe(50);
      expect(input.maxResultCount).toBe(25);
    });
  });

  describe('TenantCreateOrUpdateDtoBase', () => {
    it('should define name property', () => {
      const dto: TenantCreateOrUpdateDtoBase = {
        name: 'Test Tenant',
        extraProperties: {},
      };

      expect(dto.name).toBe('Test Tenant');
    });

    it('should support extraProperties from ExtensibleObject', () => {
      const dto: TenantCreateOrUpdateDtoBase = {
        name: 'My Tenant',
        extraProperties: {
          customField: 'value',
          anotherField: 123,
        },
      };

      expect(dto.extraProperties).toEqual({
        customField: 'value',
        anotherField: 123,
      });
    });

    it('should allow empty extraProperties', () => {
      const dto: TenantCreateOrUpdateDtoBase = {
        name: 'Tenant',
        extraProperties: {},
      };

      expect(dto.extraProperties).toEqual({});
    });
  });

  describe('TenantCreateDto', () => {
    it('should extend TenantCreateOrUpdateDtoBase with admin credentials', () => {
      const dto: TenantCreateDto = {
        name: 'New Tenant',
        adminEmailAddress: 'admin@tenant.com',
        adminPassword: 'SecurePassword123!',
        extraProperties: {},
      };

      expect(dto.name).toBe('New Tenant');
      expect(dto.adminEmailAddress).toBe('admin@tenant.com');
      expect(dto.adminPassword).toBe('SecurePassword123!');
    });

    it('should require all mandatory fields', () => {
      const dto: TenantCreateDto = {
        name: 'Test',
        adminEmailAddress: 'test@example.com',
        adminPassword: 'pass',
        extraProperties: {},
      };

      expect(dto).toHaveProperty('name');
      expect(dto).toHaveProperty('adminEmailAddress');
      expect(dto).toHaveProperty('adminPassword');
      expect(dto).toHaveProperty('extraProperties');
    });

    it('should support extraProperties for custom tenant data', () => {
      const dto: TenantCreateDto = {
        name: 'Enterprise Tenant',
        adminEmailAddress: 'admin@enterprise.com',
        adminPassword: 'EnterprisePass!',
        extraProperties: {
          plan: 'enterprise',
          maxUsers: 1000,
        },
      };

      expect(dto.extraProperties).toEqual({
        plan: 'enterprise',
        maxUsers: 1000,
      });
    });
  });

  describe('TenantUpdateDto', () => {
    it('should extend TenantCreateOrUpdateDtoBase', () => {
      const dto: TenantUpdateDto = {
        name: 'Updated Tenant Name',
        extraProperties: {},
      };

      expect(dto.name).toBe('Updated Tenant Name');
    });

    it('should not require admin credentials (only name updatable)', () => {
      const dto: TenantUpdateDto = {
        name: 'Just Name Update',
        extraProperties: {},
      };

      // TenantUpdateDto should only have name and extraProperties
      expect(dto).toHaveProperty('name');
      expect(dto).not.toHaveProperty('adminEmailAddress');
      expect(dto).not.toHaveProperty('adminPassword');
    });

    it('should support extraProperties for custom updates', () => {
      const dto: TenantUpdateDto = {
        name: 'Tenant With Extras',
        extraProperties: {
          updatedAt: '2024-01-01',
          version: 2,
        },
      };

      expect(dto.extraProperties).toEqual({
        updatedAt: '2024-01-01',
        version: 2,
      });
    });
  });

  describe('TenantDto', () => {
    it('should extend ExtensibleEntityDto with string ID', () => {
      const dto: TenantDto = {
        id: 'tenant-123',
        name: 'My Tenant',
        extraProperties: {},
      };

      expect(dto.id).toBe('tenant-123');
      expect(dto.name).toBe('My Tenant');
    });

    it('should support UUID-style IDs', () => {
      const dto: TenantDto = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'UUID Tenant',
        extraProperties: {},
      };

      expect(dto.id).toBe('550e8400-e29b-41d4-a716-446655440000');
    });

    it('should support extraProperties from response', () => {
      const dto: TenantDto = {
        id: 'tenant-456',
        name: 'Extended Tenant',
        extraProperties: {
          createdAt: '2024-01-15',
          isActive: true,
          connectionString: null,
        },
      };

      expect(dto.extraProperties).toEqual({
        createdAt: '2024-01-15',
        isActive: true,
        connectionString: null,
      });
    });

    it('should work with empty extraProperties', () => {
      const dto: TenantDto = {
        id: 'simple-tenant',
        name: 'Simple',
        extraProperties: {},
      };

      expect(Object.keys(dto.extraProperties!)).toHaveLength(0);
    });
  });

  describe('Type compatibility', () => {
    it('should allow TenantCreateDto to be used where TenantCreateOrUpdateDtoBase is expected', () => {
      const createDto: TenantCreateDto = {
        name: 'Test',
        adminEmailAddress: 'admin@test.com',
        adminPassword: 'pass',
        extraProperties: {},
      };

      // This should compile - TenantCreateDto extends TenantCreateOrUpdateDtoBase
      const baseDto: TenantCreateOrUpdateDtoBase = createDto;
      expect(baseDto.name).toBe('Test');
    });

    it('should allow TenantUpdateDto to be used where TenantCreateOrUpdateDtoBase is expected', () => {
      const updateDto: TenantUpdateDto = {
        name: 'Updated',
        extraProperties: {},
      };

      // This should compile - TenantUpdateDto extends TenantCreateOrUpdateDtoBase
      const baseDto: TenantCreateOrUpdateDtoBase = updateDto;
      expect(baseDto.name).toBe('Updated');
    });

    it('should distinguish between Item (deprecated) and TenantDto', () => {
      // TenantDto requires extraProperties
      const tenantDto: TenantDto = {
        id: '1',
        name: 'Tenant',
        extraProperties: {},
      };

      expect(tenantDto.extraProperties).toBeDefined();
    });
  });

  describe('Edge cases', () => {
    it('should handle special characters in tenant names', () => {
      const dto: TenantDto = {
        id: '1',
        name: "Tenant's Company & Partners, LLC",
        extraProperties: {},
      };

      expect(dto.name).toBe("Tenant's Company & Partners, LLC");
    });

    it('should handle unicode characters in names', () => {
      const dto: TenantDto = {
        id: '2',
        name: '日本語テナント',
        extraProperties: {},
      };

      expect(dto.name).toBe('日本語テナント');
    });

    it('should handle complex extraProperties', () => {
      const dto: TenantDto = {
        id: '3',
        name: 'Complex',
        extraProperties: {
          nested: { level1: { level2: 'deep' } },
          array: [1, 2, 3],
          nullValue: null,
          boolValue: false,
        },
      };

      expect(dto.extraProperties!.nested).toEqual({ level1: { level2: 'deep' } });
      expect(dto.extraProperties!.array).toEqual([1, 2, 3]);
    });
  });
});
