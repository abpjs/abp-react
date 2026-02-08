/**
 * Test page for @abpjs/language-management package
 * Tests: LanguagesComponent, LanguageTextsComponent, hooks, service
 * @since 2.0.0
 * @updated 2.2.0 - Dependency updates (no new features)
 * @updated 2.4.0 - Added apiName property, eLanguageManagementComponents enum
 * @updated 2.7.0 - Added eLanguageManagementRouteNames, LanguageManagementComponentKey/RouteNameKey types
 * @updated 2.9.0 - Internal Angular changes (no new React features)
 * @updated 3.0.0 - Added config subpackage (policy names, route providers), extension tokens, extension guards
 * @updated 3.1.0 - Internal type updates, dependency updates (no new React features)
 * @updated 3.2.0 - Added proxy subpackage with typed DTOs and services
 * @updated 4.0.0 - State.languageResponse now PagedResultDto, getLanguagesTotalCount restored, service deprecations updated
 */
import { useState } from 'react'
import { useRestService } from '@abpjs/core'
import {
  LanguagesComponent,
  LanguageTextsComponent,
  useLanguages,
  useLanguageTexts,
  LANGUAGE_MANAGEMENT_ROUTES,
  LanguageManagementStateService,
  LanguageManagementService,
  eLanguageManagementComponents,
  eLanguageManagementRouteNames,
  type LanguageManagementComponentKey,
  type LanguageManagementRouteNameKey,
  // v3.0.0 Config exports
  eLanguageManagementPolicyNames,
  configureRoutes,
  initializeLanguageManagementRoutes,
  LANGUAGE_MANAGEMENT_ROUTE_PROVIDERS,
  // v3.0.0 Token exports
  DEFAULT_LANGUAGES_ENTITY_ACTIONS,
  DEFAULT_LANGUAGE_TEXTS_ENTITY_ACTIONS,
  DEFAULT_LANGUAGE_MANAGEMENT_ENTITY_ACTIONS,
  DEFAULT_LANGUAGES_TOOLBAR_ACTIONS,
  DEFAULT_LANGUAGE_MANAGEMENT_TOOLBAR_ACTIONS,
  DEFAULT_LANGUAGES_ENTITY_PROPS,
  DEFAULT_LANGUAGE_MANAGEMENT_ENTITY_PROPS,
  DEFAULT_LANGUAGES_CREATE_FORM_PROPS,
  DEFAULT_LANGUAGES_EDIT_FORM_PROPS,
  DEFAULT_LANGUAGE_MANAGEMENT_CREATE_FORM_PROPS,
  DEFAULT_LANGUAGE_MANAGEMENT_EDIT_FORM_PROPS,
  LANGUAGE_MANAGEMENT_ENTITY_ACTION_CONTRIBUTORS,
  LANGUAGE_MANAGEMENT_TOOLBAR_ACTION_CONTRIBUTORS,
  LANGUAGE_MANAGEMENT_ENTITY_PROP_CONTRIBUTORS,
  LANGUAGE_MANAGEMENT_CREATE_FORM_PROP_CONTRIBUTORS,
  LANGUAGE_MANAGEMENT_EDIT_FORM_PROP_CONTRIBUTORS,
  // v3.0.0 Guard exports
  languageManagementExtensionsGuard,
  useLanguageManagementExtensionsGuard,
  LanguageManagementExtensionsGuard,
  // v3.2.0 Proxy exports
  LanguageService,
  LanguageTextService,
} from '@abpjs/language-management'
import type {
  LanguageManagement,
  CreateLanguageDto,
  UpdateLanguageDto,
  LanguageDto,
  LanguageTextDto,
  CultureInfoDto,
  LanguageResourceDto,
  GetLanguagesTextsInput,
} from '@abpjs/language-management'

// Type annotation to ensure LanguageManagementStateService is used
const _stateServiceType: typeof LanguageManagementStateService | null = null
void _stateServiceType

// Type annotations to ensure proxy DTOs are used (compile-time verification)
const _createLanguageDto: CreateLanguageDto | null = null
const _updateLanguageDto: UpdateLanguageDto | null = null
const _languageDto: LanguageDto | null = null
const _languageTextDto: LanguageTextDto | null = null
const _cultureInfoDto: CultureInfoDto | null = null
const _languageResourceDto: LanguageResourceDto | null = null
const _getLanguagesTextsInput: GetLanguagesTextsInput | null = null
void _createLanguageDto
void _updateLanguageDto
void _languageDto
void _languageTextDto
void _cultureInfoDto
void _languageResourceDto
void _getLanguagesTextsInput

/**
 * Test section for v4.0.0 features
 */
function TestV400Features() {
  return (
    <div className="test-section">
      <h2>v4.0.0 Features <span style={{ fontSize: '14px', color: '#4ade80' }}>(NEW)</span></h2>

      {/* State Migration */}
      <div className="test-card">
        <h3>State Type Migration (v4.0.0)</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          <code>LanguageManagement.State.languageResponse</code> changed from <code>ListResultDto</code> to <code>PagedResultDto</code>.
          This adds the <code>totalCount</code> field alongside <code>items</code>.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Field</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Before (v3.2.0)</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>After (v4.0.0)</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>languageResponse</code></td>
              <td style={{ padding: '8px', fontSize: '12px' }}><code>{'ListResultDto<LanguageDto>'}</code></td>
              <td style={{ padding: '8px', fontSize: '12px' }}><code>{'PagedResultDto<LanguageDto>'}</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Restored Method */}
      <div className="test-card">
        <h3>Restored: getLanguagesTotalCount() (v4.0.0)</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          The <code>getLanguagesTotalCount()</code> method was removed in v3.0.0 and has been restored in v4.0.0.
          It returns the <code>totalCount</code> from the <code>languageResponse</code> state.
        </p>
        <pre style={{ padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
{`// Usage
const stateService = new LanguageManagementStateService(restService);
await stateService.dispatchGetLanguages({ maxResultCount: 10 });

const languages = stateService.getLanguages();           // LanguageDto[]
const totalCount = stateService.getLanguagesTotalCount(); // number (restored in v4.0.0)`}
        </pre>
      </div>

      {/* Service Deprecations */}
      <div className="test-card">
        <h3>Service Deprecations Updated (v4.0.0)</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          Deprecated types and services are now marked for removal in v5.0 (previously v4.0).
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Deprecated Item</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Replacement</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Removal</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px', color: '#888' }}><code>LanguageManagementService</code></td>
              <td style={{ padding: '8px' }}><code>LanguageService</code> + <code>LanguageTextService</code></td>
              <td style={{ padding: '8px', color: '#f59e0b' }}>v5.0</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px', color: '#888' }}><code>LanguageManagement.Language</code></td>
              <td style={{ padding: '8px' }}><code>LanguageDto</code></td>
              <td style={{ padding: '8px', color: '#f59e0b' }}>v5.0</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px', color: '#888' }}><code>LanguageManagement.LanguageText</code></td>
              <td style={{ padding: '8px' }}><code>LanguageTextDto</code></td>
              <td style={{ padding: '8px', color: '#f59e0b' }}>v5.0</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px', color: '#888' }}><code>LanguageManagement.Culture</code></td>
              <td style={{ padding: '8px' }}><code>CultureInfoDto</code></td>
              <td style={{ padding: '8px', color: '#f59e0b' }}>v5.0</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px', color: '#888' }}><code>LanguageManagement.Resource</code></td>
              <td style={{ padding: '8px' }}><code>LanguageResourceDto</code></td>
              <td style={{ padding: '8px', color: '#f59e0b' }}>v5.0</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* LanguageService.getList return type */}
      <div className="test-card">
        <h3>LanguageService.getList Return Type (v4.0.0)</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          <code>LanguageService.getList()</code> now returns <code>{'PagedResultDto<LanguageDto>'}</code> instead of <code>{'ListResultDto<LanguageDto>'}</code>.
          This is a compatible change since <code>PagedResultDto</code> extends <code>ListResultDto</code>.
        </p>
        <pre style={{ padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
{`// v4.0.0 - getList now returns PagedResultDto (includes totalCount)
const result = await languageService.getList({ maxResultCount: 10 });
console.log(result.items);      // LanguageDto[]
console.log(result.totalCount); // number (new in v4.0.0)`}
        </pre>
      </div>

      {/* Angular-only changes */}
      <div className="test-card">
        <h3>Angular-Only Changes (Not Applicable)</h3>
        <p style={{ fontSize: '14px', color: '#888' }}>
          The following v4.0.0 Angular changes do not affect the React package:
        </p>
        <ul style={{ fontSize: '13px', color: '#666', marginTop: '0.5rem' }}>
          <li>Flag-icons module (Angular component CSS class list)</li>
          <li>Locale subpackage (Angular locale registration)</li>
          <li>Angular DI refactoring (ConfigStateService, ApplicationConfigurationService)</li>
        </ul>
      </div>
    </div>
  )
}

/**
 * Test section for v3.2.0 features: proxy subpackage with typed DTOs and services
 */
function TestV320Features() {
  const restService = useRestService()
  const [languageService] = useState(() => new LanguageService(restService))
  const [languageTextService] = useState(() => new LanguageTextService(restService))
  const [languageServiceResult, setLanguageServiceResult] = useState<string>('')
  const [languageTextServiceResult, setLanguageTextServiceResult] = useState<string>('')

  const testLanguageService = () => {
    setLanguageServiceResult(`LanguageService instantiated successfully!

apiName: ${languageService.apiName}

Available methods:
- create(input: CreateLanguageDto): Promise<LanguageDto>
- delete(id: string): Promise<void>
- get(id: string): Promise<LanguageDto>
- getAllList(): Promise<ListResultDto<LanguageDto>>
- getCulturelist(): Promise<CultureInfoDto[]>
- getList(input?: GetLanguagesTextsInput): Promise<PagedResultDto<LanguageDto>>
- getResources(): Promise<LanguageResourceDto[]>
- setAsDefault(id: string): Promise<void>
- update(id: string, input: UpdateLanguageDto): Promise<LanguageDto>`)
  }

  const testLanguageTextService = () => {
    setLanguageTextServiceResult(`LanguageTextService instantiated successfully!

apiName: ${languageTextService.apiName}

Available methods:
- get(resourceName, cultureName, name, baseCultureName): Promise<LanguageTextDto>
- getList(input: GetLanguagesTextsInput): Promise<PagedResultDto<LanguageTextDto>>
- restoreToDefault(resourceName, cultureName, name): Promise<void>
- update(resourceName, cultureName, name, value): Promise<void>`)
  }

  return (
    <div className="test-section">
      <h2>v3.2.0 Features <span style={{ fontSize: '14px', color: '#4ade80' }}>(NEW)</span></h2>

      {/* Overview */}
      <div className="test-card">
        <h3>Proxy Subpackage (v3.2.0)</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          New proxy subpackage with typed DTOs and services that mirror the ABP backend API structure.
          The legacy <code>LanguageManagementService</code> is now deprecated in favor of the new typed proxy services.
        </p>
        <div style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #f59e0b', marginBottom: '1rem' }}>
          <strong style={{ color: '#f59e0b' }}>Deprecation Notice:</strong>
          <p style={{ fontSize: '12px', margin: '0.5rem 0 0' }}>
            <code>LanguageManagementService</code>, <code>LanguageManagement.Language</code>, and related legacy types
            are deprecated. Use <code>LanguageService</code>, <code>LanguageTextService</code>, and proxy DTOs instead.
            Legacy types will be removed in v5.0.
          </p>
        </div>
      </div>

      {/* LanguageService */}
      <div className="test-card">
        <h3>LanguageService (v3.2.0)</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          Typed service for managing languages with full CRUD operations.
        </p>
        <button onClick={testLanguageService} style={{ marginBottom: '1rem' }}>
          Test LanguageService
        </button>
        {languageServiceResult && (
          <pre style={{ padding: '0.5rem', borderRadius: '4px', fontSize: '12px', overflow: 'auto' }}>
            {languageServiceResult}
          </pre>
        )}
        <pre style={{ padding: '0.5rem', borderRadius: '4px', fontSize: '12px', marginTop: '1rem' }}>
{`// Usage - LanguageService
import { LanguageService } from '@abpjs/language-management';
import type { CreateLanguageDto, LanguageDto } from '@abpjs/language-management/proxy';

const languageService = new LanguageService(restService);

// Get all languages
const allLanguages = await languageService.getAllList();

// Create a new language
const newLanguage = await languageService.create({
  displayName: 'French',
  cultureName: 'fr-FR',
  uiCultureName: 'fr-FR',
  flagIcon: 'fr',
  isEnabled: true,
});

// Set as default
await languageService.setAsDefault(newLanguage.id);`}
        </pre>
      </div>

      {/* LanguageTextService */}
      <div className="test-card">
        <h3>LanguageTextService (v3.2.0)</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          Typed service for managing language text translations.
        </p>
        <button onClick={testLanguageTextService} style={{ marginBottom: '1rem' }}>
          Test LanguageTextService
        </button>
        {languageTextServiceResult && (
          <pre style={{ padding: '0.5rem', borderRadius: '4px', fontSize: '12px', overflow: 'auto' }}>
            {languageTextServiceResult}
          </pre>
        )}
        <pre style={{ padding: '0.5rem', borderRadius: '4px', fontSize: '12px', marginTop: '1rem' }}>
{`// Usage - LanguageTextService
import { LanguageTextService } from '@abpjs/language-management';
import type { GetLanguagesTextsInput, LanguageTextDto } from '@abpjs/language-management/proxy';

const textService = new LanguageTextService(restService);

// Get language texts with filtering
const texts = await textService.getList({
  baseCultureName: 'en-US',
  targetCultureName: 'fr-FR',
  resourceName: 'AbpIdentity',
  getOnlyEmptyValues: true,
  maxResultCount: 50,
});

// Update a translation
await textService.update('AbpIdentity', 'fr-FR', 'UserName', 'Nom d\\'utilisateur');

// Restore to default
await textService.restoreToDefault('AbpIdentity', 'fr-FR', 'UserName');`}
        </pre>
      </div>

      {/* DTOs Reference */}
      <div className="test-card">
        <h3>Proxy DTOs (v3.2.0)</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          Typed Data Transfer Objects for type-safe API interactions.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>DTO</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Purpose</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Key Fields</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>CreateLanguageDto</code></td>
              <td style={{ padding: '8px' }}>Create a new language</td>
              <td style={{ padding: '8px', fontSize: '11px' }}>displayName, cultureName, uiCultureName, flagIcon, isEnabled</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>UpdateLanguageDto</code></td>
              <td style={{ padding: '8px' }}>Update an existing language</td>
              <td style={{ padding: '8px', fontSize: '11px' }}>displayName, flagIcon, isEnabled</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>LanguageDto</code></td>
              <td style={{ padding: '8px' }}>Language entity response</td>
              <td style={{ padding: '8px', fontSize: '11px' }}>id, cultureName, displayName, isEnabled, isDefaultLanguage, ...</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>LanguageTextDto</code></td>
              <td style={{ padding: '8px' }}>Language text translation</td>
              <td style={{ padding: '8px', fontSize: '11px' }}>resourceName, cultureName, name, value, baseValue</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>CultureInfoDto</code></td>
              <td style={{ padding: '8px' }}>Culture information</td>
              <td style={{ padding: '8px', fontSize: '11px' }}>name, displayName</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>LanguageResourceDto</code></td>
              <td style={{ padding: '8px' }}>Localization resource</td>
              <td style={{ padding: '8px', fontSize: '11px' }}>name</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>GetLanguagesTextsInput</code></td>
              <td style={{ padding: '8px' }}>Query parameters for texts</td>
              <td style={{ padding: '8px', fontSize: '11px' }}>filter, resourceName, baseCultureName, targetCultureName, ...</td>
            </tr>
          </tbody>
        </table>

        <pre style={{ padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
{`// Import proxy DTOs
import type {
  CreateLanguageDto,
  UpdateLanguageDto,
  LanguageDto,
  LanguageTextDto,
  CultureInfoDto,
  LanguageResourceDto,
  GetLanguagesTextsInput,
} from '@abpjs/language-management/proxy';

// Type-safe language creation
const createDto: CreateLanguageDto = {
  displayName: 'German',
  cultureName: 'de-DE',
  uiCultureName: 'de-DE',
  flagIcon: 'de',
  isEnabled: true,
  extraProperties: { region: 'Europe' }, // Optional
};

// Type-safe query input
const queryInput: GetLanguagesTextsInput = {
  baseCultureName: 'en-US',
  targetCultureName: 'de-DE',
  getOnlyEmptyValues: true,
  maxResultCount: 100,
  sorting: 'name asc',
};`}
        </pre>
      </div>

      {/* Migration Guide */}
      <div className="test-card">
        <h3>Migration from Legacy Types</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Legacy (Deprecated)</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>New (v3.2.0)</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px', color: '#888' }}><code>LanguageManagementService</code></td>
              <td style={{ padding: '8px' }}><code>LanguageService</code> + <code>LanguageTextService</code></td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px', color: '#888' }}><code>LanguageManagement.Language</code></td>
              <td style={{ padding: '8px' }}><code>LanguageDto</code></td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px', color: '#888' }}><code>LanguageManagement.LanguageText</code></td>
              <td style={{ padding: '8px' }}><code>LanguageTextDto</code></td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px', color: '#888' }}><code>LanguageManagement.Culture</code></td>
              <td style={{ padding: '8px' }}><code>CultureInfoDto</code></td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px', color: '#888' }}><code>LanguageManagement.Resource</code></td>
              <td style={{ padding: '8px' }}><code>LanguageResourceDto</code></td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px', color: '#888' }}><code>LanguageManagement.LanguageCreateDto</code></td>
              <td style={{ padding: '8px' }}><code>CreateLanguageDto</code></td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px', color: '#888' }}><code>LanguageManagement.LanguageUpdateDto</code></td>
              <td style={{ padding: '8px' }}><code>UpdateLanguageDto</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* v3.2.0 API Reference */}
      <div className="test-card">
        <h3>v3.2.0 API Reference</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Category</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Export</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }} rowSpan={2}>Services</td>
              <td style={{ padding: '8px' }}><code>LanguageService</code></td>
              <td style={{ padding: '8px' }}>Class</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>LanguageTextService</code></td>
              <td style={{ padding: '8px' }}>Class</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }} rowSpan={7}>DTOs</td>
              <td style={{ padding: '8px' }}><code>CreateLanguageDto</code></td>
              <td style={{ padding: '8px' }}>Interface</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>UpdateLanguageDto</code></td>
              <td style={{ padding: '8px' }}>Interface</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>LanguageDto</code></td>
              <td style={{ padding: '8px' }}>Interface</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>LanguageTextDto</code></td>
              <td style={{ padding: '8px' }}>Interface</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>CultureInfoDto</code></td>
              <td style={{ padding: '8px' }}>Interface</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>LanguageResourceDto</code></td>
              <td style={{ padding: '8px' }}>Interface</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>GetLanguagesTextsInput</code></td>
              <td style={{ padding: '8px' }}>Interface</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

/**
 * Test section for v3.0.0 features: config subpackage, extension tokens, extension guards
 */
function TestV300Features() {
  const [guardResult, setGuardResult] = useState<{ isLoaded: boolean; loading: boolean } | null>(null)
  const [guardFnResult, setGuardFnResult] = useState<boolean | null>(null)

  const hookResult = useLanguageManagementExtensionsGuard()
  const testGuardHook = () => {
    setGuardResult(hookResult)
  }

  const testGuardFunction = async () => {
    const result = await languageManagementExtensionsGuard()
    setGuardFnResult(result)
  }

  return (
    <div className="test-section">
      <h2>v3.0.0 Features <span style={{ fontSize: '14px', color: '#4ade80' }}>(NEW)</span></h2>

      {/* Config Subpackage */}
      <div className="test-card">
        <h3>Config Subpackage (v3.0.0)</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          New config subpackage with policy names, route names, and route providers.
        </p>

        <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>eLanguageManagementPolicyNames</h4>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Key</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(eLanguageManagementPolicyNames).map(([key, value]) => (
              <tr key={key} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '8px' }}><code>{key}</code></td>
                <td style={{ padding: '8px', fontSize: '12px' }}><code>{value}</code></td>
              </tr>
            ))}
          </tbody>
        </table>

        <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Route Providers</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          <div style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #4ade80', fontSize: '12px' }}>
            configureRoutes: {typeof configureRoutes}
          </div>
          <div style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #4ade80', fontSize: '12px' }}>
            initializeLanguageManagementRoutes: {typeof initializeLanguageManagementRoutes}
          </div>
          <div style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #60a5fa', fontSize: '12px' }}>
            LANGUAGE_MANAGEMENT_ROUTE_PROVIDERS: {typeof LANGUAGE_MANAGEMENT_ROUTE_PROVIDERS}
          </div>
        </div>

        <pre style={{ padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
{`// Usage - Config imports
import {
  eLanguageManagementPolicyNames,
  configureRoutes,
  initializeLanguageManagementRoutes,
  LANGUAGE_MANAGEMENT_ROUTE_PROVIDERS,
} from '@abpjs/language-management';

// Check permission
const canEditLanguages = checkPolicy(eLanguageManagementPolicyNames.LanguagesEdit);

// Initialize routes
initializeLanguageManagementRoutes(router);`}
        </pre>
      </div>

      {/* Extension Tokens */}
      <div className="test-card">
        <h3>Extension Tokens (v3.0.0)</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          Default entity actions, toolbar actions, entity props, and form props for extensibility.
        </p>

        <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Default Entity Actions</h4>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Token</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>DEFAULT_LANGUAGES_ENTITY_ACTIONS</code></td>
              <td style={{ padding: '8px', fontSize: '12px' }}>
                {DEFAULT_LANGUAGES_ENTITY_ACTIONS.map(a => a.text.split('::')[1]).join(', ')}
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>DEFAULT_LANGUAGE_TEXTS_ENTITY_ACTIONS</code></td>
              <td style={{ padding: '8px', fontSize: '12px' }}>
                {DEFAULT_LANGUAGE_TEXTS_ENTITY_ACTIONS.map(a => a.text.split('::')[1]).join(', ')}
              </td>
            </tr>
          </tbody>
        </table>

        <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Default Toolbar Actions</h4>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Token</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>DEFAULT_LANGUAGES_TOOLBAR_ACTIONS</code></td>
              <td style={{ padding: '8px', fontSize: '12px' }}>
                {DEFAULT_LANGUAGES_TOOLBAR_ACTIONS.map(a => a.text.split('::')[1]).join(', ') || '(empty)'}
              </td>
            </tr>
          </tbody>
        </table>

        <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Default Entity Props</h4>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Token</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Props</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>DEFAULT_LANGUAGES_ENTITY_PROPS</code></td>
              <td style={{ padding: '8px', fontSize: '12px' }}>
                {DEFAULT_LANGUAGES_ENTITY_PROPS.map(p => p.name).join(', ')}
              </td>
            </tr>
          </tbody>
        </table>

        <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Default Form Props</h4>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Token</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Props</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>DEFAULT_LANGUAGES_CREATE_FORM_PROPS</code></td>
              <td style={{ padding: '8px', fontSize: '12px' }}>
                {DEFAULT_LANGUAGES_CREATE_FORM_PROPS.map(p => p.name).join(', ')}
              </td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>DEFAULT_LANGUAGES_EDIT_FORM_PROPS</code></td>
              <td style={{ padding: '8px', fontSize: '12px' }}>
                {DEFAULT_LANGUAGES_EDIT_FORM_PROPS.map(p => p.name).join(', ')}
              </td>
            </tr>
          </tbody>
        </table>

        <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Contributor Token Symbols</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          <div style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #a78bfa', fontSize: '11px' }}>
            ENTITY_ACTION_CONTRIBUTORS: {typeof LANGUAGE_MANAGEMENT_ENTITY_ACTION_CONTRIBUTORS}
          </div>
          <div style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #a78bfa', fontSize: '11px' }}>
            TOOLBAR_ACTION_CONTRIBUTORS: {typeof LANGUAGE_MANAGEMENT_TOOLBAR_ACTION_CONTRIBUTORS}
          </div>
          <div style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #a78bfa', fontSize: '11px' }}>
            ENTITY_PROP_CONTRIBUTORS: {typeof LANGUAGE_MANAGEMENT_ENTITY_PROP_CONTRIBUTORS}
          </div>
          <div style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #a78bfa', fontSize: '11px' }}>
            CREATE_FORM_PROP_CONTRIBUTORS: {typeof LANGUAGE_MANAGEMENT_CREATE_FORM_PROP_CONTRIBUTORS}
          </div>
          <div style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #a78bfa', fontSize: '11px' }}>
            EDIT_FORM_PROP_CONTRIBUTORS: {typeof LANGUAGE_MANAGEMENT_EDIT_FORM_PROP_CONTRIBUTORS}
          </div>
        </div>

        <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Component-Keyed Aggregates</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #f59e0b', fontSize: '11px' }}>
            DEFAULT_LANGUAGE_MANAGEMENT_ENTITY_ACTIONS: {Object.keys(DEFAULT_LANGUAGE_MANAGEMENT_ENTITY_ACTIONS).length} components
          </div>
          <div style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #f59e0b', fontSize: '11px' }}>
            DEFAULT_LANGUAGE_MANAGEMENT_TOOLBAR_ACTIONS: {Object.keys(DEFAULT_LANGUAGE_MANAGEMENT_TOOLBAR_ACTIONS).length} components
          </div>
          <div style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #f59e0b', fontSize: '11px' }}>
            DEFAULT_LANGUAGE_MANAGEMENT_ENTITY_PROPS: {Object.keys(DEFAULT_LANGUAGE_MANAGEMENT_ENTITY_PROPS).length} components
          </div>
          <div style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #f59e0b', fontSize: '11px' }}>
            DEFAULT_LANGUAGE_MANAGEMENT_CREATE_FORM_PROPS: {Object.keys(DEFAULT_LANGUAGE_MANAGEMENT_CREATE_FORM_PROPS).length} components
          </div>
          <div style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #f59e0b', fontSize: '11px' }}>
            DEFAULT_LANGUAGE_MANAGEMENT_EDIT_FORM_PROPS: {Object.keys(DEFAULT_LANGUAGE_MANAGEMENT_EDIT_FORM_PROPS).length} components
          </div>
        </div>
      </div>

      {/* Extension Guards */}
      <div className="test-card">
        <h3>Extension Guards (v3.0.0)</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          Guards for route protection and extension loading.
        </p>

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <button onClick={() => testGuardHook()}>
            Test useLanguageManagementExtensionsGuard Hook
          </button>
          <button onClick={() => testGuardFunction()}>
            Test languageManagementExtensionsGuard Function
          </button>
        </div>

        {guardResult && (
          <div style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #333', marginBottom: '0.5rem' }}>
            <strong>Hook Result:</strong> isLoaded={String(guardResult.isLoaded)}, loading={String(guardResult.loading)}
          </div>
        )}

        {guardFnResult !== null && (
          <div style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #333', marginBottom: '0.5rem' }}>
            <strong>Function Result:</strong> {String(guardFnResult)}
          </div>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          <div style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #4ade80', fontSize: '12px' }}>
            languageManagementExtensionsGuard: {typeof languageManagementExtensionsGuard}
          </div>
          <div style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #4ade80', fontSize: '12px' }}>
            useLanguageManagementExtensionsGuard: {typeof useLanguageManagementExtensionsGuard}
          </div>
          <div style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #60a5fa', fontSize: '12px' }}>
            LanguageManagementExtensionsGuard: {typeof LanguageManagementExtensionsGuard}
          </div>
        </div>

        <pre style={{ padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
{`// Usage - Guards
import {
  languageManagementExtensionsGuard,
  useLanguageManagementExtensionsGuard,
  LanguageManagementExtensionsGuard,
} from '@abpjs/language-management';

// Async guard function for route protection
const canActivate = await languageManagementExtensionsGuard();

// React hook for components
const { isLoaded, loading } = useLanguageManagementExtensionsGuard();

// Class-based guard
const guard = new LanguageManagementExtensionsGuard();
await guard.canActivate();`}
        </pre>
      </div>

      {/* Breaking Changes */}
      <div className="test-card">
        <h3>v3.0.0 Breaking Changes</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Change</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Before (v2.x)</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>After (v3.0.0)</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>Route Names - Administration</td>
              <td style={{ padding: '8px', fontSize: '12px' }}><code>eLanguageManagementRouteNames.Administration</code></td>
              <td style={{ padding: '8px', fontSize: '12px', color: '#ef4444' }}>Removed</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>Route Names - Languages Value</td>
              <td style={{ padding: '8px', fontSize: '12px' }}><code>'LanguageManagement::Menu:Languages'</code></td>
              <td style={{ padding: '8px', fontSize: '12px' }}><code>'LanguageManagement::Languages'</code></td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>Route Names - New Key</td>
              <td style={{ padding: '8px', fontSize: '12px', color: '#888' }}>N/A</td>
              <td style={{ padding: '8px', fontSize: '12px' }}><code>eLanguageManagementRouteNames.LanguageManagement</code></td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}>State Service</td>
              <td style={{ padding: '8px', fontSize: '12px' }}><code>getLanguagesTotalCount()</code></td>
              <td style={{ padding: '8px', fontSize: '12px', color: '#ef4444' }}>Removed</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* v3.0.0 API Reference */}
      <div className="test-card">
        <h3>v3.0.0 API Reference</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Category</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Export</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }} rowSpan={4}>Config</td>
              <td style={{ padding: '8px' }}><code>eLanguageManagementPolicyNames</code></td>
              <td style={{ padding: '8px' }}>Const Object</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>configureRoutes</code></td>
              <td style={{ padding: '8px' }}>Function</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>initializeLanguageManagementRoutes</code></td>
              <td style={{ padding: '8px' }}>Function</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>LANGUAGE_MANAGEMENT_ROUTE_PROVIDERS</code></td>
              <td style={{ padding: '8px' }}>Object</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }} rowSpan={3}>Guards</td>
              <td style={{ padding: '8px' }}><code>languageManagementExtensionsGuard</code></td>
              <td style={{ padding: '8px' }}>Async Function</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>useLanguageManagementExtensionsGuard</code></td>
              <td style={{ padding: '8px' }}>React Hook</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>LanguageManagementExtensionsGuard</code></td>
              <td style={{ padding: '8px' }}>Class</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }} rowSpan={5}>Tokens</td>
              <td style={{ padding: '8px' }}><code>DEFAULT_*_ENTITY_ACTIONS</code></td>
              <td style={{ padding: '8px' }}>Array/Object</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>DEFAULT_*_TOOLBAR_ACTIONS</code></td>
              <td style={{ padding: '8px' }}>Array/Object</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>DEFAULT_*_ENTITY_PROPS</code></td>
              <td style={{ padding: '8px' }}>Array/Object</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>DEFAULT_*_FORM_PROPS</code></td>
              <td style={{ padding: '8px' }}>Array/Object</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>LANGUAGE_MANAGEMENT_*_CONTRIBUTORS</code></td>
              <td style={{ padding: '8px' }}>Symbol</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

/**
 * Test section for v2.4.0 features: apiName property, eLanguageManagementComponents enum
 */
function TestV240Features() {
  const restService = useRestService()
  const [service] = useState(() => new LanguageManagementService(restService))

  return (
    <div className="test-section">
      <h2>v2.4.0 Features <span style={{ fontSize: '14px', color: '#4ade80' }}>(NEW)</span></h2>

      <div className="test-card">
        <h3>apiName Property (v2.4.0)</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          The <code>LanguageManagementService</code> now has an <code>apiName</code> property that defaults to <code>'default'</code>.
          This is used for API routing in multi-API configurations.
        </p>
        <div style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #333' }}>
          <p><strong>LanguageManagementService.apiName:</strong> <code>{service.apiName}</code></p>
        </div>
        <pre style={{ marginTop: '0.5rem', padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
{`// Usage
import { LanguageManagementService } from '@abpjs/language-management';

const service = new LanguageManagementService(restService);
console.log(service.apiName); // 'default'`}
        </pre>
      </div>

      <div className="test-card">
        <h3>eLanguageManagementComponents Enum (v2.4.0)</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          New enum for component identifiers used in component registration and routing.
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
              <td style={{ padding: '8px' }}><code>Languages</code></td>
              <td style={{ padding: '8px' }}><code>{eLanguageManagementComponents.Languages}</code></td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>LanguageTexts</code></td>
              <td style={{ padding: '8px' }}><code>{eLanguageManagementComponents.LanguageTexts}</code></td>
            </tr>
          </tbody>
        </table>
        <pre style={{ marginTop: '0.5rem', padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
{`// Usage - Component registration
import { eLanguageManagementComponents } from '@abpjs/language-management';

const componentRegistry = {};
componentRegistry[eLanguageManagementComponents.Languages] = LanguagesComponent;
componentRegistry[eLanguageManagementComponents.LanguageTexts] = LanguageTextsComponent;`}
        </pre>
      </div>

      <div className="test-card">
        <h3>v2.4.0 API Reference</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Feature</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>apiName</code></td>
              <td style={{ padding: '8px' }}>Property</td>
              <td style={{ padding: '8px' }}>API name for multi-API configurations (default: 'default')</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>eLanguageManagementComponents</code></td>
              <td style={{ padding: '8px' }}>Enum</td>
              <td style={{ padding: '8px' }}>Component identifiers (Languages, LanguageTexts)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

/**
 * Test section for v2.7.0 features: eLanguageManagementRouteNames, LanguageManagementComponentKey/RouteNameKey types
 * Updated in v3.0.0: Route names changed - removed Administration, renamed Languages
 */
function TestV270Features() {
  // Demo type-safe component lookup with LanguageManagementComponentKey
  const getComponentDisplay = (key: LanguageManagementComponentKey): string => {
    const displays: Record<LanguageManagementComponentKey, string> = {
      'LanguageManagement.LanguagesComponent': 'Languages Management',
      'LanguageManagement.LanguageTextsComponent': 'Language Texts Management',
    }
    return displays[key]
  }

  // Demo type-safe route lookup with LanguageManagementRouteNameKey
  // v3.0.0: Updated route name values (removed Administration, renamed Languages)
  const getRouteDisplay = (key: LanguageManagementRouteNameKey): string => {
    const displays: Record<LanguageManagementRouteNameKey, string> = {
      'LanguageManagement::LanguageManagement': 'Language Management Root',
      'LanguageManagement::Languages': 'Languages Page',
      'LanguageManagement::LanguageTexts': 'Language Texts Page',
    }
    return displays[key]
  }

  return (
    <div className="test-section">
      <h2>v2.7.0 Features <span style={{ fontSize: '14px', color: '#888' }}>(Updated in v3.0.0)</span></h2>

      <div className="test-card">
        <h3>eLanguageManagementRouteNames Const Object (v2.7.0, Updated v3.0.0)</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          Route name localization keys used in navigation configuration.
          <br />
          <span style={{ color: '#f59e0b' }}>v3.0.0 Breaking Change:</span> Removed <code>Administration</code> key, renamed <code>Languages</code> value to <code>LanguageManagement::Languages</code>, added <code>LanguageManagement</code> key.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Key</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Value</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Display</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(eLanguageManagementRouteNames).map(([key, value]) => (
              <tr key={key} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '8px' }}><code>{key}</code></td>
                <td style={{ padding: '8px', fontSize: '12px' }}><code>{value}</code></td>
                <td style={{ padding: '8px', fontSize: '12px' }}>{getRouteDisplay(value as LanguageManagementRouteNameKey)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <pre style={{ marginTop: '0.5rem', padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
{`// Usage - Navigation configuration (v3.0.0)
import { eLanguageManagementRouteNames } from '@abpjs/language-management';

const routes = [
  { name: eLanguageManagementRouteNames.LanguageManagement, path: '/language-management' },
  { name: eLanguageManagementRouteNames.Languages, path: '/language-management/languages' },
  { name: eLanguageManagementRouteNames.LanguageTexts, path: '/language-management/language-texts' },
];

// v3.0.0: Removed eLanguageManagementRouteNames.Administration
// v3.0.0: Languages value changed from 'LanguageManagement::Menu:Languages' to 'LanguageManagement::Languages'`}
        </pre>
      </div>

      <div className="test-card">
        <h3>Type-Safe Keys (v2.7.0)</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          New TypeScript types for type-safe component and route key usage.
        </p>
        <div style={{ marginBottom: '1rem' }}>
          <h4 style={{ fontSize: '14px', marginBottom: '0.5rem' }}>LanguageManagementComponentKey</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {Object.values(eLanguageManagementComponents).map((key) => (
              <div
                key={key}
                style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: '1px solid #4ade80',
                  fontSize: '12px',
                }}
              >
                {key} = {getComponentDisplay(key as LanguageManagementComponentKey)}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 style={{ fontSize: '14px', marginBottom: '0.5rem' }}>LanguageManagementRouteNameKey</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {Object.values(eLanguageManagementRouteNames).map((key) => (
              <div
                key={key}
                style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: '1px solid #60a5fa',
                  fontSize: '11px',
                }}
              >
                {key.split('::')[1]}
              </div>
            ))}
          </div>
        </div>
        <pre style={{ marginTop: '0.5rem', padding: '0.5rem', borderRadius: '4px', fontSize: '12px' }}>
{`// Usage - Type-safe lookups
import {
  eLanguageManagementComponents,
  eLanguageManagementRouteNames,
  LanguageManagementComponentKey,
  LanguageManagementRouteNameKey,
} from '@abpjs/language-management';

// Component key type ensures only valid keys
const key: LanguageManagementComponentKey = eLanguageManagementComponents.Languages;
const components: Record<LanguageManagementComponentKey, React.FC> = { ... };

// Route name key type for localization
const routeKey: LanguageManagementRouteNameKey = eLanguageManagementRouteNames.Languages;
const routes: Record<LanguageManagementRouteNameKey, string> = { ... };`}
        </pre>
      </div>

      <div className="test-card">
        <h3>eLanguageManagementComponents (Updated in v2.7.0)</h3>
        <p style={{ fontSize: '14px', color: '#888', marginBottom: '0.5rem' }}>
          Changed from enum to const object for better tree-shaking support.
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
              <td style={{ padding: '8px' }}><code>Languages</code></td>
              <td style={{ padding: '8px' }}><code>{eLanguageManagementComponents.Languages}</code></td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>LanguageTexts</code></td>
              <td style={{ padding: '8px' }}><code>{eLanguageManagementComponents.LanguageTexts}</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>v2.7.0 API Reference</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Feature</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>eLanguageManagementRouteNames</code></td>
              <td style={{ padding: '8px' }}>Const Object</td>
              <td style={{ padding: '8px' }}>Route name localization keys (v3.0.0: LanguageManagement, Languages, LanguageTexts)</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>LanguageManagementComponentKey</code></td>
              <td style={{ padding: '8px' }}>Type</td>
              <td style={{ padding: '8px' }}>Union type of all component key values</td>
            </tr>
            <tr style={{ borderBottom: '1px solid #222' }}>
              <td style={{ padding: '8px' }}><code>LanguageManagementRouteNameKey</code></td>
              <td style={{ padding: '8px' }}>Type</td>
              <td style={{ padding: '8px' }}>Union type of all route name key values</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}><code>eLanguageManagementComponents</code></td>
              <td style={{ padding: '8px' }}>Const Object</td>
              <td style={{ padding: '8px' }}>Changed from enum to const object for better tree-shaking</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

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
      <h2>LanguageManagementStateService (v2.0.0, Updated v4.0.0)</h2>

      <div className="test-card">
        <h3>Overview</h3>
        <p>
          The <code>LanguageManagementStateService</code> provides a stateful facade over language management
          operations, maintaining internal state that mirrors the Angular NGXS store pattern.
          It has <strong>10 dispatch methods</strong> and <strong>6 getter methods</strong> (v4.0.0).
        </p>
        <p style={{ color: '#4ade80', fontSize: '14px', marginTop: '0.5rem' }}>
          v4.0.0: <code>getLanguagesTotalCount()</code> has been restored (was removed in v3.0.0).
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
            <tr style={{ borderBottom: '1px solid #222', background: '#1a3b20' }}>
              <td style={{ padding: '8px' }}>getLanguagesTotalCount()</td>
              <td style={{ padding: '8px' }}>number</td>
              <td>Restored in v4.0.0 (was removed in v3.0.0)</td>
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
  const totalCount = stateService.getLanguagesTotalCount(); // Restored in v4.0.0

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
      <h1>@abpjs/language-management Tests (v4.0.0)</h1>
      <p style={{ marginBottom: '8px' }}>Testing language management components, hooks, and services.</p>
      <p style={{ fontSize: '14px', color: '#888', marginBottom: '16px' }}>
        Version 4.0.0 - State.languageResponse now PagedResultDto, getLanguagesTotalCount restored, deprecations updated to v5.0
      </p>

      <TestV400Features />
      <TestV320Features />
      <TestV300Features />
      <TestV270Features />
      <TestV240Features />
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
