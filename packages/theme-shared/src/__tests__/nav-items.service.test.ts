import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NavItemsService, getNavItemsService } from '../services/nav-items.service';
import { NavItem, type NavItemProps } from '../models/nav-item';

describe('NavItemsService (v3.1.0)', () => {
  beforeEach(() => {
    NavItemsService.resetInstance();
  });

  describe('getInstance', () => {
    it('should return a singleton instance', () => {
      const instance1 = NavItemsService.getInstance();
      const instance2 = NavItemsService.getInstance();

      expect(instance1).toBe(instance2);
    });

    it('should return the same instance across multiple calls', () => {
      const instances = Array.from({ length: 5 }, () => NavItemsService.getInstance());

      expect(new Set(instances).size).toBe(1);
    });
  });

  describe('resetInstance', () => {
    it('should create a new instance after reset', () => {
      const instance1 = NavItemsService.getInstance();
      instance1.addItems([{ id: 'test', order: 1 }]);

      NavItemsService.resetInstance();

      const instance2 = NavItemsService.getInstance();
      expect(instance2.items).toHaveLength(0);
    });

    it('should not affect existing references', () => {
      const instance1 = NavItemsService.getInstance();
      instance1.addItems([{ id: 'test', order: 1 }]);

      NavItemsService.resetInstance();

      // Old instance still has items
      expect(instance1.items).toHaveLength(1);
    });
  });

  describe('items getter', () => {
    it('should return empty array initially', () => {
      const service = NavItemsService.getInstance();
      expect(service.items).toEqual([]);
    });

    it('should return copy of items (not reference)', () => {
      const service = NavItemsService.getInstance();
      service.addItems([{ id: 'test', order: 1 }]);

      const items1 = service.items;
      const items2 = service.items;

      expect(items1).not.toBe(items2);
      expect(items1).toEqual(items2);
    });

    it('should return items sorted by order', () => {
      const service = NavItemsService.getInstance();
      service.addItems([
        { id: 'third', order: 30 },
        { id: 'first', order: 10 },
        { id: 'second', order: 20 },
      ]);

      const items = service.items;
      expect(items[0].id).toBe('first');
      expect(items[1].id).toBe('second');
      expect(items[2].id).toBe('third');
    });

    it('should handle items without order (default to 0)', () => {
      const service = NavItemsService.getInstance();
      service.addItems([
        { id: 'with-order', order: 10 },
        { id: 'without-order' },
      ]);

      const items = service.items;
      expect(items[0].id).toBe('without-order');
      expect(items[1].id).toBe('with-order');
    });

    it('should handle negative order values', () => {
      const service = NavItemsService.getInstance();
      service.addItems([
        { id: 'positive', order: 10 },
        { id: 'negative', order: -5 },
        { id: 'zero', order: 0 },
      ]);

      const items = service.items;
      expect(items[0].id).toBe('negative');
      expect(items[1].id).toBe('zero');
      expect(items[2].id).toBe('positive');
    });
  });

  describe('addItems', () => {
    it('should add a single item', () => {
      const service = NavItemsService.getInstance();
      const item: NavItem = { id: 'test', order: 1 };

      service.addItems([item]);

      expect(service.items).toHaveLength(1);
      expect(service.items[0]).toEqual(item);
    });

    it('should add multiple items at once', () => {
      const service = NavItemsService.getInstance();
      const items: NavItem[] = [
        { id: 'item1', order: 1 },
        { id: 'item2', order: 2 },
        { id: 'item3', order: 3 },
      ];

      service.addItems(items);

      expect(service.items).toHaveLength(3);
    });

    it('should add items incrementally', () => {
      const service = NavItemsService.getInstance();

      service.addItems([{ id: 'item1', order: 1 }]);
      service.addItems([{ id: 'item2', order: 2 }]);

      expect(service.items).toHaveLength(2);
    });

    it('should not add duplicate items (same id)', () => {
      const service = NavItemsService.getInstance();

      service.addItems([{ id: 'duplicate', order: 1 }]);
      service.addItems([{ id: 'duplicate', order: 2 }]); // Same id, different order

      expect(service.items).toHaveLength(1);
      expect(service.items[0].order).toBe(1); // Original order preserved
    });

    it('should handle duplicates in a single call (allows them since filtering is by existing items)', () => {
      const service = NavItemsService.getInstance();

      // Note: addItems only filters against existing items, not within the same call
      // This matches the Angular implementation behavior
      service.addItems([
        { id: 'unique1', order: 1 },
        { id: 'duplicate', order: 2 },
        { id: 'unique2', order: 3 },
        { id: 'duplicate', order: 4 }, // Both duplicates are added
      ]);

      // Both duplicates are added (implementation filters against existing, not within batch)
      const items = service.items;
      expect(items).toHaveLength(4);
    });

    it('should handle empty array', () => {
      const service = NavItemsService.getInstance();

      service.addItems([]);

      expect(service.items).toHaveLength(0);
    });

    it('should accept items with all properties', () => {
      const service = NavItemsService.getInstance();
      const MockComponent = () => null;
      const mockAction = vi.fn();

      const item: NavItem = {
        id: 'full-item',
        component: MockComponent,
        html: '<span>Test</span>',
        action: mockAction,
        order: 5,
        requiredPolicy: 'Admin.Access',
      };

      service.addItems([item]);

      const result = service.items[0];
      expect(result.id).toBe('full-item');
      expect(result.component).toBe(MockComponent);
      expect(result.html).toBe('<span>Test</span>');
      expect(result.action).toBe(mockAction);
      expect(result.order).toBe(5);
      expect(result.requiredPolicy).toBe('Admin.Access');
    });

    it('should accept numeric ids', () => {
      const service = NavItemsService.getInstance();

      service.addItems([
        { id: 1, order: 1 },
        { id: 2, order: 2 },
      ]);

      expect(service.items).toHaveLength(2);
      expect(service.items[0].id).toBe(1);
    });

    it('should notify subscribers when items are added', () => {
      const service = NavItemsService.getInstance();
      const callback = vi.fn();

      service.subscribe(callback);
      callback.mockClear(); // Clear initial call

      service.addItems([{ id: 'test', order: 1 }]);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({ id: 'test' })]));
    });
  });

  describe('removeItem', () => {
    it('should remove an item by string id', () => {
      const service = NavItemsService.getInstance();
      service.addItems([
        { id: 'keep', order: 1 },
        { id: 'remove', order: 2 },
      ]);

      service.removeItem('remove');

      expect(service.items).toHaveLength(1);
      expect(service.items[0].id).toBe('keep');
    });

    it('should remove an item by numeric id', () => {
      const service = NavItemsService.getInstance();
      service.addItems([
        { id: 1, order: 1 },
        { id: 2, order: 2 },
      ]);

      service.removeItem(1);

      expect(service.items).toHaveLength(1);
      expect(service.items[0].id).toBe(2);
    });

    it('should not throw when removing non-existent item', () => {
      const service = NavItemsService.getInstance();
      service.addItems([{ id: 'existing', order: 1 }]);

      expect(() => service.removeItem('non-existent')).not.toThrow();
      expect(service.items).toHaveLength(1);
    });

    it('should not notify when removing non-existent item', () => {
      const service = NavItemsService.getInstance();
      const callback = vi.fn();

      service.subscribe(callback);
      callback.mockClear();

      service.removeItem('non-existent');

      expect(callback).not.toHaveBeenCalled();
    });

    it('should notify subscribers when item is removed', () => {
      const service = NavItemsService.getInstance();
      service.addItems([{ id: 'test', order: 1 }]);

      const callback = vi.fn();
      service.subscribe(callback);
      callback.mockClear();

      service.removeItem('test');

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith([]);
    });

    it('should handle removing same item twice', () => {
      const service = NavItemsService.getInstance();
      service.addItems([{ id: 'test', order: 1 }]);

      service.removeItem('test');
      service.removeItem('test');

      expect(service.items).toHaveLength(0);
    });
  });

  describe('patchItem', () => {
    it('should update order of existing item', () => {
      const service = NavItemsService.getInstance();
      service.addItems([{ id: 'test', order: 1 }]);

      service.patchItem('test', { order: 100 });

      expect(service.items[0].order).toBe(100);
    });

    it('should update requiredPolicy of existing item', () => {
      const service = NavItemsService.getInstance();
      service.addItems([{ id: 'test', order: 1 }]);

      service.patchItem('test', { requiredPolicy: 'Admin.Users' });

      expect(service.items[0].requiredPolicy).toBe('Admin.Users');
    });

    it('should update multiple properties at once', () => {
      const service = NavItemsService.getInstance();
      const mockAction = vi.fn();
      service.addItems([{ id: 'test', order: 1, html: 'old' }]);

      service.patchItem('test', {
        order: 50,
        html: 'new',
        action: mockAction,
      });

      const item = service.items[0];
      expect(item.order).toBe(50);
      expect(item.html).toBe('new');
      expect(item.action).toBe(mockAction);
    });

    it('should preserve id when patching', () => {
      const service = NavItemsService.getInstance();
      service.addItems([{ id: 'test', order: 1 }]);

      service.patchItem('test', { order: 100 });

      expect(service.items[0].id).toBe('test');
    });

    it('should preserve unpatched properties', () => {
      const service = NavItemsService.getInstance();
      service.addItems([
        {
          id: 'test',
          order: 1,
          html: 'original',
          requiredPolicy: 'original-policy',
        },
      ]);

      service.patchItem('test', { order: 100 });

      const item = service.items[0];
      expect(item.html).toBe('original');
      expect(item.requiredPolicy).toBe('original-policy');
    });

    it('should not throw when patching non-existent item', () => {
      const service = NavItemsService.getInstance();

      expect(() => service.patchItem('non-existent', { order: 100 })).not.toThrow();
    });

    it('should not notify when patching non-existent item', () => {
      const service = NavItemsService.getInstance();
      const callback = vi.fn();

      service.subscribe(callback);
      callback.mockClear();

      service.patchItem('non-existent', { order: 100 });

      expect(callback).not.toHaveBeenCalled();
    });

    it('should notify subscribers when item is patched', () => {
      const service = NavItemsService.getInstance();
      service.addItems([{ id: 'test', order: 1 }]);

      const callback = vi.fn();
      service.subscribe(callback);
      callback.mockClear();

      service.patchItem('test', { order: 100 });

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should work with numeric ids', () => {
      const service = NavItemsService.getInstance();
      service.addItems([{ id: 123, order: 1 }]);

      service.patchItem(123, { order: 999 });

      expect(service.items[0].order).toBe(999);
    });

    it('should allow setting properties to undefined', () => {
      const service = NavItemsService.getInstance();
      service.addItems([{ id: 'test', order: 1, html: 'original' }]);

      service.patchItem('test', { html: undefined });

      expect(service.items[0].html).toBeUndefined();
    });
  });

  describe('clear', () => {
    it('should clear all items', () => {
      const service = NavItemsService.getInstance();
      service.addItems([
        { id: 'item1', order: 1 },
        { id: 'item2', order: 2 },
        { id: 'item3', order: 3 },
      ]);

      service.clear();

      expect(service.items).toHaveLength(0);
    });

    it('should not throw when called on empty service', () => {
      const service = NavItemsService.getInstance();

      expect(() => service.clear()).not.toThrow();
    });

    it('should not notify when clearing empty service', () => {
      const service = NavItemsService.getInstance();
      const callback = vi.fn();

      service.subscribe(callback);
      callback.mockClear();

      service.clear();

      expect(callback).not.toHaveBeenCalled();
    });

    it('should notify subscribers when items are cleared', () => {
      const service = NavItemsService.getInstance();
      service.addItems([{ id: 'test', order: 1 }]);

      const callback = vi.fn();
      service.subscribe(callback);
      callback.mockClear();

      service.clear();

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith([]);
    });

    it('should allow adding items after clear', () => {
      const service = NavItemsService.getInstance();
      service.addItems([{ id: 'old', order: 1 }]);
      service.clear();
      service.addItems([{ id: 'new', order: 2 }]);

      expect(service.items).toHaveLength(1);
      expect(service.items[0].id).toBe('new');
    });
  });

  describe('subscribe', () => {
    it('should call callback immediately with current items', () => {
      const service = NavItemsService.getInstance();
      service.addItems([{ id: 'existing', order: 1 }]);

      const callback = vi.fn();
      service.subscribe(callback);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith([expect.objectContaining({ id: 'existing' })]);
    });

    it('should call callback immediately with empty array if no items', () => {
      const service = NavItemsService.getInstance();

      const callback = vi.fn();
      service.subscribe(callback);

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith([]);
    });

    it('should return unsubscribe function', () => {
      const service = NavItemsService.getInstance();

      const callback = vi.fn();
      const unsubscribe = service.subscribe(callback);

      expect(typeof unsubscribe).toBe('function');
    });

    it('should stop calling callback after unsubscribe', () => {
      const service = NavItemsService.getInstance();

      const callback = vi.fn();
      const unsubscribe = service.subscribe(callback);
      callback.mockClear();

      unsubscribe();

      service.addItems([{ id: 'test', order: 1 }]);

      expect(callback).not.toHaveBeenCalled();
    });

    it('should support multiple subscribers', () => {
      const service = NavItemsService.getInstance();

      const callback1 = vi.fn();
      const callback2 = vi.fn();

      service.subscribe(callback1);
      service.subscribe(callback2);

      callback1.mockClear();
      callback2.mockClear();

      service.addItems([{ id: 'test', order: 1 }]);

      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    it('should handle unsubscribe from one subscriber without affecting others', () => {
      const service = NavItemsService.getInstance();

      const callback1 = vi.fn();
      const callback2 = vi.fn();

      const unsubscribe1 = service.subscribe(callback1);
      service.subscribe(callback2);

      callback1.mockClear();
      callback2.mockClear();

      unsubscribe1();

      service.addItems([{ id: 'test', order: 1 }]);

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalledTimes(1);
    });

    it('should handle double unsubscribe gracefully', () => {
      const service = NavItemsService.getInstance();

      const callback = vi.fn();
      const unsubscribe = service.subscribe(callback);

      unsubscribe();
      expect(() => unsubscribe()).not.toThrow();
    });

    it('should receive sorted items', () => {
      const service = NavItemsService.getInstance();
      service.addItems([
        { id: 'third', order: 30 },
        { id: 'first', order: 10 },
        { id: 'second', order: 20 },
      ]);

      const callback = vi.fn();
      service.subscribe(callback);

      const receivedItems = callback.mock.calls[0][0];
      expect(receivedItems[0].id).toBe('first');
      expect(receivedItems[1].id).toBe('second');
      expect(receivedItems[2].id).toBe('third');
    });
  });

  describe('items$', () => {
    it('should return object with subscribe method', () => {
      const service = NavItemsService.getInstance();
      const items$ = service.items$;

      expect(items$).toHaveProperty('subscribe');
      expect(typeof items$.subscribe).toBe('function');
    });

    it('should call callback immediately when subscribed', () => {
      const service = NavItemsService.getInstance();
      const callback = vi.fn();

      service.items$.subscribe(callback);

      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('should return object with unsubscribe method', () => {
      const service = NavItemsService.getInstance();
      const callback = vi.fn();

      const subscription = service.items$.subscribe(callback);

      expect(subscription).toHaveProperty('unsubscribe');
      expect(typeof subscription.unsubscribe).toBe('function');
    });

    it('should stop notifications after unsubscribe', () => {
      const service = NavItemsService.getInstance();
      const callback = vi.fn();

      const subscription = service.items$.subscribe(callback);
      callback.mockClear();

      subscription.unsubscribe();

      service.addItems([{ id: 'test', order: 1 }]);

      expect(callback).not.toHaveBeenCalled();
    });

    it('should be compatible with Observable-like pattern', () => {
      const service = NavItemsService.getInstance();
      const items: NavItem[][] = [];

      const subscription = service.items$.subscribe((navItems) => {
        items.push(navItems);
      });

      service.addItems([{ id: 'item1', order: 1 }]);
      service.addItems([{ id: 'item2', order: 2 }]);

      expect(items).toHaveLength(3); // Initial + 2 adds
      expect(items[0]).toHaveLength(0);
      expect(items[1]).toHaveLength(1);
      expect(items[2]).toHaveLength(2);

      subscription.unsubscribe();
    });
  });

  describe('getNavItemsService', () => {
    it('should return the singleton instance', () => {
      const instance1 = getNavItemsService();
      const instance2 = NavItemsService.getInstance();

      expect(instance1).toBe(instance2);
    });

    it('should return the same instance on multiple calls', () => {
      const instance1 = getNavItemsService();
      const instance2 = getNavItemsService();

      expect(instance1).toBe(instance2);
    });
  });

  describe('NavItem interface v3.0.0 features', () => {
    it('should require id property', () => {
      const service = NavItemsService.getInstance();

      // This test verifies the id property is being used correctly
      service.addItems([{ id: 'required-id' }]);

      expect(service.items[0].id).toBe('required-id');
    });

    it('should support requiredPolicy property (renamed from permission)', () => {
      const service = NavItemsService.getInstance();

      service.addItems([{ id: 'test', requiredPolicy: 'AbpIdentity.Users' }]);

      expect(service.items[0].requiredPolicy).toBe('AbpIdentity.Users');
    });

    it('should support string ids', () => {
      const service = NavItemsService.getInstance();

      service.addItems([{ id: 'string-id', order: 1 }]);

      expect(service.items[0].id).toBe('string-id');
    });

    it('should support number ids', () => {
      const service = NavItemsService.getInstance();

      service.addItems([{ id: 42, order: 1 }]);

      expect(service.items[0].id).toBe(42);
    });
  });

  describe('v3.1.0 features - addItems with NavItem class and NavItemProps', () => {
    it('should accept NavItem instances', () => {
      const service = NavItemsService.getInstance();
      const navItem = new NavItem({ id: 'class-item', order: 1 });

      service.addItems([navItem]);

      expect(service.items).toHaveLength(1);
      expect(service.items[0].id).toBe('class-item');
      expect(service.items[0]).toBeInstanceOf(NavItem);
    });

    it('should accept NavItemProps objects and convert to NavItem instances', () => {
      const service = NavItemsService.getInstance();
      const props: NavItemProps = { id: 'props-item', order: 1 };

      service.addItems([props]);

      expect(service.items).toHaveLength(1);
      expect(service.items[0].id).toBe('props-item');
      expect(service.items[0]).toBeInstanceOf(NavItem);
    });

    it('should accept mixed NavItem instances and NavItemProps', () => {
      const service = NavItemsService.getInstance();
      const navItem = new NavItem({ id: 'class-item', order: 1 });
      const props: NavItemProps = { id: 'props-item', order: 2 };

      service.addItems([navItem, props]);

      expect(service.items).toHaveLength(2);
      expect(service.items[0]).toBeInstanceOf(NavItem);
      expect(service.items[1]).toBeInstanceOf(NavItem);
    });

    it('should preserve NavItem instance when already an instance', () => {
      const service = NavItemsService.getInstance();
      const mockVisible = vi.fn(() => true);
      const navItem = new NavItem({
        id: 'original',
        order: 1,
        visible: mockVisible,
      });

      service.addItems([navItem]);

      expect(service.items[0]).toBe(navItem);
      expect(service.items[0].visible).toBe(mockVisible);
    });

    it('should support visible callback in NavItem', () => {
      const service = NavItemsService.getInstance();
      const mockVisible = vi.fn(() => true);

      service.addItems([
        new NavItem({
          id: 'visible-item',
          order: 1,
          visible: mockVisible,
        }),
      ]);

      expect(service.items[0].visible).toBe(mockVisible);
      expect(service.items[0].visible?.()).toBe(true);
      expect(mockVisible).toHaveBeenCalled();
    });

    it('should support visible callback in NavItemProps', () => {
      const service = NavItemsService.getInstance();
      let isVisible = false;
      const mockVisible = () => isVisible;

      service.addItems([
        {
          id: 'dynamic-visible',
          order: 1,
          visible: mockVisible,
        },
      ]);

      expect(service.items[0].visible?.()).toBe(false);

      isVisible = true;
      expect(service.items[0].visible?.()).toBe(true);
    });

    it('should handle items with all v3.1.0 properties', () => {
      const service = NavItemsService.getInstance();
      const MockComponent = () => null;
      const mockAction = vi.fn();
      const mockVisible = vi.fn(() => true);

      const fullItem = new NavItem({
        id: 'full-v31-item',
        component: MockComponent,
        html: '<span>Test</span>',
        action: mockAction,
        order: 10,
        requiredPolicy: 'Admin.Access',
        visible: mockVisible,
      });

      service.addItems([fullItem]);

      const result = service.items[0];
      expect(result.id).toBe('full-v31-item');
      expect(result.component).toBe(MockComponent);
      expect(result.html).toBe('<span>Test</span>');
      expect(result.action).toBe(mockAction);
      expect(result.order).toBe(10);
      expect(result.requiredPolicy).toBe('Admin.Access');
      expect(result.visible).toBe(mockVisible);
    });

    it('should convert NavItemProps without visible to NavItem', () => {
      const service = NavItemsService.getInstance();

      service.addItems([
        { id: 'no-visible', order: 1 },
      ]);

      expect(service.items[0]).toBeInstanceOf(NavItem);
      expect(service.items[0].visible).toBeUndefined();
    });

    it('should filter duplicates when mixing NavItem and NavItemProps with same id', () => {
      const service = NavItemsService.getInstance();
      const navItem = new NavItem({ id: 'duplicate', order: 1 });

      service.addItems([navItem]);
      service.addItems([{ id: 'duplicate', order: 2 }]); // Same id, should be filtered

      expect(service.items).toHaveLength(1);
      expect(service.items[0].order).toBe(1); // Original order preserved
    });

    it('should handle empty id in NavItemProps (defaults to empty string)', () => {
      const service = NavItemsService.getInstance();

      service.addItems([new NavItem({})]);

      expect(service.items[0].id).toBe('');
    });
  });

  describe('v3.1.0 newItems parameter name', () => {
    it('should accept newItems array (renamed from items in v3.1.0)', () => {
      const service = NavItemsService.getInstance();
      const newItems = [
        new NavItem({ id: 'item1', order: 1 }),
        new NavItem({ id: 'item2', order: 2 }),
      ];

      service.addItems(newItems);

      expect(service.items).toHaveLength(2);
    });
  });

  describe('edge cases', () => {
    it('should handle items with same order', () => {
      const service = NavItemsService.getInstance();
      service.addItems([
        { id: 'a', order: 10 },
        { id: 'b', order: 10 },
        { id: 'c', order: 10 },
      ]);

      // All items should be present
      expect(service.items).toHaveLength(3);
    });

    it('should handle rapid add/remove operations', () => {
      const service = NavItemsService.getInstance();

      for (let i = 0; i < 100; i++) {
        service.addItems([{ id: `item-${i}`, order: i }]);
      }

      for (let i = 0; i < 50; i++) {
        service.removeItem(`item-${i}`);
      }

      expect(service.items).toHaveLength(50);
    });

    it('should handle concurrent subscribers', () => {
      const service = NavItemsService.getInstance();
      const callbacks = Array.from({ length: 10 }, () => vi.fn());

      const unsubscribes = callbacks.map((cb) => service.subscribe(cb));

      service.addItems([{ id: 'test', order: 1 }]);

      callbacks.forEach((cb) => {
        expect(cb).toHaveBeenCalledTimes(2); // Initial + add
      });

      // Unsubscribe all
      unsubscribes.forEach((unsub) => unsub());

      service.addItems([{ id: 'test2', order: 2 }]);

      callbacks.forEach((cb) => {
        expect(cb).toHaveBeenCalledTimes(2); // No additional calls
      });
    });

    it('should handle very large order numbers', () => {
      const service = NavItemsService.getInstance();
      service.addItems([
        { id: 'max', order: Number.MAX_SAFE_INTEGER },
        { id: 'min', order: Number.MIN_SAFE_INTEGER },
        { id: 'normal', order: 0 },
      ]);

      const items = service.items;
      expect(items[0].id).toBe('min');
      expect(items[1].id).toBe('normal');
      expect(items[2].id).toBe('max');
    });
  });
});
