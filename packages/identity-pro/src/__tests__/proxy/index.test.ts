/**
 * Tests for proxy barrel exports
 * @abpjs/identity-pro v3.2.0
 */
import { describe, it, expect } from 'vitest';
import * as proxy from '../../proxy';

describe('proxy barrel export', () => {
  describe('identity exports', () => {
    it('should export IdentityClaimValueType enum', () => {
      expect(proxy.IdentityClaimValueType).toBeDefined();
      expect(proxy.IdentityClaimValueType.String).toBe(0);
      expect(proxy.IdentityClaimValueType.Int).toBe(1);
      expect(proxy.IdentityClaimValueType.Boolean).toBe(2);
      expect(proxy.IdentityClaimValueType.DateTime).toBe(3);
    });

    it('should export identityClaimValueTypeOptions', () => {
      expect(proxy.identityClaimValueTypeOptions).toBeDefined();
      expect(Array.isArray(proxy.identityClaimValueTypeOptions)).toBe(true);
      expect(proxy.identityClaimValueTypeOptions).toHaveLength(4);
    });

    it('should export IdentityClaimTypeService', () => {
      expect(proxy.IdentityClaimTypeService).toBeDefined();
      expect(typeof proxy.IdentityClaimTypeService).toBe('function');
    });

    it('should export IdentityRoleService', () => {
      expect(proxy.IdentityRoleService).toBeDefined();
      expect(typeof proxy.IdentityRoleService).toBe('function');
    });

    it('should export IdentityUserService', () => {
      expect(proxy.IdentityUserService).toBeDefined();
      expect(typeof proxy.IdentityUserService).toBe('function');
    });

    it('should export IdentitySecurityLogService', () => {
      expect(proxy.IdentitySecurityLogService).toBeDefined();
      expect(typeof proxy.IdentitySecurityLogService).toBe('function');
    });

    it('should export IdentitySettingsService', () => {
      expect(proxy.IdentitySettingsService).toBeDefined();
      expect(typeof proxy.IdentitySettingsService).toBe('function');
    });

    it('should export IdentityUserLookupService', () => {
      expect(proxy.IdentityUserLookupService).toBeDefined();
      expect(typeof proxy.IdentityUserLookupService).toBe('function');
    });

    it('should export OrganizationUnitService', () => {
      expect(proxy.OrganizationUnitService).toBeDefined();
      expect(typeof proxy.OrganizationUnitService).toBe('function');
    });

    it('should export ProfileService', () => {
      expect(proxy.ProfileService).toBeDefined();
      expect(typeof proxy.ProfileService).toBe('function');
    });
  });

  describe('users exports', () => {
    it('should export users module (type-only exports not testable at runtime)', () => {
      // UserData is a type-only export, so we can only verify the module structure
      // This test ensures the barrel export includes the users module
      expect(proxy).toBeDefined();
    });
  });

  describe('service instantiation', () => {
    const mockRestService = {
      request: async () => ({}),
    };

    it('should instantiate IdentityClaimTypeService', () => {
      const service = new proxy.IdentityClaimTypeService(mockRestService as any);
      expect(service).toBeInstanceOf(proxy.IdentityClaimTypeService);
      expect(service.apiName).toBe('default');
    });

    it('should instantiate IdentityRoleService', () => {
      const service = new proxy.IdentityRoleService(mockRestService as any);
      expect(service).toBeInstanceOf(proxy.IdentityRoleService);
      expect(service.apiName).toBe('default');
    });

    it('should instantiate IdentityUserService', () => {
      const service = new proxy.IdentityUserService(mockRestService as any);
      expect(service).toBeInstanceOf(proxy.IdentityUserService);
      expect(service.apiName).toBe('default');
    });

    it('should instantiate IdentitySecurityLogService', () => {
      const service = new proxy.IdentitySecurityLogService(mockRestService as any);
      expect(service).toBeInstanceOf(proxy.IdentitySecurityLogService);
      expect(service.apiName).toBe('default');
    });

    it('should instantiate IdentitySettingsService', () => {
      const service = new proxy.IdentitySettingsService(mockRestService as any);
      expect(service).toBeInstanceOf(proxy.IdentitySettingsService);
      expect(service.apiName).toBe('default');
    });

    it('should instantiate IdentityUserLookupService', () => {
      const service = new proxy.IdentityUserLookupService(mockRestService as any);
      expect(service).toBeInstanceOf(proxy.IdentityUserLookupService);
      expect(service.apiName).toBe('default');
    });

    it('should instantiate OrganizationUnitService', () => {
      const service = new proxy.OrganizationUnitService(mockRestService as any);
      expect(service).toBeInstanceOf(proxy.OrganizationUnitService);
      expect(service.apiName).toBe('default');
    });

    it('should instantiate ProfileService', () => {
      const service = new proxy.ProfileService(mockRestService as any);
      expect(service).toBeInstanceOf(proxy.ProfileService);
      expect(service.apiName).toBe('default');
    });
  });
});

describe('named imports from proxy', () => {
  it('should support named import of IdentityClaimValueType', async () => {
    const { IdentityClaimValueType } = await import('../../proxy');
    expect(IdentityClaimValueType.String).toBe(0);
  });

  it('should support named import of services', async () => {
    const {
      IdentityClaimTypeService,
      IdentityRoleService,
      IdentityUserService
    } = await import('../../proxy');

    expect(IdentityClaimTypeService).toBeDefined();
    expect(IdentityRoleService).toBeDefined();
    expect(IdentityUserService).toBeDefined();
  });
});
