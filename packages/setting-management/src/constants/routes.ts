/**
 * Setting Management Routes
 * Translated from @abp/ng.setting-management v0.9.0
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
