/**
 * Get Organization Unit Input
 * Translated from @volo/abp.ng.identity v2.9.0
 * @since 2.9.0
 */

import { PagedAndSortedResultRequestDto } from '@abpjs/core';

/**
 * Input parameters for querying organization units.
 * Extends PagedAndSortedResultRequestDto for pagination and sorting support.
 */
export interface GetOrganizationUnitInput extends PagedAndSortedResultRequestDto {
  /** Filter string for searching organization units */
  filter?: string;
}

/**
 * Factory function to create a GetOrganizationUnitInput with defaults.
 * @param initialValues - Partial values to initialize the input
 * @returns A new GetOrganizationUnitInput instance
 */
export function createGetOrganizationUnitInput(
  initialValues?: Partial<GetOrganizationUnitInput>
): GetOrganizationUnitInput {
  return {
    filter: '',
    sorting: '',
    skipCount: 0,
    maxResultCount: 10,
    ...initialValues,
  };
}
