/**
 * Tests for useLayoutStateService v2.7.0
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { useLayoutStateService } from '../services/layout-state.service';
import { LayoutProvider } from '../contexts/layout.context';
import { Layout } from '../models';

describe('useLayoutStateService', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <LayoutProvider>{children}</LayoutProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getNavigationElements', () => {
    it('should return empty array initially', () => {
      const { result } = renderHook(() => useLayoutStateService(), { wrapper });

      expect(result.current.getNavigationElements()).toEqual([]);
    });

    it('should return navigation elements after adding them', () => {
      const { result } = renderHook(() => useLayoutStateService(), { wrapper });

      const testElement: Layout.NavigationElement = {
        name: 'TestElement',
        element: <div>Test</div>,
        order: 1,
      };

      act(() => {
        result.current.dispatchAddNavigationElement(testElement);
      });

      const elements = result.current.getNavigationElements();
      expect(elements).toHaveLength(1);
      expect(elements[0].name).toBe('TestElement');
    });
  });

  describe('dispatchAddNavigationElement', () => {
    it('should add a single navigation element', () => {
      const { result } = renderHook(() => useLayoutStateService(), { wrapper });

      const element: Layout.NavigationElement = {
        name: 'SingleElement',
        element: <div>Single</div>,
        order: 1,
      };

      act(() => {
        result.current.dispatchAddNavigationElement(element);
      });

      const elements = result.current.getNavigationElements();
      expect(elements).toHaveLength(1);
      expect(elements[0].name).toBe('SingleElement');
    });

    it('should add multiple navigation elements at once', () => {
      const { result } = renderHook(() => useLayoutStateService(), { wrapper });

      const elements: Layout.NavigationElement[] = [
        { name: 'Element1', element: <div>1</div>, order: 1 },
        { name: 'Element2', element: <div>2</div>, order: 2 },
        { name: 'Element3', element: <div>3</div>, order: 3 },
      ];

      act(() => {
        result.current.dispatchAddNavigationElement(elements);
      });

      const result_elements = result.current.getNavigationElements();
      expect(result_elements).toHaveLength(3);
    });

    it('should sort elements by order', () => {
      const { result } = renderHook(() => useLayoutStateService(), { wrapper });

      const elements: Layout.NavigationElement[] = [
        { name: 'Third', element: <div>3</div>, order: 3 },
        { name: 'First', element: <div>1</div>, order: 1 },
        { name: 'Second', element: <div>2</div>, order: 2 },
      ];

      act(() => {
        result.current.dispatchAddNavigationElement(elements);
      });

      const sorted = result.current.getNavigationElements();
      expect(sorted[0].name).toBe('First');
      expect(sorted[1].name).toBe('Second');
      expect(sorted[2].name).toBe('Third');
    });

    it('should not add duplicate elements with same name', () => {
      const { result } = renderHook(() => useLayoutStateService(), { wrapper });

      const element1: Layout.NavigationElement = {
        name: 'Duplicate',
        element: <div>Original</div>,
        order: 1,
      };

      const element2: Layout.NavigationElement = {
        name: 'Duplicate',
        element: <div>Copy</div>,
        order: 2,
      };

      act(() => {
        result.current.dispatchAddNavigationElement(element1);
      });

      act(() => {
        result.current.dispatchAddNavigationElement(element2);
      });

      const elements = result.current.getNavigationElements();
      expect(elements).toHaveLength(1);
      expect(elements[0].name).toBe('Duplicate');
    });

    it('should use default order of 99 when not specified', () => {
      const { result } = renderHook(() => useLayoutStateService(), { wrapper });

      const elementWithOrder: Layout.NavigationElement = {
        name: 'WithOrder',
        element: <div>With Order</div>,
        order: 50,
      };

      const elementWithoutOrder: Layout.NavigationElement = {
        name: 'WithoutOrder',
        element: <div>Without Order</div>,
      };

      act(() => {
        result.current.dispatchAddNavigationElement([elementWithoutOrder, elementWithOrder]);
      });

      const elements = result.current.getNavigationElements();
      expect(elements[0].name).toBe('WithOrder');
      expect(elements[1].name).toBe('WithoutOrder');
      expect(elements[1].order).toBe(99);
    });
  });

  describe('dispatchRemoveNavigationElementByName', () => {
    it('should remove element by name', () => {
      const { result } = renderHook(() => useLayoutStateService(), { wrapper });

      const elements: Layout.NavigationElement[] = [
        { name: 'ToKeep', element: <div>Keep</div>, order: 1 },
        { name: 'ToRemove', element: <div>Remove</div>, order: 2 },
      ];

      act(() => {
        result.current.dispatchAddNavigationElement(elements);
      });

      expect(result.current.getNavigationElements()).toHaveLength(2);

      act(() => {
        result.current.dispatchRemoveNavigationElementByName('ToRemove');
      });

      const remaining = result.current.getNavigationElements();
      expect(remaining).toHaveLength(1);
      expect(remaining[0].name).toBe('ToKeep');
    });

    it('should handle removing non-existent element gracefully', () => {
      const { result } = renderHook(() => useLayoutStateService(), { wrapper });

      const element: Layout.NavigationElement = {
        name: 'Existing',
        element: <div>Existing</div>,
        order: 1,
      };

      act(() => {
        result.current.dispatchAddNavigationElement(element);
      });

      act(() => {
        result.current.dispatchRemoveNavigationElementByName('NonExistent');
      });

      // Should still have the original element
      expect(result.current.getNavigationElements()).toHaveLength(1);
    });

    it('should remove all elements when called for each', () => {
      const { result } = renderHook(() => useLayoutStateService(), { wrapper });

      const elements: Layout.NavigationElement[] = [
        { name: 'A', element: <div>A</div>, order: 1 },
        { name: 'B', element: <div>B</div>, order: 2 },
        { name: 'C', element: <div>C</div>, order: 3 },
      ];

      act(() => {
        result.current.dispatchAddNavigationElement(elements);
      });

      act(() => {
        result.current.dispatchRemoveNavigationElementByName('A');
        result.current.dispatchRemoveNavigationElementByName('B');
        result.current.dispatchRemoveNavigationElementByName('C');
      });

      expect(result.current.getNavigationElements()).toHaveLength(0);
    });
  });

  describe('service interface', () => {
    it('should expose all required methods', () => {
      const { result } = renderHook(() => useLayoutStateService(), { wrapper });

      expect(typeof result.current.getNavigationElements).toBe('function');
      expect(typeof result.current.dispatchAddNavigationElement).toBe('function');
      expect(typeof result.current.dispatchRemoveNavigationElementByName).toBe('function');
    });

    it('should return working method references after rerender', () => {
      const { result, rerender } = renderHook(() => useLayoutStateService(), { wrapper });

      // Add an element before rerender
      act(() => {
        result.current.dispatchAddNavigationElement({
          name: 'TestElement',
          element: <div>Test</div>,
          order: 1,
        });
      });

      rerender();

      // Methods should still work after rerender
      expect(result.current.getNavigationElements()).toHaveLength(1);
      expect(typeof result.current.dispatchAddNavigationElement).toBe('function');
      expect(typeof result.current.dispatchRemoveNavigationElementByName).toBe('function');
    });
  });

  describe('error handling', () => {
    it('should throw error when used outside LayoutProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        renderHook(() => useLayoutStateService());
      }).toThrow('useLayoutContext must be used within a LayoutProvider');

      consoleSpy.mockRestore();
    });
  });
});
