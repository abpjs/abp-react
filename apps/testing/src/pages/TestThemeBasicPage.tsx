/**
 * Test page for @abpjs/theme-basic package
 * Tests: Layouts, Navigation, LayoutService
 * @since 0.9.0
 * @updated 2.4.0 - InitialService change (no React impact - uses Chakra UI)
 * @updated 2.7.0 - New public API components, enums, and LayoutStateService
 * @updated 2.9.0 - Removed isDropdownChildDynamic prop, RTL support via Chakra UI
 * @updated 3.0.0 - NavItemsService, CurrentUserComponent, LanguagesComponent, providers
 * @updated 3.1.0 - Angular SubscriptionService added (no React impact - uses CSS breakpoints)
 * @updated 3.2.0 - Reduced .abp-loading opacity from 0.1 to 0.05
 */
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectRoutes, useConfig, useAuth, useEnvironment } from '@abpjs/core'
import { getNavItemsService, useNavItems } from '@abpjs/theme-shared'
import {
  useLayoutService,
  useNavigationElements,
  useBranding,
  useLayoutStateService,
  eThemeBasicComponents,
  eNavigationElementNames,
  LogoComponent,
  LayoutApplication,
  CurrentUserComponent,
  LanguagesComponent,
  THEME_BASIC_STYLES,
  initializeThemeBasicStyles,
} from '@abpjs/theme-basic'

// These are displayed in code examples but not rendered directly
// import { RoutesComponent, NavItemsComponent } from '@abpjs/theme-basic'

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

// v1.1.0: Test application info from environment (equivalent to Angular's appInfo getter)
function TestApplicationInfo() {
  const environment = useEnvironment()
  const branding = useBranding()
  const navigationElements = useNavigationElements()

  return (
    <div className="test-section">
      <h2>v1.1.0: Application Info & Branding</h2>

      <div className="test-card">
        <h3>Environment Application Info</h3>
        <p>Access application info from environment configuration (v1.1.0 feature).</p>
        <p>This is equivalent to Angular's <code>appInfo</code> getter on ApplicationLayoutComponent.</p>
        <ul>
          <li><strong>App Name:</strong> {environment?.application?.name || '(not set)'}</li>
          <li><strong>Logo URL:</strong> {environment?.application?.logoUrl || '(not set)'}</li>
        </ul>
        <details>
          <summary>Full Environment Config</summary>
          <pre style={{ maxHeight: '200px', overflow: 'auto', fontSize: '12px' }}>
            {JSON.stringify(environment, null, 2)}
          </pre>
        </details>
      </div>

      <div className="test-card">
        <h3>Branding Context (useBranding)</h3>
        <p>Theme-basic branding configuration set via ThemeBasicProvider.</p>
        <ul>
          <li><strong>App Name:</strong> {branding.appName}</li>
          <li><strong>Logo Link:</strong> {branding.logoLink}</li>
          <li><strong>Has Logo:</strong> {branding.logo ? 'Yes' : 'No'}</li>
          <li><strong>Has Logo Icon:</strong> {branding.logoIcon ? 'Yes' : 'No'}</li>
        </ul>
      </div>

      <div className="test-card">
        <h3>Navigation Elements (useNavigationElements)</h3>
        <p>Custom navigation elements added via LayoutService.</p>
        <p>Current count: <strong>{navigationElements.length}</strong></p>
        {navigationElements.length > 0 && (
          <ul>
            {navigationElements.map((el) => (
              <li key={el.name}>
                <strong>{el.name}</strong> (order: {el.order ?? 99})
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

// v3.2.0: Test style updates
function TestV320Features() {
  // Check for the v3.2.0 .abp-loading style change
  const hasV320Styles = THEME_BASIC_STYLES.includes('rgba(0, 0, 0, 0.05)')
  const hasOldStyles = THEME_BASIC_STYLES.includes('rgba(0, 0, 0, 0.1)')

  return (
    <div className="test-section">
      <h2>v3.2.0: Style Updates</h2>

      <div className="test-card">
        <h3>.abp-loading Opacity Change</h3>
        <p>Version 3.2.0 reduced the <code>.abp-loading</code> background opacity from 0.1 to 0.05 for better UX.</p>
        <div style={{ marginTop: '1rem' }}>
          <p>
            <strong>New opacity (0.05):</strong>{' '}
            <span style={{ color: hasV320Styles ? '#6f6' : '#f66' }}>
              {hasV320Styles ? '✓ Present' : '✗ Missing'}
            </span>
          </p>
          <p>
            <strong>Old opacity (0.1):</strong>{' '}
            <span style={{ color: !hasOldStyles ? '#6f6' : '#f66' }}>
              {!hasOldStyles ? '✓ Removed' : '✗ Still present'}
            </span>
          </p>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <h4>Visual Comparison</h4>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '120px',
                height: '80px',
                background: 'rgba(0, 0, 0, 0.1)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#888',
                fontSize: '12px'
              }}>
                Old (0.1)
              </div>
              <p style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>More visible overlay</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '120px',
                height: '80px',
                background: 'rgba(0, 0, 0, 0.05)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#888',
                fontSize: '12px',
                border: '1px solid #333'
              }}>
                New (0.05)
              </div>
              <p style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>Subtler loading state</p>
            </div>
          </div>
        </div>
        <pre style={{ background: '#1a1a2e', padding: '0.5rem', borderRadius: '4px', fontSize: '12px', marginTop: '1rem' }}>
{`/* v3.2.0 change in styles.provider.ts */
/* Loading overlay (v3.2.0: reduced opacity from 0.1 to 0.05) */
.abp-loading {
    background: rgba(0, 0, 0, 0.05);  /* Was 0.1 in v3.1.0 */
}`}
        </pre>
      </div>

      <div className="test-card">
        <h3>Style Injection</h3>
        <p>The <code>initializeThemeBasicStyles()</code> function injects the global CSS styles:</p>
        <button
          onClick={() => {
            initializeThemeBasicStyles()
            alert('Styles injected! Check document head for <style id="abpjs-theme-basic-styles">')
          }}
          style={{ marginTop: '0.5rem' }}
        >
          Inject Styles
        </button>
        <pre style={{ background: '#1a1a2e', padding: '0.5rem', borderRadius: '4px', fontSize: '12px', marginTop: '1rem' }}>
{`import { initializeThemeBasicStyles, THEME_BASIC_STYLES } from '@abpjs/theme-basic';

// Inject styles during app initialization
initializeThemeBasicStyles();

// Or access the raw CSS string
console.log(THEME_BASIC_STYLES);`}
        </pre>
      </div>

      <div className="test-card">
        <h3>Angular Changes (No React Impact)</h3>
        <ul>
          <li><strong>RoutesComponent:</strong> Added <code>closeDropdown()</code> method using Angular's <code>Renderer2</code></li>
          <li><strong>StylesProvider:</strong> Now uses <code>ReplaceableComponentsService</code> instead of <code>Store</code></li>
        </ul>
        <p style={{ color: '#888', fontSize: '12px', marginTop: '8px' }}>
          These are Angular-specific changes. React handles dropdown closing via state/events and doesn't use Angular's DI system.
        </p>
      </div>
    </div>
  )
}

// v3.0.0: Test new NavItemsService, components, and providers
function TestV300Features() {
  const navItems = useNavItems()
  const navItemsService = getNavItemsService()

  const addCustomNavItem = () => {
    navItemsService.addItems([{
      id: 'custom-v300-' + Date.now(),
      html: `<span style="background:#ec4899;color:white;padding:4px 8px;border-radius:4px;font-size:12px">v3.0.0 Item</span>`,
      order: 50,
    }])
  }

  const removeLastNavItem = () => {
    const customItems = navItems.filter(item => String(item.id).startsWith('custom-v300-'))
    if (customItems.length > 0) {
      navItemsService.removeItem(customItems[customItems.length - 1].id)
    }
  }

  const clearNavItems = () => {
    navItemsService.clear()
  }

  return (
    <div className="test-section">
      <h2>v3.0.0: NavItemsService & New Components</h2>

      <div className="test-card">
        <h3>New Component Keys (v3.0.0)</h3>
        <p>Two new component keys added to <code>eThemeBasicComponents</code>:</p>
        <ul>
          <li><code>CurrentUser</code>: {eThemeBasicComponents.CurrentUser}</li>
          <li><code>Languages</code>: {eThemeBasicComponents.Languages}</li>
        </ul>
        <p style={{ color: '#888', fontSize: '12px', marginTop: '8px' }}>
          These can be used for component replacement.
        </p>
      </div>

      <div className="test-card">
        <h3>NavItemsService (from @abpjs/theme-shared)</h3>
        <p>New singleton service for managing nav items (replaces Layout state approach):</p>
        <div style={{ marginBottom: '1rem' }}>
          <button onClick={addCustomNavItem} style={{ marginRight: '8px' }}>
            Add Nav Item
          </button>
          <button onClick={removeLastNavItem} style={{ marginRight: '8px' }}>
            Remove Last
          </button>
          <button onClick={clearNavItems}>
            Clear All
          </button>
        </div>
        <p>Current nav items ({navItems.length}):</p>
        {navItems.length > 0 ? (
          <ul>
            {navItems.map((item) => (
              <li key={item.id}>
                <strong>{String(item.id)}</strong> (order: {item.order ?? 0})
                {item.component && ' [Component]'}
                {item.html && ' [HTML]'}
                {item.action && ' [Action]'}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#888' }}>No nav items registered.</p>
        )}
        <pre style={{ background: '#1a1a2e', padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
{`// v3.0.0 NavItemsService usage
import { getNavItemsService, useNavItems } from '@abpjs/theme-shared';

// Get service instance
const navItemsService = getNavItemsService();

// Add items
navItemsService.addItems([
  { id: 'my-item', component: MyComponent, order: 1 },
  { id: 'html-item', html: '<span>HTML</span>', order: 2 },
  { id: 'action-item', action: () => console.log('clicked'), order: 3 },
]);

// Remove item
navItemsService.removeItem('my-item');

// Patch item
navItemsService.patchItem('html-item', { order: 10 });

// Clear all
navItemsService.clear();

// React hook for subscribing
const navItems = useNavItems();`}
        </pre>
      </div>

      <div className="test-card">
        <h3>CurrentUserComponent</h3>
        <p>New public API component for the current user nav item:</p>
        <div style={{ padding: '1rem', background: '#1a1a2e', borderRadius: '4px', marginBottom: '1rem' }}>
          <CurrentUserComponent />
        </div>
        <pre style={{ background: '#1a1a2e', padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
{`import { CurrentUserComponent } from '@abpjs/theme-basic';

// Basic usage
<CurrentUserComponent />

// With custom URLs
<CurrentUserComponent
  loginUrl="/login"
  profileUrl="/profile"
  changePasswordUrl="/change-password"
/>

// With small screen mode
<CurrentUserComponent smallScreen />`}
        </pre>
      </div>

      <div className="test-card">
        <h3>LanguagesComponent</h3>
        <p>New public API component for the language selector:</p>
        <div style={{ padding: '1rem', background: '#1a1a2e', borderRadius: '4px', marginBottom: '1rem' }}>
          <LanguagesComponent />
          {/* Show null case info */}
          <p style={{ color: '#888', fontSize: '12px', marginTop: '8px' }}>
            (Component returns null if less than 2 languages are configured)
          </p>
        </div>
        <pre style={{ background: '#1a1a2e', padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
{`import { LanguagesComponent } from '@abpjs/theme-basic';

// Basic usage
<LanguagesComponent />

// Compact mode (icon only)
<LanguagesComponent compact />

// With small screen mode
<LanguagesComponent smallScreen />`}
        </pre>
      </div>

      <div className="test-card">
        <h3>Providers (v3.0.0)</h3>
        <p>New initialization functions for theme-basic:</p>
        <pre style={{ background: '#1a1a2e', padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
{`import {
  initializeThemeBasicNavItems,
  initializeThemeBasicStyles,
  BASIC_THEME_NAV_ITEM_PROVIDERS,
  BASIC_THEME_STYLES_PROVIDERS,
} from '@abpjs/theme-basic';

// Initialize nav items (adds Languages and CurrentUser)
initializeThemeBasicNavItems();

// Initialize global CSS styles
initializeThemeBasicStyles();

// Or use the providers for custom setup
const configFn = BASIC_THEME_NAV_ITEM_PROVIDERS.configureNavItems(navItemsService);
configFn();

const stylesFn = BASIC_THEME_STYLES_PROVIDERS.configureStyles();
stylesFn();`}
        </pre>
      </div>

      <div className="test-card">
        <h3>Deprecations in v3.0.0</h3>
        <div style={{ padding: '0.75rem', background: '#2e2a1a', borderRadius: '4px', border: '1px solid #4a3e2e' }}>
          <p style={{ color: '#fa6', margin: 0, fontSize: '14px' }}>
            <strong>Deprecated:</strong> The following are deprecated in v3.0.0:
          </p>
          <ul style={{ color: '#fa6', fontSize: '13px', marginBottom: 0 }}>
            <li><code>eNavigationElementNames</code> - Use NavItemsService instead</li>
            <li><code>useLayoutStateService</code> - Use NavItemsService instead</li>
            <li><code>LayoutStateService</code> - Use NavItemsService instead</li>
          </ul>
        </div>
        <p style={{ color: '#888', fontSize: '12px', marginTop: '8px' }}>
          These are kept for backwards compatibility but will be removed in a future version.
        </p>
      </div>
    </div>
  )
}

// v2.7.0: Test new public API components and services (some deprecated in v3.0.0)
function TestV270Features() {
  const layoutStateService = useLayoutStateService()
  const navigationElements = layoutStateService.getNavigationElements()

  const addCustomElement = () => {
    layoutStateService.dispatchAddNavigationElement({
      name: 'v270-custom-' + Date.now(),
      element: (
        <span style={{
          background: '#9333ea',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          v2.7.0 Custom Element
        </span>
      ),
      order: 50
    })
  }

  const removeLastElement = () => {
    const customElements = navigationElements.filter(el => el.name.startsWith('v270-custom-'))
    if (customElements.length > 0) {
      layoutStateService.dispatchRemoveNavigationElementByName(customElements[customElements.length - 1].name)
    }
  }

  return (
    <div className="test-section">
      <h2>v2.7.0: New Public API Features</h2>

      <div className="test-card">
        <h3>Component Keys (eThemeBasicComponents)</h3>
        <p>New enum for component replacement system:</p>
        <ul>
          <li><code>ApplicationLayout</code>: {eThemeBasicComponents.ApplicationLayout}</li>
          <li><code>AccountLayout</code>: {eThemeBasicComponents.AccountLayout}</li>
          <li><code>EmptyLayout</code>: {eThemeBasicComponents.EmptyLayout}</li>
          <li><code>Logo</code>: {eThemeBasicComponents.Logo}</li>
          <li><code>Routes</code>: {eThemeBasicComponents.Routes}</li>
          <li><code>NavItems</code>: {eThemeBasicComponents.NavItems}</li>
        </ul>
      </div>

      <div className="test-card">
        <h3>Navigation Element Names (eNavigationElementNames)</h3>
        <p>Built-in navigation element identifiers:</p>
        <ul>
          <li><code>Language</code>: {eNavigationElementNames.Language}</li>
          <li><code>User</code>: {eNavigationElementNames.User}</li>
        </ul>
      </div>

      <div className="test-card">
        <h3>LayoutApplication Component Keys</h3>
        <p>Static properties for component replacement:</p>
        <ul>
          <li><code>logoComponentKey</code>: {LayoutApplication.logoComponentKey}</li>
          <li><code>routesComponentKey</code>: {LayoutApplication.routesComponentKey}</li>
          <li><code>navItemsComponentKey</code>: {LayoutApplication.navItemsComponentKey}</li>
        </ul>
      </div>

      <div className="test-card">
        <h3>LayoutStateService (useLayoutStateService)</h3>
        <p>New service-like hook for managing navigation elements:</p>
        <div style={{ marginBottom: '1rem' }}>
          <button onClick={addCustomElement} style={{ marginRight: '8px' }}>
            Add Custom Element
          </button>
          <button onClick={removeLastElement}>
            Remove Last Custom Element
          </button>
        </div>
        <p>Current navigation elements ({navigationElements.length}):</p>
        {navigationElements.length > 0 ? (
          <ul>
            {navigationElements.map((el) => (
              <li key={el.name}>
                <strong>{el.name}</strong> (order: {el.order ?? 99})
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#888' }}>No navigation elements registered.</p>
        )}
        <pre style={{ background: '#1a1a2e', padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
{`// Usage example:
const layoutStateService = useLayoutStateService();

// Get elements
const elements = layoutStateService.getNavigationElements();

// Add element
layoutStateService.dispatchAddNavigationElement({
  name: 'my-element',
  element: <MyComponent />,
  order: 1
});

// Remove element
layoutStateService.dispatchRemoveNavigationElementByName('my-element');`}
        </pre>
      </div>

      <div className="test-card">
        <h3>Public API Components</h3>
        <p>New standalone components for customization:</p>

        <div style={{ marginTop: '1rem' }}>
          <h4>LogoComponent</h4>
          <p>Standalone logo component using branding context:</p>
          <div style={{ padding: '1rem', background: '#1a1a2e', borderRadius: '4px', marginBottom: '1rem' }}>
            <LogoComponent />
          </div>
          <pre style={{ background: '#1a1a2e', padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
{`import { LogoComponent } from '@abpjs/theme-basic';

// Basic usage
<LogoComponent />

// With custom link
<LogoComponent linkTo="/dashboard" />`}
          </pre>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <h4>RoutesComponent</h4>
          <p>Navigation routes component with visibility filtering:</p>
          <pre style={{ background: '#1a1a2e', padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
{`import { RoutesComponent } from '@abpjs/theme-basic';

// Uses routes from config (v2.9.0 simplified API)
<RoutesComponent />

// With custom routes
<RoutesComponent routes={customRoutes} />

// With default icon for routes without icons
<RoutesComponent defaultIcon={<LuHome />} />

// Mobile mode
<RoutesComponent smallScreen={true} />`}
          </pre>
          <p style={{ color: '#888', fontSize: '12px', marginTop: '8px' }}>
            Note: <code>isDropdownChildDynamic</code> prop was removed in v2.9.0.
          </p>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <h4>NavItemsComponent</h4>
          <p>Navigation items (language selector, user menu, custom elements):</p>
          <pre style={{ background: '#1a1a2e', padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
{`import { NavItemsComponent } from '@abpjs/theme-basic';

// Basic usage
<NavItemsComponent />

// With props
<NavItemsComponent
  showLanguageSelector={true}
  showCurrentUser={true}
  userProfileProps={{
    onLogout: () => handleLogout(),
    onChangePassword: () => openChangePassword(),
    onProfile: () => openProfile(),
  }}
/>`}
          </pre>
        </div>
      </div>
    </div>
  )
}

function TestVersionInfo() {
  return (
    <div className="test-section">
      <h2>Version Info</h2>

      <div className="test-card">
        <h3>What's New in v3.2.0</h3>
        <p>Version 3.2.0 includes a UX improvement for loading overlays.</p>
        <ul>
          <li><strong>Changed:</strong> <code>.abp-loading</code> background opacity reduced from 0.1 to 0.05</li>
          <li><strong>Angular Change:</strong> <code>RoutesComponent</code> added <code>closeDropdown()</code> method</li>
          <li><strong>Angular Change:</strong> <code>StylesProvider</code> now uses <code>ReplaceableComponentsService</code></li>
          <li><strong>React Status:</strong> Opacity change applied; Angular-specific changes not applicable</li>
        </ul>
        <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#1a2e1a', borderRadius: '4px', border: '1px solid #2e4a2e' }}>
          <p style={{ color: '#6f6', margin: 0, fontSize: '14px' }}>
            <strong>UX Improvement:</strong> The lighter loading overlay (0.05 opacity) is less intrusive while still providing visual feedback.
          </p>
        </div>
      </div>

      <div className="test-card">
        <h3>What's New in v3.1.0</h3>
        <p>Version 3.1.0 is an internal Angular update with no functional changes for React users.</p>
        <ul>
          <li><strong>Angular Change:</strong> Added <code>SubscriptionService</code> for managing window resize subscriptions</li>
          <li><strong>Angular Change:</strong> <code>ApplicationLayoutComponent</code> now uses <code>SubscriptionService.trackAuto()</code></li>
          <li><strong>React Status:</strong> No changes needed - React uses CSS breakpoints (<code>hideBelow</code>/<code>hideFrom</code>) via Chakra UI</li>
        </ul>
        <p style={{ color: '#888', fontSize: '14px', marginTop: '8px' }}>
          The Angular <code>SubscriptionService</code> helps manage RxJS subscriptions for automatic cleanup.
          In React, responsive behavior is handled declaratively through Chakra UI's CSS breakpoint system,
          which is more efficient and doesn't require JavaScript event listeners or manual subscription management.
        </p>
        <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#1a2e1a', borderRadius: '4px', border: '1px solid #2e4a2e' }}>
          <p style={{ color: '#6f6', margin: 0, fontSize: '14px' }}>
            <strong>No code changes required</strong> - React's Chakra UI breakpoints handle responsive layout automatically.
          </p>
        </div>
      </div>

      <div className="test-card">
        <h3>What's New in v3.0.0</h3>
        <p>Version 3.0.0 introduces the NavItemsService architecture and new public API components.</p>
        <ul>
          <li><strong>New:</strong> <code>NavItemsService</code> from <code>@abpjs/theme-shared</code> for managing nav items</li>
          <li><strong>New:</strong> <code>useNavItems</code> hook for subscribing to nav items changes</li>
          <li><strong>New Component:</strong> <code>CurrentUserComponent</code> - User avatar and menu</li>
          <li><strong>New Component:</strong> <code>LanguagesComponent</code> - Language selector dropdown</li>
          <li><strong>New Enum Keys:</strong> <code>eThemeBasicComponents.CurrentUser</code> and <code>eThemeBasicComponents.Languages</code></li>
          <li><strong>New Providers:</strong> <code>initializeThemeBasicNavItems()</code>, <code>initializeThemeBasicStyles()</code></li>
          <li><strong>Deprecated:</strong> <code>eNavigationElementNames</code>, <code>useLayoutStateService</code>, <code>LayoutStateService</code></li>
        </ul>
        <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#2e2a1a', borderRadius: '4px', border: '1px solid #4a3e2e' }}>
          <p style={{ color: '#fa6', margin: 0, fontSize: '14px' }}>
            <strong>Migration:</strong> Use <code>NavItemsService</code> from <code>@abpjs/theme-shared</code> instead of the deprecated <code>LayoutStateService</code>.
          </p>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <h4>New NavItemsService API (v3.0.0)</h4>
          <pre style={{ background: '#1a1a2e', padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
{`import { getNavItemsService, useNavItems } from '@abpjs/theme-shared';
import { CurrentUserComponent, LanguagesComponent } from '@abpjs/theme-basic';

// Get service instance
const navItemsService = getNavItemsService();

// Add custom nav items
navItemsService.addItems([
  { id: 'custom', component: MyComponent, order: 50 },
]);

// Use hook in components
const navItems = useNavItems();

// Use public API components directly
<CurrentUserComponent loginUrl="/login" />
<LanguagesComponent compact />`}
          </pre>
        </div>
      </div>

      <div className="test-card">
        <h3>What's New in v2.9.0</h3>
        <p>Version 2.9.0 simplifies the API by removing unused props and improves RTL support.</p>
        <ul>
          <li><strong>Removed:</strong> <code>isDropdownChildDynamic</code> from <code>RoutesComponent</code></li>
          <li><strong>Removed:</strong> <code>isDropdownChildDynamic</code> from <code>ApplicationLayoutComponent</code></li>
          <li><strong>Angular Change:</strong> Added RTL support styles for dropdown menus</li>
          <li><strong>React Status:</strong> RTL already supported via Chakra UI and <code>useDirection</code> hook</li>
          <li><strong>Angular Change:</strong> Media query breakpoint changed from 768px to 992px</li>
          <li><strong>React Status:</strong> Uses Chakra UI breakpoints - already appropriate for our layout</li>
          <li><strong>Updated:</strong> Dependency on <code>@abpjs/theme-shared</code> to v2.9.0</li>
        </ul>
        <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#1a2e1a', borderRadius: '4px', border: '1px solid #2e4a2e' }}>
          <p style={{ color: '#6f6', margin: 0, fontSize: '14px' }}>
            <strong>Migration:</strong> If you were using <code>isDropdownChildDynamic</code> prop, simply remove it - it had no effect.
          </p>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <h4>Updated RoutesComponent API (v2.9.0)</h4>
          <pre style={{ background: '#1a1a2e', padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
{`// v2.9.0 RoutesComponent props (simplified)
interface RoutesComponentProps {
  smallScreen?: boolean;      // Mobile mode
  defaultIcon?: ReactNode;    // Fallback icon
  routes?: ABP.FullRoute[];   // Custom routes
}

// Example usage
<RoutesComponent />
<RoutesComponent defaultIcon={<LuFolder />} />
<RoutesComponent routes={customRoutes} smallScreen={isMobile} />`}
          </pre>
        </div>
      </div>

      <div className="test-card">
        <h3>What's New in v2.7.0</h3>
        <p>Version 2.7.0 adds new public API components and enums for component customization.</p>
        <ul>
          <li><strong>New Enum:</strong> <code>eThemeBasicComponents</code> - Component keys for replacement system</li>
          <li><strong>New Enum:</strong> <code>eNavigationElementNames</code> - Built-in navigation element names</li>
          <li><strong>New Component:</strong> <code>LogoComponent</code> - Standalone logo with branding context</li>
          <li><strong>New Component:</strong> <code>NavItemsComponent</code> - Navigation items (language, user)</li>
          <li><strong>New Component:</strong> <code>RoutesComponent</code> - Route navigation with filtering</li>
          <li><strong>New Hook:</strong> <code>useLayoutStateService</code> - Service-like navigation management</li>
          <li><strong>Updated:</strong> <code>LayoutApplication</code> - Added static component key properties</li>
        </ul>
        <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#1a1a2e', borderRadius: '4px', border: '1px solid #333' }}>
          <p style={{ color: '#9cf', margin: 0, fontSize: '14px' }}>
            <strong>Migration:</strong> These are additions - no breaking changes. Existing code continues to work.
          </p>
        </div>
      </div>

      <div className="test-card">
        <h3>What's New in v2.4.0</h3>
        <p>Version 2.4.0 includes internal Angular changes with no impact on React users.</p>
        <ul>
          <li><strong>Angular Change:</strong> <code>InitialService</code> now uses <code>DomInsertionService</code> instead of <code>LazyLoadService</code></li>
          <li><strong>Angular Change:</strong> <code>appendStyle()</code> now returns <code>void</code> instead of <code>Observable&lt;void&gt;</code></li>
          <li><strong>React Status:</strong> No equivalent service needed - Chakra UI handles all styling via CSS-in-JS</li>
          <li><strong>Updated:</strong> Dependency on <code>@abpjs/theme-shared</code> to v2.4.0</li>
        </ul>
        <p style={{ color: '#888', fontSize: '14px', marginTop: '8px' }}>
          The Angular <code>InitialService</code> is responsible for dynamically appending stylesheets at runtime.
          In React, this is handled declaratively through <code>ThemeBasicProvider</code> and Chakra UI's theme system.
        </p>
        <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#1a2e1a', borderRadius: '4px', border: '1px solid #2e4a2e' }}>
          <p style={{ color: '#6f6', margin: 0, fontSize: '14px' }}>
            <strong>No code changes required</strong> - React uses <code>defaultThemeBasicConfig</code> and <code>defineConfig()</code> for theming.
          </p>
        </div>
      </div>

      <div className="test-card">
        <h3>What's New in v2.2.0</h3>
        <p>Version 2.2.0 is a dependency update with no functional changes for React users.</p>
        <ul>
          <li><strong>Angular Change:</strong> Added <code>.ui-table .pagination-wrapper</code> styles</li>
          <li><strong>React Status:</strong> Chakra UI handles table pagination styling - no changes needed</li>
          <li><strong>Updated:</strong> Dependency on <code>@abpjs/theme-shared</code> to v2.2.0</li>
        </ul>
        <p style={{ color: '#888', fontSize: '14px', marginTop: '8px' }}>
          The new Angular styles are for PrimeNG table pagination. React uses Chakra UI's
          built-in table components, so these styles don't affect the React implementation.
        </p>
      </div>

      <div className="test-card">
        <h3>What's New in v2.1.0</h3>
        <p>Version 2.1.0 includes internal improvements with no breaking changes for React users.</p>
        <ul>
          <li><strong>Angular Change:</strong> <code>OAuthService</code> replaced with <code>AuthService</code></li>
          <li><strong>React Status:</strong> Already using <code>useAuth</code> from <code>@abpjs/core</code> - no changes needed</li>
          <li><strong>Angular Change:</strong> Added styles for loading, modal-backdrop, confirmation dialogs</li>
          <li><strong>React Status:</strong> Chakra UI handles all styling - no changes needed</li>
        </ul>
        <p style={{ color: '#888', fontSize: '14px', marginTop: '8px' }}>
          The LayoutApplication component continues to use <code>useAuth()</code> for authentication,
          which provides <code>logout</code>, <code>isAuthenticated</code>, and user information.
        </p>
      </div>

      <div className="test-card">
        <h3>What's New in v2.0.0</h3>
        <p>Version 2.0.0 was a minor update with no functional changes for React users.</p>
        <ul>
          <li><strong>Removed:</strong> Legacy <code>.abp-confirm</code> CSS styles (Angular Bootstrap-specific)</li>
          <li><strong>Updated:</strong> Dependency on <code>@abpjs/theme-shared</code> to v2.0.0</li>
        </ul>
        <p style={{ color: '#888', fontSize: '14px', marginTop: '8px' }}>
          Note: The removed styles were for Angular's PrimeNG-based confirmation dialogs.
          React uses Chakra UI, so this change has no impact.
        </p>
      </div>

      <div className="test-card">
        <h3>LAYOUTS Constant</h3>
        <p>The package exports a <code>LAYOUTS</code> constant for ABP's dynamic layout system:</p>
        <pre style={{ background: '#1a1a2e', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`import { LAYOUTS } from '@abpjs/theme-basic';

// LAYOUTS = [LayoutApplication, LayoutAccount, LayoutEmpty]
// Each has a static 'type' property:
// - LayoutApplication.type = 'application'
// - LayoutAccount.type = 'account'
// - LayoutEmpty.type = 'empty'`}
        </pre>
      </div>
    </div>
  )
}

export function TestThemeBasicPage() {
  return (
    <div>
      <h1>@abpjs/theme-basic Tests (v3.2.0)</h1>
      <p>Testing layouts, navigation, NavItemsService, and new components.</p>
      <p style={{ fontSize: '14px', color: '#888', marginBottom: '16px' }}>
        Version 3.2.0 - Reduced .abp-loading opacity for better UX
      </p>

      <TestVersionInfo />
      <TestV320Features />
      <TestV300Features />
      <TestV270Features />
      <TestLayoutService />
      <TestApplicationInfo />
      <TestLayouts />
      <TestRoutes />
      <TestCurrentUser />
    </div>
  )
}

export default TestThemeBasicPage
