/**
 * Organization Unit User Input
 * Translated from @volo/abp.ng.identity v2.9.0
 * @since 2.9.0
 */

/**
 * Input for adding users (members) to an organization unit.
 * Used when assigning members to organization units.
 */
export interface OrganizationUnitUserInput {
  /** Array of user IDs to add to the organization unit */
  userIds: string[];
}

/**
 * Factory function to create an OrganizationUnitUserInput with defaults.
 * @param initialValues - Partial values to initialize the input
 * @returns A new OrganizationUnitUserInput instance
 */
export function createOrganizationUnitUserInput(
  initialValues?: Partial<OrganizationUnitUserInput>
): OrganizationUnitUserInput {
  return {
    userIds: [],
    ...initialValues,
  };
}
