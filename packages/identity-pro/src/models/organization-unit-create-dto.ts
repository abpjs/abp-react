/**
 * Organization Unit Create DTO
 * Translated from @volo/abp.ng.identity v2.9.0
 * @since 2.9.0
 * @updated 3.2.0 - Re-exports from proxy/identity/models
 */

// Re-export from proxy for new typed interface
export type { OrganizationUnitCreateDto } from '../proxy/identity/models';

import { LegacyOrganizationUnitCreateOrUpdateDtoBase } from './organization-unit-create-or-update-dto-base';

/**
 * Legacy DTO for creating a new organization unit.
 * @deprecated Use OrganizationUnitCreateDto from proxy/identity/models instead
 */
export interface LegacyOrganizationUnitCreateDto extends LegacyOrganizationUnitCreateOrUpdateDtoBase {
  /** Parent organization unit ID (optional, null for root units) */
  parentId?: string;
  /** Extra properties for extensibility */
  extraProperties?: unknown[];
}

/**
 * Factory function to create an OrganizationUnitCreateDto with defaults.
 * @param initialValues - Partial values to initialize the DTO
 * @returns A new OrganizationUnitCreateDto instance
 * @deprecated Use the proxy types directly
 */
export function createOrganizationUnitCreateDto(
  initialValues?: Partial<LegacyOrganizationUnitCreateDto>
): LegacyOrganizationUnitCreateDto {
  return {
    displayName: '',
    parentId: undefined,
    extraProperties: [],
    ...initialValues,
  };
}
