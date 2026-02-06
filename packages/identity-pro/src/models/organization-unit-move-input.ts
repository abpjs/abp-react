/**
 * Organization Unit Move Input
 * Translated from @volo/abp.ng.identity v2.9.0
 * @since 2.9.0
 */

/**
 * Input for moving an organization unit to a new parent.
 * Used when reorganizing the hierarchy tree.
 */
export interface OrganizationUnitMoveInput {
  /** New parent organization unit ID (null to move to root level) */
  newParentId?: string;
}

/**
 * Factory function to create an OrganizationUnitMoveInput with defaults.
 * @param initialValues - Partial values to initialize the input
 * @returns A new OrganizationUnitMoveInput instance
 */
export function createOrganizationUnitMoveInput(
  initialValues?: Partial<OrganizationUnitMoveInput>
): OrganizationUnitMoveInput {
  return {
    newParentId: undefined,
    ...initialValues,
  };
}
