/**
 * @abpjs/identity-pro
 *
 * ABP Framework identity pro components for React.
 * Translated from @volo/abp.ng.identity version 2.4.0.
 *
 * This package provides:
 * - Identity models (User, Role, ClaimType, etc.)
 * - Identity service for API operations
 * - Identity state service with dispatch methods (v2.0.0)
 * - React hooks for state management (useRoles, useUsers, useIdentity, useClaims)
 * - UI components for role, user, and claim type management
 * - Route constants for navigation
 * - Component identifiers enum (v2.4.0)
 *
 * Pro features:
 * - Claim type management (ClaimsComponent)
 * - User/Role claims management (ClaimModal)
 * - ClaimType, ClaimTypeName, ClaimRequest models
 * - useClaims hook for claim operations
 * - IdentityStateService with 17 dispatch methods (v2.0.0)
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
 * @updated 2.4.0
 */

// Models
export * from './models';

// Enums
export * from './enums';

// Services
export * from './services';

// Hooks
export * from './hooks';

// Components
export * from './components';

// Constants
export * from './constants';
