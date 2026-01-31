/**
 * Route paths for the identity module.
 * Use these constants for programmatic navigation.
 */
export const IDENTITY_ROUTE_PATHS = {
  /** Base path for identity module */
  BASE: '/identity',
  /** Roles management path */
  ROLES: '/identity/roles',
  /** Users management path */
  USERS: '/identity/users',
} as const;

/**
 * Required policies for identity module routes.
 */
export const IDENTITY_POLICIES = {
  /** Policy for roles management */
  ROLES: 'AbpIdentity.Roles',
  /** Policy for users management */
  USERS: 'AbpIdentity.Users',
  /** Policy for creating users */
  USERS_CREATE: 'AbpIdentity.Users.Create',
  /** Policy for updating users */
  USERS_UPDATE: 'AbpIdentity.Users.Update',
  /** Policy for deleting users */
  USERS_DELETE: 'AbpIdentity.Users.Delete',
  /** Policy for creating roles */
  ROLES_CREATE: 'AbpIdentity.Roles.Create',
  /** Policy for updating roles */
  ROLES_UPDATE: 'AbpIdentity.Roles.Update',
  /** Policy for deleting roles */
  ROLES_DELETE: 'AbpIdentity.Roles.Delete',
} as const;
