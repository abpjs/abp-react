/**
 * Tests for Identity Extension Tokens
 * @abpjs/identity-pro v3.0.0
 */
import { describe, it, expect } from 'vitest';
import {
  // Default Entity Actions
  DEFAULT_CLAIMS_ENTITY_ACTIONS,
  DEFAULT_ROLES_ENTITY_ACTIONS,
  DEFAULT_USERS_ENTITY_ACTIONS,
  DEFAULT_ORGANIZATION_MEMBERS_ENTITY_ACTIONS,
  DEFAULT_ORGANIZATION_ROLES_ENTITY_ACTIONS,
  DEFAULT_IDENTITY_ENTITY_ACTIONS,
  // Default Toolbar Actions
  DEFAULT_CLAIMS_TOOLBAR_ACTIONS,
  DEFAULT_ROLES_TOOLBAR_ACTIONS,
  DEFAULT_USERS_TOOLBAR_ACTIONS,
  DEFAULT_ORGANIZATION_UNITS_TOOLBAR_ACTIONS,
  DEFAULT_IDENTITY_TOOLBAR_ACTIONS,
  // Default Entity Props
  DEFAULT_CLAIMS_ENTITY_PROPS,
  DEFAULT_ROLES_ENTITY_PROPS,
  DEFAULT_USERS_ENTITY_PROPS,
  DEFAULT_ORGANIZATION_MEMBERS_ENTITY_PROPS,
  DEFAULT_ORGANIZATION_ROLES_ENTITY_PROPS,
  DEFAULT_IDENTITY_ENTITY_PROPS,
  // Default Form Props
  DEFAULT_CLAIMS_CREATE_FORM_PROPS,
  DEFAULT_CLAIMS_EDIT_FORM_PROPS,
  DEFAULT_ROLES_CREATE_FORM_PROPS,
  DEFAULT_ROLES_EDIT_FORM_PROPS,
  DEFAULT_USERS_CREATE_FORM_PROPS,
  DEFAULT_USERS_EDIT_FORM_PROPS,
  DEFAULT_IDENTITY_CREATE_FORM_PROPS,
  DEFAULT_IDENTITY_EDIT_FORM_PROPS,
  // Token Symbols
  IDENTITY_ENTITY_ACTION_CONTRIBUTORS,
  IDENTITY_TOOLBAR_ACTION_CONTRIBUTORS,
  IDENTITY_ENTITY_PROP_CONTRIBUTORS,
  IDENTITY_CREATE_FORM_PROP_CONTRIBUTORS,
  IDENTITY_EDIT_FORM_PROP_CONTRIBUTORS,
  // Types
  type EntityAction,
  type ToolbarAction,
  type EntityProp,
  type FormProp,
} from '../../tokens/extensions.token';

describe('DEFAULT_CLAIMS_ENTITY_ACTIONS', () => {
  it('should be an array', () => {
    expect(Array.isArray(DEFAULT_CLAIMS_ENTITY_ACTIONS)).toBe(true);
  });

  it('should have Edit and Delete actions', () => {
    const actionTexts = DEFAULT_CLAIMS_ENTITY_ACTIONS.map(a => a.text);
    expect(actionTexts).toContain('AbpIdentity::Edit');
    expect(actionTexts).toContain('AbpIdentity::Delete');
  });

  it('should have correct permissions', () => {
    const editAction = DEFAULT_CLAIMS_ENTITY_ACTIONS.find(a => a.text === 'AbpIdentity::Edit');
    const deleteAction = DEFAULT_CLAIMS_ENTITY_ACTIONS.find(a => a.text === 'AbpIdentity::Delete');

    expect(editAction?.permission).toBe('AbpIdentity.ClaimTypes.Update');
    expect(deleteAction?.permission).toBe('AbpIdentity.ClaimTypes.Delete');
  });
});

describe('DEFAULT_ROLES_ENTITY_ACTIONS', () => {
  it('should be an array', () => {
    expect(Array.isArray(DEFAULT_ROLES_ENTITY_ACTIONS)).toBe(true);
  });

  it('should have Edit, Claims, Permissions, and Delete actions', () => {
    const actionTexts = DEFAULT_ROLES_ENTITY_ACTIONS.map(a => a.text);
    expect(actionTexts).toContain('AbpIdentity::Edit');
    expect(actionTexts).toContain('AbpIdentity::Claims');
    expect(actionTexts).toContain('AbpIdentity::Permissions');
    expect(actionTexts).toContain('AbpIdentity::Delete');
  });

  it('should have correct permissions', () => {
    const editAction = DEFAULT_ROLES_ENTITY_ACTIONS.find(a => a.text === 'AbpIdentity::Edit');
    const permAction = DEFAULT_ROLES_ENTITY_ACTIONS.find(a => a.text === 'AbpIdentity::Permissions');
    const deleteAction = DEFAULT_ROLES_ENTITY_ACTIONS.find(a => a.text === 'AbpIdentity::Delete');

    expect(editAction?.permission).toBe('AbpIdentity.Roles.Update');
    expect(permAction?.permission).toBe('AbpIdentity.Roles.ManagePermissions');
    expect(deleteAction?.permission).toBe('AbpIdentity.Roles.Delete');
  });
});

describe('DEFAULT_USERS_ENTITY_ACTIONS', () => {
  it('should be an array', () => {
    expect(Array.isArray(DEFAULT_USERS_ENTITY_ACTIONS)).toBe(true);
  });

  it('should have Edit, Claims, Permissions, SetPassword, Unlock, and Delete actions', () => {
    const actionTexts = DEFAULT_USERS_ENTITY_ACTIONS.map(a => a.text);
    expect(actionTexts).toContain('AbpIdentity::Edit');
    expect(actionTexts).toContain('AbpIdentity::Claims');
    expect(actionTexts).toContain('AbpIdentity::Permissions');
    expect(actionTexts).toContain('AbpIdentity::SetPassword');
    expect(actionTexts).toContain('AbpIdentity::Unlock');
    expect(actionTexts).toContain('AbpIdentity::Delete');
  });
});

describe('DEFAULT_ORGANIZATION_MEMBERS_ENTITY_ACTIONS', () => {
  it('should be an array', () => {
    expect(Array.isArray(DEFAULT_ORGANIZATION_MEMBERS_ENTITY_ACTIONS)).toBe(true);
  });

  it('should have Delete action only', () => {
    const actionTexts = DEFAULT_ORGANIZATION_MEMBERS_ENTITY_ACTIONS.map(a => a.text);
    expect(actionTexts).toContain('AbpIdentity::Delete');
    expect(actionTexts).toHaveLength(1);
  });

  it('should have correct permission', () => {
    const deleteAction = DEFAULT_ORGANIZATION_MEMBERS_ENTITY_ACTIONS.find(a => a.text === 'AbpIdentity::Delete');
    expect(deleteAction?.permission).toBe('AbpIdentity.OrganizationUnits.ManageMembers');
  });
});

describe('DEFAULT_ORGANIZATION_ROLES_ENTITY_ACTIONS', () => {
  it('should be an array', () => {
    expect(Array.isArray(DEFAULT_ORGANIZATION_ROLES_ENTITY_ACTIONS)).toBe(true);
  });

  it('should have Delete action only', () => {
    const actionTexts = DEFAULT_ORGANIZATION_ROLES_ENTITY_ACTIONS.map(a => a.text);
    expect(actionTexts).toContain('AbpIdentity::Delete');
    expect(actionTexts).toHaveLength(1);
  });

  it('should have correct permission', () => {
    const deleteAction = DEFAULT_ORGANIZATION_ROLES_ENTITY_ACTIONS.find(a => a.text === 'AbpIdentity::Delete');
    expect(deleteAction?.permission).toBe('AbpIdentity.OrganizationUnits.ManageRoles');
  });
});

describe('DEFAULT_IDENTITY_ENTITY_ACTIONS', () => {
  it('should contain all component entity actions', () => {
    expect(DEFAULT_IDENTITY_ENTITY_ACTIONS['Identity.ClaimsComponent']).toBe(DEFAULT_CLAIMS_ENTITY_ACTIONS);
    expect(DEFAULT_IDENTITY_ENTITY_ACTIONS['Identity.RolesComponent']).toBe(DEFAULT_ROLES_ENTITY_ACTIONS);
    expect(DEFAULT_IDENTITY_ENTITY_ACTIONS['Identity.UsersComponent']).toBe(DEFAULT_USERS_ENTITY_ACTIONS);
    expect(DEFAULT_IDENTITY_ENTITY_ACTIONS['Identity.OrganizationMembersComponent']).toBe(DEFAULT_ORGANIZATION_MEMBERS_ENTITY_ACTIONS);
    expect(DEFAULT_IDENTITY_ENTITY_ACTIONS['Identity.OrganizationRolesComponent']).toBe(DEFAULT_ORGANIZATION_ROLES_ENTITY_ACTIONS);
  });
});

describe('Toolbar Actions', () => {
  it('should have Claims toolbar actions', () => {
    expect(Array.isArray(DEFAULT_CLAIMS_TOOLBAR_ACTIONS)).toBe(true);
    const actionTexts = DEFAULT_CLAIMS_TOOLBAR_ACTIONS.map(a => a.text);
    expect(actionTexts).toContain('AbpIdentity::NewClaimType');
  });

  it('should have Roles toolbar actions', () => {
    expect(Array.isArray(DEFAULT_ROLES_TOOLBAR_ACTIONS)).toBe(true);
    const actionTexts = DEFAULT_ROLES_TOOLBAR_ACTIONS.map(a => a.text);
    expect(actionTexts).toContain('AbpIdentity::NewRole');
  });

  it('should have Users toolbar actions', () => {
    expect(Array.isArray(DEFAULT_USERS_TOOLBAR_ACTIONS)).toBe(true);
    const actionTexts = DEFAULT_USERS_TOOLBAR_ACTIONS.map(a => a.text);
    expect(actionTexts).toContain('AbpIdentity::NewUser');
  });

  it('should have OrganizationUnits toolbar actions', () => {
    expect(Array.isArray(DEFAULT_ORGANIZATION_UNITS_TOOLBAR_ACTIONS)).toBe(true);
    const actionTexts = DEFAULT_ORGANIZATION_UNITS_TOOLBAR_ACTIONS.map(a => a.text);
    expect(actionTexts).toContain('AbpIdentity::NewOrganizationUnit');
  });

  it('should have combined DEFAULT_IDENTITY_TOOLBAR_ACTIONS', () => {
    expect(DEFAULT_IDENTITY_TOOLBAR_ACTIONS['Identity.ClaimsComponent']).toBe(DEFAULT_CLAIMS_TOOLBAR_ACTIONS);
    expect(DEFAULT_IDENTITY_TOOLBAR_ACTIONS['Identity.RolesComponent']).toBe(DEFAULT_ROLES_TOOLBAR_ACTIONS);
    expect(DEFAULT_IDENTITY_TOOLBAR_ACTIONS['Identity.UsersComponent']).toBe(DEFAULT_USERS_TOOLBAR_ACTIONS);
    expect(DEFAULT_IDENTITY_TOOLBAR_ACTIONS['Identity.OrganizationUnitsComponent']).toBe(DEFAULT_ORGANIZATION_UNITS_TOOLBAR_ACTIONS);
  });
});

describe('Entity Props', () => {
  it('should have Claims entity props', () => {
    expect(Array.isArray(DEFAULT_CLAIMS_ENTITY_PROPS)).toBe(true);
    const propNames = DEFAULT_CLAIMS_ENTITY_PROPS.map(p => p.name);
    expect(propNames).toContain('name');
    expect(propNames).toContain('valueType');
    expect(propNames).toContain('regex');
    expect(propNames).toContain('required');
  });

  it('should have Roles entity props', () => {
    expect(Array.isArray(DEFAULT_ROLES_ENTITY_PROPS)).toBe(true);
    const propNames = DEFAULT_ROLES_ENTITY_PROPS.map(p => p.name);
    expect(propNames).toContain('name');
  });

  it('should have Users entity props', () => {
    expect(Array.isArray(DEFAULT_USERS_ENTITY_PROPS)).toBe(true);
    const propNames = DEFAULT_USERS_ENTITY_PROPS.map(p => p.name);
    expect(propNames).toContain('userName');
    expect(propNames).toContain('email');
    expect(propNames).toContain('phoneNumber');
  });

  it('should have OrganizationMembers entity props', () => {
    expect(Array.isArray(DEFAULT_ORGANIZATION_MEMBERS_ENTITY_PROPS)).toBe(true);
    const propNames = DEFAULT_ORGANIZATION_MEMBERS_ENTITY_PROPS.map(p => p.name);
    expect(propNames).toContain('userName');
    expect(propNames).toContain('email');
  });

  it('should have OrganizationRoles entity props', () => {
    expect(Array.isArray(DEFAULT_ORGANIZATION_ROLES_ENTITY_PROPS)).toBe(true);
    const propNames = DEFAULT_ORGANIZATION_ROLES_ENTITY_PROPS.map(p => p.name);
    expect(propNames).toContain('name');
  });

  it('should have combined DEFAULT_IDENTITY_ENTITY_PROPS', () => {
    expect(DEFAULT_IDENTITY_ENTITY_PROPS['Identity.ClaimsComponent']).toBe(DEFAULT_CLAIMS_ENTITY_PROPS);
    expect(DEFAULT_IDENTITY_ENTITY_PROPS['Identity.RolesComponent']).toBe(DEFAULT_ROLES_ENTITY_PROPS);
    expect(DEFAULT_IDENTITY_ENTITY_PROPS['Identity.UsersComponent']).toBe(DEFAULT_USERS_ENTITY_PROPS);
    expect(DEFAULT_IDENTITY_ENTITY_PROPS['Identity.OrganizationMembersComponent']).toBe(DEFAULT_ORGANIZATION_MEMBERS_ENTITY_PROPS);
    expect(DEFAULT_IDENTITY_ENTITY_PROPS['Identity.OrganizationRolesComponent']).toBe(DEFAULT_ORGANIZATION_ROLES_ENTITY_PROPS);
  });
});

describe('Form Props', () => {
  describe('Claims form props', () => {
    it('should have create form props', () => {
      expect(Array.isArray(DEFAULT_CLAIMS_CREATE_FORM_PROPS)).toBe(true);
      const propNames = DEFAULT_CLAIMS_CREATE_FORM_PROPS.map(p => p.name);
      expect(propNames).toContain('name');
      expect(propNames).toContain('valueType');
      expect(propNames).toContain('regex');
      expect(propNames).toContain('required');
      expect(propNames).toContain('description');
    });

    it('should have edit form props', () => {
      expect(Array.isArray(DEFAULT_CLAIMS_EDIT_FORM_PROPS)).toBe(true);
      expect(DEFAULT_CLAIMS_EDIT_FORM_PROPS.length).toBeGreaterThan(0);
    });
  });

  describe('Roles form props', () => {
    it('should have create form props', () => {
      expect(Array.isArray(DEFAULT_ROLES_CREATE_FORM_PROPS)).toBe(true);
      const propNames = DEFAULT_ROLES_CREATE_FORM_PROPS.map(p => p.name);
      expect(propNames).toContain('name');
      expect(propNames).toContain('isDefault');
      expect(propNames).toContain('isPublic');
    });

    it('should have edit form props', () => {
      expect(Array.isArray(DEFAULT_ROLES_EDIT_FORM_PROPS)).toBe(true);
      expect(DEFAULT_ROLES_EDIT_FORM_PROPS.length).toBeGreaterThan(0);
    });
  });

  describe('Users form props', () => {
    it('should have create form props', () => {
      expect(Array.isArray(DEFAULT_USERS_CREATE_FORM_PROPS)).toBe(true);
      const propNames = DEFAULT_USERS_CREATE_FORM_PROPS.map(p => p.name);
      expect(propNames).toContain('userName');
      expect(propNames).toContain('email');
      expect(propNames).toContain('password');
    });

    it('should have edit form props', () => {
      expect(Array.isArray(DEFAULT_USERS_EDIT_FORM_PROPS)).toBe(true);
      const propNames = DEFAULT_USERS_EDIT_FORM_PROPS.map(p => p.name);
      expect(propNames).toContain('userName');
      expect(propNames).toContain('email');
      // password is not in edit form props
      expect(propNames).not.toContain('password');
    });
  });

  describe('Combined form props', () => {
    it('should have combined create form props', () => {
      expect(DEFAULT_IDENTITY_CREATE_FORM_PROPS['Identity.ClaimsComponent']).toBe(DEFAULT_CLAIMS_CREATE_FORM_PROPS);
      expect(DEFAULT_IDENTITY_CREATE_FORM_PROPS['Identity.RolesComponent']).toBe(DEFAULT_ROLES_CREATE_FORM_PROPS);
      expect(DEFAULT_IDENTITY_CREATE_FORM_PROPS['Identity.UsersComponent']).toBe(DEFAULT_USERS_CREATE_FORM_PROPS);
    });

    it('should have combined edit form props', () => {
      expect(DEFAULT_IDENTITY_EDIT_FORM_PROPS['Identity.ClaimsComponent']).toBe(DEFAULT_CLAIMS_EDIT_FORM_PROPS);
      expect(DEFAULT_IDENTITY_EDIT_FORM_PROPS['Identity.RolesComponent']).toBe(DEFAULT_ROLES_EDIT_FORM_PROPS);
      expect(DEFAULT_IDENTITY_EDIT_FORM_PROPS['Identity.UsersComponent']).toBe(DEFAULT_USERS_EDIT_FORM_PROPS);
    });
  });
});

describe('Token Symbols', () => {
  it('should have IDENTITY_ENTITY_ACTION_CONTRIBUTORS symbol', () => {
    expect(typeof IDENTITY_ENTITY_ACTION_CONTRIBUTORS).toBe('symbol');
    expect(IDENTITY_ENTITY_ACTION_CONTRIBUTORS.toString()).toContain('IDENTITY_ENTITY_ACTION_CONTRIBUTORS');
  });

  it('should have IDENTITY_TOOLBAR_ACTION_CONTRIBUTORS symbol', () => {
    expect(typeof IDENTITY_TOOLBAR_ACTION_CONTRIBUTORS).toBe('symbol');
    expect(IDENTITY_TOOLBAR_ACTION_CONTRIBUTORS.toString()).toContain('IDENTITY_TOOLBAR_ACTION_CONTRIBUTORS');
  });

  it('should have IDENTITY_ENTITY_PROP_CONTRIBUTORS symbol', () => {
    expect(typeof IDENTITY_ENTITY_PROP_CONTRIBUTORS).toBe('symbol');
    expect(IDENTITY_ENTITY_PROP_CONTRIBUTORS.toString()).toContain('IDENTITY_ENTITY_PROP_CONTRIBUTORS');
  });

  it('should have IDENTITY_CREATE_FORM_PROP_CONTRIBUTORS symbol', () => {
    expect(typeof IDENTITY_CREATE_FORM_PROP_CONTRIBUTORS).toBe('symbol');
    expect(IDENTITY_CREATE_FORM_PROP_CONTRIBUTORS.toString()).toContain('IDENTITY_CREATE_FORM_PROP_CONTRIBUTORS');
  });

  it('should have IDENTITY_EDIT_FORM_PROP_CONTRIBUTORS symbol', () => {
    expect(typeof IDENTITY_EDIT_FORM_PROP_CONTRIBUTORS).toBe('symbol');
    expect(IDENTITY_EDIT_FORM_PROP_CONTRIBUTORS.toString()).toContain('IDENTITY_EDIT_FORM_PROP_CONTRIBUTORS');
  });

  it('should have unique symbols', () => {
    const symbols = [
      IDENTITY_ENTITY_ACTION_CONTRIBUTORS,
      IDENTITY_TOOLBAR_ACTION_CONTRIBUTORS,
      IDENTITY_ENTITY_PROP_CONTRIBUTORS,
      IDENTITY_CREATE_FORM_PROP_CONTRIBUTORS,
      IDENTITY_EDIT_FORM_PROP_CONTRIBUTORS,
    ];
    const uniqueSymbols = new Set(symbols);
    expect(uniqueSymbols.size).toBe(symbols.length);
  });
});

describe('Type exports', () => {
  it('should have EntityAction type', () => {
    const action: EntityAction<{ id: string }> = {
      text: 'Test',
      icon: 'fa-test',
    };
    expect(action.text).toBe('Test');
  });

  it('should have ToolbarAction type', () => {
    const action: ToolbarAction<{ id: string }[]> = {
      text: 'Test',
      icon: 'fa-test',
    };
    expect(action.text).toBe('Test');
  });

  it('should have EntityProp type', () => {
    const prop: EntityProp<{ name: string }> = {
      type: 'string',
      name: 'name',
      displayName: 'Name',
    };
    expect(prop.name).toBe('name');
  });

  it('should have FormProp type', () => {
    const prop: FormProp<{ name: string }> = {
      type: 'string',
      name: 'name',
      displayName: 'Name',
    };
    expect(prop.name).toBe('name');
  });
});
