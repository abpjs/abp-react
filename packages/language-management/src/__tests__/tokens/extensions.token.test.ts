/**
 * Tests for Language Management Extension Tokens
 * @abpjs/language-management v3.0.0
 */
import { describe, it, expect } from 'vitest';
import {
  // Default Entity Actions
  DEFAULT_LANGUAGES_ENTITY_ACTIONS,
  DEFAULT_LANGUAGE_TEXTS_ENTITY_ACTIONS,
  DEFAULT_LANGUAGE_MANAGEMENT_ENTITY_ACTIONS,
  // Default Toolbar Actions
  DEFAULT_LANGUAGES_TOOLBAR_ACTIONS,
  DEFAULT_LANGUAGE_TEXTS_TOOLBAR_ACTIONS,
  DEFAULT_LANGUAGE_MANAGEMENT_TOOLBAR_ACTIONS,
  // Default Entity Props
  DEFAULT_LANGUAGES_ENTITY_PROPS,
  DEFAULT_LANGUAGE_MANAGEMENT_ENTITY_PROPS,
  // Default Form Props
  DEFAULT_LANGUAGES_CREATE_FORM_PROPS,
  DEFAULT_LANGUAGES_EDIT_FORM_PROPS,
  DEFAULT_LANGUAGE_MANAGEMENT_CREATE_FORM_PROPS,
  DEFAULT_LANGUAGE_MANAGEMENT_EDIT_FORM_PROPS,
  // Token Symbols
  LANGUAGE_MANAGEMENT_ENTITY_ACTION_CONTRIBUTORS,
  LANGUAGE_MANAGEMENT_TOOLBAR_ACTION_CONTRIBUTORS,
  LANGUAGE_MANAGEMENT_ENTITY_PROP_CONTRIBUTORS,
  LANGUAGE_MANAGEMENT_CREATE_FORM_PROP_CONTRIBUTORS,
  LANGUAGE_MANAGEMENT_EDIT_FORM_PROP_CONTRIBUTORS,
  // Types
  type EntityAction,
  type ToolbarAction,
  type EntityProp,
  type FormProp,
} from '../../tokens/extensions.token';

describe('DEFAULT_LANGUAGES_ENTITY_ACTIONS', () => {
  it('should be an array', () => {
    expect(Array.isArray(DEFAULT_LANGUAGES_ENTITY_ACTIONS)).toBe(true);
  });

  it('should have 3 actions', () => {
    expect(DEFAULT_LANGUAGES_ENTITY_ACTIONS).toHaveLength(3);
  });

  it('should have Edit action', () => {
    const editAction = DEFAULT_LANGUAGES_ENTITY_ACTIONS.find((a) => a.text === 'LanguageManagement::Edit');
    expect(editAction).toBeDefined();
    expect(editAction?.permission).toBe('LanguageManagement.Languages.Edit');
    expect(editAction?.icon).toBe('fa fa-pencil');
  });

  it('should have SetAsDefault action', () => {
    const setDefaultAction = DEFAULT_LANGUAGES_ENTITY_ACTIONS.find(
      (a) => a.text === 'LanguageManagement::SetAsDefault'
    );
    expect(setDefaultAction).toBeDefined();
    expect(setDefaultAction?.permission).toBe('LanguageManagement.Languages.SetAsDefault');
    expect(setDefaultAction?.icon).toBe('fa fa-star');
  });

  it('should have Delete action', () => {
    const deleteAction = DEFAULT_LANGUAGES_ENTITY_ACTIONS.find((a) => a.text === 'LanguageManagement::Delete');
    expect(deleteAction).toBeDefined();
    expect(deleteAction?.permission).toBe('LanguageManagement.Languages.Delete');
    expect(deleteAction?.icon).toBe('fa fa-trash');
  });
});

describe('DEFAULT_LANGUAGE_TEXTS_ENTITY_ACTIONS', () => {
  it('should be an array', () => {
    expect(Array.isArray(DEFAULT_LANGUAGE_TEXTS_ENTITY_ACTIONS)).toBe(true);
  });

  it('should have 2 actions', () => {
    expect(DEFAULT_LANGUAGE_TEXTS_ENTITY_ACTIONS).toHaveLength(2);
  });

  it('should have Edit action', () => {
    const editAction = DEFAULT_LANGUAGE_TEXTS_ENTITY_ACTIONS.find((a) => a.text === 'LanguageManagement::Edit');
    expect(editAction).toBeDefined();
    expect(editAction?.permission).toBe('LanguageManagement.LanguageTexts.Edit');
  });

  it('should have Restore action', () => {
    const restoreAction = DEFAULT_LANGUAGE_TEXTS_ENTITY_ACTIONS.find(
      (a) => a.text === 'LanguageManagement::Restore'
    );
    expect(restoreAction).toBeDefined();
    expect(restoreAction?.permission).toBe('LanguageManagement.LanguageTexts.Edit');
    expect(restoreAction?.icon).toBe('fa fa-undo');
  });
});

describe('DEFAULT_LANGUAGE_MANAGEMENT_ENTITY_ACTIONS', () => {
  it('should have LanguagesComponent key', () => {
    expect(DEFAULT_LANGUAGE_MANAGEMENT_ENTITY_ACTIONS['LanguageManagement.LanguagesComponent']).toBe(
      DEFAULT_LANGUAGES_ENTITY_ACTIONS
    );
  });

  it('should have LanguageTextsComponent key', () => {
    expect(DEFAULT_LANGUAGE_MANAGEMENT_ENTITY_ACTIONS['LanguageManagement.LanguageTextsComponent']).toBe(
      DEFAULT_LANGUAGE_TEXTS_ENTITY_ACTIONS
    );
  });
});

describe('DEFAULT_LANGUAGES_TOOLBAR_ACTIONS', () => {
  it('should be an array', () => {
    expect(Array.isArray(DEFAULT_LANGUAGES_TOOLBAR_ACTIONS)).toBe(true);
  });

  it('should have 1 action', () => {
    expect(DEFAULT_LANGUAGES_TOOLBAR_ACTIONS).toHaveLength(1);
  });

  it('should have NewLanguage action', () => {
    const newAction = DEFAULT_LANGUAGES_TOOLBAR_ACTIONS[0];
    expect(newAction.text).toBe('LanguageManagement::NewLanguage');
    expect(newAction.permission).toBe('LanguageManagement.Languages.Create');
    expect(newAction.icon).toBe('fa fa-plus');
  });
});

describe('DEFAULT_LANGUAGE_TEXTS_TOOLBAR_ACTIONS', () => {
  it('should be an empty array', () => {
    expect(DEFAULT_LANGUAGE_TEXTS_TOOLBAR_ACTIONS).toHaveLength(0);
  });
});

describe('DEFAULT_LANGUAGE_MANAGEMENT_TOOLBAR_ACTIONS', () => {
  it('should have LanguagesComponent key', () => {
    expect(DEFAULT_LANGUAGE_MANAGEMENT_TOOLBAR_ACTIONS['LanguageManagement.LanguagesComponent']).toBe(
      DEFAULT_LANGUAGES_TOOLBAR_ACTIONS
    );
  });

  it('should have LanguageTextsComponent key', () => {
    expect(DEFAULT_LANGUAGE_MANAGEMENT_TOOLBAR_ACTIONS['LanguageManagement.LanguageTextsComponent']).toBe(
      DEFAULT_LANGUAGE_TEXTS_TOOLBAR_ACTIONS
    );
  });
});

describe('DEFAULT_LANGUAGES_ENTITY_PROPS', () => {
  it('should be an array', () => {
    expect(Array.isArray(DEFAULT_LANGUAGES_ENTITY_PROPS)).toBe(true);
  });

  it('should have 5 props', () => {
    expect(DEFAULT_LANGUAGES_ENTITY_PROPS).toHaveLength(5);
  });

  it('should have displayName prop', () => {
    const prop = DEFAULT_LANGUAGES_ENTITY_PROPS.find((p) => p.name === 'displayName');
    expect(prop).toBeDefined();
    expect(prop?.type).toBe('string');
    expect(prop?.sortable).toBe(true);
  });

  it('should have cultureName prop', () => {
    const prop = DEFAULT_LANGUAGES_ENTITY_PROPS.find((p) => p.name === 'cultureName');
    expect(prop).toBeDefined();
    expect(prop?.type).toBe('string');
    expect(prop?.sortable).toBe(true);
  });

  it('should have uiCultureName prop', () => {
    const prop = DEFAULT_LANGUAGES_ENTITY_PROPS.find((p) => p.name === 'uiCultureName');
    expect(prop).toBeDefined();
    expect(prop?.type).toBe('string');
  });

  it('should have isEnabled prop', () => {
    const prop = DEFAULT_LANGUAGES_ENTITY_PROPS.find((p) => p.name === 'isEnabled');
    expect(prop).toBeDefined();
    expect(prop?.type).toBe('boolean');
    expect(prop?.sortable).toBe(false);
  });

  it('should have isDefaultLanguage prop', () => {
    const prop = DEFAULT_LANGUAGES_ENTITY_PROPS.find((p) => p.name === 'isDefaultLanguage');
    expect(prop).toBeDefined();
    expect(prop?.type).toBe('boolean');
  });
});

describe('DEFAULT_LANGUAGE_MANAGEMENT_ENTITY_PROPS', () => {
  it('should have LanguagesComponent key', () => {
    expect(DEFAULT_LANGUAGE_MANAGEMENT_ENTITY_PROPS['LanguageManagement.LanguagesComponent']).toBe(
      DEFAULT_LANGUAGES_ENTITY_PROPS
    );
  });
});

describe('DEFAULT_LANGUAGES_CREATE_FORM_PROPS', () => {
  it('should be an array', () => {
    expect(Array.isArray(DEFAULT_LANGUAGES_CREATE_FORM_PROPS)).toBe(true);
  });

  it('should have 5 props', () => {
    expect(DEFAULT_LANGUAGES_CREATE_FORM_PROPS).toHaveLength(5);
  });

  it('should have cultureName prop', () => {
    const prop = DEFAULT_LANGUAGES_CREATE_FORM_PROPS.find((p) => p.name === 'cultureName');
    expect(prop).toBeDefined();
    expect(prop?.type).toBe('select');
  });

  it('should have uiCultureName prop', () => {
    const prop = DEFAULT_LANGUAGES_CREATE_FORM_PROPS.find((p) => p.name === 'uiCultureName');
    expect(prop).toBeDefined();
    expect(prop?.type).toBe('select');
  });

  it('should have displayName prop', () => {
    const prop = DEFAULT_LANGUAGES_CREATE_FORM_PROPS.find((p) => p.name === 'displayName');
    expect(prop).toBeDefined();
    expect(prop?.type).toBe('string');
  });

  it('should have flagIcon prop', () => {
    const prop = DEFAULT_LANGUAGES_CREATE_FORM_PROPS.find((p) => p.name === 'flagIcon');
    expect(prop).toBeDefined();
    expect(prop?.type).toBe('select');
  });

  it('should have isEnabled prop', () => {
    const prop = DEFAULT_LANGUAGES_CREATE_FORM_PROPS.find((p) => p.name === 'isEnabled');
    expect(prop).toBeDefined();
    expect(prop?.type).toBe('boolean');
  });
});

describe('DEFAULT_LANGUAGES_EDIT_FORM_PROPS', () => {
  it('should be an array', () => {
    expect(Array.isArray(DEFAULT_LANGUAGES_EDIT_FORM_PROPS)).toBe(true);
  });

  it('should have 3 props', () => {
    expect(DEFAULT_LANGUAGES_EDIT_FORM_PROPS).toHaveLength(3);
  });

  it('should have displayName, flagIcon, isEnabled props', () => {
    const names = DEFAULT_LANGUAGES_EDIT_FORM_PROPS.map((p) => p.name);
    expect(names).toContain('displayName');
    expect(names).toContain('flagIcon');
    expect(names).toContain('isEnabled');
  });

  it('should NOT have cultureName or uiCultureName props (read-only in edit)', () => {
    const names = DEFAULT_LANGUAGES_EDIT_FORM_PROPS.map((p) => p.name);
    expect(names).not.toContain('cultureName');
    expect(names).not.toContain('uiCultureName');
  });
});

describe('DEFAULT_LANGUAGE_MANAGEMENT_CREATE_FORM_PROPS', () => {
  it('should have LanguagesComponent key', () => {
    expect(DEFAULT_LANGUAGE_MANAGEMENT_CREATE_FORM_PROPS['LanguageManagement.LanguagesComponent']).toBe(
      DEFAULT_LANGUAGES_CREATE_FORM_PROPS
    );
  });
});

describe('DEFAULT_LANGUAGE_MANAGEMENT_EDIT_FORM_PROPS', () => {
  it('should have LanguagesComponent key', () => {
    expect(DEFAULT_LANGUAGE_MANAGEMENT_EDIT_FORM_PROPS['LanguageManagement.LanguagesComponent']).toBe(
      DEFAULT_LANGUAGES_EDIT_FORM_PROPS
    );
  });
});

describe('Token Symbols', () => {
  it('LANGUAGE_MANAGEMENT_ENTITY_ACTION_CONTRIBUTORS should be a symbol', () => {
    expect(typeof LANGUAGE_MANAGEMENT_ENTITY_ACTION_CONTRIBUTORS).toBe('symbol');
    expect(LANGUAGE_MANAGEMENT_ENTITY_ACTION_CONTRIBUTORS.toString()).toContain(
      'LANGUAGE_MANAGEMENT_ENTITY_ACTION_CONTRIBUTORS'
    );
  });

  it('LANGUAGE_MANAGEMENT_TOOLBAR_ACTION_CONTRIBUTORS should be a symbol', () => {
    expect(typeof LANGUAGE_MANAGEMENT_TOOLBAR_ACTION_CONTRIBUTORS).toBe('symbol');
    expect(LANGUAGE_MANAGEMENT_TOOLBAR_ACTION_CONTRIBUTORS.toString()).toContain(
      'LANGUAGE_MANAGEMENT_TOOLBAR_ACTION_CONTRIBUTORS'
    );
  });

  it('LANGUAGE_MANAGEMENT_ENTITY_PROP_CONTRIBUTORS should be a symbol', () => {
    expect(typeof LANGUAGE_MANAGEMENT_ENTITY_PROP_CONTRIBUTORS).toBe('symbol');
    expect(LANGUAGE_MANAGEMENT_ENTITY_PROP_CONTRIBUTORS.toString()).toContain(
      'LANGUAGE_MANAGEMENT_ENTITY_PROP_CONTRIBUTORS'
    );
  });

  it('LANGUAGE_MANAGEMENT_CREATE_FORM_PROP_CONTRIBUTORS should be a symbol', () => {
    expect(typeof LANGUAGE_MANAGEMENT_CREATE_FORM_PROP_CONTRIBUTORS).toBe('symbol');
    expect(LANGUAGE_MANAGEMENT_CREATE_FORM_PROP_CONTRIBUTORS.toString()).toContain(
      'LANGUAGE_MANAGEMENT_CREATE_FORM_PROP_CONTRIBUTORS'
    );
  });

  it('LANGUAGE_MANAGEMENT_EDIT_FORM_PROP_CONTRIBUTORS should be a symbol', () => {
    expect(typeof LANGUAGE_MANAGEMENT_EDIT_FORM_PROP_CONTRIBUTORS).toBe('symbol');
    expect(LANGUAGE_MANAGEMENT_EDIT_FORM_PROP_CONTRIBUTORS.toString()).toContain(
      'LANGUAGE_MANAGEMENT_EDIT_FORM_PROP_CONTRIBUTORS'
    );
  });

  it('all symbols should be unique', () => {
    const symbols = [
      LANGUAGE_MANAGEMENT_ENTITY_ACTION_CONTRIBUTORS,
      LANGUAGE_MANAGEMENT_TOOLBAR_ACTION_CONTRIBUTORS,
      LANGUAGE_MANAGEMENT_ENTITY_PROP_CONTRIBUTORS,
      LANGUAGE_MANAGEMENT_CREATE_FORM_PROP_CONTRIBUTORS,
      LANGUAGE_MANAGEMENT_EDIT_FORM_PROP_CONTRIBUTORS,
    ];
    const uniqueSymbols = new Set(symbols);
    expect(uniqueSymbols.size).toBe(symbols.length);
  });
});

describe('Type definitions', () => {
  it('EntityAction type should work correctly', () => {
    const action: EntityAction<{ id: string }> = {
      text: 'Test',
      permission: 'Test.Permission',
      icon: 'fa fa-test',
    };
    expect(action.text).toBe('Test');
  });

  it('ToolbarAction type should work correctly', () => {
    const action: ToolbarAction<{ id: string }[]> = {
      text: 'Test',
      permission: 'Test.Permission',
    };
    expect(action.text).toBe('Test');
  });

  it('EntityProp type should work correctly', () => {
    const prop: EntityProp<{ name: string }> = {
      type: 'string',
      name: 'name',
      displayName: 'Name',
      sortable: true,
    };
    expect(prop.name).toBe('name');
  });

  it('FormProp type should work correctly', () => {
    const prop: FormProp<{ name: string }> = {
      type: 'string',
      name: 'name',
      displayName: 'Name',
    };
    expect(prop.name).toBe('name');
  });
});
