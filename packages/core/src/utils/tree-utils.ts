/**
 * Tree Utilities
 * Translated from @abp/ng.core v3.0.0
 *
 * Provides utility classes and functions for working with tree structures.
 *
 * @since 3.0.0
 */

/**
 * TreeNode type - represents a node in a tree structure
 * @since 3.0.0
 */
export type TreeNode<T extends object> = T & {
  children: TreeNode<T>[];
  isLeaf: boolean;
  parent?: TreeNode<T>;
};

/**
 * Base class for tree nodes
 * @since 3.0.0
 */
export class BaseTreeNode<T extends object> {
  children: TreeNode<T>[] = [];
  isLeaf: boolean = true;
  parent?: TreeNode<T>;

  constructor(props: T) {
    Object.assign(this, props);
  }

  /**
   * Factory method to create a TreeNode from props
   */
  static create<T extends object>(props: T): TreeNode<T> {
    return {
      ...props,
      children: [],
      isLeaf: true,
      parent: undefined,
    } as TreeNode<T>;
  }
}

/**
 * Create a tree structure from a flat list
 * @param list - Flat list of items
 * @param keySelector - Function to get unique key from item
 * @param parentKeySelector - Function to get parent key from item
 * @param valueMapper - Function to transform item to result type
 * @returns Array of root nodes
 * @since 3.0.0
 */
export function createTreeFromList<T extends object, R extends object>(
  list: T[],
  keySelector: (item: T) => number | string | symbol,
  parentKeySelector: (item: T) => number | string | symbol | undefined | null,
  valueMapper: (item: T) => R
): TreeNode<R>[] {
  const map = new Map<number | string | symbol, TreeNode<R>>();
  const roots: TreeNode<R>[] = [];

  // First pass: create all nodes
  for (const item of list) {
    const key = keySelector(item);
    const mapped = valueMapper(item);
    const node: TreeNode<R> = {
      ...mapped,
      children: [],
      isLeaf: true,
    };
    map.set(key, node);
  }

  // Second pass: build relationships
  for (const item of list) {
    const key = keySelector(item);
    const parentKey = parentKeySelector(item);
    const node = map.get(key)!;

    if (parentKey != null && map.has(parentKey)) {
      const parent = map.get(parentKey)!;
      parent.children.push(node);
      parent.isLeaf = false;
      node.parent = parent;
    } else {
      roots.push(node);
    }
  }

  return roots;
}

/**
 * Create a Map from a flat list
 * @param list - Flat list of items
 * @param keySelector - Function to get unique key from item
 * @param valueMapper - Function to transform item to result type
 * @returns Map of key to value
 * @since 3.0.0
 */
export function createMapFromList<T extends object, R>(
  list: T[],
  keySelector: (item: T) => number | string | symbol,
  valueMapper: (item: T) => R
): Map<string | number | symbol, R> {
  const map = new Map<string | number | symbol, R>();

  for (const item of list) {
    const key = keySelector(item);
    const value = valueMapper(item);
    map.set(key, value);
  }

  return map;
}

/**
 * Find a node in a tree by predicate
 * @param tree - Array of root nodes
 * @param predicate - Function to test each node
 * @returns The found node or null
 * @since 3.0.0
 */
export function findInTree<T extends object>(
  tree: TreeNode<T>[],
  predicate: (node: TreeNode<T>) => boolean
): TreeNode<T> | null {
  for (const node of tree) {
    if (predicate(node)) {
      return node;
    }
    if (node.children.length > 0) {
      const found = findInTree(node.children, predicate);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

/**
 * Flatten a tree into a list
 * @param tree - Array of root nodes
 * @returns Flat array of all nodes
 * @since 3.0.0
 */
export function flattenTree<T extends object>(tree: TreeNode<T>[]): TreeNode<T>[] {
  const result: TreeNode<T>[] = [];

  function traverse(nodes: TreeNode<T>[]): void {
    for (const node of nodes) {
      result.push(node);
      if (node.children.length > 0) {
        traverse(node.children);
      }
    }
  }

  traverse(tree);
  return result;
}

/**
 * Sort tree nodes recursively
 * @param tree - Array of nodes to sort
 * @param compareFn - Comparison function
 * @returns Sorted tree
 * @since 3.0.0
 */
export function sortTree<T extends object>(
  tree: TreeNode<T>[],
  compareFn: (a: TreeNode<T>, b: TreeNode<T>) => number
): TreeNode<T>[] {
  const sorted = [...tree].sort(compareFn);

  for (const node of sorted) {
    if (node.children.length > 0) {
      node.children = sortTree(node.children, compareFn);
    }
  }

  return sorted;
}
