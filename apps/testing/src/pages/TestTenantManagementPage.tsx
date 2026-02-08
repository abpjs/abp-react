/**
 * Test page for @abpjs/tenant-management package v4.0.0
 * Tests: TenantManagementModal, useTenantManagement hook, TenantService
 */
import { useState, useEffect } from 'react'
import { useAuth } from '@abpjs/core'
import {
  TenantManagementModal,
  useTenantManagement,
  getTenantManagementStateService,
  type TenantManagement,
  TENANT_MANAGEMENT_ROUTE_PATHS,
  TENANT_MANAGEMENT_POLICIES,
  eTenantManagementComponents,
  eTenantManagementRouteNames,
  // v3.0.0 config exports
  eTenantManagementPolicyNames,
  TENANT_MANAGEMENT_ROUTE_PROVIDERS,
  configureRoutes,
  initializeTenantManagementRoutes,
  // v3.2.0 proxy exports
  TenantService,
  type TenantDto,
  type TenantCreateDto,
  type TenantUpdateDto,
  type GetTenantsInput,
} from '@abpjs/tenant-management'
import { FeatureManagementModal } from '@abpjs/feature-management'

function TestTenantModal() {
  const [modalVisible, setModalVisible] = useState(false)
  const [featureModalVisible, setFeatureModalVisible] = useState(false)
  const [editTenantId, setEditTenantId] = useState<string | undefined>()
  const [featureTenantId, setFeatureTenantId] = useState('')
  const [initialView, setInitialView] = useState<'tenant' | 'connectionString'>('tenant')
  const [visibleFeaturesLog, setVisibleFeaturesLog] = useState<string[]>([])
  const { isAuthenticated } = useAuth()

  const handleVisibleFeaturesChange = (visible: boolean) => {
    const timestamp = new Date().toLocaleTimeString()
    setVisibleFeaturesLog(prev => [...prev.slice(-4), `${timestamp}: onVisibleFeaturesChange(${visible})`])
    console.log('onVisibleFeaturesChange:', visible)
  }

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

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>onVisibleFeaturesChange <span style={{ color: '#4f4', fontSize: '12px' }}>(v2.0.0)</span></h3>
        <p>New callback prop that fires when the features modal visibility changes:</p>
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '4px', minHeight: '60px', marginTop: '0.5rem' }}>
          {visibleFeaturesLog.length === 0 ? (
            <p style={{ color: '#888', margin: 0, fontSize: '12px' }}>Open the modal and trigger features to see events...</p>
          ) : (
            visibleFeaturesLog.map((log, index) => (
              <div key={index} style={{ fontSize: '12px', fontFamily: 'monospace', padding: '2px 0' }}>
                {log}
              </div>
            ))
          )}
        </div>
        <button
          onClick={() => setVisibleFeaturesLog([])}
          style={{ marginTop: '0.5rem', padding: '4px 8px', fontSize: '12px' }}
        >
          Clear Log
        </button>
      </div>

      <TenantManagementModal
        visible={modalVisible}
        onVisibleChange={setModalVisible}
        tenantId={editTenantId}
        initialView={initialView}
        onVisibleFeaturesChange={handleVisibleFeaturesChange}
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
    visibleFeatures,
    featuresProviderKey,
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
    onVisibleFeaturesChange,
    openFeaturesModal,
    reset,
  } = useTenantManagement()

  const [testTenantId, setTestTenantId] = useState('')
  const [testTenantName, setTestTenantName] = useState('')
  const [testAdminEmail, setTestAdminEmail] = useState('')
  const [testAdminPassword, setTestAdminPassword] = useState('')
  const [testConnectionString, setTestConnectionString] = useState('')

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

      <div className="test-card" style={{ background: 'rgba(100,255,100,0.05)', border: '1px solid rgba(100,255,100,0.2)' }}>
        <h3>Create Tenant <span style={{ color: '#4f4', fontSize: '12px' }}>(v2.4.0 - requires admin credentials)</span></h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <input
            type="text"
            placeholder="Tenant Name"
            value={testTenantName}
            onChange={(e) => setTestTenantName(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333'
            }}
          />
          <input
            type="email"
            placeholder="Admin Email Address (v2.4.0)"
            value={testAdminEmail}
            onChange={(e) => setTestAdminEmail(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333'
            }}
          />
          <input
            type="password"
            placeholder="Admin Password (v2.4.0)"
            value={testAdminPassword}
            onChange={(e) => setTestAdminPassword(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333'
            }}
          />
          <button
            onClick={async () => {
              if (testTenantName && testAdminEmail && testAdminPassword) {
                const result = await createTenant({
                  name: testTenantName,
                  adminEmailAddress: testAdminEmail,
                  adminPassword: testAdminPassword,
                })
                if (result.success) {
                  setTestTenantName('')
                  setTestAdminEmail('')
                  setTestAdminPassword('')
                  fetchTenants() // Refresh list
                }
              }
            }}
            disabled={!testTenantName || !testAdminEmail || !testAdminPassword || isLoading}
          >
            Create Tenant
          </button>
        </div>
        <p style={{ fontSize: '12px', color: '#888' }}>
          v2.4.0: Admin email and password are now required when creating a new tenant.
        </p>
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
                const result = await updateTenant(testTenantId, { name: testTenantName })
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

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>Features Modal via Hook <span style={{ color: '#4f4', fontSize: '12px' }}>(v2.2.0)</span></h3>
        <p>New in v2.2.0: Open the feature management modal directly from the hook:</p>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Enter Tenant ID for Features"
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
            onClick={() => openFeaturesModal(testTenantId)}
            disabled={!testTenantId || !isAuthenticated}
            style={{ background: '#4f4', color: '#000' }}
          >
            openFeaturesModal()
          </button>
        </div>
        <div style={{ padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
          <p style={{ margin: 0 }}>visibleFeatures: <strong>{visibleFeatures ? 'true' : 'false'}</strong></p>
          <p style={{ margin: '4px 0 0 0' }}>featuresProviderKey: <strong>{featuresProviderKey || '(empty)'}</strong></p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
          <button
            onClick={() => onVisibleFeaturesChange(false)}
            disabled={!visibleFeatures}
            style={{ padding: '4px 8px', fontSize: '12px' }}
          >
            Close Modal (onVisibleFeaturesChange)
          </button>
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
        <p style={{ background: 'rgba(68,255,68,0.1)', padding: '4px 8px', borderRadius: '4px', marginTop: '4px' }}>visibleFeatures: {visibleFeatures ? 'true' : 'false'} <span style={{ fontSize: '12px', color: '#888' }}>(v2.2.0)</span></p>
        <p style={{ background: 'rgba(68,255,68,0.1)', padding: '4px 8px', borderRadius: '4px', marginTop: '4px' }}>featuresProviderKey: {featuresProviderKey || '(empty)'} <span style={{ fontSize: '12px', color: '#888' }}>(v2.2.0)</span></p>
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
                {tenants.map((tenant: TenantDto) => (
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
                        onClick={() => openFeaturesModal(tenant.id)}
                        style={{ padding: '4px 8px', background: '#4f4', color: '#000' }}
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
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}><td style={{ padding: '8px' }}>visibleFeatures</td><td>Whether the features modal is visible (v2.2.0)</td></tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}><td style={{ padding: '8px' }}>featuresProviderKey</td><td>Provider key (tenant ID) for features modal (v2.2.0)</td></tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}><td style={{ padding: '8px' }}>openFeaturesModal</td><td>Open features modal for a tenant (v2.2.0)</td></tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}><td style={{ padding: '8px' }}>onVisibleFeaturesChange</td><td>Callback when features modal visibility changes (v2.2.0)</td></tr>
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
        providerKey={featuresProviderKey}
        visible={visibleFeatures}
        onVisibleChange={onVisibleFeaturesChange}
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
          <h4>Create Tenant Request <span style={{ color: '#4f4', fontSize: '12px' }}>(v2.4.0 - requires admin credentials)</span>:</h4>
          <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`{
  "name": "string",
  "adminEmailAddress": "string",  // NEW in v2.4.0
  "adminPassword": "string"       // NEW in v2.4.0
}`}
          </pre>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <h4>Update Tenant Request <span style={{ color: '#f44', fontSize: '12px' }}>(v4.0.0 - ID is now a URL parameter)</span>:</h4>
          <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`// PUT /api/multi-tenancy/tenants/:id
{
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
  const { isAuthenticated } = useAuth()
  const stateService = getTenantManagementStateService()
  const [tenants, setTenants] = useState<TenantDto[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [testTenantName, setTestTenantName] = useState('')
  const [dispatchTenantId, setDispatchTenantId] = useState('')
  const [dispatchTenantName, setDispatchTenantName] = useState('')
  const [dispatchAdminEmail, setDispatchAdminEmail] = useState('')
  const [dispatchAdminPassword, setDispatchAdminPassword] = useState('')
  const [dispatchResult, setDispatchResult] = useState<string>('')
  const [isDispatchLoading, setIsDispatchLoading] = useState(false)

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
    const newTenant: TenantDto = {
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

  // v2.0.0 dispatch method handlers
  const handleDispatchGetTenants = async () => {
    setIsDispatchLoading(true)
    try {
      const result = await stateService.dispatchGetTenants()
      setDispatchResult(`dispatchGetTenants: ${result.items?.length ?? 0} tenants, total: ${result.totalCount}`)
    } catch (err) {
      setDispatchResult(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
    setIsDispatchLoading(false)
  }

  const handleDispatchGetTenantById = async () => {
    if (!dispatchTenantId) return
    setIsDispatchLoading(true)
    try {
      const result = await stateService.dispatchGetTenantById(dispatchTenantId)
      setDispatchResult(`dispatchGetTenantById: ${JSON.stringify(result)}`)
    } catch (err) {
      setDispatchResult(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
    setIsDispatchLoading(false)
  }

  const handleDispatchCreateTenant = async () => {
    if (!dispatchTenantName || !dispatchAdminEmail || !dispatchAdminPassword) return
    setIsDispatchLoading(true)
    try {
      const result = await stateService.dispatchCreateTenant({
        name: dispatchTenantName,
        adminEmailAddress: dispatchAdminEmail,
        adminPassword: dispatchAdminPassword,
      })
      setDispatchResult(`dispatchCreateTenant: ${JSON.stringify(result)}`)
      setDispatchTenantName('')
      setDispatchAdminEmail('')
      setDispatchAdminPassword('')
    } catch (err) {
      setDispatchResult(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
    setIsDispatchLoading(false)
  }

  const handleDispatchUpdateTenant = async () => {
    if (!dispatchTenantId || !dispatchTenantName) return
    setIsDispatchLoading(true)
    try {
      const result = await stateService.dispatchUpdateTenant(dispatchTenantId, { name: dispatchTenantName })
      setDispatchResult(`dispatchUpdateTenant: ${JSON.stringify(result)}`)
    } catch (err) {
      setDispatchResult(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
    setIsDispatchLoading(false)
  }

  const handleDispatchDeleteTenant = async () => {
    if (!dispatchTenantId) return
    if (!window.confirm(`Delete tenant ${dispatchTenantId}?`)) return
    setIsDispatchLoading(true)
    try {
      await stateService.dispatchDeleteTenant(dispatchTenantId)
      setDispatchResult(`dispatchDeleteTenant: Successfully deleted ${dispatchTenantId}`)
      setDispatchTenantId('')
    } catch (err) {
      setDispatchResult(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
    setIsDispatchLoading(false)
  }

  return (
    <div className="test-section">
      <h2>TenantManagementStateService</h2>

      <div className="test-card" style={{ background: 'rgba(100,108,255,0.05)', border: '1px solid rgba(100,108,255,0.2)' }}>
        <h3>Service Overview</h3>
        <p>The TenantManagementStateService is a singleton service that manages tenant list state independently of React components.</p>
        <p style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>
          This service allows different parts of the application to share and react to tenant list changes.
        </p>
      </div>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>Dispatch Methods <span style={{ color: '#4f4', fontSize: '12px' }}>(v2.0.0)</span></h3>
        <p style={{ marginBottom: '1rem' }}>
          New dispatch methods provide facade over API operations with automatic state updates.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Tenant ID (for get/update/delete)"
            value={dispatchTenantId}
            onChange={(e) => setDispatchTenantId(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333',
            }}
          />
          <input
            type="text"
            placeholder="Tenant Name (for create/update)"
            value={dispatchTenantName}
            onChange={(e) => setDispatchTenantName(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333',
            }}
          />
          <input
            type="email"
            placeholder="Admin Email (for create - v2.4.0)"
            value={dispatchAdminEmail}
            onChange={(e) => setDispatchAdminEmail(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333',
            }}
          />
          <input
            type="password"
            placeholder="Admin Password (for create - v2.4.0)"
            value={dispatchAdminPassword}
            onChange={(e) => setDispatchAdminPassword(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333',
            }}
          />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          <button
            onClick={handleDispatchGetTenants}
            disabled={isDispatchLoading || !isAuthenticated}
          >
            dispatchGetTenants()
          </button>
          <button
            onClick={handleDispatchGetTenantById}
            disabled={isDispatchLoading || !isAuthenticated || !dispatchTenantId}
          >
            dispatchGetTenantById()
          </button>
          <button
            onClick={handleDispatchCreateTenant}
            disabled={isDispatchLoading || !isAuthenticated || !dispatchTenantName || !dispatchAdminEmail || !dispatchAdminPassword}
          >
            dispatchCreateTenant()
          </button>
          <button
            onClick={handleDispatchUpdateTenant}
            disabled={isDispatchLoading || !isAuthenticated || !dispatchTenantId || !dispatchTenantName}
          >
            dispatchUpdateTenant()
          </button>
          <button
            onClick={handleDispatchDeleteTenant}
            disabled={isDispatchLoading || !isAuthenticated || !dispatchTenantId}
            style={{ background: '#f44', color: 'white' }}
          >
            dispatchDeleteTenant()
          </button>
        </div>

        {dispatchResult && (
          <div style={{ padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', fontSize: '12px' }}>
            <strong>Result:</strong> {dispatchResult}
          </div>
        )}

        {!isAuthenticated && (
          <p style={{ color: '#f88', marginTop: '0.5rem', fontSize: '12px' }}>
            ⚠️ You must be authenticated to use dispatch methods
          </p>
        )}
      </div>

      <div className="test-card">
        <h3>Add Test Tenant (Local)</h3>
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
            <tr><td style={{ padding: '8px' }}>reset()</td><td>Reset to initial state</td></tr>
            <tr><td style={{ padding: '8px' }}>subscribe(callback)</td><td>Subscribe to state changes (returns unsubscribe function)</td></tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}><td style={{ padding: '8px' }}>dispatchGetTenants(input?)</td><td>Fetch tenants from API and update state (v2.0.0, v4.0.0: GetTenantsInput)</td></tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}><td style={{ padding: '8px' }}>dispatchGetTenantById(id)</td><td>Fetch single tenant from API (v2.0.0)</td></tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}><td style={{ padding: '8px' }}>dispatchCreateTenant(input)</td><td>Create tenant via API and refresh state (v2.0.0, v4.0.0: TenantCreateDto)</td></tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}><td style={{ padding: '8px' }}>dispatchUpdateTenant(id, input)</td><td>Update tenant via API and refresh state (v4.0.0: id + TenantUpdateDto)</td></tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}><td style={{ padding: '8px' }}>dispatchDeleteTenant(id)</td><td>Delete tenant via API and refresh state (v2.0.0)</td></tr>
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

function TestComponentInterfaces() {
  const [inputsDemo, setInputsDemo] = useState<TenantManagement.TenantsComponentInputs>({})
  const [outputsDemo, setOutputsDemo] = useState<TenantManagement.TenantsComponentOutputs>({})
  const [eventLog, setEventLog] = useState<string[]>([])

  const addLog = (message: string) => {
    setEventLog(prev => [...prev.slice(-9), `${new Date().toLocaleTimeString()}: ${message}`])
  }

  // Set up demo callbacks
  useEffect(() => {
    setInputsDemo({
      onTenantCreated: (tenant) => addLog(`onTenantCreated: ${tenant.name} (${tenant.id})`),
      onTenantUpdated: (tenant) => addLog(`onTenantUpdated: ${tenant.name} (${tenant.id})`),
      onTenantDeleted: (id) => addLog(`onTenantDeleted: ${id}`),
    })
    setOutputsDemo({
      onVisibleFeaturesChange: (visible) => addLog(`onVisibleFeaturesChange: ${visible}`),
      onSearch: (value) => addLog(`onSearch: "${value}"`),
      onPageChange: (page) => addLog(`onPageChange: ${page}`),
    })
  }, [])

  return (
    <div className="test-section">
      <h2>Component Interfaces <span style={{ color: '#4f4', fontSize: '14px' }}>(v2.0.0)</span></h2>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>TenantsComponentInputs</h3>
        <p>Input callbacks for reacting to tenant CRUD operations:</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Callback</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: '8px' }}>onTenantCreated</td><td><code>(tenant: TenantDto) =&gt; void</code></td><td>Called when a tenant is created (v4.0.0: TenantDto)</td></tr>
            <tr><td style={{ padding: '8px' }}>onTenantUpdated</td><td><code>(tenant: TenantDto) =&gt; void</code></td><td>Called when a tenant is updated (v4.0.0: TenantDto)</td></tr>
            <tr><td style={{ padding: '8px' }}>onTenantDeleted</td><td><code>(id: string) =&gt; void</code></td><td>Called when a tenant is deleted</td></tr>
          </tbody>
        </table>
        <div style={{ marginTop: '1rem' }}>
          <h4>Test Callbacks:</h4>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button onClick={() => inputsDemo.onTenantCreated?.({ id: 'new-123', name: 'Test Tenant' })}>
              Trigger onTenantCreated
            </button>
            <button onClick={() => inputsDemo.onTenantUpdated?.({ id: 'upd-123', name: 'Updated Tenant' })}>
              Trigger onTenantUpdated
            </button>
            <button onClick={() => inputsDemo.onTenantDeleted?.('del-123')}>
              Trigger onTenantDeleted
            </button>
          </div>
        </div>
      </div>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>TenantsComponentOutputs</h3>
        <p>Output callbacks for UI state changes:</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Callback</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: '8px' }}>onVisibleFeaturesChange</td><td><code>(visible: boolean) =&gt; void</code></td><td>Called when features modal visibility changes</td></tr>
            <tr><td style={{ padding: '8px' }}>onSearch</td><td><code>(value: string) =&gt; void</code></td><td>Called when search value changes (v2.0.0: typed as string)</td></tr>
            <tr><td style={{ padding: '8px' }}>onPageChange</td><td><code>(page: number) =&gt; void</code></td><td>Called when page changes (v2.0.0: typed as number)</td></tr>
          </tbody>
        </table>
        <div style={{ marginTop: '1rem' }}>
          <h4>Test Callbacks:</h4>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button onClick={() => outputsDemo.onVisibleFeaturesChange?.(true)}>
              Trigger onVisibleFeaturesChange(true)
            </button>
            <button onClick={() => outputsDemo.onVisibleFeaturesChange?.(false)}>
              Trigger onVisibleFeaturesChange(false)
            </button>
            <button onClick={() => outputsDemo.onSearch?.('test search')}>
              Trigger onSearch
            </button>
            <button onClick={() => outputsDemo.onPageChange?.(2)}>
              Trigger onPageChange(2)
            </button>
          </div>
        </div>
      </div>

      <div className="test-card">
        <h3>Event Log</h3>
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '4px', minHeight: '100px', maxHeight: '200px', overflow: 'auto' }}>
          {eventLog.length === 0 ? (
            <p style={{ color: '#888', margin: 0 }}>Click buttons above to test callbacks...</p>
          ) : (
            eventLog.map((log, index) => (
              <div key={index} style={{ fontSize: '12px', fontFamily: 'monospace', padding: '2px 0' }}>
                {log}
              </div>
            ))
          )}
        </div>
        <button
          onClick={() => setEventLog([])}
          style={{ marginTop: '0.5rem', padding: '4px 8px', fontSize: '12px' }}
        >
          Clear Log
        </button>
      </div>
    </div>
  )
}

function TestRouteConstants() {
  return (
    <div className="test-section">
      <h2>Route Constants</h2>

      <div className="test-card" style={{ background: 'rgba(255,68,68,0.05)', border: '1px solid rgba(255,68,68,0.2)' }}>
        <h3>TENANT_MANAGEMENT_ROUTES <span style={{ color: '#f44', fontSize: '12px' }}>(Removed in v2.0.0)</span></h3>
        <p style={{ color: '#888' }}>
          The <code>TENANT_MANAGEMENT_ROUTES</code> constant was deprecated in v0.9.0 and has been removed in v2.0.0.
        </p>
        <p style={{ marginTop: '0.5rem', fontSize: '14px' }}>
          Use <code>TENANT_MANAGEMENT_ROUTE_PATHS</code> and <code>TENANT_MANAGEMENT_POLICIES</code> instead.
        </p>
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

function TestV240Features() {
  return (
    <div className="test-section">
      <h2>v2.4.0 Features</h2>

      <div className="test-card" style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.2)' }}>
        <h3>apiName Property <span style={{ color: '#f44', fontSize: '12px' }}>(Removed in v4.0.0)</span></h3>
        <p><code>TenantManagementService</code> was removed in v4.0.0. Use <code>TenantService</code> (proxy) instead.</p>
        <p>The <code>apiName</code> property was part of the legacy service. TenantService uses the core REST service directly.</p>

        <pre style={{
          background: 'rgba(50,50,50,0.3)',
          padding: '1rem',
          borderRadius: '4px',
          fontSize: '12px',
          marginTop: '1rem'
        }}>
{`// v4.0.0: TenantManagementService removed, use TenantService instead
// Before (v2.4.0):
// const service = new TenantManagementService(restService);
// service.apiName = "default";

// After (v4.0.0):
const service = new TenantService(restService);
// TenantService uses core REST service configuration directly`}
        </pre>
      </div>

      <div className="test-card" style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.2)' }}>
        <h3>AddRequest Changes <span style={{ color: '#f44', fontSize: '12px' }}>(Removed in v4.0.0 - use TenantCreateDto)</span></h3>
        <p><code>TenantManagement.AddRequest</code> was removed in v4.0.0. Use <code>TenantCreateDto</code> instead:</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Field</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px' }}><code>name</code></td>
              <td>string</td>
              <td>Required</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>adminEmailAddress</code></td>
              <td>string</td>
              <td>Required</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>adminPassword</code></td>
              <td>string</td>
              <td>Required</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>extraProperties</code></td>
              <td>Record&lt;string, any&gt;</td>
              <td>Optional (v4.0.0)</td>
            </tr>
          </tbody>
        </table>

        <pre style={{
          background: 'rgba(50,50,50,0.3)',
          padding: '1rem',
          borderRadius: '4px',
          fontSize: '12px',
          marginTop: '1rem'
        }}>
{`// v4.0.0: Use TenantCreateDto instead of TenantManagement.AddRequest
const request: TenantCreateDto = {
  name: "New Tenant",
  adminEmailAddress: "admin@newtenant.com",
  adminPassword: "SecurePassword123!"
};

await tenantService.create(request);`}
        </pre>
      </div>

      <div className="test-card" style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.2)' }}>
        <h3>UpdateRequest Changes <span style={{ color: '#f44', fontSize: '12px' }}>(Removed in v4.0.0 - use TenantUpdateDto)</span></h3>
        <p><code>TenantManagement.UpdateRequest</code> was removed in v4.0.0. Use <code>TenantUpdateDto</code> instead.</p>
        <p style={{ marginTop: '0.5rem' }}><strong>v4.0.0 breaking change:</strong> <code>updateTenant(id, data)</code> now takes ID as a separate first argument.</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Field</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Notes</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px' }}><code>name</code></td>
              <td>string</td>
              <td>Required - New tenant name</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>extraProperties</code></td>
              <td>Record&lt;string, any&gt;</td>
              <td>Optional (v4.0.0)</td>
            </tr>
          </tbody>
        </table>
        <pre style={{
          background: 'rgba(50,50,50,0.3)',
          padding: '1rem',
          borderRadius: '4px',
          fontSize: '12px',
          marginTop: '1rem'
        }}>
{`// v4.0.0: ID is now a separate parameter
// Before: updateTenant({ id, name })
// After:  updateTenant(id, { name })
await updateTenant('tenant-id', { name: 'Updated Name' });`}
        </pre>
      </div>

      <div className="test-card" style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.2)' }}>
        <h3>TenantManagementService <span style={{ color: '#f44', fontSize: '12px' }}>(Removed in v4.0.0)</span></h3>
        <p style={{ color: '#f87171' }}>
          <strong>Breaking Change:</strong> <code>TenantManagementService</code> has been completely removed in v4.0.0.
          Use <code>TenantService</code> (proxy) instead.
        </p>
        <pre style={{
          background: 'rgba(50,50,50,0.3)',
          padding: '1rem',
          borderRadius: '4px',
          fontSize: '12px',
          marginTop: '1rem'
        }}>
{`// Before (v3.2.0):
// import { TenantManagementService } from '@abpjs/tenant-management';
// const service = new TenantManagementService(restService);

// After (v4.0.0):
import { TenantService } from '@abpjs/tenant-management';
const service = new TenantService(restService);`}
        </pre>
      </div>
    </div>
  )
}

function TestV300Features() {
  return (
    <div className="test-section">
      <h2>What's New in v3.0.0</h2>

      <div className="test-card" style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)' }}>
        <h3>Config Route Providers</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          New in v3.0.0: Route configuration providers for tenant management routes.
          Matches Angular's pattern for configuring routes at application startup.
        </p>

        <h4 style={{ marginTop: '16px' }}>TENANT_MANAGEMENT_ROUTE_PROVIDERS</h4>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          Object containing route configuration functions:
        </p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
{`// TENANT_MANAGEMENT_ROUTE_PROVIDERS object:
{
  configureRoutes: typeof configureRoutes
}

// configureRoutes is: ${typeof configureRoutes}
// TENANT_MANAGEMENT_ROUTE_PROVIDERS has configureRoutes: ${!!TENANT_MANAGEMENT_ROUTE_PROVIDERS.configureRoutes}`}
        </pre>
      </div>

      <div className="test-card" style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)' }}>
        <h3>configureRoutes Function</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          Configures the tenant management module routes. Returns a function that adds routes to RoutesService.
        </p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
{`import { configureRoutes } from '@abpjs/tenant-management';
import { getRoutesService } from '@abpjs/core';

// Configure routes
const routes = getRoutesService();
const addRoutes = configureRoutes(routes);
addRoutes();

// Routes configured:
// 1. /tenant-management (main menu item)
//    - name: 'AbpTenantManagement::Menu:TenantManagement'
//    - parentName: 'AbpUiNavigation::Menu:Administration'
//    - layout: eLayoutType.application
//    - iconClass: 'bi bi-people'
//    - order: 2
//    - requiredPolicy: 'AbpTenantManagement.Tenants'
//
// 2. /tenant-management/tenants (child route)
//    - name: 'AbpTenantManagement::Tenants'
//    - parentName: 'AbpTenantManagement::Menu:TenantManagement'
//    - requiredPolicy: 'AbpTenantManagement.Tenants'`}
        </pre>
      </div>

      <div className="test-card" style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)' }}>
        <h3>initializeTenantManagementRoutes Helper</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          Convenience function that initializes tenant management routes using global services.
        </p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
{`import { initializeTenantManagementRoutes } from '@abpjs/tenant-management';

// In your app initialization:
initializeTenantManagementRoutes();

// This is equivalent to:
// const routes = getRoutesService();
// const addRoutes = configureRoutes(routes);
// addRoutes();

// initializeTenantManagementRoutes is: ${typeof initializeTenantManagementRoutes}`}
        </pre>
      </div>

      <div className="test-card" style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)' }}>
        <h3>eTenantManagementPolicyNames Enum</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          New in v3.0.0: Policy name constants for permission checks.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Key</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px' }}>
                <code>TenantManagement</code>
              </td>
              <td style={{ padding: '8px' }}>
                <code style={{ background: '#333', padding: '2px 6px', borderRadius: '4px' }}>
                  {eTenantManagementPolicyNames.TenantManagement}
                </code>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}>
                <code>Tenants</code>
              </td>
              <td style={{ padding: '8px' }}>
                <code style={{ background: '#333', padding: '2px 6px', borderRadius: '4px' }}>
                  {eTenantManagementPolicyNames.Tenants}
                </code>
              </td>
            </tr>
          </tbody>
        </table>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px', marginTop: '1rem' }}>
{`import { eTenantManagementPolicyNames } from '@abpjs/tenant-management';

// Use for policy checks
const canManageTenants = userPolicies.includes(
  eTenantManagementPolicyNames.TenantManagement
);

// Use in route configuration
const route = {
  path: '/tenant-management',
  requiredPolicy: eTenantManagementPolicyNames.TenantManagement,
};`}
        </pre>
      </div>

      <div className="test-card" style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)' }}>
        <h3>eTenantManagementRouteNames Changes</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          <strong style={{ color: '#f87171' }}>Breaking Change:</strong> The <code>Administration</code> key has been removed from <code>eTenantManagementRouteNames</code>.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Key</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Value</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ background: 'rgba(248,113,113,0.1)' }}>
              <td style={{ padding: '8px' }}>
                <code style={{ textDecoration: 'line-through' }}>Administration</code>
              </td>
              <td style={{ padding: '8px' }}>
                <code style={{ background: '#333', padding: '2px 6px', borderRadius: '4px' }}>
                  AbpUiNavigation::Menu:Administration
                </code>
              </td>
              <td style={{ padding: '8px', color: '#f87171' }}>REMOVED in v3.0.0</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}>
                <code>TenantManagement</code>
              </td>
              <td style={{ padding: '8px' }}>
                <code style={{ background: '#333', padding: '2px 6px', borderRadius: '4px' }}>
                  {eTenantManagementRouteNames.TenantManagement}
                </code>
              </td>
              <td style={{ padding: '8px', color: '#22c55e' }}>Available</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}>
                <code>Tenants</code>
              </td>
              <td style={{ padding: '8px' }}>
                <code style={{ background: '#333', padding: '2px 6px', borderRadius: '4px' }}>
                  {eTenantManagementRouteNames.Tenants}
                </code>
              </td>
              <td style={{ padding: '8px', color: '#22c55e' }}>Available</td>
            </tr>
          </tbody>
        </table>
        <div style={{ marginTop: '1rem', padding: '12px', background: 'rgba(248,113,113,0.1)', borderRadius: '4px' }}>
          <p style={{ margin: 0, fontSize: '14px' }}>
            <strong>Migration:</strong> If you were using <code>eTenantManagementRouteNames.Administration</code>,
            use the string literal <code>'AbpUiNavigation::Menu:Administration'</code> directly.
          </p>
        </div>
      </div>

      <div className="test-card" style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)' }}>
        <h3>Config Subpackage Location</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          The <code>eTenantManagementRouteNames</code> enum is now defined in the config subpackage
          and re-exported from the main package for backward compatibility.
        </p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
{`// Both imports work:
import { eTenantManagementRouteNames } from '@abpjs/tenant-management';
// or from config (v3.0.0):
import { eTenantManagementRouteNames } from '@abpjs/tenant-management/config/enums/route-names';

// New exports only available from main package:
import {
  eTenantManagementPolicyNames,
  TENANT_MANAGEMENT_ROUTE_PROVIDERS,
  configureRoutes,
  initializeTenantManagementRoutes,
} from '@abpjs/tenant-management';`}
        </pre>
      </div>
    </div>
  )
}

function TestV270Features() {
  return (
    <div className="test-section">
      <h2>What's New in v2.7.0</h2>

      <div className="test-card" style={{ background: 'rgba(100,108,255,0.05)', border: '1px solid rgba(100,108,255,0.2)' }}>
        <h3>eTenantManagementComponents Enum</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          Component keys for the Tenant Management module. Used for component replacement/customization.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Key</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px' }}>
                <code>Tenants</code>
              </td>
              <td style={{ padding: '8px' }}>
                <code style={{ background: '#333', padding: '2px 6px', borderRadius: '4px' }}>
                  {eTenantManagementComponents.Tenants}
                </code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card" style={{ background: 'rgba(100,108,255,0.05)', border: '1px solid rgba(100,108,255,0.2)' }}>
        <h3>eTenantManagementRouteNames Enum</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          Route name keys for the Tenant Management module. Used for route localization and identification.
          <br/><strong style={{ color: '#f87171' }}>Note:</strong> <code>Administration</code> was removed in v3.0.0.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Key</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Value (Localization Key)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px' }}>
                <code>TenantManagement</code>
              </td>
              <td style={{ padding: '8px' }}>
                <code style={{ background: '#333', padding: '2px 6px', borderRadius: '4px' }}>
                  {eTenantManagementRouteNames.TenantManagement}
                </code>
              </td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}>
                <code>Tenants</code>
              </td>
              <td style={{ padding: '8px' }}>
                <code style={{ background: '#333', padding: '2px 6px', borderRadius: '4px' }}>
                  {eTenantManagementRouteNames.Tenants}
                </code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card" style={{ background: 'rgba(100,108,255,0.05)', border: '1px solid rgba(100,108,255,0.2)' }}>
        <h3>TenantManagementModal.componentKey</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          Static property for component replacement. The modal now has a componentKey property.
        </p>
        <div style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
          <p style={{ margin: 0 }}>
            <code>TenantManagementModal.componentKey</code> = <code style={{ background: '#333', padding: '2px 6px', borderRadius: '4px' }}>{TenantManagementModal.componentKey}</code>
          </p>
        </div>
      </div>

      <div className="test-card">
        <h3>Usage Examples</h3>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
{`import {
  eTenantManagementComponents,
  eTenantManagementRouteNames,
  TenantManagementModal
} from '@abpjs/tenant-management';

// Component replacement key
const componentKey = eTenantManagementComponents.Tenants;
// => 'TenantManagement.TenantsComponent'

// Route localization keys (v3.0.0: Administration removed)
const tenantsKey = eTenantManagementRouteNames.Tenants;
// => 'AbpTenantManagement::Tenants'

const tenantMgmtKey = eTenantManagementRouteNames.TenantManagement;
// => 'AbpTenantManagement::Menu:TenantManagement'

// For Administration, use string literal directly (v3.0.0)
const adminKey = 'AbpUiNavigation::Menu:Administration';

// Static componentKey on the modal
console.log(TenantManagementModal.componentKey);
// => 'TenantManagement.TenantsComponent'

// Use in component registry for replacement
const componentRegistry = {
  [eTenantManagementComponents.Tenants]: MyCustomTenantsComponent,
};

// Use for localization
const localizedName = localize(eTenantManagementRouteNames.TenantManagement);`}
        </pre>
      </div>
    </div>
  )
}

function TestV310Features() {
  return (
    <div className="test-section">
      <h2>What's New in v3.1.0</h2>

      <div className="test-card" style={{ background: 'rgba(155,89,182,0.05)', border: '1px solid rgba(155,89,182,0.2)' }}>
        <h3>Version Bump Only</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          Version 3.1.0 is a maintenance release with no functional changes.
          The update includes dependency version bumps that do not affect the React translation.
        </p>
        <ul style={{ fontSize: '14px', color: '#888' }}>
          <li>Dependency update: @abp/ng.feature-management ~3.0.0 → ~3.1.0</li>
          <li>Dependency update: @abp/ng.theme.shared ~3.0.0 → ~3.1.0</li>
        </ul>
        <p style={{ fontSize: '14px', color: '#9b59b6', marginTop: '12px' }}>
          All v3.0.0 features and APIs remain unchanged.
        </p>
      </div>
    </div>
  )
}

function TestV320Features() {
  // Demo TenantService usage
  const demoTenantDto: TenantDto = {
    id: 'demo-tenant-123',
    name: 'Demo Tenant',
    extraProperties: { plan: 'enterprise' },
  }

  const demoCreateDto: TenantCreateDto = {
    name: 'New Tenant',
    adminEmailAddress: 'admin@newtenant.com',
    adminPassword: 'SecurePass123!',
    extraProperties: {},
  }

  const demoUpdateDto: TenantUpdateDto = {
    name: 'Updated Tenant Name',
    extraProperties: { version: 2 },
  }

  const demoGetTenantsInput: GetTenantsInput = {
    filter: 'search',
    maxResultCount: 10,
    skipCount: 0,
    sorting: 'name asc',
  }

  return (
    <div className="test-section">
      <h2>What's New in v3.2.0</h2>

      <div className="test-card" style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)' }}>
        <h3>Proxy Module Overview</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          Version 3.2.0 introduces a new proxy submodule with typed DTOs and TenantService.
          This provides strongly-typed API operations for tenant management.
        </p>
        <ul style={{ fontSize: '14px', color: '#888' }}>
          <li><code>TenantService</code> - Typed proxy service for tenant CRUD operations</li>
          <li><code>TenantDto</code> - DTO representing a tenant entity</li>
          <li><code>TenantCreateDto</code> - DTO for creating tenants</li>
          <li><code>TenantUpdateDto</code> - DTO for updating tenants</li>
          <li><code>GetTenantsInput</code> - Input parameters for listing tenants</li>
          <li><code>TenantCreateOrUpdateDtoBase</code> - Base interface for create/update DTOs</li>
        </ul>
      </div>

      <div className="test-card" style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)' }}>
        <h3>TenantService</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          Typed proxy service for tenant API calls. Since v4.0.0, this is the only service (TenantManagementService was removed).
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Method</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Return Type</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px' }}><code>create(input)</code></td>
              <td><code>Promise&lt;TenantDto&gt;</code></td>
              <td>Create a new tenant</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>delete(id)</code></td>
              <td><code>Promise&lt;void&gt;</code></td>
              <td>Delete a tenant</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>get(id)</code></td>
              <td><code>Promise&lt;TenantDto&gt;</code></td>
              <td>Get a tenant by ID</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>getList(input)</code></td>
              <td><code>Promise&lt;PagedResultDto&lt;TenantDto&gt;&gt;</code></td>
              <td>Get paginated list of tenants</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>update(id, input)</code></td>
              <td><code>Promise&lt;TenantDto&gt;</code></td>
              <td>Update a tenant</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>getDefaultConnectionString(id)</code></td>
              <td><code>Promise&lt;string&gt;</code></td>
              <td>Get tenant's connection string</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>updateDefaultConnectionString(id, str)</code></td>
              <td><code>Promise&lt;void&gt;</code></td>
              <td>Update connection string</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>deleteDefaultConnectionString(id)</code></td>
              <td><code>Promise&lt;void&gt;</code></td>
              <td>Delete connection string</td>
            </tr>
          </tbody>
        </table>
        <p style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>
          TenantService is: <code>{typeof TenantService}</code>
        </p>
      </div>

      <div className="test-card" style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)' }}>
        <h3>TenantDto Interface</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          Represents a tenant entity. Extends <code>ExtensibleEntityDto&lt;string&gt;</code>.
        </p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
{`interface TenantDto extends ExtensibleEntityDto<string> {
  id: string;           // Tenant ID
  name: string;         // Tenant name
  extraProperties: {};  // Custom properties
}

// Example:
${JSON.stringify(demoTenantDto, null, 2)}`}
        </pre>
      </div>

      <div className="test-card" style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)' }}>
        <h3>TenantCreateDto Interface</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          DTO for creating a new tenant. Extends <code>TenantCreateOrUpdateDtoBase</code>.
        </p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
{`interface TenantCreateDto extends TenantCreateOrUpdateDtoBase {
  name: string;              // Tenant name
  adminEmailAddress: string; // Admin email
  adminPassword: string;     // Admin password
  extraProperties: {};       // Custom properties
}

// Example:
${JSON.stringify(demoCreateDto, null, 2)}`}
        </pre>
      </div>

      <div className="test-card" style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)' }}>
        <h3>TenantUpdateDto Interface</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          DTO for updating a tenant. Only name is updatable (no admin credentials needed).
        </p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
{`interface TenantUpdateDto extends TenantCreateOrUpdateDtoBase {
  name: string;        // New tenant name
  extraProperties: {}; // Custom properties
}

// Example:
${JSON.stringify(demoUpdateDto, null, 2)}`}
        </pre>
      </div>

      <div className="test-card" style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)' }}>
        <h3>GetTenantsInput Interface</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          Input parameters for listing tenants. Extends <code>PagedAndSortedResultRequestDto</code>.
        </p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
{`interface GetTenantsInput extends PagedAndSortedResultRequestDto {
  filter: string;          // Search filter
  maxResultCount?: number; // Page size
  skipCount?: number;      // Offset
  sorting?: string;        // Sort expression
}

// Example:
${JSON.stringify(demoGetTenantsInput, null, 2)}`}
        </pre>
      </div>

      <div className="test-card" style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.2)' }}>
        <h3>Removed Types <span style={{ color: '#f44', fontSize: '12px' }}>(Removed in v4.0.0)</span></h3>
        <p style={{ fontSize: '14px', color: '#f87171', marginBottom: '8px' }}>
          The following deprecated types have been <strong>removed</strong> in v4.0.0:
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Removed Type</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Replacement</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ background: 'rgba(248,113,113,0.1)' }}>
              <td style={{ padding: '8px' }}><code style={{ textDecoration: 'line-through' }}>TenantManagement.Response</code></td>
              <td><code>PagedResultDto&lt;TenantDto&gt;</code></td>
              <td style={{ color: '#f44' }}>REMOVED</td>
            </tr>
            <tr style={{ background: 'rgba(248,113,113,0.1)' }}>
              <td style={{ padding: '8px' }}><code style={{ textDecoration: 'line-through' }}>TenantManagement.Item</code></td>
              <td><code>TenantDto</code></td>
              <td style={{ color: '#f44' }}>REMOVED</td>
            </tr>
            <tr style={{ background: 'rgba(248,113,113,0.1)' }}>
              <td style={{ padding: '8px' }}><code style={{ textDecoration: 'line-through' }}>TenantManagement.AddRequest</code></td>
              <td><code>TenantCreateDto</code></td>
              <td style={{ color: '#f44' }}>REMOVED</td>
            </tr>
            <tr style={{ background: 'rgba(248,113,113,0.1)' }}>
              <td style={{ padding: '8px' }}><code style={{ textDecoration: 'line-through' }}>TenantManagement.UpdateRequest</code></td>
              <td><code>TenantUpdateDto</code></td>
              <td style={{ color: '#f44' }}>REMOVED</td>
            </tr>
            <tr style={{ background: 'rgba(248,113,113,0.1)' }}>
              <td style={{ padding: '8px' }}><code style={{ textDecoration: 'line-through' }}>TenantManagement.DefaultConnectionStringRequest</code></td>
              <td><code>TenantService.updateDefaultConnectionString()</code></td>
              <td style={{ color: '#f44' }}>REMOVED</td>
            </tr>
            <tr style={{ background: 'rgba(248,113,113,0.1)' }}>
              <td style={{ padding: '8px' }}><code style={{ textDecoration: 'line-through' }}>TenantManagementService</code></td>
              <td><code>TenantService</code></td>
              <td style={{ color: '#f44' }}>REMOVED</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card" style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)' }}>
        <h3>Usage Example</h3>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
{`import { TenantService, TenantCreateDto, TenantDto, GetTenantsInput } from '@abpjs/tenant-management';
import { getRestService } from '@abpjs/core';

// Create service instance
const tenantService = new TenantService(getRestService());

// List tenants with pagination
const input: GetTenantsInput = {
  filter: '',
  maxResultCount: 10,
  skipCount: 0,
};
const result = await tenantService.getList(input);
console.log(\`Found \${result.totalCount} tenants\`);

// Create a new tenant
const createInput: TenantCreateDto = {
  name: 'New Tenant',
  adminEmailAddress: 'admin@newtenant.com',
  adminPassword: 'SecurePassword123!',
  extraProperties: {},
};
const newTenant: TenantDto = await tenantService.create(createInput);

// Update tenant
await tenantService.update(newTenant.id, {
  name: 'Updated Name',
  extraProperties: {},
});

// Delete tenant
await tenantService.delete(newTenant.id);`}
        </pre>
      </div>
    </div>
  )
}

function TestV400Features() {
  return (
    <div className="test-section">
      <h2>What's New in v4.0.0</h2>

      <div className="test-card" style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.2)' }}>
        <h3>Breaking Changes</h3>
        <ul style={{ fontSize: '14px', lineHeight: '2' }}>
          <li><strong>TenantManagementService removed</strong> - Use <code>TenantService</code> (proxy) instead</li>
          <li><strong>Deprecated types removed</strong> - <code>TenantManagement.Response</code>, <code>Item</code>, <code>AddRequest</code>, <code>UpdateRequest</code>, <code>DefaultConnectionStringRequest</code></li>
          <li><strong>updateTenant signature changed</strong> - Now takes <code>(id, data)</code> instead of <code>(&#123; id, name &#125;)</code></li>
          <li><strong>dispatchUpdateTenant signature changed</strong> - Now takes <code>(id, input)</code> instead of <code>(body)</code></li>
          <li><strong>State service updateFromResponse removed</strong> - Was using deprecated Response type</li>
          <li><strong>TenantsComponentInputs callbacks</strong> - Now use <code>TenantDto</code> instead of <code>TenantManagement.Item</code></li>
          <li><strong>extraProperties now optional</strong> - In <code>TenantDto</code> and <code>TenantCreateOrUpdateDtoBase</code></li>
        </ul>
      </div>

      <div className="test-card" style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)' }}>
        <h3>Migration Guide</h3>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
{`// 1. Replace TenantManagementService with TenantService
// Before:
// import { TenantManagementService } from '@abpjs/tenant-management';
// const service = new TenantManagementService(restService);
// After:
import { TenantService } from '@abpjs/tenant-management';
const service = new TenantService(restService);

// 2. Replace deprecated types with proxy DTOs
// TenantManagement.Item      -> TenantDto
// TenantManagement.AddRequest -> TenantCreateDto
// TenantManagement.UpdateRequest -> TenantUpdateDto
// TenantManagement.Response  -> PagedResultDto<TenantDto>

// 3. Update updateTenant calls (ID is now a separate parameter)
// Before: updateTenant({ id: tenantId, name: tenantName })
// After:  updateTenant(tenantId, { name: tenantName })

// 4. Update dispatchUpdateTenant calls
// Before: stateService.dispatchUpdateTenant({ id, name })
// After:  stateService.dispatchUpdateTenant(id, { name })`}
        </pre>
      </div>
    </div>
  )
}

export function TestTenantManagementPage() {
  return (
    <div>
      <h1>@abpjs/tenant-management Tests v4.0.0</h1>
      <p>Testing tenant management modal, hooks, and TenantService for creating, updating, and managing tenants.</p>
      <p style={{ color: '#f44', fontSize: '0.9rem' }}>Version 4.0.0 - TenantManagementService removed, deprecated types removed, proxy-first API</p>

      {/* v4.0.0 Features */}
      <h2 style={{ marginTop: '2rem', borderTop: '2px solid #f44', paddingTop: '1rem' }}>
        v4.0.0 Features
      </h2>
      <TestV400Features />

      {/* v3.2.0 Features */}
      <h2 style={{ marginTop: '2rem', borderTop: '2px solid #3b82f6', paddingTop: '1rem' }}>
        v3.2.0 Features
      </h2>
      <TestV320Features />

      {/* v3.1.0 Features */}
      <h2 style={{ marginTop: '2rem', borderTop: '2px solid #9b59b6', paddingTop: '1rem' }}>
        v3.1.0 Changes
      </h2>
      <TestV310Features />

      {/* v3.0.0 Features */}
      <h2 style={{ marginTop: '2rem', borderTop: '2px solid #22c55e', paddingTop: '1rem' }}>
        v3.0.0 Features
      </h2>
      <TestV300Features />
      <TestV270Features />
      <TestV240Features />
      <TestTenantModal />
      <TestTenantHook />
      <TestTenantManagementStateService />
      <TestComponentInterfaces />
      <TestRouteConstants />
      <TestApiEndpoints />
    </div>
  )
}

export default TestTenantManagementPage
