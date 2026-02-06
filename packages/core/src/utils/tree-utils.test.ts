import { describe, it, expect } from 'vitest';
import {
  TreeNode,
  BaseTreeNode,
  createTreeFromList,
  createMapFromList,
  findInTree,
  flattenTree,
  sortTree,
} from './tree-utils';

describe('tree-utils', () => {
  // Sample data for testing
  interface TestItem {
    id: string;
    name: string;
    parentId: string | null;
    order?: number;
  }

  const sampleFlatList: TestItem[] = [
    { id: '1', name: 'Root 1', parentId: null },
    { id: '2', name: 'Root 2', parentId: null },
    { id: '3', name: 'Child 1-1', parentId: '1' },
    { id: '4', name: 'Child 1-2', parentId: '1' },
    { id: '5', name: 'Child 2-1', parentId: '2' },
    { id: '6', name: 'Grandchild 1-1-1', parentId: '3' },
  ];

  describe('BaseTreeNode', () => {
    it('should create a tree node with default values', () => {
      const props = { id: '1', name: 'Test' };
      const node = new BaseTreeNode(props);

      expect(node.children).toEqual([]);
      expect(node.isLeaf).toBe(true);
      expect(node.parent).toBeUndefined();
    });

    it('should assign props to the node', () => {
      const props = { id: '1', name: 'Test', extra: 'value' };
      const node = new BaseTreeNode(props);

      expect((node as any).id).toBe('1');
      expect((node as any).name).toBe('Test');
      expect((node as any).extra).toBe('value');
    });

    it('should create a tree node using static create method', () => {
      const props = { id: '1', name: 'Test' };
      const node = BaseTreeNode.create(props);

      expect(node.id).toBe('1');
      expect(node.name).toBe('Test');
      expect(node.children).toEqual([]);
      expect(node.isLeaf).toBe(true);
      expect(node.parent).toBeUndefined();
    });
  });

  describe('createTreeFromList', () => {
    it('should create a tree from a flat list', () => {
      const tree = createTreeFromList<TestItem, TestItem>(
        sampleFlatList,
        (item) => item.id,
        (item) => item.parentId,
        (item) => item
      );

      expect(tree).toHaveLength(2); // Two root nodes
      expect(tree[0].id).toBe('1');
      expect(tree[1].id).toBe('2');
    });

    it('should set up parent-child relationships correctly', () => {
      const tree = createTreeFromList<TestItem, TestItem>(
        sampleFlatList,
        (item) => item.id,
        (item) => item.parentId,
        (item) => item
      );

      const root1 = tree.find((n) => n.id === '1')!;
      expect(root1.children).toHaveLength(2);
      expect(root1.isLeaf).toBe(false);

      const child11 = root1.children.find((n) => n.id === '3')!;
      expect(child11.parent).toBe(root1);
      expect(child11.children).toHaveLength(1);
      expect(child11.isLeaf).toBe(false);

      const grandchild = child11.children[0];
      expect(grandchild.id).toBe('6');
      expect(grandchild.parent).toBe(child11);
      expect(grandchild.isLeaf).toBe(true);
    });

    it('should handle empty list', () => {
      const tree = createTreeFromList<TestItem, TestItem>(
        [],
        (item) => item.id,
        (item) => item.parentId,
        (item) => item
      );

      expect(tree).toHaveLength(0);
    });

    it('should handle list with only root nodes', () => {
      const roots: TestItem[] = [
        { id: '1', name: 'Root 1', parentId: null },
        { id: '2', name: 'Root 2', parentId: null },
      ];

      const tree = createTreeFromList<TestItem, TestItem>(
        roots,
        (item) => item.id,
        (item) => item.parentId,
        (item) => item
      );

      expect(tree).toHaveLength(2);
      expect(tree[0].isLeaf).toBe(true);
      expect(tree[1].isLeaf).toBe(true);
    });

    it('should handle items with undefined parent', () => {
      const items: TestItem[] = [
        { id: '1', name: 'Root', parentId: null },
        { id: '2', name: 'Child', parentId: undefined as any },
      ];

      const tree = createTreeFromList<TestItem, TestItem>(
        items,
        (item) => item.id,
        (item) => item.parentId,
        (item) => item
      );

      expect(tree).toHaveLength(2); // Both treated as roots
    });

    it('should handle orphan items (parent not in list)', () => {
      const items: TestItem[] = [
        { id: '1', name: 'Root', parentId: null },
        { id: '2', name: 'Orphan', parentId: 'non-existent' },
      ];

      const tree = createTreeFromList<TestItem, TestItem>(
        items,
        (item) => item.id,
        (item) => item.parentId,
        (item) => item
      );

      expect(tree).toHaveLength(2); // Orphan becomes root
    });

    it('should apply value mapper correctly', () => {
      interface MappedItem {
        key: string;
        label: string;
      }

      const tree = createTreeFromList<TestItem, MappedItem>(
        sampleFlatList.slice(0, 2),
        (item) => item.id,
        (item) => item.parentId,
        (item) => ({ key: item.id, label: item.name })
      );

      expect(tree[0].key).toBe('1');
      expect(tree[0].label).toBe('Root 1');
    });
  });

  describe('createMapFromList', () => {
    it('should create a map from a flat list', () => {
      const map = createMapFromList<TestItem, string>(
        sampleFlatList,
        (item) => item.id,
        (item) => item.name
      );

      expect(map.size).toBe(6);
      expect(map.get('1')).toBe('Root 1');
      expect(map.get('6')).toBe('Grandchild 1-1-1');
    });

    it('should handle empty list', () => {
      const map = createMapFromList<TestItem, string>(
        [],
        (item) => item.id,
        (item) => item.name
      );

      expect(map.size).toBe(0);
    });

    it('should handle numeric keys', () => {
      interface NumericItem {
        id: number;
        value: string;
      }

      const items: NumericItem[] = [
        { id: 1, value: 'one' },
        { id: 2, value: 'two' },
      ];

      const map = createMapFromList<NumericItem, string>(
        items,
        (item) => item.id,
        (item) => item.value
      );

      expect(map.get(1)).toBe('one');
      expect(map.get(2)).toBe('two');
    });

    it('should overwrite duplicate keys', () => {
      const items: TestItem[] = [
        { id: '1', name: 'First', parentId: null },
        { id: '1', name: 'Second', parentId: null },
      ];

      const map = createMapFromList<TestItem, string>(
        items,
        (item) => item.id,
        (item) => item.name
      );

      expect(map.size).toBe(1);
      expect(map.get('1')).toBe('Second');
    });
  });

  describe('findInTree', () => {
    let tree: TreeNode<TestItem>[];

    beforeEach(() => {
      tree = createTreeFromList<TestItem, TestItem>(
        sampleFlatList,
        (item) => item.id,
        (item) => item.parentId,
        (item) => item
      );
    });

    it('should find a root node', () => {
      const found = findInTree(tree, (node) => node.id === '1');

      expect(found).not.toBeNull();
      expect(found!.id).toBe('1');
      expect(found!.name).toBe('Root 1');
    });

    it('should find a child node', () => {
      const found = findInTree(tree, (node) => node.id === '3');

      expect(found).not.toBeNull();
      expect(found!.id).toBe('3');
      expect(found!.name).toBe('Child 1-1');
    });

    it('should find a deeply nested node', () => {
      const found = findInTree(tree, (node) => node.id === '6');

      expect(found).not.toBeNull();
      expect(found!.id).toBe('6');
      expect(found!.name).toBe('Grandchild 1-1-1');
    });

    it('should return null when node not found', () => {
      const found = findInTree(tree, (node) => node.id === 'non-existent');

      expect(found).toBeNull();
    });

    it('should return null for empty tree', () => {
      const found = findInTree([], (node) => node.id === '1');

      expect(found).toBeNull();
    });

    it('should find by custom predicate', () => {
      const found = findInTree(tree, (node) => node.name.includes('Grandchild'));

      expect(found).not.toBeNull();
      expect(found!.id).toBe('6');
    });
  });

  describe('flattenTree', () => {
    let tree: TreeNode<TestItem>[];

    beforeEach(() => {
      tree = createTreeFromList<TestItem, TestItem>(
        sampleFlatList,
        (item) => item.id,
        (item) => item.parentId,
        (item) => item
      );
    });

    it('should flatten a tree into a list', () => {
      const flat = flattenTree(tree);

      expect(flat).toHaveLength(6);
    });

    it('should include all nodes from nested tree', () => {
      const flat = flattenTree(tree);
      const ids = flat.map((n) => n.id);

      expect(ids).toContain('1');
      expect(ids).toContain('2');
      expect(ids).toContain('3');
      expect(ids).toContain('4');
      expect(ids).toContain('5');
      expect(ids).toContain('6');
    });

    it('should handle empty tree', () => {
      const flat = flattenTree([]);

      expect(flat).toHaveLength(0);
    });

    it('should handle tree with only root nodes', () => {
      const roots = createTreeFromList<TestItem, TestItem>(
        [
          { id: '1', name: 'Root 1', parentId: null },
          { id: '2', name: 'Root 2', parentId: null },
        ],
        (item) => item.id,
        (item) => item.parentId,
        (item) => item
      );

      const flat = flattenTree(roots);

      expect(flat).toHaveLength(2);
    });

    it('should preserve parent references', () => {
      const flat = flattenTree(tree);
      const grandchild = flat.find((n) => n.id === '6');

      expect(grandchild).not.toBeUndefined();
      expect(grandchild!.parent).not.toBeUndefined();
      expect(grandchild!.parent!.id).toBe('3');
    });
  });

  describe('sortTree', () => {
    it('should sort tree nodes by comparator', () => {
      const items: TestItem[] = [
        { id: '1', name: 'Root 1', parentId: null, order: 2 },
        { id: '2', name: 'Root 2', parentId: null, order: 1 },
        { id: '3', name: 'Child 1-1', parentId: '1', order: 2 },
        { id: '4', name: 'Child 1-2', parentId: '1', order: 1 },
      ];

      const tree = createTreeFromList<TestItem, TestItem>(
        items,
        (item) => item.id,
        (item) => item.parentId,
        (item) => item
      );

      const sorted = sortTree(tree, (a, b) => (a.order ?? 0) - (b.order ?? 0));

      expect(sorted[0].id).toBe('2'); // order: 1
      expect(sorted[1].id).toBe('1'); // order: 2
    });

    it('should sort children recursively', () => {
      const items: TestItem[] = [
        { id: '1', name: 'Root', parentId: null, order: 1 },
        { id: '2', name: 'Child B', parentId: '1', order: 2 },
        { id: '3', name: 'Child A', parentId: '1', order: 1 },
      ];

      const tree = createTreeFromList<TestItem, TestItem>(
        items,
        (item) => item.id,
        (item) => item.parentId,
        (item) => item
      );

      const sorted = sortTree(tree, (a, b) => (a.order ?? 0) - (b.order ?? 0));

      expect(sorted[0].children[0].id).toBe('3'); // order: 1
      expect(sorted[0].children[1].id).toBe('2'); // order: 2
    });

    it('should handle empty tree', () => {
      const sorted = sortTree<TestItem>([], (a, b) => (a.order ?? 0) - (b.order ?? 0));

      expect(sorted).toHaveLength(0);
    });

    it('should sort by name alphabetically', () => {
      const items: TestItem[] = [
        { id: '1', name: 'Zebra', parentId: null },
        { id: '2', name: 'Apple', parentId: null },
        { id: '3', name: 'Mango', parentId: null },
      ];

      const tree = createTreeFromList<TestItem, TestItem>(
        items,
        (item) => item.id,
        (item) => item.parentId,
        (item) => item
      );

      const sorted = sortTree(tree, (a, b) => a.name.localeCompare(b.name));

      expect(sorted[0].name).toBe('Apple');
      expect(sorted[1].name).toBe('Mango');
      expect(sorted[2].name).toBe('Zebra');
    });

    it('should not mutate original tree', () => {
      const items: TestItem[] = [
        { id: '1', name: 'B', parentId: null, order: 2 },
        { id: '2', name: 'A', parentId: null, order: 1 },
      ];

      const tree = createTreeFromList<TestItem, TestItem>(
        items,
        (item) => item.id,
        (item) => item.parentId,
        (item) => item
      );

      const originalFirstId = tree[0].id;
      const sorted = sortTree(tree, (a, b) => (a.order ?? 0) - (b.order ?? 0));

      expect(tree[0].id).toBe(originalFirstId);
      expect(sorted[0].id).not.toBe(originalFirstId);
    });
  });

  describe('TreeNode type', () => {
    it('should have correct type structure', () => {
      const node: TreeNode<TestItem> = {
        id: '1',
        name: 'Test',
        parentId: null,
        children: [],
        isLeaf: true,
        parent: undefined,
      };

      expect(node.id).toBe('1');
      expect(node.children).toEqual([]);
      expect(node.isLeaf).toBe(true);
    });
  });
});
