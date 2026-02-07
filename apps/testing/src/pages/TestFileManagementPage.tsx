/**
 * Test page for @abpjs/file-management package
 * Tests: Proxy services, DTOs, config, enums, constants
 * @since 3.2.0 - New package
 */
import { useState } from 'react';
import {
  // Enums
  eFileManagementComponents,
  // Config enums
  eFileManagementPolicyNames,
  eFileManagementRouteNames,
  // Config providers
  FILE_MANAGEMENT_ROUTE_PROVIDERS,
  configureRoutes,
  initializeFileManagementRoutes,
  // Proxy - Files
  FileIconType,
  fileIconTypeOptions,
  FileDescriptorService,
  // Proxy - Directories
  DirectoryDescriptorService,
  // Constants
  FILE_MANAGEMENT_ROUTE_PATH,
  FILE_MANAGEMENT_API_BASE,
} from '@abpjs/file-management';

function TestEnums() {
  return (
    <div className="test-section">
      <h2>Enums</h2>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>eFileManagementComponents <span style={{ color: '#4f4', fontSize: '12px' }}>(v3.2.0)</span></h3>
        <p>Component keys for the File Management module:</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Key</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(eFileManagementComponents).map(([key, value]) => (
              <tr key={key}>
                <td style={{ padding: '8px', fontFamily: 'monospace' }}>{key}</td>
                <td style={{ padding: '8px', fontFamily: 'monospace', color: '#888' }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>FileIconType Enum <span style={{ color: '#4f4', fontSize: '12px' }}>(v3.2.0)</span></h3>
        <p>File icon type for displaying file/folder icons:</p>
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
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>FontAwesome</td>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>{FileIconType.FontAwesome}</td>
              <td>FontAwesome icon class</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>Url</td>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>{FileIconType.Url}</td>
              <td>URL to an image</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>fileIconTypeOptions</h3>
        <p>Options array for select components:</p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px', background: 'rgba(0,0,0,0.2)' }}>
{JSON.stringify(fileIconTypeOptions, null, 2)}
        </pre>
      </div>
    </div>
  );
}

function TestConfigEnums() {
  return (
    <div className="test-section">
      <h2>Config Enums</h2>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>eFileManagementPolicyNames <span style={{ color: '#4f4', fontSize: '12px' }}>(v3.2.0)</span></h3>
        <p>Permission policy names for file management:</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Key</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(eFileManagementPolicyNames).map(([key, value]) => (
              <tr key={key}>
                <td style={{ padding: '8px', fontFamily: 'monospace' }}>{key}</td>
                <td style={{ padding: '8px', fontFamily: 'monospace', color: '#888' }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>eFileManagementRouteNames <span style={{ color: '#4f4', fontSize: '12px' }}>(v3.2.0)</span></h3>
        <p>Route name keys for file management:</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Key</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Value</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(eFileManagementRouteNames).map(([key, value]) => (
              <tr key={key}>
                <td style={{ padding: '8px', fontFamily: 'monospace' }}>{key}</td>
                <td style={{ padding: '8px', fontFamily: 'monospace', color: '#888' }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TestConfigProviders() {
  return (
    <div className="test-section">
      <h2>Config Providers</h2>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>FILE_MANAGEMENT_ROUTE_PROVIDERS <span style={{ color: '#4f4', fontSize: '12px' }}>(v3.2.0)</span></h3>
        <p>Object containing route configuration functions:</p>
        <p style={{ marginTop: '0.5rem' }}>
          <code>configureRoutes:</code>{' '}
          <code style={{ background: '#333', padding: '2px 6px', borderRadius: '4px' }}>
            {typeof FILE_MANAGEMENT_ROUTE_PROVIDERS.configureRoutes}
          </code>
        </p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px', background: 'rgba(0,0,0,0.2)', marginTop: '1rem' }}>
{`import { FILE_MANAGEMENT_ROUTE_PROVIDERS } from '@abpjs/file-management';
import { getRoutesService } from '@abpjs/core';

// Configure routes using providers object
const routes = getRoutesService();
const addRoutes = FILE_MANAGEMENT_ROUTE_PROVIDERS.configureRoutes(routes);
addRoutes();`}
        </pre>
      </div>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>configureRoutes Function <span style={{ color: '#4f4', fontSize: '12px' }}>(v3.2.0)</span></h3>
        <p>Configures the file management module routes:</p>
        <p style={{ marginTop: '0.5rem' }}>
          <code>configureRoutes:</code>{' '}
          <code style={{ background: '#333', padding: '2px 6px', borderRadius: '4px' }}>
            {typeof configureRoutes}
          </code>
        </p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px', background: 'rgba(0,0,0,0.2)', marginTop: '1rem' }}>
{`import { configureRoutes } from '@abpjs/file-management';
import { getRoutesService } from '@abpjs/core';

const routes = getRoutesService();
const addRoutes = configureRoutes(routes);
addRoutes();

// Route configuration added:
// - path: '/file-management'
// - name: 'FileManagement::Menu:FileManagement'
// - parentName: 'AbpUiNavigation::Menu:Administration'
// - layout: eLayoutType.application
// - iconClass: 'bi bi-folder'
// - order: 30
// - requiredPolicy: 'FileManagement.DirectoryDescriptor'`}
        </pre>
      </div>

      <div className="test-card" style={{ background: 'rgba(68,255,68,0.05)', border: '1px solid rgba(68,255,68,0.2)' }}>
        <h3>initializeFileManagementRoutes Helper <span style={{ color: '#4f4', fontSize: '12px' }}>(v3.2.0)</span></h3>
        <p>Convenience function that initializes file management routes using global services:</p>
        <p style={{ marginTop: '0.5rem' }}>
          <code>initializeFileManagementRoutes:</code>{' '}
          <code style={{ background: '#333', padding: '2px 6px', borderRadius: '4px' }}>
            {typeof initializeFileManagementRoutes}
          </code>
        </p>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px', background: 'rgba(0,0,0,0.2)', marginTop: '1rem' }}>
{`import { initializeFileManagementRoutes } from '@abpjs/file-management';

// In your app initialization:
initializeFileManagementRoutes();`}
        </pre>
      </div>
    </div>
  );
}

function TestConstants() {
  return (
    <div className="test-section">
      <h2>Constants</h2>

      <div className="test-card">
        <h3>Route and API Constants</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Constant</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Value</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>FILE_MANAGEMENT_ROUTE_PATH</td>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>{FILE_MANAGEMENT_ROUTE_PATH}</td>
              <td>Default route path for file management page</td>
            </tr>
            <tr>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>FILE_MANAGEMENT_API_BASE</td>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>{FILE_MANAGEMENT_API_BASE}</td>
              <td>Base API path for file management endpoints</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TestProxyServices() {
  const [serviceInfo, setServiceInfo] = useState<string>('');

  const showFileDescriptorService = () => {
    setServiceInfo(`FileDescriptorService (v3.2.0)

Properties:
- apiName: string (default: 'default')

Methods:
- create(input: CreateFileInput): Promise<FileDescriptorDto>
- delete(id: string): Promise<void>
- get(id: string): Promise<FileDescriptorDto>
- getContent(id: string): Promise<number[]>
- getList(directoryId: string): Promise<ListResultDto<FileDescriptorDto>>
- getPreInfo(input: FileUploadPreInfoRequest[]): Promise<FileUploadPreInfoDto[]>
- move(input: MoveFileInput): Promise<FileDescriptorDto>
- rename(id: string, input: RenameFileInput): Promise<FileDescriptorDto>

Usage:
const service = new FileDescriptorService(restService);

// Get a file by ID
const file = await service.get('file-id');

// Get files in a directory
const files = await service.getList('directory-id');

// Upload pre-check
const preInfo = await service.getPreInfo([{
  directoryId: 'dir-id',
  fileName: 'document.pdf',
  size: 1024,
}]);

// Move file
await service.move({ id: 'file-id', newDirectoryId: 'target-dir' });

// Rename file
await service.rename('file-id', { name: 'new-name.txt' });`);
  };

  const showDirectoryDescriptorService = () => {
    setServiceInfo(`DirectoryDescriptorService (v3.2.0)

Properties:
- apiName: string (default: 'default')

Methods:
- create(input: CreateDirectoryInput): Promise<DirectoryDescriptorDto>
- delete(id: string): Promise<void>
- get(id: string): Promise<DirectoryDescriptorDto>
- getContent(input: DirectoryContentRequestInput): Promise<PagedResultDto<DirectoryContentDto>>
- getList(parentId: string): Promise<ListResultDto<DirectoryDescriptorInfoDto>>
- move(input: MoveDirectoryInput): Promise<DirectoryDescriptorDto>
- rename(id: string, input: RenameDirectoryInput): Promise<DirectoryDescriptorDto>

Usage:
const service = new DirectoryDescriptorService(restService);

// Create a new directory
const newDir = await service.create({
  name: 'Documents',
  parentId: null,
});

// Get directory content (files and subdirectories)
const content = await service.getContent({
  filter: '',
  sorting: 'name asc',
  id: 'parent-dir-id',
});

// Get subdirectories for tree view
const children = await service.getList('parent-dir-id');

// Move directory
await service.move({ id: 'dir-id', newParentId: 'target-dir' });

// Rename directory
await service.rename('dir-id', { name: 'New Name' });`);
  };

  return (
    <div className="test-section">
      <h2>Proxy Services</h2>

      <div className="test-card">
        <h3>Service Overview</h3>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={showFileDescriptorService}>FileDescriptorService</button>
          <button onClick={showDirectoryDescriptorService}>DirectoryDescriptorService</button>
        </div>
        {serviceInfo && (
          <pre style={{ marginTop: '1rem', padding: '1rem', borderRadius: '4px', overflow: 'auto', whiteSpace: 'pre-wrap', fontSize: '12px', background: 'rgba(0,0,0,0.2)' }}>
            {serviceInfo}
          </pre>
        )}
      </div>

      <div className="test-card">
        <h3>Service Classes</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Service</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '8px' }}>FileDescriptorService</td>
              <td style={{ padding: '8px' }}>{typeof FileDescriptorService}</td>
              <td>CRUD operations for files</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}>DirectoryDescriptorService</td>
              <td style={{ padding: '8px' }}>{typeof DirectoryDescriptorService}</td>
              <td>CRUD operations for directories</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TestModels() {
  return (
    <div className="test-section">
      <h2>Models</h2>

      <div className="test-card">
        <h3>File Models</h3>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px', background: 'rgba(0,0,0,0.2)' }}>
{`// FileDescriptorDto - File information
interface FileDescriptorDto extends AuditedEntityDto<string> {
  directoryId?: string;  // null for root
  name: string;
  mimeType: string;
  size: number;
}

// CreateFileInput - Create new file
interface CreateFileInput {
  directoryId?: string;
  name: string;
  mimeType: string;
  content: number[];  // byte array
}

// FileIconInfo - Icon display information
interface FileIconInfo {
  icon: string;  // FontAwesome class or URL
  type: FileIconType;  // FontAwesome=0, Url=1
}

// FileUploadPreInfoRequest - Pre-upload check
interface FileUploadPreInfoRequest {
  directoryId?: string;
  fileName: string;
  size: number;
}

// FileUploadPreInfoDto - Pre-upload result
interface FileUploadPreInfoDto {
  fileName: string;
  doesExist: boolean;
  hasValidName: boolean;
}

// MoveFileInput / RenameFileInput
interface MoveFileInput {
  id: string;
  newDirectoryId?: string;
}

interface RenameFileInput {
  name: string;
}`}
        </pre>
      </div>

      <div className="test-card">
        <h3>Directory Models</h3>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px', background: 'rgba(0,0,0,0.2)' }}>
{`// DirectoryDescriptorDto - Directory information
interface DirectoryDescriptorDto extends AuditedEntityDto<string> {
  name: string;
  parentId?: string;  // null for root
}

// DirectoryDescriptorInfoDto - For tree view
interface DirectoryDescriptorInfoDto {
  id: string;
  name: string;
  parentId?: string;
  hasChildren: boolean;
}

// DirectoryContentDto - Files and folders in directory
interface DirectoryContentDto {
  name: string;
  isDirectory: boolean;
  id: string;
  size: number;  // 0 for directories
  iconInfo: FileIconInfo;
}

// DirectoryContentRequestInput - Query content
interface DirectoryContentRequestInput {
  filter: string;
  sorting: string;  // e.g., "name asc", "size desc"
  id?: string;  // directory ID, null for root
}

// CreateDirectoryInput
interface CreateDirectoryInput {
  parentId?: string;
  name: string;
}

// MoveDirectoryInput / RenameDirectoryInput
interface MoveDirectoryInput {
  id: string;
  newParentId?: string;
}

interface RenameDirectoryInput {
  name: string;
}`}
        </pre>
      </div>

      <div className="test-card">
        <h3>Common Types</h3>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px', background: 'rgba(0,0,0,0.2)' }}>
{`// FolderInfo / FileInfo - Basic info subset
type FolderInfo = Pick<DirectoryContentDto, 'name' | 'id'>;
type FileInfo = FolderInfo;

// Example usage:
const folderInfo: FolderInfo = {
  name: 'Documents',
  id: 'folder-123',
};`}
        </pre>
      </div>

      <div className="test-card">
        <h3>Config Options</h3>
        <pre style={{ padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '12px', background: 'rgba(0,0,0,0.2)' }}>
{`// FileManagementConfigOptions - Module configuration
interface FileManagementConfigOptions {
  entityActionContributors?: FileManagementEntityActionContributors;
  entityPropContributors?: FileManagementEntityPropContributors;
  toolbarActionContributors?: FileManagementToolbarActionContributors;  // v3.2.0
}

// Example: Adding custom actions
const options: FileManagementConfigOptions = {
  entityActionContributors: {
    [eFileManagementComponents.FolderContent]: [
      (actions) => {
        actions.push({
          text: 'Custom Action',
          action: (record) => console.log('Action on:', record.name),
          permission: 'MyPermission',
          icon: 'fa-custom',
        });
      },
    ],
  },
  toolbarActionContributors: {
    [eFileManagementComponents.FolderContent]: [
      (actions) => {
        actions.push({
          text: 'Bulk Export',
          action: (data) => console.log('Exporting', data.length, 'items'),
        });
      },
    ],
  },
};`}
        </pre>
      </div>
    </div>
  );
}

function TestAPIEndpoints() {
  return (
    <div className="test-section">
      <h2>API Endpoints</h2>

      <div className="test-card">
        <h3>File Descriptor Endpoints</h3>
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
              <td style={{ padding: '8px' }}>POST</td>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>/api/file-management/file-descriptor</td>
              <td>Create file</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}>GET</td>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>/api/file-management/file-descriptor/:id</td>
              <td>Get file</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}>DELETE</td>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>/api/file-management/file-descriptor/:id</td>
              <td>Delete file</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}>GET</td>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>/api/file-management/file-descriptor/:id/content</td>
              <td>Get file content</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}>GET</td>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>/api/file-management/file-descriptor</td>
              <td>List files in directory</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}>POST</td>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>/api/file-management/file-descriptor/pre-upload-info</td>
              <td>Pre-upload check</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}>POST</td>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>/api/file-management/file-descriptor/move</td>
              <td>Move file</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}>POST</td>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>/api/file-management/file-descriptor/:id/rename</td>
              <td>Rename file</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="test-card">
        <h3>Directory Descriptor Endpoints</h3>
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
              <td style={{ padding: '8px' }}>POST</td>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>/api/file-management/directory-descriptor</td>
              <td>Create directory</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}>GET</td>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>/api/file-management/directory-descriptor/:id</td>
              <td>Get directory</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}>DELETE</td>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>/api/file-management/directory-descriptor/:id</td>
              <td>Delete directory</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}>GET</td>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>/api/file-management/directory-descriptor</td>
              <td>List subdirectories</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}>GET</td>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>/api/file-management/directory-descriptor/content</td>
              <td>Get directory content</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}>POST</td>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>/api/file-management/directory-descriptor/move</td>
              <td>Move directory</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}>POST</td>
              <td style={{ padding: '8px', fontFamily: 'monospace' }}>/api/file-management/directory-descriptor/:id/rename</td>
              <td>Rename directory</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TestAPISummary() {
  return (
    <div className="test-section">
      <h2>Complete API Summary</h2>

      <div className="test-card">
        <h3>Package Exports</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #333' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Category</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Export</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Type</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }} rowSpan={3}>Enums</td>
              <td style={{ padding: '8px' }}>eFileManagementComponents</td>
              <td>const object</td>
            </tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>FileIconType</td>
              <td>enum</td>
            </tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>fileIconTypeOptions</td>
              <td>const array</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }} rowSpan={2}>Config Enums</td>
              <td style={{ padding: '8px' }}>eFileManagementPolicyNames</td>
              <td>const object</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}>eFileManagementRouteNames</td>
              <td>const object</td>
            </tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }} rowSpan={3}>Config Providers</td>
              <td style={{ padding: '8px' }}>FILE_MANAGEMENT_ROUTE_PROVIDERS</td>
              <td>object</td>
            </tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>configureRoutes</td>
              <td>function</td>
            </tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>initializeFileManagementRoutes</td>
              <td>function</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }} rowSpan={2}>Proxy Services</td>
              <td style={{ padding: '8px' }}>FileDescriptorService</td>
              <td>class</td>
            </tr>
            <tr>
              <td style={{ padding: '8px' }}>DirectoryDescriptorService</td>
              <td>class</td>
            </tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }} rowSpan={2}>Constants</td>
              <td style={{ padding: '8px' }}>FILE_MANAGEMENT_ROUTE_PATH</td>
              <td>string</td>
            </tr>
            <tr style={{ background: 'rgba(68,255,68,0.05)' }}>
              <td style={{ padding: '8px' }}>FILE_MANAGEMENT_API_BASE</td>
              <td>string</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function TestFileManagementPage() {
  return (
    <div>
      <h1>@abpjs/file-management Tests (v3.2.0)</h1>
      <p style={{ marginBottom: '8px' }}>Testing file management proxy services, DTOs, config, and enums.</p>
      <p style={{ fontSize: '14px', color: '#4f4', marginBottom: '16px' }}>
        Version 3.2.0 - Initial release with full proxy subpackage
      </p>

      <TestAPISummary />
      <TestEnums />
      <TestConfigEnums />
      <TestConfigProviders />
      <TestConstants />
      <TestProxyServices />
      <TestModels />
      <TestAPIEndpoints />
    </div>
  );
}

export default TestFileManagementPage;
