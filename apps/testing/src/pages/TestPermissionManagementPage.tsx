/**
 * Test page for @abpjs/permission-management package v3.2.0
 * Tests: PermissionManagementModal, usePermissionManagement hook, PermissionManagementStateService
 *
 * v3.2.0 Updates:
 * - New proxy service: PermissionsService with typed methods (get, update)
 * - New proxy models: GetPermissionListResultDto, PermissionGrantInfoDto, etc.
 * - PermissionWithStyle type (replaces PermissionWithMargin)
 * - Deprecated legacy types (to be removed in v4.0)
 */
import { useState, useMemo } from 'react'
import { useAuth, useConfig, useCurrentUserInfo, useRestService } from '@abpjs/core'
import {
  PermissionManagementModal,
  usePermissionManagement,
  PermissionManagementStateService,
  ePermissionManagementComponents,
  // v3.2.0 proxy service
  PermissionsService,
} from '@abpjs/permission-management'
import type {
  PermissionManagement,
  // v3.2.0 proxy models
  GetPermissionListResultDto,
  UpdatePermissionsDto,
} from '@abpjs/permission-management'

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
    shouldFetchAppConfig: _shouldFetchAppConfig,
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
            <tr style={{ background: 'rgba(100,255,100,0.1)' }}><td style={{ padding: '8px' }}>getAssignedCount</td><td>Get count of granted permissions for a group (v3.0.0)</td></tr>
            <tr><td style={{ padding: '8px' }}>isGranted</td><td>Check if permission is granted</td></tr>
            <tr><td style={{ padding: '8px' }}>isGrantedByRole</td><td>Check if permission is granted by a role (deprecated in v1.1.0)</td></tr>
            <tr style={{ background: 'rgba(100,108,255,0.1)' }}><td style={{ padding: '8px' }}>isGrantedByOtherProviderName</td><td>Check if permission is granted by another provider (v1.1.0)</td></tr>
            <tr style={{ background: 'rgba(155,89,182,0.1)' }}><td style={{ padding: '8px' }}>shouldFetchAppConfig</td><td>Check if app config should be refreshed after saving (v3.1.0)</td></tr>
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

function TestV300Features() {
  const [testProviderKey, setTestProviderKey] = useState('')
  const [testProviderName, setTestProviderName] = useState<'R' | 'U'>('R')
  const { isAuthenticated } = useAuth()

  const {
    groups,
    isLoading,
    fetchPermissions,
    getAssignedCount,
    toggleSelectAll,
    selectAllTab,
    reset,
  } = usePermissionManagement()

  const handleFetch = () => {
    if (testProviderKey) {
      fetchPermissions(testProviderKey, testProviderName)
    }
  }

  return (
    <div className="test-section">
      <h2>What's New in v3.0.0</h2>

      <div className="test-card">
        <h3>getAssignedCount(groupName: string): number</h3>
        <p>New method to get the count of granted permissions for a specific permission group.</p>
        <p>Useful for showing badge counts in permission management UI tabs.</p>

        <pre style={{
          background: 'rgba(50,50,50,0.3)',
          padding: '1rem',
          borderRadius: '4px',
          fontSize: '12px',
          marginTop: '1rem'
        }}>
{`const { getAssignedCount } = usePermissionManagement();

// Get count of granted permissions in "Identity Management" group
const count = getAssignedCount('IdentityManagement');
console.log(\`\${count} permissions granted\`);`}
        </pre>
      </div>

      <div className="test-card">
        <h3>Interactive Demo</h3>
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

        {groups.length > 0 && (
          <>
            <div style={{ marginBottom: '1rem' }}>
              <button onClick={toggleSelectAll} style={{ marginRight: '0.5rem' }}>
                {selectAllTab ? 'Deselect All' : 'Select All'}
              </button>
              <button onClick={reset} style={{ background: '#f44', color: 'white' }}>
                Reset
              </button>
            </div>

            <h4>Permission Groups with Assigned Counts:</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Group Name</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Display Name</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Total Permissions</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Assigned Count</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((group) => {
                  const assignedCount = getAssignedCount(group.name)
                  const totalCount = group.permissions.length
                  const allAssigned = assignedCount === totalCount
                  const noneAssigned = assignedCount === 0

                  return (
                    <tr key={group.name}>
                      <td style={{ padding: '8px' }}><code>{group.name}</code></td>
                      <td style={{ padding: '8px' }}>{group.displayName}</td>
                      <td style={{ padding: '8px' }}>{totalCount}</td>
                      <td style={{ padding: '8px' }}>
                        <span style={{
                          background: allAssigned ? '#2ecc71' : noneAssigned ? '#e74c3c' : '#f39c12',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '10px',
                          fontSize: '12px'
                        }}>
                          {assignedCount} / {totalCount}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </>
        )}

        {!isAuthenticated && (
          <p style={{ color: '#f88', fontSize: '12px' }}>Login required to test this feature</p>
        )}
      </div>

      <div className="test-card">
        <h3>Use Cases</h3>
        <ul>
          <li><strong>Badge Counts:</strong> Show how many permissions are granted per group in tab headers</li>
          <li><strong>Progress Indicators:</strong> Display permission assignment progress</li>
          <li><strong>Summary Views:</strong> Quick overview of permission states across groups</li>
          <li><strong>Validation:</strong> Check if any permissions are assigned before saving</li>
        </ul>
      </div>
    </div>
  )
}

function TestV320Features() {
  const restService = useRestService()
  const { isAuthenticated } = useAuth()

  // Initialize proxy service
  const permissionsService = useMemo(() => new PermissionsService(restService), [restService])

  // State for demo
  const [testProviderKey, setTestProviderKey] = useState('')
  const [testProviderName, setTestProviderName] = useState<'R' | 'U'>('R')
  const [proxyResult, setProxyResult] = useState<GetPermissionListResultDto | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Demo: Fetch permissions using PermissionsService
  const handleFetchWithProxy = async () => {
    if (!testProviderKey) return
    setIsLoading(true)
    setError(null)
    try {
      const result = await permissionsService.get(testProviderName, testProviderKey)
      setProxyResult(result)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch permissions')
    } finally {
      setIsLoading(false)
    }
  }

  // Demo: Update permissions using PermissionsService
  const handleUpdateWithProxy = async () => {
    if (!testProviderKey) return
    setIsLoading(true)
    setError(null)
    try {
      const input: UpdatePermissionsDto = { permissions: [] }
      await permissionsService.update(testProviderName, testProviderKey, input)
      setError(null)
      alert('Permissions updated successfully (empty update for demo)')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update permissions')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="test-section">
      <h2>What's New in v3.2.0</h2>

      <div className="test-card">
        <h3>New Proxy Service: PermissionsService</h3>
        <p>v3.2.0 introduces a typed proxy service for direct API access:</p>
        <pre style={{ fontSize: '12px' }}>{`import { PermissionsService } from '@abpjs/permission-management'

// Initialize with RestService
const permissionsService = new PermissionsService(restService)

// Get permissions
const result = await permissionsService.get('R', 'role-id')

// Update permissions
await permissionsService.update('R', 'role-id', {
  permissions: [
    { name: 'AbpIdentity.Users', isGranted: true },
  ]
})`}</pre>

        <h4 style={{ marginTop: '1rem' }}>Service Properties:</h4>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Property</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px' }}><code>apiName</code></td>
              <td style={{ padding: '8px' }}><code style={{ color: '#2ecc71' }}>{permissionsService.apiName}</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>PermissionsService Methods</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Method</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: '8px' }}><code>get(providerName, providerKey)</code></td><td>Get permissions for a provider</td></tr>
            <tr><td style={{ padding: '8px' }}><code>update(providerName, providerKey, input)</code></td><td>Update permissions for a provider</td></tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>Interactive Demo</h3>
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
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button onClick={handleFetchWithProxy} disabled={!testProviderKey || !isAuthenticated || isLoading}>
            {isLoading ? 'Loading...' : 'permissionsService.get()'}
          </button>
          <button onClick={handleUpdateWithProxy} disabled={!testProviderKey || !isAuthenticated || isLoading}>
            {isLoading ? 'Loading...' : 'permissionsService.update()'}
          </button>
        </div>

        {!isAuthenticated && (
          <p style={{ color: '#f88', fontSize: '12px' }}>Login required</p>
        )}

        {error && (
          <p style={{ color: '#f88', fontSize: '14px' }}>Error: {error}</p>
        )}

        {proxyResult && (
          <div style={{ marginTop: '0.5rem' }}>
            <p style={{ fontSize: '14px' }}><strong>Entity:</strong> {proxyResult.entityDisplayName}</p>
            <p style={{ fontSize: '14px' }}><strong>Groups:</strong> {proxyResult.groups.length}</p>
            {proxyResult.groups.length > 0 && (
              <ul style={{ fontSize: '12px', margin: '0.25rem 0', paddingLeft: '1.5rem' }}>
                {proxyResult.groups.slice(0, 5).map(group => (
                  <li key={group.name}>{group.displayName} ({group.permissions.length} permissions)</li>
                ))}
                {proxyResult.groups.length > 5 && <li>... and {proxyResult.groups.length - 5} more</li>}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="test-card">
        <h3>New Proxy Models (DTOs)</h3>
        <p>Typed DTOs for API requests and responses:</p>
        <pre style={{ fontSize: '12px' }}>{`import type {
  GetPermissionListResultDto,
  PermissionGrantInfoDto,
  PermissionGroupDto,
  ProviderInfoDto,
  UpdatePermissionDto,
  UpdatePermissionsDto,
} from '@abpjs/permission-management'`}</pre>
      </div>

      <div className="test-card">
        <h3>PermissionWithStyle (replaces PermissionWithMargin)</h3>
        <p>New interface for permissions with style property:</p>
        <pre style={{ fontSize: '12px' }}>{`import type { PermissionWithStyle } from '@abpjs/permission-management'

// v3.2.0: Uses style string instead of margin number
const permission: PermissionWithStyle = {
  name: 'AbpIdentity.Users.Create',
  displayName: 'Create Users',
  isGranted: true,
  parentName: 'AbpIdentity.Users',
  allowedProviders: ['R'],
  grantedProviders: [],
  style: 'margin-left: 24px', // CSS style string
}`}</pre>
      </div>

      <div className="test-card">
        <h3>Deprecated Types</h3>
        <p style={{ color: '#f88' }}>The following legacy types are deprecated in v3.2.0 (to be removed in v4.0):</p>
        <ul style={{ fontSize: '14px' }}>
          <li><code>PermissionManagement.Response</code> - Use <code>GetPermissionListResultDto</code></li>
          <li><code>PermissionManagement.Group</code> - Use <code>PermissionGroupDto</code></li>
          <li><code>PermissionManagement.MinimumPermission</code> - Use <code>UpdatePermissionDto</code></li>
          <li><code>PermissionManagement.Permission</code> - Use <code>PermissionGrantInfoDto</code></li>
          <li><code>PermissionManagement.UpdateRequest</code> - Use <code>UpdatePermissionsDto</code></li>
          <li><code>PermissionWithMargin</code> - Use <code>PermissionWithStyle</code></li>
        </ul>
        <pre style={{ fontSize: '12px', marginTop: '0.5rem' }}>{`// Before (deprecated)
import type { PermissionManagement, PermissionWithMargin } from '@abpjs/permission-management'
const res: PermissionManagement.Response = ...
const perm: PermissionWithMargin = { margin: 24, ... }

// After (v3.2.0)
import type { GetPermissionListResultDto, PermissionWithStyle } from '@abpjs/permission-management'
const res: GetPermissionListResultDto = ...
const perm: PermissionWithStyle = { style: 'margin-left: 24px', ... }`}</pre>
      </div>
    </div>
  )
}

function TestV310Features() {
  const [testProviderKey, setTestProviderKey] = useState('')
  const [testProviderName, setTestProviderName] = useState<'R' | 'U'>('R')
  const currentUser = useCurrentUserInfo()

  const { shouldFetchAppConfig } = usePermissionManagement()

  // Calculate result based on current inputs
  const result = testProviderKey ? shouldFetchAppConfig(testProviderKey, testProviderName) : null

  return (
    <div className="test-section">
      <h2>What's New in v3.1.0</h2>

      <div className="test-card">
        <h3>shouldFetchAppConfig(providerKey: string, providerName: string): boolean</h3>
        <p>New method to determine whether the app configuration should be refreshed after saving permissions.</p>
        <p>Returns <code>true</code> if:</p>
        <ul>
          <li>The provider is a <strong>role ('R')</strong> that the current user belongs to</li>
          <li>The provider is the <strong>current user ('U')</strong></li>
        </ul>

        <pre style={{
          background: 'rgba(50,50,50,0.3)',
          padding: '1rem',
          borderRadius: '4px',
          fontSize: '12px',
          marginTop: '1rem'
        }}>
{`const { shouldFetchAppConfig, savePermissions } = usePermissionManagement();

// After saving permissions
const handleSave = async () => {
  const result = await savePermissions(providerKey, providerName);
  if (result.success && shouldFetchAppConfig(providerKey, providerName)) {
    // Refresh app config to update current user's permissions in UI
    await refreshAppConfig();
  }
};`}
        </pre>
      </div>

      <div className="test-card">
        <h3>Interactive Demo</h3>

        <div style={{ marginBottom: '1rem' }}>
          <h4>Current User Info</h4>
          <p>ID: <code style={{ background: 'rgba(50,50,50,0.3)', padding: '2px 6px', borderRadius: '3px' }}>{currentUser?.id || 'Not logged in'}</code></p>
          <p>Roles: {currentUser?.roles?.length ? (
            currentUser.roles.map((role, i) => (
              <code key={i} style={{
                background: 'rgba(100,108,255,0.2)',
                padding: '2px 6px',
                borderRadius: '3px',
                marginRight: '4px'
              }}>{role}</code>
            ))
          ) : (
            <span style={{ color: '#888' }}>No roles</span>
          )}</p>
        </div>

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
        </div>

        {currentUser?.id && testProviderName === 'U' && (
          <button
            style={{ marginBottom: '1rem', fontSize: '12px', padding: '4px 8px' }}
            onClick={() => setTestProviderKey(currentUser.id)}
          >
            Use My User ID
          </button>
        )}

        {currentUser?.roles?.length && testProviderName === 'R' && (
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '12px', marginRight: '8px' }}>Quick select role:</span>
            {currentUser.roles.map((role, i) => (
              <button
                key={i}
                style={{ fontSize: '12px', padding: '4px 8px', marginRight: '4px' }}
                onClick={() => setTestProviderKey(role)}
              >
                {role}
              </button>
            ))}
          </div>
        )}

        {testProviderKey && (
          <div style={{
            padding: '1rem',
            borderRadius: '4px',
            background: result ? 'rgba(46,204,113,0.2)' : 'rgba(231,76,60,0.2)',
            marginTop: '1rem'
          }}>
            <p style={{ margin: 0 }}>
              <strong>shouldFetchAppConfig("{testProviderKey}", "{testProviderName}")</strong>
            </p>
            <p style={{ margin: '0.5rem 0 0', fontSize: '1.2rem' }}>
              Returns: <code style={{
                background: result ? '#2ecc71' : '#e74c3c',
                color: 'white',
                padding: '2px 8px',
                borderRadius: '3px'
              }}>
                {result ? 'true' : 'false'}
              </code>
            </p>
            <p style={{ margin: '0.5rem 0 0', fontSize: '12px', color: '#888' }}>
              {result
                ? 'App config should be refreshed - permissions affect current user'
                : 'No refresh needed - permissions do not affect current user'}
            </p>
          </div>
        )}
      </div>

      <div className="test-card">
        <h3>Use Cases</h3>
        <ul>
          <li><strong>Permission UI Refresh:</strong> After modifying permissions, refresh the app config only when necessary</li>
          <li><strong>Performance Optimization:</strong> Avoid unnecessary API calls when editing permissions for other users/roles</li>
          <li><strong>Real-time Updates:</strong> Keep current user's permission state in sync after changes</li>
        </ul>
      </div>
    </div>
  )
}

function TestV270Features() {
  return (
    <div className="test-section">
      <h2>What's New in v2.7.0</h2>

      <div className="test-card">
        <h3>ePermissionManagementComponents Enum</h3>
        <p>New enum for component replacement keys:</p>
        <pre style={{ fontSize: '12px' }}>{`import { ePermissionManagementComponents } from '@abpjs/permission-management'

// Component replacement key
const key = ePermissionManagementComponents.PermissionManagement
// Value: "PermissionManagement.PermissionManagementComponent"`}</pre>
        <h4 style={{ marginTop: '1rem' }}>Enum Values:</h4>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Key</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px' }}><code>PermissionManagement</code></td>
              <td style={{ padding: '8px' }}><code style={{ color: '#2ecc71' }}>{ePermissionManagementComponents.PermissionManagement}</code></td>
            </tr>
          </tbody>
        </table>
        <p style={{ fontSize: '0.9rem', color: '#888', marginTop: '1rem' }}>
          Use this enum to replace the default PermissionManagementModal component with a custom implementation.
        </p>
      </div>

      <div className="test-card">
        <h3>Component Replacement Pattern</h3>
        <p>Use the component key for registering custom implementations:</p>
        <pre style={{
          background: 'rgba(50,50,50,0.3)',
          padding: '1rem',
          borderRadius: '4px',
          fontSize: '12px',
          marginTop: '0.5rem'
        }}>
{`import { ePermissionManagementComponents } from '@abpjs/permission-management'

// Register a custom permission management component
const componentRegistry = new Map();
componentRegistry.set(
  ePermissionManagementComponents.PermissionManagement,
  MyCustomPermissionModal
);

// Check if a component has been replaced
const key = ePermissionManagementComponents.PermissionManagement;
const CustomComponent = componentRegistry.get(key);`}
        </pre>
      </div>
    </div>
  )
}

function TestV240Features() {
  const [apiNameDemo, setApiNameDemo] = useState('default')

  return (
    <div className="test-section">
      <h2>v2.4.0 Features</h2>

      <div className="test-card">
        <h3>apiName Property</h3>
        <p>New in v2.4.0: <code>PermissionManagementService</code> now has an <code>apiName</code> property.</p>
        <p>This property specifies which API configuration to use for REST requests (defaults to "default").</p>

        <div style={{ marginTop: '1rem' }}>
          <h4>Interactive Demo</h4>
          <p>Simulate changing the apiName property:</p>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
            <input
              type="text"
              value={apiNameDemo}
              onChange={(e) => setApiNameDemo(e.target.value)}
              placeholder="Enter API name"
              style={{
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #333',
                flex: 1
              }}
            />
            <button onClick={() => setApiNameDemo('default')}>Reset to Default</button>
          </div>
          <p>Current apiName: <code style={{ background: 'rgba(100,108,255,0.2)', padding: '2px 6px', borderRadius: '3px' }}>{apiNameDemo}</code></p>
        </div>

        <pre style={{
          background: 'rgba(50,50,50,0.3)',
          padding: '1rem',
          borderRadius: '4px',
          fontSize: '12px',
          marginTop: '1rem'
        }}>
{`// v2.4.0: apiName property on PermissionManagementService
const service = new PermissionManagementService(restService);
console.log(service.apiName); // "default"

// Change to use a different API configuration
service.apiName = "${apiNameDemo}";`}
        </pre>
      </div>

      <div className="test-card">
        <h3>PermissionManagementService Class</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Property/Method</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Version</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ background: 'rgba(100,255,100,0.1)' }}>
              <td style={{ padding: '8px' }}><code>apiName</code></td>
              <td>string (default: "default")</td>
              <td>v2.4.0 (NEW)</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>getPermissions()</code></td>
              <td>Promise&lt;Response&gt;</td>
              <td>v0.7.6</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>updatePermissions()</code></td>
              <td>Promise&lt;void&gt;</td>
              <td>v0.7.6</td>
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
      <h1>@abpjs/permission-management Tests v3.2.0</h1>
      <p>Testing permission management modal, hooks, and state service.</p>
      <p style={{ color: '#9333ea', fontSize: '0.9rem' }}>Version 3.2.0 - New proxy service and typed DTOs</p>

      {/* v3.2.0 Features - Highlighted at top */}
      <h2 style={{ marginTop: '2rem', borderTop: '2px solid #9333ea', paddingTop: '1rem' }}>
        v3.2.0 New Features
      </h2>
      <TestV320Features />

      {/* v3.1.0 Features */}
      <h2 style={{ marginTop: '2rem', borderTop: '2px solid #9b59b6', paddingTop: '1rem' }}>
        v3.1.0 Features
      </h2>
      <TestV310Features />

      {/* v3.0.0 Features */}
      <h2 style={{ marginTop: '2rem', borderTop: '2px solid #8e44ad', paddingTop: '1rem' }}>
        v3.0.0 Features
      </h2>
      <TestV300Features />

      {/* v2.7.0 Features */}
      <h2 style={{ marginTop: '2rem', borderTop: '2px solid #2ecc71', paddingTop: '1rem' }}>
        v2.7.0 Features
      </h2>
      <TestV270Features />

      {/* v2.4.0 Features */}
      <h2 style={{ marginTop: '2rem', borderTop: '2px solid #3498db', paddingTop: '1rem' }}>
        v2.4.0 Features
      </h2>
      <TestV240Features />
      <TestPermissionModal />
      <TestPermissionHook />
      <TestPermissionManagementStateService />
      <TestComponentInterfaces />
      <TestApiEndpoints />
    </div>
  )
}

export default TestPermissionManagementPage
