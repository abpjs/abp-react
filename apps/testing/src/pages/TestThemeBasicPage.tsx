/**
 * Test page for @abpjs/theme-basic package
 * Tests: Layouts, Navigation, LayoutService
 */
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectRoutes, useConfig, useAuth } from '@abpjs/core'
import { useLayoutService } from '@abpjs/theme-basic'

function TestLayoutService() {
  const layoutService = useLayoutService()

  useEffect(() => {
    // Add a custom navigation element when this page mounts
    layoutService.addNavigationElement({
      name: 'test-notification',
      element: (
        <span style={{
          background: '#646cff',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          Test Badge
        </span>
      ),
      order: 100
    })

    // Clean up when page unmounts
    return () => {
      layoutService.removeNavigationElement('test-notification')
    }
  }, [layoutService])

  const addAnotherElement = () => {
    layoutService.addNavigationElement({
      name: 'dynamic-element-' + Date.now(),
      element: (
        <span style={{
          background: '#22c55e',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          Dynamic {new Date().toLocaleTimeString()}
        </span>
      ),
      order: 99
    })
  }

  return (
    <div className="test-section">
      <h2>Layout Service (useLayoutService)</h2>

      <div className="test-card">
        <h3>Custom Navigation Elements</h3>
        <p>The layout service allows adding custom elements to the navbar.</p>
        <p>A "Test Badge" was added when this page loaded (check the navbar).</p>
        <button onClick={addAnotherElement}>Add Dynamic Element</button>
        <p style={{ color: '#888', fontSize: '12px', marginTop: '8px' }}>
          Note: Dynamic elements persist until page refresh. Use removeNavigationElement() to remove them.
        </p>
      </div>
    </div>
  )
}

function TestRoutes() {
  const routes = useSelector(selectRoutes)
  const config = useConfig()
  const grantedPolicies = config.auth?.grantedPolicies || {}

  // Filter and sort routes like LayoutApplication does
  const visibleRoutes = routes
    .filter(r => !r.invisible)
    .filter(r => {
      if (r.requiredPolicy) {
        return grantedPolicies[r.requiredPolicy] === true
      }
      return true
    })
    .sort((a, b) => (a.order || 0) - (b.order || 0))

  const hiddenRoutes = routes.filter(r => r.invisible)
  const policyProtectedRoutes = routes.filter(r => r.requiredPolicy)

  return (
    <div className="test-section">
      <h2>Route Configuration</h2>

      <div className="test-card">
        <h3>Visible Routes ({visibleRoutes.length})</h3>
        <p>These routes appear in the navigation menu:</p>
        <ul>
          {visibleRoutes.map(route => (
            <li key={route.name}>
              <strong>{route.name}</strong> - /{route.path || '(root)'}
              {route.requiredPolicy && <span style={{ color: '#f88' }}> (requires: {route.requiredPolicy})</span>}
            </li>
          ))}
        </ul>
      </div>

      <div className="test-card">
        <h3>Hidden Routes ({hiddenRoutes.length})</h3>
        <p>Routes with invisible=true:</p>
        <ul>
          {hiddenRoutes.map(route => (
            <li key={route.name}>
              <strong>{route.name}</strong> - /{route.path}
            </li>
          ))}
        </ul>
      </div>

      <div className="test-card">
        <h3>Policy-Protected Routes ({policyProtectedRoutes.length})</h3>
        <p>Routes that require specific permissions:</p>
        <ul>
          {policyProtectedRoutes.map(route => (
            <li key={route.name}>
              <strong>{route.name}</strong> - requires "{route.requiredPolicy}"
              <span style={{ marginLeft: '8px', color: grantedPolicies[route.requiredPolicy!] ? '#6f6' : '#f66' }}>
                {grantedPolicies[route.requiredPolicy!] ? '(Granted)' : '(Denied)'}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function TestLayouts() {
  return (
    <div className="test-section">
      <h2>Available Layouts</h2>

      <div className="test-card">
        <h3>LayoutApplication</h3>
        <p>Full-featured layout with navbar, navigation menu, user menu, and language selector.</p>
        <p>Current page is using this layout.</p>
        <ul>
          <li>Responsive navbar with mobile hamburger menu</li>
          <li>Automatic navigation from routes config</li>
          <li>Current user dropdown (profile, change password, logout)</li>
          <li>Language selector</li>
          <li>Custom navigation elements support</li>
        </ul>
      </div>

      <div className="test-card">
        <h3>LayoutAccount</h3>
        <p>Simplified layout for login, register, and other account pages.</p>
        <p>Features:</p>
        <ul>
          <li>Clean, centered layout</li>
          <li>Brand/logo display</li>
          <li>No user menu (for unauthenticated users)</li>
        </ul>
        <Link to="/account/login" style={{ color: '#646cff' }}>View Login Page (LayoutAccount) &rarr;</Link>
      </div>

      <div className="test-card">
        <h3>LayoutEmpty</h3>
        <p>Bare minimum layout - just renders content.</p>
        <p>Features:</p>
        <ul>
          <li>No navbar</li>
          <li>Just router outlet</li>
          <li>Good for print views, embeds, or custom layouts</li>
        </ul>
        <Link to="/print" style={{ color: '#646cff' }}>View Print Page (LayoutEmpty) &rarr;</Link>
      </div>
    </div>
  )
}

function TestCurrentUser() {
  const auth = useAuth()
  const config = useConfig()

  return (
    <div className="test-section">
      <h2>User Menu Integration</h2>

      <div className="test-card">
        <h3>Current User State</h3>
        <p>Is Authenticated: {auth.isAuthenticated ? 'Yes' : 'No'}</p>
        {auth.isAuthenticated && auth.user && (
          <>
            <p>User: {auth.user.profile?.name || auth.user.profile?.preferred_username}</p>
            <p>Email: {auth.user.profile?.email}</p>
          </>
        )}
        {config.currentUser && (
          <details>
            <summary>ABP Current User Config</summary>
            <pre style={{ maxHeight: '150px', overflow: 'auto' }}>
              {JSON.stringify(config.currentUser, null, 2)}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}

export function TestThemeBasicPage() {
  return (
    <div>
      <h1>@abpjs/theme-basic Tests</h1>
      <p>Testing layouts, navigation, and layout service.</p>

      <TestLayoutService />
      <TestLayouts />
      <TestRoutes />
      <TestCurrentUser />
    </div>
  )
}

export default TestThemeBasicPage
