/**
 * Setting Management Routes
 * Translated from @abp/ng.setting-management v1.0.0
 *
 * Note: In Angular v1.0.0, route constants were removed from the package.
 * In React, we keep these route constants as they are useful for
 * programmatic navigation and route configuration.
 */

import type { ABP, eLayoutType } from '@abpjs/core';

/**
 * Default routes for setting management module
 */
export const SETTING_MANAGEMENT_ROUTES: { routes: ABP.FullRoute[] } = {
  routes: [
    {
      name: 'Settings',
      path: 'setting-management',
      layout: 'application' as eLayoutType,
      order: 100,
    },
  ],
};
