/**
 * Organization Unit Create DTO
 * Translated from @volo/abp.ng.identity v2.9.0
 * @since 2.9.0
 */

import { OrganizationUnitCreateOrUpdateDtoBase } from './organization-unit-create-or-update-dto-base';

/**
 * DTO for creating a new organization unit.
 * Extends the base DTO with parent ID for hierarchy placement.
 */
export interface OrganizationUnitCreateDto extends OrganizationUnitCreateOrUpdateDtoBase {
  /** Parent organization unit ID (optional, null for root units) */
  parentId?: string;
  /** Extra properties for extensibility */
  extraProperties?: unknown[];
}

/**
 * Factory function to create an OrganizationUnitCreateDto with defaults.
 * @param initialValues - Partial values to initialize the DTO
 * @returns A new OrganizationUnitCreateDto instance
 */
export function createOrganizationUnitCreateDto(
  initialValues?: Partial<OrganizationUnitCreateDto>
): OrganizationUnitCreateDto {
  return {
    displayName: '',
    parentId: undefined,
    extraProperties: [],
    ...initialValues,
  };
}
