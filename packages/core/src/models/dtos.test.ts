import { describe, it, expect } from 'vitest';
import {
  ListResultDto,
  PagedResultDto,
  LimitedResultRequestDto,
  PagedResultRequestDto,
  PagedAndSortedResultRequestDto,
  EntityDto,
  CreationAuditedEntityDto,
  CreationAuditedEntityWithUserDto,
  AuditedEntityDto,
  AuditedEntityWithUserDto,
  FullAuditedEntityDto,
  FullAuditedEntityWithUserDto,
} from './dtos';

describe('DTOs (v2.4.0)', () => {
  describe('ListResultDto', () => {
    it('should create empty instance', () => {
      const dto = new ListResultDto();
      expect(dto.items).toBeUndefined();
    });

    it('should create instance with initial values', () => {
      const dto = new ListResultDto({ items: [1, 2, 3] });
      expect(dto.items).toEqual([1, 2, 3]);
    });

    it('should work with typed items', () => {
      interface User {
        id: string;
        name: string;
      }
      const dto = new ListResultDto<User>({
        items: [{ id: '1', name: 'User 1' }],
      });
      expect(dto.items).toHaveLength(1);
      expect(dto.items?.[0].name).toBe('User 1');
    });
  });

  describe('PagedResultDto', () => {
    it('should create empty instance', () => {
      const dto = new PagedResultDto();
      expect(dto.items).toBeUndefined();
      expect(dto.totalCount).toBeUndefined();
    });

    it('should create instance with initial values', () => {
      const dto = new PagedResultDto({
        items: ['a', 'b'],
        totalCount: 10,
      });
      expect(dto.items).toEqual(['a', 'b']);
      expect(dto.totalCount).toBe(10);
    });

    it('should extend ListResultDto', () => {
      const dto = new PagedResultDto();
      expect(dto).toBeInstanceOf(ListResultDto);
    });
  });

  describe('LimitedResultRequestDto', () => {
    it('should have default maxResultCount of 10', () => {
      const dto = new LimitedResultRequestDto();
      expect(dto.maxResultCount).toBe(10);
    });

    it('should accept custom maxResultCount', () => {
      const dto = new LimitedResultRequestDto({ maxResultCount: 25 });
      expect(dto.maxResultCount).toBe(25);
    });
  });

  describe('PagedResultRequestDto', () => {
    it('should extend LimitedResultRequestDto', () => {
      const dto = new PagedResultRequestDto();
      expect(dto).toBeInstanceOf(LimitedResultRequestDto);
      expect(dto.maxResultCount).toBe(10);
    });

    it('should create instance with skipCount', () => {
      const dto = new PagedResultRequestDto({
        skipCount: 20,
        maxResultCount: 10,
      });
      expect(dto.skipCount).toBe(20);
      expect(dto.maxResultCount).toBe(10);
    });
  });

  describe('PagedAndSortedResultRequestDto', () => {
    it('should extend PagedResultRequestDto', () => {
      const dto = new PagedAndSortedResultRequestDto();
      expect(dto).toBeInstanceOf(PagedResultRequestDto);
    });

    it('should create instance with sorting', () => {
      const dto = new PagedAndSortedResultRequestDto({
        sorting: 'name desc',
        skipCount: 0,
        maxResultCount: 10,
      });
      expect(dto.sorting).toBe('name desc');
      expect(dto.skipCount).toBe(0);
      expect(dto.maxResultCount).toBe(10);
    });
  });

  describe('EntityDto', () => {
    it('should create empty instance', () => {
      const dto = new EntityDto();
      expect(dto.id).toBeUndefined();
    });

    it('should create instance with id', () => {
      const dto = new EntityDto({ id: 'abc-123' });
      expect(dto.id).toBe('abc-123');
    });

    it('should support different key types', () => {
      const stringDto = new EntityDto<string>({ id: 'abc' });
      expect(stringDto.id).toBe('abc');

      const numberDto = new EntityDto<number>({ id: 123 });
      expect(numberDto.id).toBe(123);
    });
  });

  describe('CreationAuditedEntityDto', () => {
    it('should extend EntityDto', () => {
      const dto = new CreationAuditedEntityDto();
      expect(dto).toBeInstanceOf(EntityDto);
    });

    it('should create instance with creation audit fields', () => {
      const dto = new CreationAuditedEntityDto({
        id: '1',
        creationTime: '2024-01-01T00:00:00Z',
        creatorId: 'user-1',
      });
      expect(dto.id).toBe('1');
      expect(dto.creationTime).toBe('2024-01-01T00:00:00Z');
      expect(dto.creatorId).toBe('user-1');
    });

    it('should accept Date for creationTime', () => {
      const date = new Date('2024-01-01');
      const dto = new CreationAuditedEntityDto({
        creationTime: date,
      });
      expect(dto.creationTime).toBe(date);
    });
  });

  describe('CreationAuditedEntityWithUserDto', () => {
    interface UserDto {
      id: string;
      userName: string;
    }

    it('should extend CreationAuditedEntityDto', () => {
      const dto = new CreationAuditedEntityWithUserDto<UserDto>();
      expect(dto).toBeInstanceOf(CreationAuditedEntityDto);
    });

    it('should create instance with creator user', () => {
      const dto = new CreationAuditedEntityWithUserDto<UserDto>({
        id: '1',
        creator: { id: 'user-1', userName: 'admin' },
      });
      expect(dto.creator?.userName).toBe('admin');
    });
  });

  describe('AuditedEntityDto', () => {
    it('should extend CreationAuditedEntityDto', () => {
      const dto = new AuditedEntityDto();
      expect(dto).toBeInstanceOf(CreationAuditedEntityDto);
    });

    it('should create instance with modification audit fields', () => {
      const dto = new AuditedEntityDto({
        id: '1',
        creationTime: '2024-01-01T00:00:00Z',
        creatorId: 'user-1',
        lastModificationTime: '2024-01-02T00:00:00Z',
        lastModifierId: 'user-2',
      });
      expect(dto.lastModificationTime).toBe('2024-01-02T00:00:00Z');
      expect(dto.lastModifierId).toBe('user-2');
    });
  });

  describe('AuditedEntityWithUserDto', () => {
    interface UserDto {
      id: string;
      userName: string;
    }

    it('should extend AuditedEntityDto', () => {
      const dto = new AuditedEntityWithUserDto<UserDto>();
      expect(dto).toBeInstanceOf(AuditedEntityDto);
    });

    it('should create instance with creator and lastModifier users', () => {
      const dto = new AuditedEntityWithUserDto<UserDto>({
        id: '1',
        creator: { id: 'user-1', userName: 'admin' },
        lastModifier: { id: 'user-2', userName: 'editor' },
      });
      expect(dto.creator?.userName).toBe('admin');
      expect(dto.lastModifier?.userName).toBe('editor');
    });
  });

  describe('FullAuditedEntityDto', () => {
    it('should extend AuditedEntityDto', () => {
      const dto = new FullAuditedEntityDto();
      expect(dto).toBeInstanceOf(AuditedEntityDto);
    });

    it('should create instance with soft delete fields', () => {
      const dto = new FullAuditedEntityDto({
        id: '1',
        isDeleted: true,
        deleterId: 'user-3',
        deletionTime: '2024-01-03T00:00:00Z',
      });
      expect(dto.isDeleted).toBe(true);
      expect(dto.deleterId).toBe('user-3');
      expect(dto.deletionTime).toBe('2024-01-03T00:00:00Z');
    });

    it('should default isDeleted to undefined', () => {
      const dto = new FullAuditedEntityDto({ id: '1' });
      expect(dto.isDeleted).toBeUndefined();
    });
  });

  describe('FullAuditedEntityWithUserDto', () => {
    interface UserDto {
      id: string;
      userName: string;
    }

    it('should extend FullAuditedEntityDto', () => {
      const dto = new FullAuditedEntityWithUserDto<UserDto>();
      expect(dto).toBeInstanceOf(FullAuditedEntityDto);
    });

    it('should create instance with all user references', () => {
      const dto = new FullAuditedEntityWithUserDto<UserDto>({
        id: '1',
        creator: { id: 'user-1', userName: 'admin' },
        lastModifier: { id: 'user-2', userName: 'editor' },
        deleter: { id: 'user-3', userName: 'manager' },
        isDeleted: true,
      });
      expect(dto.creator?.userName).toBe('admin');
      expect(dto.lastModifier?.userName).toBe('editor');
      expect(dto.deleter?.userName).toBe('manager');
      expect(dto.isDeleted).toBe(true);
    });
  });
});
