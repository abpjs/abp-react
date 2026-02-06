import { describe, it, expect } from 'vitest';
import { FindTenantResultDto } from './find-tenant-result-dto';

describe('FindTenantResultDto (v3.1.0)', () => {
  describe('constructor', () => {
    it('should create instance with default values when no initial values provided', () => {
      const dto = new FindTenantResultDto();

      expect(dto.success).toBe(false);
      expect(dto.name).toBe('');
      expect(dto.tenantId).toBeUndefined();
    });

    it('should create instance with provided initial values', () => {
      const dto = new FindTenantResultDto({
        success: true,
        name: 'Test Tenant',
        tenantId: 'tenant-123',
      });

      expect(dto.success).toBe(true);
      expect(dto.name).toBe('Test Tenant');
      expect(dto.tenantId).toBe('tenant-123');
    });

    it('should create instance with partial initial values', () => {
      const dto = new FindTenantResultDto({
        success: true,
      });

      expect(dto.success).toBe(true);
      expect(dto.name).toBe('');
      expect(dto.tenantId).toBeUndefined();
    });

    it('should handle undefined initial values', () => {
      const dto = new FindTenantResultDto(undefined);

      expect(dto.success).toBe(false);
      expect(dto.name).toBe('');
      expect(dto.tenantId).toBeUndefined();
    });

    it('should handle empty object as initial values', () => {
      const dto = new FindTenantResultDto({});

      expect(dto.success).toBe(false);
      expect(dto.name).toBe('');
      expect(dto.tenantId).toBeUndefined();
    });

    it('should use false as default for success when undefined', () => {
      const dto = new FindTenantResultDto({ name: 'Test' });

      expect(dto.success).toBe(false);
    });

    it('should preserve tenantId when provided', () => {
      const tenantId = 'abc-123-def-456';
      const dto = new FindTenantResultDto({ tenantId });

      expect(dto.tenantId).toBe(tenantId);
    });

    it('should handle explicit false for success', () => {
      const dto = new FindTenantResultDto({
        success: false,
        name: 'NotFound',
      });

      expect(dto.success).toBe(false);
      expect(dto.name).toBe('NotFound');
    });

    it('should handle empty string for name', () => {
      const dto = new FindTenantResultDto({
        success: true,
        name: '',
        tenantId: 'id-123',
      });

      expect(dto.name).toBe('');
    });
  });

  describe('successful tenant lookup scenario', () => {
    it('should represent a successful tenant lookup', () => {
      const dto = new FindTenantResultDto({
        success: true,
        name: 'Acme Corporation',
        tenantId: 'acme-corp-123',
      });

      expect(dto.success).toBe(true);
      expect(dto.name).toBe('Acme Corporation');
      expect(dto.tenantId).toBe('acme-corp-123');
    });
  });

  describe('failed tenant lookup scenario', () => {
    it('should represent a failed tenant lookup', () => {
      const dto = new FindTenantResultDto({
        success: false,
        name: '',
        tenantId: undefined,
      });

      expect(dto.success).toBe(false);
      expect(dto.name).toBe('');
      expect(dto.tenantId).toBeUndefined();
    });
  });

  describe('instance properties', () => {
    it('should be mutable', () => {
      const dto = new FindTenantResultDto();

      dto.success = true;
      dto.name = 'Updated Name';
      dto.tenantId = 'new-tenant-id';

      expect(dto.success).toBe(true);
      expect(dto.name).toBe('Updated Name');
      expect(dto.tenantId).toBe('new-tenant-id');
    });

    it('should allow tenantId to be set to undefined', () => {
      const dto = new FindTenantResultDto({
        tenantId: 'initial-id',
      });

      dto.tenantId = undefined;

      expect(dto.tenantId).toBeUndefined();
    });
  });

  describe('type checking', () => {
    it('should be an instance of FindTenantResultDto', () => {
      const dto = new FindTenantResultDto();

      expect(dto).toBeInstanceOf(FindTenantResultDto);
    });

    it('should have expected properties', () => {
      const dto = new FindTenantResultDto({
        success: true,
        name: 'Test',
        tenantId: 'id',
      });

      expect('success' in dto).toBe(true);
      expect('name' in dto).toBe(true);
      expect('tenantId' in dto).toBe(true);
    });
  });
});
