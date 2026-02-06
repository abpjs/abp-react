/**
 * Text Template Management Routes
 * Translated from @volo/abp.ng.text-template-management v2.7.0
 */

import type { ABP, eLayoutType } from '@abpjs/core';

/**
 * Default routes for text template management module
 */
export const TEXT_TEMPLATE_MANAGEMENT_ROUTES: { routes: ABP.FullRoute[] } = {
  routes: [
    {
      name: 'TextTemplateManagement::Menu:TextTemplates',
      path: 'text-template-management',
      layout: 'application' as eLayoutType,
      order: 100,
      parentName: 'AbpUiNavigation::Menu:Administration',
    },
  ],
};
