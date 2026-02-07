/**
 * Tests for SaaS Proxy DTOs
 * @since 3.2.0
 */

import { describe, it, expect } from 'vitest';
import type {
  EditionCreateOrUpdateDtoBase,
  EditionCreateDto,
  EditionUpdateDto,
  EditionDto,
  GetEditionsInput,
  SaasTenantCreateOrUpdateDtoBase,
  SaasTenantCreateDto,
  SaasTenantUpdateDto,
  SaasTenantDto,
  GetTenantsInput,
} from '../../../../proxy/host/dtos/models';

describe('Proxy DTOs', () => {
  describe('Edition DTOs', () => {
    describe('EditionCreateOrUpdateDtoBase', () => {
      it('should accept valid base DTO with required fields', () => {
        const dto: EditionCreateOrUpdateDtoBase = {
          displayName: 'Basic Edition',
        };
        expect(dto.displayName).toBe('Basic Edition');
      });

      it('should accept base DTO with extra properties', () => {
        const dto: EditionCreateOrUpdateDtoBase = {
          displayName: 'Premium Edition',
          extraProperties: { maxUsers: 100, tier: 'enterprise' },
        };
        expect(dto.displayName).toBe('Premium Edition');
        expect(dto.extraProperties).toEqual({ maxUsers: 100, tier: 'enterprise' });
      });

      it('should accept undefined extra properties', () => {
        const dto: EditionCreateOrUpdateDtoBase = {
          displayName: 'Standard Edition',
          extraProperties: undefined,
        };
        expect(dto.extraProperties).toBeUndefined();
      });
    });

    describe('EditionCreateDto', () => {
      it('should accept valid create DTO', () => {
        const dto: EditionCreateDto = {
          displayName: 'New Edition',
        };
        expect(dto.displayName).toBe('New Edition');
      });

      it('should be compatible with EditionCreateOrUpdateDtoBase', () => {
        const dto: EditionCreateDto = {
          displayName: 'Edition',
          extraProperties: { feature1: true },
        };
        const baseDto: EditionCreateOrUpdateDtoBase = dto;
        expect(baseDto.displayName).toBe('Edition');
      });
    });

    describe('EditionUpdateDto', () => {
      it('should accept valid update DTO', () => {
        const dto: EditionUpdateDto = {
          displayName: 'Updated Edition',
        };
        expect(dto.displayName).toBe('Updated Edition');
      });

      it('should be compatible with EditionCreateOrUpdateDtoBase', () => {
        const dto: EditionUpdateDto = {
          displayName: 'Edition',
          extraProperties: { upgraded: true },
        };
        const baseDto: EditionCreateOrUpdateDtoBase = dto;
        expect(baseDto.displayName).toBe('Edition');
      });
    });

    describe('EditionDto', () => {
      it('should accept valid edition response with required fields', () => {
        const dto: EditionDto = {
          id: 'edition-123',
          displayName: 'Basic',
        };
        expect(dto.id).toBe('edition-123');
        expect(dto.displayName).toBe('Basic');
      });

      it('should accept full edition response with all optional fields', () => {
        const dto: EditionDto = {
          id: 'edition-456',
          displayName: 'Enterprise',
          concurrencyStamp: 'stamp-abc',
          creationTime: '2024-01-15T10:00:00Z',
          creatorId: 'admin-user',
          extraProperties: { maxStorage: '100GB' },
        };
        expect(dto.id).toBe('edition-456');
        expect(dto.concurrencyStamp).toBe('stamp-abc');
        expect(dto.creationTime).toBe('2024-01-15T10:00:00Z');
        expect(dto.creatorId).toBe('admin-user');
      });

      it('should accept Date object for creationTime', () => {
        const dto: EditionDto = {
          id: 'edition-789',
          displayName: 'Pro',
          creationTime: new Date('2024-01-01'),
        };
        expect(dto.creationTime).toBeInstanceOf(Date);
      });

      it('should handle undefined optional fields', () => {
        const dto: EditionDto = {
          id: 'edition-min',
          displayName: 'Minimal',
          concurrencyStamp: undefined,
          creationTime: undefined,
          creatorId: undefined,
          extraProperties: undefined,
        };
        expect(dto.concurrencyStamp).toBeUndefined();
        expect(dto.creationTime).toBeUndefined();
      });
    });

    describe('GetEditionsInput', () => {
      it('should accept empty input', () => {
        const input: GetEditionsInput = {};
        expect(input).toEqual({});
      });

      it('should accept filter', () => {
        const input: GetEditionsInput = { filter: 'Premium' };
        expect(input.filter).toBe('Premium');
      });

      it('should accept pagination params', () => {
        const input: GetEditionsInput = {
          skipCount: 10,
          maxResultCount: 20,
        };
        expect(input.skipCount).toBe(10);
        expect(input.maxResultCount).toBe(20);
      });

      it('should accept sorting', () => {
        const input: GetEditionsInput = { sorting: 'displayName desc' };
        expect(input.sorting).toBe('displayName desc');
      });

      it('should accept all params', () => {
        const input: GetEditionsInput = {
          filter: 'test',
          skipCount: 0,
          maxResultCount: 50,
          sorting: 'creationTime asc',
        };
        expect(input.filter).toBe('test');
        expect(input.skipCount).toBe(0);
        expect(input.maxResultCount).toBe(50);
        expect(input.sorting).toBe('creationTime asc');
      });
    });
  });

  describe('Tenant DTOs', () => {
    describe('SaasTenantCreateOrUpdateDtoBase', () => {
      it('should accept valid base DTO with required fields', () => {
        const dto: SaasTenantCreateOrUpdateDtoBase = {
          name: 'Tenant One',
        };
        expect(dto.name).toBe('Tenant One');
      });

      it('should accept base DTO with edition', () => {
        const dto: SaasTenantCreateOrUpdateDtoBase = {
          name: 'Tenant Two',
          editionId: 'edition-123',
        };
        expect(dto.name).toBe('Tenant Two');
        expect(dto.editionId).toBe('edition-123');
      });

      it('should accept base DTO with extra properties', () => {
        const dto: SaasTenantCreateOrUpdateDtoBase = {
          name: 'Tenant Three',
          extraProperties: { industry: 'technology', size: 'large' },
        };
        expect(dto.extraProperties).toEqual({ industry: 'technology', size: 'large' });
      });

      it('should accept all optional fields', () => {
        const dto: SaasTenantCreateOrUpdateDtoBase = {
          name: 'Full Tenant',
          editionId: 'edition-456',
          extraProperties: { customField: 'value' },
        };
        expect(dto.name).toBe('Full Tenant');
        expect(dto.editionId).toBe('edition-456');
        expect(dto.extraProperties).toBeDefined();
      });
    });

    describe('SaasTenantCreateDto', () => {
      it('should accept valid create DTO with all required fields', () => {
        const dto: SaasTenantCreateDto = {
          name: 'New Tenant',
          adminEmailAddress: 'admin@newtenant.com',
          adminPassword: 'SecurePassword123!',
        };
        expect(dto.name).toBe('New Tenant');
        expect(dto.adminEmailAddress).toBe('admin@newtenant.com');
        expect(dto.adminPassword).toBe('SecurePassword123!');
      });

      it('should accept create DTO with edition', () => {
        const dto: SaasTenantCreateDto = {
          name: 'Enterprise Tenant',
          adminEmailAddress: 'admin@enterprise.com',
          adminPassword: 'EnterprisePass!',
          editionId: 'edition-enterprise',
        };
        expect(dto.editionId).toBe('edition-enterprise');
      });

      it('should accept create DTO with extra properties', () => {
        const dto: SaasTenantCreateDto = {
          name: 'Custom Tenant',
          adminEmailAddress: 'admin@custom.com',
          adminPassword: 'CustomPass!',
          extraProperties: { region: 'us-west', tier: 'premium' },
        };
        expect(dto.extraProperties).toEqual({ region: 'us-west', tier: 'premium' });
      });

      it('should extend SaasTenantCreateOrUpdateDtoBase', () => {
        const dto: SaasTenantCreateDto = {
          name: 'Test',
          adminEmailAddress: 'test@test.com',
          adminPassword: 'Test123!',
        };
        const baseDto: SaasTenantCreateOrUpdateDtoBase = dto;
        expect(baseDto.name).toBe('Test');
      });
    });

    describe('SaasTenantUpdateDto', () => {
      it('should accept valid update DTO', () => {
        const dto: SaasTenantUpdateDto = {
          name: 'Updated Tenant',
        };
        expect(dto.name).toBe('Updated Tenant');
      });

      it('should accept update DTO with new edition', () => {
        const dto: SaasTenantUpdateDto = {
          name: 'Upgraded Tenant',
          editionId: 'edition-premium',
        };
        expect(dto.editionId).toBe('edition-premium');
      });

      it('should be compatible with SaasTenantCreateOrUpdateDtoBase', () => {
        const dto: SaasTenantUpdateDto = {
          name: 'Test',
          editionId: 'edition-123',
          extraProperties: { updated: true },
        };
        const baseDto: SaasTenantCreateOrUpdateDtoBase = dto;
        expect(baseDto.name).toBe('Test');
      });
    });

    describe('SaasTenantDto', () => {
      it('should accept valid tenant response with required fields', () => {
        const dto: SaasTenantDto = {
          id: 'tenant-123',
          name: 'Test Tenant',
        };
        expect(dto.id).toBe('tenant-123');
        expect(dto.name).toBe('Test Tenant');
      });

      it('should accept full tenant response with all optional fields', () => {
        const dto: SaasTenantDto = {
          id: 'tenant-456',
          name: 'Enterprise Tenant',
          editionId: 'edition-enterprise',
          editionName: 'Enterprise',
          concurrencyStamp: 'stamp-xyz',
          creationTime: '2024-01-15T10:00:00Z',
          creatorId: 'admin-user',
          extraProperties: { verified: true },
        };
        expect(dto.id).toBe('tenant-456');
        expect(dto.editionId).toBe('edition-enterprise');
        expect(dto.editionName).toBe('Enterprise');
        expect(dto.concurrencyStamp).toBe('stamp-xyz');
        expect(dto.creatorId).toBe('admin-user');
      });

      it('should accept Date object for creationTime', () => {
        const dto: SaasTenantDto = {
          id: 'tenant-789',
          name: 'Pro Tenant',
          creationTime: new Date('2024-01-01'),
        };
        expect(dto.creationTime).toBeInstanceOf(Date);
      });

      it('should handle undefined optional fields', () => {
        const dto: SaasTenantDto = {
          id: 'tenant-min',
          name: 'Minimal',
          editionId: undefined,
          editionName: undefined,
          concurrencyStamp: undefined,
          creationTime: undefined,
          creatorId: undefined,
          extraProperties: undefined,
        };
        expect(dto.editionId).toBeUndefined();
        expect(dto.editionName).toBeUndefined();
      });
    });

    describe('GetTenantsInput', () => {
      it('should accept empty input', () => {
        const input: GetTenantsInput = {};
        expect(input).toEqual({});
      });

      it('should accept filter', () => {
        const input: GetTenantsInput = { filter: 'Enterprise' };
        expect(input.filter).toBe('Enterprise');
      });

      it('should accept getEditionNames flag', () => {
        const input: GetTenantsInput = { getEditionNames: true };
        expect(input.getEditionNames).toBe(true);
      });

      it('should accept pagination params', () => {
        const input: GetTenantsInput = {
          skipCount: 20,
          maxResultCount: 10,
        };
        expect(input.skipCount).toBe(20);
        expect(input.maxResultCount).toBe(10);
      });

      it('should accept sorting', () => {
        const input: GetTenantsInput = { sorting: 'name asc' };
        expect(input.sorting).toBe('name asc');
      });

      it('should accept all params', () => {
        const input: GetTenantsInput = {
          filter: 'test',
          getEditionNames: true,
          skipCount: 0,
          maxResultCount: 100,
          sorting: 'creationTime desc',
        };
        expect(input.filter).toBe('test');
        expect(input.getEditionNames).toBe(true);
        expect(input.skipCount).toBe(0);
        expect(input.maxResultCount).toBe(100);
        expect(input.sorting).toBe('creationTime desc');
      });
    });
  });

  describe('Type Compatibility', () => {
    it('EditionCreateDto should be assignable to EditionCreateOrUpdateDtoBase', () => {
      const createDto: EditionCreateDto = { displayName: 'Test' };
      const baseDto: EditionCreateOrUpdateDtoBase = createDto;
      expect(baseDto.displayName).toBe('Test');
    });

    it('EditionUpdateDto should be assignable to EditionCreateOrUpdateDtoBase', () => {
      const updateDto: EditionUpdateDto = { displayName: 'Test' };
      const baseDto: EditionCreateOrUpdateDtoBase = updateDto;
      expect(baseDto.displayName).toBe('Test');
    });

    it('SaasTenantUpdateDto should be assignable to SaasTenantCreateOrUpdateDtoBase', () => {
      const updateDto: SaasTenantUpdateDto = { name: 'Test' };
      const baseDto: SaasTenantCreateOrUpdateDtoBase = updateDto;
      expect(baseDto.name).toBe('Test');
    });
  });
});
