/**
 * Test page for @abpjs/identity package
 * Tests: RolesComponent, UsersComponent, useRoles, useUsers, useIdentity hooks
 */
import { useState, useEffect } from 'react'
import { useAuth, type ABP } from '@abpjs/core'
import {
  RolesComponent,
  UsersComponent,
  useRoles,
  useUsers,
  useIdentity,
  type Identity,
  IDENTITY_ROUTES,
  IDENTITY_ROUTE_PATHS,
  IDENTITY_POLICIES,
} from '@abpjs/identity'

function TestRolesComponent() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="test-section">
      <h2>RolesComponent</h2>
      <p>Full roles management component with create, edit, delete, and permissions.</p>

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
          />
        </div>
      )}
    </div>
  )
}

function TestUsersComponent() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="test-section">
      <h2>UsersComponent</h2>
      <p>Full users management component with create, edit, delete, role assignment, and permissions.</p>

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
        <h3>IDENTITY_ROUTES</h3>
        <p>Route configuration for the identity module:</p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
          {JSON.stringify(IDENTITY_ROUTES, null, 2)}
        </pre>
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
    </div>
  )
}

export function TestIdentityPage() {
  return (
    <div>
      <h1>@abpjs/identity Tests</h1>
      <p>Testing identity management components and hooks for role and user management.</p>

      <TestRolesComponent />
      <TestUsersComponent />
      <TestRolesHook />
      <TestUsersHook />
      <TestIdentityHook />
      <TestRouteConstants />
      <TestApiEndpoints />
      <TestHookMethods />
    </div>
  )
}

export default TestIdentityPage
