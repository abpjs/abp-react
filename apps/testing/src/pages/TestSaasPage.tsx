/**
 * Test page for @abpjs/saas package
 * Tests: TenantsComponent, EditionsComponent, useTenants, useEditions hooks
 * @since 2.0.0
 * @updated 2.1.1 - Dependency updates (no new features)
 * @updated 2.2.0 - Added openFeaturesModal for editions and tenants
 * @updated 2.4.0 - Added apiName property, eSaasComponents enum, updated CreateTenantRequest/UpdateTenantRequest
 * @updated 2.7.0 - Changed eSaasComponents to const object, added eSaasRouteNames, SaasComponentKey, SaasRouteNameKey types
 */
import { useState, useEffect } from 'react'
import { useAuth, useRestService } from '@abpjs/core'
import {
  TenantsComponent,
  EditionsComponent,
  useTenants,
  useEditions,
  SAAS_ROUTES,
  SaasStateService,
  SaasService,
  eSaasComponents,
  eSaasRouteNames,
  type Saas,
  type SaasComponentKey,
  type SaasRouteNameKey,
} from '@abpjs/saas'
import { FeatureManagementModal } from '@abpjs/feature-management'

// Type annotation to ensure SaasStateService is used
const _stateServiceType: typeof SaasStateService | null = null
void _stateServiceType

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
    // v2.2.0 features modal state
    visibleFeatures,
    featuresProviderKey,
    fetchTenants,
    getTenantById,
    createTenant,
    getDefaultConnectionString,
    updateDefaultConnectionString,
    deleteDefaultConnectionString,
    setSelectedTenant,
    reset,
    // v2.2.0 features modal methods
    openFeaturesModal,
    onVisibleFeaturesChange,
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
        <p>visibleFeatures (v2.2.0): {visibleFeatures ? 'true' : 'false'}</p>
        <p>featuresProviderKey (v2.2.0): {featuresProviderKey || '(empty)'}</p>
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
                        style={{ marginRight: '0.5rem', padding: '4px 8px' }}
                      >
                        Fetch
                      </button>
                      <button
                        onClick={() => openFeaturesModal(`T:${tenant.id}`)}
                        style={{ padding: '4px 8px', background: '#4a9' }}
                        title="v2.2.0 - Open features modal"
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
        <h3>Reset State</h3>
        <button onClick={reset} style={{ background: '#f44', color: 'white' }}>
          Reset All State
        </button>
      </div>

      {/* v2.2.0 Features Modal */}
      <FeatureManagementModal
        providerName="T"
        providerKey={featuresProviderKey.replace('T:', '')}
        visible={visibleFeatures}
        onVisibleChange={onVisibleFeaturesChange}
        onSave={() => {
          console.log('Tenant features saved!')
        }}
      />
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
    // v2.2.0 features modal state
    visibleFeatures,
    featuresProviderKey,
    fetchEditions,
    getEditionById,
    createEdition,
    fetchUsageStatistics,
    setSelectedEdition,
    reset,
    // v2.2.0 features modal methods
    openFeaturesModal,
    onVisibleFeaturesChange,
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
        <p>visibleFeatures (v2.2.0): {visibleFeatures ? 'true' : 'false'}</p>
        <p>featuresProviderKey (v2.2.0): {featuresProviderKey || '(empty)'}</p>
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
                        style={{ marginRight: '0.5rem', padding: '4px 8px' }}
                      >
                        Fetch
                      </button>
                      <button
                        onClick={() => openFeaturesModal(`E:${edition.id}`)}
                        style={{ padding: '4px 8px', background: '#4a9' }}
                        title="v2.2.0 - Open features modal"
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
        <h3>Reset State</h3>
        <button onClick={reset} style={{ background: '#f44', color: 'white' }}>
          Reset All State
        </button>
      </div>

      {/* v2.2.0 Features Modal */}
      <FeatureManagementModal
        providerName="E"
        providerKey={featuresProviderKey.replace('E:', '')}
        visible={visibleFeatures}
        onVisibleChange={onVisibleFeaturesChange}
        onSave={() => {
          console.log('Edition features saved!')
        }}
      />
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

function TestSaasStateServiceSection() {
  return (
    <div className="test-section">
      <h2>SaasStateService (v2.0.0)</h2>

      <div className="test-card">
        <h3>Overview</h3>
        <p>
          The <code>SaasStateService</code> provides a stateful facade over SaaS operations,
          maintaining internal state that mirrors the Angular NGXS store pattern.
          It has <strong>12 dispatch methods</strong> and <strong>6 getter methods</strong>.
        </p>
      </div>

      <div className="test-card">
        <h3>Dispatch Methods</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Category</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Method</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }} rowSpan={6}>Tenants</td>
              <td style={{ padding: '8px' }}>dispatchGetTenants</td>
              <td>Fetch tenants with pagination</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>dispatchGetTenantById</td>
              <td>Fetch a single tenant by ID</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>dispatchCreateTenant</td>
              <td>Create a new tenant</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>dispatchUpdateTenant</td>
              <td>Update an existing tenant</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>dispatchDeleteTenant</td>
              <td>Delete a tenant</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>dispatchGetLatestTenants</td>
              <td>Fetch latest tenants for dashboard</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }} rowSpan={5}>Editions</td>
              <td style={{ padding: '8px' }}>dispatchGetEditions</td>
              <td>Fetch editions with pagination</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>dispatchGetEditionById</td>
              <td>Fetch a single edition by ID</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>dispatchCreateEdition</td>
              <td>Create a new edition</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>dispatchUpdateEdition</td>
              <td>Update an existing edition</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>dispatchDeleteEdition</td>
              <td>Delete an edition</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>Statistics</td>
              <td style={{ padding: '8px' }}>dispatchGetUsageStatistics</td>
              <td>Fetch usage statistics</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>Getter Methods</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Method</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Return Type</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>getTenants()</td>
              <td style={{ padding: '8px' }}>Tenant[]</td>
              <td>Get tenants from state</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>getLatestTenants()</td>
              <td style={{ padding: '8px' }}>Tenant[]</td>
              <td>Get latest tenants from state (v2.0.0)</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>getTenantsTotalCount()</td>
              <td style={{ padding: '8px' }}>number</td>
              <td>Get total count of tenants</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>getEditions()</td>
              <td style={{ padding: '8px' }}>Edition[]</td>
              <td>Get editions from state</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>getEditionsTotalCount()</td>
              <td style={{ padding: '8px' }}>number</td>
              <td>Get total count of editions</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>getUsageStatistics()</td>
              <td style={{ padding: '8px' }}>Record&lt;string, number&gt;</td>
              <td>Get usage statistics from state</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>Usage Example</h3>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`import { SaasStateService } from '@abpjs/saas';
import { useRestService } from '@abpjs/core';

function MyComponent() {
  const restService = useRestService();
  const stateService = new SaasStateService(restService);

  // Dispatch to fetch tenants
  await stateService.dispatchGetTenants({ maxResultCount: 10 });

  // Access the result from state
  const tenants = stateService.getTenants();
  const totalCount = stateService.getTenantsTotalCount();

  // Fetch latest tenants for dashboard widget
  await stateService.dispatchGetLatestTenants();
  const latestTenants = stateService.getLatestTenants();

  // Dispatch to fetch editions and statistics
  await stateService.dispatchGetEditions();
  await stateService.dispatchGetUsageStatistics();

  // Create a new tenant
  await stateService.dispatchCreateTenant({
    name: 'New Tenant',
    editionId: 'edition-id',
    adminEmailAddress: 'admin@newtenant.com',
    adminPassword: 'Password123!',
  });
}`}
        </pre>
      </div>

      <div className="test-card">
        <h3>New v2.0.0 Features</h3>
        <ul style={{ marginLeft: '1.5rem' }}>
          <li><code>getLatestTenants()</code> - New getter for dashboard widget</li>
          <li><code>dispatchGetLatestTenants()</code> - New dispatch for fetching latest tenants</li>
          <li>All dispatch methods automatically refresh lists after create/update/delete</li>
        </ul>
      </div>
    </div>
  )
}

function TestV220FeaturesSection() {
  return (
    <div className="test-section">
      <h2>v2.2.0 New Features</h2>

      <div className="test-card">
        <h3>openFeaturesModal for Editions and Tenants</h3>
        <p>
          Version 2.2.0 adds the <code>openFeaturesModal(providerKey)</code> method to both
          <code> useEditions</code> and <code>useTenants</code> hooks, enabling programmatic
          control of the feature management modal.
        </p>
      </div>

      <div className="test-card">
        <h3>New Hook State (useEditions &amp; useTenants)</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Property</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>visibleFeatures</code></td>
              <td style={{ padding: '8px' }}>boolean</td>
              <td>Whether the features modal is visible</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>featuresProviderKey</code></td>
              <td style={{ padding: '8px' }}>string</td>
              <td>The provider key for the current features modal (e.g., "E:edition-id" or "T:tenant-id")</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>New Hook Methods (useEditions &amp; useTenants)</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Method</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Signature</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>openFeaturesModal</code></td>
              <td style={{ padding: '8px' }}>(providerKey: string) =&gt; void</td>
              <td>Opens the features modal with the specified provider key</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>onVisibleFeaturesChange</code></td>
              <td style={{ padding: '8px' }}>(visible: boolean) =&gt; void</td>
              <td>Handler for modal visibility changes (clears providerKey when closed)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>Usage Example</h3>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`import { useEditions, useTenants } from '@abpjs/saas';
import { FeatureManagementModal } from '@abpjs/feature-management';

function EditionsWithFeatures() {
  const {
    editions,
    visibleFeatures,
    featuresProviderKey,
    openFeaturesModal,
    onVisibleFeaturesChange,
  } = useEditions();

  return (
    <>
      {editions.map(edition => (
        <button
          key={edition.id}
          onClick={() => openFeaturesModal(\`E:\${edition.id}\`)}
        >
          Manage Features for {edition.displayName}
        </button>
      ))}

      <FeatureManagementModal
        providerName="E"
        providerKey={featuresProviderKey.replace('E:', '')}
        visible={visibleFeatures}
        onVisibleChange={onVisibleFeaturesChange}
      />
    </>
  );
}

// Same pattern works for useTenants with providerName="T"`}
        </pre>
      </div>
    </div>
  )
}

/**
 * Test section for v2.7.0 features: eSaasRouteNames, SaasComponentKey, SaasRouteNameKey types
 */
function TestV270Features() {
  // Type-safe component key
  const editionsKey: SaasComponentKey = eSaasComponents.Editions
  const tenantsKey: SaasComponentKey = eSaasComponents.Tenants

  // Type-safe route name key
  const adminRoute: SaasRouteNameKey = eSaasRouteNames.Administration
  const saasRoute: SaasRouteNameKey = eSaasRouteNames.Saas
  const tenantsRoute: SaasRouteNameKey = eSaasRouteNames.Tenants
  const editionsRoute: SaasRouteNameKey = eSaasRouteNames.Editions

  return (
    <div className="test-section">
      <h2>v2.7.0 Features <span style={{ fontSize: '14px', color: '#4ade80' }}>(NEW)</span></h2>

      <div className="test-card">
        <h3>eSaasRouteNames Const Object (v2.7.0)</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          New const object for route name identifiers used in localization and navigation.
          Follows the <code>AbpModule::KeyName</code> pattern for localization keys.
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
              <td style={{ padding: '8px' }}><code>Administration</code></td>
              <td style={{ padding: '8px' }}><code>{adminRoute}</code></td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>Saas</code></td>
              <td style={{ padding: '8px' }}><code>{saasRoute}</code></td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>Tenants</code></td>
              <td style={{ padding: '8px' }}><code>{tenantsRoute}</code></td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>Editions</code></td>
              <td style={{ padding: '8px' }}><code>{editionsRoute}</code></td>
            </tr>
          </tbody>
        </table>
        <pre style={{ marginTop: '0.5rem', padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
{`// Usage - Route configuration
import { eSaasRouteNames } from '@abpjs/saas';

const routes = {
  [eSaasRouteNames.Tenants]: { path: '/saas/tenants' },
  [eSaasRouteNames.Editions]: { path: '/saas/editions' },
};`}
        </pre>
      </div>

      <div className="test-card">
        <h3>Type-Safe Keys (v2.7.0)</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          New type exports for compile-time type safety when working with component and route name keys.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Values</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>SaasComponentKey</code></td>
              <td style={{ padding: '8px' }}><code>'{editionsKey}' | '{tenantsKey}'</code></td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>SaasRouteNameKey</code></td>
              <td style={{ padding: '8px' }}>
                <code>'{eSaasRouteNames.Administration}' | '{eSaasRouteNames.Saas}' | '{eSaasRouteNames.Tenants}' | '{eSaasRouteNames.Editions}'</code>
              </td>
            </tr>
          </tbody>
        </table>
        <pre style={{ marginTop: '0.5rem', padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
{`// Type-safe component key
import { eSaasComponents, type SaasComponentKey } from '@abpjs/saas';

const key: SaasComponentKey = eSaasComponents.Editions;
// TypeScript error: 'invalid' is not assignable to SaasComponentKey
// const invalid: SaasComponentKey = 'invalid';

// Type-safe route configuration
import { eSaasRouteNames, type SaasRouteNameKey } from '@abpjs/saas';

const routeKey: SaasRouteNameKey = eSaasRouteNames.Tenants;
const routePaths: Record<SaasRouteNameKey, string> = {
  '${eSaasRouteNames.Administration}': '/admin',
  '${eSaasRouteNames.Saas}': '/admin/saas',
  '${eSaasRouteNames.Tenants}': '/admin/saas/tenants',
  '${eSaasRouteNames.Editions}': '/admin/saas/editions',
};`}
        </pre>
      </div>

      <div className="test-card">
        <h3>Const Object Pattern (v2.7.0)</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          In v2.7.0, <code>eSaasComponents</code> was changed from an enum to a const object with <code>as const</code>.
          This provides better tree-shaking and aligns with modern TypeScript practices.
        </p>
        <pre style={{ marginTop: '0.5rem', padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
{`// Before (v2.4.0) - enum
enum eSaasComponents {
  Editions = 'Saas.EditionsComponent',
  Tenants = 'Saas.TenantsComponent',
}

// After (v2.7.0) - const object
export const eSaasComponents = {
  Editions: 'Saas.EditionsComponent',
  Tenants: 'Saas.TenantsComponent',
} as const;

export type SaasComponentKey =
  (typeof eSaasComponents)[keyof typeof eSaasComponents];`}
        </pre>
      </div>

      <div className="test-card">
        <h3>v2.7.0 API Reference</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Export</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>eSaasComponents</code></td>
              <td style={{ padding: '8px' }}>Const Object</td>
              <td style={{ padding: '8px' }}>Component identifiers (changed from enum)</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>SaasComponentKey</code></td>
              <td style={{ padding: '8px' }}>Type</td>
              <td style={{ padding: '8px' }}>Union type of component key values</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>eSaasRouteNames</code></td>
              <td style={{ padding: '8px' }}>Const Object</td>
              <td style={{ padding: '8px' }}>Route name identifiers for navigation (NEW)</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>SaasRouteNameKey</code></td>
              <td style={{ padding: '8px' }}>Type</td>
              <td style={{ padding: '8px' }}>Union type of route name values (NEW)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

/**
 * Test section for v2.4.0 features: apiName property, eSaasComponents enum, model changes
 */
function TestV240Features() {
  const restService = useRestService()
  const [service] = useState(() => new SaasService(restService))

  return (
    <div className="test-section">
      <h2>v2.4.0 Features <span style={{ fontSize: '14px', color: '#4ade80' }}>(NEW)</span></h2>

      <div className="test-card">
        <h3>apiName Property (v2.4.0)</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          The <code>SaasService</code> now has an <code>apiName</code> property that defaults to <code>'default'</code>.
          This is used for API routing in multi-API configurations.
        </p>
        <div style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #333' }}>
          <p><strong>SaasService.apiName:</strong> <code>{service.apiName}</code></p>
        </div>
        <pre style={{ marginTop: '0.5rem', padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
{`// Usage
import { SaasService } from '@abpjs/saas';

const service = new SaasService(restService);
console.log(service.apiName); // 'default'`}
        </pre>
      </div>

      <div className="test-card">
        <h3>eSaasComponents Enum (v2.4.0)</h3>
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
              <td style={{ padding: '8px' }}><code>Editions</code></td>
              <td style={{ padding: '8px' }}><code>{eSaasComponents.Editions}</code></td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>Tenants</code></td>
              <td style={{ padding: '8px' }}><code>{eSaasComponents.Tenants}</code></td>
            </tr>
          </tbody>
        </table>
        <pre style={{ marginTop: '0.5rem', padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
{`// Usage - Component registration
import { eSaasComponents } from '@abpjs/saas';

const componentRegistry = {};
componentRegistry[eSaasComponents.Editions] = EditionsComponent;
componentRegistry[eSaasComponents.Tenants] = TenantsComponent;`}
        </pre>
      </div>

      <div className="test-card">
        <h3>Model Changes (v2.4.0)</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          Breaking changes to tenant request types:
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Change</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>CreateTenantRequest</code></td>
              <td style={{ padding: '8px' }}><code>adminEmailAddress</code> and <code>adminPassword</code> are now <strong>required</strong></td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>UpdateTenantRequest</code></td>
              <td style={{ padding: '8px' }}>Now uses <code>Omit&lt;Tenant, 'editionName'&gt;</code> pattern</td>
            </tr>
          </tbody>
        </table>
        <pre style={{ marginTop: '0.5rem', padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
{`// CreateTenantRequest v2.4.0 (breaking change)
interface CreateTenantRequest {
  adminEmailAddress: string;  // Required
  adminPassword: string;      // Required
  name: string;
  editionId?: string;
}

// UpdateTenantRequest v2.4.0
type UpdateTenantRequest = Omit<Tenant, 'editionName'>;
// { id: string; name: string; editionId?: string; concurrencyStamp?: string; }`}
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
              <td style={{ padding: '8px' }}><code>eSaasComponents</code></td>
              <td style={{ padding: '8px' }}>Enum</td>
              <td style={{ padding: '8px' }}>Component identifiers (Editions, Tenants)</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>CreateTenantRequest</code></td>
              <td style={{ padding: '8px' }}>Interface</td>
              <td style={{ padding: '8px' }}>Admin credentials now required</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>UpdateTenantRequest</code></td>
              <td style={{ padding: '8px' }}>Type</td>
              <td style={{ padding: '8px' }}>Now excludes editionName from Tenant</td>
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
            <tr>
              <td style={{ padding: '8px' }}><code>GET</code></td>
              <td style={{ padding: '8px' }}><code>/api/saas/tenants/latest</code></td>
              <td>Get latest tenants (v2.0.0)</td>
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
      <h1>@abpjs/saas Tests (v2.7.0)</h1>
      <p style={{ marginBottom: '8px' }}>Testing SaaS module for tenant and edition management.</p>
      <p style={{ fontSize: '14px', color: '#888', marginBottom: '16px' }}>
        Version 2.7.0 - Changed eSaasComponents to const object, added eSaasRouteNames, SaasComponentKey, SaasRouteNameKey types
      </p>
      <p style={{ fontSize: '14px', color: '#888' }}>
        This package provides components for multi-tenant SaaS applications with tenant management,
        edition management, and connection string management.
      </p>

      <TestV270Features />
      <TestV240Features />
      <TestV220FeaturesSection />
      <TestTenantsComponent />
      <TestEditionsComponent />
      <TestTenantsHook />
      <TestEditionsHook />
      <TestSaasStateServiceSection />
      <TestRouteConstants />
      <TestApiEndpoints />
    </div>
  )
}

export default TestSaasPage
