/**
 * Tests for SaaS Extension Tokens
 * @abpjs/saas v3.0.0
 */
import { describe, it, expect } from 'vitest';
import {
  // Entity Actions
  DEFAULT_EDITIONS_ENTITY_ACTIONS,
  DEFAULT_TENANTS_ENTITY_ACTIONS,
  DEFAULT_SAAS_ENTITY_ACTIONS,
  // Toolbar Actions
  DEFAULT_EDITIONS_TOOLBAR_ACTIONS,
  DEFAULT_TENANTS_TOOLBAR_ACTIONS,
  DEFAULT_SAAS_TOOLBAR_ACTIONS,
  // Entity Props
  DEFAULT_EDITIONS_ENTITY_PROPS,
  DEFAULT_TENANTS_ENTITY_PROPS,
  DEFAULT_SAAS_ENTITY_PROPS,
  // Create Form Props
  DEFAULT_EDITIONS_CREATE_FORM_PROPS,
  DEFAULT_TENANTS_CREATE_FORM_PROPS,
  DEFAULT_SAAS_CREATE_FORM_PROPS,
  // Edit Form Props
  DEFAULT_EDITIONS_EDIT_FORM_PROPS,
  DEFAULT_TENANTS_EDIT_FORM_PROPS,
  DEFAULT_SAAS_EDIT_FORM_PROPS,
  // Contributor Symbols
  SAAS_ENTITY_ACTION_CONTRIBUTORS,
  SAAS_TOOLBAR_ACTION_CONTRIBUTORS,
  SAAS_ENTITY_PROP_CONTRIBUTORS,
  SAAS_CREATE_FORM_PROP_CONTRIBUTORS,
  SAAS_EDIT_FORM_PROP_CONTRIBUTORS,
  // Types
  type EntityAction,
  type ToolbarAction,
  type EntityProp,
  type FormProp,
} from '../../tokens/extensions.token';
import { eSaasComponents } from '../../enums/components';

describe('DEFAULT_EDITIONS_ENTITY_ACTIONS', () => {
  it('should be an array', () => {
    expect(Array.isArray(DEFAULT_EDITIONS_ENTITY_ACTIONS)).toBe(true);
  });

  it('should have 3 actions', () => {
    expect(DEFAULT_EDITIONS_ENTITY_ACTIONS).toHaveLength(3);
  });

  it('should have Edit action', () => {
    const editAction = DEFAULT_EDITIONS_ENTITY_ACTIONS.find(
      (a) => a.text === 'AbpUi::Edit',
    );
    expect(editAction).toBeDefined();
    expect(editAction?.permission).toBe('Saas.Editions.Update');
    expect(editAction?.icon).toBe('fa fa-edit');
  });

  it('should have ManageFeatures action', () => {
    const manageAction = DEFAULT_EDITIONS_ENTITY_ACTIONS.find(
      (a) => a.text === 'Saas::Permission:ManageFeatures',
    );
    expect(manageAction).toBeDefined();
    expect(manageAction?.permission).toBe('Saas.Editions.ManageFeatures');
  });

  it('should have Delete action', () => {
    const deleteAction = DEFAULT_EDITIONS_ENTITY_ACTIONS.find(
      (a) => a.text === 'AbpUi::Delete',
    );
    expect(deleteAction).toBeDefined();
    expect(deleteAction?.permission).toBe('Saas.Editions.Delete');
    expect(deleteAction?.icon).toBe('fa fa-trash');
  });
});

describe('DEFAULT_TENANTS_ENTITY_ACTIONS', () => {
  it('should be an array', () => {
    expect(Array.isArray(DEFAULT_TENANTS_ENTITY_ACTIONS)).toBe(true);
  });

  it('should have 4 actions', () => {
    expect(DEFAULT_TENANTS_ENTITY_ACTIONS).toHaveLength(4);
  });

  it('should have Edit action', () => {
    const editAction = DEFAULT_TENANTS_ENTITY_ACTIONS.find(
      (a) => a.text === 'AbpUi::Edit',
    );
    expect(editAction).toBeDefined();
    expect(editAction?.permission).toBe('Saas.Tenants.Update');
  });

  it('should have ConnectionStrings action', () => {
    const connStrAction = DEFAULT_TENANTS_ENTITY_ACTIONS.find(
      (a) => a.text === 'Saas::ConnectionStrings',
    );
    expect(connStrAction).toBeDefined();
    expect(connStrAction?.permission).toBe('Saas.Tenants.ManageConnectionStrings');
    expect(connStrAction?.icon).toBe('fa fa-database');
  });

  it('should have Delete action', () => {
    const deleteAction = DEFAULT_TENANTS_ENTITY_ACTIONS.find(
      (a) => a.text === 'AbpUi::Delete',
    );
    expect(deleteAction).toBeDefined();
    expect(deleteAction?.permission).toBe('Saas.Tenants.Delete');
  });
});

describe('DEFAULT_SAAS_ENTITY_ACTIONS', () => {
  it('should have Editions component key', () => {
    expect(DEFAULT_SAAS_ENTITY_ACTIONS[eSaasComponents.Editions]).toBe(
      DEFAULT_EDITIONS_ENTITY_ACTIONS,
    );
  });

  it('should have Tenants component key', () => {
    expect(DEFAULT_SAAS_ENTITY_ACTIONS[eSaasComponents.Tenants]).toBe(
      DEFAULT_TENANTS_ENTITY_ACTIONS,
    );
  });
});

describe('DEFAULT_EDITIONS_TOOLBAR_ACTIONS', () => {
  it('should have 1 action', () => {
    expect(DEFAULT_EDITIONS_TOOLBAR_ACTIONS).toHaveLength(1);
  });

  it('should have NewEdition action', () => {
    const newAction = DEFAULT_EDITIONS_TOOLBAR_ACTIONS[0];
    expect(newAction.text).toBe('Saas::NewEdition');
    expect(newAction.permission).toBe('Saas.Editions.Create');
    expect(newAction.icon).toBe('fa fa-plus');
  });
});

describe('DEFAULT_TENANTS_TOOLBAR_ACTIONS', () => {
  it('should have 1 action', () => {
    expect(DEFAULT_TENANTS_TOOLBAR_ACTIONS).toHaveLength(1);
  });

  it('should have NewTenant action', () => {
    const newAction = DEFAULT_TENANTS_TOOLBAR_ACTIONS[0];
    expect(newAction.text).toBe('Saas::NewTenant');
    expect(newAction.permission).toBe('Saas.Tenants.Create');
    expect(newAction.icon).toBe('fa fa-plus');
  });
});

describe('DEFAULT_SAAS_TOOLBAR_ACTIONS', () => {
  it('should have Editions component key', () => {
    expect(DEFAULT_SAAS_TOOLBAR_ACTIONS[eSaasComponents.Editions]).toBe(
      DEFAULT_EDITIONS_TOOLBAR_ACTIONS,
    );
  });

  it('should have Tenants component key', () => {
    expect(DEFAULT_SAAS_TOOLBAR_ACTIONS[eSaasComponents.Tenants]).toBe(
      DEFAULT_TENANTS_TOOLBAR_ACTIONS,
    );
  });
});

describe('DEFAULT_EDITIONS_ENTITY_PROPS', () => {
  it('should have 1 prop', () => {
    expect(DEFAULT_EDITIONS_ENTITY_PROPS).toHaveLength(1);
  });

  it('should have displayName prop', () => {
    const prop = DEFAULT_EDITIONS_ENTITY_PROPS[0];
    expect(prop.name).toBe('displayName');
    expect(prop.displayName).toBe('Saas::EditionName');
    expect(prop.sortable).toBe(true);
  });
});

describe('DEFAULT_TENANTS_ENTITY_PROPS', () => {
  it('should have 2 props', () => {
    expect(DEFAULT_TENANTS_ENTITY_PROPS).toHaveLength(2);
  });

  it('should have name prop', () => {
    const nameProp = DEFAULT_TENANTS_ENTITY_PROPS.find((p) => p.name === 'name');
    expect(nameProp).toBeDefined();
    expect(nameProp?.displayName).toBe('Saas::TenantName');
    expect(nameProp?.sortable).toBe(true);
  });

  it('should have editionName prop', () => {
    const editionProp = DEFAULT_TENANTS_ENTITY_PROPS.find(
      (p) => p.name === 'editionName',
    );
    expect(editionProp).toBeDefined();
    expect(editionProp?.displayName).toBe('Saas::EditionName');
    expect(editionProp?.sortable).toBe(false);
  });
});

describe('DEFAULT_SAAS_ENTITY_PROPS', () => {
  it('should have Editions component key', () => {
    expect(DEFAULT_SAAS_ENTITY_PROPS[eSaasComponents.Editions]).toBe(
      DEFAULT_EDITIONS_ENTITY_PROPS,
    );
  });

  it('should have Tenants component key', () => {
    expect(DEFAULT_SAAS_ENTITY_PROPS[eSaasComponents.Tenants]).toBe(
      DEFAULT_TENANTS_ENTITY_PROPS,
    );
  });
});

describe('DEFAULT_EDITIONS_CREATE_FORM_PROPS', () => {
  it('should have 1 prop', () => {
    expect(DEFAULT_EDITIONS_CREATE_FORM_PROPS).toHaveLength(1);
  });

  it('should have displayName prop with validators', () => {
    const prop = DEFAULT_EDITIONS_CREATE_FORM_PROPS[0];
    expect(prop.name).toBe('displayName');
    expect(prop.type).toBe('string');
    expect(prop.validators).toHaveLength(2);
    expect(prop.validators?.[0].type).toBe('required');
    expect(prop.validators?.[1].type).toBe('maxLength');
    expect(prop.validators?.[1].value).toBe(256);
  });
});

describe('DEFAULT_TENANTS_CREATE_FORM_PROPS', () => {
  it('should have 4 props', () => {
    expect(DEFAULT_TENANTS_CREATE_FORM_PROPS).toHaveLength(4);
  });

  it('should have name prop', () => {
    const nameProp = DEFAULT_TENANTS_CREATE_FORM_PROPS.find(
      (p) => p.name === 'name',
    );
    expect(nameProp).toBeDefined();
    expect(nameProp?.type).toBe('string');
  });

  it('should have editionId prop as select', () => {
    const editionProp = DEFAULT_TENANTS_CREATE_FORM_PROPS.find(
      (p) => p.name === 'editionId',
    );
    expect(editionProp).toBeDefined();
    expect(editionProp?.type).toBe('select');
  });

  it('should have adminEmailAddress prop with email validator', () => {
    const emailProp = DEFAULT_TENANTS_CREATE_FORM_PROPS.find(
      (p) => p.name === 'adminEmailAddress',
    );
    expect(emailProp).toBeDefined();
    const emailValidator = emailProp?.validators?.find((v) => v.type === 'email');
    expect(emailValidator).toBeDefined();
  });

  it('should have adminPassword prop', () => {
    const passwordProp = DEFAULT_TENANTS_CREATE_FORM_PROPS.find(
      (p) => p.name === 'adminPassword',
    );
    expect(passwordProp).toBeDefined();
    expect(passwordProp?.type).toBe('string');
  });
});

describe('DEFAULT_SAAS_CREATE_FORM_PROPS', () => {
  it('should have Editions component key', () => {
    expect(DEFAULT_SAAS_CREATE_FORM_PROPS[eSaasComponents.Editions]).toBe(
      DEFAULT_EDITIONS_CREATE_FORM_PROPS,
    );
  });

  it('should have Tenants component key', () => {
    expect(DEFAULT_SAAS_CREATE_FORM_PROPS[eSaasComponents.Tenants]).toBe(
      DEFAULT_TENANTS_CREATE_FORM_PROPS,
    );
  });
});

describe('DEFAULT_EDITIONS_EDIT_FORM_PROPS', () => {
  it('should have 1 prop', () => {
    expect(DEFAULT_EDITIONS_EDIT_FORM_PROPS).toHaveLength(1);
  });

  it('should have displayName prop', () => {
    const prop = DEFAULT_EDITIONS_EDIT_FORM_PROPS[0];
    expect(prop.name).toBe('displayName');
  });
});

describe('DEFAULT_TENANTS_EDIT_FORM_PROPS', () => {
  it('should have 2 props (no admin fields)', () => {
    expect(DEFAULT_TENANTS_EDIT_FORM_PROPS).toHaveLength(2);
  });

  it('should have name prop', () => {
    const nameProp = DEFAULT_TENANTS_EDIT_FORM_PROPS.find(
      (p) => p.name === 'name',
    );
    expect(nameProp).toBeDefined();
  });

  it('should have editionId prop', () => {
    const editionProp = DEFAULT_TENANTS_EDIT_FORM_PROPS.find(
      (p) => p.name === 'editionId',
    );
    expect(editionProp).toBeDefined();
  });

  it('should NOT have adminEmailAddress prop', () => {
    const emailProp = DEFAULT_TENANTS_EDIT_FORM_PROPS.find(
      (p) => p.name === 'adminEmailAddress',
    );
    expect(emailProp).toBeUndefined();
  });

  it('should NOT have adminPassword prop', () => {
    const passwordProp = DEFAULT_TENANTS_EDIT_FORM_PROPS.find(
      (p) => p.name === 'adminPassword',
    );
    expect(passwordProp).toBeUndefined();
  });
});

describe('DEFAULT_SAAS_EDIT_FORM_PROPS', () => {
  it('should have Editions component key', () => {
    expect(DEFAULT_SAAS_EDIT_FORM_PROPS[eSaasComponents.Editions]).toBe(
      DEFAULT_EDITIONS_EDIT_FORM_PROPS,
    );
  });

  it('should have Tenants component key', () => {
    expect(DEFAULT_SAAS_EDIT_FORM_PROPS[eSaasComponents.Tenants]).toBe(
      DEFAULT_TENANTS_EDIT_FORM_PROPS,
    );
  });
});

describe('Contributor Token Symbols', () => {
  it('should have SAAS_ENTITY_ACTION_CONTRIBUTORS as Symbol', () => {
    expect(typeof SAAS_ENTITY_ACTION_CONTRIBUTORS).toBe('symbol');
    expect(SAAS_ENTITY_ACTION_CONTRIBUTORS.toString()).toContain(
      'SAAS_ENTITY_ACTION_CONTRIBUTORS',
    );
  });

  it('should have SAAS_TOOLBAR_ACTION_CONTRIBUTORS as Symbol', () => {
    expect(typeof SAAS_TOOLBAR_ACTION_CONTRIBUTORS).toBe('symbol');
    expect(SAAS_TOOLBAR_ACTION_CONTRIBUTORS.toString()).toContain(
      'SAAS_TOOLBAR_ACTION_CONTRIBUTORS',
    );
  });

  it('should have SAAS_ENTITY_PROP_CONTRIBUTORS as Symbol', () => {
    expect(typeof SAAS_ENTITY_PROP_CONTRIBUTORS).toBe('symbol');
    expect(SAAS_ENTITY_PROP_CONTRIBUTORS.toString()).toContain(
      'SAAS_ENTITY_PROP_CONTRIBUTORS',
    );
  });

  it('should have SAAS_CREATE_FORM_PROP_CONTRIBUTORS as Symbol', () => {
    expect(typeof SAAS_CREATE_FORM_PROP_CONTRIBUTORS).toBe('symbol');
    expect(SAAS_CREATE_FORM_PROP_CONTRIBUTORS.toString()).toContain(
      'SAAS_CREATE_FORM_PROP_CONTRIBUTORS',
    );
  });

  it('should have SAAS_EDIT_FORM_PROP_CONTRIBUTORS as Symbol', () => {
    expect(typeof SAAS_EDIT_FORM_PROP_CONTRIBUTORS).toBe('symbol');
    expect(SAAS_EDIT_FORM_PROP_CONTRIBUTORS.toString()).toContain(
      'SAAS_EDIT_FORM_PROP_CONTRIBUTORS',
    );
  });

  it('should have unique symbols', () => {
    const symbols = [
      SAAS_ENTITY_ACTION_CONTRIBUTORS,
      SAAS_TOOLBAR_ACTION_CONTRIBUTORS,
      SAAS_ENTITY_PROP_CONTRIBUTORS,
      SAAS_CREATE_FORM_PROP_CONTRIBUTORS,
      SAAS_EDIT_FORM_PROP_CONTRIBUTORS,
    ];
    const uniqueSymbols = new Set(symbols);
    expect(uniqueSymbols.size).toBe(symbols.length);
  });
});

describe('Type interfaces', () => {
  it('EntityAction should have correct structure', () => {
    const action: EntityAction<{ id: string }> = {
      text: 'Test',
      permission: 'Test.Permission',
      icon: 'fa fa-test',
    };
    expect(action.text).toBe('Test');
    expect(action.permission).toBe('Test.Permission');
  });

  it('ToolbarAction should have correct structure', () => {
    const action: ToolbarAction<unknown[]> = {
      text: 'Test',
      permission: 'Test.Permission',
      icon: 'fa fa-test',
    };
    expect(action.text).toBe('Test');
  });

  it('EntityProp should have correct structure', () => {
    const prop: EntityProp<{ name: string }> = {
      name: 'name',
      displayName: 'Name',
      sortable: true,
    };
    expect(prop.name).toBe('name');
    expect(prop.sortable).toBe(true);
  });

  it('FormProp should have correct structure', () => {
    const prop: FormProp<unknown> = {
      name: 'email',
      displayName: 'Email',
      type: 'string',
      validators: [{ type: 'required' }, { type: 'email' }],
    };
    expect(prop.name).toBe('email');
    expect(prop.validators).toHaveLength(2);
  });

  it('FormProp should support visible as function', () => {
    const prop: FormProp<{ isAdmin: boolean }> = {
      name: 'adminField',
      visible: (record) => record?.isAdmin ?? false,
    };
    expect(typeof prop.visible).toBe('function');
    if (typeof prop.visible === 'function') {
      expect(prop.visible({ isAdmin: true })).toBe(true);
      expect(prop.visible({ isAdmin: false })).toBe(false);
    }
  });
});
