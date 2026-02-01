/**
 * ABP Standard DTOs
 * Translated from @abp/ng.core v2.4.0
 *
 * These are standard DTO classes used throughout ABP applications
 * for consistent data transfer patterns.
 *
 * @since 2.4.0
 */

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
