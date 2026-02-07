import React, { useState, useCallback, useMemo } from 'react';
import { Box, Flex, Text, Menu, Portal, IconButton } from '@chakra-ui/react';
import type { SystemStyleObject } from '@chakra-ui/react';
import { Checkbox } from '@abpjs/theme-shared';
import type { CheckboxProps } from '@abpjs/theme-shared';
import { LuChevronRight, LuChevronDown, LuEllipsisVertical } from 'react-icons/lu';
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
 * Context for custom node template rendering
 * @since v3.2.0
 */
export interface TreeNodeTemplateContext<T extends BaseNode = BaseNode> {
  /** The node being rendered */
  node: TreeNodeData<T>;
  /** Whether the node is expanded */
  isExpanded: boolean;
  /** Whether the node is selected */
  isSelected: boolean;
  /** Whether the node is checked */
  isChecked: boolean;
  /** Nesting level (0 for root) */
  level: number;
}

/**
 * Context for custom expanded icon template rendering
 * @since v3.2.0
 */
export interface ExpandedIconTemplateContext<T extends BaseNode = BaseNode> {
  /** The node for this icon */
  node: TreeNodeData<T>;
  /** Whether the node is expanded */
  isExpanded: boolean;
}

/**
 * Slot-based customization props for the Tree component.
 * Each slot key maps to a specific rendered element and accepts
 * Chakra UI style props that are spread onto that element.
 *
 * @since v3.3.0
 */
export interface TreeSlotProps {
  /** Style props for the root container (role="tree") */
  root?: SystemStyleObject;
  /** Style props for each node's row container */
  nodeContent?: SystemStyleObject;
  /** Style overrides applied when a node is selected */
  selectedNode?: SystemStyleObject;
  /** Style overrides applied during drag-over */
  dragOverNode?: SystemStyleObject;
  /** Props for the expand/collapse icon button */
  switcher?: {
    size?: 'xs' | 'sm' | 'md';
    variant?: 'ghost' | 'plain';
    colorPalette?: string;
  };
  /** Props for the Checkbox component */
  checkbox?: Pick<CheckboxProps, 'colorPalette' | 'size'>;
  /** Style props for the title text element */
  title?: SystemStyleObject;
  /** Props for the menu trigger icon button */
  menuTrigger?: {
    size?: 'xs' | 'sm' | 'md';
    variant?: 'ghost' | 'outline' | 'plain';
    colorPalette?: string;
  };
  /** Style props for the menu content popover */
  menuContent?: SystemStyleObject;
  /** Style props for the children container */
  childrenContainer?: SystemStyleObject;
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
  /**
   * Custom node template render function
   * When provided, replaces the default node title rendering
   * @since v3.2.0
   */
  customNodeTemplate?: (context: TreeNodeTemplateContext<T>) => React.ReactNode;
  /**
   * Custom expanded icon template render function
   * When provided, replaces the default expand/collapse arrow
   * @since v3.2.0
   */
  expandedIconTemplate?: (context: ExpandedIconTemplateContext<T>) => React.ReactNode;
  /** Called when checked keys change */
  onCheckedKeysChange?: (keys: string[]) => void;
  /** Called when expanded keys change */
  onExpandedKeysChange?: (keys: string[]) => void;
  /** Called when selected node changes */
  onSelectedNodeChange?: (entity: T) => void;
  /** Called when a node is dropped */
  onDrop?: (event: DropEvent<T>) => void;
  /**
   * Custom class name
   * @deprecated Use slotProps.root instead. Will be removed in v4.0.
   */
  className?: string;
  /**
   * Custom styles
   * @deprecated Use slotProps.root instead. Will be removed in v4.0.
   */
  style?: React.CSSProperties;
  /**
   * Slot-based customization props for individual rendered elements.
   * @since v3.3.0
   */
  slotProps?: TreeSlotProps;
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
  customNodeTemplate?: (context: TreeNodeTemplateContext<T>) => React.ReactNode;
  expandedIconTemplate?: (context: ExpandedIconTemplateContext<T>) => React.ReactNode;
  slotProps?: TreeSlotProps;
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
  customNodeTemplate,
  expandedIconTemplate,
  slotProps,
  onToggle,
  onCheck,
  onSelect,
  onDragStart,
  onDragOver,
  onDrop,
}: TreeNodeProps<T>) {
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

  // Build conditional styles
  const conditionalStyles: SystemStyleObject = {
    ...(slotProps?.nodeContent),
    ...(isSelected
      ? {
          bg: 'colorPalette.solid',
          color: 'colorPalette.contrast',
          ...(slotProps?.selectedNode),
        }
      : {}),
    ...(dragOver
      ? {
          bg: 'colorPalette.muted',
          borderWidth: '1px',
          borderStyle: 'dashed',
          borderColor: 'colorPalette.emphasized',
          ...(slotProps?.dragOverNode),
        }
      : {}),
  };

  return (
    <Box data-testid={`tree-node-${node.key}`} userSelect="none">
      <Flex
        data-testid={`tree-node-content-${node.key}`}
        align="center"
        py="1"
        px="2"
        borderRadius="sm"
        cursor="pointer"
        transition="backgrounds"
        _hover={!isSelected && !dragOver ? { bg: 'bg.muted' } : undefined}
        pl={`${level * 20}px`}
        onClick={handleSelect}
        draggable={draggable && !node.disabled}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        data-selected={isSelected || undefined}
        data-dragover={dragOver || undefined}
        css={conditionalStyles}
      >
        {/* Expand/Collapse toggle */}
        <IconButton
          size={slotProps?.switcher?.size || 'xs'}
          variant={slotProps?.switcher?.variant || 'ghost'}
          colorPalette={slotProps?.switcher?.colorPalette}
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
          onClick={handleToggle}
          visibility={node.isLeaf ? 'hidden' : 'visible'}
          minW="5"
          h="5"
          tabIndex={0}
        >
          {!node.isLeaf &&
            (expandedIconTemplate ? (
              expandedIconTemplate({ node, isExpanded })
            ) : isExpanded ? (
              <LuChevronDown />
            ) : (
              <LuChevronRight />
            ))}
        </IconButton>

        {/* Checkbox */}
        {checkable && (
          <Checkbox
            checked={isChecked}
            onChange={handleCheck}
            disabled={node.disabled || node.disableCheckbox}
            colorPalette={slotProps?.checkbox?.colorPalette || 'blue'}
            size={slotProps?.checkbox?.size || 'sm'}
          />
        )}

        {/* Node title */}
        {customNodeTemplate ? (
          customNodeTemplate({
            node,
            isExpanded,
            isSelected,
            isChecked,
            level,
          })
        ) : (
          <Text
            flex="1"
            truncate
            title={node.title}
            css={slotProps?.title}
            {...(node.disabled
              ? { color: 'fg.subtle', cursor: 'not-allowed' }
              : {})}
            data-disabled={node.disabled || undefined}
          >
            {node.title}
          </Text>
        )}

        {/* Context menu */}
        {menu && (
          <Menu.Root>
            <Menu.Trigger asChild>
              <IconButton
                size={slotProps?.menuTrigger?.size || 'xs'}
                variant={slotProps?.menuTrigger?.variant || 'ghost'}
                colorPalette={slotProps?.menuTrigger?.colorPalette}
                aria-label="Open menu"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                opacity={0.5}
                _hover={{ opacity: 1 }}
              >
                <LuEllipsisVertical />
              </IconButton>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content minW="120px" css={slotProps?.menuContent}>
                  {menu(node)}
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
        )}
      </Flex>

      {/* Children */}
      {!node.isLeaf && isExpanded && (
        <Box css={slotProps?.childrenContainer}>
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
              customNodeTemplate={customNodeTemplate}
              expandedIconTemplate={expandedIconTemplate}
              slotProps={slotProps}
              onToggle={onToggle}
              onCheck={onCheck}
              onSelect={onSelect}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
            />
          ))}
        </Box>
      )}
    </Box>
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
 * - Chakra UI integration with slotProps customization
 *
 * @example
 * ```tsx
 * <Tree
 *   nodes={treeData}
 *   expandedKeys={['1', '2']}
 *   onExpandedKeysChange={(keys) => setExpandedKeys(keys)}
 *   onSelectedNodeChange={(node) => setSelected(node)}
 *   slotProps={{
 *     root: { bg: 'gray.50', p: 4 },
 *     checkbox: { colorPalette: 'brand' },
 *     selectedNode: { bg: 'brand.500', color: 'white' },
 *   }}
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
  customNodeTemplate,
  expandedIconTemplate,
  onCheckedKeysChange,
  onExpandedKeysChange,
  onSelectedNodeChange,
  onDrop,
  className,
  style,
  slotProps,
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
    <Box
      role="tree"
      aria-label="Tree view"
      colorPalette="blue"
      fontSize="sm"
      lineHeight="tall"
      className={className}
      style={style}
      css={slotProps?.root}
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
          customNodeTemplate={customNodeTemplate}
          expandedIconTemplate={expandedIconTemplate}
          slotProps={slotProps}
          onToggle={handleToggle}
          onCheck={handleCheck}
          onSelect={handleSelect}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        />
      ))}
    </Box>
  );
}

// Add displayName for debugging
Tree.displayName = 'Tree';
