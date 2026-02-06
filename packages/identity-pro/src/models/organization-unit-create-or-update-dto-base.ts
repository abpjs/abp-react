/**
 * Organization Unit Create/Update Base DTO
 * Translated from @volo/abp.ng.identity v2.9.0
 * @since 2.9.0
 */

/**
 * Base interface for creating or updating organization units.
 * Contains common properties shared between create and update operations.
 */
export interface OrganizationUnitCreateOrUpdateDtoBase {
  /** Display name of the organization unit */
  displayName: string;
}

/**
 * Factory function to create an OrganizationUnitCreateOrUpdateDtoBase with defaults.
 * @param initialValues - Partial values to initialize the DTO
 * @returns A new OrganizationUnitCreateOrUpdateDtoBase instance
 */
export function createOrganizationUnitCreateOrUpdateDtoBase(
  initialValues?: Partial<OrganizationUnitCreateOrUpdateDtoBase>
): OrganizationUnitCreateOrUpdateDtoBase {
  return {
    displayName: '',
    ...initialValues,
  };
}
