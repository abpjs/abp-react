import React, { useState, useCallback, useMemo } from 'react';
import { BaseNode } from '../models/base-node';
import { TreeNodeData } from '../models/tree-node';

/**
 * Drop event data
 */
export interface DropEvent<T extends BaseNode = BaseNode> {
  /** The node being dropped */
  node: TreeNodeData<T>;
  /** The target node (where it's being dropped) */
  targetNode?: TreeNodeData<T>;
  /** Drop position: -1 = before, 0 = inside, 1 = after */
  pos: number;
  /** Original DOM event */
  event: React.DragEvent;
}

/**
 * Before drop event data
 */
export interface BeforeDropEvent<T extends BaseNode = BaseNode> {
  /** The node being dragged */
  dragNode: TreeNodeData<T>;
  /** The target node */
  node: TreeNodeData<T>;
  /** Drop position: -1 = before, 0 = inside, 1 = after */
  pos: number;
}

/**
 * Props for the Tree component
 */
export interface TreeProps<T extends BaseNode = BaseNode> {
  /** Tree nodes data */
  nodes?: TreeNodeData<T>[];
  /** Keys of checked nodes */
  checkedKeys?: string[];
  /** Keys of expanded nodes */
  expandedKeys?: string[];
  /** Currently selected node */
  selectedNode?: T;
  /** Whether nodes have checkboxes */
  checkable?: boolean;
  /** Whether nodes are draggable */
  draggable?: boolean;
  /** Check strictly (parent and children not associated) */
  checkStrictly?: boolean;
  /** Custom function to determine if node is selected */
  isNodeSelected?: (node: TreeNodeData<T>) => boolean;
  /** Called before drop to allow/prevent */
  beforeDrop?: (event: BeforeDropEvent<T>) => boolean | Promise<boolean>;
  /** Context menu render function */
  menu?: (node: TreeNodeData<T>) => React.ReactNode;
  /** Called when checked keys change */
  onCheckedKeysChange?: (keys: string[]) => void;
  /** Called when expanded keys change */
  onExpandedKeysChange?: (keys: string[]) => void;
  /** Called when selected node changes */
  onSelectedNodeChange?: (entity: T) => void;
  /** Called when a node is dropped */
  onDrop?: (event: DropEvent<T>) => void;
  /** Custom class name */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
}

/**
 * Internal props for tree node rendering
 */
interface TreeNodeProps<T extends BaseNode = BaseNode> {
  node: TreeNodeData<T>;
  level: number;
  expandedKeys: Set<string>;
  checkedKeys: Set<string>;
  selectedNode?: T;
  checkable?: boolean;
  draggable?: boolean;
  isNodeSelected?: (node: TreeNodeData<T>) => boolean;
  menu?: (node: TreeNodeData<T>) => React.ReactNode;
  onToggle: (key: string) => void;
  onCheck: (key: string) => void;
  onSelect: (node: TreeNodeData<T>) => void;
  onDragStart: (node: TreeNodeData<T>, event: React.DragEvent) => void;
  onDragOver: (node: TreeNodeData<T>, event: React.DragEvent) => void;
  onDrop: (node: TreeNodeData<T>, event: React.DragEvent) => void;
}

/**
 * Tree node component
 */
function TreeNodeComponent<T extends BaseNode = BaseNode>({
  node,
  level,
  expandedKeys,
  checkedKeys,
  selectedNode,
  checkable,
  draggable,
  isNodeSelected,
  menu,
  onToggle,
  onCheck,
  onSelect,
  onDragStart,
  onDragOver,
  onDrop,
}: TreeNodeProps<T>) {
  const [showMenu, setShowMenu] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const isExpanded = expandedKeys.has(node.key);
  const isChecked = checkedKeys.has(node.key);
  const isSelected = isNodeSelected
    ? isNodeSelected(node)
    : selectedNode?.id === node.key;

  const handleToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggle(node.key);
    },
    [node.key, onToggle]
  );

  const handleCheck = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.stopPropagation();
      onCheck(node.key);
    },
    [node.key, onCheck]
  );

  const handleSelect = useCallback(() => {
    onSelect(node);
  }, [node, onSelect]);

  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      onDragStart(node, e);
    },
    [node, onDragStart]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(true);
      onDragOver(node, e);
    },
    [node, onDragOver]
  );

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      onDrop(node, e);
    },
    [node, onDrop]
  );

  return (
    <div className="abp-tree-node" data-testid={`tree-node-${node.key}`}>
      <div
        className={`abp-tree-node-content ${isSelected ? 'selected' : ''} ${
          dragOver ? 'drag-over' : ''
        }`}
        style={{ paddingLeft: `${level * 20}px` }}
        onClick={handleSelect}
        draggable={draggable && !node.disabled}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Expand/Collapse toggle */}
        <span
          className={`abp-tree-switcher ${node.isLeaf ? 'leaf' : ''}`}
          onClick={handleToggle}
          role="button"
          tabIndex={0}
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          {!node.isLeaf && (
            <span className={`arrow ${isExpanded ? 'expanded' : ''}`}>
              {isExpanded ? '▼' : '▶'}
            </span>
          )}
        </span>

        {/* Checkbox */}
        {checkable && (
          <input
            type="checkbox"
            className="abp-tree-checkbox"
            checked={isChecked}
            onChange={handleCheck}
            disabled={node.disabled || node.disableCheckbox}
            aria-label={`Select ${node.title}`}
          />
        )}

        {/* Node title */}
        <span
          className={`abp-tree-title ${node.disabled ? 'disabled' : ''}`}
          title={node.title}
        >
          {node.title}
        </span>

        {/* Context menu */}
        {menu && (
          <div className="abp-tree-menu" onMouseLeave={() => setShowMenu(false)}>
            <button
              className="abp-tree-menu-trigger"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              aria-label="Open menu"
            >
              ⋮
            </button>
            {showMenu && (
              <div className="abp-tree-menu-content">{menu(node)}</div>
            )}
          </div>
        )}
      </div>

      {/* Children */}
      {!node.isLeaf && isExpanded && (
        <div className="abp-tree-children">
          {node.children.map((child) => (
            <TreeNodeComponent
              key={child.key}
              node={child as TreeNodeData<T>}
              level={level + 1}
              expandedKeys={expandedKeys}
              checkedKeys={checkedKeys}
              selectedNode={selectedNode}
              checkable={checkable}
              draggable={draggable}
              isNodeSelected={isNodeSelected}
              menu={menu}
              onToggle={onToggle}
              onCheck={onCheck}
              onSelect={onSelect}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Tree component for displaying hierarchical data
 *
 * Features:
 * - Expandable/collapsible nodes
 * - Checkable nodes
 * - Drag and drop support
 * - Context menus
 * - Keyboard navigation
 *
 * @example
 * ```tsx
 * <Tree
 *   nodes={treeData}
 *   expandedKeys={['1', '2']}
 *   onExpandedKeysChange={(keys) => setExpandedKeys(keys)}
 *   onSelectedNodeChange={(node) => setSelected(node)}
 * />
 * ```
 */
export function Tree<T extends BaseNode = BaseNode>({
  nodes = [],
  checkedKeys: checkedKeysProp = [],
  expandedKeys: expandedKeysProp = [],
  selectedNode,
  checkable = false,
  draggable = false,
  checkStrictly = false,
  isNodeSelected,
  beforeDrop,
  menu,
  onCheckedKeysChange,
  onExpandedKeysChange,
  onSelectedNodeChange,
  onDrop,
  className,
  style,
}: TreeProps<T>) {
  // Internal state for drag and drop
  const [dragNode, setDragNode] = useState<TreeNodeData<T> | null>(null);
  const [dropPosition, setDropPosition] = useState<number>(0);

  // Convert arrays to Sets for efficient lookup
  const expandedKeys = useMemo(
    () => new Set(expandedKeysProp),
    [expandedKeysProp]
  );
  const checkedKeys = useMemo(
    () => new Set(checkedKeysProp),
    [checkedKeysProp]
  );

  // Handle node toggle (expand/collapse)
  const handleToggle = useCallback(
    (key: string) => {
      const newKeys = new Set(expandedKeys);
      if (newKeys.has(key)) {
        newKeys.delete(key);
      } else {
        newKeys.add(key);
      }
      onExpandedKeysChange?.(Array.from(newKeys));
    },
    [expandedKeys, onExpandedKeysChange]
  );

  // Handle node check
  const handleCheck = useCallback(
    (key: string) => {
      const newKeys = new Set(checkedKeys);
      if (newKeys.has(key)) {
        newKeys.delete(key);
      } else {
        newKeys.add(key);
      }

      // If not checkStrictly, handle parent/child checking
      if (!checkStrictly) {
        // TODO: Implement cascading check logic
      }

      onCheckedKeysChange?.(Array.from(newKeys));
    },
    [checkedKeys, checkStrictly, onCheckedKeysChange]
  );

  // Handle node selection
  const handleSelect = useCallback(
    (node: TreeNodeData<T>) => {
      onSelectedNodeChange?.(node.entity);
    },
    [onSelectedNodeChange]
  );

  // Handle drag start
  const handleDragStart = useCallback(
    (node: TreeNodeData<T>, _event: React.DragEvent) => {
      setDragNode(node);
    },
    []
  );

  // Handle drag over
  const handleDragOver = useCallback(
    (_node: TreeNodeData<T>, event: React.DragEvent) => {
      // Calculate drop position based on mouse position
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      const y = event.clientY - rect.top;
      const height = rect.height;

      if (y < height * 0.25) {
        setDropPosition(-1); // Before
      } else if (y > height * 0.75) {
        setDropPosition(1); // After
      } else {
        setDropPosition(0); // Inside
      }
    },
    []
  );

  // Handle drop
  const handleDrop = useCallback(
    async (targetNode: TreeNodeData<T>, event: React.DragEvent) => {
      if (!dragNode) return;

      // Check beforeDrop
      if (beforeDrop) {
        const canDrop = await beforeDrop({
          dragNode,
          node: targetNode,
          pos: dropPosition,
        });
        if (!canDrop) {
          setDragNode(null);
          return;
        }
      }

      // Emit drop event
      onDrop?.({
        node: dragNode,
        targetNode,
        pos: dropPosition,
        event,
      });

      setDragNode(null);
    },
    [dragNode, dropPosition, beforeDrop, onDrop]
  );

  return (
    <div
      className={`abp-tree ${className || ''}`}
      style={style}
      role="tree"
      aria-label="Tree view"
    >
      {nodes.map((node) => (
        <TreeNodeComponent
          key={node.key}
          node={node}
          level={0}
          expandedKeys={expandedKeys}
          checkedKeys={checkedKeys}
          selectedNode={selectedNode}
          checkable={checkable}
          draggable={draggable}
          isNodeSelected={isNodeSelected}
          menu={menu}
          onToggle={handleToggle}
          onCheck={handleCheck}
          onSelect={handleSelect}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
      ))}
      <style>{treeStyles}</style>
    </div>
  );
}

// Default styles for the tree component
const treeStyles = `
.abp-tree {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
  line-height: 1.5;
}

.abp-tree-node {
  user-select: none;
}

.abp-tree-node-content {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.abp-tree-node-content:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.abp-tree-node-content.selected {
  background-color: var(--primary-color, #1890ff);
  color: white;
}

.abp-tree-node-content.drag-over {
  background-color: rgba(24, 144, 255, 0.1);
  border: 1px dashed var(--primary-color, #1890ff);
}

.abp-tree-switcher {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.abp-tree-switcher .arrow {
  font-size: 10px;
  transition: transform 0.2s;
}

.abp-tree-switcher.leaf {
  visibility: hidden;
}

.abp-tree-checkbox {
  margin-right: 8px;
  cursor: pointer;
}

.abp-tree-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.abp-tree-title.disabled {
  color: rgba(0, 0, 0, 0.25);
  cursor: not-allowed;
}

.abp-tree-menu {
  position: relative;
}

.abp-tree-menu-trigger {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px 8px;
  font-size: 16px;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.abp-tree-menu-trigger:hover {
  opacity: 1;
}

.abp-tree-menu-content {
  position: absolute;
  right: 0;
  top: 100%;
  z-index: 1000;
  min-width: 120px;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.abp-tree-children {
  /* Children are indented via padding on content */
}
`;

// Add displayName for debugging
Tree.displayName = 'Tree';
