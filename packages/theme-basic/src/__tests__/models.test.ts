import { describe, it, expect } from 'vitest';
import { Layout } from '../models/layout';

describe('Layout models', () => {
  describe('Layout.State', () => {
    it('should define State interface with navigationElements', () => {
      const state: Layout.State = {
        navigationElements: [],
      };

      expect(state.navigationElements).toBeDefined();
      expect(Array.isArray(state.navigationElements)).toBe(true);
    });
  });

  describe('Layout.NavigationElement', () => {
    it('should create a navigation element with required properties', () => {
      const element: Layout.NavigationElement = {
        name: 'test-element',
        element: 'Test Content',
      };

      expect(element.name).toBe('test-element');
      expect(element.element).toBe('Test Content');
      expect(element.order).toBeUndefined();
    });

    it('should create a navigation element with optional order', () => {
      const element: Layout.NavigationElement = {
        name: 'ordered-element',
        element: 'Ordered Content',
        order: 10,
      };

      expect(element.name).toBe('ordered-element');
      expect(element.element).toBe('Ordered Content');
      expect(element.order).toBe(10);
    });

    it('should allow sorting navigation elements by order', () => {
      const elements: Layout.NavigationElement[] = [
        { name: 'third', element: 'Third', order: 30 },
        { name: 'first', element: 'First', order: 10 },
        { name: 'second', element: 'Second', order: 20 },
        { name: 'default', element: 'Default' }, // no order, defaults to 99
      ];

      const sorted = [...elements].sort(
        (a, b) => (a.order ?? 99) - (b.order ?? 99)
      );

      expect(sorted[0].name).toBe('first');
      expect(sorted[1].name).toBe('second');
      expect(sorted[2].name).toBe('third');
      expect(sorted[3].name).toBe('default');
    });
  });
});
