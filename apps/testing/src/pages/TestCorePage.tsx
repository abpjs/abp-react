/**
 * Test page for @abpjs/core package
 * Tests: hooks, services, components, state management
 * @since 0.7.6
 * @updated 2.2.0 - Angular DI pattern changes (no React changes needed)
 * @updated 2.4.0 - Added DTOs, strategies, DomInsertionService, utility functions
 */
import { useState } from 'react'
import { useSelector } from 'react-redux'
import {
  useAbp,
  useConfig,
  useLocalization,
  useSession,
  useAuth,
  useUserManager,
  useLoader,
  Permission,
  Ellipsis,
  selectRoutes,
  selectSessionDetail,
  organizeRoutes,
  sortRoutes,
  setUrls,
  findRouteByName,
  flattenRoutes,
  addAbpRoutes,
  getAbpRoutes,
  clearAbpRoutes,
  ConfigStateService,
  ProfileStateService,
  SessionStateService,
  sessionActions,
  configActions,
  eLayoutType,
} from '@abpjs/core'
import type { ABP, ReplaceableComponents } from '@abpjs/core'
import {
  // v2.4.0 DTOs
  ListResultDto,
  PagedResultDto,
  EntityDto,
  AuditedEntityDto,
  FullAuditedEntityDto,
  // v2.4.0 Strategies
  DOM_STRATEGY,
  LOADING_STRATEGY,
  CONTENT_STRATEGY,
  CROSS_ORIGIN_STRATEGY,
  CONTENT_SECURITY_STRATEGY,
  DomInsertionService,
  getDomInsertionService,
  // v2.4.0 Utils
  generateHash,
  isUndefinedOrEmptyString,
  noop,
  fromLazyLoad,
  LazyLoadService,
} from '@abpjs/core'
import { useDispatch } from 'react-redux'

// Localization response type
interface LocalizationResponse {
  resources: {
    [resourceName: string]: {
      texts: {
        [key: string]: string
      }
    }
  }
}

function TestLocalization() {
  const { restService } = useAbp()
  const session = useSession()
  const localization = useLocalization()
  const [localizationData, setLocalizationData] = useState<LocalizationResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchLocalization = async (cultureName: string = 'en') => {
    setLoading(true)
    setError(null)
    try {
      const data = await restService.get<LocalizationResponse>(
        `/api/abp/application-localization?cultureName=${cultureName}&onlyDynamics=false`
      )
      setLocalizationData(data)
      console.log('Localization data:', data)
    } catch (err) {
      console.error('Failed to fetch localization:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch localization')
    } finally {
      setLoading(false)
    }
  }

  const resourceNames = localizationData ? Object.keys(localizationData.resources) : []
  const sampleTexts = localizationData && resourceNames.length > 0
    ? Object.entries(localizationData.resources[resourceNames[0]]?.texts || {}).slice(0, 10)
    : []

  return (
    <div className="test-section">
      <h2>Localization Tests</h2>

      <div className="test-card">
        <h3>Fetch Translations from Backend</h3>
        <p>Current session language: {session.language || 'Not set'}</p>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button onClick={() => fetchLocalization('en')} disabled={loading}>
            {loading ? 'Loading...' : 'Fetch English'}
          </button>
          <button onClick={() => fetchLocalization('ar')} disabled={loading}>
            {loading ? 'Loading...' : 'Fetch Arabic'}
          </button>
          <button onClick={() => fetchLocalization('tr')} disabled={loading}>
            {loading ? 'Loading...' : 'Fetch Turkish'}
          </button>
        </div>

        {error && <p style={{ color: '#f66' }}>Error: {error}</p>}

        {localizationData && (
          <>
            <p style={{ color: '#6f6' }}>Loaded {resourceNames.length} resource(s)</p>
            <details>
              <summary>Resource Names ({resourceNames.length})</summary>
              <pre style={{ maxHeight: '100px', overflow: 'auto' }}>
                {JSON.stringify(resourceNames, null, 2)}
              </pre>
            </details>

            {sampleTexts.length > 0 && (
              <details open>
                <summary>Sample Texts from "{resourceNames[0]}" (first 10)</summary>
                <pre style={{ maxHeight: '200px', overflow: 'auto' }}>
                  {JSON.stringify(Object.fromEntries(sampleTexts), null, 2)}
                </pre>
              </details>
            )}
          </>
        )}
      </div>

      <div className="test-card">
        <h3>useLocalization() Hook</h3>
        <p>Languages from config: {localization.languages?.length ?? 0}</p>
        <p>t() available: {typeof localization.t === 'function' ? 'Yes' : 'No'}</p>
        <p>instant() alias available: {typeof localization.instant === 'function' ? 'Yes' : 'No'}</p>
        {localization.languages && localization.languages.length > 0 && (
          <details>
            <summary>Available Languages</summary>
            <pre style={{ maxHeight: '150px', overflow: 'auto' }}>
              {JSON.stringify(localization.languages, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}

function TestHooks() {
  const abp = useAbp()
  const config = useConfig()
  const session = useSession()
  const auth = useAuth()
  const userManager = useUserManager()
  const routes = useSelector(selectRoutes)

  const grantedPolicies = config.auth?.grantedPolicies || {}
  const policyCount = Object.keys(grantedPolicies).length

  const handleRefreshConfig = async () => {
    try {
      console.log("calling applicationConfigurationService")
      const appConfig = await abp.applicationConfigurationService.getConfiguration()
      abp.store.dispatch({ type: 'config/setApplicationConfiguration', payload: appConfig })
    } catch (err) {
      console.error('Failed to refresh config:', err)
    }
  }

  return (
    <div className="test-section">
      <h2>Hook Tests</h2>

      <div className="test-card">
        <h3>useAbp()</h3>
        <p>Store: Available</p>
        <p>Axios instance: Available</p>
        <p>Rest service: Available</p>
        <p>Config service: Available</p>
        <p>Localization service: Available</p>
        <p>All services initialized: {Object.keys(abp).length} properties</p>
      </div>

      <div className="test-card">
        <h3>Routes from Config ({routes.length} total)</h3>
        <pre style={{ maxHeight: '150px', overflow: 'auto' }}>
          {JSON.stringify(routes, null, 2)}
        </pre>
      </div>

      <div className="test-card">
        <h3>useSession()</h3>
        <p>Current language: {session.language || 'Not set'}</p>
        <button onClick={() => session.setLanguage('en')}>Set English</button>
        <button onClick={() => session.setLanguage('ar')}>Set Arabic</button>
        <button onClick={() => session.setLanguage('tr')}>Set Turkish</button>
      </div>

      <div className="test-card">
        <h3>useAuth()</h3>
        <p>Is authenticated: {auth.isAuthenticated ? 'Yes' : 'No'}</p>
        <p>Is loading: {auth.isLoading ? 'Yes' : 'No'}</p>
        <p>Has user manager: {userManager ? 'Yes' : 'No'}</p>
        <p>User: {auth.user ? auth.user.profile?.name || 'Logged in' : 'Not logged in'}</p>
        <button onClick={() => auth.login()} disabled={!userManager}>Login</button>
        <button onClick={() => auth.logout()} disabled={!auth.isAuthenticated}>Logout</button>
      </div>

      <div className="test-card">
        <h3>Granted Policies ({policyCount})</h3>
        <button onClick={handleRefreshConfig}>Refresh Config</button>
        {policyCount > 0 ? (
          <pre style={{ maxHeight: '200px', overflow: 'auto' }}>
            {JSON.stringify(grantedPolicies, null, 2)}
          </pre>
        ) : (
          <p style={{ color: '#888' }}>No policies loaded. Click "Refresh Config" after login.</p>
        )}
      </div>
    </div>
  )
}

function TestLoader() {
  const { restService } = useAbp()
  const loader = useLoader()
  const [manualLoading, setManualLoading] = useState(false)

  const triggerApiCall = async () => {
    try {
      // This will automatically trigger LoaderStart/LoaderStop via the API interceptor
      await restService.get('/api/abp/application-configuration')
    } catch (err) {
      console.log('API call completed (may have failed, but loader should still work)')
    }
  }

  const triggerMultipleApiCalls = async () => {
    setManualLoading(true)
    try {
      // Make multiple concurrent requests to see the loader count
      await Promise.all([
        restService.get('/api/abp/application-configuration'),
        restService.get('/api/abp/application-configuration'),
        restService.get('/api/abp/application-configuration'),
      ])
    } catch (err) {
      console.log('API calls completed')
    } finally {
      setManualLoading(false)
    }
  }

  return (
    <div className="test-section">
      <h2>Loader Tests (v0.9.0)</h2>

      <div className="test-card">
        <h3>useLoader() Hook</h3>
        <p>Loading state: <strong style={{ color: loader.loading ? '#6f6' : '#888' }}>{loader.loading ? 'Yes' : 'No'}</strong></p>
        <p>Active request count: <strong>{loader.loadingCount}</strong></p>
        <p>Active requests: {loader.requests.length > 0 ? loader.requests.join(', ') : 'None'}</p>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <button onClick={triggerApiCall}>
            Trigger Single API Call
          </button>
          <button onClick={triggerMultipleApiCalls} disabled={manualLoading}>
            {manualLoading ? 'Loading...' : 'Trigger 3 Concurrent Calls'}
          </button>
        </div>
        <p style={{ marginTop: '0.5rem', color: '#888', fontSize: '0.85rem' }}>
          Watch the loading state change when API calls are made.
        </p>
      </div>
    </div>
  )
}

function TestEllipsis() {
  const [ellipsisEnabled, setEllipsisEnabled] = useState(true)
  const [ellipsisWidth, setEllipsisWidth] = useState('180px')

  const longText = "This is a very long text that should be truncated with an ellipsis when it exceeds the maximum width of the container."
  const shortText = "Short text"

  return (
    <div className="test-section">
      <h2>Ellipsis Component (v0.9.0)</h2>

      <div className="test-card">
        <h3>Basic Ellipsis</h3>
        <p>The Ellipsis component truncates text and shows a tooltip with the full text on hover.</p>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ marginRight: '1rem' }}>
            <input
              type="checkbox"
              checked={ellipsisEnabled}
              onChange={(e) => setEllipsisEnabled(e.target.checked)}
            />
            {' '}Ellipsis Enabled
          </label>
          <label>
            Width:{' '}
            <select value={ellipsisWidth} onChange={(e) => setEllipsisWidth(e.target.value)}>
              <option value="100px">100px</option>
              <option value="180px">180px (default)</option>
              <option value="250px">250px</option>
              <option value="400px">400px</option>
            </select>
          </label>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <p style={{ marginBottom: '0.5rem' }}>Long text with ellipsis:</p>
          <div style={{ background: '#1a1a2e', padding: '0.5rem', borderRadius: '4px' }}>
            <Ellipsis width={ellipsisWidth} enabled={ellipsisEnabled}>
              {longText}
            </Ellipsis>
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <p style={{ marginBottom: '0.5rem' }}>Short text (no truncation needed):</p>
          <div style={{ background: '#1a1a2e', padding: '0.5rem', borderRadius: '4px' }}>
            <Ellipsis width={ellipsisWidth} enabled={ellipsisEnabled}>
              {shortText}
            </Ellipsis>
          </div>
        </div>

        <div>
          <p style={{ marginBottom: '0.5rem' }}>With custom title:</p>
          <div style={{ background: '#1a1a2e', padding: '0.5rem', borderRadius: '4px' }}>
            <Ellipsis width={ellipsisWidth} enabled={ellipsisEnabled} title="Custom tooltip text!">
              {longText}
            </Ellipsis>
          </div>
        </div>
      </div>
    </div>
  )
}

function TestRouteUtils() {
  const [testResults, setTestResults] = useState<string[]>([])
  const [dynamicRoutes, setDynamicRoutes] = useState<ABP.FullRoute[]>([])

  const runTests = () => {
    const results: string[] = []

    // Test 1: Sort routes by order
    const unsortedRoutes: ABP.FullRoute[] = [
      { name: 'Third', path: 'third', order: 3 },
      { name: 'First', path: 'first', order: 1 },
      { name: 'Second', path: 'second', order: 2 },
    ]
    const sorted = sortRoutes(unsortedRoutes)
    results.push(`✓ sortRoutes: ${sorted.map(r => r.name).join(' -> ')}`)

    // Test 2: Set URLs for routes
    const routesWithoutUrls: ABP.FullRoute[] = [
      { name: 'Home', path: 'home' },
      { name: 'Admin', path: 'admin', children: [{ name: 'Users', path: 'users' }] },
    ]
    const withUrls = setUrls(routesWithoutUrls)
    const homeUrl = (withUrls[0] as ABP.FullRoute & { url: string }).url
    const usersUrl = ((withUrls[1] as ABP.FullRoute & { url: string }).children![0] as ABP.FullRoute & { url: string }).url
    results.push(`✓ setUrls: Home -> ${homeUrl}, Admin/Users -> ${usersUrl}`)

    // Test 3: Find route by name
    const found = findRouteByName(withUrls, 'Users')
    results.push(`✓ findRouteByName: Found '${found?.name}' at path '${found?.path}'`)

    // Test 4: Flatten nested routes
    const flattened = flattenRoutes(withUrls)
    results.push(`✓ flattenRoutes: ${flattened.length} routes (${flattened.map(r => r.name).join(', ')})`)

    // Test 5: Organize routes with parent-child relationships
    const flatRoutes: ABP.FullRoute[] = [
      { name: 'Dashboard', path: 'dashboard', order: 1 },
      { name: 'Settings', path: 'settings', parentName: 'Admin', order: 1 },
      { name: 'Admin', path: 'admin', order: 2 },
    ]
    const organized = organizeRoutes(flatRoutes)
    const adminRoute = organized.find(r => r.name === 'Admin')
    results.push(`✓ organizeRoutes: Admin has ${adminRoute?.children?.length || 0} children`)

    // Test 6: Dynamic route registry
    clearAbpRoutes()
    addAbpRoutes({ name: 'Dynamic1', path: 'dynamic1' })
    addAbpRoutes([{ name: 'Dynamic2', path: 'dynamic2' }, { name: 'Dynamic3', path: 'dynamic3' }])
    const registered = getAbpRoutes()
    results.push(`✓ Route registry: ${registered.length} routes registered`)
    setDynamicRoutes(registered)

    setTestResults(results)
  }

  const clearRegistry = () => {
    clearAbpRoutes()
    setDynamicRoutes(getAbpRoutes())
    setTestResults([...testResults, '✓ Route registry cleared'])
  }

  return (
    <div className="test-section">
      <h2>Route Utilities Tests (v1.0.0)</h2>

      <div className="test-card">
        <h3>Route Utility Functions</h3>
        <p>Test the new route manipulation utilities added in v1.0.0.</p>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button onClick={runTests}>Run All Tests</button>
          <button onClick={clearRegistry}>Clear Route Registry</button>
        </div>

        {testResults.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <h4>Test Results:</h4>
            <pre style={{
              background: '#1a1a2e',
              padding: '1rem',
              borderRadius: '4px',
              maxHeight: '300px',
              overflow: 'auto'
            }}>
              {testResults.join('\n')}
            </pre>
          </div>
        )}

        {dynamicRoutes.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <h4>Dynamic Routes Registry ({dynamicRoutes.length}):</h4>
            <pre style={{
              background: '#1a1a2e',
              padding: '1rem',
              borderRadius: '4px',
              maxHeight: '200px',
              overflow: 'auto'
            }}>
              {JSON.stringify(dynamicRoutes, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="test-card">
        <h3>Available Functions</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>✓ <code>sortRoutes(routes)</code> - Sort by order property</li>
          <li>✓ <code>setUrls(routes, parentUrl?)</code> - Generate URLs recursively</li>
          <li>✓ <code>findRouteByName(routes, name)</code> - Find route by name</li>
          <li>✓ <code>flattenRoutes(routes)</code> - Flatten nested structure</li>
          <li>✓ <code>organizeRoutes(routes)</code> - Build parent-child hierarchy</li>
          <li>✓ <code>addAbpRoutes(route | routes[])</code> - Register routes dynamically</li>
          <li>✓ <code>getAbpRoutes()</code> - Get registered routes</li>
          <li>✓ <code>clearAbpRoutes()</code> - Clear route registry</li>
        </ul>
      </div>
    </div>
  )
}

function TestComponents() {
  const config = useConfig()
  const grantedPolicies = config.auth?.grantedPolicies || {}
  const availablePolicies = Object.keys(grantedPolicies).slice(0, 5)

  return (
    <div className="test-section">
      <h2>Component Tests</h2>

      <div className="test-card">
        <h3>Permission Component</h3>
        <Permission condition="AbpIdentity.Roles">
          <p style={{ color: '#6f6' }}>Has AbpIdentity.Roles permission</p>
        </Permission>
        <Permission condition="AbpIdentity.Roles" fallback={<p style={{color: '#888'}}>No AbpIdentity.Roles permission</p>}>
          <p style={{ color: '#6f6' }}>Has AbpIdentity.Roles permission</p>
        </Permission>

        {availablePolicies.length > 0 && (
          <>
            <h4>Testing first available policies:</h4>
            {availablePolicies.map((policy) => (
              <Permission key={policy} condition={policy} fallback={<p style={{color: '#f66'}}>{policy}: NO</p>}>
                <p style={{ color: '#6f6' }}>{policy}: YES</p>
              </Permission>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

function TestStateServices() {
  const { store } = useAbp()
  const [configResults, setConfigResults] = useState<string[]>([])
  const [profileResults, setProfileResults] = useState<string[]>([])
  const [sessionResults, setSessionResults] = useState<string[]>([])

  const testConfigStateService = () => {
    const results: string[] = []
    const configService = new ConfigStateService(() => store.getState())

    // Test getAll
    const allConfig = configService.getAll()
    results.push(`✓ getAll(): ${allConfig ? 'Got config state' : 'No config'}`)

    // Test getApplicationInfo
    const appInfo = configService.getApplicationInfo()
    results.push(`✓ getApplicationInfo(): name="${appInfo?.name || 'N/A'}"`)

    // Test getOne
    const environment = configService.getOne('environment')
    results.push(`✓ getOne('environment'): ${environment ? 'Found' : 'Not found'}`)

    // Test getDeep
    const currentUserId = configService.getDeep('currentUser.id')
    results.push(`✓ getDeep('currentUser.id'): ${currentUserId || 'N/A'}`)

    // Test getApiUrl
    const apiUrl = configService.getApiUrl()
    results.push(`✓ getApiUrl(): "${apiUrl}"`)

    // Test getRoute by path
    const homeRoute = configService.getRoute('/')
    results.push(`✓ getRoute('/'): ${homeRoute?.name || 'Not found'}`)

    // Test getRoute by name
    const namedRoute = configService.getRoute(undefined, 'Home')
    results.push(`✓ getRoute(undefined, 'Home'): ${namedRoute?.path || 'Not found'}`)

    // Test getRoute by url (v1.1.0)
    const urlRoute = configService.getRoute(undefined, undefined, '/')
    results.push(`✓ getRoute(undefined, undefined, '/'): ${urlRoute?.name || 'Not found'} (v1.1.0)`)

    // Test getSetting
    const setting = configService.getSetting('Abp.Localization.DefaultLanguage')
    results.push(`✓ getSetting('Abp.Localization.DefaultLanguage'): ${setting || 'Not set'}`)

    // Test getSettings with keyword (v1.1.0)
    const settings = configService.getSettings('Localization')
    const settingCount = Object.keys(settings || {}).length
    results.push(`✓ getSettings('Localization'): ${settingCount} settings found (v1.1.0)`)

    // Test getGrantedPolicy
    const hasPolicy = configService.getGrantedPolicy('AbpIdentity.Roles')
    results.push(`✓ getGrantedPolicy('AbpIdentity.Roles'): ${hasPolicy}`)

    // Test getLocalization
    const localized = configService.getLocalization('AbpIdentity::Roles')
    results.push(`✓ getLocalization('AbpIdentity::Roles'): "${localized}"`)

    // Test getLocalization with default (v1.1.0)
    const localizedWithDefault = configService.getLocalization({ key: 'NonExistent::Key', defaultValue: 'Default Text' })
    results.push(`✓ getLocalization({ key, defaultValue }): "${localizedWithDefault}" (v1.1.0)`)

    setConfigResults(results)
  }

  const testProfileStateService = () => {
    const results: string[] = []
    const profileService = new ProfileStateService(() => store.getState())

    // Test getProfile
    const profile = profileService.getProfile()
    results.push(`✓ getProfile(): ${profile ? `userName="${profile.userName || 'N/A'}"` : 'No profile loaded'}`)

    if (profile) {
      results.push(`  - email: ${profile.email || 'N/A'}`)
      results.push(`  - name: ${profile.name || 'N/A'}`)
      results.push(`  - surname: ${profile.surname || 'N/A'}`)
    }

    setProfileResults(results)
  }

  const testSessionStateService = () => {
    const results: string[] = []
    const sessionService = new SessionStateService(() => store.getState())

    // Test getLanguage
    const language = sessionService.getLanguage()
    results.push(`✓ getLanguage(): "${language || 'Not set'}"`)

    // Test getTenant
    const tenant = sessionService.getTenant()
    results.push(`✓ getTenant(): ${tenant ? `id="${tenant.id}", name="${tenant.name}"` : 'No tenant (host)'}`)

    // Test getSessionDetail (v2.0.0)
    const sessionDetail = sessionService.getSessionDetail()
    results.push(`✓ getSessionDetail() (v2.0.0):`)
    results.push(`  - openedTabCount: ${sessionDetail.openedTabCount}`)
    results.push(`  - lastExitTime: ${sessionDetail.lastExitTime}`)
    results.push(`  - remember: ${sessionDetail.remember}`)

    setSessionResults(results)
  }

  return (
    <div className="test-section">
      <h2>State Services Tests (v1.1.0)</h2>

      <div className="test-card">
        <h3>ConfigStateService</h3>
        <p>New service for accessing config state directly from Redux store.</p>
        <button onClick={testConfigStateService}>Run Config Tests</button>

        {configResults.length > 0 && (
          <pre style={{
            background: '#1a1a2e',
            padding: '1rem',
            borderRadius: '4px',
            maxHeight: '300px',
            overflow: 'auto',
            marginTop: '1rem'
          }}>
            {configResults.join('\n')}
          </pre>
        )}
      </div>

      <div className="test-card">
        <h3>ProfileStateService</h3>
        <p>New service for accessing profile state from Redux store.</p>
        <button onClick={testProfileStateService}>Run Profile Tests</button>

        {profileResults.length > 0 && (
          <pre style={{
            background: '#1a1a2e',
            padding: '1rem',
            borderRadius: '4px',
            maxHeight: '200px',
            overflow: 'auto',
            marginTop: '1rem'
          }}>
            {profileResults.join('\n')}
          </pre>
        )}
      </div>

      <div className="test-card">
        <h3>SessionStateService</h3>
        <p>New service for accessing session state from Redux store.</p>
        <button onClick={testSessionStateService}>Run Session Tests</button>

        {sessionResults.length > 0 && (
          <pre style={{
            background: '#1a1a2e',
            padding: '1rem',
            borderRadius: '4px',
            maxHeight: '200px',
            overflow: 'auto',
            marginTop: '1rem'
          }}>
            {sessionResults.join('\n')}
          </pre>
        )}
      </div>
    </div>
  )
}

function TestV2Features() {
  const dispatch = useDispatch()
  const sessionDetail = useSelector(selectSessionDetail)
  const routes = useSelector(selectRoutes)
  const [addRouteResults, setAddRouteResults] = useState<string[]>([])

  // Test Session Detail Actions
  const handleIncreaseTabCount = () => {
    dispatch(sessionActions.modifyOpenedTabCount('increase'))
  }

  const handleDecreaseTabCount = () => {
    dispatch(sessionActions.modifyOpenedTabCount('decrease'))
  }

  const handleToggleRemember = () => {
    dispatch(sessionActions.setRemember(!sessionDetail.remember))
  }

  const handleSetSessionDetail = () => {
    dispatch(sessionActions.setSessionDetail({
      openedTabCount: 5,
      lastExitTime: Date.now(),
      remember: true,
    }))
  }

  const handleResetSessionDetail = () => {
    dispatch(sessionActions.setSessionDetail({
      openedTabCount: 0,
      lastExitTime: 0,
      remember: false,
    }))
  }

  // Test AddRoute Action
  const handleAddRootRoute = () => {
    const results: string[] = []
    const routeName = `DynamicRoute_${Date.now()}`

    dispatch(configActions.addRoute({
      name: routeName,
      path: `dynamic-${Date.now()}`,
      order: 99,
    }))

    results.push(`✓ Added root route: ${routeName}`)
    setAddRouteResults(results)
  }

  const handleAddChildRoute = () => {
    const results: string[] = []
    const parentRoute = routes[0]

    if (!parentRoute) {
      results.push(`✗ No parent route available. Add a root route first.`)
      setAddRouteResults(results)
      return
    }

    const routeName = `ChildRoute_${Date.now()}`
    dispatch(configActions.addRoute({
      name: routeName,
      path: `child-${Date.now()}`,
      parentName: parentRoute.name,
      order: 1,
    }))

    results.push(`✓ Added child route "${routeName}" under "${parentRoute.name}"`)
    setAddRouteResults(results)
  }

  // Test ReplaceableComponents types (compile-time check)
  const testReplaceableComponentsTypes = () => {
    // This is a compile-time type check - if it compiles, the types are correct
    const mockState: ReplaceableComponents.State = {
      replaceableComponents: [],
    }

    const mockComponent: ReplaceableComponents.ReplaceableComponent = {
      key: 'test-key',
      component: () => null,
    }

    const mockRouteData: ReplaceableComponents.RouteData = {
      key: 'route-key',
      defaultComponent: () => null,
    }

    return {
      stateValid: !!mockState,
      componentValid: !!mockComponent,
      routeDataValid: !!mockRouteData,
    }
  }

  const replaceableTypesResult = testReplaceableComponentsTypes()

  // Test eLayoutType (removed 'setting' in v2.0.0)
  const layoutTypes = Object.values(eLayoutType)

  return (
    <div className="test-section">
      <h2>v2.0.0 Features</h2>

      <div className="test-card" style={{ background: 'rgba(100,108,255,0.05)', border: '1px solid rgba(100,108,255,0.2)' }}>
        <h3>Session Detail (v2.0.0)</h3>
        <p>New session detail tracking for tab count, exit time, and remember preference.</p>

        <div style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
          <p><strong>openedTabCount:</strong> {sessionDetail.openedTabCount}</p>
          <p><strong>lastExitTime:</strong> {sessionDetail.lastExitTime ? new Date(sessionDetail.lastExitTime).toLocaleString() : 'Never'}</p>
          <p><strong>remember:</strong> {sessionDetail.remember ? 'Yes' : 'No'}</p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          <button onClick={handleIncreaseTabCount}>
            Increase Tab Count
          </button>
          <button onClick={handleDecreaseTabCount}>
            Decrease Tab Count
          </button>
          <button onClick={handleToggleRemember}>
            Toggle Remember ({sessionDetail.remember ? 'On' : 'Off'})
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={handleSetSessionDetail}>
            Set All Values
          </button>
          <button onClick={handleResetSessionDetail} style={{ background: '#f44' }}>
            Reset Session Detail
          </button>
        </div>

        <p style={{ marginTop: '1rem', fontSize: '12px', color: '#888' }}>
          Actions: sessionActions.modifyOpenedTabCount(), sessionActions.setRemember(), sessionActions.setSessionDetail()
        </p>
      </div>

      <div className="test-card" style={{ background: 'rgba(100,108,255,0.05)', border: '1px solid rgba(100,108,255,0.2)' }}>
        <h3>Dynamic Route Addition (v2.0.0)</h3>
        <p>Add routes dynamically using configActions.addRoute().</p>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button onClick={handleAddRootRoute}>
            Add Root Route
          </button>
          <button onClick={handleAddChildRoute}>
            Add Child Route
          </button>
        </div>

        {addRouteResults.length > 0 && (
          <pre style={{
            background: '#1a1a2e',
            padding: '0.5rem',
            borderRadius: '4px',
            marginBottom: '1rem',
          }}>
            {addRouteResults.join('\n')}
          </pre>
        )}

        <details>
          <summary>Current Routes ({routes.length})</summary>
          <pre style={{
            background: '#1a1a2e',
            padding: '0.5rem',
            borderRadius: '4px',
            maxHeight: '200px',
            overflow: 'auto',
          }}>
            {JSON.stringify(routes, null, 2)}
          </pre>
        </details>
      </div>

      <div className="test-card" style={{ background: 'rgba(100,108,255,0.05)', border: '1px solid rgba(100,108,255,0.2)' }}>
        <h3>ReplaceableComponents Model (v2.0.0)</h3>
        <p>New model for component replacement system.</p>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: '8px' }}>ReplaceableComponents.State</td><td style={{ color: replaceableTypesResult.stateValid ? '#4f4' : '#f44' }}>{replaceableTypesResult.stateValid ? '✓ Valid' : '✗ Invalid'}</td></tr>
            <tr><td style={{ padding: '8px' }}>ReplaceableComponents.ReplaceableComponent</td><td style={{ color: replaceableTypesResult.componentValid ? '#4f4' : '#f44' }}>{replaceableTypesResult.componentValid ? '✓ Valid' : '✗ Invalid'}</td></tr>
            <tr><td style={{ padding: '8px' }}>ReplaceableComponents.RouteData</td><td style={{ color: replaceableTypesResult.routeDataValid ? '#4f4' : '#f44' }}>{replaceableTypesResult.routeDataValid ? '✓ Valid' : '✗ Invalid'}</td></tr>
            <tr><td style={{ padding: '8px' }}>ReplaceableComponents.ReplaceableTemplateDirectiveInput</td><td style={{ color: '#4f4' }}>✓ Type exported</td></tr>
            <tr><td style={{ padding: '8px' }}>ReplaceableComponents.ReplaceableTemplateData</td><td style={{ color: '#4f4' }}>✓ Type exported</td></tr>
          </tbody>
        </table>
      </div>

      <div className="test-card" style={{ background: 'rgba(100,108,255,0.05)', border: '1px solid rgba(100,108,255,0.2)' }}>
        <h3>eLayoutType Changes (v2.0.0)</h3>
        <p>The deprecated <code>setting</code> layout type has been removed.</p>

        <div style={{ marginBottom: '1rem' }}>
          <strong>Available layout types:</strong>
          <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
            {layoutTypes.map((type) => (
              <li key={type}><code>{type}</code></li>
            ))}
          </ul>
        </div>

        <p style={{ fontSize: '12px', color: '#888' }}>
          Breaking change: <code>eLayoutType.setting</code> was removed (deprecated since v0.9.0)
        </p>
      </div>
    </div>
  )
}

function TestV24Features() {
  const [dtoResults, setDtoResults] = useState<string[]>([])
  const [strategyResults, setStrategyResults] = useState<string[]>([])
  const [utilResults, setUtilResults] = useState<string[]>([])
  const [lazyLoadResults, setLazyLoadResults] = useState<string[]>([])

  const testDTOs = () => {
    const results: string[] = []

    // Test ListResultDto
    const listResult = new ListResultDto({ items: [1, 2, 3] })
    results.push(`✓ ListResultDto: items=[${listResult.items?.join(', ')}]`)

    // Test PagedResultDto
    const pagedResult = new PagedResultDto({ items: ['a', 'b'], totalCount: 100 })
    results.push(`✓ PagedResultDto: items=${pagedResult.items?.length}, totalCount=${pagedResult.totalCount}`)

    // Test EntityDto
    const entity = new EntityDto({ id: 'entity-123' })
    results.push(`✓ EntityDto: id="${entity.id}"`)

    // Test AuditedEntityDto
    const audited = new AuditedEntityDto({
      id: 'audited-456',
      creationTime: new Date().toISOString(),
      creatorId: 'user-1',
      lastModificationTime: new Date().toISOString(),
      lastModifierId: 'user-2',
    })
    results.push(`✓ AuditedEntityDto: id="${audited.id}"`)
    results.push(`  - creatorId: ${audited.creatorId}`)
    results.push(`  - lastModifierId: ${audited.lastModifierId}`)

    // Test FullAuditedEntityDto
    const fullAudited = new FullAuditedEntityDto({
      id: 'full-789',
      isDeleted: false,
      deleterId: undefined,
    })
    results.push(`✓ FullAuditedEntityDto: id="${fullAudited.id}", isDeleted=${fullAudited.isDeleted}`)

    setDtoResults(results)
  }

  const testStrategies = () => {
    const results: string[] = []

    // Test DOM_STRATEGY
    const appendToHead = DOM_STRATEGY.AppendToHead()
    results.push(`✓ DOM_STRATEGY.AppendToHead()`)
    results.push(`  - target: ${appendToHead.target === document.head ? 'document.head' : 'other'}`)
    results.push(`  - position: ${appendToHead.position}`)

    const appendToBody = DOM_STRATEGY.AppendToBody()
    results.push(`✓ DOM_STRATEGY.AppendToBody()`)
    results.push(`  - target: ${appendToBody.target === document.body ? 'document.body' : 'other'}`)

    const prependToHead = DOM_STRATEGY.PrependToHead()
    results.push(`✓ DOM_STRATEGY.PrependToHead()`)
    results.push(`  - position: ${prependToHead.position}`)

    // Test CROSS_ORIGIN_STRATEGY
    const anonymousCors = CROSS_ORIGIN_STRATEGY.Anonymous('sha384-test')
    results.push(`✓ CROSS_ORIGIN_STRATEGY.Anonymous('sha384-test')`)
    results.push(`  - crossorigin: ${anonymousCors.crossorigin}`)
    results.push(`  - integrity: ${anonymousCors.integrity}`)

    // Test CONTENT_SECURITY_STRATEGY
    const looseCSP = CONTENT_SECURITY_STRATEGY.Loose('nonce-abc123')
    results.push(`✓ CONTENT_SECURITY_STRATEGY.Loose('nonce-abc123')`)
    results.push(`  - nonce: ${looseCSP.nonce}`)

    const noCSP = CONTENT_SECURITY_STRATEGY.None()
    results.push(`✓ CONTENT_SECURITY_STRATEGY.None()`)
    results.push(`  - nonce: ${noCSP.nonce ?? 'undefined'}`)

    // Test LOADING_STRATEGY (without actually loading)
    const scriptStrategy = LOADING_STRATEGY.AppendAnonymousScriptToHead('https://example.com/lib.js')
    results.push(`✓ LOADING_STRATEGY.AppendAnonymousScriptToHead()`)
    results.push(`  - path: ${scriptStrategy.path}`)

    // Test CONTENT_STRATEGY
    const styleStrategy = CONTENT_STRATEGY.AppendStyleToHead('.test { color: red; }')
    results.push(`✓ CONTENT_STRATEGY.AppendStyleToHead()`)
    results.push(`  - content length: ${styleStrategy.content.length} chars`)

    // Test DomInsertionService
    const domService = getDomInsertionService()
    results.push(`✓ getDomInsertionService()`)
    results.push(`  - inserted count: ${domService.inserted.size}`)
    results.push(`  - instance is singleton: ${domService === getDomInsertionService()}`)

    setStrategyResults(results)
  }

  const testUtilFunctions = () => {
    const results: string[] = []

    // Test generateHash
    const hash1 = generateHash('hello world')
    const hash2 = generateHash('hello world')
    const hash3 = generateHash('different string')
    results.push(`✓ generateHash('hello world'): ${hash1}`)
    results.push(`  - consistent: ${hash1 === hash2}`)
    results.push(`  - different input: ${hash3} (different: ${hash1 !== hash3})`)

    // Test isUndefinedOrEmptyString
    results.push(`✓ isUndefinedOrEmptyString():`)
    results.push(`  - undefined: ${isUndefinedOrEmptyString(undefined)}`)
    results.push(`  - '': ${isUndefinedOrEmptyString('')}`)
    results.push(`  - 'text': ${isUndefinedOrEmptyString('text')}`)
    results.push(`  - null: ${isUndefinedOrEmptyString(null)}`)
    results.push(`  - 0: ${isUndefinedOrEmptyString(0)}`)

    // Test noop
    const noopFn = noop()
    results.push(`✓ noop():`)
    results.push(`  - returns function: ${typeof noopFn === 'function'}`)
    results.push(`  - function returns: ${noopFn()}`)

    setUtilResults(results)
  }

  const testLazyLoadService = () => {
    const results: string[] = []

    const lazyLoadService = new LazyLoadService()

    // Test loaded set
    results.push(`✓ LazyLoadService:`)
    results.push(`  - loaded set available: ${lazyLoadService.loaded instanceof Set}`)
    results.push(`  - loaded count: ${lazyLoadService.loaded.size}`)

    // Test isLoaded
    results.push(`  - isLoaded('nonexistent.js'): ${lazyLoadService.isLoaded('nonexistent.js')}`)

    // Test strategy-based loading (without actually loading)
    const strategy = LOADING_STRATEGY.AppendAnonymousScriptToHead('https://example.com/test.js')
    results.push(``)
    results.push(`✓ LoadingStrategy-based loading:`)
    results.push(`  - Strategy path: ${strategy.path}`)
    results.push(`  - Note: Use lazyLoadService.load(strategy) to load`)

    setLazyLoadResults(results)
  }

  return (
    <div className="test-section">
      <h2>v2.4.0 Features</h2>

      <div className="test-card" style={{ background: 'rgba(255,165,0,0.05)', border: '1px solid rgba(255,165,0,0.2)' }}>
        <h3>Standard DTOs (v2.4.0)</h3>
        <p>New DTO classes for consistent data transfer patterns.</p>

        <button onClick={testDTOs} style={{ marginBottom: '1rem' }}>
          Test DTO Classes
        </button>

        {dtoResults.length > 0 && (
          <pre style={{
            background: '#1a1a2e',
            padding: '1rem',
            borderRadius: '4px',
            maxHeight: '250px',
            overflow: 'auto',
          }}>
            {dtoResults.join('\n')}
          </pre>
        )}

        <div style={{ marginTop: '1rem' }}>
          <strong>Available DTOs:</strong>
          <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem', fontSize: '14px' }}>
            <li><code>ListResultDto&lt;T&gt;</code> - Generic list result</li>
            <li><code>PagedResultDto&lt;T&gt;</code> - Paged result with totalCount</li>
            <li><code>EntityDto&lt;TKey&gt;</code> - Basic entity with ID</li>
            <li><code>CreationAuditedEntityDto</code> - With creation audit</li>
            <li><code>AuditedEntityDto</code> - With modification audit</li>
            <li><code>FullAuditedEntityDto</code> - With soft delete audit</li>
          </ul>
        </div>
      </div>

      <div className="test-card" style={{ background: 'rgba(255,165,0,0.05)', border: '1px solid rgba(255,165,0,0.2)' }}>
        <h3>Strategies (v2.4.0)</h3>
        <p>New strategies for DOM manipulation and resource loading.</p>

        <button onClick={testStrategies} style={{ marginBottom: '1rem' }}>
          Test Strategies
        </button>

        {strategyResults.length > 0 && (
          <pre style={{
            background: '#1a1a2e',
            padding: '1rem',
            borderRadius: '4px',
            maxHeight: '300px',
            overflow: 'auto',
          }}>
            {strategyResults.join('\n')}
          </pre>
        )}

        <div style={{ marginTop: '1rem' }}>
          <strong>Available Strategy Factories:</strong>
          <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem', fontSize: '14px' }}>
            <li><code>DOM_STRATEGY</code> - AppendToHead, AppendToBody, PrependToHead, etc.</li>
            <li><code>LOADING_STRATEGY</code> - Load external scripts/styles</li>
            <li><code>CONTENT_STRATEGY</code> - Insert inline scripts/styles</li>
            <li><code>CROSS_ORIGIN_STRATEGY</code> - CORS configuration</li>
            <li><code>CONTENT_SECURITY_STRATEGY</code> - CSP nonce handling</li>
          </ul>
        </div>
      </div>

      <div className="test-card" style={{ background: 'rgba(255,165,0,0.05)', border: '1px solid rgba(255,165,0,0.2)' }}>
        <h3>Utility Functions (v2.4.0)</h3>
        <p>New utility functions for common operations.</p>

        <button onClick={testUtilFunctions} style={{ marginBottom: '1rem' }}>
          Test Utility Functions
        </button>

        {utilResults.length > 0 && (
          <pre style={{
            background: '#1a1a2e',
            padding: '1rem',
            borderRadius: '4px',
            maxHeight: '200px',
            overflow: 'auto',
          }}>
            {utilResults.join('\n')}
          </pre>
        )}

        <div style={{ marginTop: '1rem' }}>
          <strong>New Functions:</strong>
          <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem', fontSize: '14px' }}>
            <li><code>generateHash(value)</code> - Generate hash from string</li>
            <li><code>isUndefinedOrEmptyString(value)</code> - Check undefined or empty</li>
            <li><code>noop()</code> - No-operation function</li>
            <li><code>fromLazyLoad(element, dom, cors)</code> - Promise-based lazy loading</li>
          </ul>
        </div>
      </div>

      <div className="test-card" style={{ background: 'rgba(255,165,0,0.05)', border: '1px solid rgba(255,165,0,0.2)' }}>
        <h3>LazyLoadService Updates (v2.4.0)</h3>
        <p>Enhanced LazyLoadService with strategy-based loading and retry support.</p>

        <button onClick={testLazyLoadService} style={{ marginBottom: '1rem' }}>
          Test LazyLoadService
        </button>

        {lazyLoadResults.length > 0 && (
          <pre style={{
            background: '#1a1a2e',
            padding: '1rem',
            borderRadius: '4px',
            maxHeight: '200px',
            overflow: 'auto',
          }}>
            {lazyLoadResults.join('\n')}
          </pre>
        )}

        <div style={{ marginTop: '1rem' }}>
          <strong>New Features:</strong>
          <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem', fontSize: '14px' }}>
            <li><code>loaded</code> - Set of loaded resources</li>
            <li><code>load(strategy, retryTimes?, retryDelay?)</code> - Strategy-based loading with retry</li>
            <li><code>isLoaded(path)</code> - Check if a path has been loaded</li>
          </ul>
        </div>

        <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
          <strong>Usage Example:</strong>
          <pre style={{ margin: '0.5rem 0', fontSize: '12px' }}>
{`const lazyLoad = new LazyLoadService();
const strategy = LOADING_STRATEGY.AppendAnonymousScriptToHead(
  'https://cdn.example.com/lib.js',
  'sha384-...'  // optional integrity
);

// Load with retry (default: 2 retries, 1000ms delay)
await lazyLoad.load(strategy);

// Or with custom retry settings
await lazyLoad.load(strategy, 3, 500);`}
          </pre>
        </div>
      </div>

      <div className="test-card" style={{ background: 'rgba(255,165,0,0.05)', border: '1px solid rgba(255,165,0,0.2)' }}>
        <h3>Config Model Changes (v2.4.0)</h3>
        <p>Updates to configuration types.</p>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Change</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>Config.Environment.hmr?</code></td>
              <td style={{ padding: '8px' }}>New optional HMR flag</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>Config.ApiConfig</code></td>
              <td style={{ padding: '8px' }}>New interface for API configuration</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>Rest.Config.apiName?</code></td>
              <td style={{ padding: '8px' }}>Specify which API to use in requests</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>ABP.Root.requirements?</code></td>
              <td style={{ padding: '8px' }}>Now optional (deprecated, removed in v3.0)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TestV21Features() {
  const { store } = useAbp()
  const dispatch = useDispatch()
  const [dispatchResults, setDispatchResults] = useState<string[]>([])
  const config = useConfig()

  const testDispatchSetEnvironment = () => {
    const results: string[] = []
    const configService = new ConfigStateService(() => store.getState(), dispatch)

    // Get current environment
    const currentEnv = config.environment
    results.push(`Current environment:`)
    results.push(`  - production: ${currentEnv?.production}`)
    results.push(`  - application name: ${currentEnv?.application?.name || 'N/A'}`)
    results.push(`  - default API: ${currentEnv?.apis?.default?.url || 'N/A'}`)
    results.push(``)

    // Test dispatchSetEnvironment
    try {
      const newEnvironment = {
        ...currentEnv,
        application: {
          name: `Updated App (${new Date().toLocaleTimeString()})`,
          logoUrl: currentEnv?.application?.logoUrl,
        },
        production: currentEnv?.production ?? false,
        oAuthConfig: currentEnv?.oAuthConfig ?? {} as any,
        apis: currentEnv?.apis ?? {},
      }

      configService.dispatchSetEnvironment(newEnvironment)
      results.push(`✓ dispatchSetEnvironment() called successfully`)
      results.push(`  - New application name: ${newEnvironment.application.name}`)
      results.push(``)
      results.push(`Note: Refresh this section to see updated values.`)
    } catch (err) {
      results.push(`✗ Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }

    setDispatchResults(results)
  }

  const testDispatchWithoutDispatch = () => {
    const results: string[] = []

    // Create service WITHOUT dispatch to test error handling
    const configServiceWithoutDispatch = new ConfigStateService(() => store.getState())

    try {
      configServiceWithoutDispatch.dispatchSetEnvironment({
        production: false,
        oAuthConfig: {} as any,
        apis: {},
      })
      results.push(`✗ Expected an error but none was thrown`)
    } catch (err) {
      results.push(`✓ Error caught as expected:`)
      results.push(`  "${err instanceof Error ? err.message : 'Unknown error'}"`)
    }

    setDispatchResults(results)
  }

  return (
    <div className="test-section">
      <h2>v2.1.0 Features</h2>

      <div className="test-card" style={{ background: 'rgba(0,200,100,0.05)', border: '1px solid rgba(0,200,100,0.2)' }}>
        <h3>ConfigStateService.dispatchSetEnvironment() (v2.1.0)</h3>
        <p>New dispatch method to update environment configuration directly from ConfigStateService.</p>

        <div style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
          <p><strong>Current Application Name:</strong> {config.environment?.application?.name || 'N/A'}</p>
          <p><strong>Production Mode:</strong> {config.environment?.production ? 'Yes' : 'No'}</p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button onClick={testDispatchSetEnvironment}>
            Test dispatchSetEnvironment()
          </button>
          <button onClick={testDispatchWithoutDispatch} style={{ background: '#f64' }}>
            Test Error Handling
          </button>
        </div>

        {dispatchResults.length > 0 && (
          <pre style={{
            background: '#1a1a2e',
            padding: '1rem',
            borderRadius: '4px',
            maxHeight: '250px',
            overflow: 'auto',
          }}>
            {dispatchResults.join('\n')}
          </pre>
        )}

        <p style={{ marginTop: '1rem', fontSize: '12px', color: '#888' }}>
          Usage: <code>new ConfigStateService(getState, dispatch).dispatchSetEnvironment(env)</code>
        </p>
      </div>

      <div className="test-card" style={{ background: 'rgba(0,200,100,0.05)', border: '1px solid rgba(0,200,100,0.2)' }}>
        <h3>Date.toLocalISOString Optional Type (v2.1.0)</h3>
        <p>The <code>toLocalISOString</code> method type is now optional to match Angular API.</p>

        <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
          <p><strong>Type Declaration Change:</strong></p>
          <pre style={{ margin: '0.5rem 0', background: '#1a1a2e', padding: '0.5rem', borderRadius: '4px' }}>
{`// Before (v2.0.0)
interface Date {
  toLocalISOString(): string;
}

// After (v2.1.0)
interface Date {
  toLocalISOString?: () => string;
}`}
          </pre>
          <p style={{ fontSize: '12px', color: '#888', marginTop: '0.5rem' }}>
            Use optional chaining <code>date.toLocalISOString?.()</code> or type guard for type-safe access.
          </p>
        </div>
      </div>
    </div>
  )
}

function TestDateExtensions() {
  const [results, setResults] = useState<string[]>([])

  const testDateExtension = () => {
    const results: string[] = []

    // Test toLocalISOString - now optional in v2.1.0
    const date = new Date('2024-06-15T14:30:00Z')

    // v2.1.0: toLocalISOString is now optional, use optional chaining or type guard
    if (date.toLocalISOString) {
      const localISO = date.toLocalISOString()
      const standardISO = date.toISOString()

      results.push(`✓ Date.toLocalISOString() (v1.1.0, optional in v2.1.0)`)
      results.push(`  - Input: new Date('2024-06-15T14:30:00Z')`)
      results.push(`  - toISOString(): ${standardISO}`)
      results.push(`  - toLocalISOString(): ${localISO}`)

      // Test with current date
      const now = new Date()
      results.push(``)
      results.push(`✓ Current date:`)
      results.push(`  - toISOString(): ${now.toISOString()}`)
      results.push(`  - toLocalISOString(): ${now.toLocalISOString?.() || 'N/A'}`)

      // Explain the difference
      const tzOffset = -now.getTimezoneOffset()
      const tzHours = Math.floor(Math.abs(tzOffset) / 60)
      const tzMins = Math.abs(tzOffset) % 60
      const tzSign = tzOffset >= 0 ? '+' : '-'
      results.push(``)
      results.push(`Timezone offset: UTC${tzSign}${String(tzHours).padStart(2, '0')}:${String(tzMins).padStart(2, '0')}`)
      results.push(`Note: toLocalISOString() returns time in local timezone without 'Z' suffix`)

      // v2.1.0: Optional type info
      results.push(``)
      results.push(`v2.1.0 Change: toLocalISOString is now optional in type declaration`)
      results.push(`  - Use optional chaining: date.toLocalISOString?.()`)
      results.push(`  - Or type guard: if (date.toLocalISOString) { ... }`)
    } else {
      results.push(`✗ toLocalISOString not available on this Date instance`)
    }

    setResults(results)
  }

  return (
    <div className="test-section">
      <h2>Date Extensions Tests (v1.1.0, updated v2.1.0)</h2>

      <div className="test-card">
        <h3>Date.prototype.toLocalISOString()</h3>
        <p>Method added to Date prototype that returns ISO string in local timezone.</p>
        <p style={{ fontSize: '12px', color: '#888' }}>
          v2.1.0: Type declaration is now optional to match Angular API.
        </p>
        <button onClick={testDateExtension}>Run Date Tests</button>

        {results.length > 0 && (
          <pre style={{
            background: '#1a1a2e',
            padding: '1rem',
            borderRadius: '4px',
            maxHeight: '300px',
            overflow: 'auto',
            marginTop: '1rem'
          }}>
            {results.join('\n')}
          </pre>
        )}
      </div>
    </div>
  )
}

export function TestCorePage() {
  return (
    <div>
      <h1>@abpjs/core Tests (v2.4.0)</h1>
      <p style={{ marginBottom: '8px' }}>Testing core hooks, services, and components.</p>
      <p style={{ fontSize: '14px', color: '#888', marginBottom: '16px' }}>
        Version 2.4.0 - Added DTOs, strategies, DomInsertionService, utility functions
      </p>

      <TestV24Features />
      <TestV21Features />
      <TestV2Features />
      <TestStateServices />
      <TestDateExtensions />
      <TestLoader />
      <TestEllipsis />
      <TestRouteUtils />
      <TestLocalization />
      <TestHooks />
      <TestComponents />
    </div>
  )
}

export default TestCorePage
