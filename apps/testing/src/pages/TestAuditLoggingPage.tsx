/**
 * Test page for @abpjs/audit-logging package
 * Tests: AuditLogsComponent, useAuditLogs hook, services, constants, enums
 * @since 2.0.0
 * @updated 2.2.0 - Dependency updates only (no new features)
 * @updated 2.4.0 - Added apiName property, eAuditLoggingComponents enum
 * @updated 2.7.0 - Added EntityChanges component, eEntityChangeType, eAuditLoggingRouteNames, EntityChangeService
 * @updated 2.9.0 - AuditLogsComponent aligned with onQueryChange pattern, removed DateAdapter (React uses native Date)
 * @updated 3.0.0 - Added config subpackage, policy names, route providers, extensions tokens, guards
 * @updated 3.1.0 - Internal Angular refactoring (OnDestroy → SubscriptionService), no public API changes
 * @updated 3.2.0 - Added proxy subpackage with typed DTOs and AuditLogsService
 */
import { useState } from 'react'
import {
  AuditLogsComponent,
  useAuditLogs,
  AUDIT_LOGGING_ROUTES,
  HTTP_METHODS,
  HTTP_STATUS_CODES,
  eAuditLoggingComponents,
  eEntityChangeType,
  eAuditLoggingRouteNames,
  AuditLoggingService,
  EntityChangeService,
  // v3.0.0 imports
  eAuditLoggingPolicyNames,
  AUDIT_LOGGING_ROUTE_PROVIDERS,
  configureRoutes,
  initializeAuditLoggingRoutes,
  ENTITY_DETAILS_PROVIDERS,
  ENTITY_HISTORY_PROVIDERS,
  SHOW_ENTITY_DETAILS,
  SHOW_ENTITY_HISTORY,
  AUDIT_LOGGING_ENTITY_ACTION_CONTRIBUTORS,
  AUDIT_LOGGING_TOOLBAR_ACTION_CONTRIBUTORS,
  AUDIT_LOGGING_ENTITY_PROP_CONTRIBUTORS,
  auditLoggingExtensionsGuard,
  canActivateAuditLoggingExtensions,
  auditLoggingExtensionsLoader,
  DEFAULT_AUDIT_LOGS_ENTITY_PROPS,
  DEFAULT_AUDIT_LOGGING_CONFIG_OPTIONS,
  // v3.2.0 imports - proxy subpackage
  EntityChangeType,
  entityChangeTypeOptions,
  AuditLogsService,
} from '@abpjs/audit-logging'
import type {
  AuditLogging,
  AuditLoggingStateService,
  EntityChange,
  AuditLoggingConfigOptions,
  // v3.2.0 types - proxy DTOs
  AuditLogDto,
  AuditLogActionDto,
  EntityChangeDto,
  EntityPropertyChangeDto,
  EntityChangeWithUsernameDto,
  GetAuditLogListDto,
  GetEntityChangesDto,
  GetAverageExecutionDurationPerDayInput,
  GetAverageExecutionDurationPerDayOutput,
  GetErrorRateFilter,
  GetErrorRateOutput,
  EntityChangeFilter,
} from '@abpjs/audit-logging'

function TestAuditLogsComponent() {
  const [showComponent, setShowComponent] = useState(false)

  return (
    <div className="test-section">
      <h2>AuditLogsComponent</h2>

      <div className="test-card">
        <h3>Toggle Audit Logs Component</h3>
        <p>Show/hide the AuditLogsComponent:</p>
        <button onClick={() => setShowComponent(!showComponent)}>
          {showComponent ? 'Hide Component' : 'Show Component'}
        </button>
      </div>

      {showComponent && (
        <div className="test-card">
          <h3>AuditLogsComponent Preview</h3>
          <div style={{ border: '1px solid #333', borderRadius: '8px', padding: '16px' }}>
            <AuditLogsComponent
              onAuditLogSelected={(log) => console.log('Audit log selected:', log)}
            />
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
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px' }}>onAuditLogSelected</td>
              <td>(log: AuditLogging.Log) =&gt; void</td>
              <td>Callback when an audit log is selected for viewing</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>Features</h3>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li>Filterable audit logs table (user, URL, HTTP method/status, duration)</li>
          <li>Paginated results with navigation</li>
          <li>Detail modal with tabs: Overall, Actions, Entity Changes</li>
          <li>HTTP status/method badges with color coding</li>
          <li>Collapsible action and change details</li>
        </ul>
      </div>
    </div>
  )
}

function TestUseAuditLogsHook() {
  const {
    auditLogs,
    totalCount,
    selectedLog,
    isLoading,
    error,
    averageExecutionStats,
    errorRateStats,
    sortKey,
    sortOrder,
    fetchAuditLogs,
    fetchAverageExecutionStats,
    fetchErrorRateStats,
    reset,
  } = useAuditLogs()

  return (
    <div className="test-section">
      <h2>useAuditLogs Hook</h2>

      <div className="test-card">
        <h3>Hook State</h3>
        <p>audit logs count: <strong>{auditLogs.length}</strong></p>
        <p>total count: <strong>{totalCount}</strong></p>
        <p>selected log: <strong>{selectedLog?.id || 'null'}</strong></p>
        <p>isLoading: <strong>{isLoading ? 'true' : 'false'}</strong></p>
        <p>error: <strong>{error || 'null'}</strong></p>
        <p>sortKey: <strong>{sortKey}</strong></p>
        <p>sortOrder: <strong>{sortOrder}</strong></p>
        <p>averageExecutionStats entries: <strong>{Object.keys(averageExecutionStats).length}</strong></p>
        <p>errorRateStats entries: <strong>{Object.keys(errorRateStats).length}</strong></p>
      </div>

      <div className="test-card">
        <h3>Actions</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => fetchAuditLogs()}>
            Fetch Audit Logs
          </button>
          <button onClick={() => fetchAuditLogs({ httpMethod: 'GET' })}>
            Fetch GET Requests
          </button>
          <button onClick={() => fetchAuditLogs({ httpStatusCode: 500 })}>
            Fetch 500 Errors
          </button>
          <button onClick={() => fetchAverageExecutionStats()}>
            Fetch Avg Execution Stats
          </button>
          <button onClick={() => fetchErrorRateStats()}>
            Fetch Error Rate Stats
          </button>
          <button onClick={reset} style={{ background: '#c44' }}>
            Reset
          </button>
        </div>
      </div>

      {auditLogs.length > 0 && (
        <div className="test-card">
          <h3>Audit Logs</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #333' }}>
                <th style={{ textAlign: 'left', padding: '8px' }}>ID</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>User</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Method</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>URL</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Duration</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.slice(0, 10).map((log: AuditLogging.Log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '8px', fontSize: '12px' }}>{log.id.slice(0, 8)}...</td>
                  <td style={{ padding: '8px' }}>{log.userName || '-'}</td>
                  <td style={{ padding: '8px' }}>
                    <span style={{
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      background: log.httpMethod === 'GET' ? '#1e40af' :
                                 log.httpMethod === 'POST' ? '#166534' :
                                 log.httpMethod === 'DELETE' ? '#991b1b' :
                                 log.httpMethod === 'PUT' ? '#854d0e' : '#374151'
                    }}>
                      {log.httpMethod}
                    </span>
                  </td>
                  <td style={{ padding: '8px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {log.url}
                  </td>
                  <td style={{ padding: '8px' }}>
                    <span style={{
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      background: log.httpStatusCode >= 200 && log.httpStatusCode < 300 ? '#166534' :
                                 log.httpStatusCode >= 400 ? '#991b1b' : '#374151'
                    }}>
                      {log.httpStatusCode}
                    </span>
                  </td>
                  <td style={{ padding: '8px' }}>{log.executionDuration} ms</td>
                </tr>
              ))}
            </tbody>
          </table>
          {auditLogs.length > 10 && (
            <p style={{ color: '#888', fontSize: '14px', marginTop: '8px' }}>
              Showing first 10 of {auditLogs.length} logs
            </p>
          )}
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
            <tr><td style={{ padding: '8px' }}>fetchAuditLogs</td><td>Fetch audit logs with optional filters</td></tr>
            <tr><td style={{ padding: '8px' }}>getAuditLogById</td><td>Get a single audit log by ID</td></tr>
            <tr><td style={{ padding: '8px' }}>fetchAverageExecutionStats</td><td>Fetch average execution duration statistics</td></tr>
            <tr><td style={{ padding: '8px' }}>fetchErrorRateStats</td><td>Fetch error rate statistics</td></tr>
            <tr><td style={{ padding: '8px' }}>setSelectedLog</td><td>Set the currently selected audit log</td></tr>
            <tr><td style={{ padding: '8px' }}>setSortKey</td><td>Set the sort key for results</td></tr>
            <tr><td style={{ padding: '8px' }}>setSortOrder</td><td>Set the sort order (asc/desc)</td></tr>
            <tr><td style={{ padding: '8px' }}>reset</td><td>Reset all state to initial values</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TestV300Features() {
  const [guardResult, setGuardResult] = useState<string>('')

  const testGuard = async () => {
    const asyncResult = await auditLoggingExtensionsGuard()
    const syncResult = canActivateAuditLoggingExtensions()
    const loaderResult = await auditLoggingExtensionsLoader()
    setGuardResult(`Async Guard: ${asyncResult}\nSync Guard: ${syncResult}\nLoader: ${JSON.stringify(loaderResult)}`)
  }

  // Type check for config options
  const _configCheck: AuditLoggingConfigOptions = DEFAULT_AUDIT_LOGGING_CONFIG_OPTIONS
  void _configCheck

  return (
    <div className="test-section">
      <h2>v3.0.0 Features <span style={{ color: '#4f4', fontSize: '14px' }}>(New)</span></h2>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>Config Subpackage <span style={{ color: '#4f4', fontSize: '12px' }}>(v3.0.0)</span></h3>
        <p>
          Version 3.0.0 introduces a config subpackage with enums, providers, and services for module configuration.
        </p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px', background: 'rgba(0,0,0,0.2)', marginTop: '1rem' }}>
{`// Config exports available from main package
import {
  // Config enums
  eAuditLoggingPolicyNames,
  eAuditLoggingRouteNames,  // Now in config, re-exported for backward compat

  // Config providers
  AUDIT_LOGGING_ROUTE_PROVIDERS,
  configureRoutes,
  initializeAuditLoggingRoutes,
  ENTITY_DETAILS_PROVIDERS,
  ENTITY_HISTORY_PROVIDERS,

  // Config services
  EntityChangeModalService,
} from '@abpjs/audit-logging';`}
        </pre>
      </div>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>eAuditLoggingPolicyNames Enum <span style={{ color: '#4f4', fontSize: '12px' }}>(v3.0.0)</span></h3>
        <p>New enum for permission policy checks:</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Key</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(eAuditLoggingPolicyNames).map(([key, value]) => (
              <tr key={key}>
                <td style={{ padding: '8px', fontFamily: 'monospace' }}>{key}</td>
                <td style={{ padding: '8px', fontFamily: 'monospace', color: '#888' }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px', background: 'rgba(0,0,0,0.2)', marginTop: '1rem' }}>
{`import { eAuditLoggingPolicyNames } from '@abpjs/audit-logging';

// Check permissions
const hasAuditLoggingPermission = grantedPolicies[eAuditLoggingPolicyNames.AuditLogging];

// Use in route configuration
{
  path: '/audit-logging',
  requiredPolicy: eAuditLoggingPolicyNames.AuditLogging
}`}
        </pre>
      </div>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>Route Providers <span style={{ color: '#4f4', fontSize: '12px' }}>(v3.0.0)</span></h3>
        <p>New route configuration providers:</p>
        <p style={{ marginTop: '0.5rem' }}>
          <code>AUDIT_LOGGING_ROUTE_PROVIDERS:</code>{' '}
          <code style={{ background: '#333', padding: '2px 6px', borderRadius: '4px' }}>
            {typeof AUDIT_LOGGING_ROUTE_PROVIDERS === 'object' ? 'object' : 'undefined'}
          </code>
        </p>
        <p style={{ marginTop: '0.5rem' }}>
          <code>configureRoutes:</code>{' '}
          <code style={{ background: '#333', padding: '2px 6px', borderRadius: '4px' }}>
            {typeof configureRoutes}
          </code>
        </p>
        <p style={{ marginTop: '0.5rem' }}>
          <code>initializeAuditLoggingRoutes:</code>{' '}
          <code style={{ background: '#333', padding: '2px 6px', borderRadius: '4px' }}>
            {typeof initializeAuditLoggingRoutes}
          </code>
        </p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px', background: 'rgba(0,0,0,0.2)', marginTop: '1rem' }}>
{`import {
  configureRoutes,
  initializeAuditLoggingRoutes,
  AUDIT_LOGGING_ROUTE_PROVIDERS
} from '@abpjs/audit-logging';
import { getRoutesService } from '@abpjs/core';

// Option 1: Use configureRoutes with RoutesService
const routes = getRoutesService();
const addRoutes = configureRoutes(routes);
addRoutes(); // Adds audit logging routes

// Option 2: Use convenience function
const addRoutes2 = initializeAuditLoggingRoutes();
addRoutes2();

// Option 3: Use providers object
AUDIT_LOGGING_ROUTE_PROVIDERS.configureRoutes(routes);`}
        </pre>
      </div>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>Entity Details/History Providers <span style={{ color: '#4f4', fontSize: '12px' }}>(v3.0.0)</span></h3>
        <p>Providers for entity change details and history display:</p>
        <p style={{ marginTop: '0.5rem' }}>
          <code>ENTITY_DETAILS_PROVIDERS.provide:</code>{' '}
          <code style={{ background: '#333', padding: '2px 6px', borderRadius: '4px' }}>
            {ENTITY_DETAILS_PROVIDERS.provide === SHOW_ENTITY_DETAILS ? 'SHOW_ENTITY_DETAILS' : 'Symbol'}
          </code>
        </p>
        <p style={{ marginTop: '0.5rem' }}>
          <code>ENTITY_HISTORY_PROVIDERS.provide:</code>{' '}
          <code style={{ background: '#333', padding: '2px 6px', borderRadius: '4px' }}>
            {ENTITY_HISTORY_PROVIDERS.provide === SHOW_ENTITY_HISTORY ? 'SHOW_ENTITY_HISTORY' : 'Symbol'}
          </code>
        </p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px', background: 'rgba(0,0,0,0.2)', marginTop: '1rem' }}>
{`import {
  ENTITY_DETAILS_PROVIDERS,
  ENTITY_HISTORY_PROVIDERS,
  EntityChangeModalService,
  SHOW_ENTITY_DETAILS,
  SHOW_ENTITY_HISTORY
} from '@abpjs/audit-logging';

// Create modal service with entity change service
const modalService = new EntityChangeModalService(entityChangeService);

// Register callbacks for modal display
modalService.onShowDetails((data) => {
  // Handle entity change details
  console.log('Entity change:', data.entityChange);
  console.log('User:', data.userName);
});

modalService.onShowHistory((data) => {
  // Handle entity change history
  console.log('History items:', data.length);
});

// Show details/history
await modalService.showDetails('entity-change-id');
await modalService.showHistory('entity-id', 'MyApp.Entity');`}
        </pre>
      </div>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>Extension Tokens <span style={{ color: '#4f4', fontSize: '12px' }}>(v3.0.0)</span></h3>
        <p>Tokens for extending audit logging components:</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Token</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>SHOW_ENTITY_DETAILS</td>
              <td style={{ padding: '8px' }}>{typeof SHOW_ENTITY_DETAILS}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>SHOW_ENTITY_HISTORY</td>
              <td style={{ padding: '8px' }}>{typeof SHOW_ENTITY_HISTORY}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>AUDIT_LOGGING_ENTITY_ACTION_CONTRIBUTORS</td>
              <td style={{ padding: '8px' }}>{typeof AUDIT_LOGGING_ENTITY_ACTION_CONTRIBUTORS}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>AUDIT_LOGGING_TOOLBAR_ACTION_CONTRIBUTORS</td>
              <td style={{ padding: '8px' }}>{typeof AUDIT_LOGGING_TOOLBAR_ACTION_CONTRIBUTORS}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>AUDIT_LOGGING_ENTITY_PROP_CONTRIBUTORS</td>
              <td style={{ padding: '8px' }}>{typeof AUDIT_LOGGING_ENTITY_PROP_CONTRIBUTORS}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>Default Entity Props <span style={{ color: '#4f4', fontSize: '12px' }}>(v3.0.0)</span></h3>
        <p>Pre-defined entity properties for audit logs table:</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Name</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Sortable</th>
            </tr>
          </thead>
          <tbody>
            {DEFAULT_AUDIT_LOGS_ENTITY_PROPS.map((prop, index) => (
              <tr key={index}>
                <td style={{ padding: '8px', fontFamily: 'monospace' }}>{String(prop.name)}</td>
                <td style={{ padding: '8px' }}>{prop.type}</td>
                <td style={{ padding: '8px' }}>{prop.sortable ? '✓' : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>Extensions Guard <span style={{ color: '#4f4', fontSize: '12px' }}>(v3.0.0)</span></h3>
        <p>Guard functions for route protection:</p>
        <button onClick={testGuard} style={{ marginTop: '0.5rem' }}>
          Test Guards
        </button>
        {guardResult && (
          <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px', background: 'rgba(0,0,0,0.2)', marginTop: '1rem' }}>
            {guardResult}
          </pre>
        )}
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px', background: 'rgba(0,0,0,0.2)', marginTop: '1rem' }}>
{`import {
  auditLoggingExtensionsGuard,
  canActivateAuditLoggingExtensions,
  auditLoggingExtensionsLoader
} from '@abpjs/audit-logging';

// Async guard for route protection
const canAccess = await auditLoggingExtensionsGuard(); // Promise<boolean>

// Sync guard for immediate checks
const canRender = canActivateAuditLoggingExtensions(); // boolean

// React Router loader pattern
const { ready } = await auditLoggingExtensionsLoader(); // { ready: boolean }`}
        </pre>
      </div>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>Route Names Update <span style={{ color: '#4f4', fontSize: '12px' }}>(v3.0.0)</span></h3>
        <p>
          In v3.0.0, <code>eAuditLoggingRouteNames</code> was moved to config/enums and the <code>Administration</code> entry was removed.
          Use <code>AbpUiNavigation::Menu:Administration</code> from <code>@abpjs/core</code> instead.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Key</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(eAuditLoggingRouteNames).map(([key, value]) => (
              <tr key={key}>
                <td style={{ padding: '8px', fontFamily: 'monospace' }}>{key}</td>
                <td style={{ padding: '8px', fontFamily: 'monospace', color: '#888' }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>v3.0.0 API Summary</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Export</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>eAuditLoggingPolicyNames</td>
              <td>const object</td>
              <td>Permission policy names</td>
            </tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>AUDIT_LOGGING_ROUTE_PROVIDERS</td>
              <td>object</td>
              <td>Route configuration providers</td>
            </tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>configureRoutes, initializeAuditLoggingRoutes</td>
              <td>function</td>
              <td>Route initialization functions</td>
            </tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>ENTITY_DETAILS_PROVIDERS, ENTITY_HISTORY_PROVIDERS</td>
              <td>object</td>
              <td>Entity change modal providers</td>
            </tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>EntityChangeModalService</td>
              <td>class</td>
              <td>Service for showing entity change modals</td>
            </tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>SHOW_ENTITY_DETAILS, SHOW_ENTITY_HISTORY</td>
              <td>symbol</td>
              <td>Tokens for entity details/history functions</td>
            </tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>DEFAULT_AUDIT_LOGGING_*</td>
              <td>object</td>
              <td>Default entity actions/props/toolbar</td>
            </tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>auditLoggingExtensionsGuard, etc.</td>
              <td>function</td>
              <td>Route protection guards</td>
            </tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>AuditLoggingConfigOptions</td>
              <td>interface</td>
              <td>Configuration options type</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TestV290Features() {
  return (
    <div className="test-section">
      <h2>v2.9.0 Features <span style={{ color: '#4f4', fontSize: '14px' }}>(New)</span></h2>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>AuditLogsComponent Pattern Update <span style={{ color: '#4f4', fontSize: '12px' }}>(v2.9.0)</span></h3>
        <p>
          In Angular v2.9.0, the AuditLogsComponent was updated to use the <code>onQueryChange</code> pattern
          instead of separate <code>ngOnInit</code> and <code>onPageChange</code> methods.
        </p>
        <p style={{ marginTop: '0.5rem', color: '#888', fontSize: '14px' }}>
          The React implementation already uses this pattern via <code>useEffect</code> with dependency arrays
          and callback-based query building, so no changes were required in the React code.
        </p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px', background: 'rgba(0,0,0,0.2)', marginTop: '1rem' }}>
{`// React already uses the onQueryChange pattern
function AuditLogsComponent({ onAuditLogSelected }) {
  // Query parameters are built in useEffect
  useEffect(() => {
    const params: AuditLogsQueryParams = {
      skipCount: page * pageSize,
      maxResultCount: pageSize,
      sorting: sortKey ? \`\${sortKey} \${sortOrder}\` : undefined,
      ...filters  // All filter params included
    };
    fetchAuditLogs(params);
  }, [page, pageSize, sortKey, sortOrder, filters]);

  // handleRefresh builds full query params (equivalent to onQueryChange)
  const handleRefresh = useCallback(() => {
    const params = buildQueryParams(filters, page, pageSize, sortKey, sortOrder);
    fetchAuditLogs(params);
  }, [filters, page, pageSize, sortKey, sortOrder]);
}`}
        </pre>
      </div>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>DateAdapter Removed <span style={{ color: '#4f4', fontSize: '12px' }}>(v2.9.0)</span></h3>
        <p>
          Angular v2.9.0 removed the <code>DateAdapter</code> class from EntityChangesComponent.
          The React implementation uses native JavaScript Date handling, so this was never needed.
        </p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px', background: 'rgba(0,0,0,0.2)', marginTop: '1rem' }}>
{`// React uses native Date handling
const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleString();
  } catch {
    return dateString;
  }
};

// Date filtering uses standard ISO strings
const params: EntityChange.EntityChangesQueryParams = {
  startDate: '2024-01-01',  // ISO string format
  endDate: '2024-12-31',
  entityChangeType: eEntityChangeType.Updated
};`}
        </pre>
      </div>

      <div className="test-card">
        <h3>v2.9.0 API Summary</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Change</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Angular</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>React</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>AuditLogsComponent pattern</td>
              <td style={{ padding: '8px' }}>ngOnInit + onPageChange → onQueryChange</td>
              <td style={{ padding: '8px' }}>Already uses useEffect + callbacks</td>
            </tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>DateAdapter class</td>
              <td style={{ padding: '8px' }}>Removed from EntityChangesComponent</td>
              <td style={{ padding: '8px' }}>Never needed (native Date)</td>
            </tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>Dependencies</td>
              <td style={{ padding: '8px' }}>@abp/ng.theme.shared ~2.9.0</td>
              <td style={{ padding: '8px' }}>@abpjs/theme-shared workspace:*</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TestV270Features() {
  // Create mock services to demonstrate v2.7.0 features
  const mockRestService = { request: async () => ({}) }
  const entityChangeService = new EntityChangeService(mockRestService as any)

  // Type check for EntityChange models
  const _typeCheck: EntityChange.Item | null = null
  void _typeCheck

  return (
    <div className="test-section">
      <h2>v2.7.0 Features</h2>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>eAuditLoggingComponents Updated <span style={{ color: '#4f4', fontSize: '12px' }}>(v2.7.0)</span></h3>
        <p>New <code>EntityChanges</code> component key added:</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Key</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(eAuditLoggingComponents).map(([key, value]) => (
              <tr key={key} style={{ background: key === 'EntityChanges' ? 'rgba(68,255,68,0.1)' : 'transparent' }}>
                <td style={{ padding: '8px', fontFamily: 'monospace' }}>{key}</td>
                <td style={{ padding: '8px', fontFamily: 'monospace', color: '#888' }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>eEntityChangeType Enum <span style={{ color: '#4f4', fontSize: '12px' }}>(v2.7.0)</span></h3>
        <p>New enum for entity change types:</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Key</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Value</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>Created</td>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>{eEntityChangeType.Created}</td>
              <td style={{ padding: '8px' }}>Entity was created</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>Updated</td>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>{eEntityChangeType.Updated}</td>
              <td style={{ padding: '8px' }}>Entity was updated</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>Deleted</td>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>{eEntityChangeType.Deleted}</td>
              <td style={{ padding: '8px' }}>Entity was deleted</td>
            </tr>
          </tbody>
        </table>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px', background: 'rgba(0,0,0,0.2)', marginTop: '1rem' }}>
{`import { eEntityChangeType } from '@abpjs/audit-logging';

// Filter entity changes by type
const createdChanges = changes.filter(
  c => c.changeType === eEntityChangeType.Created
);

// Use in switch statements
switch (change.changeType) {
  case eEntityChangeType.Created: return 'Created';
  case eEntityChangeType.Updated: return 'Updated';
  case eEntityChangeType.Deleted: return 'Deleted';
}`}
        </pre>
      </div>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>eAuditLoggingRouteNames Enum <span style={{ color: '#4f4', fontSize: '12px' }}>(v2.7.0)</span></h3>
        <p>Route name keys for localization and navigation:</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Key</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Value (Localization Key)</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(eAuditLoggingRouteNames).map(([key, value]) => (
              <tr key={key}>
                <td style={{ padding: '8px', fontFamily: 'monospace' }}>{key}</td>
                <td style={{ padding: '8px', fontFamily: 'monospace', color: '#888' }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>EntityChangeService <span style={{ color: '#4f4', fontSize: '12px' }}>(v2.7.0)</span></h3>
        <p>New service for entity change API operations:</p>
        <p style={{ marginTop: '0.5rem' }}>
          <code>apiName:</code> <code style={{ background: '#333', padding: '2px 6px', borderRadius: '4px' }}>{entityChangeService.apiName}</code>
          {' | '}
          <code>auditLogsUrl:</code> <code style={{ background: '#333', padding: '2px 6px', borderRadius: '4px' }}>{entityChangeService.auditLogsUrl}</code>
        </p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px', background: 'rgba(0,0,0,0.2)', marginTop: '1rem' }}>
{`import { EntityChangeService } from '@abpjs/audit-logging';

const service = new EntityChangeService(restService);

// Get paginated entity changes
const response = await service.getEntityChanges({
  entityTypeFullName: 'MyApp.Domain.Entities.User',
  entityChangeType: eEntityChangeType.Updated,
  maxResultCount: 10
});

// Get single entity change by ID
const change = await service.getEntityChangeById('change-123');

// Get entity changes with user names
const changesWithUsers = await service.getEntityChangesWithUserName(
  'entity-id',
  'MyApp.Domain.Entities.User'
);

// Get single entity change with user name
const changeWithUser = await service.getEntityChangeWithUserNameById('change-123');`}
        </pre>
      </div>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>EntityChange Models <span style={{ color: '#4f4', fontSize: '12px' }}>(v2.7.0)</span></h3>
        <p>New namespace with models for entity change management:</p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px', background: 'rgba(0,0,0,0.2)' }}>
{`import type { EntityChange } from '@abpjs/audit-logging';

// Entity change item
const item: EntityChange.Item = {
  id: 'change-123',
  auditLogId: 'audit-456',
  tenantId: null,
  changeTime: '2024-01-01T00:00:00Z',
  changeType: eEntityChangeType.Created,
  entityId: 'entity-789',
  entityTypeFullName: 'MyApp.Domain.Entities.User',
  propertyChanges: [],
  extraProperties: {}
};

// Property change
const propChange: EntityChange.PropertyChange = {
  id: 'prop-1',
  tenantId: null,
  entityChangeId: 'change-123',
  propertyName: 'Name',
  propertyTypeFullName: 'System.String',
  originalValue: 'Old Name',
  newValue: 'New Name'
};

// Item with user name
const itemWithUser: EntityChange.ItemWithUserName = {
  entityChange: item,
  userName: 'admin'
};

// Query params
const params: EntityChange.EntityChangesQueryParams = {
  entityTypeFullName: 'MyApp.Domain.Entities.User',
  entityChangeType: eEntityChangeType.Updated,
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  maxResultCount: 10
};`}
        </pre>
      </div>

      <div className="test-card">
        <h3>v2.7.0 API Summary</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Export</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>eAuditLoggingComponents.EntityChanges</td>
              <td>string</td>
              <td>New component key for EntityChanges</td>
            </tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>eEntityChangeType</td>
              <td>enum</td>
              <td>Created (0), Updated (1), Deleted (2)</td>
            </tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>eAuditLoggingRouteNames</td>
              <td>const object</td>
              <td>Route name localization keys</td>
            </tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>EntityChangeService</td>
              <td>class</td>
              <td>Service for entity change operations</td>
            </tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>EntityChange namespace</td>
              <td>types</td>
              <td>Item, PropertyChange, ItemWithUserName, etc.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TestV240Features() {
  // Create a mock service to demonstrate apiName
  const mockRestService = { request: async () => ({}) }
  const service = new AuditLoggingService(mockRestService as any)

  return (
    <div className="test-section">
      <h2>v2.4.0 Features</h2>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>apiName Property <span style={{ color: '#4f4', fontSize: '12px' }}>(v2.4.0)</span></h3>
        <p>AuditLoggingService now has an <code>apiName</code> property for REST request configuration:</p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px', background: 'rgba(0,0,0,0.2)' }}>
{`// Default API name
const service = new AuditLoggingService(restService);
console.log(service.apiName); // 'default'

// Can be customized if needed
service.apiName = 'custom-api';`}
        </pre>
        <p style={{ marginTop: '0.5rem' }}>
          Current apiName: <code style={{ background: '#333', padding: '2px 6px', borderRadius: '4px' }}>{service.apiName}</code>
        </p>
      </div>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>eAuditLoggingComponents Enum <span style={{ color: '#4f4', fontSize: '12px' }}>(v2.4.0)</span></h3>
        <p>New enum for component identifiers, useful for component registration and identification:</p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px', background: 'rgba(0,0,0,0.2)' }}>
{`import { eAuditLoggingComponents } from '@abpjs/audit-logging';

// Component identifiers
console.log(eAuditLoggingComponents.AuditLogs);
// Output: 'AuditLogging.AuditLogsComponent'

// Usage in component registration
const componentRegistry = {
  [eAuditLoggingComponents.AuditLogs]: AuditLogsComponent
};`}
        </pre>
        <p style={{ marginTop: '0.5rem' }}>
          Available components:
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Enum Key</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}><code>AuditLogs</code></td>
              <td style={{ padding: '8px' }}><code>{eAuditLoggingComponents.AuditLogs}</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>v2.4.0 API Summary</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Feature</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>apiName</td>
              <td>string</td>
              <td>REST API name (default: 'default')</td>
            </tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>eAuditLoggingComponents</td>
              <td>enum</td>
              <td>Component identifiers for registration</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TestAuditLoggingServiceSection() {
  const [serviceInfo, setServiceInfo] = useState<string>('')

  const testService = () => {
    setServiceInfo(`Service instantiated. Methods available:
- apiName (v2.4.0): string property for REST API name
- getAuditLogs(params)
- getAuditLogById(id)
- getAverageExecutionDurationPerDayStatistics(params)
- getErrorRateStatistics(params)`)
  }

  return (
    <div className="test-section">
      <h2>AuditLoggingService</h2>

      <div className="test-card">
        <h3>Service Test</h3>
        <p>Click to instantiate the service and see available methods:</p>
        <button onClick={testService}>
          Test Service
        </button>
        {serviceInfo && (
          <pre style={{ marginTop: '1rem', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
            {serviceInfo}
          </pre>
        )}
      </div>

      <div className="test-card">
        <h3>Usage Example</h3>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`import { AuditLoggingService } from '@abpjs/audit-logging';
import { useRestService } from '@abpjs/core';

function MyComponent() {
  const restService = useRestService();
  const service = new AuditLoggingService(restService);

  // v2.4.0: Access apiName property
  console.log(service.apiName); // 'default'

  // Use service methods
  const logs = await service.getAuditLogs({
    skipCount: 0,
    maxResultCount: 10,
    httpMethod: 'GET'
  });

  const logDetail = await service.getAuditLogById('log-id');
}`}
        </pre>
      </div>
    </div>
  )
}

/**
 * Test section for AuditLoggingStateService (v2.0.0)
 */
function TestAuditLoggingStateServiceSection() {
  const [stateServiceInfo, setStateServiceInfo] = useState<string>('')

  // Type annotation to verify the type is exported correctly
  const _typeCheck: AuditLoggingStateService | null = null
  void _typeCheck // Suppress unused variable warning

  const testStateService = () => {
    // Show available methods
    setStateServiceInfo(`AuditLoggingStateService (v2.0.0)

Getter Methods:
- getResult(): AuditLogging.Response
- getTotalCount(): number
- getAverageExecutionStatistics(): Statistics.Data
- getErrorRateStatistics(): Statistics.Data

Dispatch Methods (v2.0.0):
- dispatchGetAuditLogs(params?): Promise<AuditLogging.Response>
- dispatchGetAverageExecutionDurationPerDay(params?): Promise<Statistics.Response>
- dispatchGetErrorRate(params?): Promise<Statistics.Response>

The state service maintains internal state and provides
facade methods for dispatching audit logging actions.`)
  }

  return (
    <div className="test-section">
      <h2>AuditLoggingStateService <span style={{ fontSize: '14px', color: '#4ade80' }}>(v2.0.0)</span></h2>

      <div className="test-card">
        <h3>State Service Overview</h3>
        <p>
          The <code>AuditLoggingStateService</code> provides a stateful facade over the audit logging API.
          It maintains internal state and provides dispatch methods for triggering API calls.
        </p>
        <button onClick={testStateService}>
          Show Methods
        </button>
        {stateServiceInfo && (
          <pre style={{ marginTop: '1rem', padding: '1rem', borderRadius: '4px', overflow: 'auto', whiteSpace: 'pre-wrap' }}>
            {stateServiceInfo}
          </pre>
        )}
      </div>

      <div className="test-card">
        <h3>New in v2.0.0: Dispatch Methods</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          The following dispatch methods were added in v2.0.0:
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Method</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>dispatchGetAuditLogs</code></td>
              <td>Fetches audit logs and updates internal state</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>dispatchGetAverageExecutionDurationPerDay</code></td>
              <td>Fetches average execution stats and updates state</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>dispatchGetErrorRate</code></td>
              <td>Fetches error rate stats and updates state</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>Usage Example</h3>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`import { AuditLoggingStateService } from '@abpjs/audit-logging';
import { useRestService } from '@abpjs/core';

function MyComponent() {
  const restService = useRestService();
  const stateService = new AuditLoggingStateService(restService);

  // Dispatch methods update internal state
  await stateService.dispatchGetAuditLogs({ maxResultCount: 10 });

  // Access state via getters
  const result = stateService.getResult();
  const totalCount = stateService.getTotalCount();

  // Fetch statistics (v2.0.0)
  await stateService.dispatchGetAverageExecutionDurationPerDay({
    startDate: '2024-01-01',  // string type in v2.0.0
    endDate: '2024-01-31'
  });
  const avgStats = stateService.getAverageExecutionStatistics();

  await stateService.dispatchGetErrorRate();
  const errorStats = stateService.getErrorRateStatistics();
}`}
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
        <h3>AUDIT_LOGGING_ROUTES</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          Default route configuration for the audit logging module:
        </p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{JSON.stringify(AUDIT_LOGGING_ROUTES, null, 2)}
        </pre>
      </div>

      <div className="test-card">
        <h3>HTTP_METHODS</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          Available HTTP methods for filtering:
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {HTTP_METHODS.map((method) => (
            <span
              key={method}
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                background: method === 'GET' ? '#1e40af' :
                           method === 'POST' ? '#166534' :
                           method === 'DELETE' ? '#991b1b' :
                           method === 'PUT' ? '#854d0e' : '#374151'
              }}
            >
              {method}
            </span>
          ))}
        </div>
      </div>

      <div className="test-card">
        <h3>HTTP_STATUS_CODES</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          Available HTTP status codes for filtering ({HTTP_STATUS_CODES.length} codes):
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Code</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Message</th>
            </tr>
          </thead>
          <tbody>
            {HTTP_STATUS_CODES.slice(0, 10).map((status) => (
              <tr key={status.code} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '8px' }}>
                  <span style={{
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    background: status.code >= 200 && status.code < 300 ? '#166534' :
                               status.code >= 300 && status.code < 400 ? '#854d0e' :
                               status.code >= 400 ? '#991b1b' : '#374151'
                  }}>
                    {status.code}
                  </span>
                </td>
                <td style={{ padding: '8px' }}>{status.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {HTTP_STATUS_CODES.length > 10 && (
          <p style={{ color: '#888', fontSize: '14px', marginTop: '8px' }}>
            Showing first 10 of {HTTP_STATUS_CODES.length} status codes
          </p>
        )}
      </div>
    </div>
  )
}

function TestModels() {
  return (
    <div className="test-section">
      <h2>Models (AuditLogging namespace)</h2>

      <div className="test-card">
        <h3>Log Interface</h3>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`interface Log {
  id: string;
  userId: string;
  userName: string;
  tenantId: string;
  impersonatorUserId: string;
  impersonatorTenantId: string;
  executionTime: string;
  executionDuration: number;
  clientIpAddress: string;
  clientName: string;
  browserInfo: string;
  httpMethod: string;
  url: string;
  exceptions: string;
  comments: string;
  httpStatusCode: number;
  applicationName: string;
  correlationId: string;
  extraProperties: Record<string, unknown>;
  entityChanges: EntityChange[];
  actions: AuditLogAction[];
}`}
        </pre>
      </div>

      <div className="test-card">
        <h3>EntityChange Interface</h3>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`interface EntityChange {
  id: string;
  auditLogId: string;
  tenantId?: string;
  changeTime: string;
  changeType: number;
  entityTenantId?: string;
  entityId: string;
  entityTypeFullName: string;
  propertyChanges: PropertyChange[];
  extraProperties: Record<string, unknown>;
}`}
        </pre>
      </div>

      <div className="test-card">
        <h3>PropertyChange Interface</h3>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`interface PropertyChange {
  id: string;
  entityChangeId: string;
  newValue?: string;
  originalValue?: string;
  propertyName: string;
  propertyTypeFullName: string;
}`}
        </pre>
      </div>

      <div className="test-card">
        <h3>AuditLogAction Interface</h3>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`interface AuditLogAction {
  id: string;
  auditLogId: string;
  tenantId?: string;
  serviceName: string;
  methodName: string;
  parameters: string;
  executionTime: string;
  executionDuration: number;
  extraProperties: Record<string, unknown>;
}`}
        </pre>
      </div>

      <div className="test-card">
        <h3>AuditLogsQueryParams Interface</h3>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`interface AuditLogsQueryParams extends ABP.PageQueryParams {
  url?: string;
  userName?: string;
  applicationName?: string;
  correlationId?: string;
  httpMethod?: string;
  httpStatusCode?: number;
  minExecutionDuration?: number;
  maxExecutionDuration?: number;
  hasException?: boolean;
  startTime?: string;
  endTime?: string;
}`}
        </pre>
      </div>
    </div>
  )
}

function TestStatisticsModels() {
  return (
    <div className="test-section">
      <h2>Models (Statistics namespace)</h2>

      <div className="test-card">
        <h3>Statistics.Filter Interface <span style={{ fontSize: '12px', color: '#4ade80' }}>(Updated in v2.0.0)</span></h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          Note: In v2.0.0, <code>startDate</code> and <code>endDate</code> changed from <code>Date</code> to <code>string</code> type.
        </p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`interface Filter {
  startDate?: string;  // v2.0.0: Changed from Date to string
  endDate?: string;    // v2.0.0: Changed from Date to string
}

// Example usage:
const filter: Statistics.Filter = {
  startDate: '2024-01-01',
  endDate: '2024-01-31'
};`}
        </pre>
      </div>

      <div className="test-card">
        <h3>Statistics.Data Type</h3>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`type Data = Record<string, number>;

// Example:
{
  "2024-01-01": 150,
  "2024-01-02": 200,
  "2024-01-03": 175
}`}
        </pre>
      </div>

      <div className="test-card">
        <h3>Statistics.Response Interface</h3>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`interface Response {
  data: Data;
}`}
        </pre>
      </div>
    </div>
  )
}

function TestV320Features() {
  // Type checks for new v3.2.0 types
  const _auditLogDto: AuditLogDto | null = null
  const _entityChangeDto: EntityChangeDto | null = null
  const _getListDto: GetAuditLogListDto | null = null
  void _auditLogDto
  void _entityChangeDto
  void _getListDto

  return (
    <div className="test-section">
      <h2>v3.2.0 Features <span style={{ color: '#4f4', fontSize: '14px' }}>(Current)</span></h2>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>Proxy Subpackage <span style={{ color: '#4f4', fontSize: '12px' }}>(v3.2.0)</span></h3>
        <p>
          Version 3.2.0 introduces a new proxy subpackage with typed DTOs and an improved AuditLogsService.
          The older AuditLogging/Statistics namespaces are deprecated in favor of these new types.
        </p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px', background: 'rgba(0,0,0,0.2)', marginTop: '1rem' }}>
{`// New proxy exports in v3.2.0
import {
  // Typed DTOs
  AuditLogDto,
  AuditLogActionDto,
  EntityChangeDto,
  EntityPropertyChangeDto,
  EntityChangeWithUsernameDto,

  // Query/Filter DTOs
  GetAuditLogListDto,
  GetEntityChangesDto,
  EntityChangeFilter,

  // Statistics DTOs
  GetAverageExecutionDurationPerDayInput,
  GetAverageExecutionDurationPerDayOutput,
  GetErrorRateFilter,
  GetErrorRateOutput,

  // Enum and options
  EntityChangeType,
  entityChangeTypeOptions,

  // New service
  AuditLogsService,
} from '@abpjs/audit-logging';`}
        </pre>
      </div>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>EntityChangeType Enum <span style={{ color: '#4f4', fontSize: '12px' }}>(v3.2.0)</span></h3>
        <p>New enum in proxy/auditing (same values as eEntityChangeType):</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Key</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>Created</td>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>{EntityChangeType.Created}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>Updated</td>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>{EntityChangeType.Updated}</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>Deleted</td>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>{EntityChangeType.Deleted}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>entityChangeTypeOptions <span style={{ color: '#4f4', fontSize: '12px' }}>(v3.2.0)</span></h3>
        <p>Pre-defined options array for select components:</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Label</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Value</th>
            </tr>
          </thead>
          <tbody>
            {entityChangeTypeOptions.map((option) => (
              <tr key={option.value}>
                <td style={{ padding: '8px', fontFamily: 'monospace' }}>{option.label}</td>
                <td style={{ padding: '8px', fontFamily: 'monospace' }}>{option.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px', background: 'rgba(0,0,0,0.2)', marginTop: '1rem' }}>
{`import { entityChangeTypeOptions } from '@abpjs/audit-logging';

// Use in select/dropdown components
<select>
  {entityChangeTypeOptions.map(option => (
    <option key={option.value} value={option.value}>
      {option.label}
    </option>
  ))}
</select>`}
        </pre>
      </div>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>AuditLogsService (Proxy) <span style={{ color: '#4f4', fontSize: '12px' }}>(v3.2.0)</span></h3>
        <p>New typed service with improved methods:</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Method</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: '8px', fontFamily: 'monospace' }}>get(id)</td><td>Get single audit log by ID</td></tr>
            <tr><td style={{ padding: '8px', fontFamily: 'monospace' }}>getList(input?)</td><td>Get paginated list of audit logs</td></tr>
            <tr><td style={{ padding: '8px', fontFamily: 'monospace' }}>getEntityChange(id)</td><td>Get single entity change by ID</td></tr>
            <tr><td style={{ padding: '8px', fontFamily: 'monospace' }}>getEntityChanges(input)</td><td>Get paginated entity changes</td></tr>
            <tr><td style={{ padding: '8px', fontFamily: 'monospace' }}>getEntityChangeWithUsername(id)</td><td>Get entity change with username</td></tr>
            <tr><td style={{ padding: '8px', fontFamily: 'monospace' }}>getEntityChangesWithUsername(filter)</td><td>Get entity changes with usernames</td></tr>
            <tr><td style={{ padding: '8px', fontFamily: 'monospace' }}>getAverageExecutionDurationPerDay(filter)</td><td>Get average execution stats</td></tr>
            <tr><td style={{ padding: '8px', fontFamily: 'monospace' }}>getErrorRate(filter)</td><td>Get error rate stats</td></tr>
          </tbody>
        </table>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px', background: 'rgba(0,0,0,0.2)', marginTop: '1rem' }}>
{`import { AuditLogsService } from '@abpjs/audit-logging';
import type { GetAuditLogListDto, AuditLogDto } from '@abpjs/audit-logging';

const service = new AuditLogsService(restService);

// Get single audit log
const log: AuditLogDto = await service.get('log-id');

// Get paginated list with typed filters
const filter: GetAuditLogListDto = {
  userName: 'admin',
  httpMethod: 'POST',
  maxResultCount: 10,
};
const result = await service.getList(filter);

// Get entity changes with usernames
const changes = await service.getEntityChangesWithUsername({
  entityId: 'entity-123',
  entityTypeFullName: 'MyApp.Domain.User',
});

// Get statistics
const avgStats = await service.getAverageExecutionDurationPerDay({
  startDate: '2024-01-01',
  endDate: '2024-01-31',
});`}
        </pre>
      </div>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>State Type Updates <span style={{ color: '#4f4', fontSize: '12px' }}>(v3.2.0)</span></h3>
        <p>The AuditLogging.State interface now uses the new proxy DTOs:</p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px', background: 'rgba(0,0,0,0.2)', marginTop: '1rem' }}>
{`// v3.2.0 - Updated State type
interface State {
  result: PagedResultDto<AuditLogDto>;  // Was AuditLogging.Response
  averageExecutionStatistics: Record<string, number>;  // Was Statistics.Data
  errorRateStatistics: Record<string, number>;  // Was Statistics.Data
}`}
        </pre>
      </div>

      <div className="test-card" style={{ background: 'rgba(255,200,68,0.05)', border: '1px solid rgba(255,200,68,0.3)' }}>
        <h3>Deprecations <span style={{ color: '#fc4', fontSize: '12px' }}>(v3.2.0)</span></h3>
        <p>The following types are deprecated and will be removed in v4.0:</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Deprecated</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Use Instead</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{ padding: '8px' }}>AuditLogging.Response</td><td style={{ padding: '8px' }}>PagedResultDto&lt;AuditLogDto&gt;</td></tr>
            <tr><td style={{ padding: '8px' }}>AuditLogging.AuditLogsQueryParams</td><td style={{ padding: '8px' }}>GetAuditLogListDto</td></tr>
            <tr><td style={{ padding: '8px' }}>AuditLogging.Log</td><td style={{ padding: '8px' }}>AuditLogDto</td></tr>
            <tr><td style={{ padding: '8px' }}>Statistics.Filter</td><td style={{ padding: '8px' }}>GetAverageExecutionDurationPerDayInput / GetErrorRateFilter</td></tr>
            <tr><td style={{ padding: '8px' }}>Statistics.Data</td><td style={{ padding: '8px' }}>Record&lt;string, number&gt;</td></tr>
            <tr><td style={{ padding: '8px' }}>Statistics.Response</td><td style={{ padding: '8px' }}>GetAverageExecutionDurationPerDayOutput / GetErrorRateOutput</td></tr>
            <tr><td style={{ padding: '8px' }}>EntityChange namespace</td><td style={{ padding: '8px' }}>EntityChangeDto, GetEntityChangesDto, etc.</td></tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>v3.2.0 API Summary</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Export</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>EntityChangeType</td>
              <td>enum</td>
              <td>Created (0), Updated (1), Deleted (2)</td>
            </tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>entityChangeTypeOptions</td>
              <td>array</td>
              <td>Label/value pairs for select components</td>
            </tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>AuditLogsService</td>
              <td>class</td>
              <td>Typed service for audit log operations</td>
            </tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>AuditLogDto</td>
              <td>interface</td>
              <td>Typed audit log DTO</td>
            </tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>EntityChangeDto</td>
              <td>interface</td>
              <td>Typed entity change DTO</td>
            </tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>GetAuditLogListDto</td>
              <td>interface</td>
              <td>Typed query parameters for audit logs</td>
            </tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>Get*Output</td>
              <td>interfaces</td>
              <td>Typed statistics response DTOs</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TestV310Features() {
  return (
    <div className="test-section">
      <h2>v3.1.0 Features</h2>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>Internal Angular Refactoring <span style={{ color: '#4f4', fontSize: '12px' }}>(v3.1.0)</span></h3>
        <p>
          Version 3.1.0 includes internal Angular refactoring that does not affect the React implementation.
          No public API changes were made in this release.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Change</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Angular</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>React</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px' }}>Widget cleanup pattern</td>
              <td style={{ padding: '8px' }}>OnDestroy → SubscriptionService</td>
              <td style={{ padding: '8px' }}>useEffect cleanup (unchanged)</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}>Type reference updates</td>
              <td style={{ padding: '8px' }}>Internal type adjustments</td>
              <td style={{ padding: '8px' }}>Not applicable</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}>Dependencies</td>
              <td style={{ padding: '8px' }}>@abp/ng.theme.shared ~3.1.0</td>
              <td style={{ padding: '8px' }}>@abpjs/theme-shared workspace:*</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>React Cleanup Pattern <span style={{ color: '#4f4', fontSize: '12px' }}>(Already Implemented)</span></h3>
        <p>
          The React implementation already uses the standard <code>useEffect</code> cleanup pattern,
          which is equivalent to Angular's SubscriptionService pattern for managing subscriptions.
        </p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px', background: 'rgba(0,0,0,0.2)', marginTop: '1rem' }}>
{`// React already uses useEffect cleanup pattern
function AuditLogsWidget() {
  useEffect(() => {
    // Setup subscriptions/listeners
    const subscription = someObservable.subscribe(handleData);

    // Cleanup function - equivalent to Angular's SubscriptionService
    return () => {
      subscription.unsubscribe();
    };
  }, [dependencies]);
}`}
        </pre>
      </div>

      <div className="test-card">
        <h3>v3.1.0 Summary</h3>
        <p style={{ color: '#888' }}>
          This release focused on internal Angular code quality improvements. All existing APIs
          from v3.0.0 remain unchanged and fully compatible. The React translation did not require
          any updates as it already follows React best practices for component lifecycle management.
        </p>
      </div>
    </div>
  )
}

export function TestAuditLoggingPage() {
  return (
    <div>
      <h1>@abpjs/audit-logging Tests (v3.2.0)</h1>
      <p style={{ marginBottom: '8px' }}>Testing audit logging components, hooks, services, and enums.</p>
      <p style={{ fontSize: '14px', color: '#4f4', marginBottom: '16px' }}>
        Version 3.2.0 - New proxy subpackage with typed DTOs and AuditLogsService
      </p>

      <TestV320Features />
      <TestV310Features />
      <TestV300Features />
      <TestV290Features />
      <TestV270Features />
      <TestV240Features />
      <TestAuditLogsComponent />
      <TestUseAuditLogsHook />
      <TestAuditLoggingServiceSection />
      <TestAuditLoggingStateServiceSection />
      <TestConstants />
      <TestModels />
      <TestStatisticsModels />
    </div>
  )
}

export default TestAuditLoggingPage
