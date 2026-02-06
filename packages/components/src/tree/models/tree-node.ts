import { BaseNode, NameResolver, defaultNameResolver } from './base-node';

/**
 * Tree node interface representing a node in the tree structure
 * Contains both the original entity and tree-specific properties
 */
export interface TreeNodeData<T extends BaseNode = BaseNode> {
  /** The original entity */
  entity: T;
  /** Unique key for the node (same as entity.id) */
  key: string;
  /** Display title for the node */
  title: string;
  /** Optional icon for the node */
  icon: string | null;
  /** Child nodes */
  children: TreeNodeData<T>[];
  /** Whether this is a leaf node (no children) */
  isLeaf: boolean;
  /** Whether the node is checked */
  checked: boolean;
  /** Whether the node is selected */
  selected: boolean;
  /** Whether the node is expanded */
  expanded: boolean;
  /** Whether the node is selectable */
  selectable: boolean;
  /** Whether the node is disabled */
  disabled: boolean;
  /** Whether the checkbox is disabled */
  disableCheckbox: boolean;
  /** Reference to parent node */
  parentNode?: TreeNodeData<T> | null;
  /** Node id (same as entity.id) */
  id: string;
  /** Parent id (same as entity.parentId) */
  parentId: string | null;
}

/**
 * TreeNode class that wraps an entity with tree-specific properties
 * Used internally by TreeAdapter
 */
export class TreeNode<T extends BaseNode = BaseNode> implements TreeNodeData<T> {
  key: string;
  title: string;
  icon: string | null = null;
  children: TreeNode<T>[] = [];
  isLeaf = true;
  checked = false;
  selected = false;
  expanded = false;
  selectable = true;
  disabled = false;
  disableCheckbox = false;
  parentNode?: TreeNode<T> | null;
  id: string;
  parentId: string | null;

  constructor(
    public entity: T,
    nameResolver: NameResolver<T> = defaultNameResolver as NameResolver<T>
  ) {
    this.id = entity.id;
    this.parentId = entity.parentId;
    this.key = entity.id;
    this.title = nameResolver(entity);
  }
}
