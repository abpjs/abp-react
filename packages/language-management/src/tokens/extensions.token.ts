/**
 * Language Management Extension Tokens
 * Provides extension points for customizing language management components.
 * @since 3.0.0
 */

import type { eLanguageManagementComponents } from '../enums/components';
import type { LanguageManagement } from '../models/language-management';

// ========================
// Extension Types
// ========================

/**
 * Entity action definition for grid row actions.
 * @template T - The entity type for the action
 */
export interface EntityAction<T> {
  text: string;
  action?: (record: { record: T }) => void;
  visible?: (data: { record: T }) => boolean;
  permission?: string;
  icon?: string;
}

/**
 * Toolbar action definition for grid toolbar buttons.
 * @template T - The entity array type for the action
 */
export interface ToolbarAction<T> {
  text: string;
  action?: (data: { data: T }) => void;
  visible?: (data: { data: T }) => boolean;
  permission?: string;
  icon?: string;
}

/**
 * Entity prop definition for grid columns.
 * @template T - The entity type for the prop
 */
export interface EntityProp<T> {
  type: string;
  name: keyof T | string;
  displayName: string;
  sortable?: boolean;
  visible?: (data: { record: T }) => boolean;
  valueResolver?: (data: { record: T }) => string | number | boolean;
}

/**
 * Form prop definition for form fields.
 * @template T - The entity type for the form
 */
export interface FormProp<T> {
  type: string;
  name: keyof T | string;
  displayName: string;
  validators?: unknown[];
  visible?: (data: { entity?: T }) => boolean;
  defaultValue?: unknown;
  options?: unknown[];
}

// ========================
// Contributor Callback Types
// ========================

export type EntityActionContributorCallback<T> = (
  actions: EntityAction<T>[]
) => EntityAction<T>[];

export type ToolbarActionContributorCallback<T> = (
  actions: ToolbarAction<T>[]
) => ToolbarAction<T>[];

export type EntityPropContributorCallback<T> = (
  props: EntityProp<T>[]
) => EntityProp<T>[];

export type CreateFormPropContributorCallback<T> = (
  props: FormProp<T>[]
) => FormProp<T>[];

export type EditFormPropContributorCallback<T> = (
  props: FormProp<T>[]
) => FormProp<T>[];

// ========================
// Default Entity Actions
// ========================

/**
 * Default entity actions for Languages component.
 */
export const DEFAULT_LANGUAGES_ENTITY_ACTIONS: EntityAction<LanguageManagement.Language>[] = [
  {
    text: 'LanguageManagement::Edit',
    permission: 'LanguageManagement.Languages.Edit',
    icon: 'fa fa-pencil',
  },
  {
    text: 'LanguageManagement::SetAsDefault',
    permission: 'LanguageManagement.Languages.SetAsDefault',
    icon: 'fa fa-star',
  },
  {
    text: 'LanguageManagement::Delete',
    permission: 'LanguageManagement.Languages.Delete',
    icon: 'fa fa-trash',
  },
];

/**
 * Default entity actions for LanguageTexts component.
 */
export const DEFAULT_LANGUAGE_TEXTS_ENTITY_ACTIONS: EntityAction<LanguageManagement.LanguageText>[] = [
  {
    text: 'LanguageManagement::Edit',
    permission: 'LanguageManagement.LanguageTexts.Edit',
    icon: 'fa fa-pencil',
  },
  {
    text: 'LanguageManagement::Restore',
    permission: 'LanguageManagement.LanguageTexts.Edit',
    icon: 'fa fa-undo',
  },
];

/**
 * Combined default language management entity actions.
 */
export const DEFAULT_LANGUAGE_MANAGEMENT_ENTITY_ACTIONS = {
  'LanguageManagement.LanguagesComponent': DEFAULT_LANGUAGES_ENTITY_ACTIONS,
  'LanguageManagement.LanguageTextsComponent': DEFAULT_LANGUAGE_TEXTS_ENTITY_ACTIONS,
} as const;

// ========================
// Default Toolbar Actions
// ========================

/**
 * Default toolbar actions for Languages component.
 */
export const DEFAULT_LANGUAGES_TOOLBAR_ACTIONS: ToolbarAction<LanguageManagement.Language[]>[] = [
  {
    text: 'LanguageManagement::NewLanguage',
    permission: 'LanguageManagement.Languages.Create',
    icon: 'fa fa-plus',
  },
];

/**
 * Default toolbar actions for LanguageTexts component.
 * Note: LanguageTexts typically doesn't have toolbar actions as texts are predefined.
 */
export const DEFAULT_LANGUAGE_TEXTS_TOOLBAR_ACTIONS: ToolbarAction<LanguageManagement.LanguageText[]>[] = [];

/**
 * Combined default language management toolbar actions.
 */
export const DEFAULT_LANGUAGE_MANAGEMENT_TOOLBAR_ACTIONS = {
  'LanguageManagement.LanguagesComponent': DEFAULT_LANGUAGES_TOOLBAR_ACTIONS,
  'LanguageManagement.LanguageTextsComponent': DEFAULT_LANGUAGE_TEXTS_TOOLBAR_ACTIONS,
} as const;

// ========================
// Default Entity Props
// ========================

/**
 * Default entity props for Languages component.
 */
export const DEFAULT_LANGUAGES_ENTITY_PROPS: EntityProp<LanguageManagement.Language>[] = [
  { type: 'string', name: 'displayName', displayName: 'LanguageManagement::DisplayName', sortable: true },
  { type: 'string', name: 'cultureName', displayName: 'LanguageManagement::CultureName', sortable: true },
  { type: 'string', name: 'uiCultureName', displayName: 'LanguageManagement::UiCultureName', sortable: true },
  { type: 'boolean', name: 'isEnabled', displayName: 'LanguageManagement::IsEnabled', sortable: false },
  { type: 'boolean', name: 'isDefaultLanguage', displayName: 'LanguageManagement::IsDefault', sortable: false },
];

/**
 * Combined default language management entity props.
 * Note: LanguageTexts props are not included as they use a different display pattern.
 */
export const DEFAULT_LANGUAGE_MANAGEMENT_ENTITY_PROPS = {
  'LanguageManagement.LanguagesComponent': DEFAULT_LANGUAGES_ENTITY_PROPS,
} as const;

// ========================
// Default Form Props
// ========================

/**
 * Default create form props for Languages component.
 */
export const DEFAULT_LANGUAGES_CREATE_FORM_PROPS: FormProp<LanguageManagement.Language>[] = [
  { type: 'select', name: 'cultureName', displayName: 'LanguageManagement::CultureName' },
  { type: 'select', name: 'uiCultureName', displayName: 'LanguageManagement::UiCultureName' },
  { type: 'string', name: 'displayName', displayName: 'LanguageManagement::DisplayName' },
  { type: 'select', name: 'flagIcon', displayName: 'LanguageManagement::FlagIcon' },
  { type: 'boolean', name: 'isEnabled', displayName: 'LanguageManagement::IsEnabled' },
];

/**
 * Default edit form props for Languages component.
 */
export const DEFAULT_LANGUAGES_EDIT_FORM_PROPS: FormProp<LanguageManagement.Language>[] = [
  { type: 'string', name: 'displayName', displayName: 'LanguageManagement::DisplayName' },
  { type: 'select', name: 'flagIcon', displayName: 'LanguageManagement::FlagIcon' },
  { type: 'boolean', name: 'isEnabled', displayName: 'LanguageManagement::IsEnabled' },
];

/**
 * Combined default language management create form props.
 */
export const DEFAULT_LANGUAGE_MANAGEMENT_CREATE_FORM_PROPS = {
  'LanguageManagement.LanguagesComponent': DEFAULT_LANGUAGES_CREATE_FORM_PROPS,
} as const;

/**
 * Combined default language management edit form props.
 */
export const DEFAULT_LANGUAGE_MANAGEMENT_EDIT_FORM_PROPS = {
  'LanguageManagement.LanguagesComponent': DEFAULT_LANGUAGES_EDIT_FORM_PROPS,
} as const;

// ========================
// Contributor Token Types
// ========================

/**
 * Entity action contributors type.
 */
export type LanguageManagementEntityActionContributors = Partial<{
  [eLanguageManagementComponents.Languages]: EntityActionContributorCallback<LanguageManagement.Language>[];
  [eLanguageManagementComponents.LanguageTexts]: EntityActionContributorCallback<LanguageManagement.LanguageText>[];
}>;

/**
 * Toolbar action contributors type.
 */
export type LanguageManagementToolbarActionContributors = Partial<{
  [eLanguageManagementComponents.Languages]: ToolbarActionContributorCallback<LanguageManagement.Language[]>[];
  [eLanguageManagementComponents.LanguageTexts]: ToolbarActionContributorCallback<LanguageManagement.LanguageText[]>[];
}>;

/**
 * Entity prop contributors type.
 */
export type LanguageManagementEntityPropContributors = Partial<{
  [eLanguageManagementComponents.Languages]: EntityPropContributorCallback<LanguageManagement.Language>[];
  [eLanguageManagementComponents.LanguageTexts]: EntityPropContributorCallback<LanguageManagement.LanguageText>[];
}>;

/**
 * Create form prop contributors type.
 */
export type LanguageManagementCreateFormPropContributors = Partial<{
  [eLanguageManagementComponents.Languages]: CreateFormPropContributorCallback<LanguageManagement.Language>[];
  [eLanguageManagementComponents.LanguageTexts]: CreateFormPropContributorCallback<LanguageManagement.LanguageText>[];
}>;

/**
 * Edit form prop contributors type.
 */
export type LanguageManagementEditFormPropContributors = Partial<{
  [eLanguageManagementComponents.Languages]: EditFormPropContributorCallback<LanguageManagement.Language>[];
  [eLanguageManagementComponents.LanguageTexts]: EditFormPropContributorCallback<LanguageManagement.LanguageText>[];
}>;

// ========================
// Token Symbols (React Context Keys)
// ========================

/**
 * Token for language management entity action contributors.
 * Use as a React Context key.
 */
export const LANGUAGE_MANAGEMENT_ENTITY_ACTION_CONTRIBUTORS = Symbol('LANGUAGE_MANAGEMENT_ENTITY_ACTION_CONTRIBUTORS');

/**
 * Token for language management toolbar action contributors.
 * Use as a React Context key.
 */
export const LANGUAGE_MANAGEMENT_TOOLBAR_ACTION_CONTRIBUTORS = Symbol('LANGUAGE_MANAGEMENT_TOOLBAR_ACTION_CONTRIBUTORS');

/**
 * Token for language management entity prop contributors.
 * Use as a React Context key.
 */
export const LANGUAGE_MANAGEMENT_ENTITY_PROP_CONTRIBUTORS = Symbol('LANGUAGE_MANAGEMENT_ENTITY_PROP_CONTRIBUTORS');

/**
 * Token for language management create form prop contributors.
 * Use as a React Context key.
 */
export const LANGUAGE_MANAGEMENT_CREATE_FORM_PROP_CONTRIBUTORS = Symbol('LANGUAGE_MANAGEMENT_CREATE_FORM_PROP_CONTRIBUTORS');

/**
 * Token for language management edit form prop contributors.
 * Use as a React Context key.
 */
export const LANGUAGE_MANAGEMENT_EDIT_FORM_PROP_CONTRIBUTORS = Symbol('LANGUAGE_MANAGEMENT_EDIT_FORM_PROP_CONTRIBUTORS');
