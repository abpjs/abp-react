/**
 * Organization Unit With Details DTO
 * Translated from @volo/abp.ng.identity v2.9.0
 * @since 2.9.0
 */

/**
 * Represents an organization unit with full details.
 * Used for displaying and managing organization units in the hierarchy.
 */
export interface OrganizationUnitWithDetailsDto {
  /** Parent organization unit ID (null for root units) */
  parentId?: string;
  /** Hierarchical code of the organization unit (e.g., "00001.00002") */
  code: string;
  /** Display name of the organization unit */
  displayName: string;
  /** Roles assigned to this organization unit */
  roles: unknown[];
  /** Whether this unit has been soft-deleted */
  isDeleted: boolean;
  /** ID of the user who deleted this unit */
  deleterId?: string;
  /** Date and time when the unit was deleted */
  deletionTime?: string;
  /** Date and time of last modification */
  lastModificationTime?: string;
  /** ID of the user who last modified this unit */
  lastModifierId?: string;
  /** Date and time when the unit was created */
  creationTime: string;
  /** ID of the user who created this unit */
  creatorId?: string;
  /** Unique identifier of the organization unit */
  id: string;
  /** Extra properties for extensibility */
  extraProperties: unknown[];
}

/**
 * Factory function to create an OrganizationUnitWithDetailsDto with defaults.
 * @param initialValues - Partial values to initialize the DTO
 * @returns A new OrganizationUnitWithDetailsDto instance
 */
export function createOrganizationUnitWithDetailsDto(
  initialValues?: Partial<OrganizationUnitWithDetailsDto>
): OrganizationUnitWithDetailsDto {
  return {
    parentId: undefined,
    code: '',
    displayName: '',
    roles: [],
    isDeleted: false,
    deleterId: undefined,
    deletionTime: undefined,
    lastModificationTime: undefined,
    lastModifierId: undefined,
    creationTime: new Date().toISOString(),
    creatorId: undefined,
    id: '',
    extraProperties: [],
    ...initialValues,
  };
}
