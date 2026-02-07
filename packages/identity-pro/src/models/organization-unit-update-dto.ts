/**
 * Organization Unit Update DTO
 * Translated from @volo/abp.ng.identity v2.9.0
 * @since 2.9.0
 * @updated 3.2.0 - Re-exports from proxy/identity/models
 */

// Re-export from proxy for new typed interface
export type { OrganizationUnitUpdateDto } from '../proxy/identity/models';

import { LegacyOrganizationUnitCreateOrUpdateDtoBase } from './organization-unit-create-or-update-dto-base';

/**
 * Legacy DTO for updating an existing organization unit.
 * @deprecated Use OrganizationUnitUpdateDto from proxy/identity/models instead
 */
export interface LegacyOrganizationUnitUpdateDto extends LegacyOrganizationUnitCreateOrUpdateDtoBase {
  /** Extra properties for extensibility */
  extraProperties?: unknown[];
}

/**
 * Factory function to create an OrganizationUnitUpdateDto with defaults.
 * @param initialValues - Partial values to initialize the DTO
 * @returns A new OrganizationUnitUpdateDto instance
 * @deprecated Use the proxy types directly
 */
export function createOrganizationUnitUpdateDto(
  initialValues?: Partial<LegacyOrganizationUnitUpdateDto>
): LegacyOrganizationUnitUpdateDto {
  return {
    displayName: '',
    extraProperties: undefined,
    ...initialValues,
  };
}
