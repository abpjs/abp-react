/**
 * @abpjs/tenant-management
 * ABP Framework Tenant Management module for React
 * Translated from @abp/ng.tenant-management v4.0.0
 *
 * Changes in v4.0.0:
 * - BREAKING: Removed TenantManagementService (use TenantService from proxy instead)
 * - BREAKING: Removed deprecated types: TenantManagement.Response, Item, AddRequest, UpdateRequest, DefaultConnectionStringRequest
 * - BREAKING: useTenantManagement hook now uses TenantService (proxy) internally
 * - BREAKING: updateTenant signature changed from (data: {id, name}) to (id: string, data: TenantUpdateDto)
 * - BREAKING: createTenant now takes TenantCreateDto instead of TenantManagement.AddRequest
 * - BREAKING: fetchTenants now takes Partial<GetTenantsInput> instead of ABP.PageQueryParams
 * - Updated TenantManagementStateService to use TenantService instead of TenantManagementService
 * - Updated TenantManagementStateService dispatch methods to use proxy DTOs
 * - Updated TenantsComponentInputs to use TenantDto instead of legacy Item type
 *
 * Changes in v3.2.0:
 * - Added proxy submodule with typed DTOs and TenantService
 * - Added GetTenantsInput interface for tenant list queries
 * - Added TenantCreateDto interface for creating tenants
 * - Added TenantUpdateDto interface for updating tenants
 * - Added TenantDto interface for tenant responses
 * - Added TenantCreateOrUpdateDtoBase base interface
 * - Added TenantService with typed CRUD operations (create, delete, get, getList, update)
 * - Added TenantService.deleteDefaultConnectionString method
 * - Added TenantService.getDefaultConnectionString method
 * - Added TenantService.updateDefaultConnectionString method
 * - Updated TenantManagement.State to use PagedResultDto<TenantDto> and TenantDto
 * - Deprecated TenantManagement.Response (use PagedResultDto<TenantDto> instead)
 * - Deprecated TenantManagement.Item (use TenantDto instead)
 * - Deprecated TenantManagement.AddRequest (use TenantCreateDto instead)
 * - Deprecated TenantManagement.UpdateRequest (use TenantUpdateDto instead)
 * - Deprecated TenantManagement.DefaultConnectionStringRequest (use TenantService methods instead)
 *
 * Changes in v3.1.0:
 * - Version bump only (dependency updates to @abp/ng.feature-management v3.1.0, @abp/ng.theme.shared v3.1.0)
 *
 * Changes in v3.0.0:
 * - Added config subpackage with route providers and policy names
 * - Added eTenantManagementPolicyNames enum for permission checks
 * - Added TENANT_MANAGEMENT_ROUTE_PROVIDERS for route configuration
 * - Added configureRoutes function for route setup
 * - Added initializeTenantManagementRoutes helper function
 * - Moved eTenantManagementRouteNames to config subpackage (re-exported for backward compatibility)
 * - Removed Administration from eTenantManagementRouteNames (use 'AbpUiNavigation::Menu:Administration' directly)
 *
 * Changes in v2.9.0:
 * - Version bump only (dependency updates to @abp/ng.theme.shared v2.9.0, @abp/ng.feature-management v2.9.0)
 *
 * Changes in v2.7.0:
 * - Added eTenantManagementComponents enum for component replacement keys
 * - Added eTenantManagementRouteNames enum for route name keys
 * - Added componentKey static property to TenantManagementModal
 *
 * Changes in v2.4.0:
 * - Added apiName property to TenantManagementService (defaults to 'default')
 * - Added adminEmailAddress and adminPassword fields to AddRequest interface
 * - UpdateRequest no longer extends AddRequest (now only has id and name)
 *
 * Changes in v2.2.0:
 * - Added openFeaturesModal(providerKey: string) to useTenantManagement hook
 * - Added visibleFeatures state to useTenantManagement hook
 * - Added featuresProviderKey state to useTenantManagement hook
 * - Added onVisibleFeaturesChange callback to useTenantManagement hook
 * - Dependency updates to @abp/ng.theme.shared v2.2.0, @abp/ng.feature-management v2.2.0
 *
 * Changes in v2.1.0:
 * - Version bump only (dependency updates to @abp/ng.theme.shared v2.1.0, @abp/ng.feature-management v2.1.0)
 *
 * Changes in v2.0.0:
 * - Removed TENANT_MANAGEMENT_ROUTES constant (deprecated in v0.9.0)
 * - Added dispatchGetTenants() to TenantManagementStateService
 * - Added dispatchGetTenantById() to TenantManagementStateService
 * - Added dispatchCreateTenant() to TenantManagementStateService
 * - Added dispatchUpdateTenant() to TenantManagementStateService
 * - Added dispatchDeleteTenant() to TenantManagementStateService
 * - Added onVisibleFeaturesChange prop to TenantManagementModal
 * - Added TenantsComponentInputs interface
 * - Added TenantsComponentOutputs interface
 * - Updated onSearch signature: (value: any) -> (value: string)
 * - Updated onPageChange signature: (data: any) -> (page: number)
 */

// Config (v3.0.0) - Route providers and policy names
export * from './config';

// Enums (v2.7.0)
export * from './enums';

// Models
export * from './models';

// Proxy (v3.2.0) - Typed DTOs and TenantService
export * from './proxy';

// Services
export * from './services';

// Hooks
export * from './hooks';

// Constants
export * from './constants';

// Components
export * from './components';
