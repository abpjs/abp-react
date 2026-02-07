/**
 * Test page for @abpjs/identity-pro package
 * Tests: ClaimsComponent, ClaimModal, useClaims hook, IdentityStateService, and Pro-specific features
 * @since 2.0.0
 * @updated 2.2.0 - Added unlockUser, openPermissionsModal for users and roles
 * @updated 2.4.0 - Added apiName property, getAllRoles method, eIdentityComponents enum
 * @updated 2.7.0 - Added changePassword method, eIdentityRouteNames enum, IdentityComponentKey/IdentityRouteNameKey types
 * @updated 2.9.0 - Added Organization Units support, OrganizationUnitService, TreeAdapter utility
 * @updated 3.0.0 - Added config subpackage, extension tokens, guards, new claim type methods
 * @updated 3.1.0 - Added SecurityLogs, IdentitySecurityLogService, UserLockDurationType, lockUser method
 */
import { useState, useEffect } from 'react'
import { useAuth, useRestService } from '@abpjs/core'
import {
  ClaimsComponent,
  ClaimModal,
  useClaims,
  useUsers,
  useRoles,
  IdentityService,
  OrganizationUnitService,
  TreeAdapter,
  eIdentityComponents,
  eIdentityRouteNames,
  createOrganizationUnitCreateDto,
  createGetOrganizationUnitInput,
  // v3.0.0 - Config enums
  eIdentityPolicyNames,
  eIdentitySettingTabNames,
  // v3.0.0 - Config providers
  IDENTITY_ROUTE_PROVIDERS,
  IDENTITY_SETTING_TAB_PROVIDERS,
  IDENTITY_SETTING_TAB_CONFIG,
  // v3.0.0 - Extension tokens
  DEFAULT_IDENTITY_ENTITY_ACTIONS,
  DEFAULT_IDENTITY_TOOLBAR_ACTIONS,
  DEFAULT_IDENTITY_ENTITY_PROPS,
  DEFAULT_IDENTITY_CREATE_FORM_PROPS,
  DEFAULT_IDENTITY_EDIT_FORM_PROPS,
  IDENTITY_ENTITY_ACTION_CONTRIBUTORS,
  // v3.0.0 - Guards
  identityExtensionsGuard,
  useIdentityExtensionsGuard,
  // v3.1.0 - Security Logs
  IdentitySecurityLogService,
  createIdentitySecurityLogGetListInput,
  DEFAULT_SECURITY_LOGS_ENTITY_PROPS,
  DEFAULT_SECURITY_LOGS_ENTITY_ACTIONS,
  DEFAULT_SECURITY_LOGS_TOOLBAR_ACTIONS,
  // Namespace import (as value, not type) for UserLockDurationType
  Identity,
  type BaseNode,
  type IdentityStateService,
  type IdentityComponentKey,
  type IdentityRouteNameKey,
  type OrganizationUnitWithDetailsDto,
  type IdentitySecurityLogDto,
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
    // v3.0.0: fetchClaimTypeNames replaced with fetchRolesClaimTypes and fetchUsersClaimTypes
    fetchRolesClaimTypes,
    fetchUsersClaimTypes,
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
    // v3.0.0: Using fetchRolesClaimTypes by default
    fetchRolesClaimTypes()
  }, [fetchClaimTypes, fetchRolesClaimTypes])

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
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => fetchClaimTypes()} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Fetch All Claim Types'}
          </button>
          <button onClick={() => fetchRolesClaimTypes()} disabled={isLoading}>
            Fetch Roles Claim Types (v3.0.0)
          </button>
          <button onClick={() => fetchUsersClaimTypes()} disabled={isLoading}>
            Fetch Users Claim Types (v3.0.0)
          </button>
        </div>
        <p style={{ marginTop: '0.5rem', fontSize: '14px', color: '#888' }}>
          v3.0.0: fetchClaimTypeNames replaced with fetchRolesClaimTypes and fetchUsersClaimTypes
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

/**
 * Test section for v2.4.0 features: apiName property, getAllRoles method, eIdentityComponents enum
 */
function TestV240Features() {
  const { isAuthenticated } = useAuth()
  const restService = useRestService()
  const [identityService] = useState(() => new IdentityService(restService))
  const [allRoles, setAllRoles] = useState<Identity.RoleItem[]>([])
  const [isLoadingRoles, setIsLoadingRoles] = useState(false)
  const [rolesError, setRolesError] = useState<string | null>(null)

  const handleGetAllRoles = async () => {
    setIsLoadingRoles(true)
    setRolesError(null)
    try {
      const response = await identityService.getAllRoles()
      setAllRoles(response.items || [])
    } catch (err) {
      setRolesError(err instanceof Error ? err.message : 'Failed to fetch roles')
    } finally {
      setIsLoadingRoles(false)
    }
  }

  return (
    <div className="test-section">
      <h2>v2.4.0 Features <span style={{ fontSize: '14px', color: '#4ade80' }}>(NEW)</span></h2>

      <div className="test-card">
        <h3>apiName Property (v2.4.0)</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          The <code>IdentityService</code> now has an <code>apiName</code> property that defaults to <code>'default'</code>.
          This is used for API routing in multi-API configurations.
        </p>
        <div style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #333' }}>
          <p><strong>IdentityService.apiName:</strong> <code>{identityService.apiName}</code></p>
        </div>
        <pre style={{ marginTop: '0.5rem', padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
{`// Usage
const service = new IdentityService(restService);
console.log(service.apiName); // 'default'`}
        </pre>
      </div>

      <div className="test-card">
        <h3>getAllRoles() Method (v2.4.0)</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          New method to fetch all roles without pagination. Uses <code>GET /api/identity/roles/all</code>
        </p>
        {!isAuthenticated ? (
          <p style={{ color: '#f88' }}>You must be authenticated to test this feature</p>
        ) : (
          <>
            <button onClick={handleGetAllRoles} disabled={isLoadingRoles}>
              {isLoadingRoles ? 'Loading...' : 'Get All Roles'}
            </button>
            {rolesError && (
              <p style={{ color: '#f88', marginTop: '0.5rem' }}>{rolesError}</p>
            )}
            {allRoles.length > 0 && (
              <div style={{ marginTop: '0.5rem' }}>
                <p style={{ fontSize: '14px', color: '#888' }}>All Roles ({allRoles.length}):</p>
                <div style={{ maxHeight: '150px', overflow: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #333' }}>
                        <th style={{ textAlign: 'left', padding: '4px 8px' }}>Name</th>
                        <th style={{ textAlign: 'left', padding: '4px 8px' }}>Default</th>
                        <th style={{ textAlign: 'left', padding: '4px 8px' }}>Public</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allRoles.map((role) => (
                        <tr key={role.id} style={{ borderBottom: '1px solid #222' }}>
                          <td style={{ padding: '4px 8px' }}>{role.name}</td>
                          <td style={{ padding: '4px 8px' }}>{role.isDefault ? 'Yes' : 'No'}</td>
                          <td style={{ padding: '4px 8px' }}>{role.isPublic ? 'Yes' : 'No'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
        <pre style={{ marginTop: '0.5rem', padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
{`// Usage
const response = await identityService.getAllRoles();
console.log(response.items); // All roles without pagination`}
        </pre>
      </div>

      <div className="test-card">
        <h3>eIdentityComponents Enum (v2.4.0)</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          New enum for component identifiers used in component registration and routing.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Key</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>Claims</code></td>
              <td style={{ padding: '8px' }}><code>{eIdentityComponents.Claims}</code></td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>Roles</code></td>
              <td style={{ padding: '8px' }}><code>{eIdentityComponents.Roles}</code></td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>Users</code></td>
              <td style={{ padding: '8px' }}><code>{eIdentityComponents.Users}</code></td>
            </tr>
          </tbody>
        </table>
        <pre style={{ marginTop: '0.5rem', padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
{`// Usage - Component registration
import { eIdentityComponents } from '@abpjs/identity-pro';

const componentRegistry = {};
componentRegistry[eIdentityComponents.Claims] = ClaimsComponent;
componentRegistry[eIdentityComponents.Roles] = RolesComponent;
componentRegistry[eIdentityComponents.Users] = UsersComponent;`}
        </pre>
      </div>

      <div className="test-card">
        <h3>v2.4.0 API Reference</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Feature</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>apiName</code></td>
              <td style={{ padding: '8px' }}>Property</td>
              <td style={{ padding: '8px' }}>API name for multi-API configurations (default: 'default')</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>getAllRoles()</code></td>
              <td style={{ padding: '8px' }}>Method</td>
              <td style={{ padding: '8px' }}>Fetch all roles without pagination</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>eIdentityComponents</code></td>
              <td style={{ padding: '8px' }}>Enum</td>
              <td style={{ padding: '8px' }}>Component identifiers (Claims, Roles, Users)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

/**
 * Test section for v2.7.0 features: eIdentityRouteNames, changePassword, IdentityComponentKey/IdentityRouteNameKey types
 */
function TestV270Features() {
  const { isAuthenticated } = useAuth()
  const restService = useRestService()
  const [identityService] = useState(() => new IdentityService(restService))

  const [changePasswordUserId, setChangePasswordUserId] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [changePasswordResult, setChangePasswordResult] = useState<string | null>(null)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const {
    users,
    fetchUsers,
  } = useUsers()

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers()
    }
  }, [isAuthenticated, fetchUsers])

  const handleChangePassword = async () => {
    if (!changePasswordUserId || !newPassword) return

    setIsChangingPassword(true)
    setChangePasswordResult(null)

    try {
      await identityService.changePassword(changePasswordUserId, { newPassword })
      setChangePasswordResult(`Password changed successfully for user ${changePasswordUserId}!`)
      setNewPassword('')
    } catch (err) {
      setChangePasswordResult(`Error: ${err instanceof Error ? err.message : 'Failed to change password'}`)
    } finally {
      setIsChangingPassword(false)
    }
  }

  // Demo type-safe component lookup with IdentityComponentKey
  const getComponentDisplay = (key: IdentityComponentKey): string => {
    const displays: Record<IdentityComponentKey, string> = {
      'Identity.ClaimsComponent': 'Claims Management',
      'Identity.RolesComponent': 'Roles Management',
      'Identity.UsersComponent': 'Users Management',
      'Identity.OrganizationUnitsComponent': 'Organization Units Management',
      'Identity.OrganizationMembersComponent': 'Organization Members Management',
      'Identity.OrganizationRolesComponent': 'Organization Roles Management',
      'Identity.SecurityLogs': 'Security Logs', // v3.1.0
    }
    return displays[key]
  }

  // Demo type-safe route lookup with IdentityRouteNameKey
  // v3.0.0: Administration was removed from eIdentityRouteNames
  // v3.1.0: SecurityLogs was added
  const getRouteDisplay = (key: IdentityRouteNameKey): string => {
    const displays: Record<IdentityRouteNameKey, string> = {
      'AbpIdentity::Menu:IdentityManagement': 'Identity Management Menu',
      'AbpIdentity::Roles': 'Roles Page',
      'AbpIdentity::Users': 'Users Page',
      'AbpIdentity::ClaimTypes': 'Claim Types Page',
      'AbpIdentity::OrganizationUnits': 'Organization Units Page',
      'AbpIdentity::SecurityLogs': 'Security Logs Page', // v3.1.0
    }
    return displays[key]
  }

  return (
    <div className="test-section">
      <h2>v2.7.0 Features <span style={{ fontSize: '14px', color: '#4ade80' }}>(NEW)</span></h2>

      <div className="test-card">
        <h3>changePassword() Method (v2.7.0)</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          New method to change a user's password. Uses <code>PUT /api/identity/users/:id/change-password</code>
        </p>
        {!isAuthenticated ? (
          <p style={{ color: '#f88' }}>You must be authenticated to test this feature</p>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="text"
                placeholder="Enter User ID"
                value={changePasswordUserId}
                onChange={(e) => setChangePasswordUserId(e.target.value)}
                style={{
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #333',
                }}
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #333',
                }}
              />
              <button
                onClick={handleChangePassword}
                disabled={!changePasswordUserId || !newPassword || isChangingPassword}
              >
                {isChangingPassword ? 'Changing...' : 'Change Password'}
              </button>
            </div>
            {changePasswordResult && (
              <p style={{ fontSize: '14px', color: changePasswordResult.startsWith('Error') ? '#f88' : '#4ade80' }}>
                {changePasswordResult}
              </p>
            )}
            {users.length > 0 && (
              <div style={{ marginTop: '0.5rem' }}>
                <p style={{ fontSize: '14px', color: '#888' }}>Available users:</p>
                <div style={{ maxHeight: '120px', overflow: 'auto' }}>
                  {users.slice(0, 5).map((user) => (
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
                      <span>{user.userName}</span>
                      <button
                        onClick={() => setChangePasswordUserId(user.id)}
                        style={{ padding: '2px 8px', fontSize: '12px' }}
                      >
                        Select
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        <pre style={{ marginTop: '0.5rem', padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
{`// Usage
await identityService.changePassword(userId, {
  newPassword: 'NewSecurePassword123!'
});`}
        </pre>
      </div>

      <div className="test-card">
        <h3>eIdentityRouteNames Enum (v2.7.0)</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          New enum for route name localization keys used in navigation configuration.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Key</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Value</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Display</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(eIdentityRouteNames).map(([key, value]) => (
              <tr key={key} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '8px' }}><code>{key}</code></td>
                <td style={{ padding: '8px', fontSize: '12px' }}><code>{value}</code></td>
                <td style={{ padding: '8px', fontSize: '12px' }}>{getRouteDisplay(value as IdentityRouteNameKey)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <pre style={{ marginTop: '0.5rem', padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
{`// Usage - Navigation configuration
import { eIdentityRouteNames } from '@abpjs/identity-pro';

const routes = [
  { name: eIdentityRouteNames.Roles, path: '/identity/roles' },
  { name: eIdentityRouteNames.Users, path: '/identity/users' },
  { name: eIdentityRouteNames.ClaimTypes, path: '/identity/claim-types' },
];`}
        </pre>
      </div>

      <div className="test-card">
        <h3>Type-Safe Keys (v2.7.0)</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          New TypeScript types for type-safe component and route key usage.
        </p>
        <div style={{ marginBottom: '1rem' }}>
          <h4 style={{ fontSize: '14px', marginBottom: '0.5rem' }}>IdentityComponentKey</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {Object.values(eIdentityComponents).map((key) => (
              <div
                key={key}
                style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: '1px solid #4ade80',
                  fontSize: '12px',
                }}
              >
                {key} = {getComponentDisplay(key as IdentityComponentKey)}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 style={{ fontSize: '14px', marginBottom: '0.5rem' }}>IdentityRouteNameKey</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {Object.values(eIdentityRouteNames).map((key) => (
              <div
                key={key}
                style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: '1px solid #60a5fa',
                  fontSize: '11px',
                }}
              >
                {key.split('::')[1]}
              </div>
            ))}
          </div>
        </div>
        <pre style={{ marginTop: '0.5rem', padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
{`// Usage - Type-safe lookups
import {
  eIdentityComponents,
  eIdentityRouteNames,
  IdentityComponentKey,
  IdentityRouteNameKey,
} from '@abpjs/identity-pro';

// Component key type ensures only valid keys
const key: IdentityComponentKey = eIdentityComponents.Users;
const components: Record<IdentityComponentKey, React.FC> = { ... };

// Route name key type for localization
const routeKey: IdentityRouteNameKey = eIdentityRouteNames.Roles;
const routes: Record<IdentityRouteNameKey, string> = { ... };`}
        </pre>
      </div>

      <div className="test-card">
        <h3>ChangePasswordRequest Interface (v2.7.0)</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          New interface for the change password request body.
        </p>
        <pre style={{ padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
{`interface ChangePasswordRequest {
  /** The new password to set */
  newPassword: string;
}`}
        </pre>
      </div>

      <div className="test-card">
        <h3>v2.7.0 API Reference</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Feature</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>changePassword(id, body)</code></td>
              <td style={{ padding: '8px' }}>Method</td>
              <td style={{ padding: '8px' }}>Change a user's password</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>eIdentityRouteNames</code></td>
              <td style={{ padding: '8px' }}>Const Object</td>
              <td style={{ padding: '8px' }}>Route name localization keys (IdentityManagement, Roles, Users, ClaimTypes, OrganizationUnits) - v3.0.0: Administration removed</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>IdentityComponentKey</code></td>
              <td style={{ padding: '8px' }}>Type</td>
              <td style={{ padding: '8px' }}>Union type of all component key values</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>IdentityRouteNameKey</code></td>
              <td style={{ padding: '8px' }}>Type</td>
              <td style={{ padding: '8px' }}>Union type of all route name key values</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>ChangePasswordRequest</code></td>
              <td style={{ padding: '8px' }}>Interface</td>
              <td style={{ padding: '8px' }}>Request body for changePassword method</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>eIdentityComponents</code></td>
              <td style={{ padding: '8px' }}>Const Object</td>
              <td style={{ padding: '8px' }}>Changed from enum to const object for better tree-shaking</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

/**
 * Test section for v3.0.0 features: Config subpackage, Extension tokens, Guards, Policy names
 */
function TestV300Features() {
  // Test extension guard hook
  const extensionsGuard = useIdentityExtensionsGuard()

  return (
    <div className="test-section">
      <h2>v3.0.0 Features <span style={{ fontSize: '14px', color: '#4ade80' }}>(Config, Tokens, Guards)</span></h2>

      <div className="test-card">
        <h3>Config Subpackage - Enums</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '12px' }}>
          v3.0.0 introduces a config subpackage with policy names, route names, and setting tab names.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Enum</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Values</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>eIdentityPolicyNames</code></td>
              <td style={{ padding: '8px', fontSize: '12px' }}>
                Roles: {eIdentityPolicyNames.Roles}, Users: {eIdentityPolicyNames.Users}, ClaimTypes: {eIdentityPolicyNames.ClaimTypes}
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>eIdentitySettingTabNames</code></td>
              <td style={{ padding: '8px', fontSize: '12px' }}>
                IdentityManagement: {eIdentitySettingTabNames.IdentityManagement}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>Config Subpackage - Providers</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '12px' }}>
          Route and setting tab providers for configuring the identity module.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Provider</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>IDENTITY_ROUTE_PROVIDERS</code></td>
              <td style={{ padding: '8px', color: '#4ade80' }}>
                {IDENTITY_ROUTE_PROVIDERS ? '✓ Available' : '✗ Not found'}
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>IDENTITY_SETTING_TAB_PROVIDERS</code></td>
              <td style={{ padding: '8px', color: '#4ade80' }}>
                {IDENTITY_SETTING_TAB_PROVIDERS ? '✓ Available' : '✗ Not found'}
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>IDENTITY_SETTING_TAB_CONFIG</code></td>
              <td style={{ padding: '8px', color: '#4ade80' }}>
                {IDENTITY_SETTING_TAB_CONFIG ? `✓ Name: ${IDENTITY_SETTING_TAB_CONFIG.name}` : '✗ Not found'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>Extension Tokens</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '12px' }}>
          Default extension tokens for entity actions, toolbar actions, and form props.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Token</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Has Keys</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>DEFAULT_IDENTITY_ENTITY_ACTIONS</code></td>
              <td style={{ padding: '8px', fontSize: '12px' }}>
                Users: {DEFAULT_IDENTITY_ENTITY_ACTIONS['Identity.UsersComponent'] ? '✓' : '✗'},
                Roles: {DEFAULT_IDENTITY_ENTITY_ACTIONS['Identity.RolesComponent'] ? '✓' : '✗'}
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>DEFAULT_IDENTITY_TOOLBAR_ACTIONS</code></td>
              <td style={{ padding: '8px', fontSize: '12px' }}>
                Users: {DEFAULT_IDENTITY_TOOLBAR_ACTIONS['Identity.UsersComponent'] ? '✓' : '✗'},
                Roles: {DEFAULT_IDENTITY_TOOLBAR_ACTIONS['Identity.RolesComponent'] ? '✓' : '✗'}
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>DEFAULT_IDENTITY_ENTITY_PROPS</code></td>
              <td style={{ padding: '8px', fontSize: '12px' }}>
                Users: {DEFAULT_IDENTITY_ENTITY_PROPS['Identity.UsersComponent'] ? '✓' : '✗'},
                Roles: {DEFAULT_IDENTITY_ENTITY_PROPS['Identity.RolesComponent'] ? '✓' : '✗'}
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>DEFAULT_IDENTITY_CREATE_FORM_PROPS</code></td>
              <td style={{ padding: '8px', fontSize: '12px' }}>
                Users: {DEFAULT_IDENTITY_CREATE_FORM_PROPS['Identity.UsersComponent'] ? '✓' : '✗'},
                Roles: {DEFAULT_IDENTITY_CREATE_FORM_PROPS['Identity.RolesComponent'] ? '✓' : '✗'}
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>DEFAULT_IDENTITY_EDIT_FORM_PROPS</code></td>
              <td style={{ padding: '8px', fontSize: '12px' }}>
                Users: {DEFAULT_IDENTITY_EDIT_FORM_PROPS['Identity.UsersComponent'] ? '✓' : '✗'},
                Roles: {DEFAULT_IDENTITY_EDIT_FORM_PROPS['Identity.RolesComponent'] ? '✓' : '✗'}
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>IDENTITY_ENTITY_ACTION_CONTRIBUTORS</code></td>
              <td style={{ padding: '8px', color: '#4ade80' }}>
                {typeof IDENTITY_ENTITY_ACTION_CONTRIBUTORS === 'symbol' ? '✓ Symbol' : '✗ Not a symbol'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>Extensions Guard</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '12px' }}>
          Route guard for identity extensions.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Guard</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>identityExtensionsGuard</code></td>
              <td style={{ padding: '8px', color: '#4ade80' }}>
                {typeof identityExtensionsGuard === 'function' ? '✓ Function' : '✗ Not a function'}
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>useIdentityExtensionsGuard</code></td>
              <td style={{ padding: '8px', fontSize: '12px' }}>
                isLoaded: {extensionsGuard.isLoaded ? '✓' : '✗'}, loading: {extensionsGuard.loading ? 'yes' : 'no'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>v3.0.0 API Changes</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '12px' }}>
          Breaking changes and new methods in v3.0.0.
        </p>
        <div style={{ fontSize: '14px' }}>
          <h4>Removed:</h4>
          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
            <li><code>IdentityService.getClaimTypeNames()</code> - Use <code>getRolesClaimTypes()</code> or <code>getUsersClaimTypes()</code></li>
            <li><code>IdentityStateService.getClaimTypeNames()</code> - Removed</li>
            <li><code>IdentityStateService.dispatchGetClaimTypeNames()</code> - Removed</li>
            <li><code>useClaims.fetchClaimTypeNames()</code> - Use <code>fetchRolesClaimTypes()</code> or <code>fetchUsersClaimTypes()</code></li>
            <li><code>eIdentityRouteNames.Administration</code> - Removed from route names</li>
          </ul>
          <h4 style={{ marginTop: '12px' }}>Added:</h4>
          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
            <li><code>IdentityService.getRolesClaimTypes()</code> - Claim types for role claims</li>
            <li><code>IdentityService.getUsersClaimTypes()</code> - Claim types for user claims</li>
            <li><code>IdentityService.getUserAssingableRoles(id)</code> - Get roles assignable to a user</li>
            <li><code>useClaims.fetchRolesClaimTypes()</code> - Fetch claim types for roles</li>
            <li><code>useClaims.fetchUsersClaimTypes()</code> - Fetch claim types for users</li>
            <li><code>config/</code> subpackage with enums, providers, and models</li>
            <li><code>tokens/</code> subpackage with extension tokens</li>
            <li><code>guards/</code> subpackage with extensions guard</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

/**
 * Test section for v3.1.0 features: SecurityLogs, IdentitySecurityLogService, UserLockDurationType, lockUser
 */
function TestV310Features() {
  const { isAuthenticated } = useAuth()
  const restService = useRestService()
  const [securityLogService] = useState(() => new IdentitySecurityLogService(restService))
  const [identityService] = useState(() => new IdentityService(restService))
  const [securityLogs, setSecurityLogs] = useState<IdentitySecurityLogDto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lockUserId, setLockUserId] = useState('')
  const [lockDuration, setLockDuration] = useState<number>(Identity.UserLockDurationType.Hour)
  const [lockResult, setLockResult] = useState<string | null>(null)

  const fetchSecurityLogs = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = createIdentitySecurityLogGetListInput({ maxResultCount: 10 })
      const result = await securityLogService.getListByInput(params)
      setSecurityLogs(result.items ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch security logs')
    } finally {
      setLoading(false)
    }
  }

  const handleLockUser = async () => {
    if (!lockUserId) return
    setLockResult(null)
    try {
      await identityService.lockUser(lockUserId, lockDuration)
      setLockResult(`User ${lockUserId} locked for ${lockDuration} seconds`)
      setLockUserId('')
    } catch (err) {
      setLockResult(`Error: ${err instanceof Error ? err.message : 'Failed to lock user'}`)
    }
  }

  return (
    <div className="test-section">
      <h2>v3.1.0 Features <span style={{ fontSize: '14px', color: '#4ade80' }}>(Security Logs, User Lock)</span></h2>

      <div className="test-card">
        <h3>Security Logs Component Identifier</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '12px' }}>
          v3.1.0 adds SecurityLogs to components, policy names, and route names.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Enum</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>SecurityLogs Value</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>eIdentityComponents</code></td>
              <td style={{ padding: '8px', color: '#4ade80' }}>{eIdentityComponents.SecurityLogs}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>eIdentityPolicyNames</code></td>
              <td style={{ padding: '8px', color: '#4ade80' }}>{eIdentityPolicyNames.SecurityLogs}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>eIdentityRouteNames</code></td>
              <td style={{ padding: '8px', color: '#4ade80' }}>{eIdentityRouteNames.SecurityLogs}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>UserLockDurationType Enum</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '12px' }}>
          Duration constants for the lockUser method (in seconds).
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Duration</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Seconds</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>Second</code></td>
              <td style={{ padding: '8px' }}>{Identity.UserLockDurationType.Second}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>Minute</code></td>
              <td style={{ padding: '8px' }}>{Identity.UserLockDurationType.Minute}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>Hour</code></td>
              <td style={{ padding: '8px' }}>{Identity.UserLockDurationType.Hour}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>Day</code></td>
              <td style={{ padding: '8px' }}>{Identity.UserLockDurationType.Day}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>Month</code></td>
              <td style={{ padding: '8px' }}>{Identity.UserLockDurationType.Month}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>Year</code></td>
              <td style={{ padding: '8px' }}>{Identity.UserLockDurationType.Year}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>Security Logs Extension Tokens</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '12px' }}>
          Default extension tokens for security logs component.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Token</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>DEFAULT_SECURITY_LOGS_ENTITY_PROPS</code></td>
              <td style={{ padding: '8px', color: '#4ade80' }}>
                {DEFAULT_SECURITY_LOGS_ENTITY_PROPS.length} props defined
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>DEFAULT_SECURITY_LOGS_ENTITY_ACTIONS</code></td>
              <td style={{ padding: '8px', color: '#4ade80' }}>
                {DEFAULT_SECURITY_LOGS_ENTITY_ACTIONS.length} actions (read-only)
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>DEFAULT_SECURITY_LOGS_TOOLBAR_ACTIONS</code></td>
              <td style={{ padding: '8px', color: '#4ade80' }}>
                {DEFAULT_SECURITY_LOGS_TOOLBAR_ACTIONS.length} actions (read-only)
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {isAuthenticated && (
        <>
          <div className="test-card">
            <h3>IdentitySecurityLogService</h3>
            <p style={{ fontSize: '14px', color: '#888', marginBottom: '12px' }}>
              Service for querying security logs (login events, logout, password changes, etc.)
            </p>
            <button
              onClick={fetchSecurityLogs}
              disabled={loading}
              style={{ padding: '8px 16px', marginBottom: '12px' }}
            >
              {loading ? 'Loading...' : 'Fetch Security Logs'}
            </button>
            {error && <p style={{ color: '#f88' }}>{error}</p>}
            {securityLogs.length > 0 && (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #333' }}>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Time</th>
                    <th style={{ textAlign: 'left', padding: '8px' }}>Action</th>
                    <th style={{ textAlign: 'left', padding: '8px' }}>User</th>
                    <th style={{ textAlign: 'left', padding: '8px' }}>IP</th>
                  </tr>
                </thead>
                <tbody>
                  {securityLogs.slice(0, 5).map((log) => (
                    <tr key={log.id} style={{ borderBottom: '1px solid #222' }}>
                      <td style={{ padding: '8px' }}>{new Date(log.creationTime).toLocaleString()}</td>
                      <td style={{ padding: '8px' }}>{log.action || '-'}</td>
                      <td style={{ padding: '8px' }}>{log.userName || '-'}</td>
                      <td style={{ padding: '8px' }}>{log.clientIpAddress || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="test-card">
            <h3>Lock User (v3.1.0)</h3>
            <p style={{ fontSize: '14px', color: '#888', marginBottom: '12px' }}>
              Lock a user for a specified duration using UserLockDurationType.
            </p>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="User ID"
                value={lockUserId}
                onChange={(e) => setLockUserId(e.target.value)}
                style={{ padding: '8px', width: '200px' }}
              />
              <select
                value={lockDuration}
                onChange={(e) => setLockDuration(Number(e.target.value))}
                style={{ padding: '8px' }}
              >
                <option value={Identity.UserLockDurationType.Minute}>1 Minute</option>
                <option value={Identity.UserLockDurationType.Hour}>1 Hour</option>
                <option value={Identity.UserLockDurationType.Day}>1 Day</option>
                <option value={Identity.UserLockDurationType.Month}>1 Month</option>
              </select>
              <button
                onClick={handleLockUser}
                disabled={!lockUserId}
                style={{ padding: '8px 16px' }}
              >
                Lock User
              </button>
            </div>
            {lockResult && (
              <p style={{ color: lockResult.startsWith('Error') ? '#f88' : '#4ade80' }}>
                {lockResult}
              </p>
            )}
          </div>
        </>
      )}

      <div className="test-card">
        <h3>v3.1.0 API Methods</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Service</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Method</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>IdentitySecurityLogService</code></td>
              <td style={{ padding: '8px' }}><code>getListByInput(params)</code></td>
              <td style={{ padding: '8px' }}>Get paginated security logs</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>IdentitySecurityLogService</code></td>
              <td style={{ padding: '8px' }}><code>getById(id)</code></td>
              <td style={{ padding: '8px' }}>Get single security log</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>IdentitySecurityLogService</code></td>
              <td style={{ padding: '8px' }}><code>getMyListByInput(params)</code></td>
              <td style={{ padding: '8px' }}>Get current user's security logs</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>IdentitySecurityLogService</code></td>
              <td style={{ padding: '8px' }}><code>getMyById(id)</code></td>
              <td style={{ padding: '8px' }}>Get current user's security log</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>IdentityService</code></td>
              <td style={{ padding: '8px' }}><code>getUserAvailableOrganizationUnits()</code></td>
              <td style={{ padding: '8px' }}>Get available org units for user assignment</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>IdentityService</code></td>
              <td style={{ padding: '8px' }}><code>lockUser(id, seconds)</code></td>
              <td style={{ padding: '8px' }}>Lock user for specified duration</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

/**
 * Test section for v2.9.0 features: Organization Units, OrganizationUnitService, TreeAdapter
 */
function TestV290Features() {
  const { isAuthenticated } = useAuth()
  const restService = useRestService()
  const [orgUnitService] = useState(() => new OrganizationUnitService(restService))
  const [identityService] = useState(() => new IdentityService(restService))

  const [orgUnits, setOrgUnits] = useState<OrganizationUnitWithDetailsDto[]>([])
  const [isLoadingOrgUnits, setIsLoadingOrgUnits] = useState(false)
  const [orgUnitsError, setOrgUnitsError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)

  // Create org unit state
  const [newOrgUnitName, setNewOrgUnitName] = useState('')
  const [newOrgUnitParentId, setNewOrgUnitParentId] = useState('')
  const [createResult, setCreateResult] = useState<string | null>(null)

  // User organization units state
  const [userId, setUserId] = useState('')
  const [userOrgUnits, setUserOrgUnits] = useState<OrganizationUnitWithDetailsDto[]>([])

  // TreeAdapter demo
  const [treeAdapterDemo, setTreeAdapterDemo] = useState<string>('')

  const {
    users,
    fetchUsers,
  } = useUsers()

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers()
    }
  }, [isAuthenticated, fetchUsers])

  const handleFetchOrgUnits = async () => {
    setIsLoadingOrgUnits(true)
    setOrgUnitsError(null)
    try {
      const input = createGetOrganizationUnitInput({
        maxResultCount: 50,
      })
      const response = await orgUnitService.getListByInput(input)
      setOrgUnits(response.items || [])
      setTotalCount(response.totalCount || 0)
    } catch (err) {
      setOrgUnitsError(err instanceof Error ? err.message : 'Failed to fetch organization units')
    } finally {
      setIsLoadingOrgUnits(false)
    }
  }

  const handleCreateOrgUnit = async () => {
    if (!newOrgUnitName) return

    setCreateResult(null)
    try {
      const createDto = createOrganizationUnitCreateDto({
        displayName: newOrgUnitName,
        parentId: newOrgUnitParentId || undefined,
      })
      const result = await orgUnitService.createByInput(createDto)
      setCreateResult(`Created organization unit: ${result.displayName} (ID: ${result.id})`)
      setNewOrgUnitName('')
      setNewOrgUnitParentId('')
      // Refresh list
      handleFetchOrgUnits()
    } catch (err) {
      setCreateResult(`Error: ${err instanceof Error ? err.message : 'Failed to create organization unit'}`)
    }
  }

  const handleGetUserOrgUnits = async () => {
    if (!userId) return

    try {
      const response = await identityService.getUserOrganizationUnits(userId)
      // getUserOrganizationUnits returns OrganizationUnitWithDetailsDto[] directly
      setUserOrgUnits(response || [])
    } catch (err) {
      console.error('Failed to fetch user organization units:', err)
    }
  }

  const handleTreeAdapterDemo = () => {
    // Create sample hierarchical data that conforms to BaseNode
    // BaseNode requires parentId: string | null, so we use null for root nodes
    const sampleData: BaseNode[] = [
      {
        id: 'unit-1',
        displayName: 'Company',
        parentId: null,
      },
      {
        id: 'unit-2',
        displayName: 'Engineering',
        parentId: 'unit-1',
      },
      {
        id: 'unit-3',
        displayName: 'Marketing',
        parentId: 'unit-1',
      },
      {
        id: 'unit-4',
        displayName: 'Frontend Team',
        parentId: 'unit-2',
      },
      {
        id: 'unit-5',
        displayName: 'Backend Team',
        parentId: 'unit-2',
      },
    ]

    // TreeAdapter constructor takes (list: T[], nameResolver?)
    const adapter = new TreeAdapter(sampleData)

    // Use the actual TreeAdapter API
    const tree = adapter.getTree()
    const flatList = adapter.getList()
    const rootNodes = tree // getTree() returns root nodes

    setTreeAdapterDemo(`TreeAdapter Demo Results:

Input Data: ${sampleData.length} flat items
- Company (root)
  - Engineering
    - Frontend Team
    - Backend Team
  - Marketing

Tree Structure: ${tree.length} root nodes
Original List: ${flatList.length} items
Root Nodes: ${rootNodes.map(n => n.title).join(', ')}

TreeAdapter Methods:
- constructor(list, nameResolver): Create adapter with data
- setList(items): Update the data and rebuild tree
- getTree(): Get root TreeNodes (tree structure)
- getList(): Get original flat list
- getNodeById(id): Find node by ID
- expandAll() / collapseAll(): Expand/collapse all nodes
- getPathToNode(id): Get ancestors from root to node`)
  }

  return (
    <div className="test-section">
      <h2>v2.9.0 Features <span style={{ fontSize: '14px', color: '#4ade80' }}>(NEW)</span></h2>

      <div className="test-card">
        <h3>OrganizationUnitService (v2.9.0)</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          New service for managing organization units. Uses <code>/api/identity/organization-units</code> endpoints.
        </p>
        {!isAuthenticated ? (
          <p style={{ color: '#f88' }}>You must be authenticated to test this feature</p>
        ) : (
          <>
            <div style={{ marginBottom: '1rem' }}>
              <button onClick={handleFetchOrgUnits} disabled={isLoadingOrgUnits}>
                {isLoadingOrgUnits ? 'Loading...' : 'Fetch Organization Units'}
              </button>
            </div>
            {orgUnitsError && (
              <p style={{ color: '#f88', marginTop: '0.5rem' }}>{orgUnitsError}</p>
            )}
            {orgUnits.length > 0 && (
              <div style={{ marginTop: '0.5rem' }}>
                <p style={{ fontSize: '14px', color: '#888' }}>Organization Units ({totalCount} total):</p>
                <div style={{ maxHeight: '200px', overflow: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #333' }}>
                        <th style={{ textAlign: 'left', padding: '4px 8px' }}>Display Name</th>
                        <th style={{ textAlign: 'left', padding: '4px 8px' }}>Code</th>
                        <th style={{ textAlign: 'left', padding: '4px 8px' }}>Parent ID</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orgUnits.map((unit) => (
                        <tr key={unit.id} style={{ borderBottom: '1px solid #222' }}>
                          <td style={{ padding: '4px 8px' }}>{unit.displayName}</td>
                          <td style={{ padding: '4px 8px', fontFamily: 'monospace' }}>{unit.code}</td>
                          <td style={{ padding: '4px 8px', fontSize: '11px' }}>{unit.parentId || '(root)'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
        <pre style={{ marginTop: '0.5rem', padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
{`// Usage
const service = new OrganizationUnitService(restService);
const response = await service.getListByInput({ maxResultCount: 50 });
console.log(response.items); // Organization units`}
        </pre>
      </div>

      <div className="test-card">
        <h3>Create Organization Unit (v2.9.0)</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          Create a new organization unit. Uses <code>POST /api/identity/organization-units</code>
        </p>
        {!isAuthenticated ? (
          <p style={{ color: '#f88' }}>You must be authenticated to test this feature</p>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="text"
                placeholder="Display Name"
                value={newOrgUnitName}
                onChange={(e) => setNewOrgUnitName(e.target.value)}
                style={{
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #333',
                }}
              />
              <input
                type="text"
                placeholder="Parent ID (optional for root unit)"
                value={newOrgUnitParentId}
                onChange={(e) => setNewOrgUnitParentId(e.target.value)}
                style={{
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #333',
                }}
              />
              <button
                onClick={handleCreateOrgUnit}
                disabled={!newOrgUnitName}
              >
                Create Organization Unit
              </button>
            </div>
            {createResult && (
              <p style={{ fontSize: '14px', color: createResult.startsWith('Error') ? '#f88' : '#4ade80' }}>
                {createResult}
              </p>
            )}
          </>
        )}
      </div>

      <div className="test-card">
        <h3>getUserOrganizationUnits (v2.9.0)</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          Get organization units for a user. Uses <code>GET /api/identity/users/:id/organization-units</code>
        </p>
        {!isAuthenticated ? (
          <p style={{ color: '#f88' }}>You must be authenticated to test this feature</p>
        ) : (
          <>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input
                type="text"
                placeholder="User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                style={{
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #333',
                  flex: 1,
                }}
              />
              <button onClick={handleGetUserOrgUnits} disabled={!userId}>
                Get User Org Units
              </button>
            </div>
            {users.length > 0 && (
              <div style={{ marginBottom: '0.5rem' }}>
                <p style={{ fontSize: '12px', color: '#888' }}>Available users:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                  {users.slice(0, 5).map((user) => (
                    <button
                      key={user.id}
                      onClick={() => setUserId(user.id)}
                      style={{ padding: '2px 6px', fontSize: '11px' }}
                    >
                      {user.userName}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {userOrgUnits.length > 0 && (
              <div style={{ marginTop: '0.5rem' }}>
                <p style={{ fontSize: '14px', color: '#888' }}>User's Organization Units:</p>
                <ul style={{ margin: '0.25rem 0', paddingLeft: '1.5rem' }}>
                  {userOrgUnits.map((unit) => (
                    <li key={unit.id}>{unit.displayName} ({unit.code})</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>

      <div className="test-card">
        <h3>TreeAdapter Utility (v2.9.0)</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          Utility class for converting flat arrays to tree structures and vice versa.
        </p>
        <button onClick={handleTreeAdapterDemo}>
          Run TreeAdapter Demo
        </button>
        {treeAdapterDemo && (
          <pre style={{ marginTop: '0.5rem', padding: '0.5rem', borderRadius: '4px', fontSize: '12px', whiteSpace: 'pre-wrap' }}>
            {treeAdapterDemo}
          </pre>
        )}
        <pre style={{ marginTop: '0.5rem', padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
{`// Usage
import { TreeAdapter } from '@abpjs/identity-pro';

const adapter = new TreeAdapter<OrgUnit>({
  getKey: (node) => node.id,
  getParentKey: (node) => node.parentId,
  getChildren: (node) => node.children || [],
  setChildren: (node, children) => ({ ...node, children }),
});

// Convert flat array to tree
const tree = adapter.toTree(flatItems);

// Convert tree back to flat array
const flat = adapter.flattenTree(tree);

// Find a specific node
const node = adapter.findNode(tree, 'unit-1');

// Get ancestors/descendants
const ancestors = adapter.getAncestors(items, 'unit-5');
const descendants = adapter.getDescendants(items, 'unit-1');`}
        </pre>
      </div>

      <div className="test-card">
        <h3>New eIdentityComponents (v2.9.0)</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          New component identifiers added for Organization Units.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Key</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>OrganizationUnits</code></td>
              <td style={{ padding: '8px' }}><code>{eIdentityComponents.OrganizationUnits}</code></td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>OrganizationMembers</code></td>
              <td style={{ padding: '8px' }}><code>{eIdentityComponents.OrganizationMembers}</code></td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>OrganizationRoles</code></td>
              <td style={{ padding: '8px' }}><code>{eIdentityComponents.OrganizationRoles}</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>New eIdentityRouteNames (v2.9.0)</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          New route name added for Organization Units.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Key</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>OrganizationUnits</code></td>
              <td style={{ padding: '8px' }}><code>{eIdentityRouteNames.OrganizationUnits}</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>Identity.State with organizationUnits (v2.9.0)</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          The <code>Identity.State</code> interface now includes <code>organizationUnits</code> property.
        </p>
        <pre style={{ padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
{`interface State {
  roles: PagedResultDto<RoleItem>;
  users: PagedResultDto<UserItem>;
  selectedRole: RoleItem;
  selectedUser: UserItem;
  selectedUserRoles: RoleItem[];
  claimTypes: ClaimType[];
  claims: PagedResultDto<ClaimType>;
  selectedClaim: ClaimType;
  organizationUnits: PagedResultDto<OrganizationUnitWithDetailsDto>; // v2.9.0
}`}
        </pre>
      </div>

      <div className="test-card">
        <h3>UserSaveRequest with organizationUnitIds (v2.9.0)</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          The <code>UserSaveRequest</code> interface now includes <code>organizationUnitIds</code> property.
        </p>
        <pre style={{ padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
{`interface UserSaveRequest {
  userName: string;
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  twoFactorEnabled: boolean;
  lockoutEnabled: boolean;
  password: string;
  roleNames: string[];
  organizationUnitIds: string[]; // v2.9.0
}`}
        </pre>
      </div>

      <div className="test-card">
        <h3>v2.9.0 API Reference</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Feature</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>OrganizationUnitService</code></td>
              <td style={{ padding: '8px' }}>Service</td>
              <td style={{ padding: '8px' }}>Full CRUD operations for organization units</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>TreeAdapter</code></td>
              <td style={{ padding: '8px' }}>Utility</td>
              <td style={{ padding: '8px' }}>Convert flat arrays to/from tree structures</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>getUserOrganizationUnits(id)</code></td>
              <td style={{ padding: '8px' }}>Method</td>
              <td style={{ padding: '8px' }}>Get organization units for a user</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>eIdentityComponents.OrganizationUnits</code></td>
              <td style={{ padding: '8px' }}>Const</td>
              <td style={{ padding: '8px' }}>Organization Units component identifier</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>eIdentityComponents.OrganizationMembers</code></td>
              <td style={{ padding: '8px' }}>Const</td>
              <td style={{ padding: '8px' }}>Organization Members component identifier</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>eIdentityComponents.OrganizationRoles</code></td>
              <td style={{ padding: '8px' }}>Const</td>
              <td style={{ padding: '8px' }}>Organization Roles component identifier</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>eIdentityRouteNames.OrganizationUnits</code></td>
              <td style={{ padding: '8px' }}>Const</td>
              <td style={{ padding: '8px' }}>Organization Units route name</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>Identity.State.organizationUnits</code></td>
              <td style={{ padding: '8px' }}>Property</td>
              <td style={{ padding: '8px' }}>Organization units in state</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>UserSaveRequest.organizationUnitIds</code></td>
              <td style={{ padding: '8px' }}>Property</td>
              <td style={{ padding: '8px' }}>Organization unit IDs for user creation/update</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>OrganizationUnitService Methods</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Method</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>getListByInput(input?)</code></td>
              <td style={{ padding: '8px' }}>Get paginated list of organization units</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>getById(id)</code></td>
              <td style={{ padding: '8px' }}>Get organization unit by ID</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>createByInput(input)</code></td>
              <td style={{ padding: '8px' }}>Create a new organization unit</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>updateByIdAndInput(input, id)</code></td>
              <td style={{ padding: '8px' }}>Update an organization unit</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>deleteById(id)</code></td>
              <td style={{ padding: '8px' }}>Delete an organization unit</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>moveByIdAndInput(input, id)</code></td>
              <td style={{ padding: '8px' }}>Move an organization unit to a new parent</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>getRolesById(params, id)</code></td>
              <td style={{ padding: '8px' }}>Get roles for an organization unit</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>getMembersById(params, id)</code></td>
              <td style={{ padding: '8px' }}>Get members for an organization unit</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>addRolesByIdAndInput(input, id)</code></td>
              <td style={{ padding: '8px' }}>Add roles to an organization unit</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>addMembersByIdAndInput(input, id)</code></td>
              <td style={{ padding: '8px' }}>Add members to an organization unit</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>removeRoleByIdAndRoleId(id, roleId)</code></td>
              <td style={{ padding: '8px' }}>Remove a role from an organization unit</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>removeMemberByIdAndMemberId(id, memberId)</code></td>
              <td style={{ padding: '8px' }}>Remove a member from an organization unit</td>
            </tr>
          </tbody>
        </table>
      </div>
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
(v3.0.0: getClaimTypeNames removed - use IdentityService.getRolesClaimTypes/getUsersClaimTypes instead)

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
(v3.0.0: dispatchGetClaimTypeNames removed - use IdentityService.getRolesClaimTypes/getUsersClaimTypes)

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
                <code>dispatchGetClaimTypes</code>, <code>dispatchGetClaimTypeById</code>, <code>dispatchDeleteClaimType</code>, <code>dispatchCreateClaimType</code>, <code>dispatchUpdateClaimType</code> (v3.0.0: dispatchGetClaimTypeNames removed)
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
            <tr><td style={{ padding: '8px' }}>fetchRolesClaimTypes</td><td>Fetch claim type names for role claims (v3.0.0)</td></tr>
            <tr><td style={{ padding: '8px' }}>fetchUsersClaimTypes</td><td>Fetch claim type names for user claims (v3.0.0)</td></tr>
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
      <h1>@abpjs/identity-pro Tests (v3.1.0)</h1>
      <p style={{ marginBottom: '8px' }}>Testing identity pro components, hooks, and services for claim type management.</p>
      <p style={{ fontSize: '14px', color: '#888', marginBottom: '16px' }}>
        Version 3.1.0 - Added SecurityLogs, IdentitySecurityLogService, UserLockDurationType, lockUser method
      </p>
      <p style={{ color: '#6f6', fontSize: '14px' }}>
        Pro features: Claim type management, user/role claims, IdentityStateService, user unlock, permissions modal, getAllRoles, component identifiers, route names, change password, organization units, config/extensions, security logs, user lock
      </p>

      <TestV310Features />
      <TestV300Features />
      <TestV290Features />
      <TestV270Features />
      <TestV240Features />
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
