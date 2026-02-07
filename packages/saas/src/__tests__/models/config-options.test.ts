/**
 * Tests for SaaS Config Options
 * @abpjs/saas v4.0.0
 *
 * @updated 4.0.0 - Contributor types now use proxy DTOs (EditionDto, SaasTenantDto)
 *                   instead of Saas.Edition/Saas.Tenant
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
import type { EditionDto, SaasTenantDto } from '../../proxy/host/dtos/models';

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

describe('v4.0.0 - Proxy DTO type migration', () => {
  it('should use EditionDto for Editions entity action contributors', () => {
    // v4.0.0: Contributors now use EditionDto instead of Saas.Edition
    const editionDto: EditionDto = {
      id: 'ed-1',
      displayName: 'Pro',
      creationTime: '2024-01-01T00:00:00Z',
      creatorId: 'user-1',
    };

    const contributors: SaasEntityActionContributors = {
      [eSaasComponents.Editions]: [
        (actions) => [
          ...actions,
          {
            text: 'Custom Action',
            action: (record) => {
              // record is EditionDto with proxy fields
              expect(record.id).toBe('ed-1');
              expect(record.creationTime).toBeDefined();
            },
          },
        ],
      ],
    };

    const callback = contributors[eSaasComponents.Editions]![0];
    const result = callback([]);
    result[0].action?.(editionDto);
  });

  it('should use SaasTenantDto for Tenants entity action contributors', () => {
    // v4.0.0: Contributors now use SaasTenantDto instead of Saas.Tenant
    const tenantDto: SaasTenantDto = {
      id: 'tenant-1',
      name: 'Test Tenant',
      creationTime: '2024-01-01T00:00:00Z',
      creatorId: 'user-1',
      extraProperties: { customField: 'value' },
    };

    const contributors: SaasEntityActionContributors = {
      [eSaasComponents.Tenants]: [
        (actions) => [
          ...actions,
          {
            text: 'Inspect',
            action: (record) => {
              // record is SaasTenantDto with proxy fields
              expect(record.id).toBe('tenant-1');
              expect(record.creationTime).toBeDefined();
              expect(record.extraProperties).toBeDefined();
            },
          },
        ],
      ],
    };

    const callback = contributors[eSaasComponents.Tenants]![0];
    const result = callback([]);
    result[0].action?.(tenantDto);
  });

  it('should use EditionDto[] for Editions toolbar action contributors', () => {
    const editions: EditionDto[] = [
      { id: 'ed-1', displayName: 'Basic' },
      { id: 'ed-2', displayName: 'Pro', creationTime: '2024-01-01' },
    ];

    const contributors: SaasToolbarActionContributors = {
      [eSaasComponents.Editions]: [
        (actions) => [
          ...actions,
          {
            text: 'Export All',
            action: (data) => {
              expect(data).toHaveLength(2);
            },
          },
        ],
      ],
    };

    const callback = contributors[eSaasComponents.Editions]![0];
    const result = callback([]);
    result[0].action?.(editions);
  });

  it('should use SaasTenantDto[] for Tenants toolbar action contributors', () => {
    const tenants: SaasTenantDto[] = [
      { id: 'tenant-1', name: 'Tenant One' },
      { id: 'tenant-2', name: 'Tenant Two', extraProperties: {} },
    ];

    const contributors: SaasToolbarActionContributors = {
      [eSaasComponents.Tenants]: [
        (actions) => [
          ...actions,
          {
            text: 'Bulk Action',
            action: (data) => {
              expect(data).toHaveLength(2);
            },
          },
        ],
      ],
    };

    const callback = contributors[eSaasComponents.Tenants]![0];
    const result = callback([]);
    result[0].action?.(tenants);
  });

  it('should use EditionDto for entity prop value resolver', () => {
    const editionDto: EditionDto = {
      id: 'ed-1',
      displayName: 'Enterprise',
      creationTime: '2024-06-15T10:00:00Z',
    };

    const contributors: SaasEntityPropContributors = {
      [eSaasComponents.Editions]: [
        (props) => [
          ...props,
          {
            name: 'creationTime',
            displayName: 'Created',
            valueResolver: (record) => record.creationTime as string,
          },
        ],
      ],
    };

    const callback = contributors[eSaasComponents.Editions]![0];
    const result = callback([]);
    expect(result[0].valueResolver?.(editionDto)).toBe('2024-06-15T10:00:00Z');
  });

  it('should use SaasTenantDto for create form prop contributors', () => {
    const contributors: SaasCreateFormPropContributors = {
      [eSaasComponents.Tenants]: [
        (props) => [
          ...props,
          {
            name: 'extraProperties.customField',
            displayName: 'Custom Field',
            type: 'string' as const,
          },
        ],
      ],
    };

    const callback = contributors[eSaasComponents.Tenants]![0];
    const result = callback([]);
    expect(result[0].name).toBe('extraProperties.customField');
  });

  it('should use EditionDto for edit form prop contributors', () => {
    const contributors: SaasEditFormPropContributors = {
      [eSaasComponents.Editions]: [
        (props) => [
          ...props,
          {
            name: 'displayName',
            displayName: 'Edition Name',
            type: 'string' as const,
            validators: [
              { type: 'required', message: 'Edition name is required' },
              { type: 'maxLength', value: 256 },
            ],
          },
        ],
      ],
    };

    const callback = contributors[eSaasComponents.Editions]![0];
    const result = callback([]);
    expect(result[0].validators).toHaveLength(2);
  });
});
