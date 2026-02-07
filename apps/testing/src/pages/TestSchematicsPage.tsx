/**
 * Test Page for @abpjs/schematics
 *
 * Demonstrates the schematics types, classes, and utilities for code generation.
 *
 * @updated 3.2.0 - PROXY_WARNING updated with npm module publishing notice
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  // Enums
  eBindingSourceId,
  Exception,
  eImportKeyword,
  eMethodModifier,
  // Constants
  API_DEFINITION_ENDPOINT,
  PROXY_PATH,
  PROXY_CONFIG_PATH,
  PROXY_WARNING_PATH,
  PROXY_WARNING,
  SYSTEM_TYPES,
  VOLO_REGEX,
  VOLO_NAME_VALUE,
  // Classes
  Import,
  Model,
  Interface,
  Property,
  Method,
  Signature,
  Body,
  Service,
} from '@abpjs/schematics';

// Demo of Enum Values
function EnumDemo() {
  return (
    <div className="test-card">
      <h3>Enums</h3>

      <h4>eBindingSourceId</h4>
      <p>Used to identify parameter binding sources in API actions:</p>
      <ul>
        <li><code>Body</code>: {eBindingSourceId.Body}</li>
        <li><code>Model</code>: {eBindingSourceId.Model}</li>
        <li><code>Path</code>: {eBindingSourceId.Path}</li>
        <li><code>Query</code>: {eBindingSourceId.Query}</li>
      </ul>

      <h4>eImportKeyword</h4>
      <p>Import statement types for code generation:</p>
      <ul>
        <li><code>Default</code>: "{eImportKeyword.Default}"</li>
        <li><code>Type</code>: "{eImportKeyword.Type}"</li>
      </ul>

      <h4>eMethodModifier</h4>
      <p>Method access modifiers:</p>
      <ul>
        <li><code>Public</code>: "{eMethodModifier.Public || '(empty)'}"</li>
        <li><code>Private</code>: "{eMethodModifier.Private}"</li>
        <li><code>Async</code>: "{eMethodModifier.Async}"</li>
        <li><code>PrivateAsync</code>: "{eMethodModifier.PrivateAsync}"</li>
      </ul>

      <h4>Exception Messages</h4>
      <p>Error message templates for schematics operations:</p>
      <ul>
        <li><code>FileNotFound</code>: {Exception.FileNotFound}</li>
        <li><code>InvalidModule</code>: {Exception.InvalidModule}</li>
        <li><code>NoApi</code>: {Exception.NoApi.slice(0, 60)}...</li>
      </ul>
    </div>
  );
}

// Demo of Constants
function ConstantsDemo() {
  return (
    <div className="test-card">
      <h3>Constants</h3>

      <h4>API Constants</h4>
      <ul>
        <li><code>API_DEFINITION_ENDPOINT</code>: {API_DEFINITION_ENDPOINT}</li>
      </ul>

      <h4>Proxy Constants</h4>
      <ul>
        <li><code>PROXY_PATH</code>: {PROXY_PATH}</li>
        <li><code>PROXY_CONFIG_PATH</code>: {PROXY_CONFIG_PATH}</li>
        <li><code>PROXY_WARNING_PATH</code>: {PROXY_WARNING_PATH}</li>
      </ul>

      <h4>PROXY_WARNING (README content)</h4>
      <p style={{ fontSize: '12px', color: '#888' }}>
        v3.2.0: Now includes important notice about npm module publishing
      </p>
      <pre style={{ fontSize: '0.75rem', background: '#1a1a2e', padding: '0.5rem', borderRadius: '4px', overflow: 'auto', maxHeight: '200px' }}>
        {PROXY_WARNING}
      </pre>
      <div style={{ marginTop: '0.5rem' }}>
        <strong>v3.2.0 Verification:</strong>
        <ul style={{ marginLeft: '1rem', fontSize: '0.85rem' }}>
          <li>
            Contains "Important Notice": {' '}
            <span style={{ color: PROXY_WARNING.includes('**Important Notice:**') ? '#6f6' : '#f66' }}>
              {PROXY_WARNING.includes('**Important Notice:**') ? '✓' : '✗'}
            </span>
          </li>
          <li>
            Mentions "barrel exports": {' '}
            <span style={{ color: PROXY_WARNING.includes('barrel exports') ? '#6f6' : '#f66' }}>
              {PROXY_WARNING.includes('barrel exports') ? '✓' : '✗'}
            </span>
          </li>
          <li>
            Mentions "public-api.ts": {' '}
            <span style={{ color: PROXY_WARNING.includes('public-api.ts') ? '#6f6' : '#f66' }}>
              {PROXY_WARNING.includes('public-api.ts') ? '✓' : '✗'}
            </span>
          </li>
        </ul>
      </div>

      <h4>VOLO_REGEX</h4>
      <p>Pattern: <code>{VOLO_REGEX.toString()}</code></p>
      <p>
        Matches "Volo.Abp.Application.Dtos.PagedResultDto":{' '}
        <strong>{VOLO_REGEX.test('Volo.Abp.Application.Dtos.PagedResultDto') ? 'Yes' : 'No'}</strong>
      </p>
      <p>
        Matches "Volo.Abp.Identity.IdentityUser":{' '}
        <strong>{VOLO_REGEX.test('Volo.Abp.Identity.IdentityUser') ? 'Yes' : 'No'}</strong>
      </p>
    </div>
  );
}

// Demo of SYSTEM_TYPES Map
function SystemTypesDemo() {
  const [showAll, setShowAll] = useState(false);
  const entries = Array.from(SYSTEM_TYPES.entries());
  const displayEntries = showAll ? entries : entries.slice(0, 8);

  return (
    <div className="test-card">
      <h3>SYSTEM_TYPES Map</h3>
      <p>Maps .NET types to TypeScript types ({SYSTEM_TYPES.size} entries):</p>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #444', padding: '0.25rem' }}>.NET Type</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #444', padding: '0.25rem' }}>TypeScript Type</th>
          </tr>
        </thead>
        <tbody>
          {displayEntries.map(([dotNetType, tsType]) => (
            <tr key={dotNetType}>
              <td style={{ padding: '0.25rem', borderBottom: '1px solid #333' }}>{dotNetType}</td>
              <td style={{ padding: '0.25rem', borderBottom: '1px solid #333' }}><code>{tsType}</code></td>
            </tr>
          ))}
        </tbody>
      </table>
      {entries.length > 8 && (
        <button
          onClick={() => setShowAll(!showAll)}
          style={{ marginTop: '0.5rem', padding: '0.25rem 0.5rem', cursor: 'pointer' }}
        >
          {showAll ? 'Show Less' : `Show All (${entries.length})`}
        </button>
      )}
    </div>
  );
}

// Demo of VOLO_NAME_VALUE predefined interface
function VoloNameValueDemo() {
  return (
    <div className="test-card">
      <h3>VOLO_NAME_VALUE Interface</h3>
      <p>Predefined interface for Volo.Abp.NameValue:</p>
      <ul>
        <li><strong>Identifier:</strong> {VOLO_NAME_VALUE.identifier}</li>
        <li><strong>Namespace:</strong> {VOLO_NAME_VALUE.namespace}</li>
        <li><strong>Ref:</strong> {VOLO_NAME_VALUE.ref}</li>
        <li><strong>Base:</strong> {VOLO_NAME_VALUE.base ?? 'null'}</li>
      </ul>
      <h4>Properties:</h4>
      <ul>
        {VOLO_NAME_VALUE.properties.map((prop, idx) => (
          <li key={idx}>
            <code>{prop.name}: {prop.type}</code> (refs: {prop.refs.join(', ')})
          </li>
        ))}
      </ul>
    </div>
  );
}

// Demo of Model Classes
function ModelClassesDemo() {
  // Create sample instances
  const sampleImport = new Import({
    path: '@abpjs/core',
    keyword: eImportKeyword.Default,
    specifiers: ['RestService', 'ConfigState'],
    refs: ['RestService', 'ConfigState'],
  });

  const sampleProperty = new Property({
    name: 'id',
    type: 'string',
    optional: '?',
    refs: ['System.Guid'],
  });

  const sampleInterface = new Interface({
    base: 'EntityDto<string>',
    identifier: 'UserDto',
    namespace: 'MyApp.Users',
    ref: 'MyApp.Users.UserDto',
    properties: [
      sampleProperty,
      new Property({ name: 'userName', type: 'string', refs: ['System.String'] }),
      new Property({ name: 'email', type: 'string', refs: ['System.String'] }),
    ],
  });

  const sampleModel = new Model({
    namespace: 'MyApp.Users',
    path: 'src/proxy/users',
    imports: [sampleImport],
    interfaces: [sampleInterface],
  });

  return (
    <div className="test-card">
      <h3>Model Classes</h3>

      <h4>Import</h4>
      <pre style={{ fontSize: '0.75rem', background: '#1a1a2e', padding: '0.5rem', borderRadius: '4px' }}>
{`new Import({
  path: '${sampleImport.path}',
  keyword: eImportKeyword.${sampleImport.keyword === 'import' ? 'Default' : 'Type'},
  specifiers: ${JSON.stringify(sampleImport.specifiers)},
})`}
      </pre>

      <h4>Property</h4>
      <pre style={{ fontSize: '0.75rem', background: '#1a1a2e', padding: '0.5rem', borderRadius: '4px' }}>
{`new Property({
  name: '${sampleProperty.name}',
  type: '${sampleProperty.type}',
  optional: '${sampleProperty.optional}',
  refs: ${JSON.stringify(sampleProperty.refs)},
})`}
      </pre>

      <h4>Interface</h4>
      <p>
        <strong>{sampleInterface.identifier}</strong> extends {sampleInterface.base} with{' '}
        {sampleInterface.properties.length} properties
      </p>

      <h4>Model</h4>
      <p>
        <strong>Namespace:</strong> {sampleModel.namespace}<br />
        <strong>Path:</strong> {sampleModel.path}<br />
        <strong>Imports:</strong> {sampleModel.imports.length}<br />
        <strong>Interfaces:</strong> {sampleModel.interfaces.length}
      </p>
    </div>
  );
}

// Demo of Method Classes
function MethodClassesDemo() {
  const sampleSignature = new Signature({
    name: 'getUserById',
    generics: '<T extends UserDto>',
    modifier: eMethodModifier.Public,
    parameters: [
      new Property({ name: 'id', type: 'string', refs: ['System.Guid'] }),
    ],
    returnType: 'Observable<T>',
  });

  const sampleBody = new Body({
    method: 'GET',
    url: '/api/users/{id}',
    responseType: 'UserDto',
    requestType: 'any',
  });

  // Demonstrate registerActionParameter
  sampleBody.registerActionParameter({
    bindingSourceId: eBindingSourceId.Path,
    name: 'Id',
    nameOnMethod: 'id',
    type: 'System.Guid',
    typeSimple: 'string',
    isOptional: false,
    defaultValue: null,
    constraintTypes: null,
    descriptorName: '',
  });

  const sampleMethod = new Method({
    signature: sampleSignature,
    body: sampleBody,
  });

  return (
    <div className="test-card">
      <h3>Method Classes</h3>

      <h4>Signature</h4>
      <pre style={{ fontSize: '0.75rem', background: '#1a1a2e', padding: '0.5rem', borderRadius: '4px' }}>
{`new Signature({
  name: '${sampleSignature.name}',
  generics: '${sampleSignature.generics}',
  modifier: eMethodModifier.Public,
  returnType: '${sampleSignature.returnType}',
})`}
      </pre>

      <h4>Body with registerActionParameter</h4>
      <p>Original URL: <code>/api/users/{'{id}'}</code></p>
      <p>After registering Path parameter: <code>{sampleBody.url}</code></p>

      <h4>Method</h4>
      <p>Combines Signature and Body:</p>
      <pre style={{ fontSize: '0.75rem', background: '#1a1a2e', padding: '0.5rem', borderRadius: '4px' }}>
{`${sampleMethod.signature.modifier}${sampleMethod.signature.name}${sampleMethod.signature.generics}(id: string): ${sampleMethod.signature.returnType} {
  return this.http.${sampleMethod.body.method.toLowerCase()}('${sampleMethod.body.url}');
}`}
      </pre>
    </div>
  );
}

// Demo of Service Class
function ServiceClassDemo() {
  const sampleService = new Service({
    apiName: 'default',
    name: 'UserService',
    namespace: 'MyApp.Users',
    imports: [
      new Import({ path: '@abpjs/core', specifiers: ['RestService'] }),
      new Import({ path: './models', specifiers: ['UserDto', 'CreateUserInput'] }),
    ],
    methods: [
      new Method({
        signature: new Signature({ name: 'getList', returnType: 'Observable<PagedResultDto<UserDto>>' }),
        body: new Body({ method: 'GET', url: '/api/users', responseType: 'PagedResultDto<UserDto>' }),
      }),
      new Method({
        signature: new Signature({
          name: 'create',
          parameters: [new Property({ name: 'input', type: 'CreateUserInput' })],
          returnType: 'Observable<UserDto>',
        }),
        body: new Body({ method: 'POST', url: '/api/users', responseType: 'UserDto', requestType: 'CreateUserInput' }),
      }),
    ],
  });

  return (
    <div className="test-card">
      <h3>Service Class</h3>
      <p>Represents a generated service with imports and methods:</p>

      <h4>{sampleService.name}</h4>
      <ul>
        <li><strong>API Name:</strong> {sampleService.apiName}</li>
        <li><strong>Namespace:</strong> {sampleService.namespace}</li>
        <li><strong>Imports:</strong> {sampleService.imports.length}</li>
        <li><strong>Methods:</strong> {sampleService.methods.length}</li>
      </ul>

      <h4>Generated Methods:</h4>
      <ul>
        {sampleService.methods.map((method, idx) => (
          <li key={idx}>
            <code>
              {method.signature.name}({method.signature.parameters.map(p => `${p.name}: ${p.type}`).join(', ')}): {method.signature.returnType}
            </code>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function TestSchematicsPage() {
  return (
    <div>
      <h1>@abpjs/schematics v3.2.0</h1>
      <p>
        <Link to="/" style={{ color: '#646cff' }}>&larr; Back to Home</Link>
      </p>
      <p>
        Schematics types and utilities for code generation. This package provides types, interfaces,
        and classes for generating proxy services from ABP API definitions.
      </p>
      <p style={{ fontSize: '14px', color: '#888', marginBottom: '16px' }}>
        Version 3.2.0 - PROXY_WARNING updated with npm module publishing notice
      </p>

      <div className="test-section">
        <h2>Enums & Constants</h2>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
          <EnumDemo />
          <ConstantsDemo />
        </div>
      </div>

      <div className="test-section">
        <h2>Type Mappings</h2>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
          <SystemTypesDemo />
          <VoloNameValueDemo />
        </div>
      </div>

      <div className="test-section">
        <h2>Model Classes</h2>
        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
          <ModelClassesDemo />
          <MethodClassesDemo />
        </div>
      </div>

      <div className="test-section">
        <h2>Service Generation</h2>
        <ServiceClassDemo />
      </div>
    </div>
  );
}
