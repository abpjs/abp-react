/**
 * Tests for SaaS Config Options
 * @abpjs/saas v3.0.0
 */
import { describe, it, expect } from 'vitest';
import type {
  SaasConfigOptions,
  SaasEntityActionContributors,
  SaasToolbarActionContributors,
  SaasEntityPropContributors,
  SaasCreateFormPropContributors,
  SaasEditFormPropContributors,
} from '../../models/config-options';
import { eSaasComponents } from '../../enums/components';

describe('SaasConfigOptions type', () => {
  it('should allow empty options object', () => {
    const options: SaasConfigOptions = {};
    expect(options).toEqual({});
  });

  it('should allow entityActionContributors', () => {
    const options: SaasConfigOptions = {
      entityActionContributors: {
        [eSaasComponents.Tenants]: [
          (actions) => [
            ...actions,
            { text: 'Custom Action', icon: 'fa fa-star' },
          ],
        ],
      },
    };
    expect(options.entityActionContributors).toBeDefined();
  });

  it('should allow toolbarActionContributors', () => {
    const options: SaasConfigOptions = {
      toolbarActionContributors: {
        [eSaasComponents.Editions]: [
          (actions) => [
            ...actions,
            { text: 'Custom Toolbar', icon: 'fa fa-cog' },
          ],
        ],
      },
    };
    expect(options.toolbarActionContributors).toBeDefined();
  });

  it('should allow entityPropContributors', () => {
    const options: SaasConfigOptions = {
      entityPropContributors: {
        [eSaasComponents.Tenants]: [
          (props) => [
            ...props,
            { name: 'customField', displayName: 'Custom' },
          ],
        ],
      },
    };
    expect(options.entityPropContributors).toBeDefined();
  });

  it('should allow createFormPropContributors', () => {
    const options: SaasConfigOptions = {
      createFormPropContributors: {
        [eSaasComponents.Tenants]: [
          (props) => [
            ...props,
            { name: 'customInput', type: 'string' },
          ],
        ],
      },
    };
    expect(options.createFormPropContributors).toBeDefined();
  });

  it('should allow editFormPropContributors', () => {
    const options: SaasConfigOptions = {
      editFormPropContributors: {
        [eSaasComponents.Editions]: [
          (props) => [
            ...props,
            { name: 'customEditField', type: 'string' },
          ],
        ],
      },
    };
    expect(options.editFormPropContributors).toBeDefined();
  });

  it('should allow all contributors together', () => {
    const options: SaasConfigOptions = {
      entityActionContributors: {},
      toolbarActionContributors: {},
      entityPropContributors: {},
      createFormPropContributors: {},
      editFormPropContributors: {},
    };
    expect(Object.keys(options)).toHaveLength(5);
  });
});

describe('SaasEntityActionContributors type', () => {
  it('should support Editions component contributor', () => {
    const contributors: SaasEntityActionContributors = {
      [eSaasComponents.Editions]: [
        (actions) => actions.filter((a) => a.text !== 'AbpUi::Delete'),
      ],
    };
    expect(contributors[eSaasComponents.Editions]).toHaveLength(1);
  });

  it('should support Tenants component contributor', () => {
    const contributors: SaasEntityActionContributors = {
      [eSaasComponents.Tenants]: [
        (actions) => [...actions, { text: 'New Action' }],
      ],
    };
    expect(contributors[eSaasComponents.Tenants]).toHaveLength(1);
  });

  it('should support multiple contributors for same component', () => {
    const contributors: SaasEntityActionContributors = {
      [eSaasComponents.Tenants]: [
        (actions) => [...actions, { text: 'Action 1' }],
        (actions) => [...actions, { text: 'Action 2' }],
      ],
    };
    expect(contributors[eSaasComponents.Tenants]).toHaveLength(2);
  });
});

describe('SaasToolbarActionContributors type', () => {
  it('should support Edition[] type for toolbar', () => {
    const contributors: SaasToolbarActionContributors = {
      [eSaasComponents.Editions]: [
        (actions) => [...actions, { text: 'Export' }],
      ],
    };
    expect(contributors[eSaasComponents.Editions]).toBeDefined();
  });

  it('should support Tenant[] type for toolbar', () => {
    const contributors: SaasToolbarActionContributors = {
      [eSaasComponents.Tenants]: [
        (actions) => [...actions, { text: 'Import' }],
      ],
    };
    expect(contributors[eSaasComponents.Tenants]).toBeDefined();
  });
});

describe('SaasEntityPropContributors type', () => {
  it('should support adding new props', () => {
    const contributors: SaasEntityPropContributors = {
      [eSaasComponents.Tenants]: [
        (props) => [
          ...props,
          {
            name: 'createdAt',
            displayName: 'Created At',
            sortable: true,
          },
        ],
      ],
    };
    expect(contributors[eSaasComponents.Tenants]).toBeDefined();
  });

  it('should support removing props', () => {
    const contributors: SaasEntityPropContributors = {
      [eSaasComponents.Editions]: [
        (props) => props.filter((p) => p.name !== 'displayName'),
      ],
    };
    expect(contributors[eSaasComponents.Editions]).toBeDefined();
  });
});

describe('SaasCreateFormPropContributors type', () => {
  it('should support adding form fields', () => {
    const contributors: SaasCreateFormPropContributors = {
      [eSaasComponents.Tenants]: [
        (props) => [
          ...props,
          {
            name: 'customField',
            displayName: 'Custom Field',
            type: 'string',
            validators: [{ type: 'required' }],
          },
        ],
      ],
    };
    expect(contributors[eSaasComponents.Tenants]).toBeDefined();
  });
});

describe('SaasEditFormPropContributors type', () => {
  it('should support modifying form fields', () => {
    const contributors: SaasEditFormPropContributors = {
      [eSaasComponents.Editions]: [
        (props) =>
          props.map((p) =>
            p.name === 'displayName'
              ? { ...p, validators: [...(p.validators || []), { type: 'maxLength', value: 100 }] }
              : p,
          ),
      ],
    };
    expect(contributors[eSaasComponents.Editions]).toBeDefined();
  });
});

describe('Contributor callback execution', () => {
  it('should execute entity action contributor correctly', () => {
    const mockActions = [
      { text: 'Action 1' },
      { text: 'Action 2' },
    ];

    const contributor = (actions: typeof mockActions) => [
      ...actions,
      { text: 'Action 3' },
    ];

    const result = contributor(mockActions);
    expect(result).toHaveLength(3);
    expect(result[2].text).toBe('Action 3');
  });

  it('should chain multiple contributors', () => {
    const initialProps = [{ name: 'field1' }];

    const contributors = [
      (props: typeof initialProps) => [...props, { name: 'field2' }],
      (props: typeof initialProps) => [...props, { name: 'field3' }],
    ];

    const result = contributors.reduce(
      (acc, contributor) => contributor(acc),
      initialProps,
    );

    expect(result).toHaveLength(3);
    expect(result.map((p) => p.name)).toEqual(['field1', 'field2', 'field3']);
  });
});
