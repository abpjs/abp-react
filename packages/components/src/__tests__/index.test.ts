import { describe, it, expect } from 'vitest';
import * as components from '../index';
import * as tree from '../tree';

describe('@abpjs/components exports', () => {
  describe('main index', () => {
    it('should export Tree component', () => {
      expect(components.Tree).toBeDefined();
      expect(typeof components.Tree).toBe('function');
    });

    it('should export TreeAdapter', () => {
      expect(components.TreeAdapter).toBeDefined();
    });

    it('should export TreeNode', () => {
      expect(components.TreeNode).toBeDefined();
    });

    it('should export tree utility functions', () => {
      expect(components.createTreeFromList).toBeDefined();
      expect(components.createListFromTree).toBeDefined();
      expect(components.createMapFromList).toBeDefined();
    });

    it('should export defaultNameResolver', () => {
      expect(components.defaultNameResolver).toBeDefined();
      expect(typeof components.defaultNameResolver).toBe('function');
    });
  });

  describe('tree subpackage', () => {
    it('should export Tree component', () => {
      expect(tree.Tree).toBeDefined();
    });

    it('should export TreeAdapter', () => {
      expect(tree.TreeAdapter).toBeDefined();
    });

    it('should export TreeNode', () => {
      expect(tree.TreeNode).toBeDefined();
    });

    it('should export utility functions', () => {
      expect(tree.createTreeFromList).toBeDefined();
      expect(tree.createListFromTree).toBeDefined();
      expect(tree.createMapFromList).toBeDefined();
    });

    it('should export defaultNameResolver', () => {
      expect(tree.defaultNameResolver).toBeDefined();
    });
  });
});

describe('TreeAdapter usage', () => {
  interface TestNode {
    id: string;
    parentId: string | null;
    name: string;
  }

  it('should work with basic usage pattern', () => {
    const data: TestNode[] = [
      { id: '1', parentId: null, name: 'Root' },
      { id: '2', parentId: '1', name: 'Child' },
    ];

    const adapter = new components.TreeAdapter(data);
    const treeData = adapter.getTree();

    expect(treeData).toHaveLength(1);
    expect(treeData[0].title).toBe('Root');
    expect(treeData[0].children).toHaveLength(1);
    expect(treeData[0].children[0].title).toBe('Child');
  });
});
