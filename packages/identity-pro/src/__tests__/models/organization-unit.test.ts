/**
 * Tests for Organization Unit Models
 * @abpjs/identity-pro v2.9.0
 */
import { describe, it, expect } from 'vitest';
import {
  createOrganizationUnitWithDetailsDto,
  createOrganizationUnitCreateDto,
  createOrganizationUnitUpdateDto,
  createOrganizationUnitCreateOrUpdateDtoBase,
  createOrganizationUnitMoveInput,
  createOrganizationUnitRoleInput,
  createOrganizationUnitUserInput,
  createGetOrganizationUnitInput,
  OrganizationUnitWithDetailsDto,
  OrganizationUnitCreateDto,
  OrganizationUnitUpdateDto,
  OrganizationUnitCreateOrUpdateDtoBase,
  OrganizationUnitMoveInput,
  OrganizationUnitRoleInput,
  OrganizationUnitUserInput,
  GetOrganizationUnitInput,
} from '../../models';

describe('OrganizationUnitWithDetailsDto', () => {
  describe('createOrganizationUnitWithDetailsDto', () => {
    it('should create with default values', () => {
      const dto = createOrganizationUnitWithDetailsDto();

      expect(dto.parentId).toBeUndefined();
      expect(dto.code).toBe('');
      expect(dto.displayName).toBe('');
      expect(dto.roles).toEqual([]);
      expect(dto.isDeleted).toBe(false);
      expect(dto.deleterId).toBeUndefined();
      expect(dto.deletionTime).toBeUndefined();
      expect(dto.lastModificationTime).toBeUndefined();
      expect(dto.lastModifierId).toBeUndefined();
      expect(dto.creationTime).toBeDefined();
      expect(dto.creatorId).toBeUndefined();
      expect(dto.id).toBe('');
      expect(dto.extraProperties).toEqual([]);
    });

    it('should create with partial values', () => {
      const dto = createOrganizationUnitWithDetailsDto({
        id: 'unit-1',
        displayName: 'Engineering',
        code: '00001',
        parentId: 'parent-1',
      });

      expect(dto.id).toBe('unit-1');
      expect(dto.displayName).toBe('Engineering');
      expect(dto.code).toBe('00001');
      expect(dto.parentId).toBe('parent-1');
    });

    it('should create with full values', () => {
      const now = new Date().toISOString();
      const dto = createOrganizationUnitWithDetailsDto({
        id: 'unit-1',
        displayName: 'Engineering',
        code: '00001.00002',
        parentId: 'parent-1',
        roles: [{ id: 'role-1', name: 'Admin' }],
        isDeleted: false,
        creationTime: now,
        creatorId: 'creator-1',
        lastModificationTime: now,
        lastModifierId: 'modifier-1',
        extraProperties: [{ key: 'value' }],
      });

      expect(dto.id).toBe('unit-1');
      expect(dto.roles).toHaveLength(1);
      expect(dto.creationTime).toBe(now);
      expect(dto.creatorId).toBe('creator-1');
      expect(dto.extraProperties).toHaveLength(1);
    });

    it('should handle deleted unit', () => {
      const dto = createOrganizationUnitWithDetailsDto({
        isDeleted: true,
        deleterId: 'deleter-1',
        deletionTime: '2024-01-01T00:00:00Z',
      });

      expect(dto.isDeleted).toBe(true);
      expect(dto.deleterId).toBe('deleter-1');
      expect(dto.deletionTime).toBe('2024-01-01T00:00:00Z');
    });
  });

  describe('type compatibility', () => {
    it('should be assignable to OrganizationUnitWithDetailsDto', () => {
      const dto: OrganizationUnitWithDetailsDto = createOrganizationUnitWithDetailsDto({
        id: 'test-id',
        displayName: 'Test Unit',
        code: '00001',
        creationTime: new Date().toISOString(),
      });

      expect(dto).toBeDefined();
    });
  });
});

describe('OrganizationUnitCreateOrUpdateDtoBase', () => {
  describe('createOrganizationUnitCreateOrUpdateDtoBase', () => {
    it('should create with default values', () => {
      const dto = createOrganizationUnitCreateOrUpdateDtoBase();
      expect(dto.displayName).toBe('');
    });

    it('should create with display name', () => {
      const dto = createOrganizationUnitCreateOrUpdateDtoBase({
        displayName: 'Marketing',
      });
      expect(dto.displayName).toBe('Marketing');
    });
  });

  describe('type compatibility', () => {
    it('should be assignable to OrganizationUnitCreateOrUpdateDtoBase', () => {
      const dto: OrganizationUnitCreateOrUpdateDtoBase = createOrganizationUnitCreateOrUpdateDtoBase({
        displayName: 'Test',
      });
      expect(dto.displayName).toBe('Test');
    });
  });
});

describe('OrganizationUnitCreateDto', () => {
  describe('createOrganizationUnitCreateDto', () => {
    it('should create with default values', () => {
      const dto = createOrganizationUnitCreateDto();

      expect(dto.displayName).toBe('');
      expect(dto.parentId).toBeUndefined();
      expect(dto.extraProperties).toEqual([]);
    });

    it('should create root unit (no parent)', () => {
      const dto = createOrganizationUnitCreateDto({
        displayName: 'Root Unit',
      });

      expect(dto.displayName).toBe('Root Unit');
      expect(dto.parentId).toBeUndefined();
    });

    it('should create child unit (with parent)', () => {
      const dto = createOrganizationUnitCreateDto({
        displayName: 'Child Unit',
        parentId: 'parent-unit-id',
      });

      expect(dto.displayName).toBe('Child Unit');
      expect(dto.parentId).toBe('parent-unit-id');
    });

    it('should include extra properties', () => {
      const dto = createOrganizationUnitCreateDto({
        displayName: 'Unit with extras',
        extraProperties: [{ customField: 'value' }],
      });

      expect(dto.extraProperties).toHaveLength(1);
    });
  });

  describe('type compatibility', () => {
    it('should be assignable to OrganizationUnitCreateDto', () => {
      const dto: OrganizationUnitCreateDto = createOrganizationUnitCreateDto({
        displayName: 'Test',
        parentId: 'parent-1',
      });
      expect(dto).toBeDefined();
    });

    it('should extend OrganizationUnitCreateOrUpdateDtoBase', () => {
      const dto = createOrganizationUnitCreateDto({ displayName: 'Test' });
      const base: OrganizationUnitCreateOrUpdateDtoBase = dto;
      expect(base.displayName).toBe('Test');
    });
  });
});

describe('OrganizationUnitUpdateDto', () => {
  describe('createOrganizationUnitUpdateDto', () => {
    it('should create with default values', () => {
      const dto = createOrganizationUnitUpdateDto();

      expect(dto.displayName).toBe('');
      expect(dto.extraProperties).toBeUndefined();
    });

    it('should create with display name', () => {
      const dto = createOrganizationUnitUpdateDto({
        displayName: 'Updated Name',
      });

      expect(dto.displayName).toBe('Updated Name');
    });

    it('should include extra properties', () => {
      const dto = createOrganizationUnitUpdateDto({
        displayName: 'Test',
        extraProperties: [{ key: 'value' }],
      });

      expect(dto.extraProperties).toHaveLength(1);
    });
  });

  describe('type compatibility', () => {
    it('should be assignable to OrganizationUnitUpdateDto', () => {
      const dto: OrganizationUnitUpdateDto = createOrganizationUnitUpdateDto({
        displayName: 'Test',
      });
      expect(dto).toBeDefined();
    });

    it('should extend OrganizationUnitCreateOrUpdateDtoBase', () => {
      const dto = createOrganizationUnitUpdateDto({ displayName: 'Test' });
      const base: OrganizationUnitCreateOrUpdateDtoBase = dto;
      expect(base.displayName).toBe('Test');
    });
  });
});

describe('OrganizationUnitMoveInput', () => {
  describe('createOrganizationUnitMoveInput', () => {
    it('should create with default values', () => {
      const input = createOrganizationUnitMoveInput();
      expect(input.newParentId).toBeUndefined();
    });

    it('should create with new parent ID', () => {
      const input = createOrganizationUnitMoveInput({
        newParentId: 'new-parent-id',
      });
      expect(input.newParentId).toBe('new-parent-id');
    });

    it('should support moving to root (null parent)', () => {
      const input = createOrganizationUnitMoveInput({
        newParentId: undefined,
      });
      expect(input.newParentId).toBeUndefined();
    });
  });

  describe('type compatibility', () => {
    it('should be assignable to OrganizationUnitMoveInput', () => {
      const input: OrganizationUnitMoveInput = createOrganizationUnitMoveInput({
        newParentId: 'parent-1',
      });
      expect(input).toBeDefined();
    });
  });
});

describe('OrganizationUnitRoleInput', () => {
  describe('createOrganizationUnitRoleInput', () => {
    it('should create with default values', () => {
      const input = createOrganizationUnitRoleInput();
      expect(input.roleIds).toEqual([]);
    });

    it('should create with role IDs', () => {
      const input = createOrganizationUnitRoleInput({
        roleIds: ['role-1', 'role-2', 'role-3'],
      });
      expect(input.roleIds).toHaveLength(3);
      expect(input.roleIds).toContain('role-1');
      expect(input.roleIds).toContain('role-2');
      expect(input.roleIds).toContain('role-3');
    });

    it('should handle single role', () => {
      const input = createOrganizationUnitRoleInput({
        roleIds: ['single-role'],
      });
      expect(input.roleIds).toHaveLength(1);
    });
  });

  describe('type compatibility', () => {
    it('should be assignable to OrganizationUnitRoleInput', () => {
      const input: OrganizationUnitRoleInput = createOrganizationUnitRoleInput({
        roleIds: ['role-1'],
      });
      expect(input).toBeDefined();
    });
  });
});

describe('OrganizationUnitUserInput', () => {
  describe('createOrganizationUnitUserInput', () => {
    it('should create with default values', () => {
      const input = createOrganizationUnitUserInput();
      expect(input.userIds).toEqual([]);
    });

    it('should create with user IDs', () => {
      const input = createOrganizationUnitUserInput({
        userIds: ['user-1', 'user-2'],
      });
      expect(input.userIds).toHaveLength(2);
      expect(input.userIds).toContain('user-1');
      expect(input.userIds).toContain('user-2');
    });

    it('should handle single user', () => {
      const input = createOrganizationUnitUserInput({
        userIds: ['single-user'],
      });
      expect(input.userIds).toHaveLength(1);
    });
  });

  describe('type compatibility', () => {
    it('should be assignable to OrganizationUnitUserInput', () => {
      const input: OrganizationUnitUserInput = createOrganizationUnitUserInput({
        userIds: ['user-1'],
      });
      expect(input).toBeDefined();
    });
  });
});

describe('GetOrganizationUnitInput', () => {
  describe('createGetOrganizationUnitInput', () => {
    it('should create with default values', () => {
      const input = createGetOrganizationUnitInput();

      expect(input.filter).toBe('');
      expect(input.sorting).toBe('');
      expect(input.skipCount).toBe(0);
      expect(input.maxResultCount).toBe(10);
    });

    it('should create with filter', () => {
      const input = createGetOrganizationUnitInput({
        filter: 'engineering',
      });
      expect(input.filter).toBe('engineering');
    });

    it('should create with pagination', () => {
      const input = createGetOrganizationUnitInput({
        skipCount: 10,
        maxResultCount: 20,
      });
      expect(input.skipCount).toBe(10);
      expect(input.maxResultCount).toBe(20);
    });

    it('should create with sorting', () => {
      const input = createGetOrganizationUnitInput({
        sorting: 'displayName asc',
      });
      expect(input.sorting).toBe('displayName asc');
    });

    it('should create with all parameters', () => {
      const input = createGetOrganizationUnitInput({
        filter: 'sales',
        sorting: 'code desc',
        skipCount: 5,
        maxResultCount: 25,
      });

      expect(input.filter).toBe('sales');
      expect(input.sorting).toBe('code desc');
      expect(input.skipCount).toBe(5);
      expect(input.maxResultCount).toBe(25);
    });
  });

  describe('type compatibility', () => {
    it('should be assignable to GetOrganizationUnitInput', () => {
      const input: GetOrganizationUnitInput = createGetOrganizationUnitInput({
        filter: 'test',
      });
      expect(input).toBeDefined();
    });
  });
});
