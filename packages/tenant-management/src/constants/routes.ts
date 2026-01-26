import { ABP, eLayoutType } from '@abpjs/core';

/**
 * Tenant Management module routes configuration (v0.9.0 format).
 * Translated from @abp/ng.tenant-management TENANT_MANAGEMENT_ROUTES.
 *
 * These routes define the navigation structure for the tenant management module
 * within the ABP Framework application.
 *
 * In v0.9.0, the format changed from `ABP.FullRoute[]` to `{ routes: ABP.FullRoute[] }`
 */
export const TENANT_MANAGEMENT_ROUTES: { routes: ABP.FullRoute[] } = {
  routes: [
    {
      name: 'AbpUiNavigation::Menu:Administration',
      path: '',
      order: 1,
      wrapper: true,
    },
    {
      name: 'AbpTenantManagement::Menu:TenantManagement',
      path: 'tenant-management',
      order: 2,
      parentName: 'AbpUiNavigation::Menu:Administration',
      layout: eLayoutType.application,
      requiredPolicy: 'AbpTenantManagement.Tenants',
      children: [
        {
          path: 'tenants',
          name: 'AbpTenantManagement::Tenants',
          order: 1,
          requiredPolicy: 'AbpTenantManagement.Tenants',
        },
      ],
    },
  ],
};

/**
 * Route paths for the tenant management module.
 * Use these constants for programmatic navigation.
 */
export const TENANT_MANAGEMENT_ROUTE_PATHS = {
  /** Base path for tenant management module */
  BASE: '/tenant-management',
  /** Tenants management path */
  TENANTS: '/tenant-management/tenants',
} as const;

/**
 * Required policies for tenant management module routes.
 */
export const TENANT_MANAGEMENT_POLICIES = {
  /** Policy for tenants management */
  TENANTS: 'AbpTenantManagement.Tenants',
  /** Policy for creating tenants */
  TENANTS_CREATE: 'AbpTenantManagement.Tenants.Create',
  /** Policy for updating tenants */
  TENANTS_UPDATE: 'AbpTenantManagement.Tenants.Update',
  /** Policy for deleting tenants */
  TENANTS_DELETE: 'AbpTenantManagement.Tenants.Delete',
  /** Policy for managing connection strings */
  TENANTS_MANAGE_CONNECTION_STRINGS: 'AbpTenantManagement.Tenants.ManageConnectionStrings',
  /** Policy for managing features */
  TENANTS_MANAGE_FEATURES: 'AbpTenantManagement.Tenants.ManageFeatures',
} as const;
