/**
 * SaaS Route Names
 * Translated from @volo/abp.ng.saas/config v3.0.0
 *
 * Route name localization keys for SaaS module navigation.
 * @since 3.0.0 (moved from lib/enums to config/enums)
 *
 * Breaking changes in v3.0.0:
 * - Removed 'Administration' key
 */

/**
 * Enum-like const object for SaaS route names.
 * Used for localization and navigation configuration.
 *
 * @since 2.7.0
 * @updated 3.0.0 - Removed Administration key, moved to config subpackage
 */
export const eSaasRouteNames = {
  /** SaaS menu route name */
  Saas: 'Saas::Menu:Saas',
  /** Tenants route name */
  Tenants: 'Saas::Tenants',
  /** Editions route name */
  Editions: 'Saas::Editions',
} as const;

/**
 * Type for SaaS route name values
 * @since 2.7.0
 */
export type SaasRouteNameKey =
  (typeof eSaasRouteNames)[keyof typeof eSaasRouteNames];
