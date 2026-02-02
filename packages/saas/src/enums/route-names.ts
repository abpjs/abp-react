/**
 * SaaS Route Names
 * Translated from @volo/abp.ng.saas v2.7.0
 */

/**
 * Enum-like const object for SaaS route names.
 * Used for localization and navigation configuration.
 * @since 2.7.0
 */
export const eSaasRouteNames = {
  Administration: 'AbpUiNavigation::Menu:Administration',
  Saas: 'Saas::Menu:Saas',
  Tenants: 'Saas::Tenants',
  Editions: 'Saas::Editions',
} as const;

/**
 * Type for SaaS route name values
 */
export type SaasRouteNameKey =
  (typeof eSaasRouteNames)[keyof typeof eSaasRouteNames];
