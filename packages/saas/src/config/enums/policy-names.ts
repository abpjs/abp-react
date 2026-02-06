/**
 * SaaS Policy Names
 * Translated from @volo/abp.ng.saas/config v3.0.0
 *
 * Policy name constants for SaaS module permission checking.
 * @since 3.0.0
 */

/**
 * Enum-like const object for SaaS policy names.
 * Used for permission checking in SaaS module.
 * @since 3.0.0
 */
export const eSaasPolicyNames = {
  /** Policy for SaaS module (Tenants OR Editions) */
  Saas: 'Saas.Tenants || Saas.Editions',
  /** Policy for Tenants management */
  Tenants: 'Saas.Tenants',
  /** Policy for Editions management */
  Editions: 'Saas.Editions',
} as const;

/**
 * Type for SaaS policy name values
 * @since 3.0.0
 */
export type SaasPolicyNameKey =
  (typeof eSaasPolicyNames)[keyof typeof eSaasPolicyNames];
