import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ABP } from '../models/common';
import {
  RoutesService,
  SettingTabsService,
  getRoutesService,
  getSettingTabsService,
} from './routes.service';

describe('routes.service', () => {
  describe('RoutesService', () => {
    let routesService: RoutesService;

    beforeEach(() => {
      RoutesService.resetInstance();
      routesService = RoutesService.getInstance();
    });

    describe('singleton pattern', () => {
      it('should return the same instance', () => {
        const instance1 = RoutesService.getInstance();
        const instance2 = RoutesService.getInstance();

        expect(instance1).toBe(instance2);
      });

      it('should return new instance after reset', () => {
        const instance1 = RoutesService.getInstance();
        RoutesService.resetInstance();
        const instance2 = RoutesService.getInstance();

        expect(instance1).not.toBe(instance2);
      });
    });

    describe('add', () => {
      it('should add routes to flat list', () => {
        const routes: ABP.Route[] = [
          { name: 'Home', path: '/home' },
          { name: 'About', path: '/about' },
        ];

        routesService.add(routes);

        expect(routesService.flat).toHaveLength(2);
        expect(routesService.flat[0].name).toBe('Home');
        expect(routesService.flat[1].name).toBe('About');
      });

      it('should build tree structure from flat list', () => {
        const routes: ABP.Route[] = [
          { name: 'Parent', path: '/parent' },
          { name: 'Child', path: '/child', parentName: 'Parent' },
        ];

        routesService.add(routes);

        expect(routesService.tree).toHaveLength(1);
        expect(routesService.tree[0].name).toBe('Parent');
        expect(routesService.tree[0].children).toHaveLength(1);
        expect(routesService.tree[0].children[0].name).toBe('Child');
      });

      it('should accumulate routes on multiple adds', () => {
        routesService.add([{ name: 'First', path: '/first' }]);
        routesService.add([{ name: 'Second', path: '/second' }]);

        expect(routesService.flat).toHaveLength(2);
      });
    });

    describe('find', () => {
      beforeEach(() => {
        routesService.add([
          { name: 'Root', path: '/root' },
          { name: 'Child', path: '/child', parentName: 'Root' },
          { name: 'Grandchild', path: '/grandchild', parentName: 'Child' },
        ]);
      });

      it('should find root node by predicate', () => {
        const found = routesService.find((node) => node.name === 'Root');

        expect(found).not.toBeNull();
        expect(found!.name).toBe('Root');
      });

      it('should find nested node by predicate', () => {
        const found = routesService.find((node) => node.name === 'Grandchild');

        expect(found).not.toBeNull();
        expect(found!.name).toBe('Grandchild');
      });

      it('should return null when not found', () => {
        const found = routesService.find((node) => node.name === 'NonExistent');

        expect(found).toBeNull();
      });

      it('should find by path', () => {
        const found = routesService.find((node) => node.path === '/child');

        expect(found).not.toBeNull();
        expect(found!.name).toBe('Child');
      });
    });

    describe('search', () => {
      beforeEach(() => {
        routesService.add([
          { name: 'Home', path: '/home', order: 1 },
          { name: 'About', path: '/about', order: 2 },
          { name: 'Contact', path: '/contact', order: 3 },
        ]);
      });

      it('should search by partial properties', () => {
        const found = routesService.search({ name: 'About' });

        expect(found).not.toBeNull();
        expect(found!.path).toBe('/about');
      });

      it('should search by multiple properties', () => {
        const found = routesService.search({ name: 'Home', path: '/home' });

        expect(found).not.toBeNull();
        expect(found!.order).toBe(1);
      });

      it('should return null when no match', () => {
        const found = routesService.search({ name: 'NonExistent' });

        expect(found).toBeNull();
      });
    });

    describe('patch', () => {
      beforeEach(() => {
        routesService.add([
          { name: 'Home', path: '/home', order: 1 },
          { name: 'About', path: '/about', order: 2 },
        ]);
      });

      it('should patch existing item', () => {
        const result = routesService.patch('Home', { order: 10 });

        expect(result).not.toBe(false);
        const found = routesService.find((node) => node.name === 'Home');
        expect(found!.order).toBe(10);
      });

      it('should return false when item not found', () => {
        const result = routesService.patch('NonExistent', { order: 10 });

        expect(result).toBe(false);
      });

      it('should update flat list after patch', () => {
        routesService.patch('About', { path: '/about-us' });

        const patched = routesService.flat.find((r) => r.name === 'About');
        expect(patched!.path).toBe('/about-us');
      });
    });

    describe('remove', () => {
      beforeEach(() => {
        routesService.add([
          { name: 'Home', path: '/home' },
          { name: 'About', path: '/about' },
          { name: 'Contact', path: '/contact' },
        ]);
      });

      it('should remove items by identifiers', () => {
        routesService.remove(['About']);

        expect(routesService.flat).toHaveLength(2);
        expect(routesService.flat.find((r) => r.name === 'About')).toBeUndefined();
      });

      it('should remove multiple items', () => {
        routesService.remove(['Home', 'Contact']);

        expect(routesService.flat).toHaveLength(1);
        expect(routesService.flat[0].name).toBe('About');
      });

      it('should handle removing non-existent items gracefully', () => {
        routesService.remove(['NonExistent']);

        expect(routesService.flat).toHaveLength(3);
      });
    });

    describe('refresh', () => {
      it('should rebuild tree from flat list', () => {
        routesService.add([{ name: 'Test', path: '/test' }]);
        const _treeBeforeRefresh = routesService.tree;

        routesService.refresh();

        expect(routesService.tree).toHaveLength(1);
        expect(routesService.tree[0].name).toBe('Test');
      });
    });

    describe('visibility and permissions', () => {
      beforeEach(() => {
        routesService.add([
          { name: 'Public', path: '/public' },
          { name: 'Hidden', path: '/hidden', invisible: true },
          { name: 'Protected', path: '/protected', requiredPolicy: 'Admin.Access' },
        ]);
      });

      it('should filter out invisible items in visible tree', () => {
        expect(routesService.visible).toHaveLength(1);
        expect(routesService.visible[0].name).toBe('Public');
      });

      it('should include protected routes when policy is granted', () => {
        routesService.setGrantedPolicies({ 'Admin.Access': true });

        expect(routesService.visible).toHaveLength(2);
        expect(routesService.visible.find((r) => r.name === 'Protected')).toBeDefined();
      });

      it('should exclude protected routes when policy is not granted', () => {
        routesService.setGrantedPolicies({ 'Admin.Access': false });

        expect(routesService.visible).toHaveLength(1);
        expect(routesService.visible.find((r) => r.name === 'Protected')).toBeUndefined();
      });
    });

    describe('hasChildren', () => {
      beforeEach(() => {
        routesService.add([
          { name: 'Parent', path: '/parent' },
          { name: 'Child', path: '/child', parentName: 'Parent' },
          { name: 'Childless', path: '/childless' },
        ]);
      });

      it('should return true for node with children', () => {
        expect(routesService.hasChildren('Parent')).toBe(true);
      });

      it('should return false for node without children', () => {
        expect(routesService.hasChildren('Childless')).toBe(false);
      });

      it('should return false for non-existent node', () => {
        expect(routesService.hasChildren('NonExistent')).toBe(false);
      });
    });

    describe('hasInvisibleChild', () => {
      beforeEach(() => {
        routesService.add([
          { name: 'Parent', path: '/parent' },
          { name: 'VisibleChild', path: '/visible', parentName: 'Parent' },
          { name: 'HiddenChild', path: '/hidden', parentName: 'Parent', invisible: true },
        ]);
      });

      it('should return true when node has invisible children', () => {
        expect(routesService.hasInvisibleChild('Parent')).toBe(true);
      });

      it('should return false when all children are visible', () => {
        routesService.remove(['HiddenChild']);
        expect(routesService.hasInvisibleChild('Parent')).toBe(false);
      });

      it('should return false for non-existent node', () => {
        expect(routesService.hasInvisibleChild('NonExistent')).toBe(false);
      });
    });

    describe('sorting', () => {
      it('should sort routes by order', () => {
        routesService.add([
          { name: 'Third', path: '/third', order: 3 },
          { name: 'First', path: '/first', order: 1 },
          { name: 'Second', path: '/second', order: 2 },
        ]);

        expect(routesService.tree[0].name).toBe('First');
        expect(routesService.tree[1].name).toBe('Second');
        expect(routesService.tree[2].name).toBe('Third');
      });

      it('should sort children by order', () => {
        routesService.add([
          { name: 'Parent', path: '/parent', order: 1 },
          { name: 'ChildC', path: '/c', parentName: 'Parent', order: 3 },
          { name: 'ChildA', path: '/a', parentName: 'Parent', order: 1 },
          { name: 'ChildB', path: '/b', parentName: 'Parent', order: 2 },
        ]);

        const parent = routesService.tree[0];
        expect(parent.children[0].name).toBe('ChildA');
        expect(parent.children[1].name).toBe('ChildB');
        expect(parent.children[2].name).toBe('ChildC');
      });

      it('should handle items without order (defaults to 0)', () => {
        routesService.add([
          { name: 'WithOrder', path: '/with', order: 1 },
          { name: 'NoOrder', path: '/no' },
        ]);

        expect(routesService.tree[0].name).toBe('NoOrder'); // order 0 < order 1
        expect(routesService.tree[1].name).toBe('WithOrder');
      });
    });

    describe('subscribe', () => {
      it('should notify listeners on add', () => {
        const listener = vi.fn();
        routesService.subscribe(listener);

        routesService.add([{ name: 'Test', path: '/test' }]);

        expect(listener).toHaveBeenCalled();
      });

      it('should notify listeners on remove', () => {
        routesService.add([{ name: 'Test', path: '/test' }]);
        const listener = vi.fn();
        routesService.subscribe(listener);

        routesService.remove(['Test']);

        expect(listener).toHaveBeenCalled();
      });

      it('should notify listeners on patch', () => {
        routesService.add([{ name: 'Test', path: '/test' }]);
        const listener = vi.fn();
        routesService.subscribe(listener);

        routesService.patch('Test', { order: 1 });

        expect(listener).toHaveBeenCalled();
      });

      it('should unsubscribe correctly', () => {
        const listener = vi.fn();
        const unsubscribe = routesService.subscribe(listener);

        unsubscribe();
        routesService.add([{ name: 'Test', path: '/test' }]);

        expect(listener).not.toHaveBeenCalled();
      });

      it('should support multiple listeners', () => {
        const listener1 = vi.fn();
        const listener2 = vi.fn();
        routesService.subscribe(listener1);
        routesService.subscribe(listener2);

        routesService.add([{ name: 'Test', path: '/test' }]);

        expect(listener1).toHaveBeenCalled();
        expect(listener2).toHaveBeenCalled();
      });
    });

    describe('destroy', () => {
      it('should not throw when called', () => {
        expect(() => routesService.destroy()).not.toThrow();
      });
    });
  });

  describe('SettingTabsService', () => {
    let settingTabsService: SettingTabsService;

    beforeEach(() => {
      SettingTabsService.resetInstance();
      settingTabsService = SettingTabsService.getInstance();
    });

    describe('singleton pattern', () => {
      it('should return the same instance', () => {
        const instance1 = SettingTabsService.getInstance();
        const instance2 = SettingTabsService.getInstance();

        expect(instance1).toBe(instance2);
      });

      it('should return new instance after reset', () => {
        const instance1 = SettingTabsService.getInstance();
        SettingTabsService.resetInstance();
        const instance2 = SettingTabsService.getInstance();

        expect(instance1).not.toBe(instance2);
      });
    });

    describe('add', () => {
      it('should add tabs to flat list', () => {
        const tabs: ABP.Tab[] = [
          { name: 'General', component: 'GeneralSettings' },
          { name: 'Security', component: 'SecuritySettings' },
        ];

        settingTabsService.add(tabs);

        expect(settingTabsService.flat).toHaveLength(2);
      });
    });

    describe('find', () => {
      it('should find tab by name', () => {
        settingTabsService.add([
          { name: 'General', component: 'GeneralSettings' },
          { name: 'Security', component: 'SecuritySettings' },
        ]);

        const found = settingTabsService.find((tab) => tab.name === 'Security');

        expect(found).not.toBeNull();
        expect(found!.component).toBe('SecuritySettings');
      });
    });
  });

  describe('factory functions', () => {
    beforeEach(() => {
      RoutesService.resetInstance();
      SettingTabsService.resetInstance();
    });

    describe('getRoutesService', () => {
      it('should return RoutesService singleton', () => {
        const service = getRoutesService();

        expect(service).toBeInstanceOf(RoutesService);
        expect(service).toBe(RoutesService.getInstance());
      });
    });

    describe('getSettingTabsService', () => {
      it('should return SettingTabsService singleton', () => {
        const service = getSettingTabsService();

        expect(service).toBeInstanceOf(SettingTabsService);
        expect(service).toBe(SettingTabsService.getInstance());
      });
    });
  });

  describe('tree node properties', () => {
    let routesService: RoutesService;

    beforeEach(() => {
      RoutesService.resetInstance();
      routesService = RoutesService.getInstance();
    });

    it('should set isLeaf property correctly', () => {
      routesService.add([
        { name: 'Parent', path: '/parent' },
        { name: 'Child', path: '/child', parentName: 'Parent' },
      ]);

      const parent = routesService.tree[0];
      const child = parent.children[0];

      expect(parent.isLeaf).toBe(false);
      expect(child.isLeaf).toBe(true);
    });

    it('should set parent reference correctly', () => {
      routesService.add([
        { name: 'Parent', path: '/parent' },
        { name: 'Child', path: '/child', parentName: 'Parent' },
      ]);

      const parent = routesService.tree[0];
      const child = parent.children[0];

      expect(child.parent).toBe(parent);
      expect(parent.parent).toBeUndefined();
    });
  });
});
