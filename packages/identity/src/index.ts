/**
 * @abpjs/identity
 *
 * ABP Framework identity components for React.
 * Translated from @abp/ng.identity version 3.0.0.
 *
 * This package provides:
 * - Identity models (User, Role, etc.)
 * - Identity service for API operations
 * - IdentityStateService for stateful operations (v2.0.0)
 * - React hooks for state management (useRoles, useUsers, useIdentity)
 * - UI components for role and user management
 * - Route path constants for navigation
 * - Component and route name enums for customization (v2.7.0)
 * - Config subpackage with route providers and policy names (v3.0.0)
 *
 * Changes in v3.0.0:
 * - Added config subpackage with eIdentityPolicyNames, IDENTITY_ROUTE_PROVIDERS
 * - Moved eIdentityRouteNames to config/enums (removed Administration key)
 * - Added getUserAssignableRoles() method to IdentityService
 * - Angular: RolesComponent and UsersComponent now use ListService pattern
 *   (React components already use hooks-based state management)
 *
 * Changes in v2.9.0:
 * - Version bump only (dependency updates to @abp/ng.theme.shared v2.9.0)
 *
 * Changes in v2.7.0:
 * - Added eIdentityComponents enum for component replacement keys
 * - Added eIdentityRouteNames enum for route name constants
 * - Added componentKey static property to RolesComponent and UsersComponent
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
 * import {
 *   RolesComponent,
 *   UsersComponent,
 *   useIdentity,
 *   Identity,
 *   eIdentityComponents,
 *   // v3.0.0 config exports
 *   eIdentityPolicyNames,
 *   IDENTITY_ROUTE_PROVIDERS,
 *   initializeIdentityRoutes,
 * } from '@abpjs/identity';
 *
 * // Initialize routes (v3.0.0)
 * initializeIdentityRoutes();
 *
 * function IdentityPage() {
 *   const { roles, users } = useIdentity();
 *
 *   // v2.7.0: Access component keys for replacement
 *   console.log(RolesComponent.componentKey); // 'Identity.RolesComponent'
 *   console.log(UsersComponent.componentKey); // 'Identity.UsersComponent'
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

// Config (v3.0.0)
export * from './config';

// Enums (v2.7.0, updated in v3.0.0)
export * from './enums';

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
