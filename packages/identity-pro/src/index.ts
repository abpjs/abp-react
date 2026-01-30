/**
 * @abpjs/identity-pro
 *
 * ABP Framework identity pro components for React.
 * Translated from @volo/abp.ng.identity version 0.7.2.
 *
 * This package provides:
 * - Identity models (User, Role, ClaimType, etc.)
 * - Identity service for API operations
 * - React hooks for state management (useRoles, useUsers, useIdentity, useClaims)
 * - UI components for role, user, and claim type management
 * - Route constants for navigation
 *
 * Pro features in v0.7.2:
 * - Claim type management (ClaimsComponent)
 * - User/Role claims management (ClaimModal)
 * - ClaimType, ClaimTypeName, ClaimRequest models
 * - useClaims hook for claim operations
 *
 * @example
 * ```tsx
 * import { RolesComponent, UsersComponent, ClaimsComponent, useClaims, Identity } from '@abpjs/identity-pro';
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
 * @since 0.7.2
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
