/**
 * Get Organization Unit Input
 * Translated from @volo/abp.ng.identity v2.9.0
 * @since 2.9.0
 * @updated 3.2.0 - Re-exports from proxy/identity/models
 */

// Re-export from proxy for new typed interface
export type { GetOrganizationUnitInput } from '../proxy/identity/models';

import { PagedAndSortedResultRequestDto } from '@abpjs/core';

/**
 * Legacy input parameters for querying organization units.
 * @deprecated Use GetOrganizationUnitInput from proxy/identity/models instead
 */
export interface LegacyGetOrganizationUnitInput extends PagedAndSortedResultRequestDto {
  /** Filter string for searching organization units */
  filter?: string;
}

/**
 * Factory function to create a GetOrganizationUnitInput with defaults.
 * @param initialValues - Partial values to initialize the input
 * @returns A new GetOrganizationUnitInput instance
 * @deprecated Use the proxy types directly
 */
export function createGetOrganizationUnitInput(
  initialValues?: Partial<LegacyGetOrganizationUnitInput>
): LegacyGetOrganizationUnitInput {
  return {
    filter: '',
    sorting: '',
    skipCount: 0,
    maxResultCount: 10,
    ...initialValues,
  };
}
