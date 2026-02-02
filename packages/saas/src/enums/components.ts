/**
 * SaaS Component Identifiers
 * Used for component registration and routing
 *
 * @since 2.4.0
 * @updated 2.7.0 - Changed from enum to const object
 */
export const eSaasComponents = {
  Editions: 'Saas.EditionsComponent',
  Tenants: 'Saas.TenantsComponent',
} as const;

/**
 * Type for SaaS component key values
 */
export type SaasComponentKey =
  (typeof eSaasComponents)[keyof typeof eSaasComponents];
