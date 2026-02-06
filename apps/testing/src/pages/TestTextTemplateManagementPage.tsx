/**
 * Test page for @abpjs/text-template-management package
 * Tests: TextTemplatesComponent, TemplateContentsComponent, useTextTemplates hook
 * @since 2.7.0
 * @updated 2.9.0 - Internal Angular changes (no new React features)
 */
import { useState, useEffect } from 'react'
import { useAuth, useRestService } from '@abpjs/core'
import {
  TextTemplatesComponent,
  TemplateContentsComponent,
  useTextTemplates,
  TEXT_TEMPLATE_MANAGEMENT_ROUTES,
  TemplateDefinitionService,
  TemplateContentService,
  TextTemplateManagementStateService,
  eTextTemplateManagementComponents,
  eTextTemplateManagementRouteNames,
  type TextTemplateManagement,
  type TextTemplateManagementComponentKey,
  type TextTemplateManagementRouteNameKey,
} from '@abpjs/text-template-management'

// Type annotation to ensure services are used
const _definitionServiceType: typeof TemplateDefinitionService | null = null
const _contentServiceType: typeof TemplateContentService | null = null
const _stateServiceType: typeof TextTemplateManagementStateService | null = null
void _definitionServiceType
void _contentServiceType
void _stateServiceType

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

  // Type-safe route name key
  const adminRoute: TextTemplateManagementRouteNameKey = eTextTemplateManagementRouteNames.Administration
  const textTemplatesRoute: TextTemplateManagementRouteNameKey = eTextTemplateManagementRouteNames.TextTemplates

  return (
    <div className="test-section">
      <h2>Enums and Type-Safe Keys (v2.7.0)</h2>

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
      <h1>@abpjs/text-template-management Tests (v2.9.0)</h1>
      <p style={{ marginBottom: '8px' }}>Testing Text Template Management module for managing text templates and their content.</p>
      <p style={{ fontSize: '14px', color: '#888', marginBottom: '16px' }}>
        Version 2.9.0 - No new React features (internal Angular changes only)
      </p>
      <p style={{ fontSize: '14px', color: '#888' }}>
        This package provides components and services for managing text templates used in email notifications,
        SMS messages, and other text-based content in ABP Framework applications.
      </p>

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
