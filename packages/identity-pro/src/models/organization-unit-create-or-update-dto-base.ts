/**
 * Organization Unit Create/Update Base DTO
 * Translated from @volo/abp.ng.identity v2.9.0
 * @since 2.9.0
 * @updated 3.2.0 - Re-exports from proxy/identity/models
 */

// Re-export from proxy for new typed interface
export type { OrganizationUnitCreateOrUpdateDtoBase } from '../proxy/identity/models';

/**
 * Legacy base interface for creating or updating organization units.
 * @deprecated Use OrganizationUnitCreateOrUpdateDtoBase from proxy/identity/models instead
 */
export interface LegacyOrganizationUnitCreateOrUpdateDtoBase {
  /** Display name of the organization unit */
  displayName: string;
}

/**
 * Factory function to create an OrganizationUnitCreateOrUpdateDtoBase with defaults.
 * @param initialValues - Partial values to initialize the DTO
 * @returns A new OrganizationUnitCreateOrUpdateDtoBase instance
 * @deprecated Use the proxy types directly
 */
export function createOrganizationUnitCreateOrUpdateDtoBase(
  initialValues?: Partial<LegacyOrganizationUnitCreateOrUpdateDtoBase>
): LegacyOrganizationUnitCreateOrUpdateDtoBase {
  return {
    displayName: '',
    ...initialValues,
  };
}
