/**
 * Component keys for the Identity module.
 * These keys are used for component replacement/customization.
 * @since 2.7.0
 */
export const eIdentityComponents = {
  /**
   * Key for the Roles component.
   * Use this to replace the default RolesComponent with a custom implementation.
   */
  Roles: 'Identity.RolesComponent',

  /**
   * Key for the Users component.
   * Use this to replace the default UsersComponent with a custom implementation.
   */
  Users: 'Identity.UsersComponent',
} as const;

/**
 * Type for identity component key values
 */
export type IdentityComponentKey =
  (typeof eIdentityComponents)[keyof typeof eIdentityComponents];
