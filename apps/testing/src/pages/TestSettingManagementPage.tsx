/**
 * Test page for @abpjs/setting-management package
 * Tests: SettingLayout, useSettingManagement hook, SettingManagementService
 */
import { useState, useEffect } from 'react'
import {
  SettingLayout,
  useSettingManagement,
  getSettingManagementService,
  getSettingManagementStateService,
  SETTING_MANAGEMENT_ROUTES,
  eSettingManagementComponents,
  eSettingManagementRouteNames,
  // v3.0.0 config exports
  SETTING_MANAGEMENT_ROUTE_PROVIDERS,
  configureRoutes,
  hideRoutes,
  initializeSettingManagementRoutes,
} from '@abpjs/setting-management'
import type { SettingTab, SettingManagement } from '@abpjs/setting-management'

// Type annotation helper to avoid 'any' warnings
const logTabSelect = (tab: SettingTab) => console.log('Tab selected:', tab.name)

function TestSettingLayoutComponent() {
  const { addSettings, clearSettings } = useSettingManagement()
  const [showLayout, setShowLayout] = useState(false)

  useEffect(() => {
    // Add some test settings when showing layout
    if (showLayout) {
      addSettings([
        { name: 'Account Settings', order: 1, url: '/settings/account' },
        { name: 'Identity Settings', order: 2, url: '/settings/identity' },
        { name: 'Tenant Settings', order: 3, url: '/settings/tenant', requiredPolicy: 'AbpTenantManagement.Tenants' },
      ])
    }
    return () => {
      if (showLayout) {
        clearSettings()
      }
    }
  }, [showLayout, addSettings, clearSettings])

  return (
    <div className="test-section">
      <h2>SettingLayout Component</h2>

      <div className="test-card">
        <h3>Toggle Layout Demo</h3>
        <p>Show/hide the SettingLayout component with sample tabs:</p>
        <button onClick={() => setShowLayout(!showLayout)}>
          {showLayout ? 'Hide Layout' : 'Show Layout'}
        </button>
      </div>

      {showLayout && (
        <div className="test-card">
          <h3>SettingLayout Preview</h3>
          <div style={{ border: '1px solid #333', borderRadius: '8px', padding: '16px' }}>
            <SettingLayout
              onTabSelect={logTabSelect}
            >
              <div style={{ padding: '16px', borderRadius: '8px' }}>
                <h4>Content Area</h4>
                <p>This is where the settings content would render based on the selected tab.</p>
                <p style={{ color: '#888', fontSize: '14px' }}>
                  Click on tabs in the sidebar to see the selection change.
                </p>
              </div>
            </SettingLayout>
          </div>
        </div>
      )}

      <div className="test-card">
        <h3>Component Props</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Prop</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Required</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: '8px' }}>children</td><td>ReactNode</td><td>No</td></tr>
            <tr><td style={{ padding: '8px' }}>className</td><td>string</td><td>No</td></tr>
            <tr><td style={{ padding: '8px' }}>onTabSelect</td><td>(tab: SettingTab) =&gt; void</td><td>No</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TestSettingManagementHook() {
  const {
    settings,
    selected,
    addSetting,
    addSettings,
    removeSetting,
    setSelected,
    selectByName,
    clearSettings,
  } = useSettingManagement()

  const [newTabName, setNewTabName] = useState('')
  const [newTabOrder, setNewTabOrder] = useState(10)
  const [newTabUrl, setNewTabUrl] = useState('')

  const handleAddSetting = () => {
    if (newTabName) {
      addSetting({
        name: newTabName,
        order: newTabOrder,
        url: newTabUrl || undefined,
      })
      setNewTabName('')
      setNewTabUrl('')
      setNewTabOrder(10)
    }
  }

  const handleAddSampleSettings = () => {
    addSettings([
      { name: 'General', order: 1, url: '/settings/general' },
      { name: 'Security', order: 2, url: '/settings/security' },
      { name: 'Notifications', order: 3, url: '/settings/notifications' },
      { name: 'Advanced', order: 100, url: '/settings/advanced' },
    ])
  }

  return (
    <div className="test-section">
      <h2>useSettingManagement Hook</h2>

      <div className="test-card">
        <h3>Hook State</h3>
        <p>settings count: <strong>{settings.length}</strong></p>
        <p>selected: <strong>{selected?.name || 'undefined'}</strong></p>
      </div>

      <div className="test-card">
        <h3>Add Setting Tab</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Tab Name"
            value={newTabName}
            onChange={(e) => setNewTabName(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333'
            }}
          />
          <input
            type="number"
            placeholder="Order"
            value={newTabOrder}
            onChange={(e) => setNewTabOrder(Number(e.target.value))}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333'
            }}
          />
          <input
            type="text"
            placeholder="URL (optional)"
            value={newTabUrl}
            onChange={(e) => setNewTabUrl(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333'
            }}
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleAddSetting} disabled={!newTabName}>
              Add Setting
            </button>
            <button onClick={handleAddSampleSettings}>
              Add Sample Settings
            </button>
            <button onClick={clearSettings} style={{ background: '#c44' }}>
              Clear All
            </button>
          </div>
        </div>
      </div>

      {settings.length > 0 && (
        <div className="test-card">
          <h3>Registered Settings (sorted by order)</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #333' }}>
                <th style={{ textAlign: 'left', padding: '8px' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Order</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>URL</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {settings.map((tab) => (
                <tr
                  key={tab.name}
                  style={{
                    borderBottom: '1px solid #222',
                    background: selected?.name === tab.name ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
                  }}
                >
                  <td style={{ padding: '8px' }}>
                    {tab.name}
                    {selected?.name === tab.name && (
                      <span style={{ marginLeft: '8px', color: '#3b82f6', fontSize: '12px' }}>(selected)</span>
                    )}
                  </td>
                  <td style={{ padding: '8px' }}>{tab.order}</td>
                  <td style={{ padding: '8px' }}>
                    <code style={{ background: '#333', padding: '2px 6px', borderRadius: '4px' }}>
                      {tab.url || '-'}
                    </code>
                  </td>
                  <td style={{ padding: '8px' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={() => setSelected(tab)}
                        style={{ padding: '4px 8px', fontSize: '12px' }}
                      >
                        Select
                      </button>
                      <button
                        onClick={() => removeSetting(tab.name)}
                        style={{ padding: '4px 8px', fontSize: '12px', background: '#c44' }}
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="test-card">
        <h3>Selection Methods</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => setSelected(null)}>
            Clear Selection
          </button>
          <button onClick={() => selectByName('Security')} disabled={!settings.find((s: SettingTab) => s.name === 'Security')}>
            Select by Name ("Security")
          </button>
        </div>
      </div>

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
            <tr><td style={{ padding: '8px' }}>addSetting</td><td>Add a single setting tab</td></tr>
            <tr><td style={{ padding: '8px' }}>addSettings</td><td>Add multiple setting tabs</td></tr>
            <tr><td style={{ padding: '8px' }}>removeSetting</td><td>Remove a setting tab by name</td></tr>
            <tr><td style={{ padding: '8px' }}>setSelected</td><td>Set the selected tab</td></tr>
            <tr><td style={{ padding: '8px' }}>selectByName</td><td>Select a tab by name</td></tr>
            <tr><td style={{ padding: '8px' }}>selectByUrl</td><td>Select a tab by URL</td></tr>
            <tr><td style={{ padding: '8px' }}>clearSettings</td><td>Clear all registered settings</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TestSettingManagementService() {
  const [serviceState, setServiceState] = useState({
    settingsCount: 0,
    selectedName: 'undefined',
  })

  const refreshState = () => {
    const service = getSettingManagementService()
    setServiceState({
      settingsCount: service.settings.length,
      selectedName: service.selected?.name || 'undefined',
    })
  }

  useEffect(() => {
    const service = getSettingManagementService()
    const unsubscribe = service.subscribe(refreshState)
    refreshState()
    return unsubscribe
  }, [])

  const handleServiceAddSetting = () => {
    const service = getSettingManagementService()
    service.addSetting({
      name: `Service Tab ${Date.now()}`,
      order: Math.floor(Math.random() * 100),
    })
  }

  return (
    <div className="test-section">
      <h2>SettingManagementService</h2>
      <p style={{ fontSize: '14px', color: '#888', marginBottom: '1rem' }}>
        Note: In Angular, this service was removed in favor of using Store directly.
        In React, we keep this service as it provides a clean API without requiring a global store.
      </p>

      <div className="test-card">
        <h3>Service State</h3>
        <p>Settings count: <strong>{serviceState.settingsCount}</strong></p>
        <p>Selected: <strong>{serviceState.selectedName}</strong></p>
        <button onClick={refreshState} style={{ marginTop: '8px' }}>
          Refresh State
        </button>
      </div>

      <div className="test-card">
        <h3>Direct Service Access</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          The service is a singleton shared between hook and direct access:
        </p>
        <button onClick={handleServiceAddSetting}>
          Add Tab via Service
        </button>
        <pre style={{ marginTop: '8px', padding: '8px', borderRadius: '4px', fontSize: '12px' }}>
{`import { getSettingManagementService } from '@abpjs/setting-management';

const service = getSettingManagementService();
service.addSetting({ name: 'My Tab', order: 1 });
service.subscribe(() => console.log('Changed!'));`}
        </pre>
      </div>
    </div>
  )
}

function TestSettingManagementStateService() {
  const [stateServiceState, setStateServiceState] = useState<SettingManagement.State>({
    selectedTab: undefined,
  })

  const refreshState = () => {
    const stateService = getSettingManagementStateService()
    setStateServiceState(stateService.getState())
  }

  useEffect(() => {
    const stateService = getSettingManagementStateService()
    const unsubscribe = stateService.subscribe(refreshState)
    refreshState()
    return unsubscribe
  }, [])

  const handleSetSelectedTab = () => {
    const stateService = getSettingManagementStateService()
    stateService.setSelectedTab({
      name: 'Test Tab',
      order: 1,
      url: '/settings/test',
    })
  }

  const handleClearSelectedTab = () => {
    const stateService = getSettingManagementStateService()
    stateService.setSelectedTab(undefined)
  }

  const handleReset = () => {
    const stateService = getSettingManagementStateService()
    stateService.reset()
  }

  return (
    <div className="test-section">
      <h2>SettingManagementStateService (v3.0.0)</h2>
      <p style={{ fontSize: '14px', color: '#888', marginBottom: '1rem' }}>
        State service equivalent to Angular's NGXS SettingManagementState.
        Provides selectors and actions for managing the selected setting tab.
        <br/><strong style={{ color: '#22c55e' }}>v3.0.0:</strong> Now uses <code>undefined</code> instead of <code>null</code> for unset values.
      </p>

      <div className="test-card">
        <h3>State Service State</h3>
        <p>selectedTab: <strong>{stateServiceState.selectedTab?.name || 'undefined'}</strong></p>
        {stateServiceState.selectedTab && (
          <div style={{ marginTop: '8px', padding: '8px', background: 'rgba(100,108,255,0.1)', borderRadius: '4px' }}>
            <p style={{ fontSize: '12px', margin: 0 }}>name: {stateServiceState.selectedTab.name}</p>
            <p style={{ fontSize: '12px', margin: 0 }}>order: {stateServiceState.selectedTab.order}</p>
            <p style={{ fontSize: '12px', margin: 0 }}>url: {stateServiceState.selectedTab.url || '-'}</p>
          </div>
        )}
      </div>

      <div className="test-card">
        <h3>State Service Actions</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={handleSetSelectedTab}>
            Set Selected Tab
          </button>
          <button onClick={handleClearSelectedTab}>
            Clear Selected Tab
          </button>
          <button onClick={handleReset} style={{ background: '#c44' }}>
            Reset State
          </button>
        </div>
      </div>

      <div className="test-card">
        <h3>State Service Methods</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Method</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ background: 'rgba(100,108,255,0.1)' }}><td style={{ padding: '8px' }}>getSelectedTab()</td><td>Get the currently selected tab (selector)</td></tr>
            <tr style={{ background: 'rgba(100,108,255,0.1)' }}><td style={{ padding: '8px' }}>setSelectedTab(tab)</td><td>Set the selected tab (action)</td></tr>
            <tr style={{ background: 'rgba(100,108,255,0.1)' }}><td style={{ padding: '8px' }}>getState()</td><td>Get the full state object</td></tr>
            <tr style={{ background: 'rgba(100,108,255,0.1)' }}><td style={{ padding: '8px' }}>reset()</td><td>Reset state to initial values</td></tr>
            <tr style={{ background: 'rgba(100,108,255,0.1)' }}><td style={{ padding: '8px' }}>subscribe(callback)</td><td>Subscribe to state changes</td></tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>Usage Example</h3>
        <pre style={{ padding: '8px', borderRadius: '4px', fontSize: '12px' }}>
{`import { getSettingManagementStateService } from '@abpjs/setting-management';

const stateService = getSettingManagementStateService();

// Get current selected tab
const selectedTab = stateService.getSelectedTab();

// Set selected tab (equivalent to Angular's SetSelectedSettingTab action)
stateService.setSelectedTab({ name: 'Account', order: 1 });

// Subscribe to changes
const unsubscribe = stateService.subscribe(() => {
  console.log('State changed:', stateService.getState());
});`}
        </pre>
      </div>
    </div>
  )
}

function TestConstants() {
  return (
    <div className="test-section">
      <h2>Constants</h2>

      <div className="test-card">
        <h3>SETTING_MANAGEMENT_ROUTES</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          Default route configuration for the setting management module.
          Note: In Angular, route constants were removed. We keep them in React for convenience.
        </p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{JSON.stringify(SETTING_MANAGEMENT_ROUTES, null, 2)}
        </pre>
      </div>
    </div>
  )
}

function TestModels() {
  return (
    <div className="test-section">
      <h2>Models</h2>

      <div className="test-card" style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)' }}>
        <h3>SettingTab Interface (v3.0.0)</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          <strong style={{ color: '#22c55e' }}>v3.0.0:</strong> Now extends ABP.Tab with additional properties. The <code>order</code> property is now required.
        </p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`interface SettingTab extends Omit<ABP.Tab, 'component'> {
  /** Display name of the tab */
  name: string;
  /** Order/priority for tab sorting (REQUIRED in v3.0.0) */
  order: number;
  /** Required policy to view this tab */
  requiredPolicy?: string;
  /** URL/route for this settings tab */
  url?: string;
  /** Optional component to render */
  component?: ComponentType<unknown>;
}`}
        </pre>
      </div>

      <div className="test-card" style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)' }}>
        <h3>SettingManagement.State Interface (v3.0.0)</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          State interface for setting management state tracking.
          <br/><strong style={{ color: '#22c55e' }}>v3.0.0:</strong> Uses <code>undefined</code> instead of <code>null</code> for selectedTab.
        </p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`namespace SettingManagement {
  interface State {
    /** Currently selected setting tab (undefined instead of null in v3.0.0) */
    selectedTab?: SettingTab;
  }
}`}
        </pre>
      </div>

      <div className="test-card" style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)' }}>
        <h3>UseSettingManagementReturn Interface (v3.0.0)</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          <strong style={{ color: '#22c55e' }}>v3.0.0:</strong> Uses <code>undefined</code> instead of <code>null</code> for selected.
        </p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`interface UseSettingManagementReturn {
  settings: SettingTab[];
  selected: SettingTab | undefined;  // v3.0.0: changed from null
  addSetting: (tab: SettingTab) => void;
  addSettings: (tabs: SettingTab[]) => void;
  removeSetting: (name: string) => void;
  setSelected: (tab: SettingTab | undefined) => void;  // v3.0.0: changed from null
  selectByName: (name: string) => void;
  selectByUrl: (url: string) => void;
  clearSettings: () => void;
}`}
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
          New in v3.0.0: Route configuration providers for setting management routes.
          Matches Angular's pattern for configuring routes at application startup.
        </p>

        <h4 style={{ marginTop: '16px' }}>SETTING_MANAGEMENT_ROUTE_PROVIDERS</h4>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          Object containing route configuration functions:
        </p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
{`// SETTING_MANAGEMENT_ROUTE_PROVIDERS object:
{
  configureRoutes: typeof configureRoutes,
  hideRoutes: typeof hideRoutes
}

// configureRoutes is: ${typeof configureRoutes}
// hideRoutes is: ${typeof hideRoutes}
// SETTING_MANAGEMENT_ROUTE_PROVIDERS has configureRoutes: ${!!SETTING_MANAGEMENT_ROUTE_PROVIDERS.configureRoutes}
// SETTING_MANAGEMENT_ROUTE_PROVIDERS has hideRoutes: ${!!SETTING_MANAGEMENT_ROUTE_PROVIDERS.hideRoutes}`}
        </pre>
      </div>

      <div className="test-card" style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)' }}>
        <h3>configureRoutes Function</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          Configures the setting management module routes. Returns a function that adds routes to RoutesService.
        </p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
{`import { configureRoutes } from '@abpjs/setting-management';
import { getRoutesService } from '@abpjs/core';

// Configure routes
const routes = getRoutesService();
const addRoutes = configureRoutes(routes);
addRoutes();

// Route configuration added:
// - path: '/setting-management'
// - name: 'AbpSettingManagement::Settings'
// - parentName: 'AbpUiNavigation::Menu:Administration'
// - layout: eLayoutType.application
// - iconClass: 'bi bi-gear'
// - order: 100`}
        </pre>
      </div>

      <div className="test-card" style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)' }}>
        <h3>hideRoutes Function</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          Hides the setting management route if no setting tabs are registered.
          Checks if there are any visible setting tabs and hides the route if none exist.
        </p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
{`import { hideRoutes } from '@abpjs/setting-management';
import { getRoutesService, getSettingTabsService } from '@abpjs/core';

// Conditionally hide routes
const routes = getRoutesService();
const tabs = getSettingTabsService();
const hideIfEmpty = hideRoutes(routes, tabs);
hideIfEmpty();

// If no visible tabs are registered, the route will be patched with:
// { invisible: true }`}
        </pre>
      </div>

      <div className="test-card" style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)' }}>
        <h3>initializeSettingManagementRoutes Helper</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          Convenience function that initializes setting management routes using global services.
          Combines configureRoutes and hideRoutes in a single call.
        </p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
{`import { initializeSettingManagementRoutes } from '@abpjs/setting-management';

// In your app initialization:
initializeSettingManagementRoutes();

// This is equivalent to:
// const routes = getRoutesService();
// const tabs = getSettingTabsService();
// const addRoutes = configureRoutes(routes);
// addRoutes();
// const hideIfEmpty = hideRoutes(routes, tabs);
// hideIfEmpty();

// initializeSettingManagementRoutes is: ${typeof initializeSettingManagementRoutes}`}
        </pre>
      </div>

      <div className="test-card" style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)' }}>
        <h3>State Change: null → undefined</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          In v3.0.0, the state service now uses <code>undefined</code> instead of <code>null</code> for unset values.
          This aligns with TypeScript best practices and makes optional handling more consistent.
        </p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
{`// Before v3.0.0:
interface State {
  selectedTab: SettingTab | null;
}
stateService.setSelectedTab(null); // Clear selection

// After v3.0.0:
interface State {
  selectedTab?: SettingTab;  // or SettingTab | undefined
}
stateService.setSelectedTab(undefined); // Clear selection`}
        </pre>
      </div>

      <div className="test-card" style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)' }}>
        <h3>SettingTab Interface Update</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          The SettingTab interface now extends ABP.Tab with additional properties.
          The <code>order</code> property is now required (not optional).
        </p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
{`// v3.0.0 SettingTab interface:
interface SettingTab extends Omit<ABP.Tab, 'component'> {
  /** Optional component to render */
  component?: ComponentType<unknown>;
  /** URL for navigation (optional) */
  url?: string;
  /** Order is now REQUIRED */
  order: number;
}`}
        </pre>
      </div>

      <div className="test-card" style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)' }}>
        <h3>eSettingManagementRouteNames Location Change</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          The <code>eSettingManagementRouteNames</code> enum is now defined in the config subpackage
          and re-exported from the main package for backward compatibility.
        </p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
{`// Both imports work:
import { eSettingManagementRouteNames } from '@abpjs/setting-management';
// or from config (v3.0.0):
import { eSettingManagementRouteNames } from '@abpjs/setting-management/config/enums/route-names';

// Value:
eSettingManagementRouteNames.Settings === '${eSettingManagementRouteNames.Settings}'`}
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
        <h3>eSettingManagementComponents Enum</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          Component keys for the Setting Management module. Used for component replacement/customization.
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
                <code>SettingManagement</code>
              </td>
              <td style={{ padding: '8px' }}>
                <code style={{ background: '#333', padding: '2px 6px', borderRadius: '4px' }}>
                  {eSettingManagementComponents.SettingManagement}
                </code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card" style={{ background: 'rgba(100,108,255,0.05)', border: '1px solid rgba(100,108,255,0.2)' }}>
        <h3>eSettingManagementRouteNames Enum</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          Route name keys for the Setting Management module. Used for route localization and identification.
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
                <code>Settings</code>
              </td>
              <td style={{ padding: '8px' }}>
                <code style={{ background: '#333', padding: '2px 6px', borderRadius: '4px' }}>
                  {eSettingManagementRouteNames.Settings}
                </code>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>Usage Examples</h3>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
{`import {
  eSettingManagementComponents,
  eSettingManagementRouteNames
} from '@abpjs/setting-management';

// Component replacement key
const componentKey = eSettingManagementComponents.SettingManagement;
// => 'SettingManagement.SettingManagementComponent'

// Route localization key
const routeKey = eSettingManagementRouteNames.Settings;
// => 'AbpSettingManagement::Settings'

// Use in component registry
const componentRegistry = {
  [eSettingManagementComponents.SettingManagement]: MyCustomSettingLayout,
};

// Use for localization
const localizedName = localize(eSettingManagementRouteNames.Settings);`}
        </pre>
      </div>
    </div>
  )
}

export function TestSettingManagementPage() {
  return (
    <div>
      <h1>@abpjs/setting-management Tests v3.0.0</h1>
      <p>Testing setting management layout, hook, and services.</p>
      <p style={{ color: '#22c55e', fontSize: '0.9rem' }}>Version 3.0.0 - Config route providers, state changes (null → undefined)</p>

      <TestV300Features />
      <TestV270Features />
      <TestSettingLayoutComponent />
      <TestSettingManagementHook />
      <TestSettingManagementService />
      <TestSettingManagementStateService />
      <TestConstants />
      <TestModels />
    </div>
  )
}

export default TestSettingManagementPage
