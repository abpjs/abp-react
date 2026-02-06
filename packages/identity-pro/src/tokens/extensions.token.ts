/**
 * Identity Extension Tokens
 * Provides extension points for customizing identity components.
 * @since 3.0.0
 */

import type { eIdentityComponents } from '../enums/components';
import type { Identity } from '../models/identity';
import type { OrganizationUnitWithDetailsDto } from '../models/organization-unit-with-details-dto';

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
 * Default entity actions for Claims component.
 */
export const DEFAULT_CLAIMS_ENTITY_ACTIONS: EntityAction<Identity.ClaimType>[] = [
  {
    text: 'AbpIdentity::Edit',
    permission: 'AbpIdentity.ClaimTypes.Update',
    icon: 'fa fa-pencil',
  },
  {
    text: 'AbpIdentity::Delete',
    permission: 'AbpIdentity.ClaimTypes.Delete',
    icon: 'fa fa-trash',
  },
];

/**
 * Default entity actions for Roles component.
 */
export const DEFAULT_ROLES_ENTITY_ACTIONS: EntityAction<Identity.RoleItem>[] = [
  {
    text: 'AbpIdentity::Edit',
    permission: 'AbpIdentity.Roles.Update',
    icon: 'fa fa-pencil',
  },
  {
    text: 'AbpIdentity::Claims',
    permission: 'AbpIdentity.Roles.Update',
    icon: 'fa fa-list',
  },
  {
    text: 'AbpIdentity::Permissions',
    permission: 'AbpIdentity.Roles.ManagePermissions',
    icon: 'fa fa-lock',
  },
  {
    text: 'AbpIdentity::Delete',
    permission: 'AbpIdentity.Roles.Delete',
    icon: 'fa fa-trash',
  },
];

/**
 * Default entity actions for Users component.
 */
export const DEFAULT_USERS_ENTITY_ACTIONS: EntityAction<Identity.UserItem>[] = [
  {
    text: 'AbpIdentity::Edit',
    permission: 'AbpIdentity.Users.Update',
    icon: 'fa fa-pencil',
  },
  {
    text: 'AbpIdentity::Claims',
    permission: 'AbpIdentity.Users.Update',
    icon: 'fa fa-list',
  },
  {
    text: 'AbpIdentity::Permissions',
    permission: 'AbpIdentity.Users.ManagePermissions',
    icon: 'fa fa-lock',
  },
  {
    text: 'AbpIdentity::SetPassword',
    permission: 'AbpIdentity.Users.Update',
    icon: 'fa fa-key',
  },
  {
    text: 'AbpIdentity::Unlock',
    permission: 'AbpIdentity.Users.Update',
    icon: 'fa fa-unlock',
  },
  {
    text: 'AbpIdentity::Delete',
    permission: 'AbpIdentity.Users.Delete',
    icon: 'fa fa-trash',
  },
];

/**
 * Default entity actions for Organization Members component.
 */
export const DEFAULT_ORGANIZATION_MEMBERS_ENTITY_ACTIONS: EntityAction<Identity.UserItem>[] = [
  {
    text: 'AbpIdentity::Delete',
    permission: 'AbpIdentity.OrganizationUnits.ManageMembers',
    icon: 'fa fa-trash',
  },
];

/**
 * Default entity actions for Organization Roles component.
 */
export const DEFAULT_ORGANIZATION_ROLES_ENTITY_ACTIONS: EntityAction<Identity.RoleItem>[] = [
  {
    text: 'AbpIdentity::Delete',
    permission: 'AbpIdentity.OrganizationUnits.ManageRoles',
    icon: 'fa fa-trash',
  },
];

/**
 * Combined default identity entity actions.
 */
export const DEFAULT_IDENTITY_ENTITY_ACTIONS = {
  'Identity.ClaimsComponent': DEFAULT_CLAIMS_ENTITY_ACTIONS,
  'Identity.RolesComponent': DEFAULT_ROLES_ENTITY_ACTIONS,
  'Identity.UsersComponent': DEFAULT_USERS_ENTITY_ACTIONS,
  'Identity.OrganizationMembersComponent': DEFAULT_ORGANIZATION_MEMBERS_ENTITY_ACTIONS,
  'Identity.OrganizationRolesComponent': DEFAULT_ORGANIZATION_ROLES_ENTITY_ACTIONS,
} as const;

// ========================
// Default Toolbar Actions
// ========================

/**
 * Default toolbar actions for Claims component.
 */
export const DEFAULT_CLAIMS_TOOLBAR_ACTIONS: ToolbarAction<Identity.ClaimType[]>[] = [
  {
    text: 'AbpIdentity::NewClaimType',
    permission: 'AbpIdentity.ClaimTypes.Create',
    icon: 'fa fa-plus',
  },
];

/**
 * Default toolbar actions for Roles component.
 */
export const DEFAULT_ROLES_TOOLBAR_ACTIONS: ToolbarAction<Identity.RoleItem[]>[] = [
  {
    text: 'AbpIdentity::NewRole',
    permission: 'AbpIdentity.Roles.Create',
    icon: 'fa fa-plus',
  },
];

/**
 * Default toolbar actions for Users component.
 */
export const DEFAULT_USERS_TOOLBAR_ACTIONS: ToolbarAction<Identity.UserItem[]>[] = [
  {
    text: 'AbpIdentity::NewUser',
    permission: 'AbpIdentity.Users.Create',
    icon: 'fa fa-plus',
  },
];

/**
 * Default toolbar actions for Organization Units component.
 */
export const DEFAULT_ORGANIZATION_UNITS_TOOLBAR_ACTIONS: ToolbarAction<OrganizationUnitWithDetailsDto[]>[] = [
  {
    text: 'AbpIdentity::NewOrganizationUnit',
    permission: 'AbpIdentity.OrganizationUnits.Create',
    icon: 'fa fa-plus',
  },
];

/**
 * Combined default identity toolbar actions.
 */
export const DEFAULT_IDENTITY_TOOLBAR_ACTIONS = {
  'Identity.ClaimsComponent': DEFAULT_CLAIMS_TOOLBAR_ACTIONS,
  'Identity.RolesComponent': DEFAULT_ROLES_TOOLBAR_ACTIONS,
  'Identity.UsersComponent': DEFAULT_USERS_TOOLBAR_ACTIONS,
  'Identity.OrganizationUnitsComponent': DEFAULT_ORGANIZATION_UNITS_TOOLBAR_ACTIONS,
} as const;

// ========================
// Default Entity Props
// ========================

/**
 * Default entity props for Claims component.
 */
export const DEFAULT_CLAIMS_ENTITY_PROPS: EntityProp<Identity.ClaimType>[] = [
  { type: 'string', name: 'name', displayName: 'AbpIdentity::DisplayName:ClaimName', sortable: true },
  { type: 'string', name: 'valueType', displayName: 'AbpIdentity::DisplayName:ClaimValueType', sortable: true },
  { type: 'string', name: 'regex', displayName: 'AbpIdentity::DisplayName:Regex', sortable: false },
  { type: 'boolean', name: 'required', displayName: 'AbpIdentity::DisplayName:Required', sortable: false },
];

/**
 * Default entity props for Roles component.
 */
export const DEFAULT_ROLES_ENTITY_PROPS: EntityProp<Identity.RoleItem>[] = [
  { type: 'string', name: 'name', displayName: 'AbpIdentity::RoleName', sortable: true },
];

/**
 * Default entity props for Users component.
 */
export const DEFAULT_USERS_ENTITY_PROPS: EntityProp<Identity.UserItem>[] = [
  { type: 'string', name: 'userName', displayName: 'AbpIdentity::UserName', sortable: true },
  { type: 'string', name: 'email', displayName: 'AbpIdentity::EmailAddress', sortable: true },
  { type: 'string', name: 'phoneNumber', displayName: 'AbpIdentity::PhoneNumber', sortable: false },
];

/**
 * Default entity props for Organization Members component.
 */
export const DEFAULT_ORGANIZATION_MEMBERS_ENTITY_PROPS: EntityProp<Identity.UserItem>[] = [
  { type: 'string', name: 'userName', displayName: 'AbpIdentity::UserName', sortable: true },
  { type: 'string', name: 'email', displayName: 'AbpIdentity::EmailAddress', sortable: true },
];

/**
 * Default entity props for Organization Roles component.
 */
export const DEFAULT_ORGANIZATION_ROLES_ENTITY_PROPS: EntityProp<Identity.RoleItem>[] = [
  { type: 'string', name: 'name', displayName: 'AbpIdentity::RoleName', sortable: true },
];

/**
 * Combined default identity entity props.
 */
export const DEFAULT_IDENTITY_ENTITY_PROPS = {
  'Identity.ClaimsComponent': DEFAULT_CLAIMS_ENTITY_PROPS,
  'Identity.RolesComponent': DEFAULT_ROLES_ENTITY_PROPS,
  'Identity.UsersComponent': DEFAULT_USERS_ENTITY_PROPS,
  'Identity.OrganizationMembersComponent': DEFAULT_ORGANIZATION_MEMBERS_ENTITY_PROPS,
  'Identity.OrganizationRolesComponent': DEFAULT_ORGANIZATION_ROLES_ENTITY_PROPS,
} as const;

// ========================
// Default Form Props
// ========================

/**
 * Default create form props for Claims component.
 */
export const DEFAULT_CLAIMS_CREATE_FORM_PROPS: FormProp<Identity.ClaimType>[] = [
  { type: 'string', name: 'name', displayName: 'AbpIdentity::DisplayName:ClaimName' },
  { type: 'select', name: 'valueType', displayName: 'AbpIdentity::DisplayName:ClaimValueType' },
  { type: 'string', name: 'regex', displayName: 'AbpIdentity::DisplayName:Regex' },
  { type: 'string', name: 'regexDescription', displayName: 'AbpIdentity::DisplayName:RegexDescription' },
  { type: 'boolean', name: 'required', displayName: 'AbpIdentity::DisplayName:Required' },
  { type: 'string', name: 'description', displayName: 'AbpIdentity::DisplayName:Description' },
];

/**
 * Default edit form props for Claims component.
 */
export const DEFAULT_CLAIMS_EDIT_FORM_PROPS: FormProp<Identity.ClaimType>[] = [
  ...DEFAULT_CLAIMS_CREATE_FORM_PROPS,
];

/**
 * Default create form props for Roles component.
 */
export const DEFAULT_ROLES_CREATE_FORM_PROPS: FormProp<Identity.RoleItem>[] = [
  { type: 'string', name: 'name', displayName: 'AbpIdentity::RoleName' },
  { type: 'boolean', name: 'isDefault', displayName: 'AbpIdentity::DisplayName:IsDefault' },
  { type: 'boolean', name: 'isPublic', displayName: 'AbpIdentity::DisplayName:IsPublic' },
];

/**
 * Default edit form props for Roles component.
 */
export const DEFAULT_ROLES_EDIT_FORM_PROPS: FormProp<Identity.RoleItem>[] = [
  ...DEFAULT_ROLES_CREATE_FORM_PROPS,
];

/**
 * Default create form props for Users component.
 */
export const DEFAULT_USERS_CREATE_FORM_PROPS: FormProp<Identity.UserItem>[] = [
  { type: 'string', name: 'userName', displayName: 'AbpIdentity::UserName' },
  { type: 'string', name: 'name', displayName: 'AbpIdentity::DisplayName:Name' },
  { type: 'string', name: 'surname', displayName: 'AbpIdentity::DisplayName:Surname' },
  { type: 'email', name: 'email', displayName: 'AbpIdentity::EmailAddress' },
  { type: 'string', name: 'phoneNumber', displayName: 'AbpIdentity::PhoneNumber' },
  { type: 'password', name: 'password', displayName: 'AbpIdentity::Password' },
  { type: 'boolean', name: 'lockoutEnabled', displayName: 'AbpIdentity::DisplayName:LockoutEnabled' },
];

/**
 * Default edit form props for Users component.
 */
export const DEFAULT_USERS_EDIT_FORM_PROPS: FormProp<Identity.UserItem>[] = [
  { type: 'string', name: 'userName', displayName: 'AbpIdentity::UserName' },
  { type: 'string', name: 'name', displayName: 'AbpIdentity::DisplayName:Name' },
  { type: 'string', name: 'surname', displayName: 'AbpIdentity::DisplayName:Surname' },
  { type: 'email', name: 'email', displayName: 'AbpIdentity::EmailAddress' },
  { type: 'string', name: 'phoneNumber', displayName: 'AbpIdentity::PhoneNumber' },
  { type: 'boolean', name: 'lockoutEnabled', displayName: 'AbpIdentity::DisplayName:LockoutEnabled' },
];

/**
 * Combined default identity create form props.
 */
export const DEFAULT_IDENTITY_CREATE_FORM_PROPS = {
  'Identity.ClaimsComponent': DEFAULT_CLAIMS_CREATE_FORM_PROPS,
  'Identity.RolesComponent': DEFAULT_ROLES_CREATE_FORM_PROPS,
  'Identity.UsersComponent': DEFAULT_USERS_CREATE_FORM_PROPS,
} as const;

/**
 * Combined default identity edit form props.
 */
export const DEFAULT_IDENTITY_EDIT_FORM_PROPS = {
  'Identity.ClaimsComponent': DEFAULT_CLAIMS_EDIT_FORM_PROPS,
  'Identity.RolesComponent': DEFAULT_ROLES_EDIT_FORM_PROPS,
  'Identity.UsersComponent': DEFAULT_USERS_EDIT_FORM_PROPS,
} as const;

// ========================
// Contributor Token Types
// ========================

/**
 * Entity action contributors type.
 */
export type IdentityEntityActionContributors = Partial<{
  [eIdentityComponents.Claims]: EntityActionContributorCallback<Identity.ClaimType>[];
  [eIdentityComponents.Roles]: EntityActionContributorCallback<Identity.RoleItem>[];
  [eIdentityComponents.Users]: EntityActionContributorCallback<Identity.UserItem>[];
  [eIdentityComponents.OrganizationMembers]: EntityActionContributorCallback<Identity.UserItem>[];
  [eIdentityComponents.OrganizationRoles]: EntityActionContributorCallback<Identity.RoleItem>[];
}>;

/**
 * Toolbar action contributors type.
 */
export type IdentityToolbarActionContributors = Partial<{
  [eIdentityComponents.Claims]: ToolbarActionContributorCallback<Identity.ClaimType[]>[];
  [eIdentityComponents.Roles]: ToolbarActionContributorCallback<Identity.RoleItem[]>[];
  [eIdentityComponents.Users]: ToolbarActionContributorCallback<Identity.UserItem[]>[];
  [eIdentityComponents.OrganizationUnits]: ToolbarActionContributorCallback<OrganizationUnitWithDetailsDto[]>[];
}>;

/**
 * Entity prop contributors type.
 */
export type IdentityEntityPropContributors = Partial<{
  [eIdentityComponents.Claims]: EntityPropContributorCallback<Identity.ClaimType>[];
  [eIdentityComponents.Roles]: EntityPropContributorCallback<Identity.RoleItem>[];
  [eIdentityComponents.Users]: EntityPropContributorCallback<Identity.UserItem>[];
  [eIdentityComponents.OrganizationMembers]: EntityPropContributorCallback<Identity.UserItem>[];
  [eIdentityComponents.OrganizationRoles]: EntityPropContributorCallback<Identity.RoleItem>[];
}>;

/**
 * Create form prop contributors type.
 */
export type IdentityCreateFormPropContributors = Partial<{
  [eIdentityComponents.Claims]: CreateFormPropContributorCallback<Identity.ClaimType>[];
  [eIdentityComponents.Roles]: CreateFormPropContributorCallback<Identity.RoleItem>[];
  [eIdentityComponents.Users]: CreateFormPropContributorCallback<Identity.UserItem>[];
}>;

/**
 * Edit form prop contributors type.
 */
export type IdentityEditFormPropContributors = Partial<{
  [eIdentityComponents.Claims]: EditFormPropContributorCallback<Identity.ClaimType>[];
  [eIdentityComponents.Roles]: EditFormPropContributorCallback<Identity.RoleItem>[];
  [eIdentityComponents.Users]: EditFormPropContributorCallback<Identity.UserItem>[];
}>;

// ========================
// Token Symbols (React Context Keys)
// ========================

/**
 * Token for identity entity action contributors.
 * Use as a React Context key.
 */
export const IDENTITY_ENTITY_ACTION_CONTRIBUTORS = Symbol('IDENTITY_ENTITY_ACTION_CONTRIBUTORS');

/**
 * Token for identity toolbar action contributors.
 * Use as a React Context key.
 */
export const IDENTITY_TOOLBAR_ACTION_CONTRIBUTORS = Symbol('IDENTITY_TOOLBAR_ACTION_CONTRIBUTORS');

/**
 * Token for identity entity prop contributors.
 * Use as a React Context key.
 */
export const IDENTITY_ENTITY_PROP_CONTRIBUTORS = Symbol('IDENTITY_ENTITY_PROP_CONTRIBUTORS');

/**
 * Token for identity create form prop contributors.
 * Use as a React Context key.
 */
export const IDENTITY_CREATE_FORM_PROP_CONTRIBUTORS = Symbol('IDENTITY_CREATE_FORM_PROP_CONTRIBUTORS');

/**
 * Token for identity edit form prop contributors.
 * Use as a React Context key.
 */
export const IDENTITY_EDIT_FORM_PROP_CONTRIBUTORS = Symbol('IDENTITY_EDIT_FORM_PROP_CONTRIBUTORS');
