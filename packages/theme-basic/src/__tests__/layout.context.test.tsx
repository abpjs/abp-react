import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import {
  LayoutProvider,
  useLayoutContext,
  useLayoutService,
  useNavigationElements,
} from '../contexts/layout.context';
import { Layout } from '../models/layout';

// Test component that uses layout hooks
function LayoutConsumer() {
  const { state, service } = useLayoutContext();
  return (
    <div>
      <span data-testid="element-count">{state.navigationElements.length}</span>
      <ul data-testid="element-list">
        {state.navigationElements.map((el) => (
          <li key={el.name} data-testid={`element-${el.name}`}>
            {el.name}: order={el.order}
          </li>
        ))}
      </ul>
      <button
        data-testid="add-element"
        onClick={() =>
          service.addNavigationElement({ name: 'test', element: 'Test', order: 10 })
        }
      >
        Add Element
      </button>
      <button
        data-testid="remove-element"
        onClick={() => service.removeNavigationElement('test')}
      >
        Remove Element
      </button>
      <button
        data-testid="clear-elements"
        onClick={() => service.clearNavigationElements()}
      >
        Clear Elements
      </button>
    </div>
  );
}

function ServiceOnlyConsumer() {
  const service = useLayoutService();
  return (
    <button
      data-testid="add-via-service"
      onClick={() =>
        service.addNavigationElement({ name: 'service-test', element: 'Service Test' })
      }
    >
      Add via Service
    </button>
  );
}

function ElementsOnlyConsumer() {
  const elements = useNavigationElements();
  return (
    <span data-testid="nav-count">{elements.length}</span>
  );
}

describe('LayoutContext', () => {
  describe('LayoutProvider', () => {
    it('should provide initial empty state', () => {
      render(
        <LayoutProvider>
          <LayoutConsumer />
        </LayoutProvider>
      );

      expect(screen.getByTestId('element-count')).toHaveTextContent('0');
    });

    it('should render children', () => {
      render(
        <LayoutProvider>
          <div data-testid="child">Child Content</div>
        </LayoutProvider>
      );

      expect(screen.getByTestId('child')).toHaveTextContent('Child Content');
    });
  });

  describe('useLayoutContext', () => {
    it('should throw error when used outside LayoutProvider', () => {
      const consoleError = console.error;
      console.error = () => {}; // Suppress React error boundary output

      expect(() => {
        render(<LayoutConsumer />);
      }).toThrow('useLayoutContext must be used within a LayoutProvider');

      console.error = consoleError;
    });

    it('should provide state and service', () => {
      render(
        <LayoutProvider>
          <LayoutConsumer />
        </LayoutProvider>
      );

      expect(screen.getByTestId('element-count')).toBeInTheDocument();
      expect(screen.getByTestId('add-element')).toBeInTheDocument();
      expect(screen.getByTestId('remove-element')).toBeInTheDocument();
      expect(screen.getByTestId('clear-elements')).toBeInTheDocument();
    });
  });

  describe('addNavigationElement', () => {
    it('should add a single navigation element', () => {
      render(
        <LayoutProvider>
          <LayoutConsumer />
        </LayoutProvider>
      );

      expect(screen.getByTestId('element-count')).toHaveTextContent('0');

      act(() => {
        screen.getByTestId('add-element').click();
      });

      expect(screen.getByTestId('element-count')).toHaveTextContent('1');
      expect(screen.getByTestId('element-test')).toHaveTextContent('test: order=10');
    });

    it('should add multiple navigation elements', () => {
      function MultiAddConsumer() {
        const { state, service } = useLayoutContext();
        return (
          <div>
            <span data-testid="count">{state.navigationElements.length}</span>
            <button
              data-testid="add-multiple"
              onClick={() =>
                service.addNavigationElement([
                  { name: 'first', element: 'First', order: 1 },
                  { name: 'second', element: 'Second', order: 2 },
                  { name: 'third', element: 'Third', order: 3 },
                ])
              }
            >
              Add Multiple
            </button>
          </div>
        );
      }

      render(
        <LayoutProvider>
          <MultiAddConsumer />
        </LayoutProvider>
      );

      act(() => {
        screen.getByTestId('add-multiple').click();
      });

      expect(screen.getByTestId('count')).toHaveTextContent('3');
    });

    it('should ignore duplicate names', () => {
      function DuplicateConsumer() {
        const { state, service } = useLayoutContext();
        return (
          <div>
            <span data-testid="count">{state.navigationElements.length}</span>
            <button
              data-testid="add-first"
              onClick={() =>
                service.addNavigationElement({ name: 'same', element: 'First' })
              }
            >
              Add First
            </button>
            <button
              data-testid="add-duplicate"
              onClick={() =>
                service.addNavigationElement({ name: 'same', element: 'Duplicate' })
              }
            >
              Add Duplicate
            </button>
          </div>
        );
      }

      render(
        <LayoutProvider>
          <DuplicateConsumer />
        </LayoutProvider>
      );

      act(() => {
        screen.getByTestId('add-first').click();
      });
      expect(screen.getByTestId('count')).toHaveTextContent('1');

      act(() => {
        screen.getByTestId('add-duplicate').click();
      });
      expect(screen.getByTestId('count')).toHaveTextContent('1'); // Still 1, duplicate ignored
    });

    it('should set default order to 99 when not specified', () => {
      function DefaultOrderConsumer() {
        const { state, service } = useLayoutContext();
        return (
          <div>
            <span data-testid="order">
              {state.navigationElements[0]?.order ?? 'none'}
            </span>
            <button
              data-testid="add-no-order"
              onClick={() =>
                service.addNavigationElement({ name: 'no-order', element: 'No Order' })
              }
            >
              Add No Order
            </button>
          </div>
        );
      }

      render(
        <LayoutProvider>
          <DefaultOrderConsumer />
        </LayoutProvider>
      );

      act(() => {
        screen.getByTestId('add-no-order').click();
      });

      expect(screen.getByTestId('order')).toHaveTextContent('99');
    });

    it('should sort elements by order', () => {
      function SortConsumer() {
        const { state, service } = useLayoutContext();
        return (
          <div>
            <span data-testid="first-name">
              {state.navigationElements[0]?.name ?? 'none'}
            </span>
            <span data-testid="second-name">
              {state.navigationElements[1]?.name ?? 'none'}
            </span>
            <button
              data-testid="add-unordered"
              onClick={() =>
                service.addNavigationElement([
                  { name: 'high', element: 'High', order: 50 },
                  { name: 'low', element: 'Low', order: 10 },
                ])
              }
            >
              Add Unordered
            </button>
          </div>
        );
      }

      render(
        <LayoutProvider>
          <SortConsumer />
        </LayoutProvider>
      );

      act(() => {
        screen.getByTestId('add-unordered').click();
      });

      expect(screen.getByTestId('first-name')).toHaveTextContent('low');
      expect(screen.getByTestId('second-name')).toHaveTextContent('high');
    });
  });

  describe('removeNavigationElement', () => {
    it('should remove an element by name', () => {
      render(
        <LayoutProvider>
          <LayoutConsumer />
        </LayoutProvider>
      );

      // Add first
      act(() => {
        screen.getByTestId('add-element').click();
      });
      expect(screen.getByTestId('element-count')).toHaveTextContent('1');

      // Remove
      act(() => {
        screen.getByTestId('remove-element').click();
      });
      expect(screen.getByTestId('element-count')).toHaveTextContent('0');
    });

    it('should do nothing when removing non-existent element', () => {
      function RemoveNonExistentConsumer() {
        const { state, service } = useLayoutContext();
        return (
          <div>
            <span data-testid="count">{state.navigationElements.length}</span>
            <button
              data-testid="add"
              onClick={() =>
                service.addNavigationElement({ name: 'exists', element: 'Exists' })
              }
            >
              Add
            </button>
            <button
              data-testid="remove-missing"
              onClick={() => service.removeNavigationElement('does-not-exist')}
            >
              Remove Missing
            </button>
          </div>
        );
      }

      render(
        <LayoutProvider>
          <RemoveNonExistentConsumer />
        </LayoutProvider>
      );

      act(() => {
        screen.getByTestId('add').click();
      });
      expect(screen.getByTestId('count')).toHaveTextContent('1');

      act(() => {
        screen.getByTestId('remove-missing').click();
      });
      expect(screen.getByTestId('count')).toHaveTextContent('1'); // Still 1
    });
  });

  describe('clearNavigationElements', () => {
    it('should clear all navigation elements', () => {
      function ClearConsumer() {
        const { state, service } = useLayoutContext();
        return (
          <div>
            <span data-testid="count">{state.navigationElements.length}</span>
            <button
              data-testid="add-multiple"
              onClick={() =>
                service.addNavigationElement([
                  { name: 'a', element: 'A' },
                  { name: 'b', element: 'B' },
                  { name: 'c', element: 'C' },
                ])
              }
            >
              Add Multiple
            </button>
            <button
              data-testid="clear"
              onClick={() => service.clearNavigationElements()}
            >
              Clear
            </button>
          </div>
        );
      }

      render(
        <LayoutProvider>
          <ClearConsumer />
        </LayoutProvider>
      );

      act(() => {
        screen.getByTestId('add-multiple').click();
      });
      expect(screen.getByTestId('count')).toHaveTextContent('3');

      act(() => {
        screen.getByTestId('clear').click();
      });
      expect(screen.getByTestId('count')).toHaveTextContent('0');
    });
  });

  describe('useLayoutService', () => {
    it('should return the layout service', () => {
      render(
        <LayoutProvider>
          <ServiceOnlyConsumer />
          <ElementsOnlyConsumer />
        </LayoutProvider>
      );

      expect(screen.getByTestId('nav-count')).toHaveTextContent('0');

      act(() => {
        screen.getByTestId('add-via-service').click();
      });

      expect(screen.getByTestId('nav-count')).toHaveTextContent('1');
    });
  });

  describe('useNavigationElements', () => {
    it('should return navigation elements array', () => {
      render(
        <LayoutProvider>
          <ElementsOnlyConsumer />
        </LayoutProvider>
      );

      expect(screen.getByTestId('nav-count')).toHaveTextContent('0');
    });
  });
});
