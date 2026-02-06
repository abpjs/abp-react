/**
 * Tests for TreeAdapter Utility
 * @abpjs/identity-pro v2.9.0
 */
import { describe, it, expect } from 'vitest';
import {
  TreeAdapter,
  createTreeNode,
  BaseNode,
  TreeNode,
} from '../../utils/tree-adapter';

// Helper to create test nodes
const createTestNode = (
  id: string,
  parentId: string | null = null,
  displayName?: string
): BaseNode => ({
  id,
  parentId,
  displayName: displayName || `Node ${id}`,
});

describe('createTreeNode', () => {
  it('should create a tree node from entity', () => {
    const entity = createTestNode('1', null, 'Root Node');
    const node = createTreeNode(entity);

    expect(node.entity).toBe(entity);
    expect(node.key).toBe('1');
    expect(node.id).toBe('1');
    expect(node.parentId).toBeNull();
    expect(node.title).toBe('Root Node');
    expect(node.children).toEqual([]);
    expect(node.isLeaf).toBe(true);
    expect(node.checked).toBe(false);
    expect(node.selected).toBe(false);
    expect(node.expanded).toBe(false);
    expect(node.selectable).toBe(true);
    expect(node.disabled).toBe(false);
    expect(node.disableCheckbox).toBe(false);
    expect(node.parentNode).toBeNull();
    expect(node.icon).toBeNull();
  });

  it('should use name property when displayName is not available', () => {
    const entity: BaseNode = {
      id: '1',
      parentId: null,
      name: 'Named Node',
    };
    const node = createTreeNode(entity);

    expect(node.title).toBe('Named Node');
  });

  it('should use custom name resolver', () => {
    const entity = createTestNode('1', null, 'Original');
    const resolver = (e: BaseNode) => `Custom: ${e.displayName}`;
    const node = createTreeNode(entity, resolver);

    expect(node.title).toBe('Custom: Original');
  });

  it('should handle missing name and displayName', () => {
    const entity: BaseNode = {
      id: '1',
      parentId: null,
    };
    const node = createTreeNode(entity);

    expect(node.title).toBe('');
  });
});

describe('TreeAdapter', () => {
  describe('constructor', () => {
    it('should create empty tree adapter', () => {
      const adapter = new TreeAdapter();

      expect(adapter.getList()).toEqual([]);
      expect(adapter.getTree()).toEqual([]);
    });

    it('should create tree adapter with initial list', () => {
      const nodes = [
        createTestNode('1', null),
        createTestNode('2', null),
      ];
      const adapter = new TreeAdapter(nodes);

      expect(adapter.getList()).toHaveLength(2);
      expect(adapter.getTree()).toHaveLength(2);
    });

    it('should accept custom name resolver', () => {
      const nodes = [createTestNode('1', null, 'Test')];
      const resolver = (e: BaseNode) => `Prefix: ${e.displayName}`;
      const adapter = new TreeAdapter(nodes, resolver);

      expect(adapter.getTree()[0].title).toBe('Prefix: Test');
    });
  });

  describe('setList', () => {
    it('should update list and rebuild tree', () => {
      const adapter = new TreeAdapter();
      const nodes = [createTestNode('1', null)];

      adapter.setList(nodes);

      expect(adapter.getList()).toHaveLength(1);
      expect(adapter.getTree()).toHaveLength(1);
    });

    it('should replace existing list', () => {
      const adapter = new TreeAdapter([createTestNode('old', null)]);
      adapter.setList([createTestNode('new', null)]);

      expect(adapter.getList()).toHaveLength(1);
      expect(adapter.getList()[0].id).toBe('new');
    });
  });

  describe('tree building', () => {
    it('should build flat tree from root nodes only', () => {
      const nodes = [
        createTestNode('1', null, 'Root 1'),
        createTestNode('2', null, 'Root 2'),
        createTestNode('3', null, 'Root 3'),
      ];
      const adapter = new TreeAdapter(nodes);

      expect(adapter.getTree()).toHaveLength(3);
      adapter.getTree().forEach((node) => {
        expect(node.isLeaf).toBe(true);
        expect(node.children).toHaveLength(0);
        expect(node.parentNode).toBeNull();
      });
    });

    it('should build hierarchical tree with parent-child relationships', () => {
      const nodes = [
        createTestNode('root', null, 'Root'),
        createTestNode('child1', 'root', 'Child 1'),
        createTestNode('child2', 'root', 'Child 2'),
      ];
      const adapter = new TreeAdapter(nodes);
      const tree = adapter.getTree();

      expect(tree).toHaveLength(1);
      expect(tree[0].id).toBe('root');
      expect(tree[0].isLeaf).toBe(false);
      expect(tree[0].children).toHaveLength(2);

      tree[0].children.forEach((child) => {
        expect(child.parentNode).toBe(tree[0]);
        expect(child.isLeaf).toBe(true);
      });
    });

    it('should build deep hierarchy', () => {
      const nodes = [
        createTestNode('level1', null, 'Level 1'),
        createTestNode('level2', 'level1', 'Level 2'),
        createTestNode('level3', 'level2', 'Level 3'),
        createTestNode('level4', 'level3', 'Level 4'),
      ];
      const adapter = new TreeAdapter(nodes);
      const tree = adapter.getTree();

      expect(tree).toHaveLength(1);
      expect(tree[0].children).toHaveLength(1);
      expect(tree[0].children[0].children).toHaveLength(1);
      expect(tree[0].children[0].children[0].children).toHaveLength(1);
      expect(tree[0].children[0].children[0].children[0].isLeaf).toBe(true);
    });

    it('should handle orphaned nodes as root nodes', () => {
      const nodes = [
        createTestNode('child', 'non-existent-parent', 'Orphan'),
      ];
      const adapter = new TreeAdapter(nodes);

      expect(adapter.getTree()).toHaveLength(1);
      expect(adapter.getTree()[0].parentNode).toBeNull();
    });

    it('should sort children by title', () => {
      const nodes = [
        createTestNode('root', null, 'Root'),
        createTestNode('c', 'root', 'Charlie'),
        createTestNode('a', 'root', 'Alpha'),
        createTestNode('b', 'root', 'Bravo'),
      ];
      const adapter = new TreeAdapter(nodes);
      const children = adapter.getTree()[0].children;

      expect(children[0].title).toBe('Alpha');
      expect(children[1].title).toBe('Bravo');
      expect(children[2].title).toBe('Charlie');
    });
  });

  describe('getNodeById', () => {
    it('should find node by ID', () => {
      const nodes = [
        createTestNode('1', null),
        createTestNode('2', '1'),
      ];
      const adapter = new TreeAdapter(nodes);

      const node = adapter.getNodeById('2');
      expect(node).toBeDefined();
      expect(node!.id).toBe('2');
    });

    it('should return undefined for non-existent ID', () => {
      const adapter = new TreeAdapter([createTestNode('1', null)]);

      expect(adapter.getNodeById('non-existent')).toBeUndefined();
    });
  });

  describe('handleDrop', () => {
    it('should update entity parentId when dropped on new parent', () => {
      const nodes = [
        createTestNode('root1', null),
        createTestNode('root2', null),
        createTestNode('child', 'root1'),
      ];
      const adapter = new TreeAdapter(nodes);

      const childNode = adapter.getNodeById('child')!;
      const newParent = adapter.getNodeById('root2')!;

      // Simulate drop by setting parentNode
      childNode.parentNode = newParent;
      adapter.handleDrop(childNode);

      expect(childNode.entity.parentId).toBe('root2');
    });

    it('should set parentId to null when moved to root', () => {
      const nodes = [
        createTestNode('root', null),
        createTestNode('child', 'root'),
      ];
      const adapter = new TreeAdapter(nodes);

      const childNode = adapter.getNodeById('child')!;
      childNode.parentNode = null;
      adapter.handleDrop(childNode);

      expect(childNode.entity.parentId).toBeNull();
    });
  });

  describe('handleRemove', () => {
    it('should remove node from list', () => {
      const nodes = [
        createTestNode('1', null),
        createTestNode('2', null),
      ];
      const adapter = new TreeAdapter(nodes);

      const nodeToRemove = adapter.getNodeById('1')!;
      adapter.handleRemove(nodeToRemove);

      expect(adapter.getList()).toHaveLength(1);
      expect(adapter.getList()[0].id).toBe('2');
    });

    it('should rebuild tree after removal', () => {
      const nodes = [
        createTestNode('root', null),
        createTestNode('child', 'root'),
      ];
      const adapter = new TreeAdapter(nodes);

      const childNode = adapter.getNodeById('child')!;
      adapter.handleRemove(childNode);

      expect(adapter.getTree()).toHaveLength(1);
      expect(adapter.getTree()[0].children).toHaveLength(0);
      expect(adapter.getTree()[0].isLeaf).toBe(true);
    });
  });

  describe('expandAll', () => {
    it('should expand all nodes', () => {
      const nodes = [
        createTestNode('root', null),
        createTestNode('child1', 'root'),
        createTestNode('child2', 'root'),
        createTestNode('grandchild', 'child1'),
      ];
      const adapter = new TreeAdapter(nodes);

      adapter.expandAll();

      expect(adapter.getNodeById('root')!.expanded).toBe(true);
      expect(adapter.getNodeById('child1')!.expanded).toBe(true);
      expect(adapter.getNodeById('child2')!.expanded).toBe(true);
      expect(adapter.getNodeById('grandchild')!.expanded).toBe(true);
    });
  });

  describe('collapseAll', () => {
    it('should collapse all nodes', () => {
      const nodes = [
        createTestNode('root', null),
        createTestNode('child', 'root'),
      ];
      const adapter = new TreeAdapter(nodes);

      adapter.expandAll();
      adapter.collapseAll();

      expect(adapter.getNodeById('root')!.expanded).toBe(false);
      expect(adapter.getNodeById('child')!.expanded).toBe(false);
    });
  });

  describe('getExpandedKeys', () => {
    it('should return empty array when no nodes expanded', () => {
      const adapter = new TreeAdapter([createTestNode('1', null)]);

      expect(adapter.getExpandedKeys()).toEqual([]);
    });

    it('should return keys of expanded nodes', () => {
      const nodes = [
        createTestNode('1', null),
        createTestNode('2', null),
        createTestNode('3', null),
      ];
      const adapter = new TreeAdapter(nodes);

      adapter.getNodeById('1')!.expanded = true;
      adapter.getNodeById('3')!.expanded = true;

      const keys = adapter.getExpandedKeys();
      expect(keys).toHaveLength(2);
      expect(keys).toContain('1');
      expect(keys).toContain('3');
    });
  });

  describe('setExpandedKeys', () => {
    it('should expand only specified nodes', () => {
      const nodes = [
        createTestNode('1', null),
        createTestNode('2', null),
        createTestNode('3', null),
      ];
      const adapter = new TreeAdapter(nodes);

      adapter.setExpandedKeys(['1', '3']);

      expect(adapter.getNodeById('1')!.expanded).toBe(true);
      expect(adapter.getNodeById('2')!.expanded).toBe(false);
      expect(adapter.getNodeById('3')!.expanded).toBe(true);
    });

    it('should collapse previously expanded nodes', () => {
      const adapter = new TreeAdapter([
        createTestNode('1', null),
        createTestNode('2', null),
      ]);

      adapter.expandAll();
      adapter.setExpandedKeys(['1']);

      expect(adapter.getNodeById('1')!.expanded).toBe(true);
      expect(adapter.getNodeById('2')!.expanded).toBe(false);
    });
  });

  describe('getPathToNode', () => {
    it('should return path from root to node', () => {
      const nodes = [
        createTestNode('root', null),
        createTestNode('level1', 'root'),
        createTestNode('level2', 'level1'),
        createTestNode('target', 'level2'),
      ];
      const adapter = new TreeAdapter(nodes);

      const path = adapter.getPathToNode('target');

      expect(path).toHaveLength(4);
      expect(path[0].id).toBe('root');
      expect(path[1].id).toBe('level1');
      expect(path[2].id).toBe('level2');
      expect(path[3].id).toBe('target');
    });

    it('should return single node path for root node', () => {
      const adapter = new TreeAdapter([createTestNode('root', null)]);

      const path = adapter.getPathToNode('root');

      expect(path).toHaveLength(1);
      expect(path[0].id).toBe('root');
    });

    it('should return empty path for non-existent node', () => {
      const adapter = new TreeAdapter([createTestNode('1', null)]);

      const path = adapter.getPathToNode('non-existent');

      expect(path).toHaveLength(0);
    });
  });

  describe('expandPathToNode', () => {
    it('should expand all nodes in path to target', () => {
      const nodes = [
        createTestNode('root', null),
        createTestNode('child', 'root'),
        createTestNode('grandchild', 'child'),
        createTestNode('target', 'grandchild'),
      ];
      const adapter = new TreeAdapter(nodes);

      adapter.expandPathToNode('target');

      expect(adapter.getNodeById('root')!.expanded).toBe(true);
      expect(adapter.getNodeById('child')!.expanded).toBe(true);
      expect(adapter.getNodeById('grandchild')!.expanded).toBe(true);
      expect(adapter.getNodeById('target')!.expanded).toBe(true);
    });

    it('should not affect other branches', () => {
      const nodes = [
        createTestNode('root', null),
        createTestNode('branch1', 'root'),
        createTestNode('branch2', 'root'),
        createTestNode('target', 'branch1'),
      ];
      const adapter = new TreeAdapter(nodes);

      adapter.expandPathToNode('target');

      expect(adapter.getNodeById('root')!.expanded).toBe(true);
      expect(adapter.getNodeById('branch1')!.expanded).toBe(true);
      expect(adapter.getNodeById('branch2')!.expanded).toBe(false);
    });
  });

  describe('complex scenarios', () => {
    it('should handle large tree', () => {
      const nodes: BaseNode[] = [];
      // Create a tree with 100 nodes
      nodes.push(createTestNode('root', null));
      for (let i = 1; i <= 99; i++) {
        const parentId = i <= 10 ? 'root' : `${Math.floor(i / 10)}`;
        nodes.push(createTestNode(`${i}`, parentId));
      }

      const adapter = new TreeAdapter(nodes);

      expect(adapter.getList()).toHaveLength(100);
      expect(adapter.getTree()).toHaveLength(1);
    });

    it('should handle multiple root nodes', () => {
      const nodes = [
        createTestNode('root1', null, 'Root A'),
        createTestNode('root2', null, 'Root B'),
        createTestNode('child1', 'root1'),
        createTestNode('child2', 'root2'),
      ];
      const adapter = new TreeAdapter(nodes);

      expect(adapter.getTree()).toHaveLength(2);
      expect(adapter.getTree()[0].title).toBe('Root A');
      expect(adapter.getTree()[1].title).toBe('Root B');
    });

    it('should maintain consistency after multiple operations', () => {
      const adapter = new TreeAdapter<BaseNode>();

      // Add nodes
      adapter.setList([
        createTestNode('1', null),
        createTestNode('2', '1'),
      ]);
      expect(adapter.getTree()).toHaveLength(1);

      // Expand
      adapter.expandAll();
      expect(adapter.getExpandedKeys()).toHaveLength(2);

      // Remove child
      adapter.handleRemove(adapter.getNodeById('2')!);
      expect(adapter.getList()).toHaveLength(1);
      expect(adapter.getTree()[0].isLeaf).toBe(true);
    });
  });
});

describe('TreeNode interface', () => {
  it('should have all required properties', () => {
    const entity = createTestNode('1', null, 'Test');
    const node: TreeNode<BaseNode> = createTreeNode(entity);

    expect(node).toHaveProperty('entity');
    expect(node).toHaveProperty('title');
    expect(node).toHaveProperty('key');
    expect(node).toHaveProperty('icon');
    expect(node).toHaveProperty('children');
    expect(node).toHaveProperty('isLeaf');
    expect(node).toHaveProperty('checked');
    expect(node).toHaveProperty('selected');
    expect(node).toHaveProperty('expanded');
    expect(node).toHaveProperty('selectable');
    expect(node).toHaveProperty('disabled');
    expect(node).toHaveProperty('disableCheckbox');
    expect(node).toHaveProperty('parentNode');
    expect(node).toHaveProperty('parentId');
    expect(node).toHaveProperty('id');
  });
});

describe('BaseNode interface', () => {
  it('should support minimum required properties', () => {
    const node: BaseNode = {
      id: '1',
      parentId: null,
    };

    expect(node.id).toBe('1');
    expect(node.parentId).toBeNull();
    expect(node.name).toBeUndefined();
    expect(node.displayName).toBeUndefined();
  });

  it('should support optional name properties', () => {
    const node: BaseNode = {
      id: '1',
      parentId: 'parent',
      name: 'Node Name',
      displayName: 'Display Name',
    };

    expect(node.name).toBe('Node Name');
    expect(node.displayName).toBe('Display Name');
  });
});
