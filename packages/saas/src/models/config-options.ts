/**
 * SaaS Config Options
 * Translated from @volo/abp.ng.saas v3.0.0
 *
 * Configuration options for SaaS module extensibility.
 *
 * @since 3.0.0
 */

import { eSaasComponents } from '../enums/components';
import type { Saas } from './saas';
import type {
  EntityActionContributorCallback,
  ToolbarActionContributorCallback,
  EntityPropContributorCallback,
  CreateFormPropContributorCallback,
  EditFormPropContributorCallback,
} from '../tokens/extensions.token';

/**
 * SaaS entity action contributors type
 * Maps component keys to their entity action contributor callbacks
 * @since 3.0.0
 */
export type SaasEntityActionContributors = Partial<{
  [eSaasComponents.Editions]: EntityActionContributorCallback<Saas.Edition>[];
  [eSaasComponents.Tenants]: EntityActionContributorCallback<Saas.Tenant>[];
}>;

/**
 * SaaS toolbar action contributors type
 * Maps component keys to their toolbar action contributor callbacks
 * @since 3.0.0
 */
export type SaasToolbarActionContributors = Partial<{
  [eSaasComponents.Editions]: ToolbarActionContributorCallback<Saas.Edition[]>[];
  [eSaasComponents.Tenants]: ToolbarActionContributorCallback<Saas.Tenant[]>[];
}>;

/**
 * SaaS entity prop contributors type
 * Maps component keys to their entity prop contributor callbacks
 * @since 3.0.0
 */
export type SaasEntityPropContributors = Partial<{
  [eSaasComponents.Editions]: EntityPropContributorCallback<Saas.Edition>[];
  [eSaasComponents.Tenants]: EntityPropContributorCallback<Saas.Tenant>[];
}>;

/**
 * SaaS create form prop contributors type
 * Maps component keys to their create form prop contributor callbacks
 * @since 3.0.0
 */
export type SaasCreateFormPropContributors = Partial<{
  [eSaasComponents.Editions]: CreateFormPropContributorCallback<Saas.Edition>[];
  [eSaasComponents.Tenants]: CreateFormPropContributorCallback<Saas.Tenant>[];
}>;

/**
 * SaaS edit form prop contributors type
 * Maps component keys to their edit form prop contributor callbacks
 * @since 3.0.0
 */
export type SaasEditFormPropContributors = Partial<{
  [eSaasComponents.Editions]: EditFormPropContributorCallback<Saas.Edition>[];
  [eSaasComponents.Tenants]: EditFormPropContributorCallback<Saas.Tenant>[];
}>;

/**
 * SaaS module configuration options
 * Used to customize the SaaS module behavior through contributors
 * @since 3.0.0
 *
 * @example
 * ```tsx
 * const options: SaasConfigOptions = {
 *   entityActionContributors: {
 *     [eSaasComponents.Tenants]: [
 *       (actions) => [...actions, { text: 'Custom Action', icon: 'fa fa-star' }]
 *     ]
 *   },
 *   entityPropContributors: {
 *     [eSaasComponents.Tenants]: [
 *       (props) => [...props, { name: 'customField', displayName: 'Custom' }]
 *     ]
 *   }
 * };
 * ```
 */
export interface SaasConfigOptions {
  /**
   * Entity action contributors for customizing row actions
   */
  entityActionContributors?: SaasEntityActionContributors;

  /**
   * Toolbar action contributors for customizing toolbar buttons
   */
  toolbarActionContributors?: SaasToolbarActionContributors;

  /**
   * Entity prop contributors for customizing table columns
   */
  entityPropContributors?: SaasEntityPropContributors;

  /**
   * Create form prop contributors for customizing create form fields
   */
  createFormPropContributors?: SaasCreateFormPropContributors;

  /**
   * Edit form prop contributors for customizing edit form fields
   */
  editFormPropContributors?: SaasEditFormPropContributors;
}
