/**
 * @abpjs/identity
 *
 * ABP Framework identity components for React.
 * Translated from @abp/ng.identity version 2.4.0.
 *
 * This package provides:
 * - Identity models (User, Role, etc.)
 * - Identity service for API operations
 * - IdentityStateService for stateful operations (v2.0.0)
 * - React hooks for state management (useRoles, useUsers, useIdentity)
 * - UI components for role and user management
 * - Route path constants for navigation
 *
 * Changes in v2.4.0:
 * - Added apiName property to IdentityService
 * - Added getAllRoles() method to IdentityService for fetching all roles without pagination
 * - Dependency updates to @abp/ng.theme.shared v2.4.0
 *
 * Changes in v2.2.0:
 * - Angular: Added explicit openPermissionsModal(providerKey) method declaration to type files
 * - React: Already supported via handleOpenPermissions in RolesComponent and UsersComponent
 * - Dependency updates to @abp/ng.theme.shared v2.2.0
 *
 * Changes in v2.1.0:
 * - Version bump only (dependency updates to @abp/ng.theme.shared v2.1.0)
 *
 * Changes in v2.0.0:
 * - Added IdentityStateService for stateful identity operations
 * - Added onVisiblePermissionChange callback to RolesComponent and UsersComponent
 * - Added component interface types (RolesComponentInputs, RolesComponentOutputs, etc.)
 * - Removed deprecated IDENTITY_ROUTES constant (use IDENTITY_ROUTE_PATHS instead)
 * - Improved type signatures for onPageChange and onSearch callbacks
 *
 * Changes in v1.1.0:
 * - Added passwordRulesArr and requiredPasswordLength props to UsersComponent
 * - Removed RoleResolver and UserResolver (Angular route resolvers not needed in React)
 * - State method return types updated for better typing
 *
 * @example
 * ```tsx
 * import { RolesComponent, UsersComponent, useIdentity, Identity } from '@abpjs/identity';
 *
 * function IdentityPage() {
 *   const { roles, users } = useIdentity();
 *
 *   return (
 *     <div>
 *       <RolesComponent
 *         onVisiblePermissionChange={(visible) => console.log('Permission modal:', visible)}
 *       />
 *       <UsersComponent
 *         passwordRulesArr={['number', 'capital', 'small', 'special']}
 *         requiredPasswordLength={6}
 *         onVisiblePermissionChange={(visible) => console.log('Permission modal:', visible)}
 *       />
 *     </div>
 *   );
 * }
 * ```
 *
 * @packageDocumentation
 */

// Models
export * from './models';

// Services
export * from './services';

// Hooks
export * from './hooks';

// Components
export * from './components';

// Constants
export * from './constants';
