/**
 * Language Management Routes
 * Translated from @volo/abp.ng.language-management v0.7.2
 */

import type { ABP, eLayoutType } from '@abpjs/core';

/**
 * Default routes for language management module
 */
export const LANGUAGE_MANAGEMENT_ROUTES: { routes: ABP.FullRoute[] } = {
  routes: [
    {
      name: 'Languages',
      path: 'language-management',
      layout: 'application' as eLayoutType,
      order: 101,
      children: [
        {
          name: 'Languages',
          path: 'languages',
          order: 1,
        },
        {
          name: 'Language Texts',
          path: 'texts',
          order: 2,
        },
      ],
    },
  ],
};
