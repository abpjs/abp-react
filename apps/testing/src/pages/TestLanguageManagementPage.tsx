/**
 * Test page for @abpjs/language-management package
 * Tests: LanguagesComponent, LanguageTextsComponent, hooks, service
 * @since 2.0.0
 * @updated 2.1.1 - Dependency updates (no new features)
 */
import { useState } from 'react'
import {
  LanguagesComponent,
  LanguageTextsComponent,
  useLanguages,
  useLanguageTexts,
  LANGUAGE_MANAGEMENT_ROUTES,
  LanguageManagementStateService,
} from '@abpjs/language-management'
import type { LanguageManagement } from '@abpjs/language-management'

// Type annotation to ensure LanguageManagementStateService is used
const _stateServiceType: typeof LanguageManagementStateService | null = null
void _stateServiceType

function TestLanguagesComponent() {
  const [showComponent, setShowComponent] = useState(false)

  return (
    <div className="test-section">
      <h2>LanguagesComponent</h2>

      <div className="test-card">
        <h3>Toggle Languages Component</h3>
        <p>Show/hide the LanguagesComponent:</p>
        <button onClick={() => setShowComponent(!showComponent)}>
          {showComponent ? 'Hide Component' : 'Show Component'}
        </button>
      </div>

      {showComponent && (
        <div className="test-card">
          <h3>LanguagesComponent Preview</h3>
          <div style={{ border: '1px solid #333', borderRadius: '8px', padding: '16px' }}>
            <LanguagesComponent
              onLanguageCreated={(lang) => console.log('Language created:', lang)}
              onLanguageUpdated={(lang) => console.log('Language updated:', lang)}
              onLanguageDeleted={(id) => console.log('Language deleted:', id)}
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
            <tr><td style={{ padding: '8px' }}>onLanguageCreated</td><td>(lang: Language) =&gt; void</td><td>Callback when language is created</td></tr>
            <tr><td style={{ padding: '8px' }}>onLanguageUpdated</td><td>(lang: Language) =&gt; void</td><td>Callback when language is updated</td></tr>
            <tr><td style={{ padding: '8px' }}>onLanguageDeleted</td><td>(id: string) =&gt; void</td><td>Callback when language is deleted</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TestLanguageTextsComponent() {
  const [showComponent, setShowComponent] = useState(false)

  return (
    <div className="test-section">
      <h2>LanguageTextsComponent</h2>

      <div className="test-card">
        <h3>Toggle Language Texts Component</h3>
        <p>Show/hide the LanguageTextsComponent:</p>
        <button onClick={() => setShowComponent(!showComponent)}>
          {showComponent ? 'Hide Component' : 'Show Component'}
        </button>
      </div>

      {showComponent && (
        <div className="test-card">
          <h3>LanguageTextsComponent Preview</h3>
          <div style={{ border: '1px solid #333', borderRadius: '8px', padding: '16px' }}>
            <LanguageTextsComponent
              onLanguageTextUpdated={(params) => console.log('Text updated:', params)}
              onLanguageTextRestored={(params) => console.log('Text restored:', params)}
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
            <tr><td style={{ padding: '8px' }}>onLanguageTextUpdated</td><td>(params: LanguageTextUpdateByNameParams) =&gt; void</td><td>Callback when text is updated</td></tr>
            <tr><td style={{ padding: '8px' }}>onLanguageTextRestored</td><td>(params: LanguageTextRequestByNameParams) =&gt; void</td><td>Callback when text is restored</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TestUseLanguagesHook() {
  const {
    languages,
    totalCount,
    cultures,
    selectedLanguage,
    isLoading,
    error,
    fetchLanguages,
    fetchCultures,
    reset,
  } = useLanguages()

  return (
    <div className="test-section">
      <h2>useLanguages Hook</h2>

      <div className="test-card">
        <h3>Hook State</h3>
        <p>languages count: <strong>{languages.length}</strong></p>
        <p>total count: <strong>{totalCount}</strong></p>
        <p>cultures count: <strong>{cultures.length}</strong></p>
        <p>selected language: <strong>{selectedLanguage?.displayName || 'null'}</strong></p>
        <p>isLoading: <strong>{isLoading ? 'true' : 'false'}</strong></p>
        <p>error: <strong>{error || 'null'}</strong></p>
      </div>

      <div className="test-card">
        <h3>Actions</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => fetchLanguages()}>
            Fetch Languages
          </button>
          <button onClick={() => fetchCultures()}>
            Fetch Cultures
          </button>
          <button onClick={reset} style={{ background: '#c44' }}>
            Reset
          </button>
        </div>
      </div>

      {languages.length > 0 && (
        <div className="test-card">
          <h3>Languages</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #333' }}>
                <th style={{ textAlign: 'left', padding: '8px' }}>Display Name</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Culture</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Enabled</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Default</th>
              </tr>
            </thead>
            <tbody>
              {languages.map((lang: LanguageManagement.Language) => (
                <tr key={lang.id} style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '8px' }}>
                    {lang.flagIcon} {lang.displayName}
                  </td>
                  <td style={{ padding: '8px' }}>{lang.cultureName}</td>
                  <td style={{ padding: '8px' }}>{lang.isEnabled ? 'Yes' : 'No'}</td>
                  <td style={{ padding: '8px' }}>{lang.isDefaultLanguage ? 'Yes' : 'No'}</td>
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
            <tr><td style={{ padding: '8px' }}>fetchLanguages</td><td>Fetch all languages from API</td></tr>
            <tr><td style={{ padding: '8px' }}>fetchCultures</td><td>Fetch all available cultures</td></tr>
            <tr><td style={{ padding: '8px' }}>createLanguage</td><td>Create a new language</td></tr>
            <tr><td style={{ padding: '8px' }}>updateLanguage</td><td>Update an existing language</td></tr>
            <tr><td style={{ padding: '8px' }}>deleteLanguage</td><td>Delete a language by ID</td></tr>
            <tr><td style={{ padding: '8px' }}>setAsDefaultLanguage</td><td>Set language as default</td></tr>
            <tr><td style={{ padding: '8px' }}>getLanguageById</td><td>Get a single language by ID</td></tr>
            <tr><td style={{ padding: '8px' }}>reset</td><td>Reset all state</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TestUseLanguageTextsHook() {
  const {
    languageTexts,
    totalCount,
    resources,
    isLoading,
    error,
    fetchLanguageTexts,
    fetchResources,
    reset,
  } = useLanguageTexts()

  return (
    <div className="test-section">
      <h2>useLanguageTexts Hook</h2>

      <div className="test-card">
        <h3>Hook State</h3>
        <p>language texts count: <strong>{languageTexts.length}</strong></p>
        <p>total count: <strong>{totalCount}</strong></p>
        <p>resources count: <strong>{resources.length}</strong></p>
        <p>isLoading: <strong>{isLoading ? 'true' : 'false'}</strong></p>
        <p>error: <strong>{error || 'null'}</strong></p>
      </div>

      <div className="test-card">
        <h3>Actions</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={() => fetchResources()}>
            Fetch Resources
          </button>
          <button onClick={() => fetchLanguageTexts({
            baseCultureName: 'en',
            targetCultureName: 'tr',
            getOnlyEmptyValues: false,
          })}>
            Fetch Language Texts (en → tr)
          </button>
          <button onClick={reset} style={{ background: '#c44' }}>
            Reset
          </button>
        </div>
      </div>

      {resources.length > 0 && (
        <div className="test-card">
          <h3>Resources</h3>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {resources.map((resource: LanguageManagement.Resource) => (
              <li key={resource.name}>{resource.name}</li>
            ))}
          </ul>
        </div>
      )}

      {languageTexts.length > 0 && (
        <div className="test-card">
          <h3>Language Texts</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #333' }}>
                <th style={{ textAlign: 'left', padding: '8px' }}>Key</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Base Value</th>
                <th style={{ textAlign: 'left', padding: '8px' }}>Target Value</th>
              </tr>
            </thead>
            <tbody>
              {languageTexts.slice(0, 10).map((text: LanguageManagement.LanguageText) => (
                <tr key={text.name} style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '8px' }}>{text.name}</td>
                  <td style={{ padding: '8px' }}>{text.baseValue || '-'}</td>
                  <td style={{ padding: '8px' }}>{text.value || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {languageTexts.length > 10 && (
            <p style={{ color: '#888', fontSize: '14px', marginTop: '8px' }}>
              Showing first 10 of {languageTexts.length} texts
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
            <tr><td style={{ padding: '8px' }}>fetchLanguageTexts</td><td>Fetch language texts with filters</td></tr>
            <tr><td style={{ padding: '8px' }}>fetchResources</td><td>Fetch all available resources</td></tr>
            <tr><td style={{ padding: '8px' }}>updateLanguageTextByName</td><td>Update a language text value</td></tr>
            <tr><td style={{ padding: '8px' }}>restoreLanguageTextByName</td><td>Restore a language text to default</td></tr>
            <tr><td style={{ padding: '8px' }}>reset</td><td>Reset all state</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

function TestLanguageManagementServiceSection() {
  const [serviceInfo, setServiceInfo] = useState<string>('')

  const testService = () => {
    setServiceInfo(`Service instantiated. Methods available:
- getLanguages(params)
- getLanguageById(id)
- createLanguage(input)
- updateLanguage(id, input)
- deleteLanguage(id)
- setAsDefaultLanguage(id)
- getCultures()
- getResources()
- getLanguageTexts(params)
- updateLanguageTextByName(params)
- restoreLanguageTextByName(params)`)
  }

  return (
    <div className="test-section">
      <h2>LanguageManagementService</h2>

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
{`import { LanguageManagementService } from '@abpjs/language-management';
import { useRestService } from '@abpjs/core';

function MyComponent() {
  const restService = useRestService();
  const service = new LanguageManagementService(restService);

  // Use service methods
  const languages = await service.getLanguages({});
  const cultures = await service.getCultures();
}`}
        </pre>
      </div>
    </div>
  )
}

function TestLanguageManagementStateServiceSection() {
  return (
    <div className="test-section">
      <h2>LanguageManagementStateService (v2.0.0)</h2>

      <div className="test-card">
        <h3>Overview</h3>
        <p>
          The <code>LanguageManagementStateService</code> provides a stateful facade over language management
          operations, maintaining internal state that mirrors the Angular NGXS store pattern.
          It has <strong>10 dispatch methods</strong> and <strong>6 getter methods</strong>.
        </p>
      </div>

      <div className="test-card">
        <h3>Dispatch Methods</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Category</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Method</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }} rowSpan={5}>Languages</td>
              <td style={{ padding: '8px' }}>dispatchGetLanguages</td>
              <td>Fetch languages with pagination</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>dispatchGetLanguageById</td>
              <td>Fetch a single language by ID</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>dispatchCreateUpdateLanguage</td>
              <td>Create or update a language</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>dispatchDeleteLanguage</td>
              <td>Delete a language (returns null)</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>dispatchSetAsDefaultLanguage</td>
              <td>Set a language as default</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }} rowSpan={3}>Language Texts</td>
              <td style={{ padding: '8px' }}>dispatchGetLanguageTexts</td>
              <td>Fetch language texts with filters</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>dispatchUpdateLanguageTextByName</td>
              <td>Update a language text</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>dispatchRestoreLanguageTextByName</td>
              <td>Restore a language text to default</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }} rowSpan={2}>Metadata</td>
              <td style={{ padding: '8px' }}>dispatchGetLanguageCultures</td>
              <td>Fetch available cultures</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>dispatchGetLanguageResources</td>
              <td>Fetch available resources</td>
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
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>getLanguages()</td>
              <td style={{ padding: '8px' }}>Language[]</td>
              <td>Get languages from state</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>getLanguagesTotalCount()</td>
              <td style={{ padding: '8px' }}>number</td>
              <td>Get total count of languages</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>getLanguageTexts()</td>
              <td style={{ padding: '8px' }}>LanguageText[]</td>
              <td>Get language texts from state</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>getLanguageTextsTotalCount()</td>
              <td style={{ padding: '8px' }}>number</td>
              <td>Get total count of texts</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>getCultures()</td>
              <td style={{ padding: '8px' }}>Culture[]</td>
              <td>Get cultures from state</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>getResources()</td>
              <td style={{ padding: '8px' }}>Resource[]</td>
              <td>Get resources from state</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>Usage Example</h3>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`import { LanguageManagementStateService } from '@abpjs/language-management';
import { useRestService } from '@abpjs/core';

function MyComponent() {
  const restService = useRestService();
  const stateService = new LanguageManagementStateService(restService);

  // Dispatch to fetch languages
  await stateService.dispatchGetLanguages({ maxResultCount: 10 });

  // Access the result from state
  const languages = stateService.getLanguages();
  const totalCount = stateService.getLanguagesTotalCount();

  // Dispatch to fetch cultures and resources
  await stateService.dispatchGetLanguageCultures();
  await stateService.dispatchGetLanguageResources();

  // Create/update a language
  await stateService.dispatchCreateUpdateLanguage({
    cultureName: 'fr',
    uiCultureName: 'fr',
    displayName: 'French',
    flagIcon: '🇫🇷',
    isEnabled: true,
  });

  // Delete a language (returns null per v2.0.0 spec)
  const result = await stateService.dispatchDeleteLanguage('lang-id');
  console.log(result); // null
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
        <h3>LANGUAGE_MANAGEMENT_ROUTES</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '8px' }}>
          Default route configuration for the language management module:
        </p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{JSON.stringify(LANGUAGE_MANAGEMENT_ROUTES, null, 2)}
        </pre>
      </div>
    </div>
  )
}

function TestModels() {
  return (
    <div className="test-section">
      <h2>Models (LanguageManagement namespace)</h2>

      <div className="test-card">
        <h3>Language Interface</h3>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`interface Language {
  id: string;
  cultureName: string;
  uiCultureName: string;
  displayName: string;
  flagIcon?: string;
  isEnabled: boolean;
  isDefaultLanguage: boolean;
  creationTime?: string;
  creatorId?: string;
  concurrencyStamp?: string;
}`}
        </pre>
      </div>

      <div className="test-card">
        <h3>Culture Interface</h3>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`interface Culture {
  name: string;
  displayName: string;
}`}
        </pre>
      </div>

      <div className="test-card">
        <h3>LanguageText Interface</h3>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`interface LanguageText {
  name: string;
  resourceName: string;
  baseCultureName: string;
  targetCultureName: string;
  baseValue?: string;
  targetValue?: string;
}`}
        </pre>
      </div>

      <div className="test-card">
        <h3>Resource Interface</h3>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
{`interface Resource {
  name: string;
  displayName: string;
}`}
        </pre>
      </div>
    </div>
  )
}

export function TestLanguageManagementPage() {
  return (
    <div>
      <h1>@abpjs/language-management Tests (v2.1.1)</h1>
      <p style={{ marginBottom: '8px' }}>Testing language management components, hooks, and services.</p>
      <p style={{ fontSize: '14px', color: '#888', marginBottom: '16px' }}>
        Version 2.1.1 - Dependency updates (no functional changes from v2.0.0)
      </p>

      <TestLanguagesComponent />
      <TestLanguageTextsComponent />
      <TestUseLanguagesHook />
      <TestUseLanguageTextsHook />
      <TestLanguageManagementServiceSection />
      <TestLanguageManagementStateServiceSection />
      <TestConstants />
      <TestModels />
    </div>
  )
}

export default TestLanguageManagementPage
