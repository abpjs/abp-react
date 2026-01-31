/**
 * Test page for @abpjs/permission-management package
 * Tests: PermissionManagementModal, usePermissionManagement hook
 */
import { useState } from 'react'
import { useAuth, useConfig } from '@abpjs/core'
import {
  PermissionManagementModal,
  usePermissionManagement,
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
      <h1>@abpjs/permission-management Tests</h1>
      <p>Testing permission management modal and hooks.</p>

      <TestPermissionModal />
      <TestPermissionHook />
      <TestApiEndpoints />
    </div>
  )
}

export default TestPermissionManagementPage
