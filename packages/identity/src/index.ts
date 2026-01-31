/**
 * @abpjs/identity
 *
 * ABP Framework identity components for React.
 * Translated from @abp/ng.identity version 1.1.0.
 *
 * This package provides:
 * - Identity models (User, Role, etc.)
 * - Identity service for API operations
 * - React hooks for state management (useRoles, useUsers, useIdentity)
 * - UI components for role and user management
 * - Route constants for navigation
 *
 * Changes in v1.1.0:
 * - Added passwordRulesArr and requiredPasswordLength props to UsersComponent
 * - Removed RoleResolver and UserResolver (Angular route resolvers not needed in React)
 * - State method return types updated for better typing
 *
 * Changes in v1.0.0:
 * - IDENTITY_ROUTES is now deprecated (use identity config services instead)
 * - IdentityProviders is deprecated
 * - Improved sorting support with sortKey in table components
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
 *       <RolesComponent />
 *       <UsersComponent passwordRulesArr={['number', 'capital', 'small', 'special']} requiredPasswordLength={6} />
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
