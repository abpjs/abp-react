/**
 * Tests for extensions.token.ts
 * @since 3.0.0
 */
import { describe, it, expect } from 'vitest';
import {
  // Entity Action types and defaults
  EntityAction,
  DEFAULT_TEXT_TEMPLATES_ENTITY_ACTIONS,
  DEFAULT_TEXT_TEMPLATE_MANAGEMENT_ENTITY_ACTIONS,
  // Toolbar Action types and defaults
  ToolbarAction,
  DEFAULT_TEXT_TEMPLATES_TOOLBAR_ACTIONS,
  DEFAULT_TEXT_TEMPLATE_MANAGEMENT_TOOLBAR_ACTIONS,
  // Entity Prop types and defaults
  EntityProp,
  DEFAULT_TEXT_TEMPLATES_ENTITY_PROPS,
  DEFAULT_TEXT_TEMPLATE_MANAGEMENT_ENTITY_PROPS,
  // Contributor callback types
  EntityActionContributorCallback,
  ToolbarActionContributorCallback,
  EntityPropContributorCallback,
  // Contributor token symbols
  TEXT_TEMPLATE_MANAGEMENT_ENTITY_ACTION_CONTRIBUTORS,
  TEXT_TEMPLATE_MANAGEMENT_TOOLBAR_ACTION_CONTRIBUTORS,
  TEXT_TEMPLATE_MANAGEMENT_ENTITY_PROP_CONTRIBUTORS,
} from '../../tokens/extensions.token';
import { eTextTemplateManagementComponents } from '../../enums/components';

describe('Extension Tokens', () => {
  describe('EntityAction Interface', () => {
    it('should allow creating valid entity actions', () => {
      const action: EntityAction<{ id: string }> = {
        text: 'Edit',
        icon: 'fa fa-edit',
        permission: 'TextTemplateManagement.TextTemplates.Edit',
        action: (record) => console.log(record.id),
        visible: (record) => !!record.id,
      };

      expect(action.text).toBe('Edit');
      expect(action.icon).toBe('fa fa-edit');
      expect(action.permission).toBeDefined();
    });

    it('should allow minimal entity action', () => {
      const action: EntityAction = {
        text: 'View',
      };

      expect(action.text).toBe('View');
      expect(action.action).toBeUndefined();
    });
  });

  describe('ToolbarAction Interface', () => {
    it('should allow creating valid toolbar actions', () => {
      const action: ToolbarAction<unknown[]> = {
        text: 'Add New',
        icon: 'fa fa-plus',
        permission: 'TextTemplateManagement.TextTemplates.Create',
      };

      expect(action.text).toBe('Add New');
      expect(action.icon).toBe('fa fa-plus');
    });
  });

  describe('EntityProp Interface', () => {
    it('should allow creating valid entity props', () => {
      const prop: EntityProp<{ name: string }> = {
        name: 'name',
        displayName: 'Name',
        sortable: true,
        valueResolver: (record) => record.name,
      };

      expect(prop.name).toBe('name');
      expect(prop.sortable).toBe(true);
    });
  });

  describe('DEFAULT_TEXT_TEMPLATES_ENTITY_ACTIONS', () => {
    it('should be an array', () => {
      expect(Array.isArray(DEFAULT_TEXT_TEMPLATES_ENTITY_ACTIONS)).toBe(true);
    });

    it('should have at least one action', () => {
      expect(DEFAULT_TEXT_TEMPLATES_ENTITY_ACTIONS.length).toBeGreaterThan(0);
    });

    it('should have EditContents action', () => {
      const editAction = DEFAULT_TEXT_TEMPLATES_ENTITY_ACTIONS.find(
        (a) => a.text === 'TextTemplateManagement::EditContents',
      );
      expect(editAction).toBeDefined();
    });

    it('should have correct permission on EditContents action', () => {
      const editAction = DEFAULT_TEXT_TEMPLATES_ENTITY_ACTIONS.find(
        (a) => a.text === 'TextTemplateManagement::EditContents',
      );
      expect(editAction?.permission).toBe(
        'TextTemplateManagement.TextTemplates.EditContents',
      );
    });

    it('should have icon on EditContents action', () => {
      const editAction = DEFAULT_TEXT_TEMPLATES_ENTITY_ACTIONS.find(
        (a) => a.text === 'TextTemplateManagement::EditContents',
      );
      expect(editAction?.icon).toBe('fa fa-edit');
    });
  });

  describe('DEFAULT_TEXT_TEMPLATE_MANAGEMENT_ENTITY_ACTIONS', () => {
    it('should have TextTemplates component key', () => {
      expect(
        DEFAULT_TEXT_TEMPLATE_MANAGEMENT_ENTITY_ACTIONS[
          eTextTemplateManagementComponents.TextTemplates
        ],
      ).toBeDefined();
    });

    it('should map to DEFAULT_TEXT_TEMPLATES_ENTITY_ACTIONS', () => {
      expect(
        DEFAULT_TEXT_TEMPLATE_MANAGEMENT_ENTITY_ACTIONS[
          eTextTemplateManagementComponents.TextTemplates
        ],
      ).toBe(DEFAULT_TEXT_TEMPLATES_ENTITY_ACTIONS);
    });
  });

  describe('DEFAULT_TEXT_TEMPLATES_TOOLBAR_ACTIONS', () => {
    it('should be an array', () => {
      expect(Array.isArray(DEFAULT_TEXT_TEMPLATES_TOOLBAR_ACTIONS)).toBe(true);
    });

    it('should be empty (text templates are code-defined)', () => {
      expect(DEFAULT_TEXT_TEMPLATES_TOOLBAR_ACTIONS).toHaveLength(0);
    });
  });

  describe('DEFAULT_TEXT_TEMPLATE_MANAGEMENT_TOOLBAR_ACTIONS', () => {
    it('should have TextTemplates component key', () => {
      expect(
        DEFAULT_TEXT_TEMPLATE_MANAGEMENT_TOOLBAR_ACTIONS[
          eTextTemplateManagementComponents.TextTemplates
        ],
      ).toBeDefined();
    });

    it('should map to DEFAULT_TEXT_TEMPLATES_TOOLBAR_ACTIONS', () => {
      expect(
        DEFAULT_TEXT_TEMPLATE_MANAGEMENT_TOOLBAR_ACTIONS[
          eTextTemplateManagementComponents.TextTemplates
        ],
      ).toBe(DEFAULT_TEXT_TEMPLATES_TOOLBAR_ACTIONS);
    });
  });

  describe('DEFAULT_TEXT_TEMPLATES_ENTITY_PROPS', () => {
    it('should be an array', () => {
      expect(Array.isArray(DEFAULT_TEXT_TEMPLATES_ENTITY_PROPS)).toBe(true);
    });

    it('should have name prop', () => {
      const nameProp = DEFAULT_TEXT_TEMPLATES_ENTITY_PROPS.find(
        (p) => p.name === 'name',
      );
      expect(nameProp).toBeDefined();
      expect(nameProp?.sortable).toBe(true);
    });

    it('should have displayName prop', () => {
      const displayNameProp = DEFAULT_TEXT_TEMPLATES_ENTITY_PROPS.find(
        (p) => p.name === 'displayName',
      );
      expect(displayNameProp).toBeDefined();
      expect(displayNameProp?.sortable).toBe(true);
    });

    it('should have layout prop', () => {
      const layoutProp = DEFAULT_TEXT_TEMPLATES_ENTITY_PROPS.find(
        (p) => p.name === 'layout',
      );
      expect(layoutProp).toBeDefined();
      expect(layoutProp?.sortable).toBe(false);
    });

    it('should have defaultCultureName prop', () => {
      const cultureProp = DEFAULT_TEXT_TEMPLATES_ENTITY_PROPS.find(
        (p) => p.name === 'defaultCultureName',
      );
      expect(cultureProp).toBeDefined();
    });

    it('should have 4 props total', () => {
      expect(DEFAULT_TEXT_TEMPLATES_ENTITY_PROPS).toHaveLength(4);
    });
  });

  describe('DEFAULT_TEXT_TEMPLATE_MANAGEMENT_ENTITY_PROPS', () => {
    it('should have TextTemplates component key', () => {
      expect(
        DEFAULT_TEXT_TEMPLATE_MANAGEMENT_ENTITY_PROPS[
          eTextTemplateManagementComponents.TextTemplates
        ],
      ).toBeDefined();
    });

    it('should map to DEFAULT_TEXT_TEMPLATES_ENTITY_PROPS', () => {
      expect(
        DEFAULT_TEXT_TEMPLATE_MANAGEMENT_ENTITY_PROPS[
          eTextTemplateManagementComponents.TextTemplates
        ],
      ).toBe(DEFAULT_TEXT_TEMPLATES_ENTITY_PROPS);
    });
  });

  describe('Contributor Callback Types', () => {
    it('should allow EntityActionContributorCallback', () => {
      const contributor: EntityActionContributorCallback<{
        id: string;
      }> = (actions) => {
        return [...actions, { text: 'Custom Action' }];
      };

      const result = contributor([{ text: 'Original' }]);
      expect(result).toHaveLength(2);
    });

    it('should allow ToolbarActionContributorCallback', () => {
      const contributor: ToolbarActionContributorCallback<unknown[]> = (
        actions,
      ) => {
        return actions.filter((a) => a.text !== 'Remove');
      };

      const result = contributor([{ text: 'Keep' }, { text: 'Remove' }]);
      expect(result).toHaveLength(1);
    });

    it('should allow EntityPropContributorCallback', () => {
      const contributor: EntityPropContributorCallback<{
        name: string;
      }> = (props) => {
        return props.map((p) => ({ ...p, sortable: false }));
      };

      const result = contributor([{ name: 'test', sortable: true }]);
      expect(result[0].sortable).toBe(false);
    });
  });

  describe('Contributor Token Symbols', () => {
    it('should have unique entity action contributors symbol', () => {
      expect(typeof TEXT_TEMPLATE_MANAGEMENT_ENTITY_ACTION_CONTRIBUTORS).toBe(
        'symbol',
      );
      expect(
        String(TEXT_TEMPLATE_MANAGEMENT_ENTITY_ACTION_CONTRIBUTORS),
      ).toContain('TEXT_TEMPLATE_MANAGEMENT_ENTITY_ACTION_CONTRIBUTORS');
    });

    it('should have unique toolbar action contributors symbol', () => {
      expect(typeof TEXT_TEMPLATE_MANAGEMENT_TOOLBAR_ACTION_CONTRIBUTORS).toBe(
        'symbol',
      );
      expect(
        String(TEXT_TEMPLATE_MANAGEMENT_TOOLBAR_ACTION_CONTRIBUTORS),
      ).toContain('TEXT_TEMPLATE_MANAGEMENT_TOOLBAR_ACTION_CONTRIBUTORS');
    });

    it('should have unique entity prop contributors symbol', () => {
      expect(typeof TEXT_TEMPLATE_MANAGEMENT_ENTITY_PROP_CONTRIBUTORS).toBe(
        'symbol',
      );
      expect(
        String(TEXT_TEMPLATE_MANAGEMENT_ENTITY_PROP_CONTRIBUTORS),
      ).toContain('TEXT_TEMPLATE_MANAGEMENT_ENTITY_PROP_CONTRIBUTORS');
    });

    it('should have distinct symbols', () => {
      expect(TEXT_TEMPLATE_MANAGEMENT_ENTITY_ACTION_CONTRIBUTORS).not.toBe(
        TEXT_TEMPLATE_MANAGEMENT_TOOLBAR_ACTION_CONTRIBUTORS,
      );
      expect(TEXT_TEMPLATE_MANAGEMENT_ENTITY_ACTION_CONTRIBUTORS).not.toBe(
        TEXT_TEMPLATE_MANAGEMENT_ENTITY_PROP_CONTRIBUTORS,
      );
      expect(TEXT_TEMPLATE_MANAGEMENT_TOOLBAR_ACTION_CONTRIBUTORS).not.toBe(
        TEXT_TEMPLATE_MANAGEMENT_ENTITY_PROP_CONTRIBUTORS,
      );
    });
  });
});
