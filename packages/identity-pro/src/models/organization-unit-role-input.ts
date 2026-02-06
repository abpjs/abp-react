/**
 * Organization Unit Role Input
 * Translated from @volo/abp.ng.identity v2.9.0
 * @since 2.9.0
 */

/**
 * Input for adding roles to an organization unit.
 * Used when assigning roles to organization units.
 */
export interface OrganizationUnitRoleInput {
  /** Array of role IDs to add to the organization unit */
  roleIds: string[];
}

/**
 * Factory function to create an OrganizationUnitRoleInput with defaults.
 * @param initialValues - Partial values to initialize the input
 * @returns A new OrganizationUnitRoleInput instance
 */
export function createOrganizationUnitRoleInput(
  initialValues?: Partial<OrganizationUnitRoleInput>
): OrganizationUnitRoleInput {
  return {
    roleIds: [],
    ...initialValues,
  };
}
