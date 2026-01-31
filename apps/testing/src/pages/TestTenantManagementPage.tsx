/**
 * Test page for @abpjs/tenant-management package
 * Tests: TenantManagementModal, useTenantManagement hook
 */
import { useState, useEffect } from 'react'
import { useAuth } from '@abpjs/core'
import {
  TenantManagementModal,
  useTenantManagement,
  getTenantManagementStateService,
  type TenantManagement,
  TENANT_MANAGEMENT_ROUTES,
  TENANT_MANAGEMENT_ROUTE_PATHS,
  TENANT_MANAGEMENT_POLICIES,
} from '@abpjs/tenant-management'
import { FeatureManagementModal } from '@abpjs/feature-management'

function TestTenantModal() {
  const [modalVisible, setModalVisible] = useState(false)
  const [featureModalVisible, setFeatureModalVisible] = useState(false)
  const [editTenantId, setEditTenantId] = useState<string | undefined>()
  const [featureTenantId, setFeatureTenantId] = useState('')
  const [initialView, setInitialView] = useState<'tenant' | 'connectionString'>('tenant')
  const { isAuthenticated } = useAuth()

  return (
    <div className="test-section">
      <h2>TenantManagementModal Component</h2>

      <div className="test-card">
        <h3>Create New Tenant</h3>
        <p>Open the modal to create a new tenant:</p>
        <button
          onClick={() => {
            setEditTenantId(undefined)
            setInitialView('tenant')
            setModalVisible(true)
          }}
          disabled={!isAuthenticated}
        >
          Create New Tenant
        </button>
      </div>

      <div className="test-card">
        <h3>Edit Tenant</h3>
        <p>Open the modal to edit an existing tenant. Enter a tenant ID:</p>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Enter Tenant ID"
            value={editTenantId || ''}
            onChange={(e) => setEditTenantId(e.target.value || undefined)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333',
              flex: 1
            }}
          />
          <button
            onClick={() => {
              setInitialView('tenant')
              setModalVisible(true)
            }}
            disabled={!editTenantId || !isAuthenticated}
          >
            Edit Tenant
          </button>
        </div>
      </div>

      <div className="test-card">
        <h3>Manage Connection String</h3>
        <p>Open the modal to manage connection string for a tenant:</p>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Enter Tenant ID"
            value={editTenantId || ''}
            onChange={(e) => setEditTenantId(e.target.value || undefined)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333',
              flex: 1
            }}
          />
          <button
            onClick={() => {
              setInitialView('connectionString')
              setModalVisible(true)
            }}
            disabled={!editTenantId || !isAuthenticated}
          >
            Manage Connection String
          </button>
        </div>
      </div>

      <div className="test-card">
        <h3>Manage Tenant Features</h3>
        <p>Open the feature management modal for a tenant (providerName="T"):</p>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Enter Tenant ID"
            value={featureTenantId}
            onChange={(e) => setFeatureTenantId(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333',
              flex: 1
            }}
          />
          <button
            onClick={() => setFeatureModalVisible(true)}
            disabled={!featureTenantId || !isAuthenticated}
          >
            Manage Features
          </button>
        </div>
        <p style={{ fontSize: '12px', color: '#888' }}>
          Uses @abpjs/feature-management FeatureManagementModal component
        </p>
      </div>

      <div className="test-card">
        <h3>Modal State</h3>
        <p>Tenant Modal Visible: {modalVisible ? 'true' : 'false'}</p>
        <p>Feature Modal Visible: {featureModalVisible ? 'true' : 'false'}</p>
        <p>Edit Tenant ID: {editTenantId || 'none (creating new)'}</p>
        <p>Feature Tenant ID: {featureTenantId || 'none'}</p>
        <p>Initial View: {initialView}</p>
        {!isAuthenticated && (
          <p style={{ color: '#f88', marginTop: '0.5rem' }}>
            ⚠️ You must be authenticated to use tenant management features
          </p>
        )}
      </div>

      <TenantManagementModal
        visible={modalVisible}
        onVisibleChange={setModalVisible}
        tenantId={editTenantId}
        initialView={initialView}
        onSave={() => {
          console.log('Tenant saved successfully!')
          setModalVisible(false)
        }}
      />

      <FeatureManagementModal
        providerName="T"
        providerKey={featureTenantId}
        visible={featureModalVisible}
        onVisibleChange={setFeatureModalVisible}
        onSave={() => {
          console.log('Tenant features saved successfully!')
        }}
      />
    </div>
  )
}

function TestTenantHook() {
  const { isAuthenticated } = useAuth()
  const {
    tenants,
    totalCount,
    selectedTenant,
    isLoading,
    error,
    defaultConnectionString,
    useSharedDatabase,
    sortKey,
    sortOrder,
    isDisabledSaveButton,
    fetchTenants,
    fetchTenantById,
    createTenant,
    updateTenant,
    deleteTenant,
    fetchConnectionString,
    updateConnectionString,
    deleteConnectionString,
    setSelectedTenant,
    setDefaultConnectionString,
    setSortKey,
    setSortOrder,
    onSharedDatabaseChange,
    reset,
  } = useTenantManagement()

  const [testTenantId, setTestTenantId] = useState('')
  const [testTenantName, setTestTenantName] = useState('')
  const [testConnectionString, setTestConnectionString] = useState('')
  const [featureModalVisible, setFeatureModalVisible] = useState(false)
  const [featureTenantId, setFeatureTenantId] = useState('')

  // Fetch tenants on mount (only if authenticated)
  useEffect(() => {
    if (isAuthenticated) {
      fetchTenants()
    }
  }, [fetchTenants, isAuthenticated])

  return (
    <div className="test-section">
      <h2>useTenantManagement Hook</h2>

      <div className="test-card">
        <h3>Fetch Tenants</h3>
        <button onClick={() => fetchTenants()} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Fetch All Tenants'}
        </button>
        <p style={{ marginTop: '0.5rem', fontSize: '14px', color: '#888' }}>
          Fetches all tenants from the server
        </p>
      </div>

      <div className="test-card">
        <h3>Fetch Tenant by ID</h3>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
          <input
            type="text"
            placeholder="Enter Tenant ID"
            value={testTenantId}
            onChange={(e) => setTestTenantId(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333',
              flex: 1
            }}
          />
          <button
            onClick={() => {
              if (testTenantId) {
                fetchTenantById(testTenantId)
              }
            }}
            disabled={!testTenantId || isLoading}
          >
            Fetch Tenant
          </button>
        </div>
      </div>

      <div className="test-card">
        <h3>Create Tenant</h3>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
          <input
            type="text"
            placeholder="Tenant Name"
            value={testTenantName}
            onChange={(e) => setTestTenantName(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333',
              flex: 1
            }}
          />
          <button
            onClick={async () => {
              if (testTenantName) {
                const result = await createTenant({ name: testTenantName })
                if (result.success) {
                  setTestTenantName('')
                  fetchTenants() // Refresh list
                }
              }
            }}
            disabled={!testTenantName || isLoading}
          >
            Create Tenant
          </button>
        </div>
      </div>

      <div className="test-card">
        <h3>Update Tenant</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <input
            type="text"
            placeholder="Tenant ID"
            value={testTenantId}
            onChange={(e) => setTestTenantId(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333'
            }}
          />
          <input
            type="text"
            placeholder="New Tenant Name"
            value={testTenantName}
            onChange={(e) => setTestTenantName(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333'
            }}
          />
          <button
            onClick={async () => {
              if (testTenantId && testTenantName) {
                const result = await updateTenant({ id: testTenantId, name: testTenantName })
                if (result.success) {
                  setTestTenantId('')
                  setTestTenantName('')
                  fetchTenants() // Refresh list
                }
              }
            }}
            disabled={!testTenantId || !testTenantName || isLoading}
          >
            Update Tenant
          </button>
        </div>
      </div>

      <div className="test-card">
        <h3>Delete Tenant</h3>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
          <input
            type="text"
            placeholder="Enter Tenant ID"
            value={testTenantId}
            onChange={(e) => setTestTenantId(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333',
              flex: 1
            }}
          />
          <button
            onClick={async () => {
              if (testTenantId && window.confirm(`Are you sure you want to delete tenant ${testTenantId}?`)) {
                const result = await deleteTenant(testTenantId)
                if (result.success) {
                  setTestTenantId('')
                  fetchTenants() // Refresh list
                }
              }
            }}
            disabled={!testTenantId || isLoading}
            style={{ background: '#f44', color: 'white' }}
          >
            Delete Tenant
          </button>
        </div>
      </div>

      <div className="test-card">
        <h3>Connection String Management</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <input
            type="text"
            placeholder="Tenant ID"
            value={testTenantId}
            onChange={(e) => setTestTenantId(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333'
            }}
          />
          <input
            type="text"
            placeholder="Connection String"
            value={testConnectionString}
            onChange={(e) => setTestConnectionString(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333'
            }}
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={async () => {
                if (testTenantId) {
                  await fetchConnectionString(testTenantId)
                }
              }}
              disabled={!testTenantId || isLoading}
            >
              Fetch Connection String
            </button>
            <button
              onClick={async () => {
                if (testTenantId && testConnectionString) {
                  const result = await updateConnectionString(testTenantId, testConnectionString)
                  if (result.success) {
                    setTestConnectionString('')
                  }
                }
              }}
              disabled={!testTenantId || !testConnectionString || isLoading}
            >
              Update Connection String
            </button>
            <button
              onClick={async () => {
                if (testTenantId) {
                  const result = await deleteConnectionString(testTenantId)
                  if (result.success) {
                    setTestConnectionString('')
                  }
                }
              }}
              disabled={!testTenantId || isLoading}
            >
              Delete Connection String (Use Shared DB)
            </button>
          </div>
        </div>
      </div>

      <div className="test-card">
        <h3>Sorting (v1.0.0)</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <label style={{ marginRight: '0.5rem' }}>Sort Key:</label>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #333' }}
            >
              <option value="name">Name</option>
              <option value="id">ID</option>
              <option value="createdAt">Created At</option>
            </select>
          </div>
          <div>
            <label style={{ marginRight: '0.5rem' }}>Sort Order:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc' | '')}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #333' }}
            >
              <option value="">None</option>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
        <p style={{ fontSize: '14px', color: '#888' }}>
          Current: sortKey="{sortKey}", sortOrder="{sortOrder || '(empty)'}"
        </p>
      </div>

      <div className="test-card" style={{ background: 'rgba(100,108,255,0.05)', border: '1px solid rgba(100,108,255,0.2)' }}>
        <h3>Connection String State (v1.1.0)</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={useSharedDatabase}
                onChange={(e) => onSharedDatabaseChange(e.target.checked)}
              />
              <span>Use Shared Database</span>
            </label>
            <p style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
              When checked, clears connection string automatically (onSharedDatabaseChange)
            </p>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '4px' }}>Connection String:</label>
            <input
              type="text"
              placeholder="Enter connection string"
              value={defaultConnectionString}
              onChange={(e) => setDefaultConnectionString(e.target.value)}
              disabled={useSharedDatabase}
              style={{
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #333',
                width: '100%',
                opacity: useSharedDatabase ? 0.5 : 1,
              }}
            />
          </div>
          <div style={{ padding: '8px', background: isDisabledSaveButton ? 'rgba(255,68,68,0.1)' : 'rgba(68,255,68,0.1)', borderRadius: '4px' }}>
            <p style={{ margin: 0 }}>
              isDisabledSaveButton: <strong style={{ color: isDisabledSaveButton ? '#f44' : '#4f4' }}>{isDisabledSaveButton ? 'true' : 'false'}</strong>
            </p>
            <p style={{ fontSize: '12px', color: '#888', margin: '4px 0 0 0' }}>
              {isDisabledSaveButton
                ? 'Save button should be disabled (not using shared DB but no connection string)'
                : 'Save button should be enabled'}
            </p>
          </div>
        </div>
      </div>

      <div className="test-card">
        <h3>Hook State</h3>
        <p>isLoading: {isLoading ? 'true' : 'false'}</p>
        <p>error: {error || 'null'}</p>
        <p>tenants count: {tenants?.length ?? 0}</p>
        <p>totalCount: {totalCount}</p>
        <p>selectedTenant: {selectedTenant ? `${selectedTenant.name} (${selectedTenant.id})` : 'none'}</p>
        <p>defaultConnectionString: {defaultConnectionString || 'empty'}</p>
        <p>useSharedDatabase: {useSharedDatabase ? 'true' : 'false'}</p>
        <p>sortKey: {sortKey}</p>
        <p>sortOrder: {sortOrder || '(empty)'}</p>
        <p style={{ background: 'rgba(100,108,255,0.1)', padding: '4px 8px', borderRadius: '4px' }}>isDisabledSaveButton: {isDisabledSaveButton ? 'true' : 'false'} <span style={{ fontSize: '12px', color: '#888' }}>(v1.1.0)</span></p>
        {!isAuthenticated && (
          <p style={{ color: '#f88', marginTop: '0.5rem' }}>
            ⚠️ You must be authenticated to use tenant management features
          </p>
        )}
      </div>

      {tenants && tenants.length > 0 && (
        <div className="test-card">
          <h3>Tenants List ({tenants.length} of {totalCount})</h3>
          <div style={{ maxHeight: '300px', overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <th style={{ textAlign: 'left', padding: '8px' }}>ID</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Name</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((tenant: TenantManagement.Item) => (
                  <tr key={tenant.id} style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '8px' }}>{tenant.id}</td>
                    <td style={{ padding: '8px' }}>{tenant.name}</td>
                    <td style={{ padding: '8px' }}>
                      <button
                        onClick={() => setSelectedTenant(tenant)}
                        style={{ marginRight: '0.5rem', padding: '4px 8px' }}
                      >
                        Select
                      </button>
                      <button
                        onClick={() => {
                          setTestTenantId(tenant.id)
                          fetchTenantById(tenant.id)
                        }}
                        style={{ marginRight: '0.5rem', padding: '4px 8px' }}
                      >
                        Fetch
                      </button>
                      <button
                        onClick={() => {
                          setFeatureTenantId(tenant.id)
                          setFeatureModalVisible(true)
                        }}
                        style={{ padding: '4px 8px', background: '#646cff' }}
                      >
                        Features
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
        <h3>Hook Methods</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Method</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: '8px' }}>fetchTenants</td><td>Fetch all tenants</td></tr>
            <tr><td style={{ padding: '8px' }}>fetchTenantById</td><td>Fetch a specific tenant</td></tr>
            <tr><td style={{ padding: '8px' }}>createTenant</td><td>Create a new tenant</td></tr>
            <tr><td style={{ padding: '8px' }}>updateTenant</td><td>Update an existing tenant</td></tr>
            <tr><td style={{ padding: '8px' }}>deleteTenant</td><td>Delete a tenant</td></tr>
            <tr><td style={{ padding: '8px' }}>fetchConnectionString</td><td>Get connection string for a tenant</td></tr>
            <tr><td style={{ padding: '8px' }}>updateConnectionString</td><td>Set connection string for a tenant</td></tr>
            <tr><td style={{ padding: '8px' }}>deleteConnectionString</td><td>Remove connection string (use shared DB)</td></tr>
            <tr><td style={{ padding: '8px' }}>setSelectedTenant</td><td>Set the selected tenant</td></tr>
            <tr><td style={{ padding: '8px' }}>setSortKey</td><td>Set sort key (v1.0.0)</td></tr>
            <tr><td style={{ padding: '8px' }}>setSortOrder</td><td>Set sort order: asc, desc, or empty (v1.0.0)</td></tr>
            <tr style={{ background: 'rgba(100,108,255,0.05)' }}><td style={{ padding: '8px' }}>setUseSharedDatabase</td><td>Set whether tenant uses shared database (v1.1.0)</td></tr>
            <tr style={{ background: 'rgba(100,108,255,0.05)' }}><td style={{ padding: '8px' }}>setDefaultConnectionString</td><td>Set the connection string (v1.1.0)</td></tr>
            <tr style={{ background: 'rgba(100,108,255,0.05)' }}><td style={{ padding: '8px' }}>onSharedDatabaseChange</td><td>Handle shared database toggle - clears connection string when enabled (v1.1.0)</td></tr>
            <tr style={{ background: 'rgba(100,108,255,0.05)' }}><td style={{ padding: '8px' }}>isDisabledSaveButton</td><td>Computed: true when not using shared DB but connection string is empty (v1.1.0)</td></tr>
            <tr><td style={{ padding: '8px' }}>reset</td><td>Reset all state</td></tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>Reset State</h3>
        <button onClick={reset} style={{ background: '#f44', color: 'white' }}>
          Reset All State
        </button>
        <p style={{ marginTop: '0.5rem', fontSize: '14px', color: '#888' }}>
          Clears all tenant data and resets to initial state
        </p>
      </div>

      <FeatureManagementModal
        providerName="T"
        providerKey={featureTenantId}
        visible={featureModalVisible}
        onVisibleChange={setFeatureModalVisible}
        onSave={() => {
          console.log('Tenant features saved from hook section!')
        }}
      />
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
              <td style={{ padding: '8px' }}><code>/api/multi-tenancy/tenants</code></td>
              <td>Fetch all tenants (paginated)</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>GET</code></td>
              <td style={{ padding: '8px' }}><code>/api/multi-tenancy/tenants/:id</code></td>
              <td>Fetch a specific tenant</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>POST</code></td>
              <td style={{ padding: '8px' }}><code>/api/multi-tenancy/tenants</code></td>
              <td>Create a new tenant</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>PUT</code></td>
              <td style={{ padding: '8px' }}><code>/api/multi-tenancy/tenants/:id</code></td>
              <td>Update an existing tenant</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>DELETE</code></td>
              <td style={{ padding: '8px' }}><code>/api/multi-tenancy/tenants/:id</code></td>
              <td>Delete a tenant</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>GET</code></td>
              <td style={{ padding: '8px' }}><code>/api/multi-tenancy/tenants/:id/default-connection-string</code></td>
              <td>Get connection string for a tenant</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>PUT</code></td>
              <td style={{ padding: '8px' }}><code>/api/multi-tenancy/tenants/:id/default-connection-string</code></td>
              <td>Set connection string for a tenant</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>DELETE</code></td>
              <td style={{ padding: '8px' }}><code>/api/multi-tenancy/tenants/:id/default-connection-string</code></td>
              <td>Delete connection string (use shared database)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>Request/Response Formats</h3>
        <div style={{ marginBottom: '1rem' }}>
          <h4>Create Tenant Request:</h4>
          <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`{
  "name": "string"
}`}
          </pre>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <h4>Update Tenant Request:</h4>
          <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`{
  "id": "string",
  "name": "string"
}`}
          </pre>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <h4>Tenant Response:</h4>
          <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`{
  "items": [
    {
      "id": "string",
      "name": "string"
    }
  ],
  "totalCount": 0
}`}
          </pre>
        </div>
      </div>
    </div>
  )
}

function TestTenantManagementStateService() {
  const stateService = getTenantManagementStateService()
  const [tenants, setTenants] = useState<TenantManagement.Item[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [testTenantName, setTestTenantName] = useState('')

  useEffect(() => {
    // Subscribe to state changes
    const unsubscribe = stateService.subscribe(() => {
      setTenants(stateService.get())
      setTotalCount(stateService.getTenantsTotalCount())
    })

    // Get initial state
    setTenants(stateService.get())
    setTotalCount(stateService.getTenantsTotalCount())

    return unsubscribe
  }, [stateService])

  const addTenant = () => {
    if (!testTenantName.trim()) return
    const newTenant: TenantManagement.Item = {
      id: `test-${Date.now()}`,
      name: testTenantName.trim(),
    }
    stateService.setTenants([...tenants, newTenant])
    stateService.setTotalCount(totalCount + 1)
    setTestTenantName('')
  }

  const removeTenant = (id: string) => {
    stateService.setTenants(tenants.filter(t => t.id !== id))
    stateService.setTotalCount(Math.max(0, totalCount - 1))
  }

  return (
    <div className="test-section">
      <h2>TenantManagementStateService (v1.1.0)</h2>

      <div className="test-card" style={{ background: 'rgba(100,108,255,0.05)', border: '1px solid rgba(100,108,255,0.2)' }}>
        <h3>Service Overview</h3>
        <p>The TenantManagementStateService is a singleton service that manages tenant list state independently of React components.</p>
        <p style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>
          This service allows different parts of the application to share and react to tenant list changes.
        </p>
      </div>

      <div className="test-card">
        <h3>Add Test Tenant</h3>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <input
            type="text"
            placeholder="Tenant name"
            value={testTenantName}
            onChange={(e) => setTestTenantName(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333',
              flex: 1,
            }}
          />
          <button onClick={addTenant} disabled={!testTenantName.trim()}>
            Add Tenant
          </button>
        </div>
        <p style={{ fontSize: '12px', color: '#888' }}>
          Adds a tenant to the state service (local only, not persisted to server)
        </p>
      </div>

      <div className="test-card">
        <h3>Current State</h3>
        <p>Total Count: <strong>{totalCount}</strong></p>
        <p>Tenants in state: <strong>{tenants.length}</strong></p>
        {tenants.length > 0 && (
          <div style={{ marginTop: '1rem', maxHeight: '200px', overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <th style={{ textAlign: 'left', padding: '8px' }}>ID</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Name</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((tenant) => (
                  <tr key={tenant.id} style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '8px', fontSize: '12px' }}>{tenant.id}</td>
                    <td style={{ padding: '8px' }}>{tenant.name}</td>
                    <td style={{ padding: '8px' }}>
                      <button
                        onClick={() => removeTenant(tenant.id)}
                        style={{ padding: '4px 8px', background: '#f44', color: 'white' }}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="test-card">
        <h3>Service Methods</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Method</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: '8px' }}>get()</td><td>Get current tenants array</td></tr>
            <tr><td style={{ padding: '8px' }}>getTenantsTotalCount()</td><td>Get total count of tenants</td></tr>
            <tr><td style={{ padding: '8px' }}>setTenants(tenants)</td><td>Set tenants array</td></tr>
            <tr><td style={{ padding: '8px' }}>setTotalCount(count)</td><td>Set total count</td></tr>
            <tr><td style={{ padding: '8px' }}>updateFromResponse(response)</td><td>Update from API response</td></tr>
            <tr><td style={{ padding: '8px' }}>reset()</td><td>Reset to initial state</td></tr>
            <tr><td style={{ padding: '8px' }}>subscribe(callback)</td><td>Subscribe to state changes (returns unsubscribe function)</td></tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>Reset State</h3>
        <button
          onClick={() => stateService.reset()}
          style={{ background: '#f44', color: 'white' }}
        >
          Reset State Service
        </button>
        <p style={{ marginTop: '0.5rem', fontSize: '14px', color: '#888' }}>
          Resets the state service to initial empty state
        </p>
      </div>
    </div>
  )
}

function TestRouteConstants() {
  return (
    <div className="test-section">
      <h2>Route Constants (v1.0.0)</h2>

      <div className="test-card">
        <h3>TENANT_MANAGEMENT_ROUTES</h3>
        <p>Route configuration for the tenant management module:</p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
          {JSON.stringify(TENANT_MANAGEMENT_ROUTES, null, 2)}
        </pre>
      </div>

      <div className="test-card">
        <h3>TENANT_MANAGEMENT_ROUTE_PATHS</h3>
        <p>Programmatic navigation paths:</p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
          {JSON.stringify(TENANT_MANAGEMENT_ROUTE_PATHS, null, 2)}
        </pre>
      </div>

      <div className="test-card">
        <h3>TENANT_MANAGEMENT_POLICIES</h3>
        <p>Required policies for tenant management operations:</p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
          {JSON.stringify(TENANT_MANAGEMENT_POLICIES, null, 2)}
        </pre>
      </div>
    </div>
  )
}

export function TestTenantManagementPage() {
  return (
    <div>
      <h1>@abpjs/tenant-management Tests</h1>
      <p>Testing tenant management modal and hooks for creating, updating, and managing tenants.</p>

      <TestTenantModal />
      <TestTenantHook />
      <TestTenantManagementStateService />
      <TestRouteConstants />
      <TestApiEndpoints />
    </div>
  )
}

export default TestTenantManagementPage
