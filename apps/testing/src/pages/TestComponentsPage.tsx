/**
 * Test page for @abpjs/components package
 * Tests: Tree component, TreeAdapter, BaseNode models
 * @version 3.1.0 - Initial implementation with Tree component
 * @version 3.2.0 - Custom templates (customNodeTemplate, expandedIconTemplate), handleUpdate, updateTreeFromList
 * @version 3.3.0 - Chakra UI integration, slotProps customization
 * @version 4.0.0 - Dependency update only (peer dep @abp/ng.core bumped to >=4.0.0)
 */
import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Menu } from '@chakra-ui/react'
import {
  Tree,
  TreeAdapter,
  TreeNode,
  createTreeFromList,
  createListFromTree,
  createMapFromList,
  defaultNameResolver,
} from '@abpjs/components'
import type {
  BaseNode,
  TreeNodeData,
  DropEvent,
  TreeNodeTemplateContext,
  ExpandedIconTemplateContext,
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
    <>
      <Menu.Item value="edit" onClick={() => handleMenuAction('Edit', node)}>
        Edit
      </Menu.Item>
      <Menu.Item value="add" onClick={() => handleMenuAction('Add Child', node)}>
        Add Child
      </Menu.Item>
      <Menu.Item value="delete" color="red.500" onClick={() => handleMenuAction('Delete', node)}>
        Delete
      </Menu.Item>
    </>
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

// v3.2.0: Custom Node Template Demo
function TestCustomNodeTemplate() {
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['1', '2']);
  const [templateStyle, setTemplateStyle] = useState<'badge' | 'icon' | 'colored'>('badge');

  const adapter = useMemo(() => {
    return new TreeAdapter(sampleOrgUnits.map(item => ({ ...item })));
  }, []);

  // Different custom node templates
  const badgeTemplate = (ctx: TreeNodeTemplateContext<OrgUnit>) => (
    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <span>{ctx.node.title}</span>
      {ctx.node.entity.code && (
        <span style={{
          background: ctx.isSelected ? '#fff' : '#646cff',
          color: ctx.isSelected ? '#646cff' : '#fff',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '10px',
          fontWeight: 'bold',
        }}>
          {ctx.node.entity.code}
        </span>
      )}
      {ctx.isChecked && <span style={{ color: '#2ecc71' }}>✓</span>}
    </span>
  );

  const iconTemplate = (ctx: TreeNodeTemplateContext<OrgUnit>) => (
    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <span style={{ fontSize: '16px' }}>
        {ctx.level === 0 ? '🏢' : ctx.level === 1 ? '📁' : ctx.node.children.length > 0 ? '📂' : '📄'}
      </span>
      <span>{ctx.node.title}</span>
    </span>
  );

  const coloredTemplate = (ctx: TreeNodeTemplateContext<OrgUnit>) => {
    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6'];
    const color = colors[ctx.level % colors.length];
    return (
      <span style={{
        color: ctx.isSelected ? '#fff' : color,
        fontWeight: ctx.level === 0 ? 'bold' : 'normal',
      }}>
        {'—'.repeat(ctx.level)} {ctx.node.title}
      </span>
    );
  };

  const templates = {
    badge: badgeTemplate,
    icon: iconTemplate,
    colored: coloredTemplate,
  };

  return (
    <div className="test-section">
      <h2>Custom Node Template (v3.2.0)</h2>

      <div className="test-card">
        <h3>Template Styles</h3>
        <p>Choose a template style to see different custom node rendering:</p>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button
            onClick={() => setTemplateStyle('badge')}
            style={{ background: templateStyle === 'badge' ? '#646cff' : undefined }}
          >
            Badge Style
          </button>
          <button
            onClick={() => setTemplateStyle('icon')}
            style={{ background: templateStyle === 'icon' ? '#646cff' : undefined }}
          >
            Icon Style
          </button>
          <button
            onClick={() => setTemplateStyle('colored')}
            style={{ background: templateStyle === 'colored' ? '#646cff' : undefined }}
          >
            Colored Style
          </button>
        </div>
        <div style={{ border: '1px solid #333', borderRadius: '8px', padding: '1rem' }}>
          <Tree<OrgUnit>
            nodes={adapter.getTree()}
            expandedKeys={expandedKeys}
            customNodeTemplate={templates[templateStyle]}
            onExpandedKeysChange={setExpandedKeys}
          />
        </div>
      </div>

      <div className="test-card">
        <h3>TreeNodeTemplateContext</h3>
        <pre style={{ fontSize: '12px', background: '#1a1a2e', padding: '0.5rem', borderRadius: '4px' }}>
{`interface TreeNodeTemplateContext<T> {
  node: TreeNodeData<T>;  // The node being rendered
  isExpanded: boolean;    // Whether node is expanded
  isSelected: boolean;    // Whether node is selected
  isChecked: boolean;     // Whether node is checked
  level: number;          // Nesting level (0 = root)
}`}
        </pre>
      </div>
    </div>
  );
}

// v3.2.0: Custom Expanded Icon Template Demo
function TestExpandedIconTemplate() {
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['1', '2']);
  const [iconStyle, setIconStyle] = useState<'plus' | 'arrow' | 'folder' | 'chevron'>('plus');

  const adapter = useMemo(() => {
    return new TreeAdapter(sampleOrgUnits.map(item => ({ ...item })));
  }, []);

  // Different expanded icon templates
  const plusTemplate = (ctx: ExpandedIconTemplateContext<OrgUnit>) => (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '16px',
      height: '16px',
      border: '1px solid #888',
      borderRadius: '2px',
      fontSize: '12px',
      fontWeight: 'bold',
    }}>
      {ctx.isExpanded ? '−' : '+'}
    </span>
  );

  const arrowTemplate = (ctx: ExpandedIconTemplateContext<OrgUnit>) => (
    <span style={{
      display: 'inline-block',
      transition: 'transform 0.2s',
      transform: ctx.isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
    }}>
      ➤
    </span>
  );

  const folderTemplate = (ctx: ExpandedIconTemplateContext<OrgUnit>) => (
    <span style={{ fontSize: '14px' }}>
      {ctx.isExpanded ? '📂' : '📁'}
    </span>
  );

  const chevronTemplate = (ctx: ExpandedIconTemplateContext<OrgUnit>) => (
    <span style={{
      display: 'inline-block',
      transition: 'transform 0.2s',
      transform: ctx.isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
      color: '#646cff',
    }}>
      ›
    </span>
  );

  const templates = {
    plus: plusTemplate,
    arrow: arrowTemplate,
    folder: folderTemplate,
    chevron: chevronTemplate,
  };

  return (
    <div className="test-section">
      <h2>Custom Expanded Icon Template (v3.2.0)</h2>

      <div className="test-card">
        <h3>Icon Styles</h3>
        <p>Choose an icon style for expand/collapse indicators:</p>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button
            onClick={() => setIconStyle('plus')}
            style={{ background: iconStyle === 'plus' ? '#646cff' : undefined }}
          >
            [+/-] Style
          </button>
          <button
            onClick={() => setIconStyle('arrow')}
            style={{ background: iconStyle === 'arrow' ? '#646cff' : undefined }}
          >
            Arrow Style
          </button>
          <button
            onClick={() => setIconStyle('folder')}
            style={{ background: iconStyle === 'folder' ? '#646cff' : undefined }}
          >
            Folder Style
          </button>
          <button
            onClick={() => setIconStyle('chevron')}
            style={{ background: iconStyle === 'chevron' ? '#646cff' : undefined }}
          >
            Chevron Style
          </button>
        </div>
        <div style={{ border: '1px solid #333', borderRadius: '8px', padding: '1rem' }}>
          <Tree<OrgUnit>
            nodes={adapter.getTree()}
            expandedKeys={expandedKeys}
            expandedIconTemplate={templates[iconStyle]}
            onExpandedKeysChange={setExpandedKeys}
          />
        </div>
      </div>

      <div className="test-card">
        <h3>ExpandedIconTemplateContext</h3>
        <pre style={{ fontSize: '12px', background: '#1a1a2e', padding: '0.5rem', borderRadius: '4px' }}>
{`interface ExpandedIconTemplateContext<T> {
  node: TreeNodeData<T>;  // The node for this icon
  isExpanded: boolean;    // Whether node is expanded
}`}
        </pre>
      </div>
    </div>
  );
}

// v3.2.0: handleUpdate and updateTreeFromList Demo
function TestTreeAdapterV320() {
  const [data, setData] = useState(() => sampleOrgUnits.slice(0, 5).map(item => ({ ...item })));
  const [log, setLog] = useState<string[]>([]);

  const adapter = useMemo(() => new TreeAdapter(data), [data]);

  const handleUpdateChildren = () => {
    // Replace children of Engineering (id: 2) with new teams
    const newChildren: OrgUnit[] = [
      { id: 'new-1', parentId: '2', name: 'AI Team', displayName: 'AI Team', code: 'AI' },
      { id: 'new-2', parentId: '2', name: 'ML Team', displayName: 'ML Team', code: 'ML' },
      { id: 'new-3', parentId: '2', name: 'Data Team', displayName: 'Data Team', code: 'DATA' },
    ];

    adapter.handleUpdate({ key: '2', children: newChildren });
    setData([...adapter.getList()]);
    setLog(prev => ['handleUpdate: Replaced Engineering children with AI, ML, Data teams', ...prev.slice(0, 4)]);
  };

  const handleReplaceTree = () => {
    // Replace entire tree with new data
    const newList: OrgUnit[] = [
      { id: 'corp', parentId: null, name: 'New Corp', displayName: 'New Corporation', code: 'NCORP' },
      { id: 'tech', parentId: 'corp', name: 'Technology', displayName: 'Technology Division', code: 'TECH' },
      { id: 'ops', parentId: 'corp', name: 'Operations', displayName: 'Operations Division', code: 'OPS' },
    ];

    adapter.updateTreeFromList(newList);
    setData([...adapter.getList()]);
    setLog(prev => ['updateTreeFromList: Replaced entire tree with New Corporation structure', ...prev.slice(0, 4)]);
  };

  const handleReset = () => {
    setData(sampleOrgUnits.slice(0, 5).map(item => ({ ...item })));
    setLog(prev => ['Reset: Restored original sample data', ...prev.slice(0, 4)]);
  };

  return (
    <div className="test-section">
      <h2>TreeAdapter New Methods (v3.2.0)</h2>

      <div className="test-card">
        <h3>handleUpdate & updateTreeFromList</h3>
        <p>New methods for updating tree data:</p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <button onClick={handleUpdateChildren}>
            handleUpdate (Replace Engineering Children)
          </button>
          <button onClick={handleReplaceTree}>
            updateTreeFromList (Replace Entire Tree)
          </button>
          <button onClick={handleReset} style={{ background: '#e74c3c' }}>
            Reset
          </button>
        </div>
        <div style={{ border: '1px solid #333', borderRadius: '8px', padding: '1rem' }}>
          <Tree<OrgUnit>
            nodes={adapter.getTree()}
            expandedKeys={data.map(d => d.id)}
          />
        </div>
      </div>

      <div className="test-card">
        <h3>Operation Log</h3>
        {log.length > 0 ? (
          <ul style={{ margin: 0, padding: '0 0 0 1.5rem' }}>
            {log.map((entry, i) => (
              <li key={i} style={{ color: i === 0 ? '#2ecc71' : '#888' }}>{entry}</li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#888' }}>Click buttons above to see operations</p>
        )}
      </div>

      <div className="test-card">
        <h3>New v3.2.0 Methods</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Method</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ backgroundColor: '#1a2e1a' }}>
              <td style={{ padding: '8px' }}><code>handleUpdate({'{ key, children }'})</code></td>
              <td>Replaces children of a node with new children</td>
            </tr>
            <tr style={{ backgroundColor: '#1a2e1a' }}>
              <td style={{ padding: '8px' }}><code>updateTreeFromList(list)</code></td>
              <td>Replaces internal list and rebuilds tree</td>
            </tr>
          </tbody>
        </table>
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

// v3.3.0: slotProps Customization Demo
function TestTreeSlotProps() {
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['1', '2']);
  const [selectedNode, setSelectedNode] = useState<OrgUnit | undefined>();
  const [checkedKeys, setCheckedKeys] = useState<string[]>(['5']);

  const adapter = useMemo(() => {
    return new TreeAdapter(sampleOrgUnits.map(item => ({ ...item })));
  }, []);

  return (
    <div className="test-section">
      <h2>Tree slotProps Customization (v3.3.0)</h2>

      <div className="test-card">
        <h3>Customized via slotProps</h3>
        <p>The Tree now uses Chakra UI internally. Use <code>slotProps</code> to customize individual elements:</p>
        <div style={{ border: '1px solid #333', borderRadius: '8px', padding: '1rem', marginTop: '0.5rem' }}>
          <Tree<OrgUnit>
            nodes={adapter.getTree()}
            expandedKeys={expandedKeys}
            selectedNode={selectedNode}
            checkedKeys={checkedKeys}
            checkable
            onExpandedKeysChange={setExpandedKeys}
            onSelectedNodeChange={setSelectedNode}
            onCheckedKeysChange={setCheckedKeys}
            slotProps={{
              root: { p: 3, borderRadius: 'md' },
              checkbox: { colorPalette: 'teal', size: 'md' },
              title: { fontWeight: 'medium' },
              selectedNode: { bg: 'teal.600', color: 'white' },
            }}
          />
        </div>
      </div>

      <div className="test-card">
        <h3>Available Slots</h3>
        <pre style={{ fontSize: '12px', background: '#1a1a2e', padding: '0.5rem', borderRadius: '4px' }}>
{`interface TreeSlotProps {
  root?: SystemStyleObject;           // Root container
  nodeContent?: SystemStyleObject;    // Each node row
  selectedNode?: SystemStyleObject;   // Selected state override
  dragOverNode?: SystemStyleObject;   // Drag-over state override
  switcher?: { size, variant, colorPalette }
  checkbox?: { colorPalette, size }
  title?: SystemStyleObject;          // Title text
  menuTrigger?: { size, variant, colorPalette }
  menuContent?: SystemStyleObject;    // Menu popover
  childrenContainer?: SystemStyleObject;
}`}
        </pre>
      </div>
    </div>
  );
}

export function TestComponentsPage() {
  return (
    <div>
      <h1>@abpjs/components Tests (v4.0.0)</h1>
      <p>Testing Tree component, TreeAdapter, and utility functions.</p>
      <p style={{ color: '#888', fontSize: '0.9rem' }}>
        Version 4.0.0 - Dependency update only (no source code changes from Angular)
      </p>

      <div style={{ marginBottom: '1rem' }}>
        <Link to="/" style={{ color: '#646cff' }}>&larr; Back to Home</Link>
      </div>

      {/* v4.0.0 Info */}
      <h2 style={{ marginTop: '2rem', borderTop: '2px solid #2ecc71', paddingTop: '1rem' }}>
        v4.0.0 Update
      </h2>
      <div className="test-section">
        <div className="test-card">
          <h3>v4.0.0 Changes</h3>
          <p>This was a <strong>dependency-only update</strong>. No source code changes were made in the Angular package.</p>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #333' }}>
                <th style={{ textAlign: 'left', padding: '8px' }}>Change</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>v3.2.0</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>v4.0.0</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '8px' }}>Peer dependency <code>@abp/ng.core</code></td>
                <td style={{ padding: '8px' }}><code>&gt;=3.2.0-rc.2</code></td>
                <td style={{ padding: '8px' }}><code>&gt;=4.0.0-rc.5</code></td>
              </tr>
              <tr>
                <td style={{ padding: '8px' }}>Package version</td>
                <td style={{ padding: '8px' }}><code>3.2.0</code></td>
                <td style={{ padding: '8px' }}><code>4.0.0</code></td>
              </tr>
              <tr>
                <td style={{ padding: '8px' }}>Source code changes</td>
                <td style={{ padding: '8px' }} colSpan={2}>None — all features from v3.2.0 and v3.3.0 (our Chakra enhancement) carry forward</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* v3.3.0 Features */}
      <h2 style={{ marginTop: '2rem', borderTop: '2px solid #2ecc71', paddingTop: '1rem' }}>
        v3.3.0 Features
      </h2>
      <TestTreeSlotProps />

      {/* v3.2.0 Features */}
      <h2 style={{ marginTop: '2rem', borderTop: '2px solid #2ecc71', paddingTop: '1rem' }}>
        v3.2.0 Features
      </h2>
      <TestCustomNodeTemplate />
      <TestExpandedIconTemplate />
      <TestTreeAdapterV320 />

      {/* Core Features */}
      <h2 style={{ marginTop: '2rem', borderTop: '2px solid #646cff', paddingTop: '1rem' }}>
        Core Tree Features
      </h2>

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
