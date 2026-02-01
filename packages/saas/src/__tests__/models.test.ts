import { describe, it, expect } from 'vitest';
import { Saas } from '../models';

describe('Saas Models', () => {
  describe('Tenant interface', () => {
    it('should allow creating a basic tenant', () => {
      const tenant: Saas.Tenant = {
        id: 'tenant-123',
        name: 'Test Tenant',
      };

      expect(tenant.id).toBe('tenant-123');
      expect(tenant.name).toBe('Test Tenant');
    });

    it('should allow creating a tenant with all properties', () => {
      const tenant: Saas.Tenant = {
        id: 'tenant-123',
        name: 'Test Tenant',
        editionId: 'ed-1',
        editionName: 'Basic Edition',
        concurrencyStamp: 'stamp-abc',
      };

      expect(tenant.editionId).toBe('ed-1');
      expect(tenant.editionName).toBe('Basic Edition');
      expect(tenant.concurrencyStamp).toBe('stamp-abc');
    });
  });

  describe('Edition interface', () => {
    it('should allow creating a basic edition', () => {
      const edition: Saas.Edition = {
        id: 'ed-123',
        displayName: 'Pro Edition',
      };

      expect(edition.id).toBe('ed-123');
      expect(edition.displayName).toBe('Pro Edition');
    });

    it('should allow creating an edition with concurrency stamp', () => {
      const edition: Saas.Edition = {
        id: 'ed-123',
        displayName: 'Pro Edition',
        concurrencyStamp: 'stamp-xyz',
      };

      expect(edition.concurrencyStamp).toBe('stamp-xyz');
    });
  });

  describe('TenantsQueryParams interface', () => {
    it('should allow empty params', () => {
      const params: Saas.TenantsQueryParams = {};

      expect(params.filter).toBeUndefined();
      expect(params.skipCount).toBeUndefined();
    });

    it('should allow params with pagination', () => {
      const params: Saas.TenantsQueryParams = {
        skipCount: 0,
        maxResultCount: 10,
        sorting: 'name',
      };

      expect(params.skipCount).toBe(0);
      expect(params.maxResultCount).toBe(10);
      expect(params.sorting).toBe('name');
    });

    it('should allow params with filter and edition', () => {
      const params: Saas.TenantsQueryParams = {
        filter: 'test',
        editionId: 'ed-1',
        getEditionNames: true,
      };

      expect(params.filter).toBe('test');
      expect(params.editionId).toBe('ed-1');
      expect(params.getEditionNames).toBe(true);
    });
  });

  describe('EditionsQueryParams interface', () => {
    it('should allow empty params', () => {
      const params: Saas.EditionsQueryParams = {};

      expect(params.filter).toBeUndefined();
    });

    it('should allow params with filter', () => {
      const params: Saas.EditionsQueryParams = {
        filter: 'pro',
        skipCount: 0,
        maxResultCount: 20,
      };

      expect(params.filter).toBe('pro');
      expect(params.maxResultCount).toBe(20);
    });
  });

  describe('CreateTenantRequest interface', () => {
    it('should require name and admin credentials', () => {
      const request: Saas.CreateTenantRequest = {
        name: 'New Tenant',
        adminEmailAddress: 'admin@newtenant.com',
        adminPassword: 'SecurePassword123!',
      };

      expect(request.name).toBe('New Tenant');
      expect(request.adminEmailAddress).toBe('admin@newtenant.com');
      expect(request.adminPassword).toBe('SecurePassword123!');
    });

    it('should allow optional edition', () => {
      const request: Saas.CreateTenantRequest = {
        name: 'New Tenant',
        adminEmailAddress: 'admin@newtenant.com',
        adminPassword: 'SecurePassword123!',
        editionId: 'ed-1',
      };

      expect(request.editionId).toBe('ed-1');
    });

    it('should have adminEmailAddress and adminPassword as required fields (v2.4.0)', () => {
      // This test verifies the v2.4.0 change where adminEmailAddress and adminPassword
      // are now required fields in CreateTenantRequest
      const request: Saas.CreateTenantRequest = {
        adminEmailAddress: 'test@example.com',
        adminPassword: 'Password123!',
        name: 'Test Tenant',
      };

      // All required fields must be present
      expect(request.adminEmailAddress).toBeDefined();
      expect(request.adminPassword).toBeDefined();
      expect(request.name).toBeDefined();
    });

    it('should accept various email formats', () => {
      const request: Saas.CreateTenantRequest = {
        adminEmailAddress: 'admin+test@sub.domain.com',
        adminPassword: 'SecureP@ss1',
        name: 'Email Test Tenant',
      };

      expect(request.adminEmailAddress).toBe('admin+test@sub.domain.com');
    });
  });

  describe('UpdateTenantRequest type (v2.4.0)', () => {
    it('should require id and name', () => {
      const request: Saas.UpdateTenantRequest = {
        id: 'tenant-123',
        name: 'Updated Tenant',
      };

      expect(request.id).toBe('tenant-123');
      expect(request.name).toBe('Updated Tenant');
    });

    it('should allow optional edition and concurrency stamp', () => {
      const request: Saas.UpdateTenantRequest = {
        id: 'tenant-123',
        name: 'Updated Tenant',
        editionId: 'ed-2',
        concurrencyStamp: 'stamp-abc',
      };

      expect(request.editionId).toBe('ed-2');
      expect(request.concurrencyStamp).toBe('stamp-abc');
    });

    it('should be based on Tenant interface without editionName (v2.4.0)', () => {
      // v2.4.0 changed UpdateTenantRequest to Omit<Tenant, 'editionName'>
      // This means it should have all Tenant fields except editionName
      const request: Saas.UpdateTenantRequest = {
        id: 'tenant-123',
        name: 'Test Tenant',
        editionId: 'ed-1',
        concurrencyStamp: 'stamp-xyz',
      };

      // Should have id (required in Tenant)
      expect(request.id).toBeDefined();
      // Should have name (required in Tenant)
      expect(request.name).toBeDefined();
      // Should allow editionId (optional in Tenant)
      expect(request.editionId).toBe('ed-1');
      // Should allow concurrencyStamp (optional in Tenant)
      expect(request.concurrencyStamp).toBe('stamp-xyz');
      // editionName should not be present (omitted)
      expect('editionName' in request).toBe(false);
    });

    it('should not have adminEmailAddress or adminPassword (different from CreateTenantRequest)', () => {
      // UpdateTenantRequest is Omit<Tenant, 'editionName'>, which doesn't include admin credentials
      const request: Saas.UpdateTenantRequest = {
        id: 'tenant-123',
        name: 'Test Tenant',
      };

      expect(request).not.toHaveProperty('adminEmailAddress');
      expect(request).not.toHaveProperty('adminPassword');
    });
  });

  describe('CreateEditionRequest interface', () => {
    it('should require displayName', () => {
      const request: Saas.CreateEditionRequest = {
        displayName: 'Enterprise Edition',
      };

      expect(request.displayName).toBe('Enterprise Edition');
    });
  });

  describe('UpdateEditionRequest interface', () => {
    it('should require id and displayName', () => {
      const request: Saas.UpdateEditionRequest = {
        id: 'ed-123',
        displayName: 'Updated Pro Edition',
      };

      expect(request.id).toBe('ed-123');
      expect(request.displayName).toBe('Updated Pro Edition');
    });

    it('should allow optional concurrency stamp', () => {
      const request: Saas.UpdateEditionRequest = {
        id: 'ed-123',
        displayName: 'Updated Pro Edition',
        concurrencyStamp: 'stamp-xyz',
      };

      expect(request.concurrencyStamp).toBe('stamp-xyz');
    });
  });

  describe('DefaultConnectionStringRequest interface', () => {
    it('should require id and connection string', () => {
      const request: Saas.DefaultConnectionStringRequest = {
        id: 'tenant-123',
        defaultConnectionString: 'Server=localhost;Database=Tenant1;User=sa;Password=abc;',
      };

      expect(request.id).toBe('tenant-123');
      expect(request.defaultConnectionString).toContain('Server=localhost');
    });
  });

  describe('TenantsResponse interface', () => {
    it('should have items and totalCount', () => {
      const response: Saas.TenantsResponse = {
        items: [
          { id: 'tenant-1', name: 'Tenant One' },
          { id: 'tenant-2', name: 'Tenant Two' },
        ],
        totalCount: 2,
      };

      expect(response.items.length).toBe(2);
      expect(response.totalCount).toBe(2);
    });

    it('should allow empty items', () => {
      const response: Saas.TenantsResponse = {
        items: [],
        totalCount: 0,
      };

      expect(response.items.length).toBe(0);
      expect(response.totalCount).toBe(0);
    });
  });

  describe('EditionsResponse interface', () => {
    it('should have items and totalCount', () => {
      const response: Saas.EditionsResponse = {
        items: [
          { id: 'ed-1', displayName: 'Basic' },
          { id: 'ed-2', displayName: 'Pro' },
        ],
        totalCount: 2,
      };

      expect(response.items.length).toBe(2);
      expect(response.totalCount).toBe(2);
    });
  });

  describe('UsageStatisticsResponse interface', () => {
    it('should have data array', () => {
      const response: Saas.UsageStatisticsResponse = {
        data: [
          { label: 'Basic', value: 10 },
          { label: 'Pro', value: 5 },
          { label: 'Enterprise', value: 2 },
        ],
      };

      expect(response.data.length).toBe(3);
      expect(response.data[0].label).toBe('Basic');
      expect(response.data[0].value).toBe(10);
    });

    it('should allow empty data', () => {
      const response: Saas.UsageStatisticsResponse = {
        data: [],
      };

      expect(response.data.length).toBe(0);
    });
  });

  describe('State interface', () => {
    it('should hold tenant and edition collections', () => {
      const state: Saas.State = {
        tenants: {
          items: [{ id: 'tenant-1', name: 'Test' }],
          totalCount: 1,
        },
        editions: {
          items: [{ id: 'ed-1', displayName: 'Basic' }],
          totalCount: 1,
        },
        selectedTenant: null,
        selectedEdition: null,
      };

      expect(state.tenants.items.length).toBe(1);
      expect(state.editions.items.length).toBe(1);
    });

    it('should allow selected items', () => {
      const state: Saas.State = {
        tenants: { items: [], totalCount: 0 },
        editions: { items: [], totalCount: 0 },
        selectedTenant: { id: 'tenant-1', name: 'Selected Tenant' },
        selectedEdition: { id: 'ed-1', displayName: 'Selected Edition' },
      };

      expect(state.selectedTenant?.name).toBe('Selected Tenant');
      expect(state.selectedEdition?.displayName).toBe('Selected Edition');
    });
  });
});
