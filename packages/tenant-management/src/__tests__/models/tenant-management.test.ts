import { describe, it, expect } from 'vitest';
import type { TenantManagement } from '../../models';

describe('TenantManagement models', () => {
  describe('TenantsComponentInputs (v2.0.0)', () => {
    it('should define all optional input callback properties', () => {
      const inputs: TenantManagement.TenantsComponentInputs = {
        onTenantCreated: (tenant) => {
          expect(tenant.id).toBeDefined();
          expect(tenant.name).toBeDefined();
        },
        onTenantUpdated: (tenant) => {
          expect(tenant.id).toBeDefined();
          expect(tenant.name).toBeDefined();
        },
        onTenantDeleted: (id) => {
          expect(typeof id).toBe('string');
        },
      };

      expect(typeof inputs.onTenantCreated).toBe('function');
      expect(typeof inputs.onTenantUpdated).toBe('function');
      expect(typeof inputs.onTenantDeleted).toBe('function');
    });

    it('should allow empty inputs object', () => {
      const inputs: TenantManagement.TenantsComponentInputs = {};

      expect(inputs.onTenantCreated).toBeUndefined();
      expect(inputs.onTenantUpdated).toBeUndefined();
      expect(inputs.onTenantDeleted).toBeUndefined();
    });

    it('should handle onTenantCreated callback', () => {
      let capturedTenant: TenantManagement.Item | undefined;
      const inputs: TenantManagement.TenantsComponentInputs = {
        onTenantCreated: (tenant) => {
          capturedTenant = tenant;
        },
      };

      inputs.onTenantCreated?.({ id: 'new-id', name: 'New Tenant' });
      expect(capturedTenant).toEqual({ id: 'new-id', name: 'New Tenant' });
    });

    it('should handle onTenantUpdated callback', () => {
      let capturedTenant: TenantManagement.Item | undefined;
      const inputs: TenantManagement.TenantsComponentInputs = {
        onTenantUpdated: (tenant) => {
          capturedTenant = tenant;
        },
      };

      inputs.onTenantUpdated?.({ id: 'updated-id', name: 'Updated Tenant' });
      expect(capturedTenant).toEqual({ id: 'updated-id', name: 'Updated Tenant' });
    });

    it('should handle onTenantDeleted callback', () => {
      let capturedId: string | undefined;
      const inputs: TenantManagement.TenantsComponentInputs = {
        onTenantDeleted: (id) => {
          capturedId = id;
        },
      };

      inputs.onTenantDeleted?.('deleted-id');
      expect(capturedId).toBe('deleted-id');
    });
  });

  describe('TenantsComponentOutputs (v2.0.0)', () => {
    it('should define all optional output callback properties', () => {
      const outputs: TenantManagement.TenantsComponentOutputs = {
        onVisibleFeaturesChange: (visible) => {
          expect(typeof visible).toBe('boolean');
        },
        onSearch: (value) => {
          expect(typeof value).toBe('string');
        },
        onPageChange: (page) => {
          expect(typeof page).toBe('number');
        },
      };

      expect(typeof outputs.onVisibleFeaturesChange).toBe('function');
      expect(typeof outputs.onSearch).toBe('function');
      expect(typeof outputs.onPageChange).toBe('function');
    });

    it('should allow empty outputs object', () => {
      const outputs: TenantManagement.TenantsComponentOutputs = {};

      expect(outputs.onVisibleFeaturesChange).toBeUndefined();
      expect(outputs.onSearch).toBeUndefined();
      expect(outputs.onPageChange).toBeUndefined();
    });

    it('should handle onVisibleFeaturesChange with true', () => {
      let capturedValue: boolean | undefined;
      const outputs: TenantManagement.TenantsComponentOutputs = {
        onVisibleFeaturesChange: (visible) => {
          capturedValue = visible;
        },
      };

      outputs.onVisibleFeaturesChange?.(true);
      expect(capturedValue).toBe(true);
    });

    it('should handle onVisibleFeaturesChange with false', () => {
      let capturedValue: boolean | undefined;
      const outputs: TenantManagement.TenantsComponentOutputs = {
        onVisibleFeaturesChange: (visible) => {
          capturedValue = visible;
        },
      };

      outputs.onVisibleFeaturesChange?.(false);
      expect(capturedValue).toBe(false);
    });

    it('should handle onSearch callback with string value', () => {
      let capturedValue: string | undefined;
      const outputs: TenantManagement.TenantsComponentOutputs = {
        onSearch: (value) => {
          capturedValue = value;
        },
      };

      outputs.onSearch?.('search term');
      expect(capturedValue).toBe('search term');
    });

    it('should handle onSearch callback with empty string', () => {
      let capturedValue: string | undefined;
      const outputs: TenantManagement.TenantsComponentOutputs = {
        onSearch: (value) => {
          capturedValue = value;
        },
      };

      outputs.onSearch?.('');
      expect(capturedValue).toBe('');
    });

    it('should handle onPageChange callback with page number', () => {
      let capturedPage: number | undefined;
      const outputs: TenantManagement.TenantsComponentOutputs = {
        onPageChange: (page) => {
          capturedPage = page;
        },
      };

      outputs.onPageChange?.(1);
      expect(capturedPage).toBe(1);

      outputs.onPageChange?.(5);
      expect(capturedPage).toBe(5);
    });

    it('should handle onPageChange callback with zero', () => {
      let capturedPage: number | undefined;
      const outputs: TenantManagement.TenantsComponentOutputs = {
        onPageChange: (page) => {
          capturedPage = page;
        },
      };

      outputs.onPageChange?.(0);
      expect(capturedPage).toBe(0);
    });
  });

  describe('TenantManagement.State', () => {
    it('should define State interface with result and selectedItem', () => {
      const state: TenantManagement.State = {
        result: {
          items: [{ id: '1', name: 'Tenant 1' }],
          totalCount: 1,
        },
        selectedItem: { id: '1', name: 'Tenant 1' },
      };

      expect(state.result.items).toHaveLength(1);
      expect(state.result.totalCount).toBe(1);
      expect(state.selectedItem.id).toBe('1');
    });
  });

  describe('TenantManagement.Item', () => {
    it('should define Item with id and name', () => {
      const item: TenantManagement.Item = {
        id: 'tenant-id-123',
        name: 'Test Tenant',
      };

      expect(item.id).toBe('tenant-id-123');
      expect(item.name).toBe('Test Tenant');
    });
  });

  describe('TenantManagement.AddRequest', () => {
    it('should define AddRequest with name', () => {
      const request: TenantManagement.AddRequest = {
        name: 'New Tenant Name',
      };

      expect(request.name).toBe('New Tenant Name');
    });
  });

  describe('TenantManagement.UpdateRequest', () => {
    it('should define UpdateRequest with id and name', () => {
      const request: TenantManagement.UpdateRequest = {
        id: 'tenant-id',
        name: 'Updated Tenant Name',
      };

      expect(request.id).toBe('tenant-id');
      expect(request.name).toBe('Updated Tenant Name');
    });
  });

  describe('TenantManagement.DefaultConnectionStringRequest', () => {
    it('should define request with id and defaultConnectionString', () => {
      const request: TenantManagement.DefaultConnectionStringRequest = {
        id: 'tenant-id',
        defaultConnectionString: 'Server=localhost;Database=TenantDb;',
      };

      expect(request.id).toBe('tenant-id');
      expect(request.defaultConnectionString).toBe('Server=localhost;Database=TenantDb;');
    });
  });
});
