/**
 * Tree Adapter Utility
 * Translated from @volo/abp.ng.identity v2.9.0
 * @since 2.9.0
 *
 * Provides utility classes for converting flat lists to tree structures.
 * Used primarily for organization unit hierarchy management.
 */

/**
 * Base node interface for tree structures.
 * Entities must implement this interface to be used with TreeAdapter.
 */
export interface BaseNode {
  /** Unique identifier */
  id: string;
  /** Parent node ID (null for root nodes) */
  parentId: string | null;
  /** Optional name property */
  name?: string;
  /** Optional display name property */
  displayName?: string;
}

/**
 * Tree node wrapping an entity for tree display.
 * Compatible with various tree UI libraries.
 */
export interface TreeNode<T extends BaseNode> {
  /** The wrapped entity */
  entity: T;
  /** Display title (resolved from name or displayName) */
  title: string;
  /** Unique key (same as entity id) */
  key: string;
  /** Optional icon */
  icon: string | null;
  /** Child nodes */
  children: TreeNode<T>[];
  /** Whether this is a leaf node (no children) */
  isLeaf: boolean;
  /** Whether this node is checked */
  checked: boolean;
  /** Whether this node is selected */
  selected: boolean;
  /** Whether this node is expanded */
  expanded: boolean;
  /** Whether this node can be selected */
  selectable: boolean;
  /** Whether this node is disabled */
  disabled: boolean;
  /** Whether the checkbox is disabled */
  disableCheckbox: boolean;
  /** Reference to parent node */
  parentNode: TreeNode<T> | null;
  /** Parent ID from entity */
  parentId: string | null;
  /** ID from entity */
  id: string;
}

/**
 * Creates a TreeNode from an entity.
 * @param entity - The entity to wrap
 * @param nameResolver - Optional function to resolve display name
 * @returns A new TreeNode instance
 */
export function createTreeNode<T extends BaseNode>(
  entity: T,
  nameResolver?: (ent: T) => string
): TreeNode<T> {
  const resolvedName = nameResolver
    ? nameResolver(entity)
    : entity.displayName || entity.name || '';

  return {
    entity,
    title: resolvedName,
    key: entity.id,
    icon: null,
    children: [],
    isLeaf: true,
    checked: false,
    selected: false,
    expanded: false,
    selectable: true,
    disabled: false,
    disableCheckbox: false,
    parentNode: null,
    parentId: entity.parentId,
    id: entity.id,
  };
}

/**
 * TreeAdapter class for managing hierarchical data.
 * Converts flat lists into tree structures for UI rendering.
 *
 * @example
 * ```tsx
 * const units = await organizationUnitService.getListByInput();
 * const adapter = new TreeAdapter(units.items);
 * const treeNodes = adapter.getTree();
 * ```
 */
export class TreeAdapter<T extends BaseNode = BaseNode> {
  private list: T[] = [];
  private tree: TreeNode<T>[] = [];
  private nodeMap: Map<string, TreeNode<T>> = new Map();

  /**
   * Creates a new TreeAdapter instance.
   * @param list - Optional initial list of entities
   * @param nameResolver - Optional function to resolve display names
   */
  constructor(
    list: T[] = [],
    private nameResolver?: (ent: T) => string
  ) {
    this.setList(list);
  }

  /**
   * Sets the list and rebuilds the tree.
   * @param list - The new list of entities
   */
  setList(list: T[]): void {
    this.list = list;
    this.buildTree();
  }

  /**
   * Gets the original flat list.
   * @returns The flat list of entities
   */
  getList(): T[] {
    return this.list;
  }

  /**
   * Gets the tree structure.
   * @returns Array of root TreeNodes
   */
  getTree(): TreeNode<T>[] {
    return this.tree;
  }

  /**
   * Gets a node by its ID.
   * @param id - The node ID
   * @returns The TreeNode or undefined
   */
  getNodeById(id: string): TreeNode<T> | undefined {
    return this.nodeMap.get(id);
  }

  /**
   * Handles a drop operation (moving a node).
   * Updates the internal structure after drag-and-drop.
   * @param node - The node that was dropped
   */
  handleDrop(node: TreeNode<T>): void {
    // Update the entity's parentId based on new parent
    const entity = node.entity;
    if (node.parentNode) {
      (entity as BaseNode).parentId = node.parentNode.id;
    } else {
      (entity as BaseNode).parentId = null;
    }
    // Rebuild tree to reflect changes
    this.buildTree();
  }

  /**
   * Handles removing a node from the tree.
   * @param node - The node to remove
   */
  handleRemove(node: TreeNode<T>): void {
    // Remove from list
    this.list = this.list.filter(item => item.id !== node.id);
    // Rebuild tree
    this.buildTree();
  }

  /**
   * Builds the tree structure from the flat list.
   */
  private buildTree(): void {
    this.nodeMap.clear();
    this.tree = [];

    // First pass: create all nodes
    for (const item of this.list) {
      const node = createTreeNode(item, this.nameResolver);
      this.nodeMap.set(item.id, node);
    }

    // Second pass: build relationships
    for (const item of this.list) {
      const node = this.nodeMap.get(item.id)!;

      if (item.parentId && this.nodeMap.has(item.parentId)) {
        const parentNode = this.nodeMap.get(item.parentId)!;
        parentNode.children.push(node);
        parentNode.isLeaf = false;
        node.parentNode = parentNode;
      } else {
        // Root node
        this.tree.push(node);
      }
    }

    // Sort children by title
    this.sortChildren(this.tree);
  }

  /**
   * Recursively sorts children by title.
   * @param nodes - Array of nodes to sort
   */
  private sortChildren(nodes: TreeNode<T>[]): void {
    nodes.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    for (const node of nodes) {
      if (node.children.length > 0) {
        this.sortChildren(node.children);
      }
    }
  }

  /**
   * Expands all nodes in the tree.
   */
  expandAll(): void {
    for (const node of this.nodeMap.values()) {
      node.expanded = true;
    }
  }

  /**
   * Collapses all nodes in the tree.
   */
  collapseAll(): void {
    for (const node of this.nodeMap.values()) {
      node.expanded = false;
    }
  }

  /**
   * Gets all expanded node keys.
   * @returns Array of expanded node IDs
   */
  getExpandedKeys(): string[] {
    return Array.from(this.nodeMap.values())
      .filter(node => node.expanded)
      .map(node => node.key);
  }

  /**
   * Sets expanded state for specific nodes.
   * @param keys - Array of node IDs to expand
   */
  setExpandedKeys(keys: string[]): void {
    const keySet = new Set(keys);
    for (const node of this.nodeMap.values()) {
      node.expanded = keySet.has(node.key);
    }
  }

  /**
   * Finds a node and all its ancestors.
   * Useful for expanding path to a specific node.
   * @param id - The target node ID
   * @returns Array of nodes from root to target
   */
  getPathToNode(id: string): TreeNode<T>[] {
    const path: TreeNode<T>[] = [];
    let current = this.nodeMap.get(id);

    while (current) {
      path.unshift(current);
      current = current.parentNode || undefined;
    }

    return path;
  }

  /**
   * Expands the path to a specific node.
   * @param id - The target node ID
   */
  expandPathToNode(id: string): void {
    const path = this.getPathToNode(id);
    for (const node of path) {
      node.expanded = true;
    }
  }
}
