/**
 * Tests for Extensible Entity DTOs
 * @since 2.9.0
 */

import { describe, it, expect } from 'vitest';
import {
  ExtensibleObject,
  ExtensibleEntityDto,
  ExtensibleCreationAuditedEntityDto,
  ExtensibleAuditedEntityDto,
  ExtensibleAuditedEntityWithUserDto,
  ExtensibleCreationAuditedEntityWithUserDto,
  ExtensibleFullAuditedEntityDto,
  ExtensibleFullAuditedEntityWithUserDto,
} from '../../models/dtos';

describe('Extensible DTOs (v2.9.0)', () => {
  describe('ExtensibleObject', () => {
    it('should create with empty extraProperties by default', () => {
      const obj = new ExtensibleObject();
      expect(obj.extraProperties).toEqual({});
    });

    it('should accept initial values', () => {
      const obj = new ExtensibleObject({
        extraProperties: { custom: 'value' },
      });
      expect(obj.extraProperties).toEqual({ custom: 'value' });
    });

    it('should handle undefined initial values', () => {
      const obj = new ExtensibleObject(undefined);
      expect(obj.extraProperties).toEqual({});
    });

    it('should store any type of value in extraProperties', () => {
      const obj = new ExtensibleObject({
        extraProperties: {
          stringProp: 'hello',
          numberProp: 42,
          booleanProp: true,
          objectProp: { nested: 'value' },
          arrayProp: [1, 2, 3],
        },
      });
      expect(obj.extraProperties.stringProp).toBe('hello');
      expect(obj.extraProperties.numberProp).toBe(42);
      expect(obj.extraProperties.booleanProp).toBe(true);
      expect(obj.extraProperties.objectProp).toEqual({ nested: 'value' });
      expect(obj.extraProperties.arrayProp).toEqual([1, 2, 3]);
    });
  });

  describe('ExtensibleEntityDto', () => {
    it('should create with default extraProperties', () => {
      const entity = new ExtensibleEntityDto();
      expect(entity.extraProperties).toEqual({});
      expect(entity.id).toBeUndefined();
    });

    it('should accept id and extraProperties', () => {
      const entity = new ExtensibleEntityDto({
        id: '123',
        extraProperties: { custom: 'value' },
      });
      expect(entity.id).toBe('123');
      expect(entity.extraProperties).toEqual({ custom: 'value' });
    });

    it('should support different key types', () => {
      const entityWithNumber = new ExtensibleEntityDto<number>({ id: 42 });
      expect(entityWithNumber.id).toBe(42);

      const entityWithString = new ExtensibleEntityDto<string>({ id: 'guid-123' });
      expect(entityWithString.id).toBe('guid-123');
    });

    it('should inherit extraProperties from ExtensibleObject', () => {
      const entity = new ExtensibleEntityDto({
        id: '1',
        extraProperties: { inherited: true },
      });
      expect(entity).toBeInstanceOf(ExtensibleObject);
      expect(entity.extraProperties).toEqual({ inherited: true });
    });
  });

  describe('ExtensibleCreationAuditedEntityDto', () => {
    it('should create with default values', () => {
      const entity = new ExtensibleCreationAuditedEntityDto();
      expect(entity.extraProperties).toEqual({});
      expect(entity.id).toBeUndefined();
      expect(entity.creationTime).toBeUndefined();
      expect(entity.creatorId).toBeUndefined();
    });

    it('should accept all properties', () => {
      const creationTime = new Date('2024-01-15');
      const entity = new ExtensibleCreationAuditedEntityDto({
        id: '123',
        creationTime,
        creatorId: 'user-1',
        extraProperties: { custom: 'value' },
      });
      expect(entity.id).toBe('123');
      expect(entity.creationTime).toEqual(creationTime);
      expect(entity.creatorId).toBe('user-1');
      expect(entity.extraProperties).toEqual({ custom: 'value' });
    });

    it('should accept creationTime as string', () => {
      const entity = new ExtensibleCreationAuditedEntityDto({
        creationTime: '2024-01-15T10:00:00Z',
      });
      expect(entity.creationTime).toBe('2024-01-15T10:00:00Z');
    });

    it('should inherit from ExtensibleEntityDto', () => {
      const entity = new ExtensibleCreationAuditedEntityDto({ id: '1' });
      expect(entity).toBeInstanceOf(ExtensibleEntityDto);
    });
  });

  describe('ExtensibleAuditedEntityDto', () => {
    it('should create with default values', () => {
      const entity = new ExtensibleAuditedEntityDto();
      expect(entity.extraProperties).toEqual({});
      expect(entity.id).toBeUndefined();
      expect(entity.creationTime).toBeUndefined();
      expect(entity.creatorId).toBeUndefined();
      expect(entity.lastModificationTime).toBeUndefined();
      expect(entity.lastModifierId).toBeUndefined();
    });

    it('should accept all properties', () => {
      const creationTime = new Date('2024-01-15');
      const modificationTime = new Date('2024-01-20');
      const entity = new ExtensibleAuditedEntityDto({
        id: '123',
        creationTime,
        creatorId: 'creator-1',
        lastModificationTime: modificationTime,
        lastModifierId: 'modifier-1',
        extraProperties: { custom: 'value' },
      });
      expect(entity.id).toBe('123');
      expect(entity.creationTime).toEqual(creationTime);
      expect(entity.creatorId).toBe('creator-1');
      expect(entity.lastModificationTime).toEqual(modificationTime);
      expect(entity.lastModifierId).toBe('modifier-1');
      expect(entity.extraProperties).toEqual({ custom: 'value' });
    });

    it('should accept dates as strings', () => {
      const entity = new ExtensibleAuditedEntityDto({
        creationTime: '2024-01-15T10:00:00Z',
        lastModificationTime: '2024-01-20T14:00:00Z',
      });
      expect(entity.creationTime).toBe('2024-01-15T10:00:00Z');
      expect(entity.lastModificationTime).toBe('2024-01-20T14:00:00Z');
    });

    it('should inherit from ExtensibleCreationAuditedEntityDto', () => {
      const entity = new ExtensibleAuditedEntityDto({ id: '1' });
      expect(entity).toBeInstanceOf(ExtensibleCreationAuditedEntityDto);
    });
  });

  describe('ExtensibleAuditedEntityWithUserDto', () => {
    interface UserDto {
      id: string;
      userName: string;
    }

    it('should create with default values', () => {
      const entity = new ExtensibleAuditedEntityWithUserDto();
      expect(entity.extraProperties).toEqual({});
      expect(entity.creator).toBeUndefined();
      expect(entity.lastModifier).toBeUndefined();
    });

    it('should accept user objects', () => {
      const creator: UserDto = { id: 'creator-1', userName: 'creator' };
      const modifier: UserDto = { id: 'modifier-1', userName: 'modifier' };

      const entity = new ExtensibleAuditedEntityWithUserDto<string, UserDto>({
        id: '123',
        creator,
        lastModifier: modifier,
        extraProperties: { custom: 'value' },
      });

      expect(entity.id).toBe('123');
      expect(entity.creator).toEqual(creator);
      expect(entity.lastModifier).toEqual(modifier);
      expect(entity.extraProperties).toEqual({ custom: 'value' });
    });

    it('should inherit from ExtensibleAuditedEntityDto', () => {
      const entity = new ExtensibleAuditedEntityWithUserDto({ id: '1' });
      expect(entity).toBeInstanceOf(ExtensibleAuditedEntityDto);
    });
  });

  describe('ExtensibleCreationAuditedEntityWithUserDto', () => {
    interface UserDto {
      id: string;
      userName: string;
    }

    it('should create with default values', () => {
      const entity = new ExtensibleCreationAuditedEntityWithUserDto();
      expect(entity.extraProperties).toEqual({});
      expect(entity.creator).toBeUndefined();
    });

    it('should accept creator user object', () => {
      const creator: UserDto = { id: 'creator-1', userName: 'creator' };

      const entity = new ExtensibleCreationAuditedEntityWithUserDto<string, UserDto>({
        id: '123',
        creator,
        creationTime: new Date('2024-01-15'),
        creatorId: 'creator-1',
        extraProperties: { custom: 'value' },
      });

      expect(entity.id).toBe('123');
      expect(entity.creator).toEqual(creator);
      expect(entity.creatorId).toBe('creator-1');
      expect(entity.extraProperties).toEqual({ custom: 'value' });
    });

    it('should inherit from ExtensibleCreationAuditedEntityDto', () => {
      const entity = new ExtensibleCreationAuditedEntityWithUserDto({ id: '1' });
      expect(entity).toBeInstanceOf(ExtensibleCreationAuditedEntityDto);
    });
  });

  describe('ExtensibleFullAuditedEntityDto', () => {
    it('should create with default values', () => {
      const entity = new ExtensibleFullAuditedEntityDto();
      expect(entity.extraProperties).toEqual({});
      expect(entity.isDeleted).toBeUndefined();
      expect(entity.deleterId).toBeUndefined();
      expect(entity.deletionTime).toBeUndefined();
    });

    it('should accept all properties', () => {
      const creationTime = new Date('2024-01-15');
      const modificationTime = new Date('2024-01-20');
      const deletionTime = new Date('2024-01-25');

      const entity = new ExtensibleFullAuditedEntityDto({
        id: '123',
        creationTime,
        creatorId: 'creator-1',
        lastModificationTime: modificationTime,
        lastModifierId: 'modifier-1',
        isDeleted: true,
        deleterId: 'deleter-1',
        deletionTime,
        extraProperties: { custom: 'value' },
      });

      expect(entity.id).toBe('123');
      expect(entity.creationTime).toEqual(creationTime);
      expect(entity.creatorId).toBe('creator-1');
      expect(entity.lastModificationTime).toEqual(modificationTime);
      expect(entity.lastModifierId).toBe('modifier-1');
      expect(entity.isDeleted).toBe(true);
      expect(entity.deleterId).toBe('deleter-1');
      expect(entity.deletionTime).toEqual(deletionTime);
      expect(entity.extraProperties).toEqual({ custom: 'value' });
    });

    it('should accept deletionTime as string', () => {
      const entity = new ExtensibleFullAuditedEntityDto({
        deletionTime: '2024-01-25T10:00:00Z',
      });
      expect(entity.deletionTime).toBe('2024-01-25T10:00:00Z');
    });

    it('should handle soft delete false', () => {
      const entity = new ExtensibleFullAuditedEntityDto({
        isDeleted: false,
      });
      expect(entity.isDeleted).toBe(false);
    });

    it('should inherit from ExtensibleAuditedEntityDto', () => {
      const entity = new ExtensibleFullAuditedEntityDto({ id: '1' });
      expect(entity).toBeInstanceOf(ExtensibleAuditedEntityDto);
    });
  });

  describe('ExtensibleFullAuditedEntityWithUserDto', () => {
    interface UserDto {
      id: string;
      userName: string;
    }

    it('should create with default values', () => {
      const entity = new ExtensibleFullAuditedEntityWithUserDto();
      expect(entity.extraProperties).toEqual({});
      expect(entity.creator).toBeUndefined();
      expect(entity.lastModifier).toBeUndefined();
      expect(entity.deleter).toBeUndefined();
    });

    it('should accept all user objects', () => {
      const creator: UserDto = { id: 'creator-1', userName: 'creator' };
      const modifier: UserDto = { id: 'modifier-1', userName: 'modifier' };
      const deleter: UserDto = { id: 'deleter-1', userName: 'deleter' };

      const entity = new ExtensibleFullAuditedEntityWithUserDto<string, UserDto>({
        id: '123',
        creator,
        lastModifier: modifier,
        deleter,
        isDeleted: true,
        deletionTime: new Date('2024-01-25'),
        extraProperties: { custom: 'value' },
      });

      expect(entity.id).toBe('123');
      expect(entity.creator).toEqual(creator);
      expect(entity.lastModifier).toEqual(modifier);
      expect(entity.deleter).toEqual(deleter);
      expect(entity.isDeleted).toBe(true);
      expect(entity.extraProperties).toEqual({ custom: 'value' });
    });

    it('should inherit from ExtensibleFullAuditedEntityDto', () => {
      const entity = new ExtensibleFullAuditedEntityWithUserDto({ id: '1' });
      expect(entity).toBeInstanceOf(ExtensibleFullAuditedEntityDto);
    });
  });

  describe('inheritance chain', () => {
    it('should have correct inheritance for ExtensibleFullAuditedEntityWithUserDto', () => {
      const entity = new ExtensibleFullAuditedEntityWithUserDto({
        id: '1',
        creationTime: new Date(),
        lastModificationTime: new Date(),
        isDeleted: false,
        extraProperties: { test: true },
      });

      expect(entity).toBeInstanceOf(ExtensibleFullAuditedEntityDto);
      expect(entity).toBeInstanceOf(ExtensibleAuditedEntityDto);
      expect(entity).toBeInstanceOf(ExtensibleCreationAuditedEntityDto);
      expect(entity).toBeInstanceOf(ExtensibleEntityDto);
      expect(entity).toBeInstanceOf(ExtensibleObject);
    });
  });

  describe('extraProperties persistence', () => {
    it('should preserve extraProperties through inheritance chain', () => {
      const extraProps = {
        customField1: 'value1',
        customField2: 42,
        customObject: { nested: true },
      };

      const entity = new ExtensibleFullAuditedEntityWithUserDto({
        id: '123',
        extraProperties: extraProps,
      });

      expect(entity.extraProperties).toEqual(extraProps);
      expect(entity.extraProperties.customField1).toBe('value1');
      expect(entity.extraProperties.customField2).toBe(42);
      expect(entity.extraProperties.customObject).toEqual({ nested: true });
    });
  });
});
