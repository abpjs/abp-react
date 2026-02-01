/**
 * Test page for @abpjs/permission-management package
 * Tests: PermissionManagementModal, usePermissionManagement hook, PermissionManagementStateService
 */
import { useState } from 'react'
import { useAuth, useConfig } from '@abpjs/core'
import {
  PermissionManagementModal,
  usePermissionManagement,
  PermissionManagementStateService,
} from '@abpjs/permission-management'
import type { PermissionManagement } from '@abpjs/permission-management'

function TestPermissionModal() {
  const [roleModalVisible, setRoleModalVisible] = useState(false)
  const [userModalVisible, setUserModalVisible] = useState(false)
  const [testRoleId, setTestRoleId] = useState('')
  const [testUserId, setTestUserId] = useState('')
  const [hideBadges, setHideBadges] = useState(false)
  const { isAuthenticated } = useAuth()
  const config = useConfig()

  // Get current user ID for testing user permissions
  const currentUserId = config.currentUser?.id || ''

  return (
    <div className="test-section">
      <h2>PermissionManagementModal Component</h2>

      <div className="test-card">
        <h3>Role Permissions</h3>
        <p>Open the permission modal for a role (providerName="R"):</p>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Enter Role ID"
            value={testRoleId}
            onChange={(e) => setTestRoleId(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333',
              flex: 1
            }}
          />
          <button
            onClick={() => setRoleModalVisible(true)}
            disabled={!testRoleId || !isAuthenticated}
          >
            Manage Role Permissions
          </button>
        </div>
        {!isAuthenticated && (
          <p style={{ color: '#f88', fontSize: '12px' }}>Login required to manage permissions</p>
        )}
      </div>

      <div className="test-card">
        <h3>User Permissions</h3>
        <p>Open the permission modal for a user (providerName="U"):</p>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Enter User ID"
            value={testUserId}
            onChange={(e) => setTestUserId(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333',
              flex: 1
            }}
          />
          <button
            onClick={() => setUserModalVisible(true)}
            disabled={!testUserId || !isAuthenticated}
          >
            Manage User Permissions
          </button>
        </div>
        {currentUserId && (
          <p style={{ color: '#888', fontSize: '12px' }}>
            Your User ID: <code style={{ background: 'rgba(50,50,50,0.10)', padding: '2px 4px', borderRadius: '2px' }}>{currentUserId}</code>
            <button
              style={{ marginLeft: '8px', fontSize: '12px', padding: '2px 8px' }}
              onClick={() => setTestUserId(currentUserId)}
            >
              Use My ID
            </button>
          </p>
        )}
      </div>

      <div className="test-card">
        <h3>Modal Options (v1.1.0)</h3>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={hideBadges}
            onChange={(e) => setHideBadges(e.target.checked)}
          />
          <span>hideBadges</span>
          <span style={{ fontSize: '12px', color: '#888' }}>- Hide provider badges (e.g., "R", "U") on permissions</span>
        </label>
      </div>

      <div className="test-card">
        <h3>Component Props</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Prop</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Required</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: '8px' }}>providerName</td><td>"R" | "U"</td><td>Yes</td></tr>
            <tr><td style={{ padding: '8px' }}>providerKey</td><td>string</td><td>Yes</td></tr>
            <tr><td style={{ padding: '8px' }}>visible</td><td>boolean</td><td>Yes</td></tr>
            <tr><td style={{ padding: '8px' }}>onVisibleChange</td><td>(visible: boolean) =&gt; void</td><td>No</td></tr>
            <tr><td style={{ padding: '8px' }}>onSave</td><td>() =&gt; void</td><td>No</td></tr>
            <tr style={{ background: 'rgba(100,108,255,0.1)' }}><td style={{ padding: '8px' }}>hideBadges</td><td>boolean</td><td>No (v1.1.0)</td></tr>
          </tbody>
        </table>
      </div>

      {/* Role Permission Modal */}
      <PermissionManagementModal
        providerName="R"
        providerKey={testRoleId}
        visible={roleModalVisible}
        onVisibleChange={setRoleModalVisible}
        hideBadges={hideBadges}
        onSave={() => {
          console.log('Role permissions saved!')
        }}
      />

      {/* User Permission Modal */}
      <PermissionManagementModal
        providerName="U"
        providerKey={testUserId}
        visible={userModalVisible}
        onVisibleChange={setUserModalVisible}
        hideBadges={hideBadges}
        onSave={() => {
          console.log('User permissions saved!')
        }}
      />
    </div>
  )
}

function TestPermissionHook() {
  const [testProviderKey, setTestProviderKey] = useState('')
  const [testProviderName, setTestProviderName] = useState<'R' | 'U'>('R')
  const { isAuthenticated } = useAuth()

  const {
    groups,
    entityDisplayName,
    selectedGroup,
    isLoading,
    error,
    selectThisTab,
    selectAllTab,
    fetchPermissions,
    setSelectedGroup,
    togglePermission,
    toggleSelectThisTab,
    toggleSelectAll,
    getSelectedGroupPermissions,
    isGranted,
    isGrantedByRole,
    isGrantedByOtherProviderName,
    reset,
  } = usePermissionManagement()

  const handleFetch = () => {
    if (testProviderKey) {
      fetchPermissions(testProviderKey, testProviderName)
    }
  }

  return (
    <div className="test-section">
      <h2>usePermissionManagement Hook</h2>

      <div className="test-card">
        <h3>Fetch Permissions Manually</h3>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
          <select
            value={testProviderName}
            onChange={(e) => setTestProviderName(e.target.value as 'R' | 'U')}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333'
            }}
          >
            <option value="R">Role (R)</option>
            <option value="U">User (U)</option>
          </select>
          <input
            type="text"
            placeholder="Provider Key (ID)"
            value={testProviderKey}
            onChange={(e) => setTestProviderKey(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333',
              flex: 1
            }}
          />
          <button onClick={handleFetch} disabled={!testProviderKey || !isAuthenticated || isLoading}>
            {isLoading ? 'Loading...' : 'Fetch'}
          </button>
        </div>
      </div>

      <div className="test-card">
        <h3>Hook State</h3>
        <p>isLoading: {isLoading ? 'true' : 'false'}</p>
        <p>error: {error || 'null'}</p>
        <p>entityDisplayName: {entityDisplayName || 'N/A'}</p>
        <p>groups count: {groups.length}</p>
        <p>selectedGroup: {selectedGroup?.displayName || 'none'}</p>
        <p>selectThisTab: {selectThisTab ? 'true' : 'false'}</p>
        <p>selectAllTab: {selectAllTab ? 'true' : 'false'}</p>
      </div>

      {groups.length > 0 && (
        <div className="test-card">
          <h3>Permission Groups</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {groups.map((group) => (
              <button
                key={group.name}
                onClick={() => setSelectedGroup(group)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  background: selectedGroup?.name === group.name ? '#646cff' : '#333',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {group.displayName}
              </button>
            ))}
          </div>

          {selectedGroup && (
            <div>
              <h4>Permissions in "{selectedGroup.displayName}"</h4>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <button onClick={toggleSelectThisTab}>
                  {selectThisTab ? 'Deselect' : 'Select'} This Tab
                </button>
                <button onClick={toggleSelectAll}>
                  {selectAllTab ? 'Deselect' : 'Select'} All
                </button>
                <button onClick={reset} style={{ background: '#f44', color: 'white' }}>
                  Reset
                </button>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {getSelectedGroupPermissions().map((permission) => (
                  <li key={permission.name} style={{ padding: '4px 0', marginLeft: `${permission.margin}px` }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={isGranted(permission.name)}
                        onChange={() => togglePermission(permission)}
                      />
                      <span>{permission.displayName}</span>
                      {permission.isGranted && (
                        <span style={{ fontSize: '12px', color: '#6f6' }}>(originally granted)</span>
                      )}
                      {isGrantedByRole(permission.grantedProviders) && (
                        <span style={{ fontSize: '12px', color: '#ff6', background: '#333', padding: '1px 4px', borderRadius: '3px' }}>
                          from role
                        </span>
                      )}
                      {isGrantedByOtherProviderName(permission.grantedProviders, testProviderName) && (
                        <span style={{ fontSize: '12px', color: '#6cf', background: '#333', padding: '1px 4px', borderRadius: '3px', marginLeft: '4px' }}>
                          granted by other provider
                        </span>
                      )}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="test-card">
        <h3>Hook Methods</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Method</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: '8px' }}>fetchPermissions</td><td>Fetch permissions for provider</td></tr>
            <tr><td style={{ padding: '8px' }}>savePermissions</td><td>Save modified permissions</td></tr>
            <tr><td style={{ padding: '8px' }}>setSelectedGroup</td><td>Select a permission group</td></tr>
            <tr><td style={{ padding: '8px' }}>togglePermission</td><td>Toggle a permission on/off</td></tr>
            <tr><td style={{ padding: '8px' }}>toggleSelectThisTab</td><td>Toggle all permissions in current tab</td></tr>
            <tr><td style={{ padding: '8px' }}>toggleSelectAll</td><td>Toggle all permissions</td></tr>
            <tr><td style={{ padding: '8px' }}>getSelectedGroupPermissions</td><td>Get permissions for selected group with margin</td></tr>
            <tr><td style={{ padding: '8px' }}>isGranted</td><td>Check if permission is granted</td></tr>
            <tr><td style={{ padding: '8px' }}>isGrantedByRole</td><td>Check if permission is granted by a role (deprecated in v1.1.0)</td></tr>
            <tr style={{ background: 'rgba(100,108,255,0.1)' }}><td style={{ padding: '8px' }}>isGrantedByOtherProviderName</td><td>Check if permission is granted by another provider (v1.1.0)</td></tr>
            <tr><td style={{ padding: '8px' }}>reset</td><td>Reset all state</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TestPermissionManagementStateService() {
  const [providerKey, setProviderKey] = useState('')
  const [providerName, setProviderName] = useState<'R' | 'U'>('R')
  const [stateServiceResult, setStateServiceResult] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const { isAuthenticated } = useAuth()

  // Create a state service instance (in real usage, this would be shared via context)
  const [stateService] = useState(() => new PermissionManagementStateService())

  const handleDispatchGetPermissions = async () => {
    if (!providerKey) return
    setIsLoading(true)
    setStateServiceResult('')
    try {
      const result = await stateService.dispatchGetPermissions({
        providerKey,
        providerName,
      })
      setStateServiceResult(JSON.stringify({
        entityDisplayName: result.entityDisplayName,
        groupsCount: result.groups.length,
        groups: result.groups.map(g => ({
          name: g.name,
          displayName: g.displayName,
          permissionsCount: g.permissions.length,
        })),
      }, null, 2))
    } catch (error) {
      setStateServiceResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDispatchUpdatePermissions = async () => {
    if (!providerKey) return
    setIsLoading(true)
    setStateServiceResult('')
    try {
      // Example: toggle a permission (in real usage, you'd get the actual permissions to update)
      await stateService.dispatchUpdatePermissions({
        providerKey,
        providerName,
        permissions: [], // Empty for demo - would contain actual permission changes
      })
      setStateServiceResult('Permissions updated successfully! State has been refreshed.')
    } catch (error) {
      setStateServiceResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="test-section">
      <h2>PermissionManagementStateService (v2.0.0)</h2>

      <div className="test-card">
        <h3>Dispatch Methods</h3>
        <p>The PermissionManagementStateService provides dispatch methods for getting and updating permissions:</p>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
          <select
            value={providerName}
            onChange={(e) => setProviderName(e.target.value as 'R' | 'U')}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333'
            }}
          >
            <option value="R">Role (R)</option>
            <option value="U">User (U)</option>
          </select>
          <input
            type="text"
            placeholder="Provider Key (ID)"
            value={providerKey}
            onChange={(e) => setProviderKey(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333',
              flex: 1
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button
            onClick={handleDispatchGetPermissions}
            disabled={!providerKey || !isAuthenticated || isLoading}
          >
            {isLoading ? 'Loading...' : 'dispatchGetPermissions()'}
          </button>
          <button
            onClick={handleDispatchUpdatePermissions}
            disabled={!providerKey || !isAuthenticated || isLoading}
          >
            {isLoading ? 'Loading...' : 'dispatchUpdatePermissions()'}
          </button>
        </div>

        {stateServiceResult && (
          <pre style={{
            background: 'rgba(50,50,50,0.3)',
            padding: '1rem',
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '300px',
            fontSize: '12px'
          }}>
            {stateServiceResult}
          </pre>
        )}

        {!isAuthenticated && (
          <p style={{ color: '#f88', fontSize: '12px' }}>Login required to use state service</p>
        )}
      </div>

      <div className="test-card">
        <h3>State Service Methods</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Method</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Version</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: '8px' }}>getPermissionGroups()</td><td>Get current permission groups</td><td>v1.1.0</td></tr>
            <tr><td style={{ padding: '8px' }}>getEntityDisplayName()</td><td>Get entity display name</td><td>v1.1.0</td></tr>
            <tr><td style={{ padding: '8px' }}>setPermissionResponse()</td><td>Set permission response state</td><td>v1.1.0</td></tr>
            <tr style={{ background: 'rgba(100,108,255,0.1)' }}><td style={{ padding: '8px' }}>dispatchGetPermissions()</td><td>Fetch permissions from API and update state</td><td>v2.0.0</td></tr>
            <tr style={{ background: 'rgba(100,108,255,0.1)' }}><td style={{ padding: '8px' }}>dispatchUpdatePermissions()</td><td>Update permissions via API and refresh state</td><td>v2.0.0</td></tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>Constructor (v2.0.0)</h3>
        <p>The state service now accepts an optional <code>PermissionManagementService</code> in the constructor:</p>
        <pre style={{
          background: 'rgba(50,50,50,0.3)',
          padding: '1rem',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
{`// Without service (basic state management)
const stateService = new PermissionManagementStateService();

// With service (enables dispatch methods)
const stateService = new PermissionManagementStateService(permissionService);`}
        </pre>
      </div>
    </div>
  )
}

function TestComponentInterfaces() {
  // Demo of component interface types (v2.0.0)
  const componentInputs: PermissionManagement.PermissionManagementComponentInputs = {
    visible: true,
    providerName: 'R',
    providerKey: 'admin-role-id',
    hideBadges: false,
  }

  const componentOutputs: PermissionManagement.PermissionManagementComponentOutputs = {
    visibleChange: (visible: boolean) => {
      console.log('Visibility changed:', visible)
    },
  }

  return (
    <div className="test-section">
      <h2>Component Interface Types (v2.0.0)</h2>

      <div className="test-card">
        <h3>PermissionManagementComponentInputs</h3>
        <p>Interface defining the input props for the permission management component:</p>
        <pre style={{
          background: 'rgba(50,50,50,0.3)',
          padding: '1rem',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
{`interface PermissionManagementComponentInputs {
  visible: boolean;           // Whether the modal is visible
  readonly providerName: string;  // Provider name ('R' for Role, 'U' for User)
  readonly providerKey: string;   // Provider key (role ID or user ID)
  readonly hideBadges: boolean;   // Hide provider badges on permissions
}`}
        </pre>
        <p style={{ marginTop: '1rem' }}>Example usage:</p>
        <pre style={{
          background: 'rgba(50,50,50,0.3)',
          padding: '1rem',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
{JSON.stringify(componentInputs, null, 2)}
        </pre>
      </div>

      <div className="test-card">
        <h3>PermissionManagementComponentOutputs</h3>
        <p>Interface defining the output callbacks for the permission management component:</p>
        <pre style={{
          background: 'rgba(50,50,50,0.3)',
          padding: '1rem',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
{`interface PermissionManagementComponentOutputs {
  readonly visibleChange?: (visible: boolean) => void;  // Callback when visibility changes
}`}
        </pre>
        <p style={{ marginTop: '1rem' }}>Example usage:</p>
        <pre style={{
          background: 'rgba(50,50,50,0.3)',
          padding: '1rem',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
{`{
  visibleChange: (visible) => console.log('Visibility:', visible)
}`}
        </pre>
        <p style={{ fontSize: '12px', color: '#888', marginTop: '0.5rem' }}>
          visibleChange callback is defined: {typeof componentOutputs.visibleChange === 'function' ? 'Yes' : 'No'}
        </p>
      </div>

      <div className="test-card">
        <h3>Type-Safe Component Props</h3>
        <p>These interfaces ensure type safety when using the PermissionManagementModal component:</p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Interface</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Properties</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px' }}>PermissionManagementComponentInputs</td>
              <td style={{ padding: '8px' }}>visible, providerName, providerKey, hideBadges</td>
              <td style={{ padding: '8px' }}>Component input props</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}>PermissionManagementComponentOutputs</td>
              <td style={{ padding: '8px' }}>visibleChange</td>
              <td style={{ padding: '8px' }}>Component output callbacks</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TestApiEndpoints() {
  return (
    <div className="test-section">
      <h2>API Endpoints</h2>

      <div className="test-card">
        <h3>Backend Endpoints Used</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Method</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Endpoint</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px' }}><code>GET</code></td>
              <td style={{ padding: '8px' }}><code>/api/permission-management/permissions</code></td>
              <td>Fetch permissions</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>PUT</code></td>
              <td style={{ padding: '8px' }}><code>/api/permission-management/permissions</code></td>
              <td>Update permissions</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>Provider Types</h3>
        <ul>
          <li><strong>R</strong> - Role permissions</li>
          <li><strong>U</strong> - User permissions</li>
        </ul>
      </div>
    </div>
  )
}

export function TestPermissionManagementPage() {
  return (
    <div>
      <h1>@abpjs/permission-management Tests v2.2.0</h1>
      <p>Testing permission management modal, hooks, and state service.</p>
      <p style={{ color: '#888', fontSize: '0.9rem' }}>Version 2.2.0 - Dependency updates only (no new features from v2.0.0)</p>

      <TestPermissionModal />
      <TestPermissionHook />
      <TestPermissionManagementStateService />
      <TestComponentInterfaces />
      <TestApiEndpoints />
    </div>
  )
}

export default TestPermissionManagementPage
