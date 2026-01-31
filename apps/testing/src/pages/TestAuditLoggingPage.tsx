/**
 * Test page for @abpjs/audit-logging package
 * Tests: AuditLogsComponent, useAuditLogs hook, services, constants
 * @since 2.0.0
 */
import { useState } from 'react'
import {
  AuditLogsComponent,
  useAuditLogs,
  AUDIT_LOGGING_ROUTES,
  HTTP_METHODS,
  HTTP_STATUS_CODES,
} from '@abpjs/audit-logging'
import type { AuditLogging, AuditLoggingStateService } from '@abpjs/audit-logging'

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

function TestAuditLoggingServiceSection() {
  const [serviceInfo, setServiceInfo] = useState<string>('')

  const testService = () => {
    setServiceInfo(`Service instantiated. Methods available:
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

export function TestAuditLoggingPage() {
  return (
    <div>
      <h1>@abpjs/audit-logging Tests</h1>
      <p>Testing audit logging components, hooks, and services (v2.0.0).</p>

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
