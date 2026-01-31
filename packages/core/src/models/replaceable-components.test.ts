import { describe, it, expect } from 'vitest';
import { ReplaceableComponents } from './replaceable-components';

describe('ReplaceableComponents model (v2.0.0)', () => {
  describe('State interface', () => {
    it('should allow creating a valid State object', () => {
      const state: ReplaceableComponents.State = {
        replaceableComponents: [],
      };
      expect(state.replaceableComponents).toEqual([]);
    });

    it('should allow State with components', () => {
      const MockComponent = () => null;
      const state: ReplaceableComponents.State = {
        replaceableComponents: [
          { key: 'test-component', component: MockComponent },
        ],
      };
      expect(state.replaceableComponents).toHaveLength(1);
      expect(state.replaceableComponents[0].key).toBe('test-component');
    });
  });

  describe('ReplaceableComponent interface', () => {
    it('should allow creating a valid ReplaceableComponent', () => {
      const MockComponent = () => null;
      const replaceableComponent: ReplaceableComponents.ReplaceableComponent = {
        key: 'my-component',
        component: MockComponent,
      };
      expect(replaceableComponent.key).toBe('my-component');
      expect(replaceableComponent.component).toBe(MockComponent);
    });
  });

  describe('ReplaceableTemplateDirectiveInput interface', () => {
    it('should allow creating valid input configuration', () => {
      interface TestInputs {
        name: string;
        count: number;
      }
      interface TestOutputs {
        onSave: (value: string) => void;
      }

      const input: ReplaceableComponents.ReplaceableTemplateDirectiveInput<
        TestInputs,
        TestOutputs
      > = {
        inputs: {
          name: { value: 'test', twoWay: false },
          count: { value: 5 },
        },
        outputs: {
          onSave: (value: string) => console.log(value),
        },
        componentKey: 'test-key',
      };

      expect(input.componentKey).toBe('test-key');
      expect(input.inputs.name.value).toBe('test');
      expect(input.inputs.count.value).toBe(5);
    });
  });

  describe('ReplaceableTemplateData interface', () => {
    it('should allow creating valid template data', () => {
      interface TestInputs {
        title: string;
      }
      interface TestOutputs {
        onClick: (value: boolean) => void;
      }

      const data: ReplaceableComponents.ReplaceableTemplateData<TestInputs, TestOutputs> = {
        inputs: {
          title: 'Hello',
        },
        outputs: {
          onClick: (value: boolean) => console.log(value),
        },
        componentKey: 'template-key',
      };

      expect(data.componentKey).toBe('template-key');
      expect(data.inputs.title).toBe('Hello');
    });
  });

  describe('RouteData interface', () => {
    it('should allow creating valid route data', () => {
      const MockComponent = () => null;
      const routeData: ReplaceableComponents.RouteData = {
        key: 'route-key',
        defaultComponent: MockComponent,
      };

      expect(routeData.key).toBe('route-key');
      expect(routeData.defaultComponent).toBe(MockComponent);
    });

    it('should allow generic type parameter', () => {
      interface MyProps {
        id: string;
      }
      const MockComponent = (_props: MyProps) => null;
      const routeData: ReplaceableComponents.RouteData<MyProps> = {
        key: 'typed-route',
        defaultComponent: MockComponent,
      };

      expect(routeData.key).toBe('typed-route');
    });
  });

  describe('Type exports', () => {
    it('should export ReplaceableTemplateInputs type', () => {
      type TestType = ReplaceableComponents.ReplaceableTemplateInputs<{ a: string }>;
      const value: TestType = { a: 'test' };
      expect(value.a).toBe('test');
    });

    it('should export ReplaceableTemplateOutputs type', () => {
      type TestType = ReplaceableComponents.ReplaceableTemplateOutputs<{
        onEvent: (val: number) => void;
      }>;
      const value: TestType = { onEvent: (val: number) => console.log(val) };
      expect(typeof value.onEvent).toBe('function');
    });
  });
});
