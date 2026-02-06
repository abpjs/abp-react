/**
 * Tests for config-options.ts
 * @since 3.0.0
 */
import { describe, it, expect } from 'vitest';
import type {
  TextTemplateManagementEntityActionContributors,
  TextTemplateManagementToolbarActionContributors,
  TextTemplateManagementEntityPropContributors,
  TextTemplateManagementConfigOptions,
} from '../../models/config-options';
import { eTextTemplateManagementComponents } from '../../enums/components';
import type { TextTemplateManagement } from '../../models/text-template-management';

describe('Config Options', () => {
  describe('TextTemplateManagementEntityActionContributors Type', () => {
    it('should allow empty object', () => {
      const contributors: TextTemplateManagementEntityActionContributors = {};
      expect(contributors).toBeDefined();
    });

    it('should allow TextTemplates contributor', () => {
      const contributors: TextTemplateManagementEntityActionContributors = {
        [eTextTemplateManagementComponents.TextTemplates]: [
          (actions) => [...actions, { text: 'Custom' }],
        ],
      };

      expect(
        contributors[eTextTemplateManagementComponents.TextTemplates],
      ).toHaveLength(1);
    });

    it('should allow multiple contributors', () => {
      const contributors: TextTemplateManagementEntityActionContributors = {
        [eTextTemplateManagementComponents.TextTemplates]: [
          (actions) => actions,
          (actions) => [...actions, { text: 'Added' }],
        ],
      };

      expect(
        contributors[eTextTemplateManagementComponents.TextTemplates],
      ).toHaveLength(2);
    });
  });

  describe('TextTemplateManagementToolbarActionContributors Type', () => {
    it('should allow empty object', () => {
      const contributors: TextTemplateManagementToolbarActionContributors = {};
      expect(contributors).toBeDefined();
    });

    it('should allow TextTemplates contributor', () => {
      const contributors: TextTemplateManagementToolbarActionContributors = {
        [eTextTemplateManagementComponents.TextTemplates]: [
          (actions) => [...actions, { text: 'Export' }],
        ],
      };

      expect(
        contributors[eTextTemplateManagementComponents.TextTemplates],
      ).toBeDefined();
    });
  });

  describe('TextTemplateManagementEntityPropContributors Type', () => {
    it('should allow empty object', () => {
      const contributors: TextTemplateManagementEntityPropContributors = {};
      expect(contributors).toBeDefined();
    });

    it('should allow TextTemplates contributor', () => {
      const contributors: TextTemplateManagementEntityPropContributors = {
        [eTextTemplateManagementComponents.TextTemplates]: [
          (props) => [...props, { name: 'customProp' }],
        ],
      };

      expect(
        contributors[eTextTemplateManagementComponents.TextTemplates],
      ).toBeDefined();
    });
  });

  describe('TextTemplateManagementConfigOptions Interface', () => {
    it('should allow empty options', () => {
      const options: TextTemplateManagementConfigOptions = {};
      expect(options).toBeDefined();
    });

    it('should allow entityActionContributors only', () => {
      const options: TextTemplateManagementConfigOptions = {
        entityActionContributors: {
          [eTextTemplateManagementComponents.TextTemplates]: [
            (actions) => actions,
          ],
        },
      };

      expect(options.entityActionContributors).toBeDefined();
      expect(options.toolbarActionContributors).toBeUndefined();
    });

    it('should allow toolbarActionContributors only', () => {
      const options: TextTemplateManagementConfigOptions = {
        toolbarActionContributors: {
          [eTextTemplateManagementComponents.TextTemplates]: [
            (actions) => actions,
          ],
        },
      };

      expect(options.toolbarActionContributors).toBeDefined();
      expect(options.entityActionContributors).toBeUndefined();
    });

    it('should allow entityPropContributors only', () => {
      const options: TextTemplateManagementConfigOptions = {
        entityPropContributors: {
          [eTextTemplateManagementComponents.TextTemplates]: [
            (props) => props,
          ],
        },
      };

      expect(options.entityPropContributors).toBeDefined();
    });

    it('should allow all contributors together', () => {
      const options: TextTemplateManagementConfigOptions = {
        entityActionContributors: {
          [eTextTemplateManagementComponents.TextTemplates]: [
            (actions) => actions,
          ],
        },
        toolbarActionContributors: {
          [eTextTemplateManagementComponents.TextTemplates]: [
            (actions) => actions,
          ],
        },
        entityPropContributors: {
          [eTextTemplateManagementComponents.TextTemplates]: [
            (props) => props,
          ],
        },
      };

      expect(options.entityActionContributors).toBeDefined();
      expect(options.toolbarActionContributors).toBeDefined();
      expect(options.entityPropContributors).toBeDefined();
    });
  });

  describe('Integration with Components', () => {
    it('should use correct component keys', () => {
      const options: TextTemplateManagementConfigOptions = {
        entityActionContributors: {},
      };

      // Should be able to set contributors for TextTemplates component
      options.entityActionContributors = {
        [eTextTemplateManagementComponents.TextTemplates]: [],
      };

      expect(
        options.entityActionContributors[
          eTextTemplateManagementComponents.TextTemplates
        ],
      ).toEqual([]);
    });
  });

  describe('Contributor Callback Execution', () => {
    it('should allow transforming entity actions', () => {
      const contributor = (
        actions: Array<{ text: string }>,
      ): Array<{ text: string }> => {
        return [
          ...actions,
          { text: 'Download' },
          { text: 'Copy' },
        ];
      };

      const options: TextTemplateManagementConfigOptions = {
        entityActionContributors: {
          [eTextTemplateManagementComponents.TextTemplates]: [
            contributor as never,
          ],
        },
      };

      const callbacks =
        options.entityActionContributors?.[
          eTextTemplateManagementComponents.TextTemplates
        ];
      expect(callbacks).toHaveLength(1);

      const result = contributor([{ text: 'Edit' }]);
      expect(result).toHaveLength(3);
      expect(result.map((a) => a.text)).toEqual(['Edit', 'Download', 'Copy']);
    });
  });
});
