/**
 * Tests for ReplaceableComponentsService
 * @since 3.2.0
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import {
  ReplaceableComponentsService,
  replaceableComponentsService,
  useReplaceableComponent,
} from './replaceable-components.service';

// Mock React component for testing
const MockComponent: React.FC<{ text?: string }> = ({ text = 'default' }) =>
  React.createElement('div', null, text);
const ReplacementComponent: React.FC<{ text?: string }> = ({ text = 'replacement' }) =>
  React.createElement('span', null, text);
const AnotherComponent: React.FC = () => React.createElement('p', null, 'another');

describe('ReplaceableComponentsService (v3.2.0)', () => {
  let service: ReplaceableComponentsService;

  beforeEach(() => {
    // Create a fresh instance for each test
    service = new ReplaceableComponentsService();
    // Clear the singleton's state
    replaceableComponentsService.clear();
  });

  describe('constructor', () => {
    it('should create an instance', () => {
      expect(service).toBeInstanceOf(ReplaceableComponentsService);
    });

    it('should start with empty replaceableComponents', () => {
      expect(service.replaceableComponents).toEqual([]);
    });
  });

  describe('add', () => {
    it('should add a new replaceable component', () => {
      service.add({ key: 'TestComponent', component: MockComponent });

      expect(service.replaceableComponents).toHaveLength(1);
      expect(service.replaceableComponents[0].key).toBe('TestComponent');
      expect(service.replaceableComponents[0].component).toBe(MockComponent);
    });

    it('should add multiple replaceable components', () => {
      service.add({ key: 'Component1', component: MockComponent });
      service.add({ key: 'Component2', component: ReplacementComponent });

      expect(service.replaceableComponents).toHaveLength(2);
    });

    it('should replace an existing component with the same key', () => {
      service.add({ key: 'TestComponent', component: MockComponent });
      service.add({ key: 'TestComponent', component: ReplacementComponent });

      expect(service.replaceableComponents).toHaveLength(1);
      expect(service.replaceableComponents[0].component).toBe(ReplacementComponent);
    });

    it('should log debug message when reload is true', () => {
      const consoleSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});

      service.add({ key: 'TestComponent', component: MockComponent }, true);

      expect(consoleSpy).toHaveBeenCalledWith(
        'ReplaceableComponentsService: reload requested for',
        'TestComponent'
      );

      consoleSpy.mockRestore();
    });

    it('should not log debug message when reload is false', () => {
      const consoleSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});

      service.add({ key: 'TestComponent', component: MockComponent }, false);

      expect(consoleSpy).not.toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should notify listeners when component is added', () => {
      const listener = vi.fn();
      service.onUpdate(listener);

      service.add({ key: 'TestComponent', component: MockComponent });

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith([
        { key: 'TestComponent', component: MockComponent },
      ]);
    });

    it('should notify listeners when component is replaced', () => {
      service.add({ key: 'TestComponent', component: MockComponent });

      const listener = vi.fn();
      service.onUpdate(listener);

      service.add({ key: 'TestComponent', component: ReplacementComponent });

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith([
        { key: 'TestComponent', component: ReplacementComponent },
      ]);
    });
  });

  describe('get', () => {
    it('should return undefined for non-existent key', () => {
      expect(service.get('NonExistent')).toBeUndefined();
    });

    it('should return the correct component by key', () => {
      service.add({ key: 'TestComponent', component: MockComponent });

      const result = service.get('TestComponent');

      expect(result).toBeDefined();
      expect(result?.key).toBe('TestComponent');
      expect(result?.component).toBe(MockComponent);
    });

    it('should return the replaced component after replacement', () => {
      service.add({ key: 'TestComponent', component: MockComponent });
      service.add({ key: 'TestComponent', component: ReplacementComponent });

      const result = service.get('TestComponent');

      expect(result?.component).toBe(ReplacementComponent);
    });
  });

  describe('getComponent', () => {
    it('should return undefined for non-existent key', () => {
      expect(service.getComponent('NonExistent')).toBeUndefined();
    });

    it('should return only the component type by key', () => {
      service.add({ key: 'TestComponent', component: MockComponent });

      const result = service.getComponent('TestComponent');

      expect(result).toBe(MockComponent);
    });

    it('should return typed component', () => {
      service.add({ key: 'TestComponent', component: MockComponent });

      const result = service.getComponent<{ text?: string }>('TestComponent');

      expect(result).toBe(MockComponent);
    });
  });

  describe('onUpdate', () => {
    it('should return an unsubscribe function', () => {
      const listener = vi.fn();
      const unsubscribe = service.onUpdate(listener);

      expect(typeof unsubscribe).toBe('function');
    });

    it('should call listener when components change', () => {
      const listener = vi.fn();
      service.onUpdate(listener);

      service.add({ key: 'TestComponent', component: MockComponent });

      expect(listener).toHaveBeenCalled();
    });

    it('should not call listener after unsubscribe', () => {
      const listener = vi.fn();
      const unsubscribe = service.onUpdate(listener);

      service.add({ key: 'Component1', component: MockComponent });
      expect(listener).toHaveBeenCalledTimes(1);

      unsubscribe();

      service.add({ key: 'Component2', component: ReplacementComponent });
      expect(listener).toHaveBeenCalledTimes(1); // Still 1, not called again
    });

    it('should support multiple listeners', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      service.onUpdate(listener1);
      service.onUpdate(listener2);

      service.add({ key: 'TestComponent', component: MockComponent });

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
    });

    it('should only unsubscribe the specific listener', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      const unsubscribe1 = service.onUpdate(listener1);
      service.onUpdate(listener2);

      unsubscribe1();

      service.add({ key: 'TestComponent', component: MockComponent });

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should remove a component by key', () => {
      service.add({ key: 'TestComponent', component: MockComponent });
      service.add({ key: 'OtherComponent', component: ReplacementComponent });

      service.remove('TestComponent');

      expect(service.replaceableComponents).toHaveLength(1);
      expect(service.get('TestComponent')).toBeUndefined();
      expect(service.get('OtherComponent')).toBeDefined();
    });

    it('should not throw when removing non-existent key', () => {
      expect(() => service.remove('NonExistent')).not.toThrow();
    });

    it('should notify listeners when component is removed', () => {
      service.add({ key: 'TestComponent', component: MockComponent });

      const listener = vi.fn();
      service.onUpdate(listener);

      service.remove('TestComponent');

      expect(listener).toHaveBeenCalledWith([]);
    });

    it('should not notify listeners when removing non-existent key', () => {
      const listener = vi.fn();
      service.onUpdate(listener);

      service.remove('NonExistent');

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('clear', () => {
    it('should remove all components', () => {
      service.add({ key: 'Component1', component: MockComponent });
      service.add({ key: 'Component2', component: ReplacementComponent });

      service.clear();

      expect(service.replaceableComponents).toEqual([]);
    });

    it('should notify listeners when cleared', () => {
      service.add({ key: 'TestComponent', component: MockComponent });

      const listener = vi.fn();
      service.onUpdate(listener);

      service.clear();

      expect(listener).toHaveBeenCalledWith([]);
    });
  });

  describe('replaceableComponents getter', () => {
    it('should return a copy of the array', () => {
      service.add({ key: 'TestComponent', component: MockComponent });

      const components1 = service.replaceableComponents;
      const components2 = service.replaceableComponents;

      expect(components1).not.toBe(components2);
      expect(components1).toEqual(components2);
    });

    it('should not be affected by external mutations', () => {
      service.add({ key: 'TestComponent', component: MockComponent });

      const components = service.replaceableComponents;
      components.push({ key: 'Fake', component: AnotherComponent });

      expect(service.replaceableComponents).toHaveLength(1);
    });
  });

  describe('singleton instance', () => {
    it('should have a global singleton instance', () => {
      expect(replaceableComponentsService).toBeInstanceOf(ReplaceableComponentsService);
    });

    it('should share state across uses', () => {
      replaceableComponentsService.add({ key: 'SharedComponent', component: MockComponent });

      expect(replaceableComponentsService.get('SharedComponent')).toBeDefined();
    });
  });
});

describe('useReplaceableComponent hook (v3.2.0)', () => {
  beforeEach(() => {
    replaceableComponentsService.clear();
  });

  it('should return default component when no replacement exists', () => {
    const result = useReplaceableComponent('NonExistent', MockComponent);

    expect(result).toBe(MockComponent);
  });

  it('should return replacement component when one exists', () => {
    replaceableComponentsService.add({
      key: 'TestComponent',
      component: ReplacementComponent,
    });

    const result = useReplaceableComponent('TestComponent', MockComponent);

    expect(result).toBe(ReplacementComponent);
  });

  it('should work with typed components', () => {
    replaceableComponentsService.add({
      key: 'TypedComponent',
      component: ReplacementComponent,
    });

    const result = useReplaceableComponent<{ text?: string }>(
      'TypedComponent',
      MockComponent
    );

    expect(result).toBe(ReplacementComponent);
  });

  it('should return default after component is removed', () => {
    replaceableComponentsService.add({
      key: 'TestComponent',
      component: ReplacementComponent,
    });

    replaceableComponentsService.remove('TestComponent');

    const result = useReplaceableComponent('TestComponent', MockComponent);

    expect(result).toBe(MockComponent);
  });
});
