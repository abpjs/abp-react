/**
 * Test page for @abpjs/feature-management package
 * Tests: FeatureManagementModal, useFeatureManagement hook
 */
import { useState } from 'react'
import { useAuth } from '@abpjs/core'
import {
  FeatureManagementModal,
  useFeatureManagement,
} from '@abpjs/feature-management'
import type { FeatureManagement } from '@abpjs/feature-management'

function TestFeatureModal() {
  const [tenantModalVisible, setTenantModalVisible] = useState(false)
  const [editionModalVisible, setEditionModalVisible] = useState(false)
  const [testTenantId, setTestTenantId] = useState('')
  const [testEditionId, setTestEditionId] = useState('')
  const { isAuthenticated } = useAuth()

  return (
    <div className="test-section">
      <h2>FeatureManagementModal Component</h2>

      <div className="test-card">
        <h3>Tenant Features</h3>
        <p>Open the feature modal for a tenant (providerName="T"):</p>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
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
            onClick={() => setTenantModalVisible(true)}
            disabled={!testTenantId || !isAuthenticated}
          >
            Manage Tenant Features
          </button>
        </div>
        {!isAuthenticated && (
          <p style={{ color: '#f88', fontSize: '12px' }}>Login required to manage features</p>
        )}
      </div>

      <div className="test-card">
        <h3>Edition Features</h3>
        <p>Open the feature modal for an edition (providerName="E"):</p>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Enter Edition ID"
            value={testEditionId}
            onChange={(e) => setTestEditionId(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333',
              flex: 1
            }}
          />
          <button
            onClick={() => setEditionModalVisible(true)}
            disabled={!testEditionId || !isAuthenticated}
          >
            Manage Edition Features
          </button>
        </div>
      </div>

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
            <tr><td style={{ padding: '8px' }}>providerName</td><td>"T" | "E"</td><td>Yes</td></tr>
            <tr><td style={{ padding: '8px' }}>providerKey</td><td>string</td><td>Yes</td></tr>
            <tr><td style={{ padding: '8px' }}>visible</td><td>boolean</td><td>Yes</td></tr>
            <tr><td style={{ padding: '8px' }}>onVisibleChange</td><td>(visible: boolean) =&gt; void</td><td>No</td></tr>
            <tr><td style={{ padding: '8px' }}>onSave</td><td>() =&gt; void</td><td>No</td></tr>
          </tbody>
        </table>
      </div>

      {/* Tenant Feature Modal */}
      <FeatureManagementModal
        providerName="T"
        providerKey={testTenantId}
        visible={tenantModalVisible}
        onVisibleChange={setTenantModalVisible}
        onSave={() => {
          console.log('Tenant features saved!')
        }}
      />

      {/* Edition Feature Modal */}
      <FeatureManagementModal
        providerName="E"
        providerKey={testEditionId}
        visible={editionModalVisible}
        onVisibleChange={setEditionModalVisible}
        onSave={() => {
          console.log('Edition features saved!')
        }}
      />
    </div>
  )
}

function TestFeatureHook() {
  const [testProviderKey, setTestProviderKey] = useState('')
  const [testProviderName, setTestProviderName] = useState<'T' | 'E'>('T')
  const { isAuthenticated } = useAuth()

  const {
    features,
    featureValues,
    isLoading,
    error,
    fetchFeatures,
    updateFeatureValue,
    getFeatureValue,
    isFeatureEnabled,
  } = useFeatureManagement()

  const handleFetch = () => {
    if (testProviderKey) {
      fetchFeatures(testProviderKey, testProviderName)
    }
  }

  return (
    <div className="test-section">
      <h2>useFeatureManagement Hook</h2>

      <div className="test-card">
        <h3>Fetch Features Manually</h3>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
          <select
            value={testProviderName}
            onChange={(e) => setTestProviderName(e.target.value as 'T' | 'E')}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333'
            }}
          >
            <option value="T">Tenant (T)</option>
            <option value="E">Edition (E)</option>
          </select>
          <input
            type="text"
            placeholder="Provider Key (ID)"
            value={testProviderKey}
            onChange={(e) => setTestProviderKey(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333',
              flex: 1
            }}
          />
          <button onClick={handleFetch} disabled={!testProviderKey || !isAuthenticated || isLoading}>
            {isLoading ? 'Loading...' : 'Fetch'}
          </button>
        </div>
      </div>

      <div className="test-card">
        <h3>Hook State</h3>
        <p>isLoading: {isLoading ? 'true' : 'false'}</p>
        <p>error: {error || 'null'}</p>
        <p>features count: {features.length}</p>
        <p>featureValues: {Object.keys(featureValues).length} entries</p>
      </div>

      {features.length > 0 && (
        <div className="test-card">
          <h3>Features</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #333' }}>
                <th style={{ textAlign: 'left', padding: '8px' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Value Type</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Current Value</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Edit</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature) => (
                <tr key={feature.name} style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '8px' }}>
                    <div>{feature.name}</div>
                    {feature.description && (
                      <div style={{ fontSize: '12px', color: '#888' }}>{feature.description}</div>
                    )}
                  </td>
                  <td style={{ padding: '8px' }}>
                    <code style={{ background: '#333', padding: '2px 6px', borderRadius: '4px' }}>
                      {feature.valueType?.name || 'Unknown'}
                    </code>
                  </td>
                  <td style={{ padding: '8px' }}>
                    {getFeatureValue(feature.name)}
                  </td>
                  <td style={{ padding: '8px' }}>
                    {feature.valueType?.name === 'ToggleStringValueType' ? (
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={isFeatureEnabled(feature.name)}
                          onChange={() => {
                            const newValue = isFeatureEnabled(feature.name) ? 'false' : 'true'
                            updateFeatureValue(feature.name, newValue)
                          }}
                        />
                        <span>{isFeatureEnabled(feature.name) ? 'Enabled' : 'Disabled'}</span>
                      </label>
                    ) : (
                      <input
                        type="text"
                        value={getFeatureValue(feature.name)}
                        onChange={(e) => updateFeatureValue(feature.name, e.target.value)}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          border: '1px solid #333',
                          width: '100%'
                        }}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
            <tr><td style={{ padding: '8px' }}>fetchFeatures</td><td>Fetch features for provider</td></tr>
            <tr><td style={{ padding: '8px' }}>saveFeatures</td><td>Save modified features</td></tr>
            <tr><td style={{ padding: '8px' }}>updateFeatureValue</td><td>Update a feature value locally</td></tr>
            <tr><td style={{ padding: '8px' }}>getFeatureValue</td><td>Get current feature value</td></tr>
            <tr><td style={{ padding: '8px' }}>isFeatureEnabled</td><td>Check if toggle feature is enabled</td></tr>
            <tr><td style={{ padding: '8px' }}>reset</td><td>Reset all state</td></tr>
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
              <td style={{ padding: '8px' }}><code>/api/abp/features</code></td>
              <td>Fetch features</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>PUT</code></td>
              <td style={{ padding: '8px' }}><code>/api/abp/features</code></td>
              <td>Update features</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>Provider Types</h3>
        <ul>
          <li><strong>T</strong> - Tenant features</li>
          <li><strong>E</strong> - Edition features</li>
        </ul>
      </div>

      <div className="test-card">
        <h3>Value Types</h3>
        <ul>
          <li><strong>ToggleStringValueType</strong> - Boolean toggle (checkbox)</li>
          <li><strong>FreeTextStringValueType</strong> - Free text input</li>
        </ul>
      </div>
    </div>
  )
}

function TestModels() {
  return (
    <div className="test-section">
      <h2>Models</h2>

      <div className="test-card">
        <h3>FeatureManagement Namespace</h3>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`interface Feature {
  name: string;
  value: string;
  description?: string;
  valueType?: ValueType;
  depth?: number;
  parentName?: string;
}

interface ValueType {
  name: string;
  properties: object;
  validator: object;
}

interface Provider {
  providerName: string;
  providerKey: string;
}

interface Features {
  features: Feature[];
}`}
        </pre>
      </div>
    </div>
  )
}

function TestComponentInterfaces() {
  // Type demonstration - these interfaces define component props
  const componentInputs: FeatureManagement.FeatureManagementComponentInputs = {
    visible: true,
    providerName: 'T',
    providerKey: 'tenant-123',
  }

  const componentOutputs: FeatureManagement.FeatureManagementComponentOutputs = {
    visibleChange: (visible) => console.log('Visibility changed:', visible),
  }

  return (
    <div className="test-section">
      <h2>Component Interface Types (v2.0.0)</h2>

      <div className="test-card">
        <h3>FeatureManagementComponentInputs</h3>
        <p>TypeScript interface for component input props:</p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
{`interface FeatureManagementComponentInputs {
  /** Whether the modal is visible */
  visible: boolean;
  /** Provider name (e.g., 'T' for Tenant) */
  readonly providerName: string;
  /** Provider key (e.g., tenant ID) */
  readonly providerKey: string;
}`}
        </pre>
        <h4 style={{ marginTop: '1rem' }}>Current Test Value:</h4>
        <pre style={{ padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
          {JSON.stringify(componentInputs, null, 2)}
        </pre>
      </div>

      <div className="test-card">
        <h3>FeatureManagementComponentOutputs</h3>
        <p>TypeScript interface for component output callbacks:</p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
{`interface FeatureManagementComponentOutputs {
  /** Callback when visibility changes */
  readonly visibleChange?: (visible: boolean) => void;
}`}
        </pre>
        <h4 style={{ marginTop: '1rem' }}>Current Test Value:</h4>
        <pre style={{ padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
          {`{ visibleChange: ${componentOutputs.visibleChange ? '(visible) => void' : 'undefined'} }`}
        </pre>
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#888' }}>
          In Angular, this uses <code>EventEmitter&lt;boolean&gt;</code>.
          In React, this is a callback function.
        </p>
      </div>

      <div className="test-card">
        <h3>Usage Example</h3>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
{`import { FeatureManagement } from '@abpjs/feature-management'

// Type your component props with these interfaces
type FeatureModalProps =
  FeatureManagement.FeatureManagementComponentInputs &
  FeatureManagement.FeatureManagementComponentOutputs;

function MyFeatureModal(props: FeatureModalProps) {
  const { visible, providerName, providerKey, visibleChange } = props;
  // ... component implementation
}`}
        </pre>
      </div>
    </div>
  )
}

export function TestFeatureManagementPage() {
  return (
    <div>
      <h1>@abpjs/feature-management Tests</h1>
      <p>Testing feature management modal and hooks.</p>
      <p style={{ color: '#888', fontSize: '0.9rem' }}>Version 2.0.0 - Includes component interface types</p>

      <TestFeatureModal />
      <TestFeatureHook />
      <TestApiEndpoints />
      <TestModels />

      {/* v2.0.0 Features */}
      <h2 style={{ marginTop: '2rem', borderTop: '2px solid #646cff', paddingTop: '1rem' }}>
        v2.0.0 New Features
      </h2>
      <TestComponentInterfaces />
    </div>
  )
}

export default TestFeatureManagementPage
