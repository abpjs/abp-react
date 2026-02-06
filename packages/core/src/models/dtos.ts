/**
 * ABP Standard DTOs
 * Translated from @abp/ng.core v2.9.0
 *
 * These are standard DTO classes used throughout ABP applications
 * for consistent data transfer patterns.
 *
 * @since 2.4.0
 * @updated 2.9.0 - Added Extensible entity DTOs
 */

import { ABP } from './common';

/**
 * Generic list result DTO
 */
export class ListResultDto<T> {
  items?: T[];

  constructor(initialValues?: Partial<ListResultDto<T>>) {
    if (initialValues) {
      Object.assign(this, initialValues);
    }
  }
}

/**
 * Paged result DTO with total count
 */
export class PagedResultDto<T> extends ListResultDto<T> {
  totalCount?: number;

  constructor(initialValues?: Partial<PagedResultDto<T>>) {
    super(initialValues);
    if (initialValues) {
      this.totalCount = initialValues.totalCount;
    }
  }
}

/**
 * Limited result request DTO (for max result count)
 */
export class LimitedResultRequestDto {
  maxResultCount: number = 10;

  constructor(initialValues?: Partial<LimitedResultRequestDto>) {
    if (initialValues) {
      Object.assign(this, initialValues);
    }
  }
}

/**
 * Paged result request DTO (with skip count)
 */
export class PagedResultRequestDto extends LimitedResultRequestDto {
  skipCount?: number;

  constructor(initialValues?: Partial<PagedResultRequestDto>) {
    super(initialValues);
    if (initialValues) {
      this.skipCount = initialValues.skipCount;
    }
  }
}

/**
 * Paged and sorted result request DTO
 */
export class PagedAndSortedResultRequestDto extends PagedResultRequestDto {
  sorting?: string;

  constructor(initialValues?: Partial<PagedAndSortedResultRequestDto>) {
    super(initialValues);
    if (initialValues) {
      this.sorting = initialValues.sorting;
    }
  }
}

/**
 * Basic entity DTO with ID
 */
export class EntityDto<TKey = string> {
  id?: TKey;

  constructor(initialValues?: Partial<EntityDto<TKey>>) {
    if (initialValues) {
      Object.assign(this, initialValues);
    }
  }
}

/**
 * Entity DTO with creation audit info
 */
export class CreationAuditedEntityDto<TPrimaryKey = string> extends EntityDto<TPrimaryKey> {
  creationTime?: string | Date;
  creatorId?: string;

  constructor(initialValues?: Partial<CreationAuditedEntityDto<TPrimaryKey>>) {
    super(initialValues);
    if (initialValues) {
      this.creationTime = initialValues.creationTime;
      this.creatorId = initialValues.creatorId;
    }
  }
}

/**
 * Entity DTO with creation audit info and user reference
 */
export class CreationAuditedEntityWithUserDto<
  TUserDto,
  TPrimaryKey = string
> extends CreationAuditedEntityDto<TPrimaryKey> {
  creator?: TUserDto;

  constructor(initialValues?: Partial<CreationAuditedEntityWithUserDto<TUserDto, TPrimaryKey>>) {
    super(initialValues);
    if (initialValues) {
      this.creator = initialValues.creator;
    }
  }
}

/**
 * Entity DTO with creation and modification audit info
 */
export class AuditedEntityDto<TPrimaryKey = string> extends CreationAuditedEntityDto<TPrimaryKey> {
  lastModificationTime?: string | Date;
  lastModifierId?: string;

  constructor(initialValues?: Partial<AuditedEntityDto<TPrimaryKey>>) {
    super(initialValues);
    if (initialValues) {
      this.lastModificationTime = initialValues.lastModificationTime;
      this.lastModifierId = initialValues.lastModifierId;
    }
  }
}

/**
 * Entity DTO with full audit info and user references
 */
export class AuditedEntityWithUserDto<
  TUserDto,
  TPrimaryKey = string
> extends AuditedEntityDto<TPrimaryKey> {
  creator?: TUserDto;
  lastModifier?: TUserDto;

  constructor(initialValues?: Partial<AuditedEntityWithUserDto<TUserDto, TPrimaryKey>>) {
    super(initialValues);
    if (initialValues) {
      this.creator = initialValues.creator;
      this.lastModifier = initialValues.lastModifier;
    }
  }
}

/**
 * Entity DTO with full audit info including soft delete
 */
export class FullAuditedEntityDto<TPrimaryKey = string> extends AuditedEntityDto<TPrimaryKey> {
  isDeleted?: boolean;
  deleterId?: string;
  deletionTime?: Date | string;

  constructor(initialValues?: Partial<FullAuditedEntityDto<TPrimaryKey>>) {
    super(initialValues);
    if (initialValues) {
      this.isDeleted = initialValues.isDeleted;
      this.deleterId = initialValues.deleterId;
      this.deletionTime = initialValues.deletionTime;
    }
  }
}

/**
 * Entity DTO with full audit info and user references including deleter
 */
export class FullAuditedEntityWithUserDto<
  TUserDto,
  TPrimaryKey = string
> extends FullAuditedEntityDto<TPrimaryKey> {
  creator?: TUserDto;
  lastModifier?: TUserDto;
  deleter?: TUserDto;

  constructor(initialValues?: Partial<FullAuditedEntityWithUserDto<TUserDto, TPrimaryKey>>) {
    super(initialValues);
    if (initialValues) {
      this.creator = initialValues.creator;
      this.lastModifier = initialValues.lastModifier;
      this.deleter = initialValues.deleter;
    }
  }
}

// ============================================================================
// Extensible Entity DTOs (added in v2.9.0)
// ============================================================================

/**
 * Base class for extensible objects with extra properties
 * @since 2.9.0
 */
export class ExtensibleObject {
  extraProperties: ABP.Dictionary<any> = {};

  constructor(initialValues?: Partial<ExtensibleObject>) {
    if (initialValues) {
      Object.assign(this, initialValues);
    }
  }
}

/**
 * Extensible entity DTO with ID and extra properties
 * @since 2.9.0
 */
export class ExtensibleEntityDto<TKey = string> extends ExtensibleObject {
  id!: TKey;

  constructor(initialValues?: Partial<ExtensibleEntityDto<TKey>>) {
    super(initialValues);
    if (initialValues) {
      this.id = initialValues.id as TKey;
    }
  }
}

/**
 * Extensible entity DTO with creation audit info
 * @since 2.9.0
 */
export class ExtensibleCreationAuditedEntityDto<
  TPrimaryKey = string
> extends ExtensibleEntityDto<TPrimaryKey> {
  creationTime!: Date | string;
  creatorId?: string;

  constructor(initialValues?: Partial<ExtensibleCreationAuditedEntityDto<TPrimaryKey>>) {
    super(initialValues);
    if (initialValues) {
      this.creationTime = initialValues.creationTime as Date | string;
      this.creatorId = initialValues.creatorId;
    }
  }
}

/**
 * Extensible entity DTO with creation and modification audit info
 * @since 2.9.0
 */
export class ExtensibleAuditedEntityDto<
  TPrimaryKey = string
> extends ExtensibleCreationAuditedEntityDto<TPrimaryKey> {
  lastModificationTime?: Date | string;
  lastModifierId?: string;

  constructor(initialValues?: Partial<ExtensibleAuditedEntityDto<TPrimaryKey>>) {
    super(initialValues);
    if (initialValues) {
      this.lastModificationTime = initialValues.lastModificationTime;
      this.lastModifierId = initialValues.lastModifierId;
    }
  }
}

/**
 * Extensible audited entity DTO with user references
 * @since 2.9.0
 */
export class ExtensibleAuditedEntityWithUserDto<
  TPrimaryKey = string,
  TUserDto = any
> extends ExtensibleAuditedEntityDto<TPrimaryKey> {
  creator!: TUserDto;
  lastModifier!: TUserDto;

  constructor(initialValues?: Partial<ExtensibleAuditedEntityWithUserDto<TPrimaryKey, TUserDto>>) {
    super(initialValues);
    if (initialValues) {
      this.creator = initialValues.creator as TUserDto;
      this.lastModifier = initialValues.lastModifier as TUserDto;
    }
  }
}

/**
 * Extensible creation audited entity DTO with user reference
 * @since 2.9.0
 */
export class ExtensibleCreationAuditedEntityWithUserDto<
  TPrimaryKey = string,
  TUserDto = any
> extends ExtensibleCreationAuditedEntityDto<TPrimaryKey> {
  creator!: TUserDto;

  constructor(
    initialValues?: Partial<ExtensibleCreationAuditedEntityWithUserDto<TPrimaryKey, TUserDto>>
  ) {
    super(initialValues);
    if (initialValues) {
      this.creator = initialValues.creator as TUserDto;
    }
  }
}

/**
 * Extensible entity DTO with full audit info including soft delete
 * @since 2.9.0
 */
export class ExtensibleFullAuditedEntityDto<
  TPrimaryKey = string
> extends ExtensibleAuditedEntityDto<TPrimaryKey> {
  isDeleted!: boolean;
  deleterId?: string;
  deletionTime!: Date | string;

  constructor(initialValues?: Partial<ExtensibleFullAuditedEntityDto<TPrimaryKey>>) {
    super(initialValues);
    if (initialValues) {
      this.isDeleted = initialValues.isDeleted as boolean;
      this.deleterId = initialValues.deleterId;
      this.deletionTime = initialValues.deletionTime as Date | string;
    }
  }
}

/**
 * Extensible full audited entity DTO with user references including deleter
 * @since 2.9.0
 */
export class ExtensibleFullAuditedEntityWithUserDto<
  TPrimaryKey = string,
  TUserDto = any
> extends ExtensibleFullAuditedEntityDto<TPrimaryKey> {
  creator!: TUserDto;
  lastModifier!: TUserDto;
  deleter!: TUserDto;

  constructor(
    initialValues?: Partial<ExtensibleFullAuditedEntityWithUserDto<TPrimaryKey, TUserDto>>
  ) {
    super(initialValues);
    if (initialValues) {
      this.creator = initialValues.creator as TUserDto;
      this.lastModifier = initialValues.lastModifier as TUserDto;
      this.deleter = initialValues.deleter as TUserDto;
    }
  }
}
