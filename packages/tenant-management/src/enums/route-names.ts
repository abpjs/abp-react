/**
 * Route name keys for the Tenant Management module.
 * These keys are used for route localization and identification.
 *
 * Note: In v3.0.0, this is re-exported from the config subpackage.
 * The Administration key was removed - use 'AbpUiNavigation::Menu:Administration' directly.
 *
 * @since 2.7.0
 * @deprecated Import from config subpackage instead: `import { eTenantManagementRouteNames } from '@abpjs/tenant-management/config'`
 */
export {
  eTenantManagementRouteNames,
  type TenantManagementRouteNameKey,
} from '../config/enums/route-names';
