/**
 * Tests for NavItemsComponent v3.0.0
 * Updated to test the new NavItemsService integration
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { NavItemsComponent } from '../components/nav-items/NavItemsComponent';

// Mock useNavItems from @abpjs/theme-shared
const mockNavItems = vi.fn();
vi.mock('@abpjs/theme-shared', () => ({
  useNavItems: () => mockNavItems(),
  NavItem: {},
}));

// Mock Chakra UI components
vi.mock('@chakra-ui/react', () => ({
  Stack: ({ children, ...props }: any) => <div data-testid="stack" {...props}>{children}</div>,
  Box: ({ children, as, onClick, dangerouslySetInnerHTML, ...props }: any) => {
    const Component = as || 'div';
    if (dangerouslySetInnerHTML) {
      return (
        <Component
          data-testid="box-html"
          dangerouslySetInnerHTML={dangerouslySetInnerHTML}
          {...props}
        />
      );
    }
    return (
      <Component data-testid="box" onClick={onClick} {...props}>
        {children}
      </Component>
    );
  },
}));

describe('NavItemsComponent', () => {
  const renderComponent = (props = {}) => {
    return render(<NavItemsComponent {...props} />);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockNavItems.mockReturnValue([]);
  });

  describe('basic rendering', () => {
    it('should render stack container', () => {
      renderComponent();
      expect(screen.getByTestId('stack')).toBeInTheDocument();
    });

    it('should render empty when no nav items', () => {
      mockNavItems.mockReturnValue([]);
      renderComponent();
      expect(screen.getByTestId('stack').children).toHaveLength(0);
    });

    it('should accept smallScreen prop', () => {
      expect(() => renderComponent({ smallScreen: true })).not.toThrow();
    });
  });

  describe('rendering nav items with components', () => {
    it('should render component nav items', () => {
      const TestComponent = () => <div data-testid="test-component">Test</div>;
      mockNavItems.mockReturnValue([
        { id: 'test', component: TestComponent, order: 1 },
      ]);

      renderComponent();
      expect(screen.getByTestId('test-component')).toBeInTheDocument();
    });

    it('should render multiple component nav items', () => {
      const TestComponent1 = () => <div data-testid="test-1">Test 1</div>;
      const TestComponent2 = () => <div data-testid="test-2">Test 2</div>;
      mockNavItems.mockReturnValue([
        { id: 'test1', component: TestComponent1, order: 1 },
        { id: 'test2', component: TestComponent2, order: 2 },
      ]);

      renderComponent();
      expect(screen.getByTestId('test-1')).toBeInTheDocument();
      expect(screen.getByTestId('test-2')).toBeInTheDocument();
    });
  });

  describe('rendering nav items with HTML', () => {
    it('should render HTML nav items', () => {
      mockNavItems.mockReturnValue([
        { id: 'html-item', html: '<span>HTML Content</span>', order: 1 },
      ]);

      renderComponent();
      const htmlBox = screen.getByTestId('box-html');
      expect(htmlBox).toBeInTheDocument();
      expect(htmlBox.innerHTML).toBe('<span>HTML Content</span>');
    });

    it('should render multiple HTML nav items', () => {
      mockNavItems.mockReturnValue([
        { id: 'html-1', html: '<span>HTML 1</span>', order: 1 },
        { id: 'html-2', html: '<span>HTML 2</span>', order: 2 },
      ]);

      renderComponent();
      const htmlBoxes = screen.getAllByTestId('box-html');
      expect(htmlBoxes).toHaveLength(2);
    });
  });

  describe('rendering nav items with actions', () => {
    it('should render action nav items as buttons', () => {
      const mockAction = vi.fn();
      mockNavItems.mockReturnValue([
        { id: 'action-item', action: mockAction, order: 1 },
      ]);

      renderComponent();
      const actionBox = screen.getByTestId('box');
      expect(actionBox.tagName.toLowerCase()).toBe('button');
    });

    it('should call action when clicked', () => {
      const mockAction = vi.fn();
      mockNavItems.mockReturnValue([
        { id: 'action-item', action: mockAction, order: 1 },
      ]);

      renderComponent();
      fireEvent.click(screen.getByTestId('box'));
      expect(mockAction).toHaveBeenCalled();
    });
  });

  describe('rendering nav items with no content', () => {
    it('should render null for items without component, html, or action', () => {
      mockNavItems.mockReturnValue([
        { id: 'empty-item', order: 1 },
      ]);

      renderComponent();
      // The stack should have no content for items that return null
      const stack = screen.getByTestId('stack');
      // The item is rendered but returns null, so nothing appears
      expect(stack.textContent).toBe('');
    });
  });

  describe('priority of rendering types', () => {
    it('should prioritize component over html and action', () => {
      const TestComponent = () => <div data-testid="priority-component">Component</div>;
      const mockAction = vi.fn();
      mockNavItems.mockReturnValue([
        {
          id: 'priority-item',
          component: TestComponent,
          html: '<span>HTML</span>',
          action: mockAction,
          order: 1,
        },
      ]);

      renderComponent();
      expect(screen.getByTestId('priority-component')).toBeInTheDocument();
      expect(screen.queryByTestId('box-html')).not.toBeInTheDocument();
    });

    it('should use html when component is undefined', () => {
      const mockAction = vi.fn();
      mockNavItems.mockReturnValue([
        {
          id: 'html-priority',
          html: '<span>HTML Priority</span>',
          action: mockAction,
          order: 1,
        },
      ]);

      renderComponent();
      expect(screen.getByTestId('box-html')).toBeInTheDocument();
      expect(screen.getByTestId('box-html').innerHTML).toBe('<span>HTML Priority</span>');
    });

    it('should use action when component and html are undefined', () => {
      const mockAction = vi.fn();
      mockNavItems.mockReturnValue([
        {
          id: 'action-priority',
          action: mockAction,
          order: 1,
        },
      ]);

      renderComponent();
      const actionBox = screen.getByTestId('box');
      fireEvent.click(actionBox);
      expect(mockAction).toHaveBeenCalled();
    });
  });

  describe('mixed content types', () => {
    it('should handle mixed nav item types', () => {
      const TestComponent = () => <div data-testid="mixed-component">Component</div>;
      const mockAction = vi.fn();

      mockNavItems.mockReturnValue([
        { id: 'comp', component: TestComponent, order: 1 },
        { id: 'html', html: '<span>HTML</span>', order: 2 },
        { id: 'action', action: mockAction, order: 3 },
      ]);

      renderComponent();
      expect(screen.getByTestId('mixed-component')).toBeInTheDocument();
      expect(screen.getByTestId('box-html')).toBeInTheDocument();
      expect(screen.getByTestId('box')).toBeInTheDocument();
    });
  });

  describe('integration with NavItemsService', () => {
    it('should get items from useNavItems hook', () => {
      mockNavItems.mockReturnValue([]);
      renderComponent();
      expect(mockNavItems).toHaveBeenCalled();
    });

    it('should re-render when nav items change', () => {
      const TestComponent1 = () => <div data-testid="item-1">Item 1</div>;
      const TestComponent2 = () => <div data-testid="item-2">Item 2</div>;

      mockNavItems.mockReturnValue([
        { id: 'item1', component: TestComponent1, order: 1 },
      ]);

      const { rerender } = renderComponent();
      expect(screen.getByTestId('item-1')).toBeInTheDocument();
      expect(screen.queryByTestId('item-2')).not.toBeInTheDocument();

      mockNavItems.mockReturnValue([
        { id: 'item1', component: TestComponent1, order: 1 },
        { id: 'item2', component: TestComponent2, order: 2 },
      ]);

      rerender(<NavItemsComponent />);
      expect(screen.getByTestId('item-1')).toBeInTheDocument();
      expect(screen.getByTestId('item-2')).toBeInTheDocument();
    });
  });
});
