/**
 * Test page for @abpjs/identity package
 * Tests: RolesComponent, UsersComponent, useRoles, useUsers, useIdentity hooks
 *
 * v3.2.0 Updates:
 * - New proxy services: IdentityRoleService, IdentityUserService, IdentityUserLookupService, ProfileService
 * - New proxy models: IdentityRoleDto, IdentityUserDto, ProfileDto, etc.
 * - State interface updated to use PagedResultDto and new proxy DTOs
 * - Legacy types deprecated (RoleItem, UserItem, etc.)
 *
 * v3.1.0 Updates:
 * - Version bump only (internal Angular type reference updates, no functional changes)
 *
 * v3.0.0 Updates:
 * - New config subpackage with eIdentityPolicyNames
 * - Moved eIdentityRouteNames to config/enums (removed Administration key)
 * - Added getUserAssignableRoles() method to IdentityService
 * - configureRoutes helper for route setup
 *
 * v2.0.0 Updates:
 * - IdentityStateService for stateful identity operations
 * - onVisiblePermissionChange callback for components
 * - Component interface types (Identity.RolesComponentInputs, etc.)
 * - IDENTITY_ROUTES removed (use IDENTITY_ROUTE_PATHS instead)
 */
import { useState, useEffect, useMemo } from 'react'
import { useAuth, useRestService, getRoutesService, type ABP } from '@abpjs/core'
import {
  RolesComponent,
  UsersComponent,
  useRoles,
  useUsers,
  useIdentity,
  IDENTITY_ROUTE_PATHS,
  IDENTITY_POLICIES,
  IdentityService,
  eIdentityComponents,
  eIdentityRouteNames,
  // v3.0.0 config exports
  eIdentityPolicyNames,
  configureRoutes,
  // v3.2.0 proxy services
  IdentityRoleService,
  IdentityUserService,
  IdentityUserLookupService,
  ProfileService,
} from '@abpjs/identity'
import type {
  Identity,
  PasswordRule,
  // v3.2.0 proxy models
  IdentityRoleDto,
  IdentityUserDto,
  GetIdentityUsersInput,
  ProfileDto,
  UserLookupCountInputDto,
} from '@abpjs/identity'

function TestRolesComponent() {
  const { isAuthenticated } = useAuth()
  const [permissionModalVisible, setPermissionModalVisible] = useState(false)
  const [permissionChangeLog, setPermissionChangeLog] = useState<string[]>([])

  const handleVisiblePermissionChange = (visible: boolean) => {
    setPermissionModalVisible(visible)
    setPermissionChangeLog(prev => [...prev.slice(-4), `Permission modal ${visible ? 'opened' : 'closed'} at ${new Date().toLocaleTimeString()}`])
    console.log('Permission modal visibility changed:', visible)
  }

  return (
    <div className="test-section">
      <h2>RolesComponent</h2>
      <p>Full roles management component with create, edit, delete, and permissions.</p>

      {/* v2.0.0 onVisiblePermissionChange demo */}
      <div className="test-card">
        <h3>onVisiblePermissionChange (v2.0.0)</h3>
        <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#888' }}>
          New in v2.0.0: Callback when permission modal visibility changes.
        </p>
        <p>Permission modal visible: <code>{permissionModalVisible ? 'true' : 'false'}</code></p>
        {permissionChangeLog.length > 0 && (
          <div style={{ marginTop: '0.5rem', fontSize: '12px' }}>
            <strong>Recent changes:</strong>
            <ul style={{ margin: '0.25rem 0', paddingLeft: '1.5rem' }}>
              {permissionChangeLog.map((log, i) => (
                <li key={i}>{log}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {!isAuthenticated ? (
        <div className="test-card">
          <p style={{ color: '#f88' }}>
            You must be authenticated to use identity management features
          </p>
        </div>
      ) : (
        <div className="test-card" style={{ padding: 0 }}>
          <RolesComponent
            onRoleCreated={() => console.log('Role created!')}
            onRoleUpdated={() => console.log('Role updated!')}
            onRoleDeleted={() => console.log('Role deleted!')}
            onVisiblePermissionChange={handleVisiblePermissionChange}
          />
        </div>
      )}
    </div>
  )
}

function TestUsersComponent() {
  const { isAuthenticated } = useAuth()
  const [showPasswordRules, setShowPasswordRules] = useState(true)
  const [passwordLength, setPasswordLength] = useState(6)
  const [selectedRules, setSelectedRules] = useState<PasswordRule[]>(['number', 'capital', 'small', 'special'])
  const [permissionModalVisible, setPermissionModalVisible] = useState(false)
  const [permissionChangeLog, setPermissionChangeLog] = useState<string[]>([])

  const handleRuleToggle = (rule: PasswordRule) => {
    setSelectedRules(prev =>
      prev.includes(rule)
        ? prev.filter(r => r !== rule)
        : [...prev, rule]
    )
  }

  const handleVisiblePermissionChange = (visible: boolean) => {
    setPermissionModalVisible(visible)
    setPermissionChangeLog(prev => [...prev.slice(-4), `Permission modal ${visible ? 'opened' : 'closed'} at ${new Date().toLocaleTimeString()}`])
    console.log('Permission modal visibility changed:', visible)
  }

  return (
    <div className="test-section">
      <h2>UsersComponent</h2>
      <p>Full users management component with create, edit, delete, role assignment, and permissions.</p>

      {/* v2.0.0 onVisiblePermissionChange demo */}
      <div className="test-card">
        <h3>onVisiblePermissionChange (v2.0.0)</h3>
        <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#888' }}>
          New in v2.0.0: Callback when permission modal visibility changes.
        </p>
        <p>Permission modal visible: <code>{permissionModalVisible ? 'true' : 'false'}</code></p>
        {permissionChangeLog.length > 0 && (
          <div style={{ marginTop: '0.5rem', fontSize: '12px' }}>
            <strong>Recent changes:</strong>
            <ul style={{ margin: '0.25rem 0', paddingLeft: '1.5rem' }}>
              {permissionChangeLog.map((log, i) => (
                <li key={i}>{log}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* v1.1.0 Password Rules Configuration */}
      <div className="test-card">
        <h3>Password Rules Configuration (v1.1.0)</h3>
        <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#888' }}>
          New in v1.1.0: Configure password validation rules displayed in the user creation/edit modal.
        </p>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input
              type="checkbox"
              checked={showPasswordRules}
              onChange={(e) => setShowPasswordRules(e.target.checked)}
            />
            Show password rules
          </label>
        </div>

        {showPasswordRules && (
          <>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                Required password length: <strong>{passwordLength}</strong>
              </label>
              <input
                type="range"
                min="0"
                max="16"
                value={passwordLength}
                onChange={(e) => setPasswordLength(Number(e.target.value))}
                style={{ width: '200px' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password rules:</label>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <input
                    type="checkbox"
                    checked={selectedRules.includes('number')}
                    onChange={() => handleRuleToggle('number')}
                  />
                  Require number
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <input
                    type="checkbox"
                    checked={selectedRules.includes('small')}
                    onChange={() => handleRuleToggle('small')}
                  />
                  Require lowercase
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <input
                    type="checkbox"
                    checked={selectedRules.includes('capital')}
                    onChange={() => handleRuleToggle('capital')}
                  />
                  Require uppercase
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <input
                    type="checkbox"
                    checked={selectedRules.includes('special')}
                    onChange={() => handleRuleToggle('special')}
                  />
                  Require special character
                </label>
              </div>
            </div>

            <div style={{ padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
              <strong>Props being passed:</strong>
              <pre style={{ margin: '0.5rem 0 0 0' }}>
{`passwordRulesArr={${JSON.stringify(selectedRules)}}
requiredPasswordLength={${passwordLength}}`}
              </pre>
            </div>
          </>
        )}
      </div>

      {!isAuthenticated ? (
        <div className="test-card">
          <p style={{ color: '#f88' }}>
            You must be authenticated to use identity management features
          </p>
        </div>
      ) : (
        <div className="test-card" style={{ padding: 0 }}>
          <UsersComponent
            onUserCreated={() => console.log('User created!')}
            onUserUpdated={() => console.log('User updated!')}
            onUserDeleted={() => console.log('User deleted!')}
            passwordRulesArr={showPasswordRules ? selectedRules : undefined}
            requiredPasswordLength={showPasswordRules ? passwordLength : undefined}
            onVisiblePermissionChange={handleVisiblePermissionChange}
          />
        </div>
      )}
    </div>
  )
}

function TestRolesHook() {
  const {
    roles,
    totalCount,
    selectedRole,
    isLoading,
    error,
    sortKey,
    sortOrder,
    fetchRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
    setSelectedRole,
    setSortKey,
    setSortOrder,
    reset,
  } = useRoles()

  const [testRoleId, setTestRoleId] = useState('')
  const [testRoleName, setTestRoleName] = useState('')
  const [testIsDefault, setTestIsDefault] = useState(false)
  const [testIsPublic, setTestIsPublic] = useState(true)
  const [rolePageQuery, setRolePageQuery] = useState<ABP.PageQueryParams>({
    skipCount: 0,
    maxResultCount: 10,
  })
  const [roleFilter, setRoleFilter] = useState('')

  useEffect(() => {
    fetchRoles()
  }, [fetchRoles])

  return (
    <div className="test-section">
      <h2>useRoles Hook</h2>

      <div className="test-card">
        <h3>Fetch Roles</h3>
        <button onClick={() => fetchRoles()} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Fetch All Roles'}
        </button>
        <p style={{ marginTop: '0.5rem', fontSize: '14px', color: '#888' }}>
          Fetches all roles from the server
        </p>
      </div>

      <div className="test-card">
        <h3>Sorting (v1.0.0)</h3>
        <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#888' }}>
          New in v1.0.0: sortKey and sortOrder state for column sorting
        </p>
        <p>Current sortKey: <code>{sortKey}</code></p>
        <p>Current sortOrder: <code>{sortOrder || '(empty)'}</code></p>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button onClick={() => setSortKey('name')}>Sort by Name</button>
          <button onClick={() => setSortKey('isDefault')}>Sort by Default</button>
          <button onClick={() => setSortKey('isPublic')}>Sort by Public</button>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button onClick={() => setSortOrder('asc')}>Ascending</button>
          <button onClick={() => setSortOrder('desc')}>Descending</button>
          <button onClick={() => setSortOrder('')}>Clear Order</button>
        </div>
      </div>

      <div className="test-card">
        <h3>Roles Pagination & Filtering</h3>
        <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#888' }}>
          fetchRoles accepts optional ABP.PageQueryParams
        </p>
        <p>Current query:</p>
        <pre style={{  padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
          {JSON.stringify(rolePageQuery, null, 2)}
        </pre>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Filter by name..."
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333',
              flex: 1
            }}
          />
          <button
            onClick={() => {
              const newQuery = { ...rolePageQuery, filter: roleFilter || undefined }
              setRolePageQuery(newQuery)
              fetchRoles(newQuery)
            }}
            disabled={isLoading}
          >
            Search
          </button>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => {
              const newQuery = { ...rolePageQuery, skipCount: Math.max(0, (rolePageQuery.skipCount || 0) - 10) }
              setRolePageQuery(newQuery)
              fetchRoles(newQuery)
            }}
            disabled={isLoading || (rolePageQuery.skipCount || 0) === 0}
          >
            Previous Page
          </button>
          <button
            onClick={() => {
              const newQuery = { ...rolePageQuery, skipCount: (rolePageQuery.skipCount || 0) + 10 }
              setRolePageQuery(newQuery)
              fetchRoles(newQuery)
            }}
            disabled={isLoading || (rolePageQuery.skipCount || 0) + 10 >= totalCount}
          >
            Next Page
          </button>
          <button
            onClick={() => {
              const newQuery = { skipCount: 0, maxResultCount: 10 }
              setRolePageQuery(newQuery)
              setRoleFilter('')
              fetchRoles(newQuery)
            }}
            disabled={isLoading}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="test-card">
        <h3>Get Role by ID</h3>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
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
            onClick={() => {
              if (testRoleId) {
                getRoleById(testRoleId)
              }
            }}
            disabled={!testRoleId || isLoading}
          >
            Fetch Role
          </button>
        </div>
      </div>

      <div className="test-card">
        <h3>Create Role</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <input
            type="text"
            placeholder="Role Name"
            value={testRoleName}
            onChange={(e) => setTestRoleName(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333',
            }}
          />
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={testIsDefault}
              onChange={(e) => setTestIsDefault(e.target.checked)}
            />
            Is Default
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={testIsPublic}
              onChange={(e) => setTestIsPublic(e.target.checked)}
            />
            Is Public
          </label>
          <button
            onClick={async () => {
              if (testRoleName) {
                const result = await createRole({
                  name: testRoleName,
                  isDefault: testIsDefault,
                  isPublic: testIsPublic,
                })
                if (result.success) {
                  setTestRoleName('')
                  setTestIsDefault(false)
                  setTestIsPublic(true)
                }
              }
            }}
            disabled={!testRoleName || isLoading}
          >
            Create Role
          </button>
        </div>
      </div>

      <div className="test-card">
        <h3>Update Role</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <input
            type="text"
            placeholder="Role ID"
            value={testRoleId}
            onChange={(e) => setTestRoleId(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333'
            }}
          />
          <input
            type="text"
            placeholder="New Role Name"
            value={testRoleName}
            onChange={(e) => setTestRoleName(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333'
            }}
          />
          <button
            onClick={async () => {
              if (testRoleId && testRoleName) {
                const result = await updateRole(testRoleId, {
                  name: testRoleName,
                  isDefault: testIsDefault,
                  isPublic: testIsPublic,
                })
                if (result.success) {
                  setTestRoleId('')
                  setTestRoleName('')
                }
              }
            }}
            disabled={!testRoleId || !testRoleName || isLoading}
          >
            Update Role
          </button>
        </div>
      </div>

      <div className="test-card">
        <h3>Delete Role</h3>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
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
            onClick={async () => {
              if (testRoleId && window.confirm(`Are you sure you want to delete role ${testRoleId}?`)) {
                const result = await deleteRole(testRoleId)
                if (result.success) {
                  setTestRoleId('')
                }
              }
            }}
            disabled={!testRoleId || isLoading}
            style={{ background: '#f44', color: 'white' }}
          >
            Delete Role
          </button>
        </div>
      </div>

      <div className="test-card">
        <h3>Hook State</h3>
        <p>isLoading: {isLoading ? 'true' : 'false'}</p>
        <p>error: {error || 'null'}</p>
        <p>roles count: {roles.length}</p>
        <p>totalCount: {totalCount}</p>
        <p>selectedRole: {selectedRole ? `${selectedRole.name} (${selectedRole.id})` : 'none'}</p>
        <p>sortKey: {sortKey}</p>
        <p>sortOrder: {sortOrder || '(empty)'}</p>
      </div>

      {roles.length > 0 && (
        <div className="test-card">
          <h3>Roles List ({roles.length})</h3>
          <div style={{ maxHeight: '300px', overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Name</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Default</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Public</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role: Identity.RoleItem) => (
                  <tr key={role.id} style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '8px' }}>{role.name}</td>
                    <td style={{ padding: '8px' }}>{role.isDefault ? 'Yes' : 'No'}</td>
                    <td style={{ padding: '8px' }}>{role.isPublic ? 'Yes' : 'No'}</td>
                    <td style={{ padding: '8px' }}>
                      <button
                        onClick={() => setSelectedRole(role)}
                        style={{ marginRight: '0.5rem', padding: '4px 8px' }}
                      >
                        Select
                      </button>
                      <button
                        onClick={() => {
                          setTestRoleId(role.id)
                          getRoleById(role.id)
                        }}
                        style={{ padding: '4px 8px' }}
                      >
                        Fetch
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="test-card">
        <h3>Reset State</h3>
        <button onClick={reset} style={{ background: '#f44', color: 'white' }}>
          Reset All State
        </button>
        <p style={{ marginTop: '0.5rem', fontSize: '14px', color: '#888' }}>
          Clears all role data and resets to initial state
        </p>
      </div>
    </div>
  )
}

function TestUsersHook() {
  const {
    users,
    totalCount,
    selectedUser,
    selectedUserRoles,
    isLoading,
    error,
    pageQuery,
    sortKey,
    sortOrder,
    fetchUsers,
    getUserById,
    getUserRoles,
    createUser,
    // updateUser, // Unused for now
    deleteUser,
    setSelectedUser,
    setPageQuery,
    setSortKey,
    setSortOrder,
    reset,
  } = useUsers()

  const [testUserId, setTestUserId] = useState('')
  const [testUserName, setTestUserName] = useState('')
  const [testEmail, setTestEmail] = useState('')
  const [testPassword, setTestPassword] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  return (
    <div className="test-section">
      <h2>useUsers Hook</h2>

      <div className="test-card">
        <h3>Fetch Users</h3>
        <button onClick={() => fetchUsers()} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Fetch All Users'}
        </button>
        <p style={{ marginTop: '0.5rem', fontSize: '14px', color: '#888' }}>
          Fetches users with pagination
        </p>
      </div>

      <div className="test-card">
        <h3>Sorting (v1.0.0)</h3>
        <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#888' }}>
          New in v1.0.0: sortKey and sortOrder state for column sorting
        </p>
        <p>Current sortKey: <code>{sortKey}</code></p>
        <p>Current sortOrder: <code>{sortOrder || '(empty)'}</code></p>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button onClick={() => setSortKey('userName')}>Sort by Username</button>
          <button onClick={() => setSortKey('email')}>Sort by Email</button>
          <button onClick={() => setSortKey('name')}>Sort by Name</button>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button onClick={() => setSortOrder('asc')}>Ascending</button>
          <button onClick={() => setSortOrder('desc')}>Descending</button>
          <button onClick={() => setSortOrder('')}>Clear Order</button>
        </div>
      </div>

      <div className="test-card">
        <h3>Pagination</h3>
        <p>Current page query:</p>
        <pre style={{  padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
          {JSON.stringify(pageQuery, null, 2)}
        </pre>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button
            onClick={() => {
              const newQuery = { ...pageQuery, skipCount: Math.max(0, (pageQuery.skipCount || 0) - 10) }
              setPageQuery(newQuery)
              fetchUsers(newQuery)
            }}
            disabled={isLoading || (pageQuery.skipCount || 0) === 0}
          >
            Previous Page
          </button>
          <button
            onClick={() => {
              const newQuery = { ...pageQuery, skipCount: (pageQuery.skipCount || 0) + 10 }
              setPageQuery(newQuery)
              fetchUsers(newQuery)
            }}
            disabled={isLoading || (pageQuery.skipCount || 0) + 10 >= totalCount}
          >
            Next Page
          </button>
        </div>
      </div>

      <div className="test-card">
        <h3>Get User by ID</h3>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
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
            onClick={() => {
              if (testUserId) {
                getUserById(testUserId)
              }
            }}
            disabled={!testUserId || isLoading}
          >
            Fetch User
          </button>
          <button
            onClick={() => {
              if (testUserId) {
                getUserRoles(testUserId)
              }
            }}
            disabled={!testUserId || isLoading}
          >
            Fetch Roles
          </button>
        </div>
      </div>

      <div className="test-card">
        <h3>Create User</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <input
            type="text"
            placeholder="Username"
            value={testUserName}
            onChange={(e) => setTestUserName(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333'
            }}
          />
          <input
            type="email"
            placeholder="Email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333'
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={testPassword}
            onChange={(e) => setTestPassword(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333'
            }}
          />
          <button
            onClick={async () => {
              if (testUserName && testEmail && testPassword) {
                const result = await createUser({
                  userName: testUserName,
                  email: testEmail,
                  password: testPassword,
                  roleNames: [],
                  name: '',
                  surname: '',
                  phoneNumber: '',
                  twoFactorEnabled: false,
                  lockoutEnabled: true,
                })
                if (result.success) {
                  setTestUserName('')
                  setTestEmail('')
                  setTestPassword('')
                }
              }
            }}
            disabled={!testUserName || !testEmail || !testPassword || isLoading}
          >
            Create User
          </button>
        </div>
      </div>

      <div className="test-card">
        <h3>Delete User</h3>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
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
            onClick={async () => {
              if (testUserId && window.confirm(`Are you sure you want to delete user ${testUserId}?`)) {
                const result = await deleteUser(testUserId)
                if (result.success) {
                  setTestUserId('')
                }
              }
            }}
            disabled={!testUserId || isLoading}
            style={{ background: '#f44', color: 'white' }}
          >
            Delete User
          </button>
        </div>
      </div>

      <div className="test-card">
        <h3>Hook State</h3>
        <p>isLoading: {isLoading ? 'true' : 'false'}</p>
        <p>error: {error || 'null'}</p>
        <p>users count: {users.length}</p>
        <p>totalCount: {totalCount}</p>
        <p>selectedUser: {selectedUser ? `${selectedUser.userName} (${selectedUser.id})` : 'none'}</p>
        <p>selectedUserRoles: {selectedUserRoles.length > 0 ? selectedUserRoles.map(r => r.name).join(', ') : 'none'}</p>
        <p>sortKey: {sortKey}</p>
        <p>sortOrder: {sortOrder || '(empty)'}</p>
      </div>

      {users.length > 0 && (
        <div className="test-card">
          <h3>Users List ({users.length} of {totalCount})</h3>
          <div style={{ maxHeight: '300px', overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Username</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Email</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Active</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: Identity.UserItem) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '8px' }}>{user.userName}</td>
                    <td style={{ padding: '8px' }}>{user.email}</td>
                    <td style={{ padding: '8px' }}>{!user.isLockedOut ? 'Yes' : 'No'}</td>
                    <td style={{ padding: '8px' }}>
                      <button
                        onClick={() => setSelectedUser(user)}
                        style={{ marginRight: '0.5rem', padding: '4px 8px' }}
                      >
                        Select
                      </button>
                      <button
                        onClick={() => {
                          setTestUserId(user.id)
                          getUserById(user.id)
                        }}
                        style={{ padding: '4px 8px' }}
                      >
                        Fetch
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="test-card">
        <h3>Reset State</h3>
        <button onClick={reset} style={{ background: '#f44', color: 'white' }}>
          Reset All State
        </button>
        <p style={{ marginTop: '0.5rem', fontSize: '14px', color: '#888' }}>
          Clears all user data and resets to initial state
        </p>
      </div>
    </div>
  )
}

function TestIdentityHook() {
  const {
    roles,
    users,
    isLoading,
    error,
    resetAll,
  } = useIdentity()

  return (
    <div className="test-section">
      <h2>useIdentity Hook (Combined)</h2>
      <p>This hook combines useRoles and useUsers for convenience.</p>

      <div className="test-card">
        <h3>Combined State</h3>
        <p>isLoading: {isLoading ? 'true' : 'false'}</p>
        <p>error: {error || 'null'}</p>
        <p>roles.roles count: {roles.roles.length}</p>
        <p>users.users count: {users.users.length}</p>
      </div>

      <div className="test-card">
        <h3>Fetch All</h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => roles.fetchRoles()} disabled={isLoading}>
            Fetch Roles
          </button>
          <button onClick={() => users.fetchUsers()} disabled={isLoading}>
            Fetch Users
          </button>
          <button
            onClick={() => {
              roles.fetchRoles()
              users.fetchUsers()
            }}
            disabled={isLoading}
          >
            Fetch Both
          </button>
        </div>
      </div>

      <div className="test-card">
        <h3>Reset All</h3>
        <button onClick={resetAll} style={{ background: '#f44', color: 'white' }}>
          Reset All State
        </button>
        <p style={{ marginTop: '0.5rem', fontSize: '14px', color: '#888' }}>
          Resets both roles and users state
        </p>
      </div>
    </div>
  )
}

function TestRouteConstants() {
  return (
    <div className="test-section">
      <h2>Route Constants</h2>

      <div className="test-card">
        <h3>IDENTITY_ROUTES (Removed in v2.0.0)</h3>
        <p style={{ color: '#f88' }}>
          <strong>Deprecated and removed in v2.0.0.</strong> Use <code>IDENTITY_ROUTE_PATHS</code> for programmatic navigation instead.
        </p>
      </div>

      <div className="test-card">
        <h3>IDENTITY_ROUTE_PATHS</h3>
        <p>Programmatic navigation paths:</p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
          {JSON.stringify(IDENTITY_ROUTE_PATHS, null, 2)}
        </pre>
      </div>

      <div className="test-card">
        <h3>IDENTITY_POLICIES</h3>
        <p>Required policies for identity operations:</p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
          {JSON.stringify(IDENTITY_POLICIES, null, 2)}
        </pre>
      </div>
    </div>
  )
}

function TestApiEndpoints() {
  return (
    <div className="test-section">
      <h2>API Endpoints</h2>

      <div className="test-card">
        <h3>Role Endpoints</h3>
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
              <td style={{ padding: '8px' }}><code>/api/identity/roles</code></td>
              <td>Fetch all roles</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>GET</code></td>
              <td style={{ padding: '8px' }}><code>/api/identity/roles/:id</code></td>
              <td>Fetch a specific role</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>POST</code></td>
              <td style={{ padding: '8px' }}><code>/api/identity/roles</code></td>
              <td>Create a new role</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>PUT</code></td>
              <td style={{ padding: '8px' }}><code>/api/identity/roles/:id</code></td>
              <td>Update an existing role</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>DELETE</code></td>
              <td style={{ padding: '8px' }}><code>/api/identity/roles/:id</code></td>
              <td>Delete a role</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>User Endpoints</h3>
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
              <td style={{ padding: '8px' }}><code>/api/identity/users</code></td>
              <td>Fetch users (paginated)</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>GET</code></td>
              <td style={{ padding: '8px' }}><code>/api/identity/users/:id</code></td>
              <td>Fetch a specific user</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>GET</code></td>
              <td style={{ padding: '8px' }}><code>/api/identity/users/:id/roles</code></td>
              <td>Fetch roles for a user</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>POST</code></td>
              <td style={{ padding: '8px' }}><code>/api/identity/users</code></td>
              <td>Create a new user</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>PUT</code></td>
              <td style={{ padding: '8px' }}><code>/api/identity/users/:id</code></td>
              <td>Update an existing user</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>DELETE</code></td>
              <td style={{ padding: '8px' }}><code>/api/identity/users/:id</code></td>
              <td>Delete a user</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>Request/Response Formats</h3>
        <div style={{ marginBottom: '1rem' }}>
          <h4>Create Role Request:</h4>
          <pre style={{  padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`{
  "name": "string",
  "isDefault": boolean,
  "isPublic": boolean
}`}
          </pre>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <h4>Create User Request:</h4>
          <pre style={{  padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`{
  "userName": "string",
  "name": "string",
  "surname": "string",
  "email": "string",
  "phoneNumber": "string",
  "password": "string",
  "roleNames": ["string"],
  "lockoutEnabled": boolean,
  "twoFactorEnabled": boolean
}`}
          </pre>
        </div>
        <div>
          <h4>User Response:</h4>
          <pre style={{  padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`{
  "id": "string",
  "userName": "string",
  "name": "string",
  "surname": "string",
  "email": "string",
  "emailConfirmed": boolean,
  "phoneNumber": "string",
  "phoneNumberConfirmed": boolean,
  "isActive": boolean,
  "lockoutEnabled": boolean,
  "twoFactorEnabled": boolean
}`}
          </pre>
        </div>
      </div>
    </div>
  )
}

function TestHookMethods() {
  return (
    <div className="test-section">
      <h2>Hook Methods Reference</h2>

      <div className="test-card">
        <h3>useRoles Methods</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Method</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: '8px' }}>fetchRoles</td><td>Fetch all roles</td></tr>
            <tr><td style={{ padding: '8px' }}>getRoleById</td><td>Fetch a specific role and select it</td></tr>
            <tr><td style={{ padding: '8px' }}>createRole</td><td>Create a new role</td></tr>
            <tr><td style={{ padding: '8px' }}>updateRole</td><td>Update an existing role</td></tr>
            <tr><td style={{ padding: '8px' }}>deleteRole</td><td>Delete a role</td></tr>
            <tr><td style={{ padding: '8px' }}>setSelectedRole</td><td>Set the selected role</td></tr>
            <tr><td style={{ padding: '8px' }}>setSortKey</td><td>Set sort key (v1.0.0)</td></tr>
            <tr><td style={{ padding: '8px' }}>setSortOrder</td><td>Set sort order (v1.0.0)</td></tr>
            <tr><td style={{ padding: '8px' }}>reset</td><td>Reset all role state</td></tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>useUsers Methods</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Method</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: '8px' }}>fetchUsers</td><td>Fetch users with pagination</td></tr>
            <tr><td style={{ padding: '8px' }}>getUserById</td><td>Fetch a specific user and select it</td></tr>
            <tr><td style={{ padding: '8px' }}>getUserRoles</td><td>Fetch roles for a user</td></tr>
            <tr><td style={{ padding: '8px' }}>createUser</td><td>Create a new user</td></tr>
            <tr><td style={{ padding: '8px' }}>updateUser</td><td>Update an existing user</td></tr>
            <tr><td style={{ padding: '8px' }}>deleteUser</td><td>Delete a user</td></tr>
            <tr><td style={{ padding: '8px' }}>setSelectedUser</td><td>Set the selected user</td></tr>
            <tr><td style={{ padding: '8px' }}>setPageQuery</td><td>Set pagination parameters</td></tr>
            <tr><td style={{ padding: '8px' }}>setSortKey</td><td>Set sort key (v1.0.0)</td></tr>
            <tr><td style={{ padding: '8px' }}>setSortOrder</td><td>Set sort order (v1.0.0)</td></tr>
            <tr><td style={{ padding: '8px' }}>reset</td><td>Reset all user state</td></tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>UsersComponent Props (v1.1.0)</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Prop</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: '8px' }}>onUserCreated</td><td>(user) =&gt; void</td><td>Callback when user is created</td></tr>
            <tr><td style={{ padding: '8px' }}>onUserUpdated</td><td>(user) =&gt; void</td><td>Callback when user is updated</td></tr>
            <tr><td style={{ padding: '8px' }}>onUserDeleted</td><td>(id) =&gt; void</td><td>Callback when user is deleted</td></tr>
            <tr style={{ background: '#1a3a1a' }}>
              <td style={{ padding: '8px' }}>passwordRulesArr</td>
              <td>PasswordRule[]</td>
              <td><strong>v1.1.0:</strong> Password validation rules to display</td>
            </tr>
            <tr style={{ background: '#1a3a1a' }}>
              <td style={{ padding: '8px' }}>requiredPasswordLength</td>
              <td>number</td>
              <td><strong>v1.1.0:</strong> Required minimum password length</td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: '1rem' }}>
          <h4>PasswordRule Type (v1.1.0)</h4>
          <pre style={{ padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
{`type PasswordRule = 'number' | 'small' | 'capital' | 'special';

// Example usage:
<UsersComponent
  passwordRulesArr={['number', 'capital', 'small', 'special']}
  requiredPasswordLength={6}
/>`}
          </pre>
        </div>
      </div>
    </div>
  )
}

function TestIdentityStateService() {
  return (
    <div className="test-section">
      <h2>IdentityStateService (v2.0.0)</h2>
      <p>New in v2.0.0: A stateful service facade for identity operations.</p>

      <div className="test-card">
        <h3>Overview</h3>
        <p style={{ marginBottom: '0.5rem', fontSize: '14px', color: '#888' }}>
          IdentityStateService provides a stateful wrapper around IdentityService, maintaining
          local state for roles and users. It's the React equivalent of Angular's IdentityStateService
          which wraps NGXS store operations.
        </p>
        <p style={{ fontSize: '14px' }}>
          For most React use cases, prefer using the hooks (<code>useRoles</code>, <code>useUsers</code>, <code>useIdentity</code>)
          instead of this class. This class is provided for programmatic/non-hook scenarios.
        </p>
      </div>

      <div className="test-card">
        <h3>Usage Example</h3>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
{`import { IdentityStateService, IdentityService } from '@abpjs/identity';
import { RestService } from '@abpjs/core';

// Create service instances
const rest = new RestService();
const identityService = new IdentityService(rest);
const stateService = new IdentityStateService(identityService);

// Fetch and get roles
await stateService.dispatchGetRoles();
const roles = stateService.getRoles();
const totalCount = stateService.getRolesTotalCount();

// Fetch and get users
await stateService.dispatchGetUsers({ skipCount: 0, maxResultCount: 10 });
const users = stateService.getUsers();

// Create a role
const newRole = await stateService.dispatchCreateRole({
  name: 'NewRole',
  isDefault: false,
  isPublic: true,
});`}
        </pre>
      </div>

      <div className="test-card">
        <h3>Available Methods</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Method</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}><td style={{ padding: '8px' }}><code>getRoles()</code></td><td>Get current roles from state</td></tr>
            <tr style={{ borderBottom: '1px solid #222' }}><td style={{ padding: '8px' }}><code>getRolesTotalCount()</code></td><td>Get total count of roles</td></tr>
            <tr style={{ borderBottom: '1px solid #222' }}><td style={{ padding: '8px' }}><code>getUsers()</code></td><td>Get current users from state</td></tr>
            <tr style={{ borderBottom: '1px solid #222' }}><td style={{ padding: '8px' }}><code>getUsersTotalCount()</code></td><td>Get total count of users</td></tr>
            <tr style={{ borderBottom: '1px solid #222' }}><td style={{ padding: '8px' }}><code>dispatchGetRoles(params?)</code></td><td>Fetch roles and update state</td></tr>
            <tr style={{ borderBottom: '1px solid #222' }}><td style={{ padding: '8px' }}><code>dispatchGetRoleById(id)</code></td><td>Fetch a role by ID</td></tr>
            <tr style={{ borderBottom: '1px solid #222' }}><td style={{ padding: '8px' }}><code>dispatchCreateRole(body)</code></td><td>Create a role and refresh list</td></tr>
            <tr style={{ borderBottom: '1px solid #222' }}><td style={{ padding: '8px' }}><code>dispatchUpdateRole({'{id, body}'})</code></td><td>Update a role and refresh list</td></tr>
            <tr style={{ borderBottom: '1px solid #222' }}><td style={{ padding: '8px' }}><code>dispatchDeleteRole(id)</code></td><td>Delete a role and refresh list</td></tr>
            <tr style={{ borderBottom: '1px solid #222' }}><td style={{ padding: '8px' }}><code>dispatchGetUsers(params?)</code></td><td>Fetch users and update state</td></tr>
            <tr style={{ borderBottom: '1px solid #222' }}><td style={{ padding: '8px' }}><code>dispatchGetUserById(id)</code></td><td>Fetch a user by ID</td></tr>
            <tr style={{ borderBottom: '1px solid #222' }}><td style={{ padding: '8px' }}><code>dispatchCreateUser(body)</code></td><td>Create a user and refresh list</td></tr>
            <tr style={{ borderBottom: '1px solid #222' }}><td style={{ padding: '8px' }}><code>dispatchUpdateUser({'{id, body}'})</code></td><td>Update a user and refresh list</td></tr>
            <tr style={{ borderBottom: '1px solid #222' }}><td style={{ padding: '8px' }}><code>dispatchDeleteUser(id)</code></td><td>Delete a user and refresh list</td></tr>
            <tr><td style={{ padding: '8px' }}><code>dispatchGetUserRoles(id)</code></td><td>Get roles assigned to a user</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TestComponentInterfaces() {
  // Type demonstration - these interfaces define component props
  const rolesInputs: Identity.RolesComponentInputs = {
    onRoleCreated: (role) => console.log('Created:', role.name),
    onRoleUpdated: (role) => console.log('Updated:', role.name),
    onRoleDeleted: (id) => console.log('Deleted:', id),
  }

  const rolesOutputs: Identity.RolesComponentOutputs = {
    onVisiblePermissionChange: (visible) => console.log('Permission modal:', visible),
  }

  const usersInputs: Identity.UsersComponentInputs = {
    onUserCreated: (user) => console.log('Created:', user.userName),
    passwordRulesArr: ['number', 'capital'],
    requiredPasswordLength: 8,
  }

  const usersOutputs: Identity.UsersComponentOutputs = {
    onVisiblePermissionChange: (visible) => console.log('Permission modal:', visible),
  }

  return (
    <div className="test-section">
      <h2>Component Interface Types (v2.0.0)</h2>
      <p>New in v2.0.0: TypeScript interfaces for component input and output props.</p>

      <div className="test-card">
        <h3>Identity.RolesComponentInputs</h3>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
{`interface RolesComponentInputs {
  readonly onRoleCreated?: (role: RoleItem) => void;
  readonly onRoleUpdated?: (role: RoleItem) => void;
  readonly onRoleDeleted?: (id: string) => void;
}`}
        </pre>
        <h4 style={{ marginTop: '1rem' }}>Current Test Value:</h4>
        <pre style={{ padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
          {`{ onRoleCreated: ${rolesInputs.onRoleCreated ? 'fn' : 'undefined'}, onRoleUpdated: ${rolesInputs.onRoleUpdated ? 'fn' : 'undefined'}, onRoleDeleted: ${rolesInputs.onRoleDeleted ? 'fn' : 'undefined'} }`}
        </pre>
      </div>

      <div className="test-card">
        <h3>Identity.RolesComponentOutputs</h3>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
{`interface RolesComponentOutputs {
  readonly onVisiblePermissionChange?: (visible: boolean) => void;
}`}
        </pre>
        <h4 style={{ marginTop: '1rem' }}>Current Test Value:</h4>
        <pre style={{ padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
          {`{ onVisiblePermissionChange: ${rolesOutputs.onVisiblePermissionChange ? 'fn' : 'undefined'} }`}
        </pre>
      </div>

      <div className="test-card">
        <h3>Identity.UsersComponentInputs</h3>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
{`interface UsersComponentInputs {
  readonly onUserCreated?: (user: UserItem) => void;
  readonly onUserUpdated?: (user: UserItem) => void;
  readonly onUserDeleted?: (id: string) => void;
  readonly passwordRulesArr?: ('number' | 'small' | 'capital' | 'special')[];
  readonly requiredPasswordLength?: number;
}`}
        </pre>
        <h4 style={{ marginTop: '1rem' }}>Current Test Value:</h4>
        <pre style={{ padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
          {JSON.stringify({
            onUserCreated: 'fn',
            passwordRulesArr: usersInputs.passwordRulesArr,
            requiredPasswordLength: usersInputs.requiredPasswordLength,
          }, null, 2)}
        </pre>
      </div>

      <div className="test-card">
        <h3>Identity.UsersComponentOutputs</h3>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
{`interface UsersComponentOutputs {
  readonly onVisiblePermissionChange?: (visible: boolean) => void;
}`}
        </pre>
        <h4 style={{ marginTop: '1rem' }}>Current Test Value:</h4>
        <pre style={{ padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
          {`{ onVisiblePermissionChange: ${usersOutputs.onVisiblePermissionChange ? 'fn' : 'undefined'} }`}
        </pre>
      </div>

      <div className="test-card">
        <h3>Usage Example</h3>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
{`import type { Identity } from '@abpjs/identity';

// Type your component props with these interfaces
type RolesComponentProps =
  Identity.RolesComponentInputs &
  Identity.RolesComponentOutputs;

type UsersComponentProps =
  Identity.UsersComponentInputs &
  Identity.UsersComponentOutputs;

function MyRolesWrapper(props: RolesComponentProps) {
  const { onRoleCreated, onVisiblePermissionChange } = props;
  // ... component implementation
}`}
        </pre>
      </div>
    </div>
  )
}

function TestV270Features() {
  return (
    <div className="test-section">
      <h2>What's New in v2.7.0</h2>

      <div className="test-card">
        <h3>eIdentityComponents Enum</h3>
        <p>New enum for component replacement keys:</p>
        <pre style={{ fontSize: '12px' }}>{`import { eIdentityComponents } from '@abpjs/identity'

// Component replacement keys
const rolesKey = eIdentityComponents.Roles    // "Identity.RolesComponent"
const usersKey = eIdentityComponents.Users    // "Identity.UsersComponent"`}</pre>
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
              <td style={{ padding: '8px' }}><code>Roles</code></td>
              <td style={{ padding: '8px' }}><code style={{ color: '#2ecc71' }}>{eIdentityComponents.Roles}</code></td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>Users</code></td>
              <td style={{ padding: '8px' }}><code style={{ color: '#2ecc71' }}>{eIdentityComponents.Users}</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>eIdentityRouteNames Enum</h3>
        <p>Enum for route name constants (used for navigation menus and breadcrumbs):</p>
        <p style={{ color: '#f88', fontSize: '12px', marginBottom: '0.5rem' }}>
          Note: In v3.0.0, the Administration key was removed. Use AbpUiNavigation for administration menu.
        </p>
        <pre style={{ fontSize: '12px' }}>{`import { eIdentityRouteNames } from '@abpjs/identity'

// Route names for localization (v3.0.0 - no Administration key)
const identity = eIdentityRouteNames.IdentityManagement
const roles = eIdentityRouteNames.Roles
const users = eIdentityRouteNames.Users`}</pre>
        <h4 style={{ marginTop: '1rem' }}>Enum Values (v3.0.0):</h4>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Key</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px' }}><code>IdentityManagement</code></td>
              <td style={{ padding: '8px' }}><code style={{ color: '#2ecc71' }}>{eIdentityRouteNames.IdentityManagement}</code></td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>Roles</code></td>
              <td style={{ padding: '8px' }}><code style={{ color: '#2ecc71' }}>{eIdentityRouteNames.Roles}</code></td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>Users</code></td>
              <td style={{ padding: '8px' }}><code style={{ color: '#2ecc71' }}>{eIdentityRouteNames.Users}</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>Component Keys (Static Properties)</h3>
        <p>Components now have <code>componentKey</code> static properties for the component replacement system:</p>
        <pre style={{ fontSize: '12px' }}>{`import { RolesComponent, UsersComponent } from '@abpjs/identity'

// Access component keys directly from components
console.log(RolesComponent.componentKey) // "Identity.RolesComponent"
console.log(UsersComponent.componentKey) // "Identity.UsersComponent"`}</pre>
        <h4 style={{ marginTop: '1rem' }}>Current Values:</h4>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Component</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>componentKey</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px' }}><code>RolesComponent</code></td>
              <td style={{ padding: '8px' }}><code style={{ color: '#2ecc71' }}>{RolesComponent.componentKey}</code></td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>UsersComponent</code></td>
              <td style={{ padding: '8px' }}><code style={{ color: '#2ecc71' }}>{UsersComponent.componentKey}</code></td>
            </tr>
          </tbody>
        </table>
        <p style={{ fontSize: '0.9rem', color: '#888', marginTop: '1rem' }}>
          Use these keys to replace the default components with custom implementations.
        </p>
      </div>
    </div>
  )
}

function TestV240Features() {
  const restService = useRestService()
  const identityService = useMemo(() => new IdentityService(restService), [restService])
  const { isAuthenticated } = useAuth()
  const [allRoles, setAllRoles] = useState<Identity.RoleItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFetchAllRoles = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await identityService.getAllRoles()
      setAllRoles(response.items)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch all roles')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="test-section">
      <h2>What's New in v2.4.0</h2>

      <div className="test-card">
        <h3>IdentityService: apiName property</h3>
        <p>New property exposing the API name used for REST requests:</p>
        <pre style={{ fontSize: '12px' }}>{`import { IdentityService } from '@abpjs/identity'

const service = new IdentityService(restService)
console.log(service.apiName) // "default"`}</pre>
        <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
          Current value: <code style={{ color: '#2ecc71' }}>{identityService.apiName}</code>
        </p>
        <p style={{ fontSize: '0.9rem', color: '#888', marginTop: '0.5rem' }}>
          This property identifies which API configuration to use from your environment settings.
          Default value is <code>"default"</code>.
        </p>
      </div>

      <div className="test-card">
        <h3>IdentityService: getAllRoles() method</h3>
        <p>New method to fetch all roles without pagination:</p>
        <pre style={{ fontSize: '12px' }}>{`// Fetch all roles in a single request
const response = await identityService.getAllRoles()
console.log(response.items) // All roles
console.log(response.totalCount) // Total count`}</pre>

        <div style={{ marginTop: '1rem' }}>
          <button
            onClick={handleFetchAllRoles}
            disabled={isLoading || !isAuthenticated}
          >
            {isLoading ? 'Loading...' : 'Fetch All Roles'}
          </button>
          {!isAuthenticated && (
            <span style={{ marginLeft: '0.5rem', color: '#f88', fontSize: '12px' }}>
              (Login required)
            </span>
          )}
        </div>

        {error && (
          <p style={{ color: '#f88', marginTop: '0.5rem', fontSize: '14px' }}>
            Error: {error}
          </p>
        )}

        {allRoles.length > 0 && (
          <div style={{ marginTop: '0.5rem' }}>
            <p style={{ fontSize: '14px' }}>
              Fetched <strong>{allRoles.length}</strong> roles:
            </p>
            <ul style={{ fontSize: '12px', margin: '0.25rem 0', paddingLeft: '1.5rem' }}>
              {allRoles.slice(0, 5).map(role => (
                <li key={role.id}>{role.name} {role.isDefault && '(Default)'}</li>
              ))}
              {allRoles.length > 5 && <li>... and {allRoles.length - 5} more</li>}
            </ul>
          </div>
        )}
      </div>

      <div className="test-card">
        <h3>API Endpoint</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Method</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Endpoint</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ backgroundColor: '#1a2e1a' }}>
              <td style={{ padding: '8px' }}><code>GET</code></td>
              <td style={{ padding: '8px' }}><code>/api/identity/roles/all</code></td>
              <td><strong>(v2.4.0)</strong> Fetch all roles without pagination</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>Dependency Updates</h3>
        <ul>
          <li>Updated to @abpjs/theme-shared@2.4.0</li>
          <li>Updated to @abpjs/permission-management@2.4.0</li>
        </ul>
      </div>
    </div>
  )
}

function TestV300Features() {
  const restService = useRestService()
  const identityService = useMemo(() => new IdentityService(restService), [restService])
  const { isAuthenticated } = useAuth()
  const [assignableRoles, setAssignableRoles] = useState<Identity.RoleItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [routesConfigured, setRoutesConfigured] = useState(false)

  const handleFetchAssignableRoles = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await identityService.getUserAssignableRoles()
      setAssignableRoles(response.items)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch assignable roles')
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfigureRoutes = () => {
    try {
      const routes = getRoutesService()
      const addRoutes = configureRoutes(routes)
      addRoutes()
      setRoutesConfigured(true)
    } catch (err: any) {
      setError(err.message || 'Failed to configure routes')
    }
  }

  return (
    <div className="test-section">
      <h2>What's New in v3.0.0</h2>

      <div className="test-card">
        <h3>eIdentityPolicyNames Enum</h3>
        <p>New enum for permission policy names:</p>
        <pre style={{ fontSize: '12px' }}>{`import { eIdentityPolicyNames } from '@abpjs/identity'

// Policy names for authorization
const managementPolicy = eIdentityPolicyNames.IdentityManagement
const rolesPolicy = eIdentityPolicyNames.Roles
const usersPolicy = eIdentityPolicyNames.Users`}</pre>
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
              <td style={{ padding: '8px' }}><code>IdentityManagement</code></td>
              <td style={{ padding: '8px' }}><code style={{ color: '#2ecc71' }}>{eIdentityPolicyNames.IdentityManagement}</code></td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>Roles</code></td>
              <td style={{ padding: '8px' }}><code style={{ color: '#2ecc71' }}>{eIdentityPolicyNames.Roles}</code></td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>Users</code></td>
              <td style={{ padding: '8px' }}><code style={{ color: '#2ecc71' }}>{eIdentityPolicyNames.Users}</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>configureRoutes Function</h3>
        <p>Route configuration function for identity module:</p>
        <pre style={{ fontSize: '12px' }}>{`import { configureRoutes, getRoutesService } from '@abpjs/identity'

// Configure routes
const routes = getRoutesService()
const addRoutes = configureRoutes(routes)
addRoutes()`}</pre>
        <div style={{ marginTop: '1rem' }}>
          <button onClick={handleConfigureRoutes} disabled={routesConfigured}>
            {routesConfigured ? 'Routes Configured!' : 'Configure Identity Routes'}
          </button>
        </div>
        <p style={{ fontSize: '12px', color: '#888', marginTop: '0.5rem' }}>
          configureRoutes: {typeof configureRoutes}
        </p>
      </div>

      <div className="test-card">
        <h3>Route Initialization Example</h3>
        <p>Simplified route initialization with configureRoutes:</p>
        <pre style={{ fontSize: '12px' }}>{`import { configureRoutes, getRoutesService } from '@abpjs/identity'

// In your app initialization:
const routes = getRoutesService()
configureRoutes(routes)()`}</pre>
        <p style={{ fontSize: '12px', color: '#888', marginTop: '0.5rem' }}>
          This helper uses RoutesService to add all identity routes.
        </p>
      </div>

      <div className="test-card">
        <h3>getUserAssignableRoles() Method</h3>
        <p>New method to fetch roles that can be assigned to users:</p>
        <pre style={{ fontSize: '12px' }}>{`const service = new IdentityService(restService)
const response = await service.getUserAssignableRoles()
console.log(response.items) // Assignable roles`}</pre>

        <div style={{ marginTop: '1rem' }}>
          <button
            onClick={handleFetchAssignableRoles}
            disabled={isLoading || !isAuthenticated}
          >
            {isLoading ? 'Loading...' : 'Fetch Assignable Roles'}
          </button>
          {!isAuthenticated && (
            <span style={{ marginLeft: '0.5rem', color: '#f88', fontSize: '12px' }}>
              (Login required)
            </span>
          )}
        </div>

        {error && (
          <p style={{ color: '#f88', marginTop: '0.5rem', fontSize: '14px' }}>
            Error: {error}
          </p>
        )}

        {assignableRoles.length > 0 && (
          <div style={{ marginTop: '0.5rem' }}>
            <p style={{ fontSize: '14px' }}>
              Fetched <strong>{assignableRoles.length}</strong> assignable roles:
            </p>
            <ul style={{ fontSize: '12px', margin: '0.25rem 0', paddingLeft: '1.5rem' }}>
              {assignableRoles.slice(0, 5).map(role => (
                <li key={role.id}>{role.name} {role.isDefault && '(Default)'}</li>
              ))}
              {assignableRoles.length > 5 && <li>... and {assignableRoles.length - 5} more</li>}
            </ul>
          </div>
        )}
      </div>

      <div className="test-card">
        <h3>API Endpoint</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Method</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Endpoint</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ backgroundColor: '#1a2e1a' }}>
              <td style={{ padding: '8px' }}><code>GET</code></td>
              <td style={{ padding: '8px' }}><code>/api/identity/users/assignable-roles</code></td>
              <td><strong>(v3.0.0)</strong> Fetch roles assignable to users</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>Breaking Changes</h3>
        <ul>
          <li><code>eIdentityRouteNames.Administration</code> has been removed. Use <code>AbpUiNavigation::Menu:Administration</code> directly.</li>
          <li><code>Toaster.Status</code> usage replaced with <code>Confirmation.Status</code> in components.</li>
        </ul>
      </div>
    </div>
  )
}

function TestV310Features() {
  return (
    <div className="test-section">
      <h2>What's New in v3.1.0</h2>

      <div className="test-card">
        <h3>Version Bump Only</h3>
        <p>
          Version 3.1.0 contains internal Angular type reference updates only.
          There are <strong>no functional changes</strong> that affect the React translation.
        </p>
        <pre style={{ fontSize: '12px', background: '#1a1a2e', padding: '0.5rem', borderRadius: '4px' }}>
{`// Angular internal changes (no React impact)
// Type references updated: ɵbi → ɵbl
// These are internal Angular symbols not exposed in the public API`}
        </pre>
        <div style={{ marginTop: '0.5rem', padding: '0.75rem', background: '#1a2e1a', borderRadius: '4px', border: '1px solid #2e4a2e' }}>
          <p style={{ color: '#6f6', margin: 0, fontSize: '14px' }}>
            <strong>No breaking changes!</strong> All existing code continues to work without modifications.
          </p>
        </div>
      </div>

      <div className="test-card">
        <h3>Dependency Updates</h3>
        <ul>
          <li>Updated internal Angular peer dependencies</li>
          <li>@abp/ng.permission-management ~3.0.0 → ~3.1.0</li>
          <li>@abp/ng.theme.shared ~3.0.0 → ~3.1.0</li>
        </ul>
      </div>
    </div>
  )
}

function TestV320Features() {
  const restService = useRestService()
  const { isAuthenticated } = useAuth()

  // Initialize proxy services
  const roleService = useMemo(() => new IdentityRoleService(restService), [restService])
  const userService = useMemo(() => new IdentityUserService(restService), [restService])
  const userLookupService = useMemo(() => new IdentityUserLookupService(restService), [restService])
  const profileService = useMemo(() => new ProfileService(restService), [restService])

  // State for demo
  const [proxyRoles, setProxyRoles] = useState<IdentityRoleDto[]>([])
  const [proxyUsers, setProxyUsers] = useState<IdentityUserDto[]>([])
  const [profileData, setProfileData] = useState<ProfileDto | null>(null)
  const [lookupCount, setLookupCount] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Demo: Fetch roles using IdentityRoleService
  const handleFetchProxyRoles = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await roleService.getList({ skipCount: 0, maxResultCount: 10 })
      setProxyRoles(result.items)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch roles')
    } finally {
      setIsLoading(false)
    }
  }

  // Demo: Fetch users using IdentityUserService
  const handleFetchProxyUsers = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const input: GetIdentityUsersInput = { filter: '', skipCount: 0, maxResultCount: 10 }
      const result = await userService.getList(input)
      setProxyUsers(result.items)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch users')
    } finally {
      setIsLoading(false)
    }
  }

  // Demo: Fetch profile using ProfileService
  const handleFetchProfile = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await profileService.get()
      setProfileData(result)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch profile')
    } finally {
      setIsLoading(false)
    }
  }

  // Demo: Get user count using IdentityUserLookupService
  const handleFetchUserCount = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const input: UserLookupCountInputDto = { filter: '' }
      const result = await userLookupService.getCount(input)
      setLookupCount(result)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user count')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="test-section">
      <h2>What's New in v3.2.0</h2>

      <div className="test-card">
        <h3>New Proxy Services</h3>
        <p>v3.2.0 introduces typed proxy services for direct API access:</p>
        <pre style={{ fontSize: '12px' }}>{`import {
  IdentityRoleService,
  IdentityUserService,
  IdentityUserLookupService,
  ProfileService,
} from '@abpjs/identity'

// Initialize with RestService
const roleService = new IdentityRoleService(restService)
const userService = new IdentityUserService(restService)
const userLookupService = new IdentityUserLookupService(restService)
const profileService = new ProfileService(restService)`}</pre>

        <h4 style={{ marginTop: '1rem' }}>Service Properties:</h4>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Service</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>apiName</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px' }}><code>IdentityRoleService</code></td>
              <td style={{ padding: '8px' }}><code style={{ color: '#2ecc71' }}>{roleService.apiName}</code></td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>IdentityUserService</code></td>
              <td style={{ padding: '8px' }}><code style={{ color: '#2ecc71' }}>{userService.apiName}</code></td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>IdentityUserLookupService</code></td>
              <td style={{ padding: '8px' }}><code style={{ color: '#2ecc71' }}>{userLookupService.apiName}</code></td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>ProfileService</code></td>
              <td style={{ padding: '8px' }}><code style={{ color: '#2ecc71' }}>{profileService.apiName}</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>IdentityRoleService Methods</h3>
        <p>Typed role management operations:</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Method</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: '8px' }}><code>create(input)</code></td><td>Create a new role</td></tr>
            <tr><td style={{ padding: '8px' }}><code>delete(id)</code></td><td>Delete a role by ID</td></tr>
            <tr><td style={{ padding: '8px' }}><code>get(id)</code></td><td>Get a role by ID</td></tr>
            <tr><td style={{ padding: '8px' }}><code>getAllList()</code></td><td>Get all roles (no pagination)</td></tr>
            <tr><td style={{ padding: '8px' }}><code>getList(input)</code></td><td>Get paged roles list</td></tr>
            <tr><td style={{ padding: '8px' }}><code>update(id, input)</code></td><td>Update a role</td></tr>
          </tbody>
        </table>

        <div style={{ marginTop: '1rem' }}>
          <button onClick={handleFetchProxyRoles} disabled={isLoading || !isAuthenticated}>
            {isLoading ? 'Loading...' : 'Fetch Roles via IdentityRoleService'}
          </button>
          {!isAuthenticated && (
            <span style={{ marginLeft: '0.5rem', color: '#f88', fontSize: '12px' }}>(Login required)</span>
          )}
        </div>
        {proxyRoles.length > 0 && (
          <div style={{ marginTop: '0.5rem', fontSize: '12px' }}>
            <strong>Fetched {proxyRoles.length} roles:</strong>
            <ul style={{ margin: '0.25rem 0', paddingLeft: '1.5rem' }}>
              {proxyRoles.slice(0, 3).map(role => (
                <li key={role.id}>{role.name} (isStatic: {role.isStatic ? 'true' : 'false'})</li>
              ))}
              {proxyRoles.length > 3 && <li>... and {proxyRoles.length - 3} more</li>}
            </ul>
          </div>
        )}
      </div>

      <div className="test-card">
        <h3>IdentityUserService Methods</h3>
        <p>Typed user management operations:</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Method</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: '8px' }}><code>create(input)</code></td><td>Create a new user</td></tr>
            <tr><td style={{ padding: '8px' }}><code>delete(id)</code></td><td>Delete a user by ID</td></tr>
            <tr><td style={{ padding: '8px' }}><code>findByEmail(email)</code></td><td>Find user by email</td></tr>
            <tr><td style={{ padding: '8px' }}><code>findByUsername(userName)</code></td><td>Find user by username</td></tr>
            <tr><td style={{ padding: '8px' }}><code>get(id)</code></td><td>Get a user by ID</td></tr>
            <tr><td style={{ padding: '8px' }}><code>getAssignableRoles()</code></td><td>Get roles assignable to users</td></tr>
            <tr><td style={{ padding: '8px' }}><code>getList(input)</code></td><td>Get paged users list</td></tr>
            <tr><td style={{ padding: '8px' }}><code>getRoles(id)</code></td><td>Get roles for a user</td></tr>
            <tr><td style={{ padding: '8px' }}><code>update(id, input)</code></td><td>Update a user</td></tr>
            <tr><td style={{ padding: '8px' }}><code>updateRoles(id, input)</code></td><td>Update user roles</td></tr>
          </tbody>
        </table>

        <div style={{ marginTop: '1rem' }}>
          <button onClick={handleFetchProxyUsers} disabled={isLoading || !isAuthenticated}>
            {isLoading ? 'Loading...' : 'Fetch Users via IdentityUserService'}
          </button>
        </div>
        {proxyUsers.length > 0 && (
          <div style={{ marginTop: '0.5rem', fontSize: '12px' }}>
            <strong>Fetched {proxyUsers.length} users:</strong>
            <ul style={{ margin: '0.25rem 0', paddingLeft: '1.5rem' }}>
              {proxyUsers.slice(0, 3).map(user => (
                <li key={user.id}>{user.userName} ({user.email})</li>
              ))}
              {proxyUsers.length > 3 && <li>... and {proxyUsers.length - 3} more</li>}
            </ul>
          </div>
        )}
      </div>

      <div className="test-card">
        <h3>IdentityUserLookupService Methods</h3>
        <p>User lookup operations (for user pickers, autocomplete, etc.):</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Method</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: '8px' }}><code>findById(id)</code></td><td>Find user by ID</td></tr>
            <tr><td style={{ padding: '8px' }}><code>findByUserName(userName)</code></td><td>Find user by username</td></tr>
            <tr><td style={{ padding: '8px' }}><code>getCount(input)</code></td><td>Get total user count with filter</td></tr>
            <tr><td style={{ padding: '8px' }}><code>search(input)</code></td><td>Search users with pagination</td></tr>
          </tbody>
        </table>

        <div style={{ marginTop: '1rem' }}>
          <button onClick={handleFetchUserCount} disabled={isLoading || !isAuthenticated}>
            {isLoading ? 'Loading...' : 'Get User Count via IdentityUserLookupService'}
          </button>
        </div>
        {lookupCount !== null && (
          <p style={{ marginTop: '0.5rem', fontSize: '14px' }}>
            Total users: <strong>{lookupCount}</strong>
          </p>
        )}
      </div>

      <div className="test-card">
        <h3>ProfileService Methods</h3>
        <p>Current user profile operations:</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Method</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: '8px' }}><code>changePassword(input)</code></td><td>Change current user password</td></tr>
            <tr><td style={{ padding: '8px' }}><code>get()</code></td><td>Get current user profile</td></tr>
            <tr><td style={{ padding: '8px' }}><code>update(input)</code></td><td>Update current user profile</td></tr>
          </tbody>
        </table>

        <div style={{ marginTop: '1rem' }}>
          <button onClick={handleFetchProfile} disabled={isLoading || !isAuthenticated}>
            {isLoading ? 'Loading...' : 'Fetch My Profile via ProfileService'}
          </button>
        </div>
        {profileData && (
          <div style={{ marginTop: '0.5rem', fontSize: '12px' }}>
            <strong>Profile:</strong>
            <pre style={{ background: '#1a1a2e', padding: '0.5rem', borderRadius: '4px', marginTop: '0.25rem' }}>
{JSON.stringify({
  userName: profileData.userName,
  email: profileData.email,
  name: profileData.name,
  surname: profileData.surname,
  isExternal: profileData.isExternal,
  hasPassword: profileData.hasPassword,
}, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="test-card">
        <h3>New Proxy Models (DTOs)</h3>
        <p>Typed DTOs for API requests and responses:</p>
        <pre style={{ fontSize: '12px' }}>{`import type {
  // Role DTOs
  IdentityRoleDto,
  IdentityRoleCreateDto,
  IdentityRoleUpdateDto,

  // User DTOs
  IdentityUserDto,
  IdentityUserCreateDto,
  IdentityUserUpdateDto,
  IdentityUserUpdateRolesDto,
  GetIdentityUsersInput,

  // Profile DTOs
  ProfileDto,
  UpdateProfileDto,
  ChangePasswordInput,

  // User Lookup DTOs
  UserLookupCountInputDto,
  UserLookupSearchInputDto,
  UserData,
} from '@abpjs/identity'`}</pre>
      </div>

      <div className="test-card">
        <h3>New API Endpoints (v3.2.0)</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Method</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Endpoint</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ backgroundColor: '#1a2e1a' }}>
              <td style={{ padding: '8px' }}><code>GET</code></td>
              <td style={{ padding: '8px' }}><code>/api/identity/users/by-email/:email</code></td>
              <td>Find user by email</td>
            </tr>
            <tr style={{ backgroundColor: '#1a2e1a' }}>
              <td style={{ padding: '8px' }}><code>GET</code></td>
              <td style={{ padding: '8px' }}><code>/api/identity/users/by-username/:userName</code></td>
              <td>Find user by username</td>
            </tr>
            <tr style={{ backgroundColor: '#1a2e1a' }}>
              <td style={{ padding: '8px' }}><code>PUT</code></td>
              <td style={{ padding: '8px' }}><code>/api/identity/users/:id/roles</code></td>
              <td>Update user roles</td>
            </tr>
            <tr style={{ backgroundColor: '#1a2e1a' }}>
              <td style={{ padding: '8px' }}><code>GET</code></td>
              <td style={{ padding: '8px' }}><code>/api/identity/users/lookup/:id</code></td>
              <td>Lookup user by ID</td>
            </tr>
            <tr style={{ backgroundColor: '#1a2e1a' }}>
              <td style={{ padding: '8px' }}><code>GET</code></td>
              <td style={{ padding: '8px' }}><code>/api/identity/users/lookup/by-username/:userName</code></td>
              <td>Lookup user by username</td>
            </tr>
            <tr style={{ backgroundColor: '#1a2e1a' }}>
              <td style={{ padding: '8px' }}><code>GET</code></td>
              <td style={{ padding: '8px' }}><code>/api/identity/users/lookup/count</code></td>
              <td>Get user count with filter</td>
            </tr>
            <tr style={{ backgroundColor: '#1a2e1a' }}>
              <td style={{ padding: '8px' }}><code>GET</code></td>
              <td style={{ padding: '8px' }}><code>/api/identity/users/lookup/search</code></td>
              <td>Search users</td>
            </tr>
            <tr style={{ backgroundColor: '#1a2e1a' }}>
              <td style={{ padding: '8px' }}><code>GET</code></td>
              <td style={{ padding: '8px' }}><code>/api/identity/my-profile</code></td>
              <td>Get current user profile</td>
            </tr>
            <tr style={{ backgroundColor: '#1a2e1a' }}>
              <td style={{ padding: '8px' }}><code>PUT</code></td>
              <td style={{ padding: '8px' }}><code>/api/identity/my-profile</code></td>
              <td>Update current user profile</td>
            </tr>
            <tr style={{ backgroundColor: '#1a2e1a' }}>
              <td style={{ padding: '8px' }}><code>POST</code></td>
              <td style={{ padding: '8px' }}><code>/api/identity/my-profile/change-password</code></td>
              <td>Change password</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>Deprecated Types</h3>
        <p style={{ color: '#f88' }}>The following legacy types are deprecated in v3.2.0:</p>
        <ul style={{ fontSize: '14px' }}>
          <li><code>Identity.RoleItem</code> - Use <code>IdentityRoleDto</code> instead</li>
          <li><code>Identity.UserItem</code> - Use <code>IdentityUserDto</code> instead</li>
          <li><code>Identity.RoleSaveRequest</code> - Use <code>IdentityRoleCreateDto</code> or <code>IdentityRoleUpdateDto</code></li>
          <li><code>Identity.UserSaveRequest</code> - Use <code>IdentityUserCreateDto</code> or <code>IdentityUserUpdateDto</code></li>
        </ul>
        <pre style={{ fontSize: '12px', marginTop: '0.5rem' }}>{`// Before (deprecated)
import type { Identity } from '@abpjs/identity'
const roles: Identity.RoleItem[] = []

// After (v3.2.0)
import type { IdentityRoleDto } from '@abpjs/identity'
const roles: IdentityRoleDto[] = []`}</pre>
      </div>

      {error && (
        <div className="test-card" style={{ borderColor: '#f44' }}>
          <p style={{ color: '#f88' }}>Error: {error}</p>
        </div>
      )}
    </div>
  )
}

export function TestIdentityPage() {
  return (
    <div>
      <h1>@abpjs/identity Tests v3.2.0</h1>
      <p>Testing identity management components and hooks for role and user management.</p>
      <p style={{ color: '#2ecc71', fontSize: '0.9rem' }}>Version 3.2.0 - New proxy services and typed DTOs</p>

      {/* v3.2.0 Features - Highlighted at top */}
      <h2 style={{ marginTop: '2rem', borderTop: '2px solid #9333ea', paddingTop: '1rem' }}>
        v3.2.0 New Features
      </h2>
      <TestV320Features />

      {/* v3.1.0 Features */}
      <h2 style={{ marginTop: '2rem', borderTop: '2px solid #f59e0b', paddingTop: '1rem' }}>
        v3.1.0 Changes
      </h2>
      <TestV310Features />

      {/* v3.0.0 Features */}
      <h2 style={{ marginTop: '2rem', borderTop: '2px solid #e74c3c', paddingTop: '1rem' }}>
        v3.0.0 New Features
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

      <TestRolesComponent />
      <TestUsersComponent />
      <TestRolesHook />
      <TestUsersHook />
      <TestIdentityHook />
      <TestIdentityStateService />
      <TestComponentInterfaces />
      <TestRouteConstants />
      <TestApiEndpoints />
      <TestHookMethods />
    </div>
  )
}

export default TestIdentityPage
