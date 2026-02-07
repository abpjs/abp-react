import { describe, it, expect, beforeEach } from 'vitest';
import {
  TreeAdapter,
  createTreeFromList,
  createListFromTree,
  createMapFromList,
} from '../../tree/utils/tree-adapter';
import { BaseNode } from '../../tree/models/base-node';
import { TreeNode } from '../../tree/models/tree-node';

interface TestNode extends BaseNode {
  id: string;
  parentId: string | null;
  name: string;
  displayName?: string;
}

describe('TreeAdapter', () => {
  const flatList: TestNode[] = [
    { id: '1', parentId: null, name: 'Root 1' },
    { id: '2', parentId: '1', name: 'Child 1.1' },
    { id: '3', parentId: '1', name: 'Child 1.2' },
    { id: '4', parentId: '2', name: 'Grandchild 1.1.1' },
    { id: '5', parentId: null, name: 'Root 2' },
  ];

  let adapter: TreeAdapter<TestNode>;

  beforeEach(() => {
    // Deep copy to avoid test pollution
    const listCopy = flatList.map(item => ({ ...item }));
    adapter = new TreeAdapter(listCopy);
  });

  describe('constructor', () => {
    it('should create adapter with empty list', () => {
      const emptyAdapter = new TreeAdapter<TestNode>();
      expect(emptyAdapter.getList()).toEqual([]);
      expect(emptyAdapter.getTree()).toEqual([]);
    });

    it('should create adapter with provided list', () => {
      expect(adapter.getList()).toHaveLength(5);
      expect(adapter.getTree()).toHaveLength(2); // 2 root nodes
    });
  });

  describe('getList', () => {
    it('should return the flat list', () => {
      const list = adapter.getList();
      expect(list).toHaveLength(5);
      expect(list[0].name).toBe('Root 1');
    });
  });

  describe('getTree', () => {
    it('should return the tree structure', () => {
      const tree = adapter.getTree();
      expect(tree).toHaveLength(2);

      // First root node
      const root1 = tree[0];
      expect(root1.key).toBe('1');
      expect(root1.title).toBe('Root 1');
      expect(root1.children).toHaveLength(2);
      expect(root1.isLeaf).toBe(false);

      // Child of first root
      const child1 = root1.children[0];
      expect(child1.key).toBe('2');
      expect(child1.children).toHaveLength(1);

      // Grandchild
      const grandchild = child1.children[0];
      expect(grandchild.key).toBe('4');
      expect(grandchild.isLeaf).toBe(true);

      // Second root node
      const root2 = tree[1];
      expect(root2.key).toBe('5');
      expect(root2.isLeaf).toBe(true);
    });

    it('should use displayName when available', () => {
      const listWithDisplayName: TestNode[] = [
        { id: '1', parentId: null, name: 'name1', displayName: 'Display Name 1' },
      ];
      const adapterWithDisplay = new TreeAdapter(listWithDisplayName);
      const tree = adapterWithDisplay.getTree();
      expect(tree[0].title).toBe('Display Name 1');
    });
  });

  describe('handleDrop', () => {
    it('should update node parent on drop', () => {
      const tree = adapter.getTree();
      const nodeToMove = tree[1]; // Root 2

      // Simulate dropping Root 2 under Root 1
      nodeToMove.parentNode = tree[0];
      adapter.handleDrop(nodeToMove);

      const updatedTree = adapter.getTree();
      expect(updatedTree).toHaveLength(1); // Only 1 root now
      expect(updatedTree[0].children).toHaveLength(3); // 2 original + 1 moved
    });

    it('should make node a root when dropped without parent', () => {
      const tree = adapter.getTree();
      const nodeToMove = tree[0].children[0]; // Child 1.1

      // Simulate making it a root
      nodeToMove.parentNode = null;
      adapter.handleDrop(nodeToMove);

      const updatedTree = adapter.getTree();
      expect(updatedTree).toHaveLength(3); // 2 original roots + 1 new root
    });
  });

  describe('handleRemove', () => {
    it('should remove node and its descendants', () => {
      const tree = adapter.getTree();
      const nodeToRemove = tree[0].children[0]; // Child 1.1 (has grandchild)

      adapter.handleRemove(nodeToRemove);

      const list = adapter.getList();
      expect(list).toHaveLength(3); // 5 - 1 removed - 1 grandchild

      // Verify the node and its child are removed
      expect(list.find((n) => n.id === '2')).toBeUndefined();
      expect(list.find((n) => n.id === '4')).toBeUndefined();
    });

    it('should remove leaf node', () => {
      const tree = adapter.getTree();
      const nodeToRemove = tree[1]; // Root 2 (leaf)

      adapter.handleRemove(nodeToRemove);

      const list = adapter.getList();
      expect(list).toHaveLength(4);
      expect(list.find((n) => n.id === '5')).toBeUndefined();
    });
  });

  describe('addNode', () => {
    it('should add new node to the list', () => {
      const newNode: TestNode = { id: '6', parentId: '1', name: 'New Child' };
      adapter.addNode(newNode);

      const list = adapter.getList();
      expect(list).toHaveLength(6);
      expect(list.find((n) => n.id === '6')).toBeDefined();

      const tree = adapter.getTree();
      const root1 = tree[0];
      expect(root1.children).toHaveLength(3);
    });

    it('should add new root node', () => {
      const newRoot: TestNode = { id: '6', parentId: null, name: 'New Root' };
      adapter.addNode(newRoot);

      const tree = adapter.getTree();
      expect(tree).toHaveLength(3);
    });
  });

  describe('updateNode', () => {
    it('should update existing node', () => {
      const updatedNode: TestNode = {
        id: '1',
        parentId: null,
        name: 'Updated Root 1',
      };
      adapter.updateNode(updatedNode);

      const list = adapter.getList();
      expect(list.find((n) => n.id === '1')?.name).toBe('Updated Root 1');

      const tree = adapter.getTree();
      expect(tree[0].title).toBe('Updated Root 1');
    });

    it('should not add node if id not found', () => {
      const nonExistentNode: TestNode = {
        id: '999',
        parentId: null,
        name: 'Non-existent',
      };
      adapter.updateNode(nonExistentNode);

      const list = adapter.getList();
      expect(list).toHaveLength(5);
      expect(list.find((n) => n.id === '999')).toBeUndefined();
    });
  });

  describe('findNode', () => {
    it('should find node by key', () => {
      const node = adapter.findNode('4'); // Grandchild
      expect(node).toBeDefined();
      expect(node?.key).toBe('4');
      expect(node?.title).toBe('Grandchild 1.1.1');
    });

    it('should return undefined for non-existent key', () => {
      const node = adapter.findNode('999');
      expect(node).toBeUndefined();
    });

    it('should find root node', () => {
      const node = adapter.findNode('1');
      expect(node).toBeDefined();
      expect(node?.title).toBe('Root 1');
    });
  });

  describe('getExpandedKeys', () => {
    it('should return empty array when no nodes expanded', () => {
      const keys = adapter.getExpandedKeys();
      expect(keys).toEqual([]);
    });

    it('should return expanded node keys', () => {
      const tree = adapter.getTree();
      tree[0].expanded = true;
      tree[0].children[0].expanded = true;

      const keys = adapter.getExpandedKeys();
      expect(keys).toContain('1');
      expect(keys).toContain('2');
      expect(keys).toHaveLength(2);
    });
  });

  describe('getCheckedKeys', () => {
    it('should return empty array when no nodes checked', () => {
      const keys = adapter.getCheckedKeys();
      expect(keys).toEqual([]);
    });

    it('should return checked node keys', () => {
      const tree = adapter.getTree();
      tree[0].checked = true;
      tree[1].checked = true;

      const keys = adapter.getCheckedKeys();
      expect(keys).toContain('1');
      expect(keys).toContain('5');
      expect(keys).toHaveLength(2);
    });
  });

  describe('setExpandedKeys', () => {
    it('should set expanded state for nodes', () => {
      adapter.setExpandedKeys(['1', '2']);

      const tree = adapter.getTree();
      expect(tree[0].expanded).toBe(true);
      expect(tree[0].children[0].expanded).toBe(true);
      expect(tree[0].children[1].expanded).toBe(false);
      expect(tree[1].expanded).toBe(false);
    });

    it('should clear expanded state when empty array', () => {
      const tree = adapter.getTree();
      tree[0].expanded = true;

      adapter.setExpandedKeys([]);

      expect(tree[0].expanded).toBe(false);
    });
  });

  describe('setCheckedKeys', () => {
    it('should set checked state for nodes', () => {
      adapter.setCheckedKeys(['1', '5']);

      const tree = adapter.getTree();
      expect(tree[0].checked).toBe(true);
      expect(tree[0].children[0].checked).toBe(false);
      expect(tree[1].checked).toBe(true);
    });
  });

  // v3.2.0: New methods
  describe('handleUpdate (v3.2.0)', () => {
    it('should replace children of a node', () => {
      const newChildren: TestNode[] = [
        { id: '10', parentId: '1', name: 'New Child 1' },
        { id: '11', parentId: '1', name: 'New Child 2' },
      ];

      adapter.handleUpdate({ key: '1', children: newChildren });

      const tree = adapter.getTree();
      const root1 = tree[0];

      // Should have 2 new children instead of original 2
      expect(root1.children).toHaveLength(2);
      expect(root1.children[0].key).toBe('10');
      expect(root1.children[0].title).toBe('New Child 1');
      expect(root1.children[1].key).toBe('11');
      expect(root1.children[1].title).toBe('New Child 2');
    });

    it('should remove all existing children before adding new ones', () => {
      const newChildren: TestNode[] = [
        { id: '10', parentId: '1', name: 'Only Child' },
      ];

      adapter.handleUpdate({ key: '1', children: newChildren });

      const list = adapter.getList();
      // Original direct children (id 2, 3) should be removed
      expect(list.find((n) => n.id === '2')).toBeUndefined();
      expect(list.find((n) => n.id === '3')).toBeUndefined();
      // Note: Grandchild (id 4) is not a direct child of '1', so handleUpdate
      // only removes direct children. This is correct behavior.
      // If we want to remove grandchildren too, we'd need a recursive approach.
    });

    it('should set correct parentId on new children', () => {
      const newChildren: TestNode[] = [
        { id: '10', parentId: null, name: 'Child without parent' },
      ];

      adapter.handleUpdate({ key: '1', children: newChildren });

      const list = adapter.getList();
      const newChild = list.find((n) => n.id === '10');
      expect(newChild?.parentId).toBe('1');
    });

    it('should handle empty children array', () => {
      adapter.handleUpdate({ key: '1', children: [] });

      const tree = adapter.getTree();
      const root1 = tree[0];
      expect(root1.children).toHaveLength(0);
      expect(root1.isLeaf).toBe(true);
    });

    it('should not affect nodes that are not children of target', () => {
      const newChildren: TestNode[] = [
        { id: '10', parentId: '1', name: 'New Child' },
      ];

      adapter.handleUpdate({ key: '1', children: newChildren });

      const list = adapter.getList();
      // Root 2 (id 5) should still exist
      expect(list.find((n) => n.id === '5')).toBeDefined();
      // Root 1 (id 1) should still exist
      expect(list.find((n) => n.id === '1')).toBeDefined();
    });

    it('should handle updating leaf node to have children', () => {
      const newChildren: TestNode[] = [
        { id: '10', parentId: '5', name: 'Child of Root 2' },
      ];

      adapter.handleUpdate({ key: '5', children: newChildren });

      const tree = adapter.getTree();
      const root2 = tree[1];
      expect(root2.isLeaf).toBe(false);
      expect(root2.children).toHaveLength(1);
      expect(root2.children[0].title).toBe('Child of Root 2');
    });
  });

  describe('updateTreeFromList (v3.2.0)', () => {
    it('should replace internal list and rebuild tree', () => {
      const newList: TestNode[] = [
        { id: 'a', parentId: null, name: 'New Root A' },
        { id: 'b', parentId: 'a', name: 'Child of A' },
        { id: 'c', parentId: null, name: 'New Root C' },
      ];

      const result = adapter.updateTreeFromList(newList);

      expect(result).toBe(newList);
      expect(adapter.getList()).toHaveLength(3);
      expect(adapter.getTree()).toHaveLength(2); // 2 root nodes
    });

    it('should return the updated list', () => {
      const newList: TestNode[] = [
        { id: 'x', parentId: null, name: 'X' },
      ];

      const result = adapter.updateTreeFromList(newList);

      expect(result).toEqual(newList);
    });

    it('should properly rebuild tree structure', () => {
      const newList: TestNode[] = [
        { id: 'root', parentId: null, name: 'Root' },
        { id: 'child1', parentId: 'root', name: 'Child 1' },
        { id: 'child2', parentId: 'root', name: 'Child 2' },
        { id: 'grandchild', parentId: 'child1', name: 'Grandchild' },
      ];

      adapter.updateTreeFromList(newList);

      const tree = adapter.getTree();
      expect(tree).toHaveLength(1);
      expect(tree[0].key).toBe('root');
      expect(tree[0].children).toHaveLength(2);
      expect(tree[0].children[0].key).toBe('child1');
      expect(tree[0].children[0].children).toHaveLength(1);
      expect(tree[0].children[0].children[0].key).toBe('grandchild');
    });

    it('should handle empty list', () => {
      adapter.updateTreeFromList([]);

      expect(adapter.getList()).toHaveLength(0);
      expect(adapter.getTree()).toHaveLength(0);
    });

    it('should clear previous data completely', () => {
      const newList: TestNode[] = [
        { id: 'new', parentId: null, name: 'New Node' },
      ];

      adapter.updateTreeFromList(newList);

      // Original nodes should be gone
      expect(adapter.findNode('1')).toBeUndefined();
      expect(adapter.findNode('2')).toBeUndefined();
      expect(adapter.findNode('5')).toBeUndefined();

      // Only new node should exist
      expect(adapter.findNode('new')).toBeDefined();
    });
  });

  describe('handleDrop with destructured params (v3.2.0)', () => {
    it('should work with destructured key and parentNode', () => {
      const tree = adapter.getTree();
      const nodeToMove = tree[1]; // Root 2

      // The method signature is now { key, parentNode }
      // Calling with a TreeNode that has these properties
      nodeToMove.parentNode = tree[0];
      adapter.handleDrop(nodeToMove);

      const updatedTree = adapter.getTree();
      expect(updatedTree).toHaveLength(1);
    });
  });

  describe('handleRemove with destructured params (v3.2.0)', () => {
    it('should work with destructured key', () => {
      const tree = adapter.getTree();
      const nodeToRemove = tree[1]; // Root 2

      // The method signature is now { key }
      adapter.handleRemove(nodeToRemove);

      const list = adapter.getList();
      expect(list.find((n) => n.id === '5')).toBeUndefined();
    });
  });
});

describe('createTreeFromList', () => {
  it('should handle empty list', () => {
    const tree = createTreeFromList([]);
    expect(tree).toEqual([]);
  });

  it('should handle single root node', () => {
    const list: TestNode[] = [{ id: '1', parentId: null, name: 'Root' }];
    const tree = createTreeFromList(list);
    expect(tree).toHaveLength(1);
    expect(tree[0].isLeaf).toBe(true);
  });

  it('should handle orphan nodes gracefully', () => {
    const list: TestNode[] = [
      { id: '1', parentId: null, name: 'Root' },
      { id: '2', parentId: '999', name: 'Orphan' }, // Parent doesn't exist
    ];
    const tree = createTreeFromList(list);
    expect(tree).toHaveLength(1); // Only root is in tree
    expect(tree[0].children).toHaveLength(0);
  });

  it('should use custom name resolver', () => {
    const list: TestNode[] = [
      { id: '1', parentId: null, name: 'Name1', displayName: 'Display1' },
    ];
    const customResolver = (entity: TestNode) =>
      `Custom: ${entity.name}`;
    const tree = createTreeFromList(list, customResolver);
    expect(tree[0].title).toBe('Custom: Name1');
  });
});

describe('createListFromTree', () => {
  it('should convert tree back to flat list', () => {
    const flatList: TestNode[] = [
      { id: '1', parentId: null, name: 'Root' },
      { id: '2', parentId: '1', name: 'Child' },
    ];
    const tree = createTreeFromList(flatList);
    const resultList = createListFromTree(tree);

    expect(resultList).toHaveLength(2);
    expect(resultList[0].id).toBe('1');
    expect(resultList[1].id).toBe('2');
    expect(resultList[1].parentId).toBe('1');
  });
});

describe('createMapFromList', () => {
  it('should create map from list', () => {
    const list: TestNode[] = [
      { id: '1', parentId: null, name: 'Root' },
      { id: '2', parentId: '1', name: 'Child' },
    ];
    const map = createMapFromList(list);

    expect(map.size).toBe(2);
    expect(map.get('1')).toBeInstanceOf(TreeNode);
    expect(map.get('1')?.title).toBe('Root');
    expect(map.get('2')?.title).toBe('Child');
  });
});

describe('TreeNode', () => {
  it('should create TreeNode with correct properties', () => {
    const entity: TestNode = { id: '1', parentId: null, name: 'Test' };
    const node = new TreeNode(entity);

    expect(node.id).toBe('1');
    expect(node.parentId).toBeNull();
    expect(node.key).toBe('1');
    expect(node.title).toBe('Test');
    expect(node.entity).toBe(entity);
    expect(node.isLeaf).toBe(true);
    expect(node.children).toEqual([]);
    expect(node.checked).toBe(false);
    expect(node.selected).toBe(false);
    expect(node.expanded).toBe(false);
    expect(node.selectable).toBe(true);
    expect(node.disabled).toBe(false);
    expect(node.disableCheckbox).toBe(false);
  });

  it('should use displayName over name', () => {
    const entity: TestNode = {
      id: '1',
      parentId: null,
      name: 'Name',
      displayName: 'Display Name',
    };
    const node = new TreeNode(entity);
    expect(node.title).toBe('Display Name');
  });
});
