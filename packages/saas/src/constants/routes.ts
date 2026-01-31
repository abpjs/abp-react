/**
 * SaaS Routes
 * Translated from @volo/abp.ng.saas v0.7.2
 */

import type { ABP, eLayoutType } from '@abpjs/core';

/**
 * Default routes for SaaS module
 */
export const SAAS_ROUTES: { routes: ABP.FullRoute[] } = {
  routes: [
    {
      name: 'Saas',
      path: 'saas',
      layout: 'application' as eLayoutType,
      order: 50,
      children: [
        {
          name: 'Tenants',
          path: 'tenants',
          order: 1,
          requiredPolicy: 'Saas.Tenants',
        },
        {
          name: 'Editions',
          path: 'editions',
          order: 2,
          requiredPolicy: 'Saas.Editions',
        },
      ],
    },
  ],
};
