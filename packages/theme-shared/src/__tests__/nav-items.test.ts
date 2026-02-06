import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  addNavItem,
  removeNavItem,
  clearNavItems,
  getNavItemsSync,
  subscribeToNavItems,
  getNavItems,
  type NavItem,
} from '../utils/nav-items';

describe('nav-items (v2.9.0)', () => {
  beforeEach(() => {
    clearNavItems();
  });

  describe('addNavItem', () => {
    it('should add a nav item', () => {
      const item: NavItem = {
        html: '<span>Test</span>',
        order: 1,
      };

      addNavItem(item);

      const items = getNavItemsSync();
      expect(items).toHaveLength(1);
      expect(items[0]).toEqual(item);
    });

    it('should add multiple nav items', () => {
      const item1: NavItem = { html: 'Item 1', order: 1 };
      const item2: NavItem = { html: 'Item 2', order: 2 };

      addNavItem(item1);
      addNavItem(item2);

      const items = getNavItemsSync();
      expect(items).toHaveLength(2);
    });

    it('should sort items by order', () => {
      const item1: NavItem = { html: 'Third', order: 30 };
      const item2: NavItem = { html: 'First', order: 10 };
      const item3: NavItem = { html: 'Second', order: 20 };

      addNavItem(item1);
      addNavItem(item2);
      addNavItem(item3);

      const items = getNavItemsSync();
      expect(items[0].html).toBe('First');
      expect(items[1].html).toBe('Second');
      expect(items[2].html).toBe('Third');
    });

    it('should handle items without order (default to 0)', () => {
      const item1: NavItem = { html: 'With order', order: 10 };
      const item2: NavItem = { html: 'Without order' };

      addNavItem(item1);
      addNavItem(item2);

      const items = getNavItemsSync();
      expect(items[0].html).toBe('Without order');
      expect(items[1].html).toBe('With order');
    });

    it('should accept nav item with component', () => {
      const MockComponent = () => null;
      const item: NavItem = {
        component: MockComponent,
        order: 1,
      };

      addNavItem(item);

      const items = getNavItemsSync();
      expect(items[0].component).toBe(MockComponent);
    });

    it('should accept nav item with action', () => {
      const mockAction = vi.fn();
      const item: NavItem = {
        action: mockAction,
        order: 1,
      };

      addNavItem(item);

      const items = getNavItemsSync();
      expect(items[0].action).toBe(mockAction);
    });

    it('should accept nav item with permission', () => {
      const item: NavItem = {
        html: 'Protected',
        permission: 'AbpIdentity.Users',
        order: 1,
      };

      addNavItem(item);

      const items = getNavItemsSync();
      expect(items[0].permission).toBe('AbpIdentity.Users');
    });

    it('should accept nav item with all properties', () => {
      const MockComponent = () => null;
      const mockAction = vi.fn();
      const item: NavItem = {
        component: MockComponent,
        html: '<span>Test</span>',
        action: mockAction,
        order: 5,
        permission: 'Admin.Access',
      };

      addNavItem(item);

      const items = getNavItemsSync();
      expect(items[0]).toEqual(item);
    });
  });

  describe('removeNavItem', () => {
    it('should remove a nav item', () => {
      const item: NavItem = { html: 'Test', order: 1 };

      addNavItem(item);
      expect(getNavItemsSync()).toHaveLength(1);

      removeNavItem(item);
      expect(getNavItemsSync()).toHaveLength(0);
    });

    it('should remove only the specified item', () => {
      const item1: NavItem = { html: 'Item 1', order: 1 };
      const item2: NavItem = { html: 'Item 2', order: 2 };

      addNavItem(item1);
      addNavItem(item2);

      removeNavItem(item1);

      const items = getNavItemsSync();
      expect(items).toHaveLength(1);
      expect(items[0]).toEqual(item2);
    });

    it('should not throw when removing non-existent item', () => {
      const item: NavItem = { html: 'Test', order: 1 };

      expect(() => removeNavItem(item)).not.toThrow();
      expect(getNavItemsSync()).toHaveLength(0);
    });

    it('should handle removing same item twice', () => {
      const item: NavItem = { html: 'Test', order: 1 };

      addNavItem(item);
      removeNavItem(item);
      removeNavItem(item);

      expect(getNavItemsSync()).toHaveLength(0);
    });
  });

  describe('clearNavItems', () => {
    it('should clear all nav items', () => {
      addNavItem({ html: 'Item 1', order: 1 });
      addNavItem({ html: 'Item 2', order: 2 });
      addNavItem({ html: 'Item 3', order: 3 });

      expect(getNavItemsSync()).toHaveLength(3);

      clearNavItems();

      expect(getNavItemsSync()).toHaveLength(0);
    });

    it('should not throw when called on empty list', () => {
      expect(() => clearNavItems()).not.toThrow();
      expect(getNavItemsSync()).toHaveLength(0);
    });

    it('should allow adding items after clear', () => {
      addNavItem({ html: 'Item 1', order: 1 });
      clearNavItems();
      addNavItem({ html: 'Item 2', order: 2 });

      expect(getNavItemsSync()).toHaveLength(1);
      expect(getNavItemsSync()[0].html).toBe('Item 2');
    });
  });

  describe('getNavItemsSync', () => {
    it('should return empty array when no items', () => {
      const items = getNavItemsSync();
      expect(items).toEqual([]);
    });

    it('should return copy of items (not reference)', () => {
      const item: NavItem = { html: 'Test', order: 1 };
      addNavItem(item);

      const items1 = getNavItemsSync();
      const items2 = getNavItemsSync();

      expect(items1).not.toBe(items2);
      expect(items1).toEqual(items2);
    });

    it('should return items in order', () => {
      addNavItem({ html: 'C', order: 3 });
      addNavItem({ html: 'A', order: 1 });
      addNavItem({ html: 'B', order: 2 });

      const items = getNavItemsSync();
      expect(items.map((i) => i.html)).toEqual(['A', 'B', 'C']);
    });
  });

  describe('subscribeToNavItems', () => {
    it('should call callback immediately with current items', () => {
      const item: NavItem = { html: 'Test', order: 1 };
      addNavItem(item);

      const callback = vi.fn();
      subscribeToNavItems(callback);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith([item]);
    });

    it('should call callback when item is added', () => {
      const callback = vi.fn();
      subscribeToNavItems(callback);

      const item: NavItem = { html: 'Test', order: 1 };
      addNavItem(item);

      expect(callback).toHaveBeenCalledTimes(2); // Initial + add
      expect(callback).toHaveBeenLastCalledWith([item]);
    });

    it('should call callback when item is removed', () => {
      const item: NavItem = { html: 'Test', order: 1 };
      addNavItem(item);

      const callback = vi.fn();
      subscribeToNavItems(callback);

      removeNavItem(item);

      expect(callback).toHaveBeenCalledTimes(2); // Initial + remove
      expect(callback).toHaveBeenLastCalledWith([]);
    });

    it('should call callback when items are cleared', () => {
      addNavItem({ html: 'Test', order: 1 });

      const callback = vi.fn();
      subscribeToNavItems(callback);

      clearNavItems();

      expect(callback).toHaveBeenCalledTimes(2); // Initial + clear
      expect(callback).toHaveBeenLastCalledWith([]);
    });

    it('should return unsubscribe function', () => {
      const callback = vi.fn();
      const unsubscribe = subscribeToNavItems(callback);

      expect(typeof unsubscribe).toBe('function');
    });

    it('should stop calling callback after unsubscribe', () => {
      const callback = vi.fn();
      const unsubscribe = subscribeToNavItems(callback);

      expect(callback).toHaveBeenCalledTimes(1);

      unsubscribe();

      addNavItem({ html: 'Test', order: 1 });

      expect(callback).toHaveBeenCalledTimes(1); // No additional calls
    });

    it('should support multiple subscribers', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      subscribeToNavItems(callback1);
      subscribeToNavItems(callback2);

      addNavItem({ html: 'Test', order: 1 });

      expect(callback1).toHaveBeenCalledTimes(2); // Initial + add
      expect(callback2).toHaveBeenCalledTimes(2); // Initial + add
    });

    it('should handle unsubscribe from one subscriber without affecting others', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      const unsubscribe1 = subscribeToNavItems(callback1);
      subscribeToNavItems(callback2);

      unsubscribe1();

      addNavItem({ html: 'Test', order: 1 });

      expect(callback1).toHaveBeenCalledTimes(1); // Only initial
      expect(callback2).toHaveBeenCalledTimes(2); // Initial + add
    });
  });

  describe('getNavItems', () => {
    it('should return object with subscribe method', () => {
      const observable = getNavItems();
      expect(observable).toHaveProperty('subscribe');
      expect(typeof observable.subscribe).toBe('function');
    });

    it('should call callback immediately when subscribed', () => {
      const callback = vi.fn();
      getNavItems().subscribe(callback);

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should return object with unsubscribe method', () => {
      const callback = vi.fn();
      const subscription = getNavItems().subscribe(callback);

      expect(subscription).toHaveProperty('unsubscribe');
      expect(typeof subscription.unsubscribe).toBe('function');
    });

    it('should stop notifications after unsubscribe', () => {
      const callback = vi.fn();
      const subscription = getNavItems().subscribe(callback);

      expect(callback).toHaveBeenCalledTimes(1);

      subscription.unsubscribe();

      addNavItem({ html: 'Test', order: 1 });

      expect(callback).toHaveBeenCalledTimes(1); // No additional calls
    });

    it('should be compatible with Observable-like pattern', () => {
      const items: NavItem[][] = [];
      const subscription = getNavItems().subscribe((navItems) => {
        items.push(navItems);
      });

      addNavItem({ html: 'Item 1', order: 1 });
      addNavItem({ html: 'Item 2', order: 2 });

      expect(items).toHaveLength(3); // Initial + 2 adds
      expect(items[0]).toHaveLength(0);
      expect(items[1]).toHaveLength(1);
      expect(items[2]).toHaveLength(2);

      subscription.unsubscribe();
    });
  });

  describe('NavItem interface', () => {
    it('should allow minimal NavItem', () => {
      const item: NavItem = {};
      addNavItem(item);

      expect(getNavItemsSync()).toHaveLength(1);
    });

    it('should allow NavItem with only component', () => {
      const MockComponent = () => null;
      const item: NavItem = { component: MockComponent };

      addNavItem(item);
      expect(getNavItemsSync()[0].component).toBe(MockComponent);
    });

    it('should allow NavItem with only html', () => {
      const item: NavItem = { html: '<span>Test</span>' };

      addNavItem(item);
      expect(getNavItemsSync()[0].html).toBe('<span>Test</span>');
    });

    it('should allow NavItem with only action', () => {
      const action = vi.fn();
      const item: NavItem = { action };

      addNavItem(item);
      expect(getNavItemsSync()[0].action).toBe(action);
    });

    it('should allow NavItem with only order', () => {
      const item: NavItem = { order: 100 };

      addNavItem(item);
      expect(getNavItemsSync()[0].order).toBe(100);
    });

    it('should allow NavItem with only permission', () => {
      const item: NavItem = { permission: 'Admin.Users' };

      addNavItem(item);
      expect(getNavItemsSync()[0].permission).toBe('Admin.Users');
    });
  });
});
