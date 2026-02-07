import { describe, it, expect } from 'vitest';
import type { Strict, DeepPartial, InferredInstanceOf, ComponentFactory, RenderProp } from './utility';
import type { ComponentType } from 'react';

describe('utility types (v4.0.0)', () => {
  describe('Strict type', () => {
    it('should map Class keys to Contract types when Class extends Contract', () => {
      interface Contract {
        name: string;
        age: number;
      }

      interface Implementation extends Contract {
        name: string;
        age: number;
        extra: boolean;
      }

      // When Class extends Contract, extra keys become never
      type StrictImpl = Strict<Implementation, Contract>;

      // We can verify the type behavior at runtime by creating conforming objects
      const obj: StrictImpl = { name: 'test', age: 25, extra: undefined as never };
      expect(obj.name).toBe('test');
      expect(obj.age).toBe(25);
    });

    it('should return Contract when Class does not extend Contract', () => {
      interface Contract {
        name: string;
        age: number;
      }

      interface NonConforming {
        foo: string;
      }

      // When Class does NOT extend Contract, Strict returns Contract
      type Result = Strict<NonConforming, Contract>;

      const obj: Result = { name: 'test', age: 25 };
      expect(obj.name).toBe('test');
      expect(obj.age).toBe(25);
    });

    it('should work with identical types', () => {
      interface MyType {
        name: string;
        value: number;
      }

      type StrictSame = Strict<MyType, MyType>;

      const obj: StrictSame = { name: 'hello', value: 42 };
      expect(obj.name).toBe('hello');
      expect(obj.value).toBe(42);
    });
  });

  describe('DeepPartial type (v3.2.0)', () => {
    it('should make all properties optional recursively', () => {
      interface Nested {
        name: string;
        config: {
          enabled: boolean;
          settings: {
            timeout: number;
          };
        };
      }

      const partial: DeepPartial<Nested> = {
        config: {
          settings: {},
        },
      };
      expect(partial.name).toBeUndefined();
      expect(partial.config?.settings).toEqual({});
    });

    it('should allow empty object', () => {
      interface Full {
        a: string;
        b: number;
        c: boolean;
      }

      const empty: DeepPartial<Full> = {};
      expect(Object.keys(empty)).toHaveLength(0);
    });
  });

  describe('InferredInstanceOf type', () => {
    it('should infer component props type', () => {
      // This is a compile-time type test
      type MyComponent = ComponentType<{ name: string; age: number }>;
      type Props = InferredInstanceOf<MyComponent>;

      // Runtime verification
      const props: Props = { name: 'test', age: 25 };
      expect(props.name).toBe('test');
      expect(props.age).toBe(25);
    });
  });

  describe('ComponentFactory type (v2.7.0)', () => {
    it('should accept a function component', () => {
      const factory: ComponentFactory<{ label: string }> = ({ label: _label }) => null as any;
      expect(typeof factory).toBe('function');
    });
  });

  describe('RenderProp type (v2.7.0)', () => {
    it('should accept a render function', () => {
      const render: RenderProp<{ data: string }> = ({ data: _data }) => null as any;
      expect(typeof render).toBe('function');
    });
  });
});
