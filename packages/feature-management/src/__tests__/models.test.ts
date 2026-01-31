import { describe, it, expect } from 'vitest';
import { FeatureManagement } from '../models';

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
        value: 'true',
      };
      expect(feature.name).toBe('TestFeature');
      expect(feature.value).toBe('true');
    });

    it('should allow optional properties', () => {
      const feature: FeatureManagement.Feature = {
        name: 'TestFeature',
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
  });

  describe('Features interface', () => {
    it('should contain features array', () => {
      const features: FeatureManagement.Features = {
        features: [
          { name: 'Feature1', value: 'true' },
          { name: 'Feature2', value: 'false' },
        ],
      };
      expect(features.features).toHaveLength(2);
      expect(features.features[0].name).toBe('Feature1');
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
