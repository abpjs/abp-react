/**
 * Test page for @abpjs/core package
 * Tests: hooks, services, components, state management
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
} from '@abpjs/core'

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

export function TestCorePage() {
  return (
    <div>
      <h1>@abpjs/core Tests</h1>
      <p>Testing core hooks, services, and components.</p>

      <TestLoader />
      <TestEllipsis />
      <TestLocalization />
      <TestHooks />
      <TestComponents />
    </div>
  )
}

export default TestCorePage
