/**
 * Organization Unit Role Input
 * Translated from @volo/abp.ng.identity v2.9.0
 * @since 2.9.0
 * @updated 3.2.0 - Re-exports from proxy/identity/models
 */

// Re-export from proxy for new typed interface
export type { OrganizationUnitRoleInput } from '../proxy/identity/models';

/**
 * Legacy input for adding roles to an organization unit.
 * @deprecated Use OrganizationUnitRoleInput from proxy/identity/models instead
 */
export interface LegacyOrganizationUnitRoleInput {
  /** Array of role IDs to add to the organization unit */
  roleIds: string[];
}

/**
 * Factory function to create an OrganizationUnitRoleInput with defaults.
 * @param initialValues - Partial values to initialize the input
 * @returns A new OrganizationUnitRoleInput instance
 * @deprecated Use the proxy types directly
 */
export function createOrganizationUnitRoleInput(
  initialValues?: Partial<LegacyOrganizationUnitRoleInput>
): LegacyOrganizationUnitRoleInput {
  return {
    roleIds: [],
    ...initialValues,
  };
}
