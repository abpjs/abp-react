/**
 * Test page for @abpjs/components package
 * Tests: Tree component, TreeAdapter, BaseNode models
 * @version 3.1.0 - Initial implementation with Tree component
 */
import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Tree,
  TreeAdapter,
  TreeNode,
  BaseNode,
  TreeNodeData,
  createTreeFromList,
  createListFromTree,
  createMapFromList,
  defaultNameResolver,
  DropEvent,
} from '@abpjs/components'

// Sample data interface
interface OrgUnit extends BaseNode {
  id: string;
  parentId: string | null;
  name: string;
  displayName?: string;
  code?: string;
}

// Sample organization data
const sampleOrgUnits: OrgUnit[] = [
  { id: '1', parentId: null, name: 'Acme Corporation', displayName: 'Acme Corporation', code: 'ACME' },
  { id: '2', parentId: '1', name: 'Engineering', displayName: 'Engineering Department', code: 'ENG' },
  { id: '3', parentId: '1', name: 'Marketing', displayName: 'Marketing Department', code: 'MKT' },
  { id: '4', parentId: '1', name: 'Sales', displayName: 'Sales Department', code: 'SLS' },
  { id: '5', parentId: '2', name: 'Frontend', displayName: 'Frontend Team', code: 'FE' },
  { id: '6', parentId: '2', name: 'Backend', displayName: 'Backend Team', code: 'BE' },
  { id: '7', parentId: '2', name: 'DevOps', displayName: 'DevOps Team', code: 'OPS' },
  { id: '8', parentId: '3', name: 'Digital', displayName: 'Digital Marketing', code: 'DIG' },
  { id: '9', parentId: '3', name: 'Content', displayName: 'Content Team', code: 'CNT' },
  { id: '10', parentId: '5', name: 'React', displayName: 'React Developers', code: 'RCT' },
];

function TestTreeBasic() {
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['1', '2']);
  const [selectedNode, setSelectedNode] = useState<OrgUnit | undefined>();

  const adapter = useMemo(() => {
    return new TreeAdapter(sampleOrgUnits.map(item => ({ ...item })));
  }, []);

  const treeData = adapter.getTree();

  return (
    <div className="test-section">
      <h2>Basic Tree Component</h2>

      <div className="test-card">
        <h3>Interactive Tree</h3>
        <p>Click on nodes to select them. Click the arrow to expand/collapse.</p>
        <div style={{ border: '1px solid #333', borderRadius: '8px', padding: '1rem', marginTop: '0.5rem' }}>
          <Tree<OrgUnit>
            nodes={treeData}
            expandedKeys={expandedKeys}
            selectedNode={selectedNode}
            onExpandedKeysChange={setExpandedKeys}
            onSelectedNodeChange={(entity) => setSelectedNode(entity)}
          />
        </div>
      </div>

      <div className="test-card">
        <h3>Current State</h3>
        <p><strong>Expanded Keys:</strong> {expandedKeys.join(', ') || 'None'}</p>
        <p><strong>Selected Node:</strong> {selectedNode ? `${selectedNode.displayName} (${selectedNode.code})` : 'None'}</p>
      </div>

      <div className="test-card">
        <h3>Tree Props</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Prop</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: '8px' }}>nodes</td><td>TreeNodeData[]</td><td>Tree data structure</td></tr>
            <tr><td style={{ padding: '8px' }}>expandedKeys</td><td>string[]</td><td>Keys of expanded nodes</td></tr>
            <tr><td style={{ padding: '8px' }}>selectedNode</td><td>T</td><td>Currently selected entity</td></tr>
            <tr><td style={{ padding: '8px' }}>onExpandedKeysChange</td><td>(keys) =&gt; void</td><td>Called when expand state changes</td></tr>
            <tr><td style={{ padding: '8px' }}>onSelectedNodeChange</td><td>(entity) =&gt; void</td><td>Called when selection changes</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TestTreeCheckable() {
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['1', '2', '3']);
  const [checkedKeys, setCheckedKeys] = useState<string[]>(['5', '6']);

  const adapter = useMemo(() => {
    return new TreeAdapter(sampleOrgUnits.map(item => ({ ...item })));
  }, []);

  return (
    <div className="test-section">
      <h2>Checkable Tree</h2>

      <div className="test-card">
        <h3>Tree with Checkboxes</h3>
        <p>Enable checkable mode to allow multi-selection with checkboxes.</p>
        <div style={{ border: '1px solid #333', borderRadius: '8px', padding: '1rem', marginTop: '0.5rem' }}>
          <Tree<OrgUnit>
            nodes={adapter.getTree()}
            expandedKeys={expandedKeys}
            checkedKeys={checkedKeys}
            checkable={true}
            onExpandedKeysChange={setExpandedKeys}
            onCheckedKeysChange={setCheckedKeys}
          />
        </div>
      </div>

      <div className="test-card">
        <h3>Checked Nodes</h3>
        <p><strong>Checked Keys:</strong> {checkedKeys.join(', ') || 'None'}</p>
        <p style={{ fontSize: '0.9rem', color: '#888' }}>
          Click checkboxes to toggle selection. Use <code>checkStrictly</code> prop to control parent-child association.
        </p>
      </div>
    </div>
  );
}

function TestTreeDraggable() {
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['1', '2']);
  const [adapter, setAdapter] = useState(() => new TreeAdapter(sampleOrgUnits.map(item => ({ ...item }))));
  const [dropLog, setDropLog] = useState<string[]>([]);

  const handleDrop = (event: DropEvent<OrgUnit>) => {
    const log = `Dropped "${event.node.title}" ${event.pos === 0 ? 'into' : event.pos === -1 ? 'before' : 'after'} "${event.targetNode?.title}"`;
    setDropLog(prev => [log, ...prev.slice(0, 4)]);

    // Update the adapter
    if (event.targetNode) {
      const node = adapter.findNode(event.node.key);
      if (node) {
        node.parentNode = event.pos === 0 ? event.targetNode as TreeNode<OrgUnit> : event.targetNode.parentNode as TreeNode<OrgUnit> | null;
        adapter.handleDrop(node);
        setAdapter(new TreeAdapter(adapter.getList()));
      }
    }
  };

  return (
    <div className="test-section">
      <h2>Draggable Tree</h2>

      <div className="test-card">
        <h3>Drag and Drop</h3>
        <p>Enable draggable mode to allow reorganizing the tree structure.</p>
        <div style={{ border: '1px solid #333', borderRadius: '8px', padding: '1rem', marginTop: '0.5rem' }}>
          <Tree<OrgUnit>
            nodes={adapter.getTree()}
            expandedKeys={expandedKeys}
            draggable={true}
            onExpandedKeysChange={setExpandedKeys}
            onDrop={handleDrop}
          />
        </div>
      </div>

      <div className="test-card">
        <h3>Drop Log</h3>
        {dropLog.length > 0 ? (
          <ul style={{ margin: 0, padding: '0 0 0 1.5rem' }}>
            {dropLog.map((log, i) => (
              <li key={i} style={{ color: i === 0 ? '#2ecc71' : '#888' }}>{log}</li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#888' }}>Drag nodes to see drop events here</p>
        )}
      </div>
    </div>
  );
}

function TestTreeContextMenu() {
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['1', '2']);
  const [actionLog, setActionLog] = useState<string[]>([]);

  const adapter = useMemo(() => {
    return new TreeAdapter(sampleOrgUnits.map(item => ({ ...item })));
  }, []);

  const handleMenuAction = (action: string, node: TreeNodeData<OrgUnit>) => {
    const log = `${action}: ${node.title}`;
    setActionLog(prev => [log, ...prev.slice(0, 4)]);
  };

  const renderMenu = (node: TreeNodeData<OrgUnit>) => (
    <div style={{ padding: '0.5rem 0' }}>
      <button
        onClick={() => handleMenuAction('Edit', node)}
        style={{ display: 'block', width: '100%', padding: '0.5rem 1rem', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }}
      >
        Edit
      </button>
      <button
        onClick={() => handleMenuAction('Add Child', node)}
        style={{ display: 'block', width: '100%', padding: '0.5rem 1rem', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }}
      >
        Add Child
      </button>
      <button
        onClick={() => handleMenuAction('Delete', node)}
        style={{ display: 'block', width: '100%', padding: '0.5rem 1rem', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', color: '#e74c3c' }}
      >
        Delete
      </button>
    </div>
  );

  return (
    <div className="test-section">
      <h2>Tree with Context Menu</h2>

      <div className="test-card">
        <h3>Custom Menu</h3>
        <p>Click the ⋮ button on each node to open the context menu.</p>
        <div style={{ border: '1px solid #333', borderRadius: '8px', padding: '1rem', marginTop: '0.5rem' }}>
          <Tree<OrgUnit>
            nodes={adapter.getTree()}
            expandedKeys={expandedKeys}
            menu={renderMenu}
            onExpandedKeysChange={setExpandedKeys}
          />
        </div>
      </div>

      <div className="test-card">
        <h3>Action Log</h3>
        {actionLog.length > 0 ? (
          <ul style={{ margin: 0, padding: '0 0 0 1.5rem' }}>
            {actionLog.map((log, i) => (
              <li key={i} style={{ color: i === 0 ? '#646cff' : '#888' }}>{log}</li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#888' }}>Use context menus to see actions here</p>
        )}
      </div>
    </div>
  );
}

function TestTreeAdapter() {
  const [data, setData] = useState(() => sampleOrgUnits.map(item => ({ ...item })));
  const [newName, setNewName] = useState('');
  const [selectedParent, setSelectedParent] = useState<string>('1');

  const adapter = useMemo(() => new TreeAdapter(data), [data]);

  const handleAddNode = () => {
    if (!newName.trim()) return;

    const newNode: OrgUnit = {
      id: `new-${Date.now()}`,
      parentId: selectedParent || null,
      name: newName,
      displayName: newName,
      code: newName.substring(0, 3).toUpperCase(),
    };

    setData(prev => [...prev, newNode]);
    setNewName('');
  };

  const handleRemoveNode = (id: string) => {
    setData(prev => prev.filter(item => item.id !== id && item.parentId !== id));
  };

  return (
    <div className="test-section">
      <h2>TreeAdapter Utility</h2>

      <div className="test-card">
        <h3>Add Node</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Node name"
            style={{ padding: '0.5rem', flex: 1, minWidth: '150px' }}
          />
          <select
            value={selectedParent}
            onChange={(e) => setSelectedParent(e.target.value)}
            style={{ padding: '0.5rem' }}
          >
            <option value="">Root level</option>
            {data.map(item => (
              <option key={item.id} value={item.id}>{item.displayName || item.name}</option>
            ))}
          </select>
          <button onClick={handleAddNode}>Add Node</button>
        </div>
      </div>

      <div className="test-card">
        <h3>Current Tree ({adapter.getList().length} nodes)</h3>
        <div style={{ border: '1px solid #333', borderRadius: '8px', padding: '1rem', marginTop: '0.5rem' }}>
          <Tree<OrgUnit>
            nodes={adapter.getTree()}
            expandedKeys={data.map(d => d.id)}
            menu={(node) => (
              <button
                onClick={() => handleRemoveNode(node.key)}
                style={{ padding: '0.5rem 1rem', color: '#e74c3c' }}
              >
                Remove
              </button>
            )}
          />
        </div>
      </div>

      <div className="test-card">
        <h3>TreeAdapter Methods</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Method</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: '8px' }}><code>getList()</code></td><td>Returns the flat list</td></tr>
            <tr><td style={{ padding: '8px' }}><code>getTree()</code></td><td>Returns the tree structure</td></tr>
            <tr><td style={{ padding: '8px' }}><code>handleDrop(node)</code></td><td>Updates parent on drop</td></tr>
            <tr><td style={{ padding: '8px' }}><code>handleRemove(node)</code></td><td>Removes node and descendants</td></tr>
            <tr><td style={{ padding: '8px' }}><code>addNode(node)</code></td><td>Adds a new node</td></tr>
            <tr><td style={{ padding: '8px' }}><code>updateNode(node)</code></td><td>Updates existing node</td></tr>
            <tr><td style={{ padding: '8px' }}><code>findNode(key)</code></td><td>Finds node by key</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TestUtilityFunctions() {
  const [result, setResult] = useState<string>('');

  const testCreateTreeFromList = () => {
    const list: OrgUnit[] = [
      { id: '1', parentId: null, name: 'Root' },
      { id: '2', parentId: '1', name: 'Child 1' },
      { id: '3', parentId: '1', name: 'Child 2' },
    ];
    const tree = createTreeFromList(list);
    setResult(`createTreeFromList: ${tree.length} root nodes, first has ${tree[0]?.children?.length || 0} children`);
  };

  const testCreateListFromTree = () => {
    const adapter = new TreeAdapter(sampleOrgUnits);
    const list = createListFromTree(adapter.getTree());
    setResult(`createListFromTree: Converted tree back to ${list.length} flat items`);
  };

  const testCreateMapFromList = () => {
    const map = createMapFromList(sampleOrgUnits);
    setResult(`createMapFromList: Created map with ${map.size} entries`);
  };

  const testDefaultNameResolver = () => {
    const withDisplayName = { id: '1', parentId: null, name: 'name', displayName: 'Display Name' };
    const withoutDisplayName = { id: '2', parentId: null, name: 'Just Name' };
    const result1 = defaultNameResolver(withDisplayName);
    const result2 = defaultNameResolver(withoutDisplayName);
    setResult(`defaultNameResolver: "${result1}" (displayName), "${result2}" (name fallback)`);
  };

  return (
    <div className="test-section">
      <h2>Utility Functions</h2>

      <div className="test-card">
        <h3>Test Functions</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <button onClick={testCreateTreeFromList}>createTreeFromList</button>
          <button onClick={testCreateListFromTree}>createListFromTree</button>
          <button onClick={testCreateMapFromList}>createMapFromList</button>
          <button onClick={testDefaultNameResolver}>defaultNameResolver</button>
        </div>
        {result && (
          <div style={{ padding: '0.5rem', background: '#1a1a2e', borderRadius: '4px' }}>
            <code style={{ color: '#2ecc71' }}>{result}</code>
          </div>
        )}
      </div>

      <div className="test-card">
        <h3>Exported Functions</h3>
        <ul>
          <li><code>createTreeFromList(list, nameResolver?)</code> - Converts flat list to tree</li>
          <li><code>createListFromTree(tree)</code> - Converts tree back to flat list</li>
          <li><code>createMapFromList(list, nameResolver?)</code> - Creates Map for lookups</li>
          <li><code>defaultNameResolver(entity)</code> - Returns displayName or name</li>
        </ul>
      </div>
    </div>
  );
}

function TestBaseNodeModel() {
  return (
    <div className="test-section">
      <h2>BaseNode Interface</h2>

      <div className="test-card">
        <h3>Interface Definition</h3>
        <pre style={{ fontSize: '12px', background: '#1a1a2e', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`interface BaseNode {
  id: string;           // Unique identifier
  parentId: string | null;  // Parent node id (null for root)
  name?: string;        // Optional name
  displayName?: string; // Optional display name (preferred)
}`}
        </pre>
      </div>

      <div className="test-card">
        <h3>TreeNodeData Interface</h3>
        <pre style={{ fontSize: '12px', background: '#1a1a2e', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`interface TreeNodeData<T extends BaseNode> {
  entity: T;            // Original entity
  key: string;          // Unique key (= id)
  title: string;        // Display title
  children: TreeNodeData<T>[];
  isLeaf: boolean;      // No children
  checked: boolean;     // Checkbox state
  selected: boolean;    // Selection state
  expanded: boolean;    // Expand state
  disabled: boolean;    // Disabled state
  // ... and more
}`}
        </pre>
      </div>

      <div className="test-card">
        <h3>Usage Example</h3>
        <pre style={{ fontSize: '12px', background: '#1a1a2e', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`import { BaseNode, TreeAdapter, Tree } from '@abpjs/components';

interface MyEntity extends BaseNode {
  id: string;
  parentId: string | null;
  name: string;
  customField: number;
}

const data: MyEntity[] = [
  { id: '1', parentId: null, name: 'Root', customField: 100 },
  { id: '2', parentId: '1', name: 'Child', customField: 200 },
];

const adapter = new TreeAdapter(data);

<Tree<MyEntity>
  nodes={adapter.getTree()}
  onSelectedNodeChange={(entity) => {
    console.log(entity.customField); // Type-safe access
  }}
/>`}
        </pre>
      </div>
    </div>
  );
}

export function TestComponentsPage() {
  return (
    <div>
      <h1>@abpjs/components Tests (v3.1.0)</h1>
      <p>Testing Tree component, TreeAdapter, and utility functions.</p>
      <p style={{ color: '#888', fontSize: '0.9rem' }}>
        Version 3.1.0 - Initial implementation with Tree component and utilities
      </p>

      <div style={{ marginBottom: '1rem' }}>
        <Link to="/" style={{ color: '#646cff' }}>&larr; Back to Home</Link>
      </div>

      {/* Basic Tree */}
      <TestTreeBasic />

      {/* Checkable Tree */}
      <TestTreeCheckable />

      {/* Draggable Tree */}
      <TestTreeDraggable />

      {/* Context Menu */}
      <TestTreeContextMenu />

      {/* TreeAdapter */}
      <TestTreeAdapter />

      {/* Utility Functions */}
      <TestUtilityFunctions />

      {/* Models */}
      <TestBaseNodeModel />
    </div>
  );
}

export default TestComponentsPage;
