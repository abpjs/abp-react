/**
 * Text Template Management Config Options
 * Translated from @volo/abp.ng.text-template-management v3.0.0
 *
 * Configuration options and contributor types for the Text Template Management module.
 *
 * @since 3.0.0
 */

import type {
  EntityActionContributorCallback,
  EntityPropContributorCallback,
  ToolbarActionContributorCallback,
} from '../tokens/extensions.token';
import { eTextTemplateManagementComponents } from '../enums/components';
import type { TextTemplateManagement } from './text-template-management';

/**
 * Entity action contributors type for Text Template Management
 * @since 3.0.0
 */
export type TextTemplateManagementEntityActionContributors = Partial<{
  [eTextTemplateManagementComponents.TextTemplates]: EntityActionContributorCallback<TextTemplateManagement.TemplateDefinitionDto>[];
}>;

/**
 * Toolbar action contributors type for Text Template Management
 * Note: Typo fixed in v3.0.0 (was TextTemplateManagementTooolbarActionContributors)
 * @since 3.0.0
 */
export type TextTemplateManagementToolbarActionContributors = Partial<{
  [eTextTemplateManagementComponents.TextTemplates]: ToolbarActionContributorCallback<
    TextTemplateManagement.TemplateDefinitionDto[]
  >[];
}>;

/**
 * Entity prop contributors type for Text Template Management
 * @since 3.0.0
 */
export type TextTemplateManagementEntityPropContributors = Partial<{
  [eTextTemplateManagementComponents.TextTemplates]: EntityPropContributorCallback<TextTemplateManagement.TemplateDefinitionDto>[];
}>;

/**
 * Configuration options interface for Text Template Management module
 * @since 3.0.0
 */
export interface TextTemplateManagementConfigOptions {
  /** Entity action contributors */
  entityActionContributors?: TextTemplateManagementEntityActionContributors;
  /** Toolbar action contributors */
  toolbarActionContributors?: TextTemplateManagementToolbarActionContributors;
  /** Entity prop contributors */
  entityPropContributors?: TextTemplateManagementEntityPropContributors;
}
