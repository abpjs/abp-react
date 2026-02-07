/**
 * Organization Unit Move Input
 * Translated from @volo/abp.ng.identity v2.9.0
 * @since 2.9.0
 * @updated 3.2.0 - Re-exports from proxy/identity/models
 */

// Re-export from proxy for new typed interface
export type { OrganizationUnitMoveInput } from '../proxy/identity/models';

/**
 * Legacy input for moving an organization unit to a new parent.
 * @deprecated Use OrganizationUnitMoveInput from proxy/identity/models instead
 */
export interface LegacyOrganizationUnitMoveInput {
  /** New parent organization unit ID (null to move to root level) */
  newParentId?: string;
}

/**
 * Factory function to create an OrganizationUnitMoveInput with defaults.
 * @param initialValues - Partial values to initialize the input
 * @returns A new OrganizationUnitMoveInput instance
 * @deprecated Use the proxy types directly
 */
export function createOrganizationUnitMoveInput(
  initialValues?: Partial<LegacyOrganizationUnitMoveInput>
): LegacyOrganizationUnitMoveInput {
  return {
    newParentId: undefined,
    ...initialValues,
  };
}
