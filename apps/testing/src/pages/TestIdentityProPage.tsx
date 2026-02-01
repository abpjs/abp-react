/**
 * Test page for @abpjs/identity-pro package
 * Tests: ClaimsComponent, ClaimModal, useClaims hook, IdentityStateService, and Pro-specific features
 * @since 2.0.0
 * @updated 2.2.0 - Added unlockUser, openPermissionsModal for users and roles
 */
import { useState, useEffect } from 'react'
import { useAuth } from '@abpjs/core'
import {
  ClaimsComponent,
  ClaimModal,
  useClaims,
  useUsers,
  useRoles,
  type Identity,
  type IdentityStateService,
} from '@abpjs/identity-pro'

function TestClaimsComponent() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="test-section">
      <h2>ClaimsComponent (Pro)</h2>
      <p>Full claim types management component with create, edit, and delete operations.</p>

      {!isAuthenticated ? (
        <div className="test-card">
          <p style={{ color: '#f88' }}>
            You must be authenticated to use identity pro features
          </p>
        </div>
      ) : (
        <div className="test-card" style={{ padding: 0 }}>
          <ClaimsComponent
            onClaimTypeCreated={(claim) => console.log('Claim type created:', claim)}
            onClaimTypeUpdated={(claim) => console.log('Claim type updated:', claim)}
            onClaimTypeDeleted={(id) => console.log('Claim type deleted:', id)}
          />
        </div>
      )}
    </div>
  )
}

function TestClaimModal() {
  const { isAuthenticated } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [subjectId, setSubjectId] = useState('')
  const [subjectType, setSubjectType] = useState<'users' | 'roles'>('users')

  return (
    <div className="test-section">
      <h2>ClaimModal (Pro)</h2>
      <p>Modal for managing claims on users or roles.</p>

      {!isAuthenticated ? (
        <div className="test-card">
          <p style={{ color: '#f88' }}>
            You must be authenticated to use identity pro features
          </p>
        </div>
      ) : (
        <div className="test-card">
          <h3>Open Claim Modal</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Enter User or Role ID"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              style={{
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #333',
              }}
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="radio"
                  name="subjectType"
                  checked={subjectType === 'users'}
                  onChange={() => setSubjectType('users')}
                />
                User Claims
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="radio"
                  name="subjectType"
                  checked={subjectType === 'roles'}
                  onChange={() => setSubjectType('roles')}
                />
                Role Claims
              </label>
            </div>
            <button
              onClick={() => setShowModal(true)}
              disabled={!subjectId}
            >
              Open Claim Modal
            </button>
          </div>
          <p style={{ fontSize: '14px', color: '#888' }}>
            Enter a valid user ID or role ID to manage their claims.
          </p>

          <ClaimModal
            visible={showModal}
            onVisibleChange={setShowModal}
            subjectId={subjectId}
            subjectType={subjectType}
            onSaved={() => console.log('Claims saved!')}
          />
        </div>
      )}
    </div>
  )
}

function TestClaimsHook() {
  const {
    claimTypes,
    totalCount,
    claimTypeNames,
    selectedClaimType,
    isLoading,
    error,
    sortKey,
    sortOrder,
    fetchClaimTypes,
    fetchClaimTypeNames,
    getClaimTypeById,
    createClaimType,
    updateClaimType,
    deleteClaimType,
    setSelectedClaimType,
    setSortKey,
    setSortOrder,
    reset,
    getClaims,
    updateClaims,
  } = useClaims()

  const [testClaimId, setTestClaimId] = useState('')
  const [testClaimName, setTestClaimName] = useState('')
  const [testDescription, setTestDescription] = useState('')
  const [testValueType, setTestValueType] = useState(0)
  const [testRequired, setTestRequired] = useState(false)
  const [testRegex, setTestRegex] = useState('')
  const [testRegexDescription, setTestRegexDescription] = useState('')

  // For getClaims/updateClaims
  const [subjectId, setSubjectId] = useState('')
  const [subjectType, setSubjectType] = useState<'users' | 'roles'>('users')
  const [subjectClaims, setSubjectClaims] = useState<Identity.ClaimRequest[]>([])

  useEffect(() => {
    fetchClaimTypes()
    fetchClaimTypeNames()
  }, [fetchClaimTypes, fetchClaimTypeNames])

  const handleFetchClaims = async () => {
    if (subjectId) {
      const claims = await getClaims(subjectId, subjectType)
      setSubjectClaims(claims)
    }
  }

  return (
    <div className="test-section">
      <h2>useClaims Hook (Pro)</h2>

      <div className="test-card">
        <h3>Fetch Claim Types</h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => fetchClaimTypes()} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Fetch All Claim Types'}
          </button>
          <button onClick={() => fetchClaimTypeNames()} disabled={isLoading}>
            Fetch Claim Type Names
          </button>
        </div>
        <p style={{ marginTop: '0.5rem', fontSize: '14px', color: '#888' }}>
          Fetches claim types from the server
        </p>
      </div>

      <div className="test-card">
        <h3>Sorting</h3>
        <p>Current sortKey: <code>{sortKey}</code></p>
        <p>Current sortOrder: <code>{sortOrder || '(empty)'}</code></p>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button onClick={() => setSortKey('name')}>Sort by Name</button>
          <button onClick={() => setSortKey('description')}>Sort by Description</button>
          <button onClick={() => setSortKey('valueType')}>Sort by Value Type</button>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button onClick={() => setSortOrder('asc')}>Ascending</button>
          <button onClick={() => setSortOrder('desc')}>Descending</button>
          <button onClick={() => setSortOrder('')}>Clear Order</button>
        </div>
      </div>

      <div className="test-card">
        <h3>Get Claim Type by ID</h3>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
          <input
            type="text"
            placeholder="Enter Claim Type ID"
            value={testClaimId}
            onChange={(e) => setTestClaimId(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333',
              flex: 1
            }}
          />
          <button
            onClick={() => {
              if (testClaimId) {
                getClaimTypeById(testClaimId)
              }
            }}
            disabled={!testClaimId || isLoading}
          >
            Fetch Claim Type
          </button>
        </div>
      </div>

      <div className="test-card">
        <h3>Create Claim Type</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <input
            type="text"
            placeholder="Claim Type Name"
            value={testClaimName}
            onChange={(e) => setTestClaimName(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333',
            }}
          />
          <input
            type="text"
            placeholder="Description"
            value={testDescription}
            onChange={(e) => setTestDescription(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333',
            }}
          />
          <select
            value={testValueType}
            onChange={(e) => setTestValueType(Number(e.target.value))}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333',
            }}
          >
            <option value={0}>String</option>
            <option value={1}>Int</option>
            <option value={2}>Boolean</option>
            <option value={3}>DateTime</option>
          </select>
          <input
            type="text"
            placeholder="Regex Pattern (optional)"
            value={testRegex}
            onChange={(e) => setTestRegex(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333',
            }}
          />
          <input
            type="text"
            placeholder="Regex Description (optional)"
            value={testRegexDescription}
            onChange={(e) => setTestRegexDescription(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333',
            }}
          />
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={testRequired}
              onChange={(e) => setTestRequired(e.target.checked)}
            />
            Required
          </label>
          <button
            onClick={async () => {
              if (testClaimName) {
                const result = await createClaimType({
                  name: testClaimName,
                  description: testDescription,
                  valueType: testValueType,
                  required: testRequired,
                  isStatic: false,
                  regex: testRegex,
                  regexDescription: testRegexDescription,
                })
                if (result.success) {
                  setTestClaimName('')
                  setTestDescription('')
                  setTestValueType(0)
                  setTestRequired(false)
                  setTestRegex('')
                  setTestRegexDescription('')
                }
              }
            }}
            disabled={!testClaimName || isLoading}
          >
            Create Claim Type
          </button>
        </div>
      </div>

      <div className="test-card">
        <h3>Update Claim Type</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <input
            type="text"
            placeholder="Claim Type ID"
            value={testClaimId}
            onChange={(e) => setTestClaimId(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333'
            }}
          />
          <input
            type="text"
            placeholder="New Name"
            value={testClaimName}
            onChange={(e) => setTestClaimName(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333'
            }}
          />
          <button
            onClick={async () => {
              if (testClaimId && testClaimName) {
                const result = await updateClaimType({
                  id: testClaimId,
                  name: testClaimName,
                  description: testDescription,
                  valueType: testValueType,
                  required: testRequired,
                  isStatic: false,
                  regex: testRegex,
                  regexDescription: testRegexDescription,
                })
                if (result.success) {
                  setTestClaimId('')
                  setTestClaimName('')
                }
              }
            }}
            disabled={!testClaimId || !testClaimName || isLoading}
          >
            Update Claim Type
          </button>
        </div>
      </div>

      <div className="test-card">
        <h3>Delete Claim Type</h3>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
          <input
            type="text"
            placeholder="Enter Claim Type ID"
            value={testClaimId}
            onChange={(e) => setTestClaimId(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333',
              flex: 1
            }}
          />
          <button
            onClick={async () => {
              if (testClaimId && window.confirm(`Are you sure you want to delete claim type ${testClaimId}?`)) {
                const result = await deleteClaimType(testClaimId)
                if (result.success) {
                  setTestClaimId('')
                }
              }
            }}
            disabled={!testClaimId || isLoading}
            style={{ background: '#f44', color: 'white' }}
          >
            Delete Claim Type
          </button>
        </div>
      </div>

      <div className="test-card">
        <h3>Get/Update Claims for User/Role</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <input
            type="text"
            placeholder="User or Role ID"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333',
            }}
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="radio"
                name="subjectTypeHook"
                checked={subjectType === 'users'}
                onChange={() => setSubjectType('users')}
              />
              User
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="radio"
                name="subjectTypeHook"
                checked={subjectType === 'roles'}
                onChange={() => setSubjectType('roles')}
              />
              Role
            </label>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleFetchClaims} disabled={!subjectId || isLoading}>
              Get Claims
            </button>
            <button
              onClick={async () => {
                if (subjectId) {
                  await updateClaims(subjectId, subjectType, subjectClaims)
                }
              }}
              disabled={!subjectId || isLoading}
            >
              Save Claims
            </button>
          </div>
        </div>
        {subjectClaims.length > 0 && (
          <div style={{ marginTop: '0.5rem' }}>
            <p>Claims for {subjectType === 'users' ? 'User' : 'Role'} ({subjectClaims.length}):</p>
            <pre style={{ padding: '0.5rem', borderRadius: '4px', fontSize: '12px', maxHeight: '200px', overflow: 'auto' }}>
              {JSON.stringify(subjectClaims, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="test-card">
        <h3>Hook State</h3>
        <p>isLoading: {isLoading ? 'true' : 'false'}</p>
        <p>error: {error || 'null'}</p>
        <p>claimTypes count: {claimTypes.length}</p>
        <p>totalCount: {totalCount}</p>
        <p>claimTypeNames count: {claimTypeNames.length}</p>
        <p>selectedClaimType: {selectedClaimType ? `${selectedClaimType.name} (${selectedClaimType.id})` : 'none'}</p>
        <p>sortKey: {sortKey}</p>
        <p>sortOrder: {sortOrder || '(empty)'}</p>
      </div>

      {claimTypeNames.length > 0 && (
        <div className="test-card">
          <h3>Claim Type Names ({claimTypeNames.length})</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {claimTypeNames.map((ct: Identity.ClaimTypeName) => (
              <span key={ct.name} style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                {ct.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {claimTypes.length > 0 && (
        <div className="test-card">
          <h3>Claim Types List ({claimTypes.length})</h3>
          <div style={{ maxHeight: '300px', overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Name</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Value Type</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Required</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Static</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {claimTypes.map((claim: Identity.ClaimType) => (
                  <tr key={claim.id} style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '8px' }}>{claim.name}</td>
                    <td style={{ padding: '8px' }}>
                      {claim.valueType === 0 ? 'String' :
                       claim.valueType === 1 ? 'Int' :
                       claim.valueType === 2 ? 'Boolean' : 'DateTime'}
                    </td>
                    <td style={{ padding: '8px' }}>{claim.required ? 'Yes' : 'No'}</td>
                    <td style={{ padding: '8px' }}>{claim.isStatic ? 'Yes' : 'No'}</td>
                    <td style={{ padding: '8px' }}>
                      <button
                        onClick={() => setSelectedClaimType(claim)}
                        style={{ marginRight: '0.5rem', padding: '4px 8px' }}
                      >
                        Select
                      </button>
                      <button
                        onClick={() => {
                          if (claim.id) {
                            setTestClaimId(claim.id)
                            getClaimTypeById(claim.id)
                          }
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
          Clears all claim data and resets to initial state
        </p>
      </div>
    </div>
  )
}

/**
 * Test section for v2.2.0 features: unlockUser, openPermissionsModal
 */
function TestV220Features() {
  const { isAuthenticated } = useAuth()
  const {
    users,
    isLoading: usersLoading,
    visiblePermissions: userVisiblePermissions,
    permissionsProviderKey: userPermissionsProviderKey,
    fetchUsers,
    unlockUser,
    openPermissionsModal: openUserPermissionsModal,
    onVisiblePermissionsChange: onUserVisiblePermissionsChange,
  } = useUsers()

  const {
    roles,
    isLoading: rolesLoading,
    visiblePermissions: roleVisiblePermissions,
    permissionsProviderKey: rolePermissionsProviderKey,
    fetchRoles,
    openPermissionsModal: openRolePermissionsModal,
    onVisiblePermissionsChange: onRoleVisiblePermissionsChange,
  } = useRoles()

  const [unlockUserId, setUnlockUserId] = useState('')
  const [unlockResult, setUnlockResult] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers()
      fetchRoles()
    }
  }, [isAuthenticated, fetchUsers, fetchRoles])

  const handleUnlockUser = async () => {
    if (unlockUserId) {
      const result = await unlockUser(unlockUserId)
      if (result.success) {
        setUnlockResult(`User ${unlockUserId} unlocked successfully!`)
        setUnlockUserId('')
      } else {
        setUnlockResult(`Error: ${result.error}`)
      }
    }
  }

  return (
    <div className="test-section">
      <h2>v2.2.0 Features <span style={{ fontSize: '14px', color: '#4ade80' }}>(NEW)</span></h2>

      {!isAuthenticated ? (
        <div className="test-card">
          <p style={{ color: '#f88' }}>
            You must be authenticated to use these features
          </p>
        </div>
      ) : (
        <>
          <div className="test-card">
            <h3>Unlock User (v2.2.0)</h3>
            <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
              Unlock a locked out user by their ID. Uses <code>PUT /api/identity/users/:id/unlock</code>
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
              <input
                type="text"
                placeholder="Enter User ID to unlock"
                value={unlockUserId}
                onChange={(e) => setUnlockUserId(e.target.value)}
                style={{
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #333',
                  flex: 1,
                }}
              />
              <button
                onClick={handleUnlockUser}
                disabled={!unlockUserId || usersLoading}
              >
                {usersLoading ? 'Unlocking...' : 'Unlock User'}
              </button>
            </div>
            {unlockResult && (
              <p style={{ fontSize: '14px', color: unlockResult.startsWith('Error') ? '#f88' : '#4ade80' }}>
                {unlockResult}
              </p>
            )}
            {users.length > 0 && (
              <div style={{ marginTop: '0.5rem' }}>
                <p style={{ fontSize: '14px', color: '#888' }}>Available users:</p>
                <div style={{ maxHeight: '150px', overflow: 'auto' }}>
                  {users.map((user) => (
                    <div
                      key={user.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '4px 8px',
                        borderBottom: '1px solid #222',
                      }}
                    >
                      <span>
                        {user.userName}
                        {user.isLockedOut && <span style={{ color: '#f88', marginLeft: '8px' }}>(Locked)</span>}
                      </span>
                      <button
                        onClick={() => setUnlockUserId(user.id)}
                        style={{ padding: '2px 8px', fontSize: '12px' }}
                        disabled={!user.isLockedOut}
                      >
                        Select
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="test-card">
            <h3>User Permissions Modal (v2.2.0)</h3>
            <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
              Open permissions modal for a user using <code>openPermissionsModal(providerKey)</code>
            </p>
            <div style={{ marginBottom: '0.5rem' }}>
              <p>visiblePermissions: <code>{userVisiblePermissions ? 'true' : 'false'}</code></p>
              <p>permissionsProviderKey: <code>{userPermissionsProviderKey || '(empty)'}</code></p>
            </div>
            {users.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {users.slice(0, 5).map((user) => (
                  <button
                    key={user.id}
                    onClick={() => openUserPermissionsModal(user.id)}
                    style={{ padding: '4px 8px', fontSize: '12px' }}
                  >
                    {user.userName}
                  </button>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '14px', color: '#888' }}>No users loaded</p>
            )}
            {userVisiblePermissions && (
              <div style={{ marginTop: '0.5rem', padding: '0.5rem', border: '1px solid #4ade80', borderRadius: '4px' }}>
                <p style={{ color: '#4ade80' }}>Permissions modal is open for: {userPermissionsProviderKey}</p>
                <button
                  onClick={() => onUserVisiblePermissionsChange(false)}
                  style={{ marginTop: '0.5rem' }}
                >
                  Close Modal
                </button>
              </div>
            )}
          </div>

          <div className="test-card">
            <h3>Role Permissions Modal (v2.2.0)</h3>
            <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
              Open permissions modal for a role using <code>openPermissionsModal(providerKey)</code>
            </p>
            <div style={{ marginBottom: '0.5rem' }}>
              <p>visiblePermissions: <code>{roleVisiblePermissions ? 'true' : 'false'}</code></p>
              <p>permissionsProviderKey: <code>{rolePermissionsProviderKey || '(empty)'}</code></p>
            </div>
            {roles.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => openRolePermissionsModal(role.id)}
                    style={{ padding: '4px 8px', fontSize: '12px' }}
                  >
                    {role.name}
                  </button>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '14px', color: '#888' }}>
                {rolesLoading ? 'Loading roles...' : 'No roles loaded'}
              </p>
            )}
            {roleVisiblePermissions && (
              <div style={{ marginTop: '0.5rem', padding: '0.5rem', border: '1px solid #4ade80', borderRadius: '4px' }}>
                <p style={{ color: '#4ade80' }}>Permissions modal is open for: {rolePermissionsProviderKey}</p>
                <button
                  onClick={() => onRoleVisiblePermissionsChange(false)}
                  style={{ marginTop: '0.5rem' }}
                >
                  Close Modal
                </button>
              </div>
            )}
          </div>

          <div className="test-card">
            <h3>v2.2.0 API Reference</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Method</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Hook</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '8px' }}><code>unlockUser(id)</code></td>
                  <td style={{ padding: '8px' }}>useUsers</td>
                  <td style={{ padding: '8px' }}>Unlock a locked out user</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '8px' }}><code>openPermissionsModal(providerKey)</code></td>
                  <td style={{ padding: '8px' }}>useUsers</td>
                  <td style={{ padding: '8px' }}>Open permissions modal for a user</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '8px' }}><code>openPermissionsModal(providerKey)</code></td>
                  <td style={{ padding: '8px' }}>useRoles</td>
                  <td style={{ padding: '8px' }}>Open permissions modal for a role</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '8px' }}><code>onVisiblePermissionsChange(value)</code></td>
                  <td style={{ padding: '8px' }}>useUsers, useRoles</td>
                  <td style={{ padding: '8px' }}>Handle permissions modal visibility change</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '8px' }}><code>visiblePermissions</code></td>
                  <td style={{ padding: '8px' }}>useUsers, useRoles</td>
                  <td style={{ padding: '8px' }}>State: whether permissions modal is visible</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px' }}><code>permissionsProviderKey</code></td>
                  <td style={{ padding: '8px' }}>useUsers, useRoles</td>
                  <td style={{ padding: '8px' }}>State: current provider key for permissions</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

function TestProApiEndpoints() {
  return (
    <div className="test-section">
      <h2>Pro API Endpoints</h2>

      <div className="test-card">
        <h3>Claim Type Endpoints</h3>
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
              <td style={{ padding: '8px' }}><code>/api/identity/claim-types</code></td>
              <td>Fetch claim types (paginated)</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>GET</code></td>
              <td style={{ padding: '8px' }}><code>/api/identity/claim-types/all</code></td>
              <td>Fetch all claim type names</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>GET</code></td>
              <td style={{ padding: '8px' }}><code>/api/identity/claim-types/:id</code></td>
              <td>Fetch a specific claim type</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>POST</code></td>
              <td style={{ padding: '8px' }}><code>/api/identity/claim-types</code></td>
              <td>Create a new claim type</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>PUT</code></td>
              <td style={{ padding: '8px' }}><code>/api/identity/claim-types/:id</code></td>
              <td>Update a claim type</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>DELETE</code></td>
              <td style={{ padding: '8px' }}><code>/api/identity/claim-types/:id</code></td>
              <td>Delete a claim type</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>User/Role Claims Endpoints</h3>
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
              <td style={{ padding: '8px' }}><code>/api/identity/users/:id/claims</code></td>
              <td>Get claims for a user</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>PUT</code></td>
              <td style={{ padding: '8px' }}><code>/api/identity/users/:id/claims</code></td>
              <td>Update claims for a user</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>GET</code></td>
              <td style={{ padding: '8px' }}><code>/api/identity/roles/:id/claims</code></td>
              <td>Get claims for a role</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>PUT</code></td>
              <td style={{ padding: '8px' }}><code>/api/identity/roles/:id/claims</code></td>
              <td>Update claims for a role</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>Request/Response Formats</h3>
        <div style={{ marginBottom: '1rem' }}>
          <h4>Create Claim Type Request:</h4>
          <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`{
  "name": "string",
  "required": boolean,
  "isStatic": boolean,
  "regex": "string",
  "regexDescription": "string",
  "description": "string",
  "valueType": 0 | 1 | 2 | 3
}`}
          </pre>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <h4>Claim Request (for user/role claims):</h4>
          <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`{
  "userId": "string",    // for user claims
  "roleId": "string",    // for role claims
  "claimType": "string",
  "claimValue": "string"
}`}
          </pre>
        </div>
        <div>
          <h4>Value Types:</h4>
          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
            <li>0 = String</li>
            <li>1 = Int</li>
            <li>2 = Boolean</li>
            <li>3 = DateTime</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

/**
 * Test section for IdentityStateService (v2.0.0)
 */
function TestIdentityStateServiceSection() {
  const [stateServiceInfo, setStateServiceInfo] = useState<string>('')

  // Type check to verify the type is exported correctly
  const _typeCheck: IdentityStateService | null = null
  void _typeCheck

  const showMethods = () => {
    setStateServiceInfo(`IdentityStateService (v2.0.0)

Getter Methods:
- getRoles(): Identity.RoleItem[]
- getRolesTotalCount(): number
- getUsers(): Identity.UserItem[]
- getUsersTotalCount(): number
- getClaimTypes(): Identity.ClaimType[]
- getClaimTypesTotalCount(): number
- getClaimTypeNames(): Identity.ClaimTypeName[]

Role Dispatch Methods (v2.0.0):
- dispatchGetRoles(params?): Promise<Identity.RoleResponse>
- dispatchGetRoleById(id): Promise<Identity.RoleItem>
- dispatchDeleteRole(id): Promise<Identity.RoleItem>
- dispatchCreateRole(body): Promise<Identity.RoleItem>
- dispatchUpdateRole(id, body): Promise<Identity.RoleItem>

User Dispatch Methods (v2.0.0):
- dispatchGetUsers(params?): Promise<Identity.UserResponse>
- dispatchGetUserById(id): Promise<Identity.UserItem>
- dispatchDeleteUser(id): Promise<void>
- dispatchCreateUser(body): Promise<Identity.UserItem>
- dispatchUpdateUser(id, body): Promise<Identity.UserItem>
- dispatchGetUserRoles(id): Promise<Identity.RoleItem[]>

ClaimType Dispatch Methods (v2.0.0):
- dispatchGetClaimTypes(params?): Promise<Identity.ClaimResponse>
- dispatchGetClaimTypeById(id): Promise<Identity.ClaimType>
- dispatchDeleteClaimType(id): Promise<void>
- dispatchCreateClaimType(body): Promise<Identity.ClaimType>
- dispatchUpdateClaimType(body): Promise<Identity.ClaimType>
- dispatchGetClaimTypeNames(): Promise<Identity.ClaimTypeName[]>

The state service maintains internal state and provides
facade methods for dispatching identity actions.`)
  }

  return (
    <div className="test-section">
      <h2>IdentityStateService <span style={{ fontSize: '14px', color: '#4ade80' }}>(v2.0.0)</span></h2>

      <div className="test-card">
        <h3>State Service Overview</h3>
        <p>
          The <code>IdentityStateService</code> provides a stateful facade over the identity API.
          It maintains internal state for roles, users, and claim types, and provides 17 dispatch methods for CRUD operations.
        </p>
        <button onClick={showMethods}>
          Show All Methods
        </button>
        {stateServiceInfo && (
          <pre style={{ marginTop: '1rem', padding: '1rem', borderRadius: '4px', overflow: 'auto', whiteSpace: 'pre-wrap', fontSize: '12px' }}>
            {stateServiceInfo}
          </pre>
        )}
      </div>

      <div className="test-card">
        <h3>New in v2.0.0: 17 Dispatch Methods</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          The following dispatch methods were added in v2.0.0:
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Category</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Methods</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>Roles</td>
              <td style={{ padding: '8px', fontSize: '12px' }}>
                <code>dispatchGetRoles</code>, <code>dispatchGetRoleById</code>, <code>dispatchDeleteRole</code>, <code>dispatchCreateRole</code>, <code>dispatchUpdateRole</code>
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>Users</td>
              <td style={{ padding: '8px', fontSize: '12px' }}>
                <code>dispatchGetUsers</code>, <code>dispatchGetUserById</code>, <code>dispatchDeleteUser</code>, <code>dispatchCreateUser</code>, <code>dispatchUpdateUser</code>, <code>dispatchGetUserRoles</code>
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>Claim Types</td>
              <td style={{ padding: '8px', fontSize: '12px' }}>
                <code>dispatchGetClaimTypes</code>, <code>dispatchGetClaimTypeById</code>, <code>dispatchDeleteClaimType</code>, <code>dispatchCreateClaimType</code>, <code>dispatchUpdateClaimType</code>, <code>dispatchGetClaimTypeNames</code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>Usage Example</h3>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
{`import { IdentityStateService } from '@abpjs/identity-pro';
import { useRestService } from '@abpjs/core';

function MyComponent() {
  const restService = useRestService();
  const stateService = new IdentityStateService(restService);

  // Dispatch methods update internal state
  await stateService.dispatchGetRoles({ maxResultCount: 10 });

  // Access state via getters
  const roles = stateService.getRoles();
  const totalCount = stateService.getRolesTotalCount();

  // Create a new role (v2.0.0)
  const newRole = await stateService.dispatchCreateRole({
    name: 'NewRole',
    isDefault: false,
    isPublic: true
  });

  // Fetch users
  await stateService.dispatchGetUsers({ filter: 'admin' });
  const users = stateService.getUsers();

  // Manage claim types
  await stateService.dispatchGetClaimTypes();
  const claimTypes = stateService.getClaimTypes();
}`}
        </pre>
      </div>
    </div>
  )
}

function TestProHookMethods() {
  return (
    <div className="test-section">
      <h2>useClaims Hook Methods Reference</h2>

      <div className="test-card">
        <h3>Claim Type Methods</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Method</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: '8px' }}>fetchClaimTypes</td><td>Fetch claim types with optional pagination</td></tr>
            <tr><td style={{ padding: '8px' }}>fetchClaimTypeNames</td><td>Fetch claim type names for dropdowns</td></tr>
            <tr><td style={{ padding: '8px' }}>getClaimTypeById</td><td>Fetch a specific claim type and select it</td></tr>
            <tr><td style={{ padding: '8px' }}>createClaimType</td><td>Create a new claim type</td></tr>
            <tr><td style={{ padding: '8px' }}>updateClaimType</td><td>Update an existing claim type</td></tr>
            <tr><td style={{ padding: '8px' }}>deleteClaimType</td><td>Delete a claim type</td></tr>
            <tr><td style={{ padding: '8px' }}>setSelectedClaimType</td><td>Set the selected claim type</td></tr>
            <tr><td style={{ padding: '8px' }}>setSortKey</td><td>Set sort key for claim types list</td></tr>
            <tr><td style={{ padding: '8px' }}>setSortOrder</td><td>Set sort order</td></tr>
            <tr><td style={{ padding: '8px' }}>reset</td><td>Reset all claim state</td></tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>User/Role Claims Methods</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Method</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: '8px' }}>getClaims(id, type)</td><td>Get claims for a user or role</td></tr>
            <tr><td style={{ padding: '8px' }}>updateClaims(id, type, claims)</td><td>Update claims for a user or role</td></tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>State Properties</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Property</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: '8px' }}>claimTypes</td><td>ClaimType[]</td><td>List of claim types</td></tr>
            <tr><td style={{ padding: '8px' }}>totalCount</td><td>number</td><td>Total count for pagination</td></tr>
            <tr><td style={{ padding: '8px' }}>claimTypeNames</td><td>ClaimTypeName[]</td><td>Simple names for dropdowns</td></tr>
            <tr><td style={{ padding: '8px' }}>selectedClaimType</td><td>ClaimType | null</td><td>Currently selected claim type</td></tr>
            <tr><td style={{ padding: '8px' }}>isLoading</td><td>boolean</td><td>Loading state</td></tr>
            <tr><td style={{ padding: '8px' }}>error</td><td>string | null</td><td>Error message</td></tr>
            <tr><td style={{ padding: '8px' }}>sortKey</td><td>string</td><td>Current sort key</td></tr>
            <tr><td style={{ padding: '8px' }}>sortOrder</td><td>'asc' | 'desc' | ''</td><td>Sort order</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function TestIdentityProPage() {
  return (
    <div>
      <h1>@abpjs/identity-pro Tests (v2.2.0)</h1>
      <p style={{ marginBottom: '8px' }}>Testing identity pro components, hooks, and services for claim type management.</p>
      <p style={{ fontSize: '14px', color: '#888', marginBottom: '16px' }}>
        Version 2.2.0 - Added unlockUser, openPermissionsModal for users and roles
      </p>
      <p style={{ color: '#6f6', fontSize: '14px' }}>
        Pro features: Claim type management, user/role claims, IdentityStateService with 17 dispatch methods, user unlock, permissions modal
      </p>

      <TestV220Features />
      <TestClaimsComponent />
      <TestClaimModal />
      <TestClaimsHook />
      <TestIdentityStateServiceSection />
      <TestProApiEndpoints />
      <TestProHookMethods />
    </div>
  )
}

export default TestIdentityProPage
