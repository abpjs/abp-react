/**
 * Text Template Management Extension Tokens
 * Translated from @volo/abp.ng.text-template-management v3.0.0
 *
 * Default entity actions, toolbar actions, and entity props
 * for the Text Template Management module extensibility system.
 *
 * @since 3.0.0
 */

import { eTextTemplateManagementComponents } from '../enums/components';
import type { TextTemplateManagement } from '../models/text-template-management';

/**
 * Entity action type for extensibility
 * @since 3.0.0
 */
export interface EntityAction<T = unknown> {
  text: string;
  action?: (record: T) => void;
  permission?: string;
  visible?: (record: T) => boolean;
  icon?: string;
}

/**
 * Toolbar action type for extensibility
 * @since 3.0.0
 */
export interface ToolbarAction<T = unknown> {
  text: string;
  action?: (data: T) => void;
  permission?: string;
  visible?: (data: T) => boolean;
  icon?: string;
}

/**
 * Entity prop type for extensibility
 * @since 3.0.0
 */
export interface EntityProp<T = unknown> {
  name: string;
  displayName?: string;
  sortable?: boolean;
  valueResolver?: (record: T) => string | number | boolean | null | undefined;
  permission?: string;
  visible?: boolean;
}

// ========================
// Default Entity Actions
// ========================

/**
 * Default entity actions for TextTemplates component
 * @since 3.0.0
 */
export const DEFAULT_TEXT_TEMPLATES_ENTITY_ACTIONS: EntityAction<TextTemplateManagement.TemplateDefinitionDto>[] =
  [
    {
      text: 'TextTemplateManagement::EditContents',
      permission: 'TextTemplateManagement.TextTemplates.EditContents',
      icon: 'fa fa-edit',
    },
  ];

/**
 * Default entity actions aggregated by component
 * @since 3.0.0
 */
export const DEFAULT_TEXT_TEMPLATE_MANAGEMENT_ENTITY_ACTIONS = {
  [eTextTemplateManagementComponents.TextTemplates]:
    DEFAULT_TEXT_TEMPLATES_ENTITY_ACTIONS,
} as const;

// ========================
// Default Toolbar Actions
// ========================

/**
 * Default toolbar actions for TextTemplates component
 * Note: Text Template Management typically doesn't have create functionality
 * as templates are defined in code
 * @since 3.0.0
 */
export const DEFAULT_TEXT_TEMPLATES_TOOLBAR_ACTIONS: ToolbarAction<
  TextTemplateManagement.TemplateDefinitionDto[]
>[] = [];

/**
 * Default toolbar actions aggregated by component
 * @since 3.0.0
 */
export const DEFAULT_TEXT_TEMPLATE_MANAGEMENT_TOOLBAR_ACTIONS = {
  [eTextTemplateManagementComponents.TextTemplates]:
    DEFAULT_TEXT_TEMPLATES_TOOLBAR_ACTIONS,
} as const;

// ========================
// Default Entity Props
// ========================

/**
 * Default entity props for TextTemplates component
 * @since 3.0.0
 */
export const DEFAULT_TEXT_TEMPLATES_ENTITY_PROPS: EntityProp<TextTemplateManagement.TemplateDefinitionDto>[] =
  [
    {
      name: 'name',
      displayName: 'TextTemplateManagement::TemplateName',
      sortable: true,
    },
    {
      name: 'displayName',
      displayName: 'TextTemplateManagement::DisplayName',
      sortable: true,
    },
    {
      name: 'layout',
      displayName: 'TextTemplateManagement::Layout',
      sortable: false,
    },
    {
      name: 'defaultCultureName',
      displayName: 'TextTemplateManagement::DefaultCulture',
      sortable: false,
    },
  ];

/**
 * Default entity props aggregated by component
 * @since 3.0.0
 */
export const DEFAULT_TEXT_TEMPLATE_MANAGEMENT_ENTITY_PROPS = {
  [eTextTemplateManagementComponents.TextTemplates]:
    DEFAULT_TEXT_TEMPLATES_ENTITY_PROPS,
} as const;

// ========================
// Contributor Token Symbols
// ========================

/**
 * Entity action contributor callback type
 * @since 3.0.0
 */
export type EntityActionContributorCallback<T> = (
  actions: EntityAction<T>[],
) => EntityAction<T>[];

/**
 * Toolbar action contributor callback type
 * @since 3.0.0
 */
export type ToolbarActionContributorCallback<T> = (
  actions: ToolbarAction<T>[],
) => ToolbarAction<T>[];

/**
 * Entity prop contributor callback type
 * @since 3.0.0
 */
export type EntityPropContributorCallback<T> = (
  props: EntityProp<T>[],
) => EntityProp<T>[];

/**
 * Token for entity action contributors
 * React equivalent of Angular InjectionToken
 * @since 3.0.0
 */
export const TEXT_TEMPLATE_MANAGEMENT_ENTITY_ACTION_CONTRIBUTORS = Symbol(
  'TEXT_TEMPLATE_MANAGEMENT_ENTITY_ACTION_CONTRIBUTORS',
);

/**
 * Token for toolbar action contributors
 * React equivalent of Angular InjectionToken
 * @since 3.0.0
 */
export const TEXT_TEMPLATE_MANAGEMENT_TOOLBAR_ACTION_CONTRIBUTORS = Symbol(
  'TEXT_TEMPLATE_MANAGEMENT_TOOLBAR_ACTION_CONTRIBUTORS',
);

/**
 * Token for entity prop contributors
 * React equivalent of Angular InjectionToken
 * @since 3.0.0
 */
export const TEXT_TEMPLATE_MANAGEMENT_ENTITY_PROP_CONTRIBUTORS = Symbol(
  'TEXT_TEMPLATE_MANAGEMENT_ENTITY_PROP_CONTRIBUTORS',
);
