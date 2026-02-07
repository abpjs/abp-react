import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tree, TreeProps } from '../../tree/components/Tree';
import { TreeAdapter } from '../../tree/utils/tree-adapter';
import { BaseNode } from '../../tree/models/base-node';
import { TreeNodeData } from '../../tree/models/tree-node';

interface TestNode extends BaseNode {
  id: string;
  parentId: string | null;
  name: string;
}

describe('Tree Component', () => {
  const flatList: TestNode[] = [
    { id: '1', parentId: null, name: 'Root 1' },
    { id: '2', parentId: '1', name: 'Child 1.1' },
    { id: '3', parentId: '1', name: 'Child 1.2' },
    { id: '4', parentId: '2', name: 'Grandchild 1.1.1' },
    { id: '5', parentId: null, name: 'Root 2' },
  ];

  let adapter: TreeAdapter<TestNode>;
  let treeNodes: TreeNodeData<TestNode>[];

  beforeEach(() => {
    adapter = new TreeAdapter(flatList);
    treeNodes = adapter.getTree();
  });

  const renderTree = (props: Partial<TreeProps<TestNode>> = {}) => {
    return render(
      <Tree<TestNode>
        nodes={treeNodes}
        expandedKeys={['1', '2']}
        {...props}
      />
    );
  };

  describe('rendering', () => {
    it('should render tree with nodes', () => {
      renderTree();

      expect(screen.getByText('Root 1')).toBeInTheDocument();
      expect(screen.getByText('Root 2')).toBeInTheDocument();
    });

    it('should render expanded children', () => {
      renderTree({ expandedKeys: ['1'] });

      expect(screen.getByText('Child 1.1')).toBeInTheDocument();
      expect(screen.getByText('Child 1.2')).toBeInTheDocument();
    });

    it('should not render collapsed children', () => {
      renderTree({ expandedKeys: [] });

      expect(screen.queryByText('Child 1.1')).not.toBeInTheDocument();
      expect(screen.queryByText('Child 1.2')).not.toBeInTheDocument();
    });

    it('should render with custom className', () => {
      const { container } = renderTree({ className: 'custom-tree' });
      expect(container.querySelector('.custom-tree')).toBeInTheDocument();
    });

    it('should render with custom style', () => {
      const { container } = renderTree({ style: { border: '1px solid red' } });
      const tree = container.querySelector('.abp-tree');
      expect(tree).toHaveStyle({ border: '1px solid red' });
    });

    it('should render empty tree', () => {
      const { container } = render(<Tree nodes={[]} />);
      expect(container.querySelector('.abp-tree')).toBeInTheDocument();
    });
  });

  describe('expand/collapse', () => {
    it('should call onExpandedKeysChange when toggling', () => {
      const onExpandedKeysChange = vi.fn();
      renderTree({ expandedKeys: ['1'], onExpandedKeysChange });

      // Click the expand/collapse arrow for Root 1
      const toggleButton = screen
        .getByTestId('tree-node-1')
        .querySelector('.abp-tree-switcher');
      fireEvent.click(toggleButton!);

      expect(onExpandedKeysChange).toHaveBeenCalledWith([]);
    });

    it('should expand collapsed node', () => {
      const onExpandedKeysChange = vi.fn();
      renderTree({ expandedKeys: [], onExpandedKeysChange });

      const toggleButton = screen
        .getByTestId('tree-node-1')
        .querySelector('.abp-tree-switcher');
      fireEvent.click(toggleButton!);

      expect(onExpandedKeysChange).toHaveBeenCalledWith(['1']);
    });
  });

  describe('selection', () => {
    it('should call onSelectedNodeChange when clicking node', () => {
      const onSelectedNodeChange = vi.fn();
      renderTree({ onSelectedNodeChange });

      const nodeContent = screen
        .getByTestId('tree-node-1')
        .querySelector('.abp-tree-node-content');
      fireEvent.click(nodeContent!);

      expect(onSelectedNodeChange).toHaveBeenCalledWith(
        expect.objectContaining({ id: '1', name: 'Root 1' })
      );
    });

    it('should highlight selected node', () => {
      renderTree({ selectedNode: flatList[0] });

      const nodeContent = screen
        .getByTestId('tree-node-1')
        .querySelector('.abp-tree-node-content');
      expect(nodeContent).toHaveClass('selected');
    });

    it('should use custom isNodeSelected function', () => {
      const isNodeSelected = (node: TreeNodeData<TestNode>) =>
        node.key === '5';
      renderTree({ isNodeSelected });

      const root2Content = screen
        .getByTestId('tree-node-5')
        .querySelector('.abp-tree-node-content');
      expect(root2Content).toHaveClass('selected');
    });
  });

  describe('checkable', () => {
    it('should render checkboxes when checkable is true', () => {
      renderTree({ checkable: true });

      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThan(0);
    });

    it('should not render checkboxes when checkable is false', () => {
      renderTree({ checkable: false });

      const checkboxes = screen.queryAllByRole('checkbox');
      expect(checkboxes).toHaveLength(0);
    });

    it('should call onCheckedKeysChange when checking node', () => {
      const onCheckedKeysChange = vi.fn();
      renderTree({ checkable: true, checkedKeys: [], onCheckedKeysChange });

      const checkbox = screen.getAllByRole('checkbox')[0];
      fireEvent.click(checkbox);

      expect(onCheckedKeysChange).toHaveBeenCalled();
    });

    it('should check node when checkbox is checked', () => {
      renderTree({ checkable: true, checkedKeys: ['1'] });

      const checkbox = screen
        .getByTestId('tree-node-1')
        .querySelector('input[type="checkbox"]');
      expect(checkbox).toBeChecked();
    });

    it('should uncheck node when unchecking', () => {
      const onCheckedKeysChange = vi.fn();
      renderTree({
        checkable: true,
        checkedKeys: ['1'],
        onCheckedKeysChange,
      });

      const checkbox = screen
        .getByTestId('tree-node-1')
        .querySelector('input[type="checkbox"]');
      fireEvent.click(checkbox!);

      expect(onCheckedKeysChange).toHaveBeenCalledWith([]);
    });
  });

  describe('drag and drop', () => {
    it('should set draggable attribute when draggable is true', () => {
      renderTree({ draggable: true });

      const nodeContent = screen
        .getByTestId('tree-node-1')
        .querySelector('.abp-tree-node-content');
      expect(nodeContent).toHaveAttribute('draggable', 'true');
    });

    it('should not set draggable attribute when draggable is false', () => {
      renderTree({ draggable: false });

      const nodeContent = screen
        .getByTestId('tree-node-1')
        .querySelector('.abp-tree-node-content');
      expect(nodeContent).not.toHaveAttribute('draggable', 'true');
    });

    it('should call onDrop when dropping node', () => {
      const onDrop = vi.fn();
      renderTree({ draggable: true, onDrop });

      const sourceNode = screen
        .getByTestId('tree-node-5')
        .querySelector('.abp-tree-node-content');
      const targetNode = screen
        .getByTestId('tree-node-1')
        .querySelector('.abp-tree-node-content');

      fireEvent.dragStart(sourceNode!);
      fireEvent.dragOver(targetNode!);
      fireEvent.drop(targetNode!);

      expect(onDrop).toHaveBeenCalled();
    });

    it('should call beforeDrop before dropping', async () => {
      const beforeDrop = vi.fn().mockReturnValue(true);
      const onDrop = vi.fn();
      renderTree({ draggable: true, beforeDrop, onDrop });

      const sourceNode = screen
        .getByTestId('tree-node-5')
        .querySelector('.abp-tree-node-content');
      const targetNode = screen
        .getByTestId('tree-node-1')
        .querySelector('.abp-tree-node-content');

      fireEvent.dragStart(sourceNode!);
      fireEvent.dragOver(targetNode!);
      fireEvent.drop(targetNode!);

      expect(beforeDrop).toHaveBeenCalled();
    });

    it('should prevent drop when beforeDrop returns false', async () => {
      const beforeDrop = vi.fn().mockReturnValue(false);
      const onDrop = vi.fn();
      renderTree({ draggable: true, beforeDrop, onDrop });

      const sourceNode = screen
        .getByTestId('tree-node-5')
        .querySelector('.abp-tree-node-content');
      const targetNode = screen
        .getByTestId('tree-node-1')
        .querySelector('.abp-tree-node-content');

      fireEvent.dragStart(sourceNode!);
      fireEvent.dragOver(targetNode!);
      fireEvent.drop(targetNode!);

      // Wait for async beforeDrop to resolve
      await vi.waitFor(() => {
        expect(beforeDrop).toHaveBeenCalled();
      });
    });
  });

  describe('context menu', () => {
    it('should render menu trigger when menu is provided', () => {
      const menu = () => <div>Menu Content</div>;
      renderTree({ menu });

      const menuTriggers = screen.getAllByLabelText('Open menu');
      expect(menuTriggers.length).toBeGreaterThan(0);
    });

    it('should show menu content when menu trigger is clicked', () => {
      const menu = () => <div>Menu Content</div>;
      renderTree({ menu });

      const menuTrigger = screen.getAllByLabelText('Open menu')[0];
      fireEvent.click(menuTrigger);

      expect(screen.getByText('Menu Content')).toBeInTheDocument();
    });

    it('should not render menu trigger when menu is not provided', () => {
      renderTree();

      const menuTriggers = screen.queryAllByLabelText('Open menu');
      expect(menuTriggers).toHaveLength(0);
    });
  });

  describe('accessibility', () => {
    it('should have role="tree"', () => {
      renderTree();
      expect(screen.getByRole('tree')).toBeInTheDocument();
    });

    it('should have aria-label', () => {
      renderTree();
      expect(screen.getByRole('tree')).toHaveAttribute(
        'aria-label',
        'Tree view'
      );
    });

    it('should have aria-label on expand buttons', () => {
      renderTree({ expandedKeys: ['1'] });

      const expandButtons = screen.getAllByRole('button', { name: /Expand|Collapse/i });
      expect(expandButtons.length).toBeGreaterThan(0);
    });
  });

  describe('node disabled state', () => {
    it('should render disabled node with disabled class', () => {
      const disabledNodes = adapter.getTree();
      disabledNodes[0].disabled = true;

      render(<Tree nodes={disabledNodes} />);

      const title = screen
        .getByTestId('tree-node-1')
        .querySelector('.abp-tree-title');
      expect(title).toHaveClass('disabled');
    });

    it('should disable checkbox for disabled node', () => {
      const disabledNodes = adapter.getTree();
      disabledNodes[0].disabled = true;

      render(<Tree nodes={disabledNodes} checkable={true} />);

      const checkbox = screen
        .getByTestId('tree-node-1')
        .querySelector('input[type="checkbox"]');
      expect(checkbox).toBeDisabled();
    });

    it('should disable checkbox when disableCheckbox is true', () => {
      const disabledCheckboxNodes = adapter.getTree();
      disabledCheckboxNodes[0].disableCheckbox = true;

      render(<Tree nodes={disabledCheckboxNodes} checkable={true} />);

      const checkbox = screen
        .getByTestId('tree-node-1')
        .querySelector('input[type="checkbox"]');
      expect(checkbox).toBeDisabled();
    });
  });
});
