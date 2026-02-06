/**
 * Organization Unit Update DTO
 * Translated from @volo/abp.ng.identity v2.9.0
 * @since 2.9.0
 */

import { OrganizationUnitCreateOrUpdateDtoBase } from './organization-unit-create-or-update-dto-base';

/**
 * DTO for updating an existing organization unit.
 * Extends the base DTO with optional extra properties.
 */
export interface OrganizationUnitUpdateDto extends OrganizationUnitCreateOrUpdateDtoBase {
  /** Extra properties for extensibility */
  extraProperties?: unknown[];
}

/**
 * Factory function to create an OrganizationUnitUpdateDto with defaults.
 * @param initialValues - Partial values to initialize the DTO
 * @returns A new OrganizationUnitUpdateDto instance
 */
export function createOrganizationUnitUpdateDto(
  initialValues?: Partial<OrganizationUnitUpdateDto>
): OrganizationUnitUpdateDto {
  return {
    displayName: '',
    extraProperties: undefined,
    ...initialValues,
  };
}
