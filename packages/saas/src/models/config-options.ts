/**
 * SaaS Config Options
 * Translated from @volo/abp.ng.saas v4.0.0
 *
 * Configuration options for SaaS module extensibility.
 *
 * @since 3.0.0
 * @updated 4.0.0 - Now uses proxy DTOs (EditionDto, SaasTenantDto) instead of Saas.Edition/Saas.Tenant
 */

import { eSaasComponents } from '../enums/components';
import type { EditionDto, SaasTenantDto } from '../proxy/host/dtos/models';
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
 * @updated 4.0.0 - Now uses EditionDto/SaasTenantDto
 */
export type SaasEntityActionContributors = Partial<{
  [eSaasComponents.Editions]: EntityActionContributorCallback<EditionDto>[];
  [eSaasComponents.Tenants]: EntityActionContributorCallback<SaasTenantDto>[];
}>;

/**
 * SaaS toolbar action contributors type
 * Maps component keys to their toolbar action contributor callbacks
 * @since 3.0.0
 * @updated 4.0.0 - Now uses EditionDto/SaasTenantDto
 */
export type SaasToolbarActionContributors = Partial<{
  [eSaasComponents.Editions]: ToolbarActionContributorCallback<EditionDto[]>[];
  [eSaasComponents.Tenants]: ToolbarActionContributorCallback<SaasTenantDto[]>[];
}>;

/**
 * SaaS entity prop contributors type
 * Maps component keys to their entity prop contributor callbacks
 * @since 3.0.0
 * @updated 4.0.0 - Now uses EditionDto/SaasTenantDto
 */
export type SaasEntityPropContributors = Partial<{
  [eSaasComponents.Editions]: EntityPropContributorCallback<EditionDto>[];
  [eSaasComponents.Tenants]: EntityPropContributorCallback<SaasTenantDto>[];
}>;

/**
 * SaaS create form prop contributors type
 * Maps component keys to their create form prop contributor callbacks
 * @since 3.0.0
 * @updated 4.0.0 - Now uses EditionDto/SaasTenantDto
 */
export type SaasCreateFormPropContributors = Partial<{
  [eSaasComponents.Editions]: CreateFormPropContributorCallback<EditionDto>[];
  [eSaasComponents.Tenants]: CreateFormPropContributorCallback<SaasTenantDto>[];
}>;

/**
 * SaaS edit form prop contributors type
 * Maps component keys to their edit form prop contributor callbacks
 * @since 3.0.0
 * @updated 4.0.0 - Now uses EditionDto/SaasTenantDto
 */
export type SaasEditFormPropContributors = Partial<{
  [eSaasComponents.Editions]: EditFormPropContributorCallback<EditionDto>[];
  [eSaasComponents.Tenants]: EditFormPropContributorCallback<SaasTenantDto>[];
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
