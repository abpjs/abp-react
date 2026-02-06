# @abpjs/components

ABP Framework shared components for React - translated from `@abp/ng.components`.

## Installation

```bash
npm install @abpjs/components
# or
pnpm add @abpjs/components
```

## Tree Component

The Tree component provides a hierarchical tree view with support for:

- Expandable/collapsible nodes
- Checkable nodes
- Drag and drop
- Custom node templates
- Context menus

### Usage

```tsx
import { Tree, TreeAdapter, BaseNode } from '@abpjs/components/tree';

interface MyNode extends BaseNode {
  id: string;
  parentId: string | null;
  name: string;
}

const data: MyNode[] = [
  { id: '1', parentId: null, name: 'Root' },
  { id: '2', parentId: '1', name: 'Child 1' },
  { id: '3', parentId: '1', name: 'Child 2' },
];

function MyTreeComponent() {
  const adapter = new TreeAdapter(data);

  return (
    <Tree
      nodes={adapter.getTree()}
      expandedKeys={['1']}
      onExpandedKeysChange={(keys) => console.log('Expanded:', keys)}
      onSelectedNodeChange={(node) => console.log('Selected:', node)}
    />
  );
}
```

### TreeAdapter

The `TreeAdapter` class converts a flat list of nodes into a hierarchical tree structure:

```tsx
import { TreeAdapter, BaseNode } from '@abpjs/components/tree';

interface OrgUnit extends BaseNode {
  id: string;
  parentId: string | null;
  displayName: string;
}

const flatList: OrgUnit[] = [
  { id: '1', parentId: null, displayName: 'Company' },
  { id: '2', parentId: '1', displayName: 'Engineering' },
  { id: '3', parentId: '1', displayName: 'Marketing' },
];

const adapter = new TreeAdapter(flatList);

// Get the tree structure
const tree = adapter.getTree();

// Get the flat list
const list = adapter.getList();

// Handle drag and drop
adapter.handleDrop(node);

// Handle node removal
adapter.handleRemove(node);
```

## API Reference

### Tree Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `nodes` | `TreeNode[]` | `[]` | The tree data |
| `checkedKeys` | `string[]` | `[]` | Keys of checked nodes |
| `expandedKeys` | `string[]` | `[]` | Keys of expanded nodes |
| `selectedNode` | `any` | - | The currently selected node |
| `checkable` | `boolean` | `false` | Whether nodes have checkboxes |
| `draggable` | `boolean` | `false` | Whether nodes are draggable |
| `checkStrictly` | `boolean` | `false` | Check strictly (parent and children not associated) |
| `isNodeSelected` | `(node) => boolean` | - | Custom function to determine if node is selected |
| `beforeDrop` | `(event) => boolean \| Promise<boolean>` | - | Called before drop to allow/prevent |
| `menu` | `ReactNode` | - | Context menu template |
| `onCheckedKeysChange` | `(keys: string[]) => void` | - | Called when checked keys change |
| `onExpandedKeysChange` | `(keys: string[]) => void` | - | Called when expanded keys change |
| `onSelectedNodeChange` | `(node: any) => void` | - | Called when selected node changes |
| `onDrop` | `(event: DropEvent) => void` | - | Called when a node is dropped |

### BaseNode Interface

```typescript
interface BaseNode {
  id: string;
  parentId: string | null;
  name?: string;
  displayName?: string;
}
```

### TreeNode Interface

```typescript
interface TreeNode<T extends BaseNode = BaseNode> extends BaseNode {
  entity: T;
  key: string;
  title: string;
  icon: string | null;
  children: TreeNode<T>[];
  isLeaf: boolean;
  checked: boolean;
  selected: boolean;
  expanded: boolean;
  selectable: boolean;
  disabled: boolean;
  disableCheckbox: boolean;
}
```

## License

LGPL-3.0
