/**
 * SaaS Extension Tokens
 * Translated from @volo/abp.ng.saas v3.2.0
 *
 * Default entity actions, toolbar actions, entity props, and form props
 * for the SaaS module extensibility system.
 *
 * @since 3.0.0
 * @updated 3.2.0 - Now uses proxy DTOs (EditionDto, SaasTenantDto) instead of Saas.Edition/Saas.Tenant
 */

import { eSaasComponents } from '../enums/components';
import type { EditionDto, SaasTenantDto } from '../proxy/host/dtos/models';

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

/**
 * Form prop type for extensibility
 * @since 3.0.0
 */
export interface FormProp<T = unknown> {
  name: string;
  displayName?: string;
  type?: 'string' | 'number' | 'boolean' | 'date' | 'select' | 'textarea';
  defaultValue?: unknown;
  validators?: Array<{
    type: string;
    value?: unknown;
    message?: string;
  }>;
  options?: Array<{ label: string; value: unknown }>;
  permission?: string;
  visible?: boolean | ((record?: T) => boolean);
}

// ========================
// Default Entity Actions
// ========================

/**
 * Default entity actions for Editions component
 * @since 3.0.0
 * @updated 3.2.0 - Now uses EditionDto instead of Saas.Edition
 */
export const DEFAULT_EDITIONS_ENTITY_ACTIONS: EntityAction<EditionDto>[] = [
  {
    text: 'AbpUi::Edit',
    permission: 'Saas.Editions.Update',
    icon: 'fa fa-edit',
  },
  {
    text: 'Saas::Permission:ManageFeatures',
    permission: 'Saas.Editions.ManageFeatures',
    icon: 'fa fa-cog',
  },
  {
    text: 'AbpUi::Delete',
    permission: 'Saas.Editions.Delete',
    icon: 'fa fa-trash',
  },
];

/**
 * Default entity actions for Tenants component
 * @since 3.0.0
 * @updated 3.2.0 - Now uses SaasTenantDto instead of Saas.Tenant
 */
export const DEFAULT_TENANTS_ENTITY_ACTIONS: EntityAction<SaasTenantDto>[] = [
  {
    text: 'AbpUi::Edit',
    permission: 'Saas.Tenants.Update',
    icon: 'fa fa-edit',
  },
  {
    text: 'Saas::Permission:ManageFeatures',
    permission: 'Saas.Tenants.ManageFeatures',
    icon: 'fa fa-cog',
  },
  {
    text: 'Saas::ConnectionStrings',
    permission: 'Saas.Tenants.ManageConnectionStrings',
    icon: 'fa fa-database',
  },
  {
    text: 'AbpUi::Delete',
    permission: 'Saas.Tenants.Delete',
    icon: 'fa fa-trash',
  },
];

/**
 * Default entity actions aggregated by component
 * @since 3.0.0
 */
export const DEFAULT_SAAS_ENTITY_ACTIONS = {
  [eSaasComponents.Editions]: DEFAULT_EDITIONS_ENTITY_ACTIONS,
  [eSaasComponents.Tenants]: DEFAULT_TENANTS_ENTITY_ACTIONS,
} as const;

// ========================
// Default Toolbar Actions
// ========================

/**
 * Default toolbar actions for Editions component
 * @since 3.0.0
 * @updated 3.2.0 - Now uses EditionDto instead of Saas.Edition
 */
export const DEFAULT_EDITIONS_TOOLBAR_ACTIONS: ToolbarAction<EditionDto[]>[] = [
  {
    text: 'Saas::NewEdition',
    permission: 'Saas.Editions.Create',
    icon: 'fa fa-plus',
  },
];

/**
 * Default toolbar actions for Tenants component
 * @since 3.0.0
 * @updated 3.2.0 - Now uses SaasTenantDto instead of Saas.Tenant
 */
export const DEFAULT_TENANTS_TOOLBAR_ACTIONS: ToolbarAction<SaasTenantDto[]>[] = [
  {
    text: 'Saas::NewTenant',
    permission: 'Saas.Tenants.Create',
    icon: 'fa fa-plus',
  },
];

/**
 * Default toolbar actions aggregated by component
 * @since 3.0.0
 */
export const DEFAULT_SAAS_TOOLBAR_ACTIONS = {
  [eSaasComponents.Editions]: DEFAULT_EDITIONS_TOOLBAR_ACTIONS,
  [eSaasComponents.Tenants]: DEFAULT_TENANTS_TOOLBAR_ACTIONS,
} as const;

// ========================
// Default Entity Props
// ========================

/**
 * Default entity props for Editions component
 * @since 3.0.0
 * @updated 3.2.0 - Now uses EditionDto instead of Saas.Edition
 */
export const DEFAULT_EDITIONS_ENTITY_PROPS: EntityProp<EditionDto>[] = [
  {
    name: 'displayName',
    displayName: 'Saas::EditionName',
    sortable: true,
  },
];

/**
 * Default entity props for Tenants component
 * @since 3.0.0
 * @updated 3.2.0 - Now uses SaasTenantDto instead of Saas.Tenant
 */
export const DEFAULT_TENANTS_ENTITY_PROPS: EntityProp<SaasTenantDto>[] = [
  {
    name: 'name',
    displayName: 'Saas::TenantName',
    sortable: true,
  },
  {
    name: 'editionName',
    displayName: 'Saas::EditionName',
    sortable: false,
  },
];

/**
 * Default entity props aggregated by component
 * @since 3.0.0
 */
export const DEFAULT_SAAS_ENTITY_PROPS = {
  [eSaasComponents.Editions]: DEFAULT_EDITIONS_ENTITY_PROPS,
  [eSaasComponents.Tenants]: DEFAULT_TENANTS_ENTITY_PROPS,
} as const;

// ========================
// Default Create Form Props
// ========================

/**
 * Default create form props for Editions component
 * @since 3.0.0
 * @updated 3.2.0 - Now uses EditionDto instead of Saas.Edition
 */
export const DEFAULT_EDITIONS_CREATE_FORM_PROPS: FormProp<EditionDto>[] = [
  {
    name: 'displayName',
    displayName: 'Saas::EditionName',
    type: 'string',
    validators: [
      { type: 'required', message: 'Saas::EditionNameIsRequired' },
      { type: 'maxLength', value: 256 },
    ],
  },
];

/**
 * Default create form props for Tenants component
 * @since 3.0.0
 * @updated 3.2.0 - Now uses SaasTenantDto instead of Saas.Tenant
 */
export const DEFAULT_TENANTS_CREATE_FORM_PROPS: FormProp<SaasTenantDto>[] = [
  {
    name: 'name',
    displayName: 'Saas::TenantName',
    type: 'string',
    validators: [
      { type: 'required', message: 'Saas::TenantNameIsRequired' },
      { type: 'maxLength', value: 256 },
    ],
  },
  {
    name: 'editionId',
    displayName: 'Saas::Edition',
    type: 'select',
    options: [],
  },
  {
    name: 'adminEmailAddress',
    displayName: 'Saas::AdminEmailAddress',
    type: 'string',
    validators: [
      { type: 'required', message: 'Saas::AdminEmailAddressIsRequired' },
      { type: 'email' },
    ],
  },
  {
    name: 'adminPassword',
    displayName: 'Saas::AdminPassword',
    type: 'string',
    validators: [{ type: 'required', message: 'Saas::AdminPasswordIsRequired' }],
  },
];

/**
 * Default create form props aggregated by component
 * @since 3.0.0
 */
export const DEFAULT_SAAS_CREATE_FORM_PROPS = {
  [eSaasComponents.Editions]: DEFAULT_EDITIONS_CREATE_FORM_PROPS,
  [eSaasComponents.Tenants]: DEFAULT_TENANTS_CREATE_FORM_PROPS,
} as const;

// ========================
// Default Edit Form Props
// ========================

/**
 * Default edit form props for Editions component
 * @since 3.0.0
 * @updated 3.2.0 - Now uses EditionDto instead of Saas.Edition
 */
export const DEFAULT_EDITIONS_EDIT_FORM_PROPS: FormProp<EditionDto>[] = [
  {
    name: 'displayName',
    displayName: 'Saas::EditionName',
    type: 'string',
    validators: [
      { type: 'required', message: 'Saas::EditionNameIsRequired' },
      { type: 'maxLength', value: 256 },
    ],
  },
];

/**
 * Default edit form props for Tenants component
 * @since 3.0.0
 * @updated 3.2.0 - Now uses SaasTenantDto instead of Saas.Tenant
 */
export const DEFAULT_TENANTS_EDIT_FORM_PROPS: FormProp<SaasTenantDto>[] = [
  {
    name: 'name',
    displayName: 'Saas::TenantName',
    type: 'string',
    validators: [
      { type: 'required', message: 'Saas::TenantNameIsRequired' },
      { type: 'maxLength', value: 256 },
    ],
  },
  {
    name: 'editionId',
    displayName: 'Saas::Edition',
    type: 'select',
    options: [],
  },
];

/**
 * Default edit form props aggregated by component
 * @since 3.0.0
 */
export const DEFAULT_SAAS_EDIT_FORM_PROPS = {
  [eSaasComponents.Editions]: DEFAULT_EDITIONS_EDIT_FORM_PROPS,
  [eSaasComponents.Tenants]: DEFAULT_TENANTS_EDIT_FORM_PROPS,
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
 * Create form prop contributor callback type
 * @since 3.0.0
 */
export type CreateFormPropContributorCallback<T> = (
  props: FormProp<T>[],
) => FormProp<T>[];

/**
 * Edit form prop contributor callback type
 * @since 3.0.0
 */
export type EditFormPropContributorCallback<T> = (
  props: FormProp<T>[],
) => FormProp<T>[];

/**
 * Token for entity action contributors
 * React equivalent of Angular InjectionToken
 * @since 3.0.0
 */
export const SAAS_ENTITY_ACTION_CONTRIBUTORS = Symbol(
  'SAAS_ENTITY_ACTION_CONTRIBUTORS',
);

/**
 * Token for toolbar action contributors
 * React equivalent of Angular InjectionToken
 * @since 3.0.0
 */
export const SAAS_TOOLBAR_ACTION_CONTRIBUTORS = Symbol(
  'SAAS_TOOLBAR_ACTION_CONTRIBUTORS',
);

/**
 * Token for entity prop contributors
 * React equivalent of Angular InjectionToken
 * @since 3.0.0
 */
export const SAAS_ENTITY_PROP_CONTRIBUTORS = Symbol(
  'SAAS_ENTITY_PROP_CONTRIBUTORS',
);

/**
 * Token for create form prop contributors
 * React equivalent of Angular InjectionToken
 * @since 3.0.0
 */
export const SAAS_CREATE_FORM_PROP_CONTRIBUTORS = Symbol(
  'SAAS_CREATE_FORM_PROP_CONTRIBUTORS',
);

/**
 * Token for edit form prop contributors
 * React equivalent of Angular InjectionToken
 * @since 3.0.0
 */
export const SAAS_EDIT_FORM_PROP_CONTRIBUTORS = Symbol(
  'SAAS_EDIT_FORM_PROP_CONTRIBUTORS',
);
