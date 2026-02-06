import { BaseNode, NameResolver, defaultNameResolver } from '../models/base-node';
import { TreeNode } from '../models/tree-node';

/**
 * Creates a tree structure from a flat list of nodes
 * @param list - Flat list of nodes with id and parentId
 * @param nameResolver - Optional function to resolve node title
 * @returns Array of root TreeNodes
 */
export function createTreeFromList<T extends BaseNode>(
  list: T[],
  nameResolver: NameResolver<T> = defaultNameResolver as NameResolver<T>
): TreeNode<T>[] {
  const map = createMapFromList(list, nameResolver);
  const tree: TreeNode<T>[] = [];

  list.forEach((row) => {
    const parentId = row.parentId;
    const node = map.get(row.id);

    if (!node) return;

    if (parentId) {
      const parent = map.get(parentId);
      if (parent) {
        parent.children.push(node);
        parent.isLeaf = false;
        node.parentNode = parent;
      }
    } else {
      tree.push(node);
    }
  });

  return tree;
}

/**
 * Creates a flat list from a tree structure
 * @param tree - Array of root TreeNodes
 * @param list - Accumulator array (used internally for recursion)
 * @returns Flat list of entities with updated parentId
 */
export function createListFromTree<T extends BaseNode>(
  tree: TreeNode<T>[],
  list: T[] = []
): T[] {
  tree.forEach((node) => {
    list.push({ ...node.entity, parentId: node.parentId } as T);
    if (node.children.length > 0) {
      createListFromTree(node.children, list);
    }
  });

  return list;
}

/**
 * Creates a Map from a flat list for efficient lookups
 * @param list - Flat list of nodes
 * @param nameResolver - Optional function to resolve node title
 * @returns Map of node id to TreeNode
 */
export function createMapFromList<T extends BaseNode>(
  list: T[],
  nameResolver: NameResolver<T> = defaultNameResolver as NameResolver<T>
): Map<string, TreeNode<T>> {
  const map = new Map<string, TreeNode<T>>();
  list.forEach((row) => map.set(row.id, new TreeNode(row, nameResolver)));
  return map;
}

/**
 * TreeAdapter class for converting between flat lists and tree structures
 * Provides methods for tree manipulation (drop, remove, etc.)
 */
export class TreeAdapter<T extends BaseNode = BaseNode> {
  private tree: TreeNode<T>[];

  /**
   * Creates a new TreeAdapter
   * @param list - Initial flat list of nodes
   * @param nameResolver - Optional function to resolve node title
   */
  constructor(
    private list: T[] = [],
    private nameResolver: NameResolver<T> = defaultNameResolver as NameResolver<T>
  ) {
    this.tree = createTreeFromList(this.list, this.nameResolver);
  }

  /**
   * Gets the flat list of nodes
   */
  getList(): T[] {
    return this.list;
  }

  /**
   * Gets the tree structure
   */
  getTree(): TreeNode<T>[] {
    return this.tree;
  }

  /**
   * Handles a drop event by updating the node's parent
   * @param node - The node that was dropped
   */
  handleDrop(node: TreeNode<T>): void {
    const { key, parentNode } = node;
    const index = this.list.findIndex(({ id }) => id === key);

    if (index !== -1) {
      this.list[index].parentId = parentNode ? parentNode.key : null;
      this.tree = createTreeFromList(this.list, this.nameResolver);
    }
  }

  /**
   * Handles node removal by removing the node and all its descendants
   * @param node - The node to remove
   */
  handleRemove(node: TreeNode<T>): void {
    const { key } = node;
    this.list = this.list.filter(
      ({ id, parentId }) => id !== key && parentId !== key
    );
    this.tree = createTreeFromList(this.list, this.nameResolver);
  }

  /**
   * Adds a new node to the list and rebuilds the tree
   * @param node - The node to add
   */
  addNode(node: T): void {
    this.list.push(node);
    this.tree = createTreeFromList(this.list, this.nameResolver);
  }

  /**
   * Updates a node in the list and rebuilds the tree
   * @param node - The node to update
   */
  updateNode(node: T): void {
    const index = this.list.findIndex(({ id }) => id === node.id);
    if (index !== -1) {
      this.list[index] = node;
      this.tree = createTreeFromList(this.list, this.nameResolver);
    }
  }

  /**
   * Finds a node in the tree by key
   * @param key - The key to search for
   * @returns The TreeNode or undefined
   */
  findNode(key: string): TreeNode<T> | undefined {
    const search = (nodes: TreeNode<T>[]): TreeNode<T> | undefined => {
      for (const node of nodes) {
        if (node.key === key) return node;
        const found = search(node.children);
        if (found) return found;
      }
      return undefined;
    };
    return search(this.tree);
  }

  /**
   * Gets all expanded keys (nodes that have children and are expanded)
   * @returns Array of expanded node keys
   */
  getExpandedKeys(): string[] {
    const keys: string[] = [];
    const collect = (nodes: TreeNode<T>[]) => {
      for (const node of nodes) {
        if (node.expanded) keys.push(node.key);
        collect(node.children);
      }
    };
    collect(this.tree);
    return keys;
  }

  /**
   * Gets all checked keys
   * @returns Array of checked node keys
   */
  getCheckedKeys(): string[] {
    const keys: string[] = [];
    const collect = (nodes: TreeNode<T>[]) => {
      for (const node of nodes) {
        if (node.checked) keys.push(node.key);
        collect(node.children);
      }
    };
    collect(this.tree);
    return keys;
  }

  /**
   * Sets the expanded state for nodes
   * @param keys - Array of keys to expand
   */
  setExpandedKeys(keys: string[]): void {
    const keySet = new Set(keys);
    const update = (nodes: TreeNode<T>[]) => {
      for (const node of nodes) {
        node.expanded = keySet.has(node.key);
        update(node.children);
      }
    };
    update(this.tree);
  }

  /**
   * Sets the checked state for nodes
   * @param keys - Array of keys to check
   */
  setCheckedKeys(keys: string[]): void {
    const keySet = new Set(keys);
    const update = (nodes: TreeNode<T>[]) => {
      for (const node of nodes) {
        node.checked = keySet.has(node.key);
        update(node.children);
      }
    };
    update(this.tree);
  }
}
