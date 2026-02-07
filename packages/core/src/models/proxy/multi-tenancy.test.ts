import { describe, it, expect } from 'vitest';
import type {
  FindTenantResultDto,
  CurrentTenantDto,
  MultiTenancyInfoDto,
} from './multi-tenancy';

describe('proxy/multi-tenancy models (v4.0.0)', () => {
  describe('FindTenantResultDto', () => {
    it('should create a successful result', () => {
      const dto: FindTenantResultDto = {
        success: true,
        tenantId: 'tenant-123',
        name: 'Test Tenant',
      };
      expect(dto.success).toBe(true);
      expect(dto.tenantId).toBe('tenant-123');
      expect(dto.name).toBe('Test Tenant');
    });

    it('should create a failed result', () => {
      const dto: FindTenantResultDto = {
        success: false,
      };
      expect(dto.success).toBe(false);
      expect(dto.tenantId).toBeUndefined();
      expect(dto.name).toBeUndefined();
    });

    it('should allow optional tenantId and name', () => {
      const dto: FindTenantResultDto = { success: true };
      expect(dto).toHaveProperty('success');
      expect(dto.tenantId).toBeUndefined();
      expect(dto.name).toBeUndefined();
    });
  });

  describe('CurrentTenantDto', () => {
    it('should create a full tenant', () => {
      const dto: CurrentTenantDto = {
        id: 'tenant-abc',
        name: 'Acme Corp',
        isAvailable: true,
      };
      expect(dto.id).toBe('tenant-abc');
      expect(dto.name).toBe('Acme Corp');
      expect(dto.isAvailable).toBe(true);
    });

    it('should allow all fields to be optional', () => {
      const dto: CurrentTenantDto = {};
      expect(dto.id).toBeUndefined();
      expect(dto.name).toBeUndefined();
      expect(dto.isAvailable).toBeUndefined();
    });

    it('should allow partial fields', () => {
      const dto: CurrentTenantDto = { id: 'abc' };
      expect(dto.id).toBe('abc');
      expect(dto.name).toBeUndefined();
    });

    it('should work with isAvailable false', () => {
      const dto: CurrentTenantDto = { isAvailable: false };
      expect(dto.isAvailable).toBe(false);
    });
  });

  describe('MultiTenancyInfoDto', () => {
    it('should create with isEnabled true', () => {
      const dto: MultiTenancyInfoDto = { isEnabled: true };
      expect(dto.isEnabled).toBe(true);
    });

    it('should create with isEnabled false', () => {
      const dto: MultiTenancyInfoDto = { isEnabled: false };
      expect(dto.isEnabled).toBe(false);
    });
  });
});
