/**
 * @abpjs/identity-pro
 *
 * ABP Framework identity pro components for React.
 * Translated from @volo/abp.ng.identity version 3.1.0.
 *
 * This package provides:
 * - Identity models (User, Role, ClaimType, OrganizationUnit, etc.)
 * - Identity service for API operations
 * - Organization unit service for hierarchy management (v2.9.0)
 * - Identity state service with dispatch methods (v2.0.0)
 * - React hooks for state management (useRoles, useUsers, useIdentity, useClaims)
 * - UI components for role, user, and claim type management
 * - Route constants for navigation
 * - Component identifiers enum (v2.4.0)
 * - Route names enum for localization (v2.7.0)
 * - TreeAdapter utility for hierarchical data (v2.9.0)
 * - Config subpackage with enums, providers, and models (v3.0.0)
 * - Extension tokens for customizing entity actions, props, and forms (v3.0.0)
 * - Extensions guard for route protection (v3.0.0)
 * - Security logs service and models (v3.1.0)
 *
 * Pro features:
 * - Claim type management (ClaimsComponent)
 * - User/Role claims management (ClaimModal)
 * - Organization unit management (v2.9.0)
 * - ClaimType, ClaimTypeName, ClaimRequest models
 * - useClaims hook for claim operations
 * - IdentityStateService with 17 dispatch methods (v2.0.0)
 * - Admin password change for users (v2.7.0)
 * - Security logs management (v3.1.0)
 *
 * Changes in v3.1.0:
 * - Added IdentitySecurityLogService for querying security logs
 * - Added IdentitySecurityLogDto, IdentitySecurityLogGetListInput models
 * - Added SecurityLogs to eIdentityPolicyNames
 * - Added SecurityLogs to eIdentityRouteNames
 * - Added SecurityLogs to eIdentityComponents
 * - Added UserLockDurationType enum (Second, Minute, Hour, Day, Month, Year)
 * - Added getUserAvailableOrganizationUnits() method to IdentityService
 * - Added lockUser(id, lockoutDurationInSeconds) method to IdentityService
 * - Added DEFAULT_SECURITY_LOGS_ENTITY_ACTIONS to extension tokens
 * - Added DEFAULT_SECURITY_LOGS_TOOLBAR_ACTIONS to extension tokens
 * - Added DEFAULT_SECURITY_LOGS_ENTITY_PROPS to extension tokens
 * - Updated contributor types to include SecurityLogs
 *
 * Changes in v3.0.0:
 * - Added config subpackage with enums (policy-names, route-names, setting-tab-names)
 * - Added config providers (route.provider, setting-tab.provider)
 * - Added config models (IdentitySettings)
 * - Added tokens/extensions.token.ts with DEFAULT_IDENTITY_* constants
 * - Added guards/extensions.guard.ts for route protection
 * - Added getUserAssingableRoles() method to IdentityService
 * - Replaced getClaimTypeNames() with getRolesClaimTypes() and getUsersClaimTypes()
 * - Removed getClaimTypeNames() and dispatchGetClaimTypeNames() from IdentityStateService
 * - Removed Administration key from eIdentityRouteNames (now only in config)
 * - Dependency updates to @abp/ng.permission-management ~3.0.0
 * - Dependency updates to @abp/ng.theme.shared ~3.0.0
 * - Dependency updates to @volo/abp.commercial.ng.ui ~3.0.0
 *
 * Changes in v2.9.0:
 * - Added OrganizationUnitService for managing organization unit hierarchy
 * - Added OrganizationUnitWithDetailsDto, OrganizationUnitCreateDto, OrganizationUnitUpdateDto models
 * - Added OrganizationUnitMoveInput, OrganizationUnitRoleInput, OrganizationUnitUserInput models
 * - Added GetOrganizationUnitInput for querying organization units
 * - Added TreeAdapter utility for hierarchical data management
 * - Added organizationUnits to Identity.State
 * - Added organizationUnitIds to Identity.UserSaveRequest
 * - Added getUserOrganizationUnits method to IdentityService
 * - Added OrganizationUnits, OrganizationMembers, OrganizationRoles to eIdentityComponents
 * - Added OrganizationUnits to eIdentityRouteNames
 * - Dependency updates to @abp/ng.permission-management ~2.9.0
 * - Dependency updates to @abp/ng.theme.shared ~2.9.0
 * - Dependency updates to @volo/abp.commercial.ng.ui ~2.9.0
 * - Dependency updates to @volo/abp.ng.identity.config ~2.9.0
 *
 * Changes in v2.7.0:
 * - Added eIdentityRouteNames enum for route name localization keys
 * - Added changePassword(id, body) method to IdentityService for admin password changes
 * - Added ChangePasswordRequest interface to Identity namespace
 * - Changed eIdentityComponents from enum to const object for better tree-shaking
 * - Dependency updates to @abp/ng.permission-management ~2.7.0
 * - Dependency updates to @abp/ng.theme.shared ~2.7.0
 * - Dependency updates to @volo/abp.commercial.ng.ui ^2.7.0
 * - Dependency updates to @volo/abp.ng.identity.config ^2.7.0
 *
 * Changes in v2.4.0:
 * - Added apiName property to IdentityService (defaults to 'default')
 * - Added getAllRoles() method to IdentityService for fetching all roles without pagination
 * - Added eIdentityComponents enum for component identifiers (Claims, Roles, Users)
 * - Dependency updates to @abp/ng.permission-management ~2.4.0
 * - Dependency updates to @abp/ng.theme.shared ~2.4.0
 * - Dependency updates to @volo/abp.commercial.ng.ui ^2.4.0
 * - Dependency updates to @volo/abp.ng.identity.config ^2.4.0
 *
 * Changes in v2.2.0:
 * - Added unlockUser(id: string) method to IdentityService
 * - Added unlockUser(id: string) to useUsers hook for unlocking locked out users
 * - Added openPermissionsModal(providerKey: string) to useUsers and useRoles hooks
 * - Added permissions modal state management (visiblePermissions, permissionsProviderKey)
 * - Dependency updates to @abp/ng.permission-management v2.2.0
 * - Dependency updates to @abp/ng.theme.shared v2.2.0
 * - Dependency updates to @volo/abp.ng.identity.config v2.2.0
 *
 * Changes in v2.1.1:
 * - Dependency updates to @abp/ng.permission-management v2.1.0
 * - Dependency updates to @abp/ng.theme.shared v2.1.0
 * - Dependency updates to @volo/abp.ng.identity.config v2.1.1
 * - No functional code changes
 *
 * @example
 * ```tsx
 * import { RolesComponent, UsersComponent, ClaimsComponent, useClaims, Identity, eIdentityComponents } from '@abpjs/identity-pro';
 *
 * function IdentityProPage() {
 *   const { claimTypes, fetchClaimTypes } = useClaims();
 *
 *   return (
 *     <div>
 *       <RolesComponent />
 *       <UsersComponent />
 *       <ClaimsComponent />
 *     </div>
 *   );
 * }
 * ```
 *
 * @packageDocumentation
 * @since 2.0.0
 * @updated 3.1.0
 */

// Config (v3.0.0)
export * from './config';

// Models
export * from './models';

// Enums
export * from './enums';

// Guards (v3.0.0)
export * from './guards';

// Services
export * from './services';

// Hooks
export * from './hooks';

// Components
export * from './components';

// Constants
export * from './constants';

// Tokens (v3.0.0)
export * from './tokens';

// Utils
export * from './utils';
