import { describe, it, expect } from 'vitest';
import {
  FeatureManagement,
  ValueTypes,
  INPUT_TYPES,
  getInputType,
  type IValueValidator,
  type IStringValueType,
  type FeatureProviderDto,
  type FeatureDto,
  type FeatureGroupDto,
  type GetFeatureListResultDto,
  type UpdateFeatureDto,
  type UpdateFeaturesDto,
  type FreeTextType,
} from '../models';

// ============================================================================
// v3.2.0 - Proxy Models and Utilities
// ============================================================================

describe('v3.2.0 Proxy Models', () => {
  describe('IValueValidator interface', () => {
    it('should have required properties', () => {
      const validator: IValueValidator = {
        name: 'NumericValidator',
        item: { min: 0, max: 100 },
        properties: { precision: { value: 2 } },
      };
      expect(validator.name).toBe('NumericValidator');
      expect(validator.item).toEqual({ min: 0, max: 100 });
      expect(validator.properties).toEqual({ precision: { value: 2 } });
    });

    it('should allow empty objects', () => {
      const validator: IValueValidator = {
        name: '',
        item: {},
        properties: {},
      };
      expect(validator.name).toBe('');
      expect(validator.item).toEqual({});
      expect(validator.properties).toEqual({});
    });
  });

  describe('IStringValueType interface', () => {
    it('should have required properties including validator', () => {
      const valueType: IStringValueType = {
        name: 'FreeTextStringValueType',
        item: {},
        properties: { maxLength: { value: 255 } },
        validator: {
          name: 'StringValidator',
          item: {},
          properties: {},
        },
      };
      expect(valueType.name).toBe('FreeTextStringValueType');
      expect(valueType.validator.name).toBe('StringValidator');
    });
  });

  describe('FeatureProviderDto interface', () => {
    it('should have name and key properties', () => {
      const provider: FeatureProviderDto = {
        name: 'T',
        key: 'tenant-123',
      };
      expect(provider.name).toBe('T');
      expect(provider.key).toBe('tenant-123');
    });

    it('should work with edition provider', () => {
      const provider: FeatureProviderDto = {
        name: 'E',
        key: 'edition-456',
      };
      expect(provider.name).toBe('E');
      expect(provider.key).toBe('edition-456');
    });
  });

  describe('FeatureDto interface', () => {
    it('should have all required properties', () => {
      const feature: FeatureDto = {
        name: 'MyApp.EnableFeature',
        displayName: 'Enable Feature',
        value: 'true',
        provider: { name: 'T', key: 'tenant-123' },
        description: 'Enables the feature',
        valueType: {
          name: 'ToggleStringValueType',
          item: {},
          properties: {},
          validator: { name: '', item: {}, properties: {} },
        },
        depth: 0,
        parentName: '',
      };
      expect(feature.name).toBe('MyApp.EnableFeature');
      expect(feature.displayName).toBe('Enable Feature');
      expect(feature.value).toBe('true');
      expect(feature.provider.name).toBe('T');
      expect(feature.depth).toBe(0);
    });

    it('should support hierarchical features with depth and parentName', () => {
      const childFeature: FeatureDto = {
        name: 'MyApp.Parent.Child',
        displayName: 'Child Feature',
        value: '50',
        provider: { name: 'T', key: 'tenant-123' },
        description: 'A child feature',
        valueType: {
          name: 'FreeTextStringValueType',
          item: {},
          properties: {},
          validator: { name: 'NumericValidator', item: {}, properties: {} },
        },
        depth: 1,
        parentName: 'MyApp.Parent',
      };
      expect(childFeature.depth).toBe(1);
      expect(childFeature.parentName).toBe('MyApp.Parent');
    });
  });

  describe('FeatureGroupDto interface', () => {
    it('should contain features array', () => {
      const group: FeatureGroupDto = {
        name: 'MyApp',
        displayName: 'My Application',
        features: [
          {
            name: 'MyApp.Feature1',
            displayName: 'Feature 1',
            value: 'true',
            provider: { name: 'T', key: '' },
            description: '',
            valueType: {
              name: 'ToggleStringValueType',
              item: {},
              properties: {},
              validator: { name: '', item: {}, properties: {} },
            },
            depth: 0,
            parentName: '',
          },
        ],
      };
      expect(group.name).toBe('MyApp');
      expect(group.displayName).toBe('My Application');
      expect(group.features).toHaveLength(1);
    });

    it('should allow empty features array', () => {
      const group: FeatureGroupDto = {
        name: 'EmptyGroup',
        displayName: 'Empty Group',
        features: [],
      };
      expect(group.features).toHaveLength(0);
    });
  });

  describe('GetFeatureListResultDto interface', () => {
    it('should contain groups array', () => {
      const result: GetFeatureListResultDto = {
        groups: [
          {
            name: 'Group1',
            displayName: 'Group 1',
            features: [],
          },
          {
            name: 'Group2',
            displayName: 'Group 2',
            features: [],
          },
        ],
      };
      expect(result.groups).toHaveLength(2);
      expect(result.groups[0].name).toBe('Group1');
    });
  });

  describe('UpdateFeatureDto interface', () => {
    it('should have name and value properties', () => {
      const update: UpdateFeatureDto = {
        name: 'MyApp.Feature1',
        value: 'false',
      };
      expect(update.name).toBe('MyApp.Feature1');
      expect(update.value).toBe('false');
    });
  });

  describe('UpdateFeaturesDto interface', () => {
    it('should contain features array for batch update', () => {
      const updates: UpdateFeaturesDto = {
        features: [
          { name: 'Feature1', value: 'true' },
          { name: 'Feature2', value: '100' },
        ],
      };
      expect(updates.features).toHaveLength(2);
    });
  });
});

describe('ValueTypes enum (v3.2.0)', () => {
  it('should have ToggleStringValueType', () => {
    expect(ValueTypes.ToggleStringValueType).toBe('ToggleStringValueType');
  });

  it('should have FreeTextStringValueType', () => {
    expect(ValueTypes.FreeTextStringValueType).toBe('FreeTextStringValueType');
  });

  it('should have SelectionStringValueType', () => {
    expect(ValueTypes.SelectionStringValueType).toBe('SelectionStringValueType');
  });

  it('should have exactly 3 value types', () => {
    const values = Object.values(ValueTypes);
    expect(values).toHaveLength(3);
  });
});

describe('INPUT_TYPES constant (v3.2.0)', () => {
  it('should have numeric type as "number"', () => {
    expect(INPUT_TYPES.numeric).toBe('number');
  });

  it('should have default type as "text"', () => {
    expect(INPUT_TYPES.default).toBe('text');
  });

  it('should be readonly', () => {
    // TypeScript ensures this is readonly, but we verify values exist
    expect(Object.keys(INPUT_TYPES)).toEqual(['numeric', 'default']);
  });
});

describe('getInputType function (v3.2.0)', () => {
  it('should return "number" for numeric validator', () => {
    const feature: FreeTextType = {
      valueType: {
        validator: { name: 'NumericValidator' },
      },
    };
    expect(getInputType(feature)).toBe('number');
  });

  it('should return "number" for NUMERIC validator (case insensitive)', () => {
    const feature: FreeTextType = {
      valueType: {
        validator: { name: 'NUMERIC_VALIDATOR' },
      },
    };
    expect(getInputType(feature)).toBe('number');
  });

  it('should return "number" for number validator', () => {
    const feature: FreeTextType = {
      valueType: {
        validator: { name: 'NumberValidator' },
      },
    };
    expect(getInputType(feature)).toBe('number');
  });

  it('should return "text" for string validator', () => {
    const feature: FreeTextType = {
      valueType: {
        validator: { name: 'StringValidator' },
      },
    };
    expect(getInputType(feature)).toBe('text');
  });

  it('should return "text" for empty validator name', () => {
    const feature: FreeTextType = {
      valueType: {
        validator: { name: '' },
      },
    };
    expect(getInputType(feature)).toBe('text');
  });

  it('should return "text" for undefined validator', () => {
    const feature = {
      valueType: {
        validator: undefined,
      },
    } as unknown as FreeTextType;
    expect(getInputType(feature)).toBe('text');
  });

  it('should return "text" for undefined valueType', () => {
    const feature = {
      valueType: undefined,
    } as unknown as FreeTextType;
    expect(getInputType(feature)).toBe('text');
  });

  it('should return "text" for null feature', () => {
    const feature = null as unknown as FreeTextType;
    expect(getInputType(feature)).toBe('text');
  });

  it('should return "text" for undefined feature', () => {
    const feature = undefined as unknown as FreeTextType;
    expect(getInputType(feature)).toBe('text');
  });

  it('should handle validators with numeric in middle of name', () => {
    const feature: FreeTextType = {
      valueType: {
        validator: { name: 'CustomNumericRangeValidator' },
      },
    };
    expect(getInputType(feature)).toBe('number');
  });

  it('should handle validators with number in middle of name', () => {
    const feature: FreeTextType = {
      valueType: {
        validator: { name: 'IntegerNumberValidator' },
      },
    };
    expect(getInputType(feature)).toBe('number');
  });
});

// ============================================================================
// Legacy Models (deprecated in v3.2.0)
// ============================================================================

describe('FeatureManagement Models', () => {
  describe('State interface', () => {
    it('should allow creating a state with features array', () => {
      const state: FeatureManagement.State = {
        features: [],
      };
      expect(state.features).toEqual([]);
    });
  });

  describe('ValueType interface', () => {
    it('should have required properties', () => {
      const valueType: FeatureManagement.ValueType = {
        name: 'ToggleStringValueType',
        properties: {},
        validator: {},
      };
      expect(valueType.name).toBe('ToggleStringValueType');
      expect(valueType.properties).toEqual({});
      expect(valueType.validator).toEqual({});
    });
  });

  describe('Feature interface', () => {
    it('should have required properties', () => {
      const feature: FeatureManagement.Feature = {
        name: 'TestFeature',
        displayName: 'Test Feature',
        value: 'true',
      };
      expect(feature.name).toBe('TestFeature');
      expect(feature.displayName).toBe('Test Feature');
      expect(feature.value).toBe('true');
    });

    it('should allow optional properties', () => {
      const feature: FeatureManagement.Feature = {
        name: 'TestFeature',
        displayName: 'Test Feature',
        value: 'true',
        description: 'A test feature',
        valueType: {
          name: 'ToggleStringValueType',
          properties: {},
          validator: {},
        },
        depth: 0,
        parentName: 'ParentFeature',
      };
      expect(feature.description).toBe('A test feature');
      expect(feature.valueType?.name).toBe('ToggleStringValueType');
      expect(feature.depth).toBe(0);
      expect(feature.parentName).toBe('ParentFeature');
    });

    it('should have displayName property (v3.1.0)', () => {
      const feature: FeatureManagement.Feature = {
        name: 'MyApp.EnableFeatureX',
        displayName: 'Enable Feature X',
        value: 'false',
      };
      expect(feature.name).toBe('MyApp.EnableFeatureX');
      expect(feature.displayName).toBe('Enable Feature X');
    });
  });

  describe('Features interface', () => {
    it('should contain features array', () => {
      const features: FeatureManagement.Features = {
        features: [
          { name: 'Feature1', displayName: 'Feature 1', value: 'true' },
          { name: 'Feature2', displayName: 'Feature 2', value: 'false' },
        ],
      };
      expect(features.features).toHaveLength(2);
      expect(features.features[0].name).toBe('Feature1');
      expect(features.features[0].displayName).toBe('Feature 1');
    });
  });

  describe('Provider interface', () => {
    it('should have providerName and providerKey', () => {
      const provider: FeatureManagement.Provider = {
        providerName: 'T',
        providerKey: 'tenant-123',
      };
      expect(provider.providerName).toBe('T');
      expect(provider.providerKey).toBe('tenant-123');
    });
  });

  // v2.0.0: Component Interface Types
  describe('FeatureManagementComponentInputs (v2.0.0)', () => {
    it('should have visible, providerName, and providerKey properties', () => {
      const inputs: FeatureManagement.FeatureManagementComponentInputs = {
        visible: true,
        providerName: 'T',
        providerKey: 'tenant-123',
      };
      expect(inputs.visible).toBe(true);
      expect(inputs.providerName).toBe('T');
      expect(inputs.providerKey).toBe('tenant-123');
    });

    it('should allow visible to be false', () => {
      const inputs: FeatureManagement.FeatureManagementComponentInputs = {
        visible: false,
        providerName: 'E',
        providerKey: 'edition-456',
      };
      expect(inputs.visible).toBe(false);
      expect(inputs.providerName).toBe('E');
      expect(inputs.providerKey).toBe('edition-456');
    });

    it('should work with empty providerKey', () => {
      const inputs: FeatureManagement.FeatureManagementComponentInputs = {
        visible: true,
        providerName: 'T',
        providerKey: '',
      };
      expect(inputs.providerKey).toBe('');
    });
  });

  describe('FeatureManagementComponentOutputs (v2.0.0)', () => {
    it('should allow optional visibleChange callback', () => {
      const outputs: FeatureManagement.FeatureManagementComponentOutputs = {};
      expect(outputs.visibleChange).toBeUndefined();
    });

    it('should accept visibleChange callback function', () => {
      let capturedValue: boolean | undefined;
      const outputs: FeatureManagement.FeatureManagementComponentOutputs = {
        visibleChange: (visible: boolean) => {
          capturedValue = visible;
        },
      };

      outputs.visibleChange?.(true);
      expect(capturedValue).toBe(true);

      outputs.visibleChange?.(false);
      expect(capturedValue).toBe(false);
    });

    it('should handle visibleChange callback with proper typing', () => {
      const visibilityHistory: boolean[] = [];
      const outputs: FeatureManagement.FeatureManagementComponentOutputs = {
        visibleChange: (visible) => {
          visibilityHistory.push(visible);
        },
      };

      outputs.visibleChange?.(true);
      outputs.visibleChange?.(false);
      outputs.visibleChange?.(true);

      expect(visibilityHistory).toEqual([true, false, true]);
    });
  });

  describe('Combined Component Props (v2.0.0)', () => {
    it('should work as combined inputs and outputs', () => {
      type FeatureManagementProps =
        FeatureManagement.FeatureManagementComponentInputs &
        FeatureManagement.FeatureManagementComponentOutputs;

      let isVisible = false;
      const props: FeatureManagementProps = {
        visible: true,
        providerName: 'T',
        providerKey: 'tenant-123',
        visibleChange: (visible) => {
          isVisible = visible;
        },
      };

      expect(props.visible).toBe(true);
      expect(props.providerName).toBe('T');
      expect(props.providerKey).toBe('tenant-123');

      props.visibleChange?.(false);
      expect(isVisible).toBe(false);
    });
  });
});
