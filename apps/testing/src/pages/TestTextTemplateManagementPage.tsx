/**
 * Test page for @abpjs/text-template-management package
 * Tests: TextTemplatesComponent, TemplateContentsComponent, useTextTemplates hook
 * @since 2.7.0
 * @updated 2.9.0 - Internal Angular changes (no new React features)
 * @updated 3.0.0 - Config subpackage, extension tokens, guards, policy names
 * @updated 3.1.0 - Added GetTemplateDefinitionListInput, createGetTemplateDefinitionListInput
 * @updated 3.2.0 - Added proxy subpackage with typed services and DTOs
 * @updated 4.0.0 - Internal Angular changes (private field rename in TemplateContentsComponent) - no new React features
 */
import { useState, useEffect } from 'react'
import { useAuth, useRestService } from '@abpjs/core'
import {
  TextTemplatesComponent,
  TemplateContentsComponent,
  useTextTemplates,
  TEXT_TEMPLATE_MANAGEMENT_ROUTES,
  TextTemplateManagementStateService,
  eTextTemplateManagementComponents,
  eTextTemplateManagementRouteNames,
  type TextTemplateManagement,
  type TextTemplateManagementComponentKey,
  type TextTemplateManagementRouteNameKey,
  // v3.0.0 - Config subpackage
  eTextTemplateManagementPolicyNames,
  TEXT_TEMPLATE_MANAGEMENT_ROUTE_CONFIG,
  type TextTemplateManagementPolicyNameKey,
  type TextTemplateManagementConfigOptions,
  // v3.0.0 - Extension tokens
  DEFAULT_TEXT_TEMPLATE_MANAGEMENT_ENTITY_ACTIONS,
  DEFAULT_TEXT_TEMPLATE_MANAGEMENT_TOOLBAR_ACTIONS,
  DEFAULT_TEXT_TEMPLATE_MANAGEMENT_ENTITY_PROPS,
  type EntityAction,
  type ToolbarAction,
  type EntityProp,
  type EntityActionContributorCallback,
  type ToolbarActionContributorCallback,
  type EntityPropContributorCallback,
  // v3.0.0 - Guards
  useTextTemplateManagementExtensionsGuard,
  // v3.1.0 - New input types (now from proxy)
  type GetTemplateDefinitionListInput,
  createGetTemplateDefinitionListInput,
  // v3.2.0 - Proxy subpackage
  TemplateDefinitionService,
  TemplateContentService,
  type TemplateDefinitionDto,
  type TextTemplateContentDto,
  type GetTemplateContentInput,
  type RestoreTemplateContentInput,
  type UpdateTemplateContentInput,
} from '@abpjs/text-template-management'

// Type annotation to ensure services are used
const _stateServiceType: typeof TextTemplateManagementStateService | null = null
void _stateServiceType

/**
 * v3.2.0 Features - Proxy subpackage with typed services and DTOs
 */
function TestV320Features() {
  const restService = useRestService()
  const [templateResult, setTemplateResult] = useState<TemplateDefinitionDto | null>(null)
  const [contentResult, setContentResult] = useState<TextTemplateContentDto | null>(null)
  const [listResult, setListResult] = useState<TemplateDefinitionDto[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Create service instances
  const definitionService = new TemplateDefinitionService(restService)
  const contentService = new TemplateContentService(restService)

  // Demo input objects
  const getContentInput: GetTemplateContentInput = {
    templateName: 'EmailVerification',
    cultureName: 'en',
  }

  const restoreInput: RestoreTemplateContentInput = {
    templateName: 'EmailVerification',
    cultureName: 'en',
  }

  const updateInput: UpdateTemplateContentInput = {
    templateName: 'EmailVerification',
    cultureName: 'en',
    content: '<html><body>Updated content</body></html>',
  }

  const listInput: GetTemplateDefinitionListInput = {
    filterText: 'email',
    skipCount: 0,
    maxResultCount: 10,
    sorting: 'name asc',
  }

  const handleGetTemplate = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await definitionService.get('EmailVerification')
      setTemplateResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get template')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGetList = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await definitionService.getList(listInput)
      setListResult(result.items || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get template list')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGetContent = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await contentService.get(getContentInput)
      setContentResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get content')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="test-section">
      <h2>v3.2.0 Features <span style={{ fontSize: '14px', color: '#4ade80' }}>(NEW)</span></h2>

      <div className="test-card">
        <h3>Proxy Subpackage Overview</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          New typed proxy services and DTOs that replace the legacy services. These provide better type safety
          and align with the ABP Framework proxy pattern.
        </p>
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
              <td style={{ padding: '8px' }}><code>TemplateDefinitionService</code></td>
              <td style={{ padding: '8px' }}>Class</td>
              <td style={{ padding: '8px' }}>Proxy service for template definitions (get, getList)</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>TemplateContentService</code></td>
              <td style={{ padding: '8px' }}>Class</td>
              <td style={{ padding: '8px' }}>Proxy service for template content (get, update, restoreToDefault)</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>TemplateDefinitionDto</code></td>
              <td style={{ padding: '8px' }}>Interface</td>
              <td style={{ padding: '8px' }}>Template definition data transfer object</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>TextTemplateContentDto</code></td>
              <td style={{ padding: '8px' }}>Interface</td>
              <td style={{ padding: '8px' }}>Template content data transfer object</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>GetTemplateContentInput</code></td>
              <td style={{ padding: '8px' }}>Interface</td>
              <td style={{ padding: '8px' }}>Input for getting template content</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>UpdateTemplateContentInput</code></td>
              <td style={{ padding: '8px' }}>Interface</td>
              <td style={{ padding: '8px' }}>Input for updating template content</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>RestoreTemplateContentInput</code></td>
              <td style={{ padding: '8px' }}>Interface</td>
              <td style={{ padding: '8px' }}>Input for restoring template to default</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>TemplateDefinitionService</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          New proxy service for template definition operations with typed methods.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Method</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Parameters</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Returns</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>get(name)</code></td>
              <td style={{ padding: '8px' }}>string</td>
              <td style={{ padding: '8px' }}>Promise&lt;TemplateDefinitionDto&gt;</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>getList(input?)</code></td>
              <td style={{ padding: '8px' }}>GetTemplateDefinitionListInput</td>
              <td style={{ padding: '8px' }}>Promise&lt;PagedResultDto&lt;TemplateDefinitionDto&gt;&gt;</td>
            </tr>
          </tbody>
        </table>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <button onClick={handleGetTemplate} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Get Template by Name'}
          </button>
          <button onClick={handleGetList} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Get Template List'}
          </button>
        </div>
        <p style={{ fontSize: '12px', color: '#888' }}>
          apiName: <code>{definitionService.apiName}</code>
        </p>
      </div>

      <div className="test-card">
        <h3>TemplateContentService</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          New proxy service for template content operations with typed methods.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Method</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Parameters</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Returns</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>get(input)</code></td>
              <td style={{ padding: '8px' }}>GetTemplateContentInput</td>
              <td style={{ padding: '8px' }}>Promise&lt;TextTemplateContentDto&gt;</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>update(input)</code></td>
              <td style={{ padding: '8px' }}>UpdateTemplateContentInput</td>
              <td style={{ padding: '8px' }}>Promise&lt;TextTemplateContentDto&gt;</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>restoreToDefault(input)</code></td>
              <td style={{ padding: '8px' }}>RestoreTemplateContentInput</td>
              <td style={{ padding: '8px' }}>Promise&lt;void&gt;</td>
            </tr>
          </tbody>
        </table>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <button onClick={handleGetContent} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Get Template Content'}
          </button>
        </div>
        <p style={{ fontSize: '12px', color: '#888' }}>
          apiName: <code>{contentService.apiName}</code>
        </p>
      </div>

      <div className="test-card">
        <h3>Typed Input Examples</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          <div>
            <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>GetTemplateContentInput:</p>
            <pre style={{ fontSize: '11px', margin: 0, padding: '0.5rem', borderRadius: '4px', border: '1px solid #333' }}>
              {JSON.stringify(getContentInput, null, 2)}
            </pre>
          </div>
          <div>
            <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>RestoreTemplateContentInput:</p>
            <pre style={{ fontSize: '11px', margin: 0, padding: '0.5rem', borderRadius: '4px', border: '1px solid #333' }}>
              {JSON.stringify(restoreInput, null, 2)}
            </pre>
          </div>
          <div>
            <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>UpdateTemplateContentInput:</p>
            <pre style={{ fontSize: '11px', margin: 0, padding: '0.5rem', borderRadius: '4px', border: '1px solid #333' }}>
              {JSON.stringify(updateInput, null, 2)}
            </pre>
          </div>
          <div>
            <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>GetTemplateDefinitionListInput:</p>
            <pre style={{ fontSize: '11px', margin: 0, padding: '0.5rem', borderRadius: '4px', border: '1px solid #333' }}>
              {JSON.stringify(listInput, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      {error && (
        <div className="test-card" style={{ borderColor: '#f44' }}>
          <h3 style={{ color: '#f44' }}>Error</h3>
          <p>{error}</p>
        </div>
      )}

      {templateResult && (
        <div className="test-card">
          <h3>Template Definition Result</h3>
          <pre style={{ fontSize: '12px', padding: '0.5rem', borderRadius: '4px', border: '1px solid #333' }}>
            {JSON.stringify(templateResult, null, 2)}
          </pre>
        </div>
      )}

      {listResult.length > 0 && (
        <div className="test-card">
          <h3>Template List Result ({listResult.length} items)</h3>
          <div style={{ maxHeight: '200px', overflow: 'auto' }}>
            <pre style={{ fontSize: '11px', padding: '0.5rem', borderRadius: '4px', border: '1px solid #333' }}>
              {JSON.stringify(listResult, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {contentResult && (
        <div className="test-card">
          <h3>Template Content Result</h3>
          <pre style={{ fontSize: '12px', padding: '0.5rem', borderRadius: '4px', border: '1px solid #333' }}>
            {JSON.stringify(contentResult, null, 2)}
          </pre>
        </div>
      )}

      <div className="test-card">
        <h3>Usage Example</h3>
        <pre style={{ padding: '0.5rem', borderRadius: '4px', fontSize: '12px', overflow: 'auto' }}>
{`import {
  // Proxy Services (v3.2.0)
  TemplateDefinitionService,
  TemplateContentService,
  // Proxy DTOs (v3.2.0)
  type TemplateDefinitionDto,
  type TextTemplateContentDto,
  type GetTemplateContentInput,
  type UpdateTemplateContentInput,
  type RestoreTemplateContentInput,
  type GetTemplateDefinitionListInput,
} from '@abpjs/text-template-management';
import { useRestService } from '@abpjs/core';

function MyComponent() {
  const restService = useRestService();

  // Create proxy service instances
  const definitionService = new TemplateDefinitionService(restService);
  const contentService = new TemplateContentService(restService);

  // Get single template definition by name
  const template = await definitionService.get('EmailVerification');

  // Get paginated list with filters
  const list = await definitionService.getList({
    filterText: 'email',
    skipCount: 0,
    maxResultCount: 10,
    sorting: 'name asc',
  });

  // Get template content
  const content = await contentService.get({
    templateName: 'EmailVerification',
    cultureName: 'en',
  });

  // Update template content
  const updated = await contentService.update({
    templateName: 'EmailVerification',
    cultureName: 'en',
    content: '<html>New content</html>',
  });

  // Restore to default
  await contentService.restoreToDefault({
    templateName: 'EmailVerification',
    cultureName: 'en',
  });
}`}
        </pre>
      </div>

      <div className="test-card">
        <h3>Migration Notes</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          The legacy services in the models namespace are deprecated and will be removed in v4.0.
          Migrate to the new proxy services for better type safety.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Legacy (Deprecated)</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>New (v3.2.0)</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>TextTemplateManagement.TemplateDefinitionDto</code></td>
              <td style={{ padding: '8px' }}><code>TemplateDefinitionDto</code> (from proxy)</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>TextTemplateManagement.TextTemplateContentDto</code></td>
              <td style={{ padding: '8px' }}><code>TextTemplateContentDto</code> (from proxy)</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>TextTemplateManagement.TemplateContentInput</code></td>
              <td style={{ padding: '8px' }}><code>GetTemplateContentInput</code> (from proxy)</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>TextTemplateManagement.CreateOrUpdateTemplateContentDto</code></td>
              <td style={{ padding: '8px' }}><code>UpdateTemplateContentInput</code> (from proxy)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

/**
 * v3.1.0 Features - GetTemplateDefinitionListInput and factory function
 */
function TestV310Features() {
  // Demonstrate creating input with factory function
  const defaultInput = createGetTemplateDefinitionListInput()
  const customInput = createGetTemplateDefinitionListInput({
    filterText: 'email',
    skipCount: 10,
    maxResultCount: 25,
    sorting: 'displayName asc',
  })
  const partialInput = createGetTemplateDefinitionListInput({
    filterText: 'invoice',
  })

  // Manual input creation (without factory)
  const manualInput: GetTemplateDefinitionListInput = {
    filterText: 'welcome',
    skipCount: 0,
    maxResultCount: 10,
  }

  return (
    <div className="test-section">
      <h2>v3.1.0 Features <span style={{ fontSize: '14px', color: '#4ade80' }}>(NEW)</span></h2>

      <div className="test-card">
        <h3>GetTemplateDefinitionListInput Interface</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          New interface for template definition list queries with filter and pagination support.
        </p>
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
              <td style={{ padding: '8px' }}><code>filterText</code></td>
              <td style={{ padding: '8px' }}>string?</td>
              <td style={{ padding: '8px' }}>Filter text for searching templates</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>skipCount</code></td>
              <td style={{ padding: '8px' }}>number?</td>
              <td style={{ padding: '8px' }}>Skip count for pagination</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>maxResultCount</code></td>
              <td style={{ padding: '8px' }}>number?</td>
              <td style={{ padding: '8px' }}>Max result count for pagination</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>sorting</code></td>
              <td style={{ padding: '8px' }}>string?</td>
              <td style={{ padding: '8px' }}>Sorting field and order</td>
            </tr>
          </tbody>
        </table>
        <div style={{ marginTop: '0.5rem', padding: '0.5rem', borderRadius: '4px', border: '1px solid #333' }}>
          <p><strong>Manual Input Example:</strong></p>
          <pre style={{ fontSize: '11px', margin: 0 }}>{JSON.stringify(manualInput, null, 2)}</pre>
        </div>
      </div>

      <div className="test-card">
        <h3>createGetTemplateDefinitionListInput Factory</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          Factory function to create <code>GetTemplateDefinitionListInput</code> with sensible defaults.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Input</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Result</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>createGetTemplateDefinitionListInput()</code></td>
              <td style={{ padding: '8px' }}>
                <pre style={{ fontSize: '11px', margin: 0 }}>{JSON.stringify(defaultInput, null, 2)}</pre>
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>createGetTemplateDefinitionListInput({'{ filterText: "invoice" }'})</code></td>
              <td style={{ padding: '8px' }}>
                <pre style={{ fontSize: '11px', margin: 0 }}>{JSON.stringify(partialInput, null, 2)}</pre>
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>createGetTemplateDefinitionListInput({'{ filterText: "email", skipCount: 10, ... }'})</code></td>
              <td style={{ padding: '8px' }}>
                <pre style={{ fontSize: '11px', margin: 0 }}>{JSON.stringify(customInput, null, 2)}</pre>
              </td>
            </tr>
          </tbody>
        </table>
        <p style={{ fontSize: '12px', color: '#888', marginTop: '0.5rem' }}>
          Defaults: skipCount=0, maxResultCount=10
        </p>
      </div>

      <div className="test-card">
        <h3>Usage Example</h3>
        <pre style={{ padding: '0.5rem', borderRadius: '4px', fontSize: '12px', overflow: 'auto' }}>
{`import {
  type GetTemplateDefinitionListInput,
  createGetTemplateDefinitionListInput,
} from '@abpjs/text-template-management';

// Create with defaults (skipCount: 0, maxResultCount: 10)
const defaultInput = createGetTemplateDefinitionListInput();

// Create with custom filter
const searchInput = createGetTemplateDefinitionListInput({
  filterText: 'welcome',
  maxResultCount: 50,
});

// Use with TemplateDefinitionService
const service = new TemplateDefinitionService(restService);
const result = await service.getList(searchInput);

// Or create manually
const manualInput: GetTemplateDefinitionListInput = {
  filterText: 'email',
  skipCount: 0,
  maxResultCount: 10,
  sorting: 'name asc',
};`}
        </pre>
      </div>
    </div>
  )
}

function TestV300Features() {
  // v3.0.0 - Policy Names
  const textTemplatesPolicy: TextTemplateManagementPolicyNameKey = eTextTemplateManagementPolicyNames.TextTemplates

  // v3.0.0 - Extension guard hook
  const { loading, isLoaded } = useTextTemplateManagementExtensionsGuard()

  // v3.0.0 - Demo custom actions/props (for demonstration purposes)
  const customEntityAction: EntityAction<TextTemplateManagement.TemplateDefinitionDto> = {
    text: 'Custom Action',
    action: (record) => console.log('Custom action on:', record),
    visible: () => true,
  }

  const customToolbarAction: ToolbarAction<TextTemplateManagement.TemplateDefinitionDto[]> = {
    text: 'Toolbar Action',
    action: () => console.log('Toolbar action triggered'),
    visible: () => true,
  }

  const customEntityProp: EntityProp<TextTemplateManagement.TemplateDefinitionDto> = {
    name: 'customField',
    displayName: 'Custom Field',
    sortable: true,
  }

  // Demonstrate contributor callbacks
  const entityActionContributor: EntityActionContributorCallback<TextTemplateManagement.TemplateDefinitionDto> = (actionList) => {
    return [...actionList, customEntityAction]
  }

  const toolbarActionContributor: ToolbarActionContributorCallback<TextTemplateManagement.TemplateDefinitionDto[]> = (actionList) => {
    return [...actionList, customToolbarAction]
  }

  const entityPropContributor: EntityPropContributorCallback<TextTemplateManagement.TemplateDefinitionDto> = (propList) => {
    return [...propList, customEntityProp]
  }

  // Type annotation for config options
  const configOptions: TextTemplateManagementConfigOptions = {
    entityActionContributors: {
      [eTextTemplateManagementComponents.TextTemplates]: [entityActionContributor],
    },
    toolbarActionContributors: {
      [eTextTemplateManagementComponents.TextTemplates]: [toolbarActionContributor],
    },
    entityPropContributors: {
      [eTextTemplateManagementComponents.TextTemplates]: [entityPropContributor],
    },
  }

  return (
    <div className="test-section">
      <h2>v3.0.0 Features</h2>

      <div className="test-card">
        <h3>Policy Names (eTextTemplateManagementPolicyNames)</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          Policy name constants for permission checking.
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
              <td style={{ padding: '8px' }}><code>TextTemplates</code></td>
              <td style={{ padding: '8px' }}><code>{textTemplatesPolicy}</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>Route Configuration</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          New route configuration pattern from config subpackage.
        </p>
        <pre style={{ padding: '0.5rem', borderRadius: '4px', fontSize: '12px', overflow: 'auto' }}>
{`// TEXT_TEMPLATE_MANAGEMENT_ROUTE_CONFIG
${JSON.stringify(TEXT_TEMPLATE_MANAGEMENT_ROUTE_CONFIG, null, 2)}`}
        </pre>
        <p style={{ fontSize: '12px', color: '#888', marginTop: '0.5rem' }}>
          Functions: <code>configureRoutes()</code>, <code>initializeTextTemplateManagementRoutes()</code>
        </p>
        <p style={{ fontSize: '12px', color: '#888' }}>
          Provider: <code>TEXT_TEMPLATE_MANAGEMENT_ROUTE_PROVIDERS</code>
        </p>
      </div>

      <div className="test-card">
        <h3>Extension Tokens (DEFAULT_TEXT_TEMPLATE_MANAGEMENT_*)</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          Default extension tokens for customizing entity actions, toolbar actions, and entity props.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Token</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>DEFAULT_TEXT_TEMPLATE_MANAGEMENT_ENTITY_ACTIONS</code></td>
              <td style={{ padding: '8px' }}>EntityAction[]</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>DEFAULT_TEXT_TEMPLATE_MANAGEMENT_TOOLBAR_ACTIONS</code></td>
              <td style={{ padding: '8px' }}>ToolbarAction[]</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>DEFAULT_TEXT_TEMPLATE_MANAGEMENT_ENTITY_PROPS</code></td>
              <td style={{ padding: '8px' }}>EntityProp[]</td>
            </tr>
          </tbody>
        </table>
        <p style={{ fontSize: '12px', color: '#888', marginTop: '0.5rem' }}>
          Current counts: Actions={DEFAULT_TEXT_TEMPLATE_MANAGEMENT_ENTITY_ACTIONS[eTextTemplateManagementComponents.TextTemplates].length},
          Toolbar={DEFAULT_TEXT_TEMPLATE_MANAGEMENT_TOOLBAR_ACTIONS[eTextTemplateManagementComponents.TextTemplates].length},
          Props={DEFAULT_TEXT_TEMPLATE_MANAGEMENT_ENTITY_PROPS[eTextTemplateManagementComponents.TextTemplates].length}
        </p>
      </div>

      <div className="test-card">
        <h3>Extensions Guard</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          Guard for route protection and extension loading state.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Export</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>textTemplateManagementExtensionsGuard</code></td>
              <td style={{ padding: '8px' }}>Function</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>useTextTemplateManagementExtensionsGuard</code></td>
              <td style={{ padding: '8px' }}>React Hook</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>TextTemplateManagementExtensionsGuard</code></td>
              <td style={{ padding: '8px' }}>Class</td>
            </tr>
          </tbody>
        </table>
        <p style={{ marginTop: '0.5rem' }}>
          <strong>Hook State:</strong> loading={loading ? 'true' : 'false'}, isLoaded={isLoaded ? 'true' : 'false'}
        </p>
      </div>

      <div className="test-card">
        <h3>Config Options (TextTemplateManagementConfigOptions)</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          Configuration options for customizing text template management behavior.
        </p>
        <pre style={{ padding: '0.5rem', borderRadius: '4px', fontSize: '12px', overflow: 'auto' }}>
{`// Example configuration with contributor callbacks
const config: TextTemplateManagementConfigOptions = {
  entityActionContributors: [
    (actionList) => {
      actionList.addTail({ text: 'Custom', action: () => {} });
      return actionList;
    }
  ],
  toolbarActionContributors: [...],
  entityPropContributors: [...],
};`}
        </pre>
        <p style={{ fontSize: '12px', color: '#888', marginTop: '0.5rem' }}>
          Demo config has {Object.keys(configOptions.entityActionContributors ?? {}).length} component(s) with entity action contributors
        </p>
      </div>

      <div className="test-card">
        <h3>Usage Example</h3>
        <pre style={{ padding: '0.5rem', borderRadius: '4px', fontSize: '12px', overflow: 'auto' }}>
{`import {
  // Config
  eTextTemplateManagementPolicyNames,
  TEXT_TEMPLATE_MANAGEMENT_ROUTE_CONFIG,
  configureRoutes,

  // Tokens
  DEFAULT_TEXT_TEMPLATE_MANAGEMENT_ENTITY_ACTIONS,

  // Guards
  useTextTemplateManagementExtensionsGuard,

  // Types
  type TextTemplateManagementConfigOptions,
} from '@abpjs/text-template-management';

function ProtectedRoute({ children }) {
  const { loading, isLoaded } = useTextTemplateManagementExtensionsGuard();

  if (loading) return <Spinner />;
  if (!isLoaded) return <Redirect to="/unauthorized" />;

  return children;
}`}
        </pre>
      </div>
    </div>
  )
}

function TestTextTemplatesComponent() {
  const { isAuthenticated } = useAuth()
  const [selectedTemplate, setSelectedTemplate] = useState<TextTemplateManagement.TemplateDefinitionDto | null>(null)

  return (
    <div className="test-section">
      <h2>TextTemplatesComponent</h2>

      <div className="test-card">
        <h3>Full Text Templates Management UI</h3>
        <p>This component provides a complete text template management interface with:</p>
        <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
          <li>Paginated template list with search</li>
          <li>Template details display (name, layout, culture)</li>
          <li>Edit contents action for each template</li>
        </ul>
        {!isAuthenticated && (
          <p style={{ color: '#f88', marginBottom: '1rem' }}>
            You must be authenticated to use Text Template Management features
          </p>
        )}
      </div>

      <div className="test-card">
        <TextTemplatesComponent
          onEditContents={(template) => {
            console.log('Edit template contents:', template)
            setSelectedTemplate(template)
          }}
        />
      </div>

      {selectedTemplate && (
        <div className="test-card">
          <h3>Selected Template</h3>
          <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
            {JSON.stringify(selectedTemplate, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

function TestTemplateContentsComponent() {
  const { isAuthenticated } = useAuth()
  const [templateName, setTemplateName] = useState('EmailTemplate')

  const cultures = [
    { name: 'en', displayName: 'English' },
    { name: 'fr', displayName: 'French' },
    { name: 'de', displayName: 'German' },
    { name: 'es', displayName: 'Spanish' },
  ]

  return (
    <div className="test-section">
      <h2>TemplateContentsComponent</h2>

      <div className="test-card">
        <h3>Template Content Editor</h3>
        <p>This component provides a template content editor with:</p>
        <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
          <li>Culture selection dropdown</li>
          <li>Content textarea with syntax highlighting potential</li>
          <li>Save and restore to default actions</li>
          <li>Reference content display for localization</li>
        </ul>
        {!isAuthenticated && (
          <p style={{ color: '#f88', marginBottom: '1rem' }}>
            You must be authenticated to use Text Template Management features
          </p>
        )}
      </div>

      <div className="test-card">
        <h3>Template Name</h3>
        <input
          type="text"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          placeholder="Enter template name"
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #333',
            width: '100%',
            marginBottom: '1rem',
          }}
        />
      </div>

      <div className="test-card">
        <TemplateContentsComponent
          templateName={templateName}
          cultures={cultures}
          defaultCultureName="en"
          onSave={(content) => {
            console.log('Template content saved:', content)
          }}
          onRestore={() => {
            console.log('Template restored to default')
          }}
        />
      </div>
    </div>
  )
}

function TestUseTextTemplatesHook() {
  const { isAuthenticated } = useAuth()
  const {
    templateDefinitions,
    totalCount,
    selectedTemplate,
    templateContent,
    isLoading,
    error,
    fetchTemplateDefinitions,
    getTemplateContent,
    setSelectedTemplate,
    reset,
  } = useTextTemplates()

  const [testTemplateName, setTestTemplateName] = useState('')

  // Fetch templates on mount (only if authenticated)
  useEffect(() => {
    if (isAuthenticated) {
      fetchTemplateDefinitions()
    }
  }, [fetchTemplateDefinitions, isAuthenticated])

  return (
    <div className="test-section">
      <h2>useTextTemplates Hook</h2>

      <div className="test-card">
        <h3>Fetch Template Definitions</h3>
        <button onClick={() => fetchTemplateDefinitions()} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Fetch All Templates'}
        </button>
        <p style={{ marginTop: '0.5rem', fontSize: '14px', color: '#888' }}>
          Fetches all template definitions from /api/text-template-management/template-definitions
        </p>
      </div>

      <div className="test-card">
        <h3>Get Template Content</h3>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
          <input
            type="text"
            placeholder="Enter Template Name"
            value={testTemplateName}
            onChange={(e) => setTestTemplateName(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #333',
              flex: 1
            }}
          />
          <button
            onClick={async () => {
              if (testTemplateName) {
                await getTemplateContent({ templateName: testTemplateName, cultureName: 'en' })
              }
            }}
            disabled={!testTemplateName || isLoading}
          >
            Get Content
          </button>
        </div>
      </div>

      <div className="test-card">
        <h3>Hook State</h3>
        <p>isLoading: {isLoading ? 'true' : 'false'}</p>
        <p>error: {error || 'null'}</p>
        <p>templates count: {templateDefinitions?.length ?? 0}</p>
        <p>totalCount: {totalCount}</p>
        <p>selectedTemplate: {selectedTemplate ? `${selectedTemplate.displayName} (${selectedTemplate.name})` : 'none'}</p>
        <p>templateContent: {templateContent ? `${templateContent.name} (${templateContent.cultureName})` : 'none'}</p>
        {!isAuthenticated && (
          <p style={{ color: '#f88', marginTop: '0.5rem' }}>
            You must be authenticated to use Text Template Management features
          </p>
        )}
      </div>

      {templateDefinitions && templateDefinitions.length > 0 && (
        <div className="test-card">
          <h3>Templates List ({templateDefinitions.length} of {totalCount})</h3>
          <div style={{ maxHeight: '300px', overflow: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Name</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Display Name</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Is Layout</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {templateDefinitions.map((template: TextTemplateManagement.TemplateDefinitionDto) => (
                  <tr key={template.name} style={{ borderBottom: '1px solid #222' }}>
                    <td style={{ padding: '8px', fontSize: '12px' }}>{template.name}</td>
                    <td style={{ padding: '8px' }}>{template.displayName}</td>
                    <td style={{ padding: '8px' }}>{template.isLayout ? 'Yes' : 'No'}</td>
                    <td style={{ padding: '8px' }}>
                      <button
                        onClick={() => setSelectedTemplate(template)}
                        style={{ marginRight: '0.5rem', padding: '4px 8px' }}
                      >
                        Select
                      </button>
                      <button
                        onClick={() => {
                          setTestTemplateName(template.name)
                          getTemplateContent({ templateName: template.name, cultureName: 'en' })
                        }}
                        style={{ padding: '4px 8px' }}
                      >
                        Get Content
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {templateContent && (
        <div className="test-card">
          <h3>Template Content</h3>
          <p><strong>Name:</strong> {templateContent.name}</p>
          <p><strong>Culture:</strong> {templateContent.cultureName}</p>
          <p><strong>Content:</strong></p>
          <pre style={{ padding: '0.5rem', borderRadius: '4px', maxHeight: '200px', overflow: 'auto', fontSize: '12px' }}>
            {templateContent.content || '(empty)'}
          </pre>
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
        <h3>TEXT_TEMPLATE_MANAGEMENT_ROUTES</h3>
        <p>Route configuration for the Text Template Management module:</p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px' }}>
          {JSON.stringify(TEXT_TEMPLATE_MANAGEMENT_ROUTES, null, 2)}
        </pre>
      </div>
    </div>
  )
}

function TestEnumsSection() {
  // Type-safe component key
  const textTemplatesKey: TextTemplateManagementComponentKey = eTextTemplateManagementComponents.TextTemplates
  const templateContentsKey: TextTemplateManagementComponentKey = eTextTemplateManagementComponents.TemplateContents
  const inlineKey: TextTemplateManagementComponentKey = eTextTemplateManagementComponents.InlineTemplateContent

  // Type-safe route name key (v3.0.0 - Administration removed)
  const textTemplatesRoute: TextTemplateManagementRouteNameKey = eTextTemplateManagementRouteNames.TextTemplates

  return (
    <div className="test-section">
      <h2>Enums and Type-Safe Keys</h2>

      <div className="test-card">
        <h3>eTextTemplateManagementComponents</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          Component keys for component replacement and customization.
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
              <td style={{ padding: '8px' }}><code>TextTemplates</code></td>
              <td style={{ padding: '8px' }}><code>{textTemplatesKey}</code></td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>TemplateContents</code></td>
              <td style={{ padding: '8px' }}><code>{templateContentsKey}</code></td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>InlineTemplateContent</code></td>
              <td style={{ padding: '8px' }}><code>{inlineKey}</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>eTextTemplateManagementRouteNames</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          Route name keys for localization and navigation.
        </p>
        <p style={{ fontSize: '12px', color: '#f88', marginBottom: '0.5rem' }}>
          ⚠️ v3.0.0 Breaking Change: Administration key was removed
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
              <td style={{ padding: '8px' }}><code>TextTemplates</code></td>
              <td style={{ padding: '8px' }}><code>{textTemplatesRoute}</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>Type-Safe Keys</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          Type exports for compile-time type safety.
        </p>
        <pre style={{ padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
{`// Type-safe component key
import { eTextTemplateManagementComponents, type TextTemplateManagementComponentKey } from '@abpjs/text-template-management';

const key: TextTemplateManagementComponentKey = eTextTemplateManagementComponents.TextTemplates;

// Type-safe route configuration
import { eTextTemplateManagementRouteNames, type TextTemplateManagementRouteNameKey } from '@abpjs/text-template-management';

const routeKey: TextTemplateManagementRouteNameKey = eTextTemplateManagementRouteNames.TextTemplates;`}
        </pre>
      </div>
    </div>
  )
}

function TestStateServiceSection() {
  const restService = useRestService()
  // Create service instance to demonstrate usage (prefixed with _ to show it's for documentation)
  const [_service] = useState(() => new TextTemplateManagementStateService(restService))

  return (
    <div className="test-section">
      <h2>TextTemplateManagementStateService</h2>

      <div className="test-card">
        <h3>Overview</h3>
        <p>
          The <code>TextTemplateManagementStateService</code> provides a stateful facade over text template operations,
          maintaining internal state that mirrors the Angular NGXS store pattern.
        </p>
      </div>

      <div className="test-card">
        <h3>Dispatch Methods</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Method</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>dispatchGetTemplateDefinitions</td>
              <td>Fetch template definitions with pagination</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>dispatchGetTemplateContent</td>
              <td>Fetch template content by name and culture</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>dispatchUpdateTemplateContent</td>
              <td>Update template content</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>dispatchRestoreToDefault</td>
              <td>Restore template to default content</td>
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
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>getTemplateDefinitions()</td>
              <td>TemplateDefinitionDto[]</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>getTotalCount()</td>
              <td>number</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>getSelectedTemplate()</td>
              <td>TemplateDefinitionDto | null</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>getTemplateContent()</td>
              <td>TextTemplateContentDto | null</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>Usage Example</h3>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`import { TextTemplateManagementStateService } from '@abpjs/text-template-management';
import { useRestService } from '@abpjs/core';

function MyComponent() {
  const restService = useRestService();
  const stateService = new TextTemplateManagementStateService(restService);

  // Dispatch to fetch templates
  await stateService.dispatchGetTemplateDefinitions({ maxResultCount: 10 });

  // Access the result from state
  const templates = stateService.getTemplateDefinitions();
  const totalCount = stateService.getTotalCount();

  // Fetch template content
  await stateService.dispatchGetTemplateContent({
    templateName: 'EmailTemplate',
    cultureName: 'en',
  });

  const content = stateService.getTemplateContent();
}`}
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
        <h3>Template Definition Endpoints</h3>
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
              <td style={{ padding: '8px' }}><code>/api/text-template-management/template-definitions</code></td>
              <td>Fetch all template definitions</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>Template Content Endpoints</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Method</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Endpoint</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>GET</code></td>
              <td style={{ padding: '8px' }}><code>/api/text-template-management/template-contents</code></td>
              <td>Get template content by name and culture</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>PUT</code></td>
              <td style={{ padding: '8px' }}><code>/api/text-template-management/template-contents</code></td>
              <td>Update template content</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>PUT</code></td>
              <td style={{ padding: '8px' }}><code>/api/text-template-management/template-contents/restore-to-default</code></td>
              <td>Restore template to default content</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function TestTextTemplateManagementPage() {
  return (
    <div>
      <h1>@abpjs/text-template-management Tests (v4.0.0)</h1>
      <p style={{ marginBottom: '8px' }}>Testing Text Template Management module for managing text templates and their content.</p>
      <p style={{ fontSize: '14px', color: '#888', marginBottom: '16px' }}>
        Version 4.0.0 - Internal Angular changes only (no new React features)
      </p>
      <p style={{ fontSize: '14px', color: '#888' }}>
        This package provides components and services for managing text templates used in email notifications,
        SMS messages, and other text-based content in ABP Framework applications.
      </p>

      <TestV320Features />
      <TestV310Features />
      <TestV300Features />
      <TestEnumsSection />
      <TestTextTemplatesComponent />
      <TestTemplateContentsComponent />
      <TestUseTextTemplatesHook />
      <TestStateServiceSection />
      <TestRouteConstants />
      <TestApiEndpoints />
    </div>
  )
}

export default TestTextTemplateManagementPage
