/**
 * Test page for @abpjs/saas package
 * Tests: TenantsComponent, EditionsComponent, useTenants, useEditions hooks
 */
import { useState, useEffect } from 'react'
import { useAuth } from '@abpjs/core'
import {
  TenantsComponent,
  EditionsComponent,
  useTenants,
  useEditions,
  SAAS_ROUTES,
  type Saas,
} from '@abpjs/saas'
import { FeatureManagementModal } from '@abpjs/feature-management'

function TestTenantsComponent() {
  const { isAuthenticated } = useAuth()

  return (
    <div className="test-section">
      <h2>TenantsComponent</h2>

      <div className="test-card">
        <h3>Full Tenant Management UI</h3>
        <p>This component provides a complete tenant management interface with:</p>
        <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
          <li>Paginated tenant list with search</li>
          <li>Create/Edit tenant modals</li>
          <li>Edition selection</li>
          <li>Connection string management</li>
          <li>Delete confirmation</li>
        </ul>
        {!isAuthenticated && (
          <p style={{ color: '#f88', marginBottom: '1rem' }}>
            ⚠️ You must be authenticated to use SaaS features
          </p>
        )}
      </div>

      <div className="test-card">
        <TenantsComponent
          onTenantCreated={(tenant) => {
            console.log('Tenant created:', tenant)
          }}
          onTenantUpdated={(tenant) => {
            console.log('Tenant updated:', tenant)
          }}
          onTenantDeleted={(id) => {
            console.log('Tenant deleted:', id)
          }}
        />
      </div>
    </div>
  )
}

function TestEditionsComponent() {
  const { isAuthenticated } = useAuth()
  const [featureModalVisible, setFeatureModalVisible] = useState(false)
  const [featureEditionId, setFeatureEditionId] = useState('')

  return (
    <div className="test-section">
      <h2>EditionsComponent</h2>

      <div className="test-card">
        <h3>Full Edition Management UI</h3>
        <p>This component provides a complete edition management interface with:</p>
        <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
          <li>Paginated edition list with search</li>
          <li>Create/Edit edition modals</li>
          <li>Feature management integration</li>
          <li>Delete confirmation</li>
        </ul>
        {!isAuthenticated && (
          <p style={{ color: '#f88', marginBottom: '1rem' }}>
            ⚠️ You must be authenticated to use SaaS features
          </p>
        )}
      </div>

      <div className="test-card">
        <EditionsComponent
          onEditionCreated={(edition) => {
            console.log('Edition created:', edition)
          }}
          onEditionUpdated={(edition) => {
            console.log('Edition updated:', edition)
          }}
          onEditionDeleted={(id) => {
            console.log('Edition deleted:', id)
          }}
          onManageFeatures={(editionId: string) => {
            setFeatureEditionId(editionId)
            setFeatureModalVisible(true)
          }}
        />
      </div>

      <FeatureManagementModal
        providerName="E"
        providerKey={featureEditionId}
        visible={featureModalVisible}
        onVisibleChange={setFeatureModalVisible}
        onSave={() => {
          console.log('Edition features saved!')
        }}
      />
    </div>
  )
}

function TestTenantsHook() {
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
    fetchTenants,
    getTenantById,
    createTenant,
    getDefaultConnectionString,
    updateDefaultConnectionString,
    deleteDefaultConnectionString,
    setSelectedTenant,
    reset,
  } = useTenants()

  const [testTenantId, setTestTenantId] = useState('')
  const [testTenantName, setTestTenantName] = useState('')
  const [testConnectionString, setTestConnectionString] = useState('')

  // Fetch tenants on mount (only if authenticated)
  useEffect(() => {
    if (isAuthenticated) {
      fetchTenants({ getEditionNames: true })
    }
  }, [fetchTenants, isAuthenticated])

  return (
    <div className="test-section">
      <h2>useTenants Hook</h2>

      <div className="test-card">
        <h3>Fetch Tenants</h3>
        <button onClick={() => fetchTenants({ getEditionNames: true })} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Fetch All Tenants'}
        </button>
        <p style={{ marginTop: '0.5rem', fontSize: '14px', color: '#888' }}>
          Fetches all tenants from /api/saas/tenants
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
            onClick={async () => {
              if (testTenantId) {
                await getTenantById(testTenantId)
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
                const result = await createTenant({
                  name: testTenantName,
                  adminEmailAddress: 'admin@tenant.test',
                  adminPassword: 'Test1234!'
                })
                if (result.success) {
                  setTestTenantName('')
                  fetchTenants({ getEditionNames: true })
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
                  const result = await getDefaultConnectionString(testTenantId)
                  if (result.success) {
                    setTestConnectionString(result.data || '')
                  }
                }
              }}
              disabled={!testTenantId || isLoading}
            >
              Fetch
            </button>
            <button
              onClick={async () => {
                if (testTenantId && testConnectionString) {
                  const result = await updateDefaultConnectionString({
                    id: testTenantId,
                    defaultConnectionString: testConnectionString
                  })
                  if (result.success) {
                    console.log('Connection string updated')
                  }
                }
              }}
              disabled={!testTenantId || !testConnectionString || isLoading}
            >
              Update
            </button>
            <button
              onClick={async () => {
                if (testTenantId) {
                  await deleteDefaultConnectionString(testTenantId)
                  setTestConnectionString('')
                }
              }}
              disabled={!testTenantId || isLoading}
            >
              Delete (Use Shared DB)
            </button>
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
        {!isAuthenticated && (
          <p style={{ color: '#f88', marginTop: '0.5rem' }}>
            ⚠️ You must be authenticated to use SaaS features
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
                  <th style={{ textAlign: 'left', padding: '8px' }}>Edition</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((tenant: Saas.Tenant) => (
                  <tr key={tenant.id} style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '8px', fontSize: '12px' }}>{tenant.id}</td>
                    <td style={{ padding: '8px' }}>{tenant.name}</td>
                    <td style={{ padding: '8px' }}>{tenant.editionName || '-'}</td>
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
                          getTenantById(tenant.id)
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
      </div>
    </div>
  )
}

function TestEditionsHook() {
  const { isAuthenticated } = useAuth()
  const {
    editions,
    totalCount,
    selectedEdition,
    isLoading,
    error,
    usageStatistics,
    fetchEditions,
    getEditionById,
    createEdition,
    fetchUsageStatistics,
    setSelectedEdition,
    reset,
  } = useEditions()

  const [, setTestEditionId] = useState('')
  const [testEditionName, setTestEditionName] = useState('')

  // Fetch editions on mount (only if authenticated)
  useEffect(() => {
    if (isAuthenticated) {
      fetchEditions()
      fetchUsageStatistics()
    }
  }, [fetchEditions, fetchUsageStatistics, isAuthenticated])

  return (
    <div className="test-section">
      <h2>useEditions Hook</h2>

      <div className="test-card">
        <h3>Fetch Editions</h3>
        <button onClick={() => fetchEditions()} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Fetch All Editions'}
        </button>
        <button onClick={() => fetchUsageStatistics()} disabled={isLoading} style={{ marginLeft: '0.5rem' }}>
          Fetch Usage Statistics
        </button>
        <p style={{ marginTop: '0.5rem', fontSize: '14px', color: '#888' }}>
          Fetches editions from /api/saas/editions
        </p>
      </div>

      <div className="test-card">
        <h3>Create Edition</h3>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
          <input
            type="text"
            placeholder="Edition Display Name"
            value={testEditionName}
            onChange={(e) => setTestEditionName(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333',
              flex: 1
            }}
          />
          <button
            onClick={async () => {
              if (testEditionName) {
                const result = await createEdition({ displayName: testEditionName })
                if (result.success) {
                  setTestEditionName('')
                  fetchEditions()
                }
              }
            }}
            disabled={!testEditionName || isLoading}
          >
            Create Edition
          </button>
        </div>
      </div>

      <div className="test-card">
        <h3>Hook State</h3>
        <p>isLoading: {isLoading ? 'true' : 'false'}</p>
        <p>error: {error || 'null'}</p>
        <p>editions count: {editions?.length ?? 0}</p>
        <p>totalCount: {totalCount}</p>
        <p>selectedEdition: {selectedEdition ? `${selectedEdition.displayName} (${selectedEdition.id})` : 'none'}</p>
        <p>usageStatistics: {JSON.stringify(usageStatistics)}</p>
        {!isAuthenticated && (
          <p style={{ color: '#f88', marginTop: '0.5rem' }}>
            ⚠️ You must be authenticated to use SaaS features
          </p>
        )}
      </div>

      {editions && editions.length > 0 && (
        <div className="test-card">
          <h3>Editions List ({editions.length} of {totalCount})</h3>
          <div style={{ maxHeight: '300px', overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <th style={{ textAlign: 'left', padding: '8px' }}>ID</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Display Name</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {editions.map((edition: Saas.Edition) => (
                  <tr key={edition.id} style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '8px', fontSize: '12px' }}>{edition.id}</td>
                    <td style={{ padding: '8px' }}>{edition.displayName}</td>
                    <td style={{ padding: '8px' }}>
                      <button
                        onClick={() => setSelectedEdition(edition)}
                        style={{ marginRight: '0.5rem', padding: '4px 8px' }}
                      >
                        Select
                      </button>
                      <button
                        onClick={() => {
                          setTestEditionId(edition.id)
                          getEditionById(edition.id)
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
      </div>
    </div>
  )
}

function TestRouteConstants() {
  return (
    <div className="test-section">
      <h2>Route Constants</h2>

      <div className="test-card">
        <h3>SAAS_ROUTES</h3>
        <p>Route configuration for the SaaS module:</p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
          {JSON.stringify(SAAS_ROUTES, null, 2)}
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
        <h3>Tenant Endpoints</h3>
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
              <td style={{ padding: '8px' }}><code>/api/saas/tenants</code></td>
              <td>Fetch all tenants (paginated)</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>GET</code></td>
              <td style={{ padding: '8px' }}><code>/api/saas/tenants/:id</code></td>
              <td>Fetch a specific tenant</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>POST</code></td>
              <td style={{ padding: '8px' }}><code>/api/saas/tenants</code></td>
              <td>Create a new tenant</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>PUT</code></td>
              <td style={{ padding: '8px' }}><code>/api/saas/tenants/:id</code></td>
              <td>Update an existing tenant</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>DELETE</code></td>
              <td style={{ padding: '8px' }}><code>/api/saas/tenants/:id</code></td>
              <td>Delete a tenant</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>GET</code></td>
              <td style={{ padding: '8px' }}><code>/api/saas/tenants/:id/default-connection-string</code></td>
              <td>Get connection string</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>PUT</code></td>
              <td style={{ padding: '8px' }}><code>/api/saas/tenants/:id/default-connection-string</code></td>
              <td>Update connection string</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>DELETE</code></td>
              <td style={{ padding: '8px' }}><code>/api/saas/tenants/:id/default-connection-string</code></td>
              <td>Delete connection string</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>Edition Endpoints</h3>
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
              <td style={{ padding: '8px' }}><code>/api/saas/editions</code></td>
              <td>Fetch all editions</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>GET</code></td>
              <td style={{ padding: '8px' }}><code>/api/saas/editions/:id</code></td>
              <td>Fetch a specific edition</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>POST</code></td>
              <td style={{ padding: '8px' }}><code>/api/saas/editions</code></td>
              <td>Create a new edition</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>PUT</code></td>
              <td style={{ padding: '8px' }}><code>/api/saas/editions/:id</code></td>
              <td>Update an edition</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>DELETE</code></td>
              <td style={{ padding: '8px' }}><code>/api/saas/editions/:id</code></td>
              <td>Delete an edition</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>GET</code></td>
              <td style={{ padding: '8px' }}><code>/api/saas/editions/statistics/usage-statistic</code></td>
              <td>Get usage statistics</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function TestSaasPage() {
  return (
    <div>
      <h1>@abpjs/saas Tests</h1>
      <p>Testing SaaS module for tenant and edition management.</p>
      <p style={{ fontSize: '14px', color: '#888' }}>
        This package provides components for multi-tenant SaaS applications with tenant management,
        edition management, and connection string management.
      </p>

      <TestTenantsComponent />
      <TestEditionsComponent />
      <TestTenantsHook />
      <TestEditionsHook />
      <TestRouteConstants />
      <TestApiEndpoints />
    </div>
  )
}

export default TestSaasPage
