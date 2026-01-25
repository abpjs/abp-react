import { ABP, eLayoutType } from '@abpjs/core';

/**
 * Identity module routes configuration (v0.9.0 format).
 * Translated from @abp/ng.identity IDENTITY_ROUTES.
 *
 * These routes define the navigation structure for the identity module
 * within the ABP Framework application.
 *
 * In v0.9.0, the format changed from `ABP.FullRoute[]` to `{ routes: ABP.FullRoute[] }`
 */
export const IDENTITY_ROUTES: { routes: ABP.FullRoute[] } = {
  routes: [
    {
      name: 'AbpUiNavigation::Menu:Administration',
      path: '',
      order: 1,
      wrapper: true,
    },
    {
      name: 'AbpIdentity::Menu:IdentityManagement',
      path: 'identity',
      order: 1,
      parentName: 'AbpUiNavigation::Menu:Administration',
      layout: eLayoutType.application,
      children: [
        {
          path: 'roles',
          name: 'AbpIdentity::Roles',
          order: 2,
          requiredPolicy: 'AbpIdentity.Roles',
        },
        {
          path: 'users',
          name: 'AbpIdentity::Users',
          order: 1,
          requiredPolicy: 'AbpIdentity.Users',
        },
      ],
    },
  ],
};

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
