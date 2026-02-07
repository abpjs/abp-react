/**
 * Organization Unit User Input
 * Translated from @volo/abp.ng.identity v2.9.0
 * @since 2.9.0
 * @updated 3.2.0 - Re-exports from proxy/identity/models
 */

// Re-export from proxy for new typed interface
export type { OrganizationUnitUserInput } from '../proxy/identity/models';

/**
 * Legacy input for adding users (members) to an organization unit.
 * @deprecated Use OrganizationUnitUserInput from proxy/identity/models instead
 */
export interface LegacyOrganizationUnitUserInput {
  /** Array of user IDs to add to the organization unit */
  userIds: string[];
}

/**
 * Factory function to create an OrganizationUnitUserInput with defaults.
 * @param initialValues - Partial values to initialize the input
 * @returns A new OrganizationUnitUserInput instance
 * @deprecated Use the proxy types directly
 */
export function createOrganizationUnitUserInput(
  initialValues?: Partial<LegacyOrganizationUnitUserInput>
): LegacyOrganizationUnitUserInput {
  return {
    userIds: [],
    ...initialValues,
  };
}
