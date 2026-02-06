/**
 * Identity Pro Component Identifiers
 * Translated from @volo/abp.ng.identity v2.9.0
 */

/**
 * Enum-like const object for identity component identifiers.
 * Used for component registration and identification.
 * @since 2.4.0
 * @updated 2.7.0 - Changed from enum to const object
 * @updated 2.9.0 - Added OrganizationUnits, OrganizationMembers, OrganizationRoles
 */
export const eIdentityComponents = {
  Claims: 'Identity.ClaimsComponent',
  Roles: 'Identity.RolesComponent',
  Users: 'Identity.UsersComponent',
  OrganizationUnits: 'Identity.OrganizationUnitsComponent',
  OrganizationMembers: 'Identity.OrganizationMembersComponent',
  OrganizationRoles: 'Identity.OrganizationRolesComponent',
} as const;

/**
 * Type for identity component key values
 */
export type IdentityComponentKey =
  (typeof eIdentityComponents)[keyof typeof eIdentityComponents];
